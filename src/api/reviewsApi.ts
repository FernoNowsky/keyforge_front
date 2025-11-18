import { apiRequest, type PaginationDto } from "@/lib/apiRequest";
import type { PaginatedResponse } from "./types/common.types";

export interface Review {
  id: number
  productId: number
  userId: string
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
  userId: string | undefined;
  rating: number;
  content: string;
  valid: boolean;
}

export interface ReviewsCreateResponse {
  content: Review[];
  totalElements: number;
}

export interface UpdateReviewResponse {
  status: "PENDING" | "APPROVED" | "REJECTED",
  refreshMainReviewProduct: boolean
}

export const ReviewsAPI = {

    getByProductId: (productId: number, params?: PaginationDto) =>
        apiRequest<PaginatedResponse<Review>>(`/reviews?productId=${productId}&status=APPROVED`, {requiresAuth: false, params}),

    getAll: (params?: PaginationDto) =>
        apiRequest<PaginatedResponse<Review>>(`/reviews`, {params}),

    getByUserId: (userId?: string, params?: PaginationDto) =>
        apiRequest<PaginatedResponse<Review>>(`reviews?userId=${userId}`, {params}),

    getAISummary: (productId: number) =>
        apiRequest<AISummaryReview>(`reviews/main/product/${productId}`, {requiresAuth: false}),

    createReview: (review: ReviewCreateDto) =>
        apiRequest<PaginatedResponse<ReviewsCreateResponse>>('reviews', {method: 'POST', data: review}),

    refreshAISummary: (productId: number) =>
        apiRequest(`reviews/main/product/regenerate/${productId}`, {method: 'POST'}),

    updateReviewStatus: (reviewId: number, data: UpdateReviewResponse) =>
        apiRequest(`reviews/status/${reviewId}`, {method: "PUT", data: data})
};
