import { apiRequest } from "@/lib/apiRequest";
import type { PaginationDto } from "@/lib/apiRequest";
import type { ProductType } from "@/api/types/product.types";
import type { PaginatedResponse } from "@/api/types/common.types";

export const ProductTypeApi = {
    getAll: (params?: PaginationDto) =>
        apiRequest<PaginatedResponse<ProductType>>("/types", { params }),
};
