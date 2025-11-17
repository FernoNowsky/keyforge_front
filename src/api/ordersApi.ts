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

export interface OrdersStatsRevenueRequest {
    fromDate: Date
    toDate: Date;
}

export interface OrdersStatsRevenueResponse {
    date: Date
    revenue: number;
}

export interface OrdersStatsAmountResponse {
    date: Date
    amount: number;
}

export const OrdersApi = {
    getAll: (params?: PaginationDto) =>
        apiRequest<OrdersResponse>("/orders", { params }),

    getById: (id: number) =>
        apiRequest<Order>(`/orders/${id}`),

    getByUserId: (userId?: string, params?: PaginationDto) =>
        apiRequest<PaginatedResponse<OrdersResponse>>(`/orders?userId=${userId}&sortBy=id&sortDirection=DESC`, {params}),

    create: (data: CreateOrderRequest) => {
        const obj = {items: data.products};
        return apiRequest<OrderResponse>("/orders", { method: "post", data: obj});
    },

    setReviewed: (data: SetReviewedRequest) => {
        const obj = {orderId: data.orderId};
        return apiRequest<OrderResponse>(`/orders/${data.orderId}/reviewed`, { method: "PUT", data: obj});
    },

    updateOrderById: (data: UpdateOrderRequest) => {
        const obj = {status: data.status}
        return apiRequest<Order>(`/orders/${data.orderId}`, {method: "PUT", data: obj})
    },

    getRevenueStats: (data: OrdersStatsRevenueRequest) => {
      return apiRequest<OrdersStatsRevenueResponse[]>(`orders/stats/revenue`, {
          params: {
            fromDate: data.fromDate.toISOString().split("T")[0],
            toDate: data.toDate.toISOString().split("T")[0]
        },
      })
    },

    getOrdersAmountStats: (data: OrdersStatsRevenueRequest) => {
        return apiRequest<OrdersStatsAmountResponse[]>(`orders/stats/amount`, {
            params: {
                fromDate: data.fromDate.toISOString().split("T")[0],
                toDate: data.toDate.toISOString().split("T")[0]
            },
        })
    },

    getRevenueStatsToday: () => {
        return apiRequest<number>(`orders/stats/revenue/today`)
    },

    getOrdersAmountStatsToday: () => {
        return apiRequest<number>(`orders/stats/amount/today`)
    },
};
