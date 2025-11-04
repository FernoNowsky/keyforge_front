import { apiRequest } from "@/lib/apiRequest";
import type { PaginationDto } from "@/lib/apiRequest";
import type { PaginatedResponse } from "./types/common.types";

export interface OrderItem {
  id: number
  productId: number
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface Order {
  id: number
  userId: number
  paymentId: string
  status: 'READY_FOR_PAYMENT' | 'PAID' | 'COMPLETED' | 'CANCELLED' | 'PAYMENT_FAILED'
  totalPrice: number
  createdAt: string
  orderItems: OrderItem[]
  reviewed?: boolean
}

export type OrderResponse = {
  orderId: number
  paymentId: string
  paymentUrl: string
}

export type OrderStatus = "READY_FOR_PAYMENT" | "PAID" | "COMPLETED" | "CANCELLED" | "PAYMENT_FAILED";

export interface OrdersResponse {
  content: Order[]
}

export interface CreateOrderRequest {
    userId?: number; // User id is not required, we will get it from token on backend which should be sent in headers
    products: { productId: number; quantity: number }[];
}

export interface SetReviewedRequest {
  orderId: number;
}

export interface UpdateOrderRequest {
  orderId: number;
  status: OrderStatus;
}

export const OrdersApi = {
    getAll: (params?: PaginationDto) =>
        apiRequest<OrdersResponse>("/orders", { params }),

    getById: (id: number) =>
        apiRequest<Order>(`/orders/${id}`),

    getByUserId: (userId: number, params?: PaginationDto) =>
        // TODO: for now sorting by id and desc to get the newest. maybe add this to params, not in api structure
        apiRequest<PaginatedResponse<OrdersResponse>>(`/orders?userId=${userId}&sortBy=id&sortDirection=DESC`, {params}),

    create: (data: CreateOrderRequest) => {
        const obj = {items: data.products}; //TODO: adjust to backend dto
        return apiRequest<OrderResponse>("/orders", { method: "post", data: obj });
    },

    setReviewed: (data: SetReviewedRequest) => {
        const obj = {orderId: data.orderId};
        return apiRequest<OrderResponse>(`/orders/${data.orderId}/reviewed`, { method: "PUT", data: obj });
    },

    updateOrderById: (data: UpdateOrderRequest) => {
        const obj = {status: data.status}
        return apiRequest<Order>(`/orders/${data.orderId}`, {method: "PUT", data: obj})
    }
};
