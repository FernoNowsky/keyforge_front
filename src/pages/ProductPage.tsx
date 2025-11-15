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
import { useState, useEffect, useRef } from "react";
import {UsersApi} from "@/api/usersApi.ts";

interface User {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
}

export function ProductPage() {
    const match = useMatch({ from: "/products/$productId", shouldThrow: false });
    const productId = Number(match?.params?.productId);

    const { product, isLoading } = useProduct(productId);
    const { reviews, loadNext, hasMore, loading: reviewsLoading, averageRating, totalReviews } = useReviews(productId);
    const { summary, loading: aiLoading } = useAISummary(productId);
    const cartStock = useCartStock(product);

    const [userMap, setUserMap] = useState<Record<string, User>>({});
    const userCacheRef = useRef<Map<string, User>>(new Map());
    const isFetchingUsersRef = useRef(false);

    useEffect(() => {
        if (!reviews || reviews.length === 0 || isFetchingUsersRef.current) return;

        const fetchMissingUsers = async () => {
            const allUserIds = Array.from(new Set(reviews.map(r => r.userId)));
            const userCache = userCacheRef.current;

            const missingIds = allUserIds.filter(id => !userCache.has(id));

            if (missingIds.length === 0) {
                const newMap: Record<string, User> = {};
                allUserIds.forEach(id => {
                    const u = userCache.get(id);
                    if (u) newMap[id] = u;
                });
                setUserMap(newMap);
                return;
            }

            isFetchingUsersRef.current = true;
            try {
                const newUsers = await UsersApi.getUsersById(missingIds);
                newUsers.forEach(u => userCache.set(u.id, u));

                const updated: Record<string, User> = {};
                allUserIds.forEach(id => {
                    const u = userCache.get(id);
                    if (u) updated[id] = u;
                });

                setUserMap(updated);
            } finally {
                isFetchingUsersRef.current = false;
            }
        };

        fetchMissingUsers();
    }, [reviews]);

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
                    <ProductReviews
                        reviews={reviews}
                        loading={reviewsLoading}
                        userMap={userMap}
                        loadNext={loadNext}
                        hasMore={hasMore}
                    />
                </div>
                <ProductSidebar product={product} cartStock={cartStock} />
            </div>
        </div>
    );
}