export interface PaginatedResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

export interface FilterParams {
    page: number;
    size?: number;
    sortDirection?: "ASC" | "DESC";
    platformIds?: string[];
    typeIds?: string[];
    categoryIds?: string[];
    priceMin?: number;
    priceMax?: number;
}