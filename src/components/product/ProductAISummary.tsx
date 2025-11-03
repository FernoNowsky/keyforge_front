import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface Props {
    summary?: string;
}

export const ProductAISummary = ({ summary }: Props) => {
    if (!summary || summary.trim() === "") return null;

    return (
        <Card className="bg-gradient-to-br from-[#D4A44A]/10 to-[#2A2A2A] border-[#D4A44A]/30">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <div className="bg-[#D4A44A]/20 p-2 rounded-lg">
                        <Star className="h-5 w-5 text-[#D4A44A]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#F8F8F8]">
                        Podsumowanie opinii AI
                    </h3>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-[#F8F8F8] leading-relaxed italic">"{summary}"</p>
            </CardContent>
        </Card>
    );
};
