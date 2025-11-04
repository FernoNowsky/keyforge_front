import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import type { DetailedProduct } from "@/api/types/product.types";
import type { CartItem } from "@/components/GameCard";
import { useEffect, useState } from "react";

interface CartStock {
    availableStock: number;
    maxAdded: boolean;
    setAvailableStock: (v: number) => void;
    setMaxAdded: (v: boolean) => void;
    getCartQuantity: (id: number) => number;
}

interface Props {
    product: DetailedProduct;
    cartStock: CartStock;
}

export const ProductSidebar = ({ product, cartStock }: Props) => {
    const { availableStock, maxAdded, setAvailableStock, setMaxAdded, getCartQuantity } =
        cartStock;

    const [buttonDisabled, setButtonDisabled] = useState(false);

    const discountedPrice = product.price * (1 - product.discountPercentage / 100);

    useEffect(() => {
        const cartData = localStorage.getItem("gameCart");
        if (!cartData) return;

        const cart = JSON.parse(cartData) as CartItem[];
        const itemIndex = cart.findIndex((i) => i.id === product.id);

        if (itemIndex !== -1) {
            const item = cart[itemIndex];

            if (product.stock === 0) {
                cart.splice(itemIndex, 1);
                localStorage.setItem("gameCart", JSON.stringify(cart));
                window.dispatchEvent(new Event("cartUpdated"));
                toast.info(`Produkt ${product.name} został usunięty z koszyka, ponieważ jest niedostępny w magazynie.`);
            } else if (item.quantity > product.stock) {
                item.quantity = product.stock;
                localStorage.setItem("gameCart", JSON.stringify(cart));
                window.dispatchEvent(new Event("cartUpdated"));
                toast.info(`Dostosowano ilość produktu ${product.name} w koszyku do aktualnego stanu magazynowego (${product.stock} szt.)`);
                setAvailableStock(0);
                setMaxAdded(true);
            }
        }
    }, [product.id, product.stock, product.name, setAvailableStock, setMaxAdded]);

    const getStockStatus = () => {
        if (product.stock === 0) {
            return {
                text: "Niedostępne",
                color: "text-red-400",
                bgColor: "bg-red-500/20 border-red-500/50",
            };
        } else if (availableStock < 10) {
            return {
                text:
                    availableStock === 0
                        ? window.innerWidth < 960
                            ? "Dodałeś już wszystkie możliwe klucze"
                            : "Osiągnąłeś maksymalną ilość możliwych kluczy"
                        : `Mała dostępność (${availableStock} szt.)`,
                color: "text-yellow-400",
                bgColor: "bg-yellow-500/20 border-yellow-500/50",
            };
        }
        return {
            text: "Dostępne",
            color: "text-green-400",
            bgColor: "bg-green-500/20 border-green-500/50",
        };
    };

    const stockStatus = getStockStatus();

    const handleAddToCart = (p: DetailedProduct) => {
        if (buttonDisabled) return;
        setButtonDisabled(true);

        setTimeout(() => setButtonDisabled(false), 1500);

        try {
            const cartData = localStorage.getItem("gameCart");
            const cart = cartData ? JSON.parse(cartData) : [];
            const existingItemIndex = cart.findIndex((item: CartItem) => item.id === p.id);

            if (existingItemIndex !== -1) {
                if (cart[existingItemIndex].quantity >= p.stock) {
                    setMaxAdded(true);
                    toast.info("Dodałeś wszystkie dostępne klucze dla tego produktu");
                    return;
                }
                cart[existingItemIndex].quantity += 1;
            } else {
                cart.push({
                    id: p.id,
                    imgId: p.logoId,
                    name: p.name,
                    platform: p.platform.name,
                    price: p.price,
                    quantity: 1,
                });
            }

            localStorage.setItem("gameCart", JSON.stringify(cart));
            window.dispatchEvent(new Event("cartUpdated"));
            toast.success(`Dodano produkt ${p.name} do koszyka`);

            const qtyInCart = getCartQuantity(p.id);
            const newStock = Math.max(p.stock - qtyInCart, 0);
            setAvailableStock(newStock);
            setMaxAdded(qtyInCart >= p.stock);
        } catch (error) {
            console.error("Błąd dodawania do koszyka:", error);
            toast.warning("Wystąpił błąd podczas dodawania produktu do koszyka");
        }
    };

    return (
        <Card className="bg-[#2A2A2A] border-[#3A3A3A] sticky top-4 max-w-sm mx-auto w-full h-fit">
        <CardContent className="p-6 space-y-6">
                <div>
                    <p className="text-[#A0A0A0] text-sm mb-2">Cena:</p>
                    {product.discountPercentage > 0 ? (
                        <>
                            <div className="flex items-baseline gap-3">
                <span className="text-2xl md:text-4xl font-bold text-[#D4A44A]">
                  {discountedPrice.toFixed(2)} PLN
                </span>
                                                <span className="text-lg md:text-xl text-[#A0A0A0] line-through">
                  {product.price.toFixed(2)} PLN
                </span>
                            </div>
                            <p className="text-green-400 text-sm mt-1">
                                Oszczędzasz {(product.price - discountedPrice).toFixed(2)} PLN!
                            </p>
                        </>
                    ) : (
                        <span className="text-4xl font-bold text-[#D4A44A]">
              {product.price.toFixed(2)} PLN
            </span>
                    )}
                </div>

                <Badge
                    className={`${stockStatus.bgColor} ${stockStatus.color} w-full justify-center py-2 text-sm font-semibold`}
                >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {stockStatus.text}
                </Badge>

                {product.stock > 0 ? (
                    <Button
                        onClick={() => handleAddToCart(product)}
                        disabled={maxAdded || availableStock === 0 || buttonDisabled}
                        className={`w-full py-6 text-base font-semibold border-2 transition-all duration-300
              ${
                            maxAdded || availableStock === 0
                                ? "bg-transparent border-[#A0A0A0] text-[#A0A0A0] cursor-not-allowed"
                                : "bg-[#D4A44A] hover:bg-[#C19440] text-black border-[#D4A44A] hover:scale-105"
                        }`}
                    >
                        {maxAdded || availableStock === 0 ? (
                            <>
                                <AlertCircle className="w-5 h-5 mr-2" />
                                {window.innerWidth < 640
                                    ? "Brak towaru"
                                    : "Dodałeś wszystkie dostępne klucze"}
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="w-5 h-5 mr-2" />
                                Dodaj do koszyka
                            </>
                        )}
                    </Button>
                ) : (
                    <Button
                        disabled
                        className="w-full bg-[#3A3A3A] text-[#A0A0A0] cursor-not-allowed py-6 text-base"
                        variant="outline"
                    >
                        <AlertCircle className="w-5 h-5 mr-2" />
                        Produkt niedostępny
                    </Button>
                )}

                <div className="border-t border-[#3A3A3A] pt-4 space-y-3 text-sm">
                    <InfoItem text="Natychmiastowa dostawa klucza cyfrowego" />
                    <InfoItem text="Bezpieczna płatność" />
                    <InfoItem text="Wsparcie techniczne 24/7" />
                </div>

                <div className="border-t border-[#3A3A3A] pt-4">
                    <p className="text-[#A0A0A0] text-sm">
                        Data wydania:{" "}
                        <span className="text-[#F8F8F8] font-semibold">{product.releaseDate}</span>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

const InfoItem = ({ text }: { text: string }) => (
    <div className="flex items-start gap-3 text-sm">
        <div className="text-[#D4A44A] mt-1">✓</div>
        <span className="text-[#A0A0A0]">{text}</span>
    </div>
);
