import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Star, AlertCircle } from "lucide-react";
import { OrdersApi, ReviewsAPI } from "@/api";
import type { Product } from "@/api";
import { toast } from "sonner";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: Product[];
  userId: string | undefined;
  orderId: number;
  onReviewsCompleted?: () => void;
}

interface ReviewState {
  rating: number;
  content: string;
}

export function ReviewDialog({
  open,
  onOpenChange,
  products,
  userId,
  orderId,
  onReviewsCompleted,
}: ReviewDialogProps) {
  const [reviewData, setReviewData] = useState<Record<number, ReviewState>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | undefined>(undefined);

  // Initialize review data when products change
  useEffect(() => {
    const initialData = Object.fromEntries(
      products.map((p) => [p.id, { rating: 0, content: "" }])
    );
    setReviewData(initialData);
    if (products.length > 0) {
      setExpandedItem(products[0].id.toString());
    }
  }, [products]);

  const handleRatingChange = (productId: number, rating: number) => {
    setReviewData((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], rating },
    }));
  };

  const handleContentChange = (productId: number, content: string) => {
    setReviewData((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], content },
    }));
  };

  const validateAllReviews = (): { valid: boolean; missingProducts: string[] } => {
    const missingProducts: string[] = [];

    for (const product of products) {
      const review = reviewData[product.id];
      if (!review || review.rating === 0 || !review.content.trim()) {
        missingProducts.push(product.name);
      }
    }

    return {
      valid: missingProducts.length === 0,
      missingProducts,
    };
  };

  const handleSubmitAll = async () => {
    const validation = validateAllReviews();

    if (!validation.valid) {
      toast.error("Uzupełnij wszystkie opinie", {
        description: `Brakuje opinii dla: ${validation.missingProducts.join(", ")}`,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewPromises = products.map((product) => {
        const review = reviewData[product.id];
        OrdersApi.setReviewed({ orderId })
        return ReviewsAPI.createReview({
          productId: product.id,
          userId,
          rating: review.rating,
          content: review.content,
          valid: true,
        });
      });

      await Promise.all(reviewPromises);

      toast.success("Wszystkie opinie zostały dodane!");

      if (onReviewsCompleted) {
        onReviewsCompleted();
      }

      // Close dialog after short delay
      setTimeout(() => {
        onOpenChange(false);
      }, 500);
    } catch (err) {
      toast.error("Nie udało się dodać opinii.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProductReviewStatus = (productId: number) => {
    const review = reviewData[productId];
    if (!review) return "empty";
    if (review.rating === 0 || !review.content.trim()) return "incomplete";
    return "complete";
  };

  const completedCount = products.filter(
    (p) => getProductReviewStatus(p.id) === "complete"
  ).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1F1F1F] border-[#3A3A3A] text-white max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#D4A44A] text-xl">
            Wystaw opinie dla zamówienia #{orderId}
          </DialogTitle>
          <p className="text-gray-400 text-sm mt-2">
            Oceń każdą grę z tego zamówienia ({completedCount}/{products.length}{" "}
            ukończonych)
          </p>
        </DialogHeader>

        <Accordion
          type="single"
          collapsible
          className="w-full mt-4"
          value={expandedItem}
          onValueChange={setExpandedItem}
        >
          {products.map((product) => {
            const review = reviewData[product.id];
            const status = getProductReviewStatus(product.id);

            return (
              <AccordionItem
                key={product.id}
                value={product.id.toString()}
                className="border-[#3A3A3A]"
              >
                <AccordionTrigger className="hover:no-underline text-left pr-4">
                  <div className="flex items-center justify-between w-full pr-4">
                    <span className="ml-4 text-white">{product.name}</span>
                    {status === "complete" ? (
                      <span className="text-green-400 text-sm flex items-center gap-1">
                        <span className="text-lg">✓</span> Gotowe
                      </span>
                    ) : status === "incomplete" ? (
                      <span className="text-yellow-400 text-sm flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" /> Niekompletne
                      </span>
                    ) : (
                      <span className="text-gray-500 text-sm">Do uzupełnienia</span>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4 pb-2 px-2">
                  <div>
                    <label className="text-gray-400 text-sm block mb-2">
                      Ocena {review?.rating > 0 && `(${review.rating}/5)`}
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingChange(product.id, star)}
                          className="!bg-transparent transition-colors hover:scale-110"
                        >
                          <Star
                            className={`h-8 w-8 ${
                              review?.rating >= star
                                ? "fill-[#D4A44A] text-[#D4A44A]"
                                : "text-gray-600 hover:text-gray-500"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm block mb-2">
                      Treść opinii
                    </label>
                    <textarea
                      value={review?.content || ""}
                      onChange={(e) =>
                        handleContentChange(product.id, e.target.value)
                      }
                      rows={4}
                      placeholder="Napisz swoją opinię o grze..."
                      className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-md px-3 py-2 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D4A44A]"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {review?.content?.length || 0} znaków
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        {completedCount < products.length && (
          <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-md flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-yellow-400 text-sm">
              Musisz uzupełnić opinie dla wszystkich {products.length} gier, aby
              móc je wysłać.
            </p>
          </div>
        )}

        <DialogFooter className="gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="bg-transparent border-[#3A3A3A] text-white hover:!bg-[#2A2A2A]/30"
          >
            Anuluj
          </Button>
          <Button
            onClick={handleSubmitAll}
            disabled={isSubmitting || completedCount < products.length}
            className="bg-[#D4A44A] text-black hover:!bg-[#B8873D] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "Wysyłanie..."
              : `Wyślij wszystkie opinie (${completedCount}/${products.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}