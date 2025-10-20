import { useState, useEffect, useRef } from "react"
import { ShoppingCartIcon } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { PlatformBadge } from "@/components/PlatformBadge";

type CartItem = {
    id: number
    name: string
    imgId: string
    platform: string
    price: number
    quantity: number
}

export function CartHoverSection() {
    const [isHovered, setIsHovered] = useState(false)
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [totalItems, setTotalItems] = useState(0)
    const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

    const navigate = useNavigate()

    const handleNavigateToCart = () => {
        setIsHovered(false)
        navigate({ to: "/cart" })
    }

    const handleProductClick = (id: number) => {
        setIsHovered(false)
        navigate({ to: `/products/${id}` })
    }

    useEffect(() => {
        const updateCart = () => {
            try {
                const cartData = localStorage.getItem("gameCart")
                const cart = cartData ? JSON.parse(cartData) : []
                setCartItems(cart)
                setTotalItems(cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0))
            } catch (error) {
                console.error("Błąd odczytu koszyka:", error)
            }
        }

        updateCart()
        window.addEventListener("storage", updateCart)
        window.addEventListener("cartUpdated", updateCart)

        return () => {
            window.removeEventListener("storage", updateCart)
            window.removeEventListener("cartUpdated", updateCart)
        }
    }, [])

    const handleMouseEnter = () => {
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
        setIsHovered(true)
    }

    const handleMouseLeave = () => {
        hoverTimeout.current = setTimeout(() => {
            setIsHovered(false)
        }, 150)
    }

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                onClick={handleNavigateToCart}
                className="flex items-center hover:text-primary transition relative !bg-transparent"
            >
                <ShoppingCartIcon className="h-5 w-5" />
                {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#D4A44A] text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {totalItems > 9 ? "9+" : totalItems}
                    </span>
                )}
            </button>

            {/* Hover Panel */}
            <div
                className={`absolute right-0 top-full mt-2 w-80 bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg shadow-xl transition-all duration-300 z-50
                ${isHovered ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}
            >
                <div className="p-4">
                    <h3 className="text-[#D4A44A] font-semibold mb-3 text-sm">Koszyk</h3>

                    {cartItems.length === 0 ? (
                        <p className="text-gray-400 text-sm py-4 text-center">Koszyk jest pusty</p>
                    ) : (
                        <>
                            <div className="max-h-64 overflow-y-auto space-y-3 mb-3">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between items-center text-sm border-b border-[#3A3A3A] pb-2"
                                    >
                                        <div className="flex-1 mr-2">
                                            <p
                                                onClick={() => handleProductClick(item.id)}
                                                className="text-white font-medium line-clamp-1 cursor-pointer hover:text-[#D4A44A] transition"
                                            >
                                                {item.name}
                                            </p>
                                            <div className="flex items-center gap-2 mt-[2px]">
                                                <PlatformBadge platform={item.platform} />
                                                <p className="text-gray-400 text-xs">x{item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="text-[#D4A44A] font-semibold whitespace-nowrap">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-[#3A3A3A] pt-3 flex justify-between items-center">
                                <span className="text-white font-semibold">Razem:</span>
                                <span className="text-[#D4A44A] font-bold text-lg">${totalPrice.toFixed(2)}</span>
                            </div>

                            <Button
                                onClick={handleNavigateToCart}
                                variant="outline"
                                className="w-full bg-[#D4A44A] text-black hover:bg-[#f1c562] font-semibold mt-4 py-6 text-base"
                            >
                                Przejdź do koszyka
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
