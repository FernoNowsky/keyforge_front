"use client"
import { useState, useEffect } from "react"
import { useSearch, useNavigate } from "@tanstack/react-router"
import { CartPage } from "./CartPage"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Package } from "lucide-react"

export function PaymentFailedPage() {
    const [showCancelDialog, setShowCancelDialog] = useState(false)
    const searchParams = useSearch({from:"/cart/cancel/"})
    const orderId = searchParams?.orderId
    const navigate = useNavigate()

    useEffect(() => {
        if (orderId) {
            setShowCancelDialog(true)
        }
    }, [orderId])

    const handleBackToCart = () => {
        setShowCancelDialog(false)
        navigate({ to: "/cart" })
    }

    const handleBackToProducts = () => {
        navigate({ to: "/products" })
    }

    return (
        <>
            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <DialogContent className="bg-[#2A2A2A] border-[#3A3A3A] text-[#F8F8F8] sm:max-w-md">
                    <DialogHeader>
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                                <svg
                                    className="w-10 h-10 text-red-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </div>
                        </div>
                        <DialogTitle className="text-center text-2xl text-[#F8F8F8]">
                            Płatność nie powiodła się
                        </DialogTitle>
                        <DialogDescription className="text-center text-[#A0A0A0] pt-2">
                            {orderId ? (
                                <>
                                    Zamówienie <span className="text-[#D4A44A] font-semibold">#{orderId}</span> nie zostało opłacone.
                                    <br />
                                    Twoje produkty pozostały w koszyku.
                                </>
                            ) : (
                                <>
                                    Płatność została anulowana lub wystąpił błąd.
                                    <br />
                                    Twoje produkty pozostały w koszyku.
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-between gap-3">
                        <Button
                            onClick={handleBackToProducts}
                            variant="outline"
                            className="w-full sm:w-auto border-[#3A3A3A] text-[#F8F8F8] hover:bg-[#3A3A3A] hover:text-[#F8F8F8]"
                        >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Przeglądaj gry
                        </Button>
                        <Button
                            onClick={handleBackToCart}
                            variant="outline"
                            className="w-full sm:w-auto bg-[#D4A44A] text-black hover:bg-[#f1c562] font-semibold border-[#D4A44A]"
                        >
                            <Package className="w-4 h-4 mr-2" />
                            Wróć do koszyka
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <div className={`transition-all ${showCancelDialog ? 'blur-sm pointer-events-none' : ''}`}>
                <CartPage />
            </div>
        </>
    )
}