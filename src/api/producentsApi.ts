import { apiRequest } from "@/lib/apiRequest";
import type { PaginationDto } from "@/lib/apiRequest";
import type { Producent } from "@/api/types/product.types";
import type { PaginatedResponse } from "@/api/types/common.types";

export const ProducentsApi = {
    getAll: (params?: PaginationDto) =>
        apiRequest<PaginatedResponse<Producent>>("/producents", { params, requiresAuth: false}),
};
