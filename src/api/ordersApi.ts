import { apiRequest } from "@/lib/apiRequest";
import type { PaginationDto } from "@/lib/apiRequest";

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
  hasReview?: boolean
}

export type OrderResponse = {
  orderId: number
  paymentId: string
  paymentUrl: string
}

export interface OrdersResponse {
  content: Order[]
}

export interface CreateOrderRequest {
    userId?: number; // User id is not required, we will get it from token on backend which should be sent in headers
    products: { productId: number; quantity: number }[];
}

export const OrdersApi = {
    getAll: (params?: PaginationDto) =>
        apiRequest<OrdersResponse>("/orders", { params }),

    getById: (id: number) =>
        apiRequest<Order>(`/orders/${id}`),

    getByUserId: (userId: number) =>
        // TODO: for now sorting by id and desc to get the newest. maybe add this to params, not in api structure
        apiRequest<OrdersResponse>(`/orders?userId=${userId}&sortBy=id&sortDirection=DESC`),

    create: (data: CreateOrderRequest) => {
        const obj = {items: data.products}; //TODO: adjust to backend dto
        return apiRequest<OrderResponse>("/orders", { method: "post", data: obj });
    }
};
