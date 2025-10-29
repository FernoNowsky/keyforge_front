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
import { CheckCircle2, ShoppingCart, Package } from "lucide-react"

export function PaymentSuccessPage() {
    const [showSuccessDialog, setShowSuccessDialog] = useState(false)
    const [cartCleared, setCartCleared] = useState(false)
    const searchParams = useSearch({from:"/cart/success/"})
    const orderId = searchParams?.orderId
    const navigate = useNavigate()

    useEffect(() => {
        if (orderId && !cartCleared) {
            localStorage.removeItem("gameCart")
            window.dispatchEvent(new Event('cartUpdated'))
            setCartCleared(true)
            setShowSuccessDialog(true)
        }
    }, [orderId, cartCleared])

    const handleGoToOrders = () => {
        navigate({ to: `/account/purchases`, search: { orderId } })
    }

    const handleBackToProducts = () => {
        navigate({ to: "/products" })
    }

    return (
        <>
            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent className="bg-[#2A2A2A] border-[#3A3A3A] text-[#F8F8F8] sm:max-w-md">
                    <DialogHeader>
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 text-green-500" />
                            </div>
                        </div>
                        <DialogTitle className="text-center text-2xl text-[#F8F8F8]">
                            Płatność zakończona sukcesem!
                        </DialogTitle>
                        <DialogDescription className="text-center text-[#A0A0A0] pt-2">
                            Zamówienie <span className="text-[#D4A44A] font-semibold">#{orderId}</span> zostało opłacone i jest gotowe do odebrania.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-between gap-3">
                        <Button
                            onClick={handleBackToProducts}
                            variant="outline"
                            className="w-full sm:w-auto border-[#3A3A3A] text-[#F8F8F8] hover:bg-[#3A3A3A] hover:text-[#F8F8F8]"
                        >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Wróć do przeglądania gier
                        </Button>
                        <Button
                            onClick={handleGoToOrders}
                            variant="outline"
                            className="w-full sm:w-auto bg-[#D4A44A] text-black hover:bg-[#f1c562] font-semibold border-[#D4A44A]"
                        >
                            <Package className="w-4 h-4 mr-2" />
                            Odbierz
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <div className={`transition-all ${showSuccessDialog ? 'blur-sm pointer-events-none' : ''}`}>
                <CartPage key={cartCleared ? 'cleared' : 'default'} />
            </div>
        </>
    )
}