import { apiRequest } from "@/lib/apiRequest";
import type { PaginationDto } from "@/lib/apiRequest";
import type {DetailedProduct, Product, UpdateProductRequest} from "@/api/types/product.types";
import type { PaginatedResponse } from "@/api/types/common.types";

export const ProductsApi = {
    getAll: (params?: PaginationDto) =>
        apiRequest<PaginatedResponse<Product>>("/products", { params }),

    getNewest: (params?: PaginationDto) =>
    apiRequest<PaginatedResponse<Product>>("/products", { 
        params: {
            ...params, 
            sortBy: 'releaseDate',
            sortDirection: 'DESC',
            size: 4,
        } 
    }),

    updateById: (id: number, data: UpdateProductRequest) => {
        return apiRequest<DetailedProduct>(`/products/${id}`, { method: "PUT", data: data})
    },

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
