"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Trash2, Plus, Minus, ShoppingCart, CreditCard } from "lucide-react"
import { toast } from "sonner";
import { PlatformBadge } from "@/components/PlatformBadge";
import {OrdersApi} from "@/api";

type CartItem = {
    id: number
    name: string
    imgId: string
    platform: string
    price: number
    quantity: number
}

export function CartPage() {
    const [cart, setCart] = useState<CartItem[]>([])
    const [couponCode, setCouponCode] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        loadCart()
    }, [])

    const handleClick = () => {
        navigate({ to: "/products" })
    }

    const loadCart = () => {
        try {
            const cartData = localStorage.getItem("gameCart")
            if (cartData) {
                setCart(JSON.parse(cartData))
            }
        } catch (error) {
            console.error("Błąd ładowania koszyka:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const saveCart = (updatedCart: CartItem[]) => {
        try {
            localStorage.setItem("gameCart", JSON.stringify(updatedCart))
            window.dispatchEvent(new Event('cartUpdated'));
            setCart(updatedCart)
        } catch (error) {
            console.error("Błąd zapisu koszyka:", error)
        }
    }

    const updateQuantity = (id: number, delta: number) => {
        const updatedCart = cart.map((item) => {
            if (item.id === id) {
                const newQuantity = item.quantity + delta
                if (newQuantity <= 0) return null
                return { ...item, quantity: newQuantity }
            }
            return item
        }).filter(Boolean) as CartItem[]

        saveCart(updatedCart)

        if (delta < 0 && !updatedCart.find(item => item.id === id)) {
            toast.success("Usunięto z koszyka",)
        }
    }

    const removeItem = (id: number, name: string) => {
        const updatedCart = cart.filter((item) => item.id !== id)
        saveCart(updatedCart)
        toast.success(`Usunięto ${name} z koszyka`,)
    }

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0)
    }

    const getTotalItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0)
    }

    const handleApplyCoupon = () => {
        if (couponCode.trim()) {
            toast.info("Kody rabatowe wkrótce")
        }
    }

const handleCheckout = async (): Promise<void> => {
    if (cart.length === 0) {
        toast.warning("Pusty koszyk")
        return
    }

    try {
        const items = cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
        }))

        const orderRequest = {
            products: items,
        }

        type OrderResponse = {
            orderId: number
            paymentId: string
            paymentUrl: string
        }

        const order: OrderResponse = await OrdersApi.create(orderRequest)

        toast.success(`Zamówienie utworzone, ID: ${order.orderId}`)
        window.location.href = order.paymentUrl

    } catch (error) {
        console.error("Błąd tworzenia zamówienia:", error)
        toast.error("Nie udało się utworzyć zamówienia")
    }
}


    if (isLoading) {
        return (
            <div className="min-h-screen  flex items-center justify-center">
                <div className="text-[#D4A44A] text-xl">Ładowanie...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen  p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {cart.length === 0 ? (
                    <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <ShoppingCart className="w-24 h-24 text-[#D4A44A] mb-4 opacity-50" />
                            <h2 className="text-2xl font-semibold text-[#F8F8F8] mb-2">
                                Twój koszyk jest pusty
                            </h2>
                            <p className="text-[#A0A0A0] mb-6">
                                Dodaj gry do koszyka, aby kontynuować zakupy
                            </p>
                            <Button
                                onClick={handleClick}
                                variant="outline"
                                className="border-[#D4A44A] text-[#D4A44A] hover:bg-[#D4A44A] hover:text-black transition">
                                Przeglądaj gry
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Tabela produktów - lewa strona */}
                        <div className="lg:col-span-2">
                            <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
                                <CardHeader>
                                    <CardTitle className="text-[#F8F8F8]">
                                        Produkty ({getTotalItems()})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {/* Widok mobilny - karty */}
                                    <div className="block md:hidden space-y-4">
                                        {cart.map((item) => (
                                            <div
                                                key={item.id}
                                                className="bg-[#1C1C1C] rounded-lg p-4 border border-[#3A3A3A]"
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex flex-col">
                                                        <h3 className="text-[#F8F8F8] font-semibold pr-2">
                                                            {item.name}
                                                        </h3>
                                                        {item.platform && (
                                                            <span className="pt-1 w-max">
                                                                <PlatformBadge platform={item.platform} />
                                                            </span>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(item.id, item.name)}
                                                        className="text-red-400 hover:text-red-300 transition-colors"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, -1)}
                                                            className="w-8 h-8 rounded bg-[#2A2A2A] text-[#D4A44A] hover:bg-[#3A3A3A] transition-colors flex items-center justify-center"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="text-[#F8F8F8] font-semibold w-8 text-center">
                                                          {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, 1)}
                                                            className="w-8 h-8 rounded bg-[#2A2A2A] text-[#D4A44A] hover:bg-[#3A3A3A] transition-colors flex items-center justify-center"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-[#D4A44A] font-bold text-lg">
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </div>
                                                        <div className="text-[#A0A0A0] text-sm">
                                                            ${item.price.toFixed(2)} każda
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Widok desktop - tabela */}
                                    <div className="hidden md:block overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="border-[#3A3A3A] hover:bg-transparent">
                                                    <TableHead className="text-[#A0A0A0]">Produkt</TableHead>
                                                    <TableHead className="text-[#A0A0A0]"></TableHead>
                                                    <TableHead className="text-[#A0A0A0] text-center">
                                                        Ilość
                                                    </TableHead>
                                                    <TableHead className="text-[#A0A0A0] text-right">
                                                        Cena
                                                    </TableHead>
                                                    <TableHead className="text-[#A0A0A0] text-right">
                                                        Suma
                                                    </TableHead>
                                                    <TableHead className="text-[#A0A0A0] w-[50px]"></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {cart.map((item) => (
                                                    <TableRow
                                                        key={item.id}
                                                        className="border-[#3A3A3A] hover:bg-[#1C1C1C]"
                                                    >
                                                        {/* Obrazek produktu */}
                                                        <TableCell className="p-2">
                                                            <img
                                                                src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${item.imgId}/header.jpg`}
                                                                alt={item.name}
                                                                className="w-16 h-8 rounded"
                                                            />
                                                        </TableCell>

                                                        {/* Nazwa produktu */}
                                                        <TableCell className="text-[#F8F8F8] font-medium">
                                                            <div className="flex items-center gap-2 h-full">
                                                                <button
                                                                    onClick={() => navigate({ to: `/products/${item.id}` })}
                                                                    className="flex-1 text-left !bg-transparent border-none p-0 m-0"
                                                                >
                                                                    {item.name}
                                                                </button>
                                                                <span className="pt-0.5">
                                                                {item.platform && (
                                                                    <PlatformBadge platform={item.platform} />
                                                                )}
                                                                </span>
                                                            </div>
                                                        </TableCell>

                                                        {/* Ilość */}
                                                        <TableCell>
                                                            <div className="flex items-center justify-center gap-2">
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, -1)}
                                                                    className="w-8 h-8 rounded bg-[#2A2A2A] text-[#D4A44A] hover:bg-[#3A3A3A] transition-colors flex items-center justify-center"
                                                                >
                                                                    <Minus className="w-4 h-4" />
                                                                </button>
                                                                <span className="text-[#F8F8F8] font-semibold w-8 text-center">
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, 1)}
                                                                    className="w-8 h-8 rounded bg-[#2A2A2A] text-[#D4A44A] hover:bg-[#3A3A3A] transition-colors flex items-center justify-center"
                                                                >
                                                                    <Plus className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </TableCell>

                                                        {/* Cena */}
                                                        <TableCell className="text-[#A0A0A0] text-right">
                                                            ${item.price.toFixed(2)}
                                                        </TableCell>

                                                        {/* Suma */}
                                                        <TableCell className="text-[#D4A44A] font-bold text-right">
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </TableCell>

                                                        {/* Usuń */}
                                                        <TableCell>
                                                            <button
                                                                onClick={() => removeItem(item.id, item.name)}
                                                                className="text-red-400 hover:text-red-300 transition-colors !bg-transparent"
                                                            >
                                                                <Trash2 className="w-5 h-5 " />
                                                            </button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Podsumowanie - prawa strona */}
                        <div className="lg:col-span-1">
                            <Card className="bg-[#2A2A2A] border-[#3A3A3A] sticky top-4">
                                <CardHeader>
                                    <CardTitle className="text-[#F8F8F8]">Podsumowanie</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Kod rabatowy */}
                                    <div>
                                        <label className="text-[#A0A0A0] text-sm mb-2 block">
                                            Kod rabatowy
                                        </label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="text"
                                                placeholder="Wpisz kod"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                                className="bg-[#1C1C1C] border-[#3A3A3A] text-[#F8F8F8] placeholder:text-[#606060] focus:border-[#D4A44A]"
                                            />
                                            <Button
                                                onClick={handleApplyCoupon}
                                                variant="outline"
                                                className="border-[#D4A44A] text-[#D4A44A] hover:bg-[#D4A44A] hover:text-black whitespace-nowrap"
                                            >
                                                Zastosuj
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="border-t border-[#3A3A3A] pt-4 space-y-3">
                                        <div className="flex justify-between text-[#A0A0A0]">
                                            <span>Produkty ({getTotalItems()})</span>
                                            <span>${getTotalPrice().toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-[#A0A0A0]">
                                            <span>Rabat</span>
                                            <span>$0.00</span>
                                        </div>
                                        <div className="border-t border-[#3A3A3A] pt-3 flex justify-between text-[#F8F8F8] text-xl font-bold">
                                            <span>Suma</span>
                                            <span className="text-[#D4A44A]">
                        ${getTotalPrice().toFixed(2)}
                      </span>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleCheckout}
                                        variant="outline"
                                        className="w-full bg-[#D4A44A] text-black hover:bg-[#f1c562] font-semibold py-6 text-base"
                                    >
                                        <CreditCard className="w-5 h-5 mr-2" />
                                        Przejdź do płatności
                                    </Button>

                                    <p className="text-[#606060] text-xs text-center">
                                        Bezpieczne płatności przez szyfrowane połączenie
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}