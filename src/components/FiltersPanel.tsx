"use client"

import { useState, useEffect } from "react"
import { X, SlidersHorizontal } from "lucide-react"

// Add keyframes for slide-in animation
if (typeof document !== 'undefined') {
    const style = document.createElement('style')
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
            }
            to {
                transform: translateX(0);
            }
        }
    `
    if (!document.head.querySelector('[data-filter-animation]')) {
        style.setAttribute('data-filter-animation', 'true')
        document.head.appendChild(style)
    }
}

interface FiltersPanelProps {
    onFilter: (filters: Filters) => void
    onClear: () => void
}

export interface Filters {
    platforms: string[]
    genres: string[]
    types: string[]
    priceRange: {
        min: number | null
        max: number | null
    }
}

const Section = ({
                     title,
                     children,
                 }: {
    title: string
    children: React.ReactNode
}) => (
    <div className="py-4 border-b border-[#3A3A3A] last:border-none">
        <h3 className="text-base font-semibold text-[#D4A44A] mb-3">{title}</h3>
        {children}
    </div>
)

const SquareButton = ({
                          label,
                          selected,
                          onClick,
                      }: {
    label: string
    selected: boolean
    onClick: () => void
}) => (
    <button
        onClick={onClick}
        className={`px-3 py-1.5 rounded-md border text-sm mr-2 mb-2 transition-all 
            ${
            selected
                ? "bg-[#D4A44A] text-[#1C1C1C] border-[#D4A44A]"
                : "border-[#555] text-[#F8F8F8] hover:border-[#D4A44A]"
        }`}
    >
        {label}
    </button>
)

interface FilterContentProps {
    selectedPlatforms: string[]
    setSelectedPlatforms: (v: string[]) => void
    selectedGenres: string[]
    setSelectedGenres: (v: string[]) => void
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
    toggleSelection: (value: string, list: string[], setter: (v: string[]) => void) => void
}

const FilterContent = ({
                           selectedPlatforms,
                           setSelectedPlatforms,
                           selectedGenres,
                           setSelectedGenres,
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
        <Section title="Platformy">
            {["Steam", "Rockstar", "Ubisoft Connect", "EA App"].map((platform) => (
                <SquareButton
                    key={platform}
                    label={platform}
                    selected={selectedPlatforms.includes(platform)}
                    onClick={() => toggleSelection(platform, selectedPlatforms, setSelectedPlatforms)}
                />
            ))}
        </Section>

        <Section title="Gatunki">
            {["RPG", "Akcja", "Przygodowa", "Symulacja"].map((genre) => (
                <SquareButton
                    key={genre}
                    label={genre}
                    selected={selectedGenres.includes(genre)}
                    onClick={() => toggleSelection(genre, selectedGenres, setSelectedGenres)}
                />
            ))}
        </Section>

        <Section title="Typ gry">
            {["Gra pełna", "DLC", "Subskrypcja"].map((type) => (
                <SquareButton
                    key={type}
                    label={type}
                    selected={selectedTypes.includes(type)}
                    onClick={() => toggleSelection(type, selectedTypes, setSelectedTypes)}
                />
            ))}
        </Section>

        <Section title="Zakres cenowy">
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
                {priceError && (
                    <p className="text-red-400 text-xs">{priceError}</p>
                )}
            </div>
        </Section>

        <div className="flex flex-col gap-3 mt-6">
            <button
                onClick={handleClear}
                className="border border-[#D4A44A] text-[#D4A44A] py-2 rounded-md hover:bg-[#3A3A3A] transition"
            >
                Wyczyść
            </button>
            <button
                onClick={handleApply}
                className="border border-[#D4A44A] bg-[#D4A44A] text-[#1C1C1C] font-semibold py-2 rounded-md hover:bg-[#e1b85c] transition"
            >
                Filtruj
            </button>
        </div>
    </>
)

export function FiltersPanel({ onFilter, onClear }: FiltersPanelProps) {
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
    const [selectedGenres, setSelectedGenres] = useState<string[]>([])
    const [selectedTypes, setSelectedTypes] = useState<string[]>([])
    const [minPrice, setMinPrice] = useState<string>("")
    const [maxPrice, setMaxPrice] = useState<string>("")
    const [priceError, setPriceError] = useState<string>("")
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1000)
        }

        checkMobile()
        window.addEventListener("resize", checkMobile)

        return () => window.removeEventListener("resize", checkMobile)
    }, [])

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileOpen && isMobile) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }

        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isMobileOpen, isMobile])

    const toggleSelection = (value: string, list: string[], setter: (v: string[]) => void) => {
        setter(
            list.includes(value)
                ? list.filter((v) => v !== value)
                : [...list, value]
        )
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
            genres: selectedGenres,
            types: selectedTypes,
            priceRange: {
                min,
                max
            }
        })

        // Close mobile menu after applying filters
        if (isMobile) {
            setIsMobileOpen(false)
        }
    }

    const handleClear = () => {
        setSelectedPlatforms([])
        setSelectedGenres([])
        setSelectedTypes([])
        setMinPrice("")
        setMaxPrice("")
        setPriceError("")
        onClear()

        // Close mobile menu after clearing
        if (isMobile) {
            setIsMobileOpen(false)
        }
    }

    // Mobile view - show button
    if (isMobile) {
        return (
            <>
                {/* Mobile Filter Button */}
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="w-full bg-[#D4A44A] text-[#1C1C1C] font-semibold py-3 px-4 rounded-lg shadow-lg hover:bg-[#e1b85c] transition-all flex items-center justify-center gap-2"
                >
                    <SlidersHorizontal className="h-5 w-5" />
                    Filtruj gry
                </button>

                {/* Mobile Overlay */}
                {isMobileOpen && (
                    <div className="fixed inset-0 z-50 flex">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsMobileOpen(false)}
                        />

                        {/* Slide-in Panel */}
                        <div className="relative ml-auto w-full max-w-sm bg-[#2A2A2A] h-full overflow-y-auto shadow-2xl transition-transform duration-300 ease-out"
                             style={{ animation: 'slideIn 0.3s ease-out' }}>
                            {/* Header */}
                            <div className="sticky top-0 bg-[#2A2A2A] border-b border-[#3A3A3A] p-4 flex items-center justify-between z-10">
                                <h2 className="text-xl font-bold text-[#D4A44A]">Filtry</h2>
                                <button
                                    onClick={() => setIsMobileOpen(false)}
                                    className="text-[#F8F8F8] hover:text-[#D4A44A] transition p-2"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Filter Content */}
                            <div className="p-6">
                                <FilterContent
                                    selectedPlatforms={selectedPlatforms}
                                    setSelectedPlatforms={setSelectedPlatforms}
                                    selectedGenres={selectedGenres}
                                    setSelectedGenres={setSelectedGenres}
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

    // Desktop view - show sidebar
    return (
        <aside className="w-full bg-[#2A2A2A] rounded-2xl shadow-md p-6 h-fit border border-[#3A3A3A] sticky top-8">
            <h2 className="text-xl font-bold text-[#D4A44A] mb-5 text-center">Filtry</h2>
            <FilterContent
                selectedPlatforms={selectedPlatforms}
                setSelectedPlatforms={setSelectedPlatforms}
                selectedGenres={selectedGenres}
                setSelectedGenres={setSelectedGenres}
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