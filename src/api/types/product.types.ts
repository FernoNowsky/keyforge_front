export interface Platform {
    id: number;
    name: string;
}

export interface Producent {
    id: number;
    name: string;
}

export interface Category {
    id: number;
    name: string;
}

export interface ProductType {
    id: number;
    name: string;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    logoId: string;
    platform: Platform;
    stock: number;
    discountPercentage: number;
}
