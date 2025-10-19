import React from "react"

interface FilterSectionProps {
    title: string
    children: React.ReactNode
}

export const FilterSection = ({ title, children }: FilterSectionProps) => (
    <div className="py-4 border-b border-[#3A3A3A] last:border-none">
        <h3 className="text-base font-semibold text-[#D4A44A] mb-3">{title}</h3>
        {children}
    </div>
)
