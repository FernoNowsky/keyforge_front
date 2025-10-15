"use client"

import { Link } from "@tanstack/react-router"

export function Footer() {
    return (
        <footer className="border-t border-[#3A3A3A] bg-[#1C1C1C] text-[#B0B0B0]">
            <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-sm text-center md:text-left">
                    © {new Date().getFullYear()} KeyForge — Wszelkie prawa zastrzeżone.
                </div>

                <div className="flex gap-6 text-sm">
                    <Link
                        to="/privacy-policy"
                        className="font-medium text-[#D4A44A] transition"
                    >
                        Polityka prywatności
                    </Link>
                    <Link
                        to="/terms-of-service"
                        className="font-medium text-[#D4A44A] transition"
                    >
                        Regulamin sklepu
                    </Link>
                </div>
            </div>
        </footer>
    )
}
