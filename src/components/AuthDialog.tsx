"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LoginCard } from "./LoginCard"
import { RegisterCard } from "./RegisterCard"
import clsx from "clsx"

interface AuthDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
    const [mode, setMode] = React.useState<"login" | "register">("login")
    const [animating, setAnimating] = React.useState(false)

    const handleSwitch = (newMode: "login" | "register") => {
        setAnimating(true)
        setTimeout(() => {
            setMode(newMode)
            setAnimating(false)
        }, 200) // krótki fade-out, potem fade-in
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-w-md bg-[#2A2A2A] border border-[#3A3A3A] text-white overflow-hidden transition-all duration-300"
                aria-describedby="" // usuwa warning
            >
                <DialogHeader>
                    <DialogTitle className="text-center text-[#D4A44A]">
                        {mode === "login" ? "Zaloguj się" : "Zarejestruj się"}
                    </DialogTitle>
                </DialogHeader>

                <div
                    className={clsx(
                        "transition-all duration-300 transform ",
                        animating
                            ? "opacity-0 scale-95"
                            : "opacity-100 scale-100"
                    )}
                >
                    {mode === "login" ? (
                        <LoginCard
                            onSwitchToRegister={() => handleSwitch("register")}
                            onSuccess={() => onOpenChange(false)}
                        />
                    ) : (
                        <RegisterCard
                            onSwitchToLogin={() => handleSwitch("login")}
                            onSuccess={() => onOpenChange(false)}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
