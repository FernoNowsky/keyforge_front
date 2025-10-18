import { apiRequest } from "@/lib/apiRequest";
import type { PaginationDto } from "@/lib/apiRequest";
import type { Product } from "@/api/types/product.types";
import type { PaginatedResponse } from "@/api/types/common.types";

export const ProductsApi = {
    getAll: (params?: PaginationDto) =>
        apiRequest<PaginatedResponse<Product>>("/products", { params }),

    getById: (id: number) =>
        apiRequest<Product>(`/products/${id}`),
};
