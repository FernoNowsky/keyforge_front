import { apiRequest } from "@/lib/apiRequest";
import type { PaginationDto } from "@/lib/apiRequest";
import type { Category } from "@/api/types/product.types";
import type { PaginatedResponse } from "@/api/types/common.types";

export const CategoriesApi = {
    getAll: (params?: PaginationDto) =>
        apiRequest<PaginatedResponse<Category>>("/categories", { params }),
};
