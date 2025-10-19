"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Search } from "lucide-react"
import { SiSteam, SiUbisoft, SiRockstargames } from "react-icons/si"
import { toast } from "sonner";
import React from "react";

type CartItem = {
    id: string
    name: string
    price: number
    quantity: number
}

type GameCardProps = {
    name: string
    platform: string
    price: number
    imgId: string
}

const PlatformBadge = ({ platform }: { platform: string }) => {
    const baseClasses =
        "flex items-center gap-1 text-white text-xs px-2 py-1 rounded-md shadow"
    switch (platform) {
        case "Steam":
            return (
                <span className={`${baseClasses} bg-[#1b2838]`}>
                    <SiSteam size={14} /> Steam
                </span>
            )
        case "Ubisoft":
        case "Ubisoft Connect":
            return (
                <span className={`${baseClasses} bg-[#0099ff]`}>
                    <SiUbisoft size={14} /> Ubisoft
                </span>
            )
        case "Rockstar":
            return (
                <span className={`${baseClasses} bg-[#D4A44A] text-black`}>
                    <SiRockstargames size={14} /> Rockstar
                </span>
            )
        default:
            return <span className={`${baseClasses} bg-gray-600`}>{platform}</span>
    }
}

export function GameCard({ name, platform, price, imgId }: GameCardProps) {
    const [isMobile, setIsMobile] = React.useState(
        typeof window !== "undefined" ? window.innerWidth < 768 : false
    );

    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleAddToCart = () => {
        try {
            // Odczyt aktualnego koszyka z localStorage
            const cartData = localStorage.getItem('gameCart');
            const cart = cartData ? JSON.parse(cartData) : [];

            // Sprawdzenie czy produkt już istnieje
            const existingItemIndex = cart.findIndex((item: CartItem) => item.id === imgId);

            if (existingItemIndex !== -1) {
                // Zwiększ ilość jeśli produkt już istnieje
                cart[existingItemIndex].quantity += 1;
            } else {
                // Dodaj nowy produkt
                cart.push({
                    id: imgId,
                    name: name,
                    price: price,
                    quantity: 1
                });
            }

            // Zapis do localStorage
            localStorage.setItem('gameCart', JSON.stringify(cart));

            toast.success(`Dodano produkt ${name} do koszyka`)

        } catch (error) {
            console.error('Błąd dodawania do koszyka:', error);
            toast.warning("Wystąpił błąd podczas dodawania produktu do koszyka")
        }
    };

    return (
        <Card
            className={`relative overflow-hidden flex flex-col justify-between rounded-2xl border border-[#3A3A3A]
                       shadow-md group transition-all duration-500
                       hover:-translate-y-1
                       bg-gradient-to-b from-[#1A1A1A] via-[#1E1E1E] to-[#2A2A2A]
                       h-[360px] w-full`}
            style={{
                boxShadow: "0 0 5px rgba(212,164,74,0.15)",
            }}
        >
            <div className="relative z-10">
                <img
                    src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${imgId}/header.jpg`}
                    alt={name}
                    className={`w-full h-44 object-cover opacity-95 transition-opacity duration-500
                                ${isMobile ? "opacity-100" : "group-hover:opacity-100"}`}
                />
                <div className="absolute top-2 right-2 z-20">
                    <PlatformBadge platform={platform} />
                </div>
            </div>

            <CardContent
                className={`absolute bottom-0 left-0 w-full p-3 text-[#F8F8F8] bg-gradient-to-t from-[#1C1C1C] via-[#2A2A2A]/90 to-transparent
                           transition-all duration-500 ease-out flex flex-col justify-end z-30
                           ${isMobile ? "h-[60%]" : "h-[35%] group-hover:h-[60%]"}`}
            >
                <div className={`transition-all duration-500 ${isMobile ? "-translate-y-2" : "group-hover:-translate-y-2"}`}>
                    <h3 className="text-base font-semibold text-[#F8F8F8] mb-1 line-clamp-2">{name}</h3>
                    <span className="text-lg font-bold text-[#D4A44A]">${price}</span>
                </div>

                <div className={`mt-3 flex flex-col gap-2 z-40 transition-all duration-500
                                 ${isMobile ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0"}`}>
                    <Button
                        size="sm"
                        variant="outline"
                        className="w-full border-[#D4A44A] text-[#D4A44A] hover:bg-[#D4A44A] hover:text-black transition-all gap-1 font-semibold text-xs py-1.5"
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart className="h-3.5 w-3.5" /> Dodaj do koszyka
                    </Button>
                    <Button
                        size="sm"
                        className="w-full bg-[#D4A44A] text-black hover:bg-[#f1c562] transition-all gap-1 font-semibold text-xs py-1.5"
                    >
                        <Search className="h-3.5 w-3.5" /> Sprawdź
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}