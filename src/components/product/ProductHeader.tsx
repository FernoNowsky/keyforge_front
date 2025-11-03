import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { PlatformBadge } from "@/components/PlatformBadge";
import type { DetailedProduct } from "@/api/types/product.types";

interface Props {
    product: DetailedProduct;
    averageRating: number;
    totalReviews: number;
}

export const ProductHeader = ({ product, averageRating, totalReviews }: Props) => (
    <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
        <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="relative flex-shrink-0">
                    <img
                        src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${product.logoId}/header.jpg`}
                        alt={product.name}
                        className="w-full md:w-80 h-[200px] rounded-lg shadow-lg"
                    />
                    {product.discountPercentage > 0 && (
                        <div className="absolute top-2 right-2 bg-[#D4A44A] text-black px-3 py-1 rounded-md font-bold text-sm shadow-lg">
                            -{product.discountPercentage}%
                        </div>
                    )}
                    <div className="flex items-center gap-2 pt-2 border-t border-[#3A3A3A] justify-center">
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-5 w-5 ${i < Math.round(averageRating)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-600"}`}
                                />
                            ))}
                        </div>
                        <span className="text-[#F8F8F8] text-base font-semibold">
              {averageRating.toFixed(1)}
            </span>
                        <span className="text-[#A0A0A0] text-sm">({totalReviews} opinii)</span>
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-between gap-4">
                    <h1 className="!md:text-4xl !text-2xl  font-bold text-[#D4A44A]">{product.name}</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                        <div>
                            <p className="text-[#A0A0A0] md:text-lg text-sm font-medium mb-1">Producent</p>
                            <Badge className="bg-[#3A3A3A] text-[#F8F8F8] border-[#4A4A4A] hover:bg-[#4A4A4A] px-3 py-1.5 rounded-lg">{product.producent.name}</Badge>
                        </div>
                        <div>
                            <p className="text-[#A0A0A0] md:text-lg text-sm font-medium mb-1">Platforma</p>
                            <div className="scale-125 ml-2 w-[75px] mt-2"> <PlatformBadge platform={product.platform.name} /> </div>
                        </div>
                        <div>
                            <p className="text-[#A0A0A0] md:text-lg text-sm font-medium mb-1">Typ</p>
                            <Badge className="bg-[#3A3A3A] text-[#F8F8F8] border-[#4A4A4A] hover:bg-[#4A4A4A] px-3 py-1.5 rounded-lg">{product.type.name}</Badge>
                        </div>
                        <div>
                            <p className="text-[#A0A0A0] md:text-lg text-sm font-medium mb-1">Kategorie</p>
                            <div className="flex flex-wrap gap-2">
                                {product.categories.map(c => (
                                    <Badge key={c.id} className="bg-[#D4A44A]/25 text-[#D4A44A] border-[#D4A44A]/50">
                                        {c.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
);
