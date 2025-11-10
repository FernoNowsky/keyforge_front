import { useMatch } from "@tanstack/react-router";
import { ProductHeader } from "@/components/product/ProductHeader";
import { ProductDescription } from "@/components/product/ProductDescription";
import { ProductAISummary } from "@/components/product/ProductAISummary";
import { ProductReviews } from "@/components/product/ProductReviews";
import { ProductSidebar } from "@/components/product/ProductSidebar";
import { useProduct } from "@/hooks/useProduct";
import { useReviews } from "@/hooks/useReviews";
import { useAISummary } from "@/hooks/useAISummary";
import { useCartStock } from "@/hooks/useCartStock";
import { Loader2 } from "lucide-react";
import { ProductNotFound } from "@/components/product/ProductNotFound";

export function ProductPage() {
    const match = useMatch({ from: "/products/$productId", shouldThrow: false });
    const productId = Number(match?.params?.productId);

    const { product, isLoading } = useProduct(productId);
    const { reviews, totalReviews, averageRating, loading: reviewsLoading } = useReviews(productId);
    const { summary, loading: aiLoading } = useAISummary(productId);
    const cartStock = useCartStock(product);

    if (isLoading) 
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin w-10 h-10 text-[#D4A44A]" />
            </div>
        )

    if (!product) return <ProductNotFound/>;

    return (
        <div className="min-h-screen bg-[#1C1C1C] p-4 md:p-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <ProductHeader product={product} averageRating={averageRating} totalReviews={totalReviews} />
                    <ProductDescription description={product.descriptionPl} />
                    {!aiLoading && <ProductAISummary summary={summary} />}
                    <ProductReviews reviews={reviews} loading={reviewsLoading} />
                </div>
                <ProductSidebar product={product} cartStock={cartStock} />
            </div>
        </div>
    );
}
