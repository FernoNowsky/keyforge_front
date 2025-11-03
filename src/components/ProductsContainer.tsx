"use client"

import {useState, useEffect, useRef} from "react"
import { ProductsApi } from "@/api/productsApi"
import type { Product } from "@/api/types/product.types"
import type { Filters } from "@/components/FiltersPanel"
import type { FilterParams } from "@/api"
import { GameCard } from "@/components/GameCard"

export function ProductsContainer({ filters }: { filters: Filters | null }) {

    const [games, setGames] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const prevFiltersRef = useRef<string>("")

    useEffect(() => {
        const filtersString = JSON.stringify(filters ?? {})
        if (prevFiltersRef.current === filtersString) return // brak zmian → nie fetchujemy

        prevFiltersRef.current = filtersString

        const fetchGames = async () => {
            setLoading(true)
            setError(null)
            try {
                const params: FilterParams = {
                    page: 0,
                    size: 20,
                    ...(filters?.platforms?.length ? { platformIds: filters.platforms } : {}),
                    ...(filters?.categories?.length ? { categoryIds: filters.categories } : {}),
                    ...(filters?.types?.length ? { typeIds: filters.types } : {}),
                    ...(filters?.priceRange.min ? { priceMin: filters.priceRange.min } : {}),
                    ...(filters?.priceRange.max ? { priceMax: filters.priceRange.max } : {}),
                    ...(filters?.name ? { filter: filters.name } : "")
                }

                const data = await ProductsApi.getAll(params)
                const availableGames = data.content.filter((g: { stock: number }) => g.stock > 0)
                setGames(availableGames)
            } catch (err) {
                console.error("Błąd pobierania produktów:", err)
                setError("Nie udało się pobrać produktów.")
            } finally {
                setLoading(false)
            }
        }

        fetchGames()
    }, [filters])

    if (loading) return (
        <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#D4A44A]" />
        </div>
    )

    if (error) return <p className="text-center text-red-400">{error}</p>

    return (
        <>
            <p className="text-[#808080] text-sm mb-8">
                Znaleziono {games.length} produktów
            </p>

            <div className="grid gap-4 justify-items-center
                      grid-cols-1
                      min-[800px]:grid-cols-3
                      xl:grid-cols-4
                      2xl:grid-cols-5">
                {games.map((game) => (
                    <div key={game.id} className="w-full max-w-[240px]">
                        <GameCard
                            id={game.id}
                            name={game.name}
                            platform={game.platform.name}
                            price={game.price}
                            imgId={game.logoId}
                            discountPercentage={game.discountPercentage}
                        />
                    </div>
                ))}
            </div>

            {games.length === 0 && (
                <p className="text-center text-[#B0B0B0] mt-10">
                    Brak produktów spełniających wybrane kryteria.
                </p>
            )}
        </>
    )
}