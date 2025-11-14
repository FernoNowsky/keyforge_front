import { apiRequest } from "@/lib/apiRequest";
import type { PaginationDto } from "@/lib/apiRequest";
import type {DetailedProduct, Product, UpdateProductRequest} from "@/api/types/product.types";
import type { PaginatedResponse } from "@/api/types/common.types";

export const ProductsApi = {
    getAll: (params?: PaginationDto) =>
        apiRequest<PaginatedResponse<Product>>("/products", { params, requiresAuth: false  }),

    getAllDetailed: (params?: PaginationDto, isAdmin?: boolean) =>
        apiRequest<PaginatedResponse<DetailedProduct>>("/products", { params, requiresAuth: false, requiresAdmin: isAdmin }),

    getNewest: (params?: PaginationDto) =>
    apiRequest<PaginatedResponse<Product>>("/products", { 
        params: {
            ...params, 
            sortBy: 'releaseDate',
            sortDirection: 'DESC',
            size: 4,
        },
        requiresAuth: false
    }),

    create: (data: UpdateProductRequest) => 
        apiRequest<DetailedProduct>(`/products`, { method: "POST", data: data}),

    updateById: (id: number, data: UpdateProductRequest) => {
        return apiRequest<DetailedProduct>(`/products/${id}`, { method: "PUT", data: data})
    },

    setVisible: (id: number) =>
        apiRequest<DetailedProduct>(`/products/${id}/visible`, { method: "PUT" }),

    setDeleted: (id: number) =>
        apiRequest<DetailedProduct>(`/products/${id}`, { method: "DELETE" }),

    getById: (id: number) =>
        apiRequest<DetailedProduct>(`/products/${id}`, {requiresAuth: false}),

    getByIds: (ids: number[], onlyAvailable: boolean) =>
    apiRequest<Product[]>('/products/specific', {
      params: {
        productIds: ids.join(','),
        onlyAvailable: onlyAvailable.toString(),
        requiresAuth: false
      },
    }),
};
