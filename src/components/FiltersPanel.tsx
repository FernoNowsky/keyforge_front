"use client"

import { useState, useEffect, useRef } from "react"
import { X, SlidersHorizontal } from "lucide-react"
import { type Category, type Platform, type ProductType } from "@/api"
import { ProductTypeApi } from "@/api/productTypeApi"
import { CategoriesApi } from "@/api/categoriesApi"
import { PlatformsApi } from "@/api/platformsApi"
import { FilterButton } from "@/components/FilterButton"
import { FilterSection } from "@/components/FilterSection"

if (typeof document !== "undefined") {
    const style = document.createElement("style")
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }
    `
    if (!document.head.querySelector("[data-filter-animation]")) {
        style.setAttribute("data-filter-animation", "true")
        document.head.appendChild(style)
    }
}

export interface Filters {
    name?: string
    platforms: string[]
    categories: string[]
    types: string[]
    priceRange: {
        min: number | null
        max: number | null
    }
}

interface FiltersPanelProps {
    onFilter: (filters: Filters) => void
    onClear: () => void
    initialPlatformIds?: string[]
    initialCategoryIds?: string[]
    initialTypeIds?: string[]
    initialName?: string
    controlledPlatforms?: string[]
    controlledCategories?: string[]
    controlledTypes?: string[]
    controlledMinPrice?: string
    controlledMaxPrice?: string
}

export function FiltersPanel({
                                 onFilter,
                                 onClear,
                                 initialPlatformIds = [],
                                 initialCategoryIds = [],
                                 initialTypeIds = [],
                                 initialName,
                                 controlledPlatforms,
                                 controlledCategories,
                                 controlledTypes,
                                 controlledMinPrice,
                                 controlledMaxPrice,
                             }: FiltersPanelProps) {
    const [platforms, setPlatforms] = useState<Platform[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [types, setTypes] = useState<ProductType[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // lokalny stan jeśli brak kontrolowanych wartości
    const [localPlatforms, setLocalPlatforms] = useState<string[]>([])
    const [localCategories, setLocalCategories] = useState<string[]>([])
    const [localTypes, setLocalTypes] = useState<string[]>([])
    const [localMinPrice, setLocalMinPrice] = useState<string>("")
    const [localMaxPrice, setLocalMaxPrice] = useState<string>("")
    const [localName, setLocalName] = useState(initialName ?? "")
    const selectedPlatforms = controlledPlatforms ?? localPlatforms
    const selectedCategories = controlledCategories ?? localCategories
    const selectedTypes = controlledTypes ?? localTypes
    const minPrice = controlledMinPrice ?? localMinPrice
    const maxPrice = controlledMaxPrice ?? localMaxPrice
    const setSelectedPlatforms = controlledPlatforms !== undefined ? () => {} : setLocalPlatforms
    const setSelectedCategories = controlledCategories !== undefined ? () => {} : setLocalCategories
    const setSelectedTypes = controlledTypes !== undefined ? () => {} : setLocalTypes
    const setMinPrice = controlledMinPrice !== undefined ? () => {} : setLocalMinPrice
    const setMaxPrice = controlledMaxPrice !== undefined ? () => {} : setLocalMaxPrice

    const [priceError, setPriceError] = useState<string>("")
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [tempMinPrice, setTempMinPrice] = useState(minPrice)
    const [tempMaxPrice, setTempMaxPrice] = useState(maxPrice)


    // synchronizacja przy zmianie kontrolowanego min/max
    useEffect(() => { setTempMinPrice(minPrice) }, [minPrice])
    useEffect(() => { setTempMaxPrice(maxPrice) }, [maxPrice])
    useEffect(() => {
        setLocalName(initialName ?? "")
    }, [initialName])

    // fetch danych filtrów
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const [platformRes, categoryRes, typeRes] = await Promise.all([
                    PlatformsApi.getAll(),
                    CategoriesApi.getAll(),
                    ProductTypeApi.getAll(),
                ])
                setPlatforms(platformRes.content ?? platformRes)
                setCategories(categoryRes.content ?? categoryRes)
                setTypes(typeRes.content ?? typeRes)
            } catch (err) {
                console.error("Błąd pobierania filtrów:", err)
                setError("Nie udało się załadować filtrów.")
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    // inicjalizacja lokalnych wartości
    const firstInit = useRef(true)
    useEffect(() => {
        if (controlledPlatforms === undefined && firstInit.current) {
            if (initialPlatformIds.length > 0) setLocalPlatforms(initialPlatformIds)
            if (initialCategoryIds.length > 0) setLocalCategories(initialCategoryIds)
            if (initialTypeIds.length > 0) setLocalTypes(initialTypeIds)
            firstInit.current = false
        }
    }, [initialPlatformIds, initialCategoryIds, initialTypeIds, controlledPlatforms])

    // sprawdzanie mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener("resize", checkMobile)
        return () => window.removeEventListener("resize", checkMobile)
    }, [])

    // blokada scrolla w mobile
    useEffect(() => {
        document.body.style.overflow = isMobileOpen && isMobile ? "hidden" : "unset"
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isMobileOpen, isMobile])

    const toggleSelection = (id: number, list: string[], setter: (v: string[]) => void) => {
        const idStr = id.toString()
        const newList = list.includes(idStr) ? list.filter(v => v !== idStr) : [...list, idStr]

        if (controlledPlatforms !== undefined) {
            // tryb kontrolowany
            const filters: Filters = {
                platforms: setter === setSelectedPlatforms ? newList : selectedPlatforms,
                categories: setter === setSelectedCategories ? newList : selectedCategories,
                types: setter === setSelectedTypes ? newList : selectedTypes,
                name: localName,
                priceRange: {
                    min: minPrice ? parseFloat(minPrice) : null,
                    max: maxPrice ? parseFloat(maxPrice) : null,
                },
            }
            onFilter(filters)
        } else {
            setter(newList)
        }
    }

    const applyFilter = (newSelectedPlatforms: string[], newSelectedCategories: string[], newSelectedTypes: string[], newMin: string, newMax: string, name: string) => {
        const filters: Filters = {
            platforms: newSelectedPlatforms,
            categories: newSelectedCategories,
            types: newSelectedTypes,
            name: name,
            priceRange: {
                min: newMin ? parseFloat(newMin) : null,
                max: newMax ? parseFloat(newMax) : null,
            }
        }
        onFilter(filters)
    }

    const applyPriceFilter = () => {
        if (tempMinPrice && tempMaxPrice && parseFloat(tempMinPrice) > parseFloat(tempMaxPrice)) {
            setPriceError("Minimalna cena nie może być większa od maksymalnej")
            return
        }
        setPriceError("")
        if (setMinPrice) setMinPrice(tempMinPrice)
        if (setMaxPrice) setMaxPrice(tempMaxPrice)
        applyFilter(selectedPlatforms, selectedCategories, selectedTypes, tempMinPrice, tempMaxPrice, localName)
    }

    const handleClear = () => {
        if (setSelectedPlatforms) setSelectedPlatforms([])
        if (setSelectedCategories) setSelectedCategories([])
        if (setSelectedTypes) setSelectedTypes([])
        if (setMinPrice) setMinPrice("")
        if (setMaxPrice) setMaxPrice("")
        setTempMinPrice("")
        setTempMaxPrice("")
        setPriceError("")
        setLocalName("")
        onClear()
    }

    const renderFilters = () => (
        <>
            <FilterSection title="Platformy">
                {platforms.map(p => (
                    <FilterButton
                        key={p.id}
                        label={p.name}
                        selected={selectedPlatforms.includes(String(p.id))}
                        onClick={() => toggleSelection(p.id, selectedPlatforms, setSelectedPlatforms)}
                    />
                ))}
            </FilterSection>

            <FilterSection title="Kategorie">
                {categories.map(c => (
                    <FilterButton
                        key={c.id}
                        label={c.name}
                        selected={selectedCategories.includes(String(c.id))}
                        onClick={() => toggleSelection(c.id, selectedCategories, setSelectedCategories)}
                    />
                ))}
            </FilterSection>

            <FilterSection title="Typ gry">
                {types.map(t => (
                    <FilterButton
                        key={t.id}
                        label={t.name}
                        selected={selectedTypes.includes(String(t.id))}
                        onClick={() => toggleSelection(t.id, selectedTypes, setSelectedTypes)}
                    />
                ))}
            </FilterSection>

            <FilterSection title="Zakres cenowy">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Min"
                            value={tempMinPrice}
                            onChange={(e) => {
                                const value = e.target.value
                                if (/^\d*\.?\d*$/.test(value)) setTempMinPrice(value)
                            }}
                            className="w-full px-3 py-2 bg-[#1C1C1C] border border-[#555] rounded-md text-[#F8F8F8] text-sm focus:border-[#D4A44A] focus:outline-none"
                        />
                        <span className="text-[#F8F8F8]">-</span>
                        <input
                            type="text"
                            placeholder="Max"
                            value={tempMaxPrice}
                            onChange={(e) => {
                                const value = e.target.value
                                if (/^\d*\.?\d*$/.test(value)) setTempMaxPrice(value)
                            }}
                            className="w-full px-3 py-2 bg-[#1C1C1C] border border-[#555] rounded-md text-[#F8F8F8] text-sm focus:border-[#D4A44A] focus:outline-none"
                        />
                    </div>
                    {priceError && <p className="text-red-400 text-xs">{priceError}</p>}
                    <button
                        type="button"
                        onClick={applyPriceFilter}
                        className="mt-2 w-full bg-[#D4A44A] text-[#1C1C1C] font-semibold py-2 rounded-md hover:bg-[#e1b85c] transition"
                    >
                        Zastosuj ceny
                    </button>
                </div>
            </FilterSection>

            <div className="flex flex-col gap-3 mt-6">
                <button
                    type="button"
                    onClick={handleClear}
                    className="border border-[#D4A44A] text-[#D4A44A] py-2 rounded-md hover:bg-[#3A3A3A] transition"
                >
                    Wyczyść
                </button>
            </div>
        </>
    )

    if (loading) return <div className="text-center text-sm text-gray-400 p-6">Ładowanie filtrów...</div>
    if (error) return <div className="text-center text-red-500 p-6 text-sm">{error}</div>

    return (
        <>
            {isMobile ? (
                <>
                    <button
                        onClick={() => setIsMobileOpen(true)}
                        className="w-full bg-[#D4A44A] text-[#1C1C1C] font-semibold py-3 px-4 rounded-lg shadow-lg hover:bg-[#e1b85c] transition-all flex items-center justify-center gap-2"
                    >
                        <SlidersHorizontal className="h-5 w-5" />
                        Filtruj gry
                    </button>

                    {isMobileOpen && (
                        <div className="fixed inset-0 z-50 flex">
                            <div
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                onClick={() => setIsMobileOpen(false)}
                            />
                            <div
                                className="relative ml-auto w-full max-w-sm bg-[#2A2A2A] h-full overflow-y-auto shadow-2xl transition-transform duration-300 ease-out"
                                style={{ animation: "slideIn 0.3s ease-out" }}
                            >
                                <div className="sticky top-0 bg-[#2A2A2A] border-b border-[#3A3A3A] p-4 flex items-center justify-between z-10">
                                    <h2 className="text-xl font-bold text-[#D4A44A]">Filtry</h2>
                                    <button
                                        onClick={() => setIsMobileOpen(false)}
                                        className="text-[#F8F8F8] hover:text-[#D4A44A] transition p-2"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                                <div className="p-6">{renderFilters()}</div>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <aside className="w-full bg-[#2A2A2A] rounded-2xl shadow-md p-6 h-fit border border-[#3A3A3A] sticky top-8">
                    <h2 className="text-xl font-bold text-[#D4A44A] mb-5 text-center">Filtry</h2>
                    {renderFilters()}
                </aside>
            )}
        </>
    )
}
