import { useCallback, useEffect, useState } from "react";
import { ReviewsAPI, type Review } from "@/api/reviewsApi";
import { toast } from "sonner";

export function useReviews(productId?: number) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [totalReviews, setTotalReviews] = useState(0);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const PAGE_SIZE = 10;

    const loadReviews = useCallback(
        async (requestedPage: number = 0) => {
            if (!productId) return;

            setLoading(true);

            try {
                const data = await ReviewsAPI.getByProductId(productId, {
                    page: requestedPage,
                    size: PAGE_SIZE
                });

                if (requestedPage === 0) {
                    // first load / refresh
                    setReviews(data.content);
                } else {
                    // append next page
                    setReviews(prev => [...prev, ...data.content]);
                }

                setTotalReviews(data.totalElements);
                setHasMore(data.content.length === PAGE_SIZE);
                setPage(requestedPage);
            } catch {
                toast.warning("Nie udało się wczytać opinii produktu");
            } finally {
                setLoading(false);
            }
        },
        [productId]
    );

    useEffect(() => {
        if (productId) {
            loadReviews(0);
        }
    }, [productId]);

    const loadNext = () => {
        if (!loading && hasMore) {
            loadReviews(page + 1);
        }
    };

    const averageRating =
        reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

    return {
        reviews,
        totalReviews,
        averageRating,
        loading,
        loadNext,
        hasMore
    };
}
