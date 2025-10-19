"use client"

import * as React from "react"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import clsx from "clsx"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"

import { LoginCard } from "./LoginCard"
import { RegisterCard } from "./RegisterCard"

interface AuthDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const [mode, setMode] = React.useState<"login" | "register">("login")
    const [animating, setAnimating] = React.useState(false)

    const handleSwitch = (newMode: "login" | "register") => {
        setAnimating(true)
        setTimeout(() => {
            setMode(newMode)
            setAnimating(false)
        }, 200)
    }

    // -----------------------------------------------
    // DESKTOP (Dialog)
    // -----------------------------------------------
    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent
                    className="max-w-md bg-[#2A2A2A] border border-[#3A3A3A] text-white overflow-hidden transition-all duration-300"
                    aria-describedby=""
                >
                    <DialogHeader>
                        <DialogTitle className="text-center text-[#D4A44A]">
                            {mode === "login" ? "Zaloguj się" : "Zarejestruj się"}
                        </DialogTitle>
                    </DialogHeader>

                    <div
                        className={clsx(
                            "transition-all duration-300 transform",
                            animating ? "opacity-0 scale-95" : "opacity-100 scale-100"
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

    // -----------------------------------------------
    // MOBILE (Drawer)
    // -----------------------------------------------
    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="bg-[#2A2A2A] border-t border-[#3A3A3A] text-white" aria-describedby="">
                <DrawerHeader className="text-left">
                    <DrawerTitle className="text-[#D4A44A] text-center">
                        {mode === "login" ? "Zaloguj się" : "Zarejestruj się"}
                    </DrawerTitle>
                </DrawerHeader>

                <div
                    className={clsx(
                        "transition-all duration-300 transform px-4",
                        animating ? "opacity-0 scale-95" : "opacity-100 scale-100"
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

                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline" className="text-white border-[#555]">
                            Anuluj
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
