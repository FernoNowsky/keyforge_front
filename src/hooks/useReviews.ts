import { useCallback, useEffect, useState } from "react";
import { ReviewsAPI, type Review } from "@/api/reviewsApi";
import { toast } from "sonner";

export function useReviews(productId?: number) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [totalReviews, setTotalReviews] = useState(0);
    const [loading, setLoading] = useState(true);

    const loadReviews = useCallback(async () => {
        if (!productId) return;
        try {
            const data = await ReviewsAPI.getByProductId(productId);
            if (data) {
                setReviews(data.content);
                setTotalReviews(data.totalElements);
            }
        } catch {
            toast.warning("Nie udało się wczytać opinii produktu");
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        loadReviews();
    }, [loadReviews]);

    const averageRating =
        reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

    return { reviews, totalReviews, averageRating, loading };
}
