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

export function CarouselPlugin() {
    const plugin = React.useRef(
        Autoplay({ delay: 3000, stopOnInteraction: true })
    )

    const games = [
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
        {
            id: 5,
            name: "Cyberpunk 2077",
            platform: "Steam",
            price: 39.99,
            img: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
        },
        {
            id: 6,
            name: "Red Dead Redemption 2",
            platform: "Rockstar",
            price: 49.99,
            img: "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg",
        },
        {
            id: 7,
            name: "Elden Ring",
            platform: "Steam",
            price: 59.99,
            img: "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg",
        },
        {
            id: 8,
            name: "Assassin’s Creed Mirage",
            platform: "Ubisoft Connect",
            price: 44.99,
            img: "https://cdn.cloudflare.steamstatic.com/steam/apps/3035570/header.jpg",
        },
    ]

    return (
        <div className="py-10 relative">
            <h3 className="text-3xl font-bold text-[#D4A44A] mb-6 tracking-wide">
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
                                    name={game.name}
                                    platform={game.platform}
                                    price={game.price}
                                    img={game.img}
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
