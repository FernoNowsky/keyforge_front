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

export interface DetailedProduct extends Product {
  releaseDate: string;
  descriptionPl: string;
  descriptionEn: string;
  visible: boolean;
  deleted: null | string;
  producent: Producent;
  type: ProductType;
  categories: Category[];
}
