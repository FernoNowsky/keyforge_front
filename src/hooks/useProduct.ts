import { useCallback, useEffect, useState } from "react";
import { ProductsApi } from "@/api/productsApi";
import type { DetailedProduct } from "@/api/types/product.types";

export function useProduct(productId?: number) {
    const [product, setProduct] = useState<DetailedProduct | undefined>();
    const [isLoading, setIsLoading] = useState(true);

    const loadProduct = useCallback(async () => {
        if (!productId) return;
        try {
            const productData = await ProductsApi.getById(productId);
            setProduct(productData);
        } catch (error) {
            console.error("Błąd podczas pobierania produktu:", error);
        } finally {
            setIsLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        loadProduct();
    }, [loadProduct]);

    return { product, isLoading };
}
