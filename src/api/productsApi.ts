import { apiRequest } from "@/lib/apiRequest";
import type { PaginationDto } from "@/lib/apiRequest";
import type { DetailedProduct, Product } from "@/api/types/product.types";
import type { PaginatedResponse } from "@/api/types/common.types";

export const ProductsApi = {
    getAll: (params?: PaginationDto) =>
        apiRequest<PaginatedResponse<Product>>("/products", { params }),

    getById: (id: number) =>
        apiRequest<DetailedProduct>(`/products/${id}`),

    getByIds: (ids: number[], onlyAvailable: boolean) =>
    apiRequest<Product[]>('/products/specific', {
      params: {
        productIds: ids.join(','),
        onlyAvailable: onlyAvailable.toString(),
      },
    }),
};
