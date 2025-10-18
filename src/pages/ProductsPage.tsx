"use client"

import { useMatch } from "@tanstack/react-router"
import { GameCard } from "@/components/GameCard"
import { useState, useEffect } from "react"
import { type Filters, FiltersPanel } from "@/components/FiltersPanel"
import { ProductsApi } from "@/api/productsApi"
import type { Product } from "@/api/types/product.types"
import type {FilterParams} from "@/api";

export function ProductsPage() {
    // Sprawdź, która ścieżka została dopasowana
    const categoryMatch = useMatch({ from: '/products/category/$categoryId', shouldThrow: false })
    const platformMatch = useMatch({ from: '/products/platform/$platformId', shouldThrow: false })
    const typeMatch = useMatch({ from: '/products/type/$typeId', shouldThrow: false })

    // Pobierz odpowiednie parametry
    const categoryId = categoryMatch?.params.categoryId
    const platformId = platformMatch?.params.platformId
    const typeId = typeMatch?.params.typeId

    const [games, setGames] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Pobierz gry z API z uwzględnieniem filtrów z URL
    useEffect(() => {
        const fetchGames = async () => {
            setLoading(true)
            setError(null)

            try {
                let allGames: Product[] = []
                let page = 0

                const filterParams: FilterParams = {
                    page,
                    size: 20,
                }

                if (platformId) {
                    filterParams.platformId = platformId
                }

                if (typeId) {
                    filterParams.typeId = typeId
                }

                if (categoryId) {
                    filterParams.categoryId = categoryId
                }

                const data = await ProductsApi.getAll({
                    ...filterParams,
                    page,
                })

                const availableGames = data.content.filter((g: { stock: number }) => g.stock > 0)
                allGames = [...allGames, ...availableGames]
                page++
                setGames(allGames)
            } catch (err) {
                console.error("Błąd pobierania gier:", err)
                setError("Nie udało się pobrać produktów. Spróbuj ponownie później.")
            } finally {
                setLoading(false)
            }
        }

        fetchGames()
    }, [categoryId, platformId, typeId])

    // Dodatkowe filtrowanie przez panel filtrów
    const [filteredGames, setFilteredGames] = useState<Product[]>([])

    useEffect(() => {
        setFilteredGames(games)
    }, [games])

    const handleFilter = (filters: Filters) => {
        setFilteredGames(
            games.filter((game) => {
                const matchPlatform =
                    filters.platforms.length === 0 ||
                    filters.platforms.includes(game.platform.name)

                const matchPrice =
                    game.price >= (filters.priceRange.min ?? 0) &&
                    game.price <= (filters.priceRange.max ?? Infinity)

                return matchPlatform && matchPrice
            })
        )
    }

    const handleClear = () => setFilteredGames(games)

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1C1C1C] to-[#2A2A2A] text-[#F8F8F8]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A44A] mx-auto mb-4"></div>
                    <p className="text-[#B0B0B0]">Ładowanie produktów...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1C1C1C] to-[#2A2A2A] text-[#F8F8F8]">
                <div className="text-center">
                    <p className="text-red-400 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-[#D4A44A] text-[#1C1C1C] rounded hover:bg-[#C4943A] transition"
                    >
                        Spróbuj ponownie
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1C1C1C] to-[#2A2A2A] text-[#F8F8F8]">
            <main className="flex-1 pt-8 pb-12 px-6 max-w-[1800px] mx-auto w-full">
                <div className="flex flex-col lg:flex-row gap-8">
                    <aside className="w-full lg:w-88 flex-shrink-0">
                        <FiltersPanel onFilter={handleFilter} onClear={handleClear} />
                    </aside>

                    <section className="flex-1 min-w-0">
                        <p className="text-[#808080] text-sm mb-8">
                            Znaleziono {filteredGames.length} produktów
                        </p>

                        <div className="grid gap-4 justify-items-center
                                      grid-cols-1
                                      min-[800px]:grid-cols-3
                                      xl:grid-cols-4
                                      2xl:grid-cols-5">
                            {filteredGames.map((game) => (
                                <div key={game.id} className="w-full max-w-[240px]">
                                    <GameCard
                                        name={game.name}
                                        platform={game.platform.name}
                                        price={game.price}
                                        imgId={game.logoId}
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