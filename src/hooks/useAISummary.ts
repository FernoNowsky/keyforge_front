import { useCallback, useEffect, useState } from "react";
import { ReviewsAPI } from "@/api/reviewsApi";
import { toast } from "sonner";

export function useAISummary(productId?: number) {
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(true);

    const loadAISummary = useCallback(async () => {
        if (!productId) return;
        try {
            const summaryData = await ReviewsAPI.getAISummary(productId);
            if (summaryData) setSummary(summaryData.content);
        } catch {
            toast.warning("Nie udało się wczytać opinii AI");
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        loadAISummary();
    }, [loadAISummary]);

    return { summary, loading };
}
