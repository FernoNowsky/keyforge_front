import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { User, Star, ChevronDown } from "lucide-react";
import type { Review } from "@/api/reviewsApi";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface UserData {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface Props {
    reviews: Review[];
    loading: boolean;
    userMap: Record<string, UserData>;
    loadNext: () => void;
    hasMore: boolean;
}

export const ProductReviews = ({ reviews, loading, userMap, loadNext, hasMore }: Props) => {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [open, setOpen] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (contentRef.current) {
            setHeight(contentRef.current.scrollHeight);
        }
    }, [reviews, open]);

    const getUserDisplay = (userId: string) => {
        const user = userMap[userId];
        if (!user) return userId;
        return user.username;
    };

    return (
        <Card className="bg-[#2A2A2A] border-[#3A3A3A] overflow-hidden">
            <CardHeader
                onClick={() => isMobile && setOpen((prev) => !prev)}
                className={`flex justify-between items-center ${
                    isMobile
                        ? "cursor-pointer hover:bg-[#3A3A3A]/20 transition-colors"
                        : ""
                }`}
            >
                <h3 className="text-xl font-bold text-[#F8F8F8]">Opinie użytkowników</h3>

                {isMobile && (
                    <ChevronDown
                        className={`w-5 h-5 text-[#D4A44A] transition-transform duration-300 ${
                            open ? "rotate-180" : "rotate-0"
                        }`}
                    />
                )}
            </CardHeader>

            <div
                style={{
                    maxHeight: isMobile ? (open ? `${height}px` : "0px") : "none",
                    opacity: isMobile ? (open ? 1 : 0) : 1,
                    transition:
                        "max-height 0.5s ease-in-out, opacity 0.3s ease-in-out",
                    overflow: "hidden",
                }}
            >
                <CardContent ref={contentRef} className="space-y-4">
                    {loading ? (
                        <div className="flex justify-center items-center py-10">
                            <div className="w-8 h-8 border-4 border-t-[#D4A44A] border-gray-500 rounded-full animate-spin"></div>
                        </div>
                    ) : reviews.length === 0 ? (
                        <p className="text-[#A0A0A0] text-center">
                            Brak opinii dla tego produktu.
                        </p>
                    ) : (
                        reviews.map((review) => (
                            <div
                                key={review.id}
                                className="bg-gradient-to-br from-[#1C1C1C] to-[#252525] p-5 rounded-xl border border-[#3A3A3A] hover:border-[#D4A44A]/30 transition-all duration-300 shadow-lg"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="bg-[#D4A44A]/20 p-2 rounded-full">
                                        <User className="h-5 w-5 text-[#D4A44A]" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[#F8F8F8] font-semibold text-sm">
                                            {getUserDisplay(review.userId)}
                                        </p>
                                        <p className="text-[#A0A0A0] text-xs">
                                            {new Date(
                                                review.createdAt
                                            ).toLocaleDateString("pl-PL", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${
                                                    i < review.rating
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-gray-600"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-[#F8F8F8] leading-relaxed pl-12">
                                    {review.content}
                                </p>
                            </div>
                        ))
                    )}
                    {hasMore && (
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={loadNext}
                                className="px-4 py-2 bg-[#3A3A3A] text-[#F8F8F8] rounded-lg hover:bg-[#4A4A4A] transition"
                            >
                                {loading ? "Ładowanie..." : "Załaduj więcej"}
                            </button>
                        </div>
                    )}
                </CardContent>
            </div>
        </Card>
    );
};