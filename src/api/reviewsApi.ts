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

export interface AISummaryReview {
    id: string
    productId: number
    content: string
    avgRating: number
    updatedAt: Date
}

export interface ReviewCreateDto {
  productId: number;
  userId: number;
  rating: number;
  content: string;
  valid: boolean;
}

export interface ReviewsCreateResponse {
  content: Review[];
  totalElements: number;
}

export const ReviewsAPI = {

    getByProductId: (productId: number) =>
        apiRequest<PaginatedResponse<Review>>(`/reviews?productId=${productId}&status=APPROVED`, {requiresAuth: false}),

    getByUserId: (userId: number, params?: PaginationDto) =>
        apiRequest<PaginatedResponse<Review>>(`reviews?userId=${userId}`, {params}),

    getAISummary: (productId: number) =>
        apiRequest<AISummaryReview>(`reviews/main/product/${productId}`, {requiresAuth: false}),

    createReview: (review: ReviewCreateDto) =>
        apiRequest<PaginatedResponse<ReviewsCreateResponse>>('reviews', {method: 'POST', data: review})
};
