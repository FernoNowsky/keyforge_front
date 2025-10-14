"use client"

import { NavigationBar } from "@/components/NavigationBar"
import { Footer } from "@/components/Footer"
import { TopGamesCarousel } from "@/components/TopGamesSlider"
import { NewGamesSection } from "@/components/NewGamesSection"

export function Home() {
    const user = { isLoggedIn: false, username: "GamerX" }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1C1C1C] to-[#2A2A2A] text-[#F8F8F8] overflow-x-hidden">
            <NavigationBar isLoggedIn={user.isLoggedIn} username={user.username} />
            <main className="flex-1 pt-6 space-y-12">
                <section className="mx-auto px-4">
                    <TopGamesCarousel />
                </section>
                <NewGamesSection />
            </main>
            <Footer />
        </div>
    )
}
