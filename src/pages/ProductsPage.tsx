"use client"

import { useParams } from "@tanstack/react-router"
import { GameCard } from "@/components/GameCard"
import { useState } from "react"
import {type Filters, FiltersPanel } from "@/components/FiltersPanel"

export function ProductsPage() {
    const { category } = useParams({from: '/products/$category' })

    const categoryTitles: Record<string, string> = {
        games: "Gry",
        dlc: "Dodatki (DLC)",
        currencies: "Waluty",
        subscriptions: "Subskrypcje",
    }

    const descriptionMap: Record<string, string> = {
        games: "Pełne wersje gier do pobrania.",
        dlc: "Rozszerzenia, przepustki i DLC.",
        currencies: "Karty i punkty do gier.",
        subscriptions: "PS Plus, Game Pass i inne subskrypcje.",
    }

    const title = categoryTitles[category ?? ""] || "Produkty"

    const allGames = [
        { id: 1, name: "Cyberpunk 2077", platform: "Steam", price: 39.99, img: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg", genre: "RPG", type: "Gra pełna" },
        { id: 2, name: "Red Dead Redemption 2", platform: "Rockstar", price: 49.99, img: "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg", genre: "Przygodowa", type: "Gra pełna" },
        { id: 3, name: "Elden Ring", platform: "Steam", price: 59.99, img: "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg", genre: "RPG", type: "Gra pełna" },
        { id: 4, name: "Assassin’s Creed Mirage", platform: "Ubisoft Connect", price: 44.99, img: "https://cdn.cloudflare.steamstatic.com/steam/apps/3035570/header.jpg", genre: "Akcja", type: "Gra pełna" },
        { id: 5, name: "The Sims 4: Cottage Living", platform: "EA App", price: 29.99, img: "https://cdn.cloudflare.steamstatic.com/steam/apps/1399350/header.jpg", genre: "Symulacja", type: "DLC" },
    ]

    const [filteredGames, setFilteredGames] = useState(allGames)

    const handleFilter = (filters: Filters) => {
        setFilteredGames(
            allGames.filter((game) => {
                const matchPlatform =
                    filters.platforms.length === 0 || filters.platforms.includes(game.platform)
                const matchGenre =
                    filters.genres.length === 0 || filters.genres.includes(game.genre)
                const matchType =
                    filters.types.length === 0 || filters.types.includes(game.type)
                const matchPrice =
                    game.price >= (filters.priceRange.min ?? 0) &&
                    game.price <= (filters.priceRange.max ?? Infinity);
                return matchPlatform && matchGenre && matchType && matchPrice
            })
        )
    }

    const handleClear = () => setFilteredGames(allGames)

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1C1C1C] to-[#2A2A2A] text-[#F8F8F8]">

            <main className="flex-1 pt-8 pb-12 px-6 max-w-[1800px] mx-auto w-full">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Section - Fixed width on desktop */}
                    <aside className="w-full lg:w-88 flex-shrink-0">
                        <FiltersPanel onFilter={handleFilter} onClear={handleClear} />
                    </aside>

                    {/* Products Section - Takes remaining space */}
                    <section className="flex-1 min-w-0">
                        <h1 className="text-3xl font-bold text-[#D4A44A] mb-4">
                            {title}
                        </h1>
                        <p className="text-[#B0B0B0] mb-8">
                            {descriptionMap[category ?? ""] || "Wybierz kategorię produktów."}
                        </p>

                        {/* Dynamic Grid - Cards per row adapt to available space */}
                        <div className="grid gap-4 justify-items-center
                                      grid-cols-1
                                      min-[800px]:grid-cols-3
                                      xl:grid-cols-4
                                      2xl:grid-cols-5">
                            {filteredGames.map((game) => (
                                <div className="w-full max-w-[240px]">
                                    <GameCard
                                        key={game.id}
                                        name={game.name}
                                        platform={game.platform}
                                        price={game.price}
                                        imgId={game.img}
                                    />
                                </div>
                            ))}
                        </div>

                        {filteredGames.length === 0 && (
                            <p className="text-center text-[#B0B0B0] mt-10">
                                Brak produktów spełniających wybrane kryteria.
                            </p>
                        )}
                    </section>
                </div>
            </main>
        </div>
    )
}
