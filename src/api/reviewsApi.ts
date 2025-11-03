import { apiRequest, type PaginationDto } from "@/lib/apiRequest";
import type { PaginatedResponse } from "./types/common.types";

export interface Review {
  id: number
  productId: number
  userId: number
  content: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  rating: number
  createdAt: Date
  updatedAt: Date
}

export const ReviewsAPI = {

    getByProductId: (productId: number) =>
        apiRequest<PaginatedResponse<Review>>(`/reviews?productId=${productId}&status=APPROVED`),

    getByUserId: (userId: number, params?: PaginationDto) =>
        apiRequest<PaginatedResponse<Review>>(`reviews?userId=${userId}`, {params}),
};
