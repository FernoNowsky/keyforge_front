import { apiRequest } from "@/lib/apiRequest";
import type { PaginationDto } from "@/lib/apiRequest";
import type { Platform } from "@/api/types/product.types";
import type { PaginatedResponse } from "@/api/types/common.types";

export const PlatformsApi = {
    getAll: (params?: PaginationDto) =>
        apiRequest<PaginatedResponse<Platform>>("/platforms", { params }),
};
