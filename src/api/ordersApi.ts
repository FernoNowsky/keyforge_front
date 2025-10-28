import { apiRequest } from "@/lib/apiRequest";
import type { PaginationDto } from "@/lib/apiRequest";

export interface Order {
    id: number;
    date: string;
    total: number;
    userId: number;
}

export interface CreateOrderRequest {
    userId?: number; // User id is not required, we will get it from token on backend which should be sent in headers
    products: { productId: number; quantity: number }[];
}

export const OrdersApi = {
    getAll: (params?: PaginationDto) =>
        apiRequest<{ content: Order[] }>("/orders", { params }),

    getById: (id: number) =>
        apiRequest<Order>(`/orders/${id}`),

    create: (data: CreateOrderRequest) => {
        const obj = {items: data.products}; //TODO: adjust to backend dto
        return apiRequest<Order>("/orders", { method: "post", data: obj });
    }
};
