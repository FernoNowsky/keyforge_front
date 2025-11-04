"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Banner from "@/assets/keyforge.webp"
import { useNavigate } from "@tanstack/react-router"

export function HomeBanner() {
    const navigate = useNavigate()
    return (
        <section className="relative h-[480px] md:h-[760px] w-full overflow-hidden rounded-b-2xl shadow-lg">
        <img
            src={Banner}
            alt="Promocje gier"
            className="absolute inset-0 w-full h-full object-cover opacity-95"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-[#1C1C1C]/80" />

        <div className="relative z-10 h-full flex flex-col justify-end items-center text-center px-6 pb-10 md:pb-16">
            <motion.h1
            className="text-3xl md:text-6xl font-extrabold text-[#D4A44A] mb-3 drop-shadow-md [text-stroke:_2px_black] [webkit-text-stroke:_2px_black]"
            style={{
                WebkitTextStroke: "2px black",
                color: "#D4A44A",
                paintOrder: "stroke fill",
                textShadow: "0 0 8px rgba(0,0,0,0.5)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            >
            WYKUJ SWÓJ KLUCZ JUŻ DZIŚ
            </motion.h1>

            <motion.p
            className="text-[#D4A44A] text-lg md:text-xl mb-5 drop-shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            >
            Sprawdź nasze promocje do -50% na Black Friday!
            </motion.p>

            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            >
            <Button
                variant="outline"
                className="border-[#D4A44A] !bg-transparent text-[#D4A44A] hover:!bg-[#D4A44A] hover:!text-black transition-all text-lg px-6 py-3"
                onClick={() => navigate({ to: "/products" })}
            >
                Przeglądaj gry
            </Button>
            </motion.div>
        </div>
        </section>
    )
}
