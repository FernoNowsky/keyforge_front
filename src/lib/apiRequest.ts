import { $axios } from "@/api/client";
import type { AxiosRequestConfig, Method } from "axios";

const ORDER_SERVICE_URL =
    import.meta.env.VITE_ORDER_SERVICE_URL || "/order-service";
const PRODUCT_SERVICE_URL =
    import.meta.env.VITE_PRODUCT_SERVICE_URL || "/product-service";
const REVIEW_SERVICE_URL =
    import.meta.env.VITE_REVIEW_SERVICE_URL || "/review-service";
const USER_SERVICE_URL =
    import.meta.env.VITE_USER_SERVICE_URL || "/user-service";  
export interface PaginationDto {
    page?: number;
    size?: number;
    filter?: string;
    sortBy?: string;
    sortDirection?: "ASC" | "DESC";
}

export interface ApiRequestOptions {
    params?: Record<string, unknown> | PaginationDto;
    method?: Method;
    data?: unknown;
    requiresAuth?: boolean;
    requiresAdmin?: boolean;
}

/**
 * Uniwersalne API wywołujące odpowiedni mikroserwis w zależności od ścieżki.
 */
export async function apiRequest<T = unknown>(
    path: string,
    { params = {}, method = "get", data, requiresAuth = true, requiresAdmin = false}: ApiRequestOptions = {}
): Promise<T> {
    let servicePath: string;

    if (path.includes("orders")) {
        servicePath = ORDER_SERVICE_URL;
    } else if (
        ["products", "categories", "types", "producents", "platforms"].some((segment) =>
            path.includes(segment)
        )
    ) {
        servicePath = PRODUCT_SERVICE_URL;
    } else if (path.includes("reviews")) {
        servicePath = REVIEW_SERVICE_URL;
    } else if (path.includes("users")) {
        servicePath = USER_SERVICE_URL;
    } else {
        servicePath = "";
    }

    // Use relative path for axios to work with baseURL properly
    const url = `${servicePath}${path.startsWith("/") ? path : `/${path}`}`;

    const config: AxiosRequestConfig = {
        url,
        method,
        params,
        data,
        headers: {
            ...($axios.defaults.headers.common),
            'X-Requires-Auth': requiresAuth.toString(),
            'X-Requires-Admin': requiresAdmin.toString()
        }
    };

    const response = await $axios.request<T>(config);
    return response.data;
}
