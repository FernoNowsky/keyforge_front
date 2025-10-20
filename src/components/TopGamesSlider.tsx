"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { GameCard } from "./GameCard"

interface Game {
    id: number
    name: string
    price: number
    logoId: string
    platform: { id: number; name: string }
}

interface TopGamesCarouselProps {
    games: Game[]
}

export function TopGamesCarousel({ games }: TopGamesCarouselProps) {
    const plugin = React.useRef(
        Autoplay({ delay: 3000, stopOnInteraction: true })
    )

    return (
        <div className="py-10 relative">
            <h3 className="text-3xl font-bold text-[#D4A44A] mb-6 tracking-wide text-center">
                Najpopularniejsze Gry
            </h3>
            <Carousel
                plugins={[plugin.current]}
                className="w-full max-w-6xl mx-auto relative z-10"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
            >
                <CarouselContent>
                    {games.map((game) => (
                        <CarouselItem
                            key={game.id}
                            className="basis-auto sm:basis-1/2 md:basis-1/3 lg:basis-1/4 flex justify-center"
                        >
                            <div className="p-1 sm:p-3">
                                <GameCard
                                    id={game.id}
                                    name={game.name}
                                    platform={game.platform.name}
                                    price={game.price}
                                    imgId={game.logoId}
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className=" hidden md:flex text-[#D4A44A] hover:text-[#F8F8F8] transition-all" />
                <CarouselNext className="hidden md:flex text-[#D4A44A] hover:text-[#F8F8F8] transition-all" />

            </Carousel>
        </div>
    )
}
