import { apiRequest } from "@/lib/apiRequest";
import type { PaginationDto } from "@/lib/apiRequest";

export interface Order {
    id: number;
    date: string;
    total: number;
    userId: number;
}

export interface CreateOrderRequest {
    userId: number;
    products: { productId: number; quantity: number }[];
}

export const OrdersApi = {
    getAll: (params?: PaginationDto) =>
        apiRequest<{ content: Order[] }>("/orders", { params }),

    getById: (id: number) =>
        apiRequest<Order>(`/orders/${id}`),

    create: (data: CreateOrderRequest) =>
        apiRequest<Order>("/orders", { method: "post", data }),
};
