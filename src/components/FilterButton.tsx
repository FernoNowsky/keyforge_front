interface FilterButtonProps {
    label: string
    selected: boolean
    onClick: () => void
}

export const FilterButton = ({ label, selected, onClick }: FilterButtonProps) => (
    <button
        onClick={onClick}
        className={`px-3 py-1.5 rounded-md border text-sm mr-2 mb-2 transition-all ${
            selected
                ? "bg-[#D4A44A] text-[#1C1C1C] border-[#D4A44A]"
                : "border-[#555] text-[#F8F8F8] hover:border-[#D4A44A]"
        }`}
    >
        {label}
    </button>
)
