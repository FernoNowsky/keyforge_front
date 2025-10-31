import { apiRequest } from "@/lib/apiRequest";
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
        apiRequest<PaginatedResponse<Review>>(`/reviews?productId=${productId}`),
};
