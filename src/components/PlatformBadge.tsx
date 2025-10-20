import { SiSteam, SiUbisoft, SiRockstargames, SiGogdotcom, SiEpicgames, SiPlaystation, SiNintendoswitch } from "react-icons/si"
import { FaXbox } from "react-icons/fa";
import React from "react"

type PlatformBadgeProps = {
    platform: string
}

const platformStyles: Record<
    string,
    { icon: React.ElementType; color: string; textColor?: string; label?: string }
> = {
    steam: { icon: SiSteam, color: "#1b2838", label: "Steam" },
    ubisoft: { icon: SiUbisoft, color: "#0099ff", label: "Ubisoft" },
    "ubisoft connect": { icon: SiUbisoft, color: "#0099ff", label: "Ubisoft" },
    rockstar: { icon: SiRockstargames, color: "#D4A44A", textColor: "black", label: "Rockstar" },
    gog: { icon: SiGogdotcom, color: "#8631A5", label: "GOG" },
    origin: { icon: SiUbisoft, color: "#FF6600", label: "Origin" }, // Brak ikony Origin, więc tymczasowo Ubisoft
    epic: { icon: SiEpicgames, color: "#2A2A2A", label: "Epic Games" },
    "epic games": { icon: SiEpicgames, color: "#2A2A2A", label: "Epic Games" },
    playstation: { icon: SiPlaystation, color: "#003087", label: "PlayStation" },
    ps5: { icon: SiPlaystation, color: "#003087", label: "PlayStation" },
    ps4: { icon: SiPlaystation, color: "#003087", label: "PlayStation" },
    xbox: { icon: FaXbox, color: "#107C10", label: "Xbox" },
    "xbox one": { icon: FaXbox, color: "#107C10", label: "Xbox" },
    "xbox series": { icon: FaXbox, color: "#107C10", label: "Xbox" },
    nintendo: { icon: SiNintendoswitch, color: "#E60012", label: "Nintendo" },
    "nintendo switch": { icon: SiNintendoswitch, color: "#E60012", label: "Switch" },
}

export const PlatformBadge: React.FC<PlatformBadgeProps> = ({ platform }) => {
    if (!platform) return null

    const key = platform.trim().toLowerCase()
    const data = platformStyles[key] || { icon: SiEpicgames, color: "#444", label: platform }

    const Icon = data.icon
    const textColor = data.textColor || "white"

    return (
        <span
            className="flex items-center gap-1 text-[10px] px-2 py-[2px] rounded-md shadow"
            style={{ backgroundColor: data.color, color: textColor }}
        >
            <Icon size={12} />
            {data.label}
        </span>
    )
}
