"use client"

import { CarouselPlugin } from "./CarouselSlider"
import { NavigationBar } from "./NavigationBar"
import { Footer } from "./Footer"

export function Home() {
    const user = { isLoggedIn: false, username: "GamerX" }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1C1C1C] to-[#2A2A2A] text-[#F8F8F8]">
            <NavigationBar isLoggedIn={user.isLoggedIn} username={user.username} />
            <main className="flex-1 pt-6">
                <section className="max-w-6xl mx-auto px-4">
                    <CarouselPlugin />
                </section>
            </main>
            <Footer />
        </div>
    )
}
