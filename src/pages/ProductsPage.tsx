"use client"

import { useState, useEffect, useCallback } from "react"
import { FiltersPanel, type Filters } from "@/components/FiltersPanel"
import { ProductsContainer } from "@/components/ProductsContainer"
import { useMatch, useLocation } from "@tanstack/react-router"

export function ProductsPage() {

    const categoryMatch = useMatch({ from: '/products/category/$categoryId', shouldThrow: false })
    const platformMatch = useMatch({ from: '/products/platform/$platformId', shouldThrow: false })
    const typeMatch = useMatch({ from: '/products/type/$typeId', shouldThrow: false })
    const initialCategoryIds = categoryMatch?.params.categoryId
    const initialPlatformIds = platformMatch?.params.platformId
    const initialTypeIds = typeMatch?.params.typeId
    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const initialName = params.get("name") ?? ""
    const initialFilters: Filters = {
        name: initialName ? initialName : "",
        platforms: initialPlatformIds ? [initialPlatformIds] : [],
        categories: initialCategoryIds ? [initialCategoryIds] : [],
        types: initialTypeIds ? [initialTypeIds] : [],
        priceRange: { min: null, max: null }
    }

    const [filters, setFilters] = useState<Filters | null>(initialFilters)
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(initialFilters.platforms)
    const [selectedCategories, setSelectedCategories] = useState<string[]>(initialFilters.categories)
    const [selectedTypes, setSelectedTypes] = useState<string[]>(initialFilters.types)
    const [minPrice, setMinPrice] = useState<string>("")
    const [maxPrice, setMaxPrice] = useState<string>("")

    useEffect(() => {
        const newFilters: Filters = {
            name: initialName ? initialName : "",
            platforms: initialPlatformIds ? [initialPlatformIds] : [],
            categories: initialCategoryIds ? [initialCategoryIds] : [],
            types: initialTypeIds ? [initialTypeIds] : [],
            priceRange: {
                min: null,
                max: null
            }
        }
        setFilters(newFilters)
        setSelectedPlatforms(newFilters.platforms)
        setSelectedCategories(newFilters.categories)
        setSelectedTypes(newFilters.types)
    }, [initialName, initialPlatformIds, initialCategoryIds, initialTypeIds])

    const handleFilter = useCallback((newFilters: Filters) => {
        setFilters(newFilters)
        setSelectedPlatforms(newFilters.platforms)
        setSelectedCategories(newFilters.categories)
        setSelectedTypes(newFilters.types)
        setMinPrice(newFilters.priceRange.min?.toString() ?? "")
        setMaxPrice(newFilters.priceRange.max?.toString() ?? "")
    }, [])

    const handleClear = useCallback(() => {
        setFilters(null)
        setSelectedPlatforms([])
        setSelectedCategories([])
        setSelectedTypes([])
        setMinPrice("")
        setMaxPrice("")
    }, [])

    return (
        <div className="min-h-screen flex flex-col bg-[#1C1C1C] text-[#F8F8F8]">
            <main className="flex-1 pt-8 pb-12 px-6 max-w-[1800px] mx-auto w-full">
                <div className="flex flex-col lg:flex-row gap-8">
                    <aside className="w-full lg:w-88 flex-shrink-0">
                        <FiltersPanel
                            onFilter={handleFilter}
                            onClear={handleClear}
                            initialPlatformIds={initialPlatformIds ? [initialPlatformIds] : []}
                            initialCategoryIds={initialCategoryIds ? [initialCategoryIds] : []}
                            initialTypeIds={initialTypeIds ? [initialTypeIds] : []}
                            initialName={initialName ? initialName : ""}
                            // Przekaż kontrolowane wartości
                            controlledPlatforms={selectedPlatforms}
                            controlledCategories={selectedCategories}
                            controlledTypes={selectedTypes}
                            controlledMinPrice={minPrice}
                            controlledMaxPrice={maxPrice}
                        />
                    </aside>

                    <section className="flex-1 min-w-0">
                        <ProductsContainer filters={filters} />
                    </section>
                </div>
            </main>
        </div>
    )
}