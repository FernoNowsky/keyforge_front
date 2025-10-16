"use client"

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { UserIcon, LogOutIcon, MailIcon } from "lucide-react"

interface UserAccountProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user?: string
    email?: string
    onLogout: () => void
}

export function UserAccount({
                                open,
                                onOpenChange,
                                user,
                                email,
                                onLogout,
                            }: UserAccountProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="bg-[#2A2A2A] text-white border-[#3A3A3A] p-6"
            >
                {/* Nagłówek */}
                <SheetHeader className="border-b border-[#3A3A3A] pb-6">
                    <div className="flex flex-col items-center text-center gap-3">
                        <div className="bg-[#3A3A3A] p-4 rounded-full">
                            <UserIcon className="h-8 w-8 text-[#D4A44A]" />
                        </div>
                        <SheetTitle className="text-[#D4A44A] text-lg">{user}</SheetTitle>
                        <SheetDescription className="text-gray-400 flex items-center gap-2 justify-center">
                            <MailIcon className="h-4 w-4" /> {email ?? "brak e-maila"}
                        </SheetDescription>
                    </div>
                </SheetHeader>

                {/* Sekcje konta */}
                <div className="mt-6 space-y-6 px-2">
                    <div className="flex flex-col items-center text-center gap-2">
                        <p className="text-sm text-gray-400">Status konta:</p>
                        <p className="font-medium text-[#D4A44A]">Aktywny</p>
                    </div>

                    <div className="flex flex-col items-center text-center gap-2">
                        <p className="text-sm text-gray-400">Preferencje użytkownika:</p>
                        <ul className="list-disc list-inside text-sm text-gray-300">
                            <li>Powiadomienia e-mail</li>
                            <li>Historia zakupów</li>
                            <li>Bezpieczne logowanie</li>
                        </ul>
                    </div>
                </div>

                {/* Stopka */}
                <SheetFooter className="mt-10 border-t border-[#3A3A3A] pt-4">
                    <Button
                        variant="outline"
                        className="w-full border-[#D4A44A] text-[#D4A44A] hover:bg-[#D4A44A] hover:text-black transition"
                        onClick={onLogout}
                    >
                        <LogOutIcon className="mr-2 h-4 w-4" /> Wyloguj się
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
