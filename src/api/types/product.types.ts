export interface Platform {
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
}
