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

export function ProductPage() {
    const match = useMatch({ from: "/products/$productId", shouldThrow: false });
    const productId = Number(match?.params?.productId);

    const { product, isLoading } = useProduct(productId);
    const { reviews, totalReviews, averageRating, loading: reviewsLoading } = useReviews(productId);
    const { summary, loading: aiLoading } = useAISummary(productId);
    const cartStock = useCartStock(product);

    if (isLoading) return <div className="text-[#D4A44A]">Ładowanie produktu...</div>;
    if (!product) return <div className="text-red-400">Nie znaleziono produktu.</div>;

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
