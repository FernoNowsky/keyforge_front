"use client"

import { GameCard } from "@/components/GameCard"

interface Game {
    id: number
    name: string
    price: number
    logoId: string
    platform: { id: number; name: string }
}

interface NewGamesSectionProps {
    games: Game[]
}

export function NewGamesSection({ games }: NewGamesSectionProps) {
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
                                id={game.id}
                                name={game.name}
                                platform={game.platform.name}
                                price={game.price}
                                imgId={game.logoId}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
