"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useNavigate } from "@tanstack/react-router"
import {
    User,
    LogOut,
    Mail,
    ShoppingBag,
    Star,
    Trophy,
    Settings,
    MessageSquare,
    Key,
    Award,
    Percent
} from "lucide-react"

interface UserAccountProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user?: string
    email?: string
    level?: string
    keyPoints?: number
    discount?: number
    onLogout: () => void
}

export function UserAccount({
                                open,
                                onOpenChange,
                                user,
                                email = "user@keyforge.com",
                                level = "Mistrz Kuźni",
                                keyPoints = 5450,
                                discount = 9,
                                onLogout,
                            }: UserAccountProps) {
    const navigate = useNavigate()

    const accountSections = [
        {
            icon: ShoppingBag,
            title: "Moje zakupy",
            description: "Historia i pobieranie kluczy",
            color: "text-[#D4A44A]",
            path: "/account/purchases"
        },
        {
            icon: Key,
            title: "Moje klucze",
            description: "Zakupione klucze aktywacyjne",
            color: "text-[#D4A44A]",
            path: "/account/keys"
        },
        {
            icon: Star,
            title: "Opinie i oceny",
            description: "Twoje recenzje gier",
            color: "text-[#D4A44A]",
            path: "/account/reviews"
        },
        {
            icon: Award,
            title: "Punkty lojalnościowe",
            description: "Sprawdź poziomy lojalnościowe",
            color: "text-[#D4A44A]",
            path: "/account/loyalty"
        },
        {
            icon: Settings,
            title: "Ustawienia konta",
            description: "Profil, hasło, preferencje",
            color: "text-[#D4A44A]",
            path: "/account/settings"
        },
        {
            icon: MessageSquare,
            title: "Wsparcie",
            description: "Kontakt przez WhatsApp",
            color: "text-[#D4A44A]",
            path: "/account/support"
        }
    ]

    const handleSectionClick = (path: string) => {
        navigate({ to: path })
        onOpenChange(false)
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="bg-[#2A2A2A] text-white border-[#3A3A3A] p-0 w-full sm:max-w-md overflow-y-auto"
            >
                <SheetHeader className="bg-gradient-to-b from-[#3A3A3A] to-[#2A2A2A] pt-6 pb-4">
                    <div className="flex flex-col items-center text-center gap-3">
                        <div className="bg-gradient-to-br from-[#D4A44A] to-[#B8873D] p-5 rounded-full shadow-lg">
                            <User className="h-10 w-10 text-[#2A2A2A]" />
                        </div>
                        <SheetTitle className="text-[#D4A44A] text-xl font-bold">{user}</SheetTitle>
                        <SheetDescription className="text-gray-400 flex items-center gap-2 justify-center text-sm">
                            <Mail className="h-4 w-4" /> {email}
                        </SheetDescription>
                    </div>
                </SheetHeader>

                <div className="px-6 py-4 bg-[#1F1F1F] border-y border-[#3A3A3A]">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-[#D4A44A]" />
                            <span className="text-sm font-semibold text-[#D4A44A]">{level}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-[#2A2A2A] px-3 py-1 rounded-full">
                            <Percent className="h-4 w-4 text-green-400" />
                            <span className="text-xs font-bold text-green-400">{discount}% rabatu</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-400">KeyPoints</span>
                            <span className="text-[#D4A44A] font-semibold">{keyPoints}</span>
                        </div>
                        <div className="w-full bg-[#3A3A3A] rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-[#D4A44A] to-[#B8873D] h-full rounded-full transition-all duration-500"
                                style={{ width: `${(keyPoints % 1000) / 10}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-500 text-center">
                            {1000 - (keyPoints % 1000)} punktów do następnego poziomu
                        </p>
                    </div>
                </div>

                <div className="px-6 py-4">
                    <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">
                        Twoje możliwości
                    </h3>
                    <div className="space-y-2">
                        {accountSections.map((section, index) => {
                            const IconComponent = section.icon
                            return (
                                <button
                                    key={index}
                                    onClick={() => handleSectionClick(section.path)}
                                    className="w-full flex items-center gap-4 p-3 rounded-lg bg-[#1F1F1F] hover:bg-[#3A3A3A] transition-all duration-200 border border-transparent hover:border-[#D4A44A]/30 group"
                                >
                                    <div className={`${section.color} p-2 rounded-md bg-[#2A2A2A] group-hover:scale-110 transition-transform`}>
                                        <IconComponent className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="text-sm font-semibold text-[#D4A44A] transition-colors">
                                            {section.title}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {section.description}
                                        </p>
                                    </div>
                                    <svg
                                        className="h-4 w-4 text-gray-600 group-hover:text-[#D4A44A] group-hover:translate-x-1 transition-all"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            )
                        })}
                    </div>
                </div>

                <Separator className="bg-[#3A3A3A]" />

                <SheetFooter className="p-6">
                    <Button
                        variant="outline"
                        className="w-full border-[#D4A44A] text-[#D4A44A] hover:bg-[#D4A44A] hover:text-[#2A2A2A] transition-all duration-200 font-semibold"
                        onClick={onLogout}
                    >
                        <LogOut className="mr-2 h-4 w-4" /> Wyloguj się
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}