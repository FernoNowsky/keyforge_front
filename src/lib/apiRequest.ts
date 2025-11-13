import { $axios } from "@/api/client";
import type { AxiosRequestConfig, Method } from "axios";

const ORDER_SERVICE_URL =
    import.meta.env.VITE_ORDER_SERVICE_URL || "http://localhost:8090/order-service";
const PRODUCT_SERVICE_URL =
    import.meta.env.VITE_PRODUCT_SERVICE_URL || "http://localhost:8090/product-service";
const REVIEW_SERVICE_URL =
    import.meta.env.VITE_REVIEW_SERVICE_URL || "http://localhost:8090/review-service";
const USER_SERVICE_URL =
    import.meta.env.VITE_USER_SERVICE_URL || "http://localhost:8090/user-service";  
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
}

/**
 * Uniwersalne API wywołujące odpowiedni mikroserwis w zależności od ścieżki.
 */
export async function apiRequest<T = unknown>(
    path: string,
    { params = {}, method = "get", data, requiresAuth = true}: ApiRequestOptions = {}
): Promise<T> {
    let baseUrl: string;

    if (path.includes("orders")) {
        baseUrl = ORDER_SERVICE_URL;
    } else if (
        ["products", "categories", "types", "producents", "platforms"].some((segment) =>
            path.includes(segment)
        )
    ) {
        baseUrl = PRODUCT_SERVICE_URL;
    } else if (path.includes("reviews")) {
        baseUrl = REVIEW_SERVICE_URL;
    } else if (path.includes("users")) {
        baseUrl = USER_SERVICE_URL;
    }else {
        baseUrl = $axios.defaults.baseURL || "http://localhost:8090";
    }

    const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

    const config: AxiosRequestConfig = {
        url,
        method,
        params,
        data,
        headers: {
            ...($axios.defaults.headers.common),
            'X-Requires-Auth': requiresAuth.toString()
        }
    };

    const response = await $axios.request<T>(config);
    return response.data;
}
