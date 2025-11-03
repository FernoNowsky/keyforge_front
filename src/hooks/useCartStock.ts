import { useEffect, useState } from "react";
import type { DetailedProduct } from "@/api/types/product.types";
import type { CartItem } from "@/components/GameCard";

export function useCartStock(product?: DetailedProduct) {
    const [availableStock, setAvailableStock] = useState(0);
    const [maxAdded, setMaxAdded] = useState(false);

    const getCartQuantity = (productId: number): number => {
        const cartData = localStorage.getItem("gameCart");
        if (!cartData) return 0;
        try {
            const cart = JSON.parse(cartData);
            const item = cart.find((item: CartItem) => item.id === productId);
            return item ? item.quantity : 0;
        } catch {
            return 0;
        }
    };

    useEffect(() => {
        if (!product) return;
        const qtyInCart = getCartQuantity(product.id);
        const stock = Math.max(product.stock - qtyInCart, 0);
        setAvailableStock(stock);
        setMaxAdded(qtyInCart >= product.stock);
    }, [product]);

    useEffect(() => {
        const handleCartUpdate = () => {
            if (!product) return;
            const qty = getCartQuantity(product.id);
            setAvailableStock(Math.max(product.stock - qty, 0));
            setMaxAdded(qty >= product.stock);
        };
        window.addEventListener("cartUpdated", handleCartUpdate);
        window.addEventListener("storage", handleCartUpdate);
        return () => {
            window.removeEventListener("cartUpdated", handleCartUpdate);
            window.removeEventListener("storage", handleCartUpdate);
        };
    }, [product]);

    return { availableStock, maxAdded, setAvailableStock, setMaxAdded, getCartQuantity };
}
