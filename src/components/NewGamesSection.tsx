"use client"

import { GameCard } from "@/components/GameCard"

export interface Game {
    id: number
    name: string
    platform: string
    price: number
    img: string
}

const games: Game[] = [
    {
        id: 1,
        name: "Cyberpunk 2077",
        platform: "Steam",
        price: 39.99,
        img: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
    },
    {
        id: 2,
        name: "Red Dead Redemption 2",
        platform: "Rockstar",
        price: 49.99,
        img: "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg",
    },
    {
        id: 3,
        name: "Elden Ring",
        platform: "Steam",
        price: 59.99,
        img: "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg",
    },
    {
        id: 4,
        name: "Assassin’s Creed Mirage",
        platform: "Ubisoft Connect",
        price: 44.99,
        img: "https://cdn.cloudflare.steamstatic.com/steam/apps/3035570/header.jpg",
    },
]

export function NewGamesSection() {
    return (
        <section className="mx-auto px-4 bg-[#1C1C1C] py-12">
            <h3 className="text-3xl font-bold text-[#D4A44A] mb-8 tracking-wide text-center">
                Najnowsze Gry
            </h3>

            <div className="flex flex-wrap justify-center gap-7">
                {games.map((game) => (
                    <div key={game.id} className="flex justify-center">
                        <div className="p-1 sm:p-3">
                            <GameCard
                                name={game.name}
                                platform={game.platform}
                                price={game.price}
                                img={game.img}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
