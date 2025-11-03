import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Loader2, AlertTriangle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { type Product, ProductsApi, type Review, ReviewsAPI } from "@/api";
import { toast } from "sonner";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [totalReviews, setTotalReviews] = useState(0);
  const [productsMap, setProductsMap] = useState<Record<number, Product>>({});
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const PAGE_SIZE = 10;
  const userId = 1; // TODO: get userid or use token later

  // Refs to avoid unnecessary deps and race conditions
  const productsMapRef = useRef<Record<number, Product>>({});
  const isFetchingRef = useRef<Record<number, boolean>>({}); // per-page fetch guard
  const mountedRef = useRef(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchReviewsPage = useCallback(
    async (pageToLoad: number) => {
      if (isFetchingRef.current[pageToLoad]) return;
      isFetchingRef.current[pageToLoad] = true;
      setReviewsLoading(true);
      setError(false);

      try {
        const reviewData = await ReviewsAPI.getByUserId(userId, {
          page: pageToLoad,
          size: PAGE_SIZE,
        });
        const newReviews = reviewData.content ?? [];
        const total = reviewData.totalElements ?? 0;

        setReviews((prev) => {
          const existingIds = new Set(prev.map((r) => r.id));
          const merged = [
            ...prev,
            ...newReviews.filter((r) => !existingIds.has(r.id)),
          ];
          return merged;
        });
        setTotalReviews(total);

        const loadedSoFar = (pageToLoad + 1) * PAGE_SIZE;
        setHasMore(loadedSoFar < total);

        const requiredProductIds = Array.from(
          new Set(newReviews.map((r) => r.productId)),
        );
        const missingIds = requiredProductIds.filter(
          (id) => !productsMapRef.current[id],
        );

        if (missingIds.length > 0) {
          const products = await ProductsApi.getByIds(missingIds, false);
          setProductsMap((prev) => {
            const next = { ...prev };
            for (const p of products) next[p.id] = p;
            productsMapRef.current = next;
            return next;
          });
        }
      } catch (err) {
        console.error("Błąd podczas pobierania recenzji:", err);
        toast.warning("Nie udało się wczytać opinii użytkownika");
        setError(true);
      } finally {
        isFetchingRef.current[pageToLoad] = false;
        setReviewsLoading(false);
      }
    },
    [PAGE_SIZE, userId],
  );

  useEffect(() => {
    // mountedRef handling to avoid double-fetch in React.StrictMode dev
    if (mountedRef.current) return;
    mountedRef.current = true;

    // load first page
    fetchReviewsPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // load next pages when `page` increments (page 0 already loaded above)
  useEffect(() => {
    if (page === 0) return; // page 0 is already loaded in initial effect
    fetchReviewsPage(page);
  }, [page, fetchReviewsPage]);

  // intersection observer to trigger next page load
  useEffect(() => {
    if (!hasMore) return;
    const el = observerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !reviewsLoading) {
          setPage((prev) => prev + 1);
        }
      },
      { root: null, rootMargin: "0px", threshold: 0.9 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, reviewsLoading]);

  // retry helper
  const retry = () => {
    setError(false);
    // reset everything and reload from scratch
    setReviews([]);
    setProductsMap({});
    productsMapRef.current = {};
    isFetchingRef.current = {};
    setPage(0);
    setHasMore(true);
    fetchReviewsPage(0);
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#D4A44A]">
            Twoje opinie
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Sprawdź, co napisałeś o swoich grach
          </p>

          {!reviewsLoading && !error && (
            <div className="text-center text-gray-400 text-sm sm:text-base mt-2">
              Napisałeś już{" "}
              <span className="text-[#D4A44A] font-semibold">
                {totalReviews}
              </span>{" "}
              {totalReviews === 1
                ? "opinię"
                : totalReviews < 5
                  ? "opinie"
                  : "opinii"}
            </div>
          )}
        </div>

        {reviewsLoading && reviews.length === 0 && (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin w-10 h-10 text-[#D4A44A]" />
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
            <AlertTriangle className="w-8 h-8 text-[#D4A44A] mb-3" />
            <p>Nie udało się wczytać opinii. Spróbuj ponownie później.</p>
            <button
              onClick={retry}
              className="mt-4 px-4 py-2 bg-[#D4A44A]/20 border border-[#D4A44A]/40 rounded-lg hover:bg-[#D4A44A]/30 transition"
            >
              Spróbuj ponownie
            </button>
          </div>
        )}

        {!error && reviews.length === 0 && !reviewsLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 text-center">
            <Star className="w-10 h-10 text-[#D4A44A] mb-3" />
            <p>Nie dodałeś jeszcze żadnych opinii.</p>
          </div>
        )}

        {!error && reviews.length > 0 && (
          <div className="grid gap-5">
            {reviews.map((review) => {
              const product = productsMap[review.productId];
              return (
                <Card
                  key={review.id}
                  className="bg-[#1F1F1F] border-[#3A3A3A] hover:border-[#D4A44A]/50 hover:scale-[1.02] transition-all duration-200"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">
                          {product
                            ? product.name
                            : `Produkt #${review.productId}`}
                        </h3>

                        <div className="flex items-center gap-3">
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_4px_rgba(212,164,74,0.6)]"
                                    : "text-gray-600"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString(
                              "pl-PL",
                            )}
                          </span>
                        </div>
                      </div>

                      <Badge
                        className={`text-xs px-2 py-0.5 border ${
                          review.status === "APPROVED"
                            ? "bg-green-500/20 text-green-400 border-green-500/50"
                            : review.status === "PENDING"
                              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                              : "bg-red-500/20 text-red-400 border-red-500/50"
                        }`}
                      >
                        {review.status === "PENDING"
                          ? "Oczekiwanie"
                          : review.status === "APPROVED"
                            ? "Zaakceptowana"
                            : "Odrzucona"}
                      </Badge>
                    </div>

                    <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                      {review.content}
                    </p>
                  </CardContent>
                </Card>
              );
            })}

            {/* sentinel element observed by IntersectionObserver */}
            <div ref={observerRef} className="flex justify-center py-6">
              {hasMore && (
                <Loader2 className="animate-spin w-6 h-6 text-[#D4A44A]" />
              )}
              {!hasMore && (
                <div className="text-sm text-gray-400">
                  Brak dalszych opinii
                </div>
              )}
            </div>
          </div>
        )}
        {/* ℹ️ Sekcja informacyjna */}
        <Card className="bg-gradient-to-br from-[#2A2A2A] to-[#1C1C1C] border-[#3A3A3A] shadow-md hover:shadow-[#D4A44A]/20 transition-all duration-300">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="bg-[#D4A44A]/20 p-3 rounded-xl flex items-center justify-center">
              <Star className="h-6 w-6 text-[#D4A44A]" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-semibold text-white mb-2">
                Twój wkład ma znaczenie ⭐
              </h3>
              <p className="text-sm text-gray-300">
                Każda opinia jest analizowana przez nasz system AI, który
                automatycznie wykrywa wulgaryzmy i spam. AI pomaga też tworzyć
                streszczenia opinii, aby inni mogli szybciej znaleźć
                interesujące recenzje.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
