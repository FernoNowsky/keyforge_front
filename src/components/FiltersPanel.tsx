"use client"

import { useState, useEffect } from "react"
import { X, SlidersHorizontal } from "lucide-react"
import {type Category, type Platform, type ProductType} from "@/api";
import {ProductTypeApi} from "@/api/productTypeApi";
import {CategoriesApi} from "@/api/categoriesApi";
import {PlatformsApi} from "@/api/platformsApi";
import {FilterButton} from "@/components/FilterButton"
import {FilterSection} from "@/components/FilterSection";

// Animacja dla mobilnego slide-in
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
}

interface FilterContentProps {
    platforms: Platform[]
    categories: Category[]
    types: ProductType[]
    selectedPlatforms: string[]
    setSelectedPlatforms: (v: string[]) => void
    selectedCategories: string[]
    setSelectedCategories: (v: string[]) => void
    selectedTypes: string[]
    setSelectedTypes: (v: string[]) => void
    minPrice: string
    setMinPrice: (v: string) => void
    maxPrice: string
    setMaxPrice: (v: string) => void
    priceError: string
    setPriceError: (v: string) => void
    handleApply: () => void
    handleClear: () => void
    toggleSelection: (value: number, list: string[], setter: (v: string[]) => void) => void
}

const FilterContent = ({
                           platforms,
                           categories,
                           types,
                           selectedPlatforms,
                           setSelectedPlatforms,
                           selectedCategories,
                           setSelectedCategories,
                           selectedTypes,
                           setSelectedTypes,
                           minPrice,
                           setMinPrice,
                           maxPrice,
                           setMaxPrice,
                           priceError,
                           setPriceError,
                           handleApply,
                           handleClear,
                           toggleSelection,
                       }: FilterContentProps) => (
    <>
        <FilterSection title="Platformy">
            {platforms.map((p) => (
                <FilterButton
                    key={p.id}
                    label={p.name}
                    selected={selectedPlatforms.includes(String(p.id))}
                    onClick={() => toggleSelection(p.id, selectedPlatforms, setSelectedPlatforms)}
                />
            ))}
        </FilterSection>

        <FilterSection title="Kategorie">
            {categories.map((g) => (
                <FilterButton
                    key={g.id}
                    label={g.name}
                    selected={selectedCategories.includes(String(g.id))}
                    onClick={() => toggleSelection(g.id, selectedCategories, setSelectedCategories)}
                />
            ))}
        </FilterSection>

        <FilterSection title="Typ gry">
            {types.map((t) => (
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
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => {
                            const value = e.target.value
                            if (value === "" || /^\d*\.?\d*$/.test(value)) {
                                setMinPrice(value)
                                setPriceError("")
                            }
                        }}
                        className="w-full px-3 py-2 bg-[#1C1C1C] border border-[#555] rounded-md text-[#F8F8F8] text-sm focus:border-[#D4A44A] focus:outline-none"
                    />
                    <span className="text-[#F8F8F8]">-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => {
                            const value = e.target.value
                            if (value === "" || /^\d*\.?\d*$/.test(value)) {
                                setMaxPrice(value)
                                setPriceError("")
                            }
                        }}
                        className="w-full px-3 py-2 bg-[#1C1C1C] border border-[#555] rounded-md text-[#F8F8F8] text-sm focus:border-[#D4A44A] focus:outline-none"
                    />
                </div>
                {priceError && <p className="text-red-400 text-xs">{priceError}</p>}
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
            <button
                type="button"
                onClick={handleApply}
                className="border border-[#D4A44A] bg-[#D4A44A] text-[#1C1C1C] font-semibold py-2 rounded-md hover:bg-[#e1b85c] transition"
            >
                Filtruj
            </button>
        </div>

    </>
)

export function FiltersPanel({ onFilter, onClear }: FiltersPanelProps) {
    const [platforms, setPlatforms] = useState<Platform[]>([])
    const [categories, setcategories] = useState<Category[]>([])
    const [types, setTypes] = useState<ProductType[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [selectedTypes, setSelectedTypes] = useState<string[]>([])
    const [minPrice, setMinPrice] = useState<string>("")
    const [maxPrice, setMaxPrice] = useState<string>("")
    const [priceError, setPriceError] = useState<string>("")
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

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
                setcategories(categoryRes.content ?? categoryRes)
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

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener("resize", checkMobile)
        return () => window.removeEventListener("resize", checkMobile)
    }, [])

    useEffect(() => {
        document.body.style.overflow = isMobileOpen && isMobile ? "hidden" : "unset"
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isMobileOpen, isMobile])

    const toggleSelection = (id: number, list: string[], setter: (v: string[]) => void) => {
        const idStr = id.toString()
        setter(list.includes(idStr) ? list.filter((v) => v !== idStr) : [...list, idStr])
    }


    const handleApply = () => {
        const min = minPrice ? parseFloat(minPrice) : null
        const max = maxPrice ? parseFloat(maxPrice) : null

        if (min !== null && max !== null && min >= max) {
            setPriceError("Minimalna cena musi być niższa od maksymalnej")
            return
        }

        setPriceError("")

        onFilter({
            platforms: selectedPlatforms,
            categories: selectedCategories,
            types: selectedTypes,
            priceRange: { min, max },
        })

        if (isMobile) setIsMobileOpen(false)
    }

    const handleClear = () => {
        setSelectedPlatforms([])
        setSelectedCategories([])
        setSelectedTypes([])
        setMinPrice("")
        setMaxPrice("")
        setPriceError("")
        onClear()
    }

    if (loading)
        return (
            <div className="text-center text-sm text-gray-400 p-6">
                Ładowanie filtrów...
            </div>
        )

    if (error)
        return (
            <div className="text-center text-red-500 p-6 text-sm">
                {error}
            </div>
        )

    if (isMobile) {
        return (
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

                            <div className="p-6">
                                <FilterContent
                                    platforms={platforms}
                                    categories={categories}
                                    types={types}
                                    selectedPlatforms={selectedPlatforms}
                                    setSelectedPlatforms={setSelectedPlatforms}
                                    selectedCategories={selectedCategories}
                                    setSelectedCategories={setSelectedCategories}
                                    selectedTypes={selectedTypes}
                                    setSelectedTypes={setSelectedTypes}
                                    minPrice={minPrice}
                                    setMinPrice={setMinPrice}
                                    maxPrice={maxPrice}
                                    setMaxPrice={setMaxPrice}
                                    priceError={priceError}
                                    setPriceError={setPriceError}
                                    handleApply={handleApply}
                                    handleClear={handleClear}
                                    toggleSelection={toggleSelection}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </>
        )
    }

    return (
        <aside className="w-full bg-[#2A2A2A] rounded-2xl shadow-md p-6 h-fit border border-[#3A3A3A] sticky top-8">
            <h2 className="text-xl font-bold text-[#D4A44A] mb-5 text-center">Filtry</h2>
            <FilterContent
                platforms={platforms}
                categories={categories}
                types={types}
                selectedPlatforms={selectedPlatforms}
                setSelectedPlatforms={setSelectedPlatforms}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                selectedTypes={selectedTypes}
                setSelectedTypes={setSelectedTypes}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                priceError={priceError}
                setPriceError={setPriceError}
                handleApply={handleApply}
                handleClear={handleClear}
                toggleSelection={toggleSelection}
            />
        </aside>
    )
}
