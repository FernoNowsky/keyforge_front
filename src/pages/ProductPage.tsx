import { useCallback, useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, AlertCircle, User, CheckCircle } from "lucide-react";
import { PlatformBadge } from "@/components/PlatformBadge";
import { ProductsApi } from "@/api/productsApi";
import type { DetailedProduct } from "@/api/types/product.types";
import { useMatch } from "@tanstack/react-router";
import type { CartItem } from "@/components/GameCard";
import { toast } from "sonner";
import { ReviewsAPI, type Review } from "@/api/reviewsApi";

//TODO: GET summary from AI-service
const aiSummary =
  "Gra otrzymuje bardzo pozytywne oceny od graczy. Użytkownicy szczególnie chwalą grafikę najnowszej generacji, rozbudowaną rozgrywkę oraz możliwość zabawy zarówno w trybie single jak i multiplayer. Niektórzy wskazują na wysokie wymagania sprzętowe.";

export function ProductPage() {
  const [product, setProduct] = useState<DetailedProduct | undefined>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const match = useMatch({ from: "/products/$productId", shouldThrow: false });
  const productId = match?.params?.productId;

  const loadProduct = useCallback(async () => {
    try {
      if (!productId) return;
      const productData = await ProductsApi.getById(Number(productId));
      setProduct(productData);
    } catch (error) {
      console.error("Błąd podczas pobierania danych o produkcie:", error);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

const loadReviews = useCallback(async () => {
  if (!productId) return;

  try {
    setReviewsLoading(true);
    const reviewData = await ReviewsAPI.getByProductId(Number(productId));
    setReviews(reviewData.content);
    setTotalReviews(reviewData.totalElements);
  } catch (error) {
    console.error("Błąd podczas pobierania danych o opiniach:", error);
    toast.warning("Nie udało się wczytać opinii produktu");
  } finally {
    setReviewsLoading(false);
  }
}, [productId]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  useEffect(() => {
  loadReviews();
}, [loadReviews]);

  useEffect(() => {
    const avg =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    setAverageRating(avg);
  }, [reviews]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-[#D4A44A]">
        Ładowanie produktu...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-400">
        Nie znaleziono produktu.
      </div>
    );
  }

  const discountedPrice =
    product.price * (1 - product.discountPercentage / 100);

  const getStockStatus = () => {
    if (product.stock === 0) {
      return {
        text: "Niedostępne",
        color: "text-red-400",
        bgColor: "bg-red-500/20 border-red-500/50",
      };
    } else if (product.stock < 10) {
        // TODO: Check amount in cart and block button if its equal product.stock
      return {
        text: `Mała dostępność (${product.stock} szt.)`,
        color: "text-orange-400",
        bgColor: "bg-orange-500/20 border-orange-500/50",
      };
    }
    return {
      text: `Dostępne`,
      color: "text-green-400",
      bgColor: "bg-green-500/20 border-green-500/50",
    };
  };

  const stockStatus = getStockStatus();

  const handleAddToCart = (p: DetailedProduct) => {
  try {
    const cartData = localStorage.getItem("gameCart");
    const cart = cartData ? JSON.parse(cartData) : [];
    const existingItemIndex = cart.findIndex(
      (item: CartItem) => item.id === p.id
    );

    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({
        id: p.id,
        imgId: p.logoId,
        name: p.name,
        platform: p.platform.name,
        price: p.price,
        quantity: 1,
      });
    }

    localStorage.setItem("gameCart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success(`Dodano produkt ${p.name} do koszyka`);

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);

  } catch (error) {
    console.error("Błąd dodawania do koszyka:", error);
    toast.warning("Wystąpił błąd podczas dodawania produktu do koszyka");
  }
};

  return (
    <div className="min-h-screen bg-[#1C1C1C] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
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
                            className={`h-5 w-5 ${
                              i < Math.round(averageRating)
                                ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_4px_rgba(212,164,74,0.6)]"
                                : "text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[#F8F8F8] text-base font-semibold">
                        {reviews.length > 0 ? averageRating.toFixed(1) : ""}
                      </span>
                      <span className="text-[#A0A0A0] text-sm">
                        ({totalReviews} opinii)
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between gap-4">
                    <h1 className="!text-3xl font-bold text-[#D4A44A]">
                      {product.name}
                    </h1>

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                      <div className="flex items-start gap-3">
                        <div>
                          <span className="block text-[#A0A0A0] text-lg mb-1 font-medium">
                            Producent
                          </span>
                          <Badge className="bg-[#3A3A3A] text-[#F8F8F8] border-[#4A4A4A] hover:bg-[#4A4A4A] px-3 py-1.5 rounded-lg">
                            {product.producent.name}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div>
                          <span className="block text-[#A0A0A0] text-lg mb-1 font-medium mb-2">
                            Platforma
                          </span>
                          <div className="scale-125 ml-2">
                            <PlatformBadge platform={product.platform.name} />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div>
                          <span className="block text-[#A0A0A0] text-lg mb-1 font-medium">
                            Typ
                          </span>
                          <Badge className="bg-[#3A3A3A] text-[#F8F8F8] border-[#4A4A4A] hover:bg-[#4A4A4A] px-3 py-1.5 rounded-lg">
                            {product.type.name}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div>
                          <span className="block text-[#A0A0A0] text-lg mb-1 font-medium">
                            Kategorie
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {product.categories.map((cat) => (
                              <Badge
                                key={cat.id}
                                className="bg-[#D4A44A]/25 text-[#D4A44A] border-[#D4A44A]/50 hover:bg-[#D4A44A]/35 px-3 py-1.5 rounded-lg"
                              >
                                {cat.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
              <CardHeader>
                <h2 className="text-xl font-semibold text-[#F8F8F8]">
                  Opis produktu
                </h2>
              </CardHeader>
              <CardContent>
                <p className="text-[#A0A0A0] leading-relaxed">
                  {product.descriptionPl}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#D4A44A]/10 to-[#2A2A2A] border-[#D4A44A]/30">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="bg-[#D4A44A]/20 p-2 rounded-lg">
                    <Star className="h-5 w-5 text-[#D4A44A]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#F8F8F8]">
                    Podsumowanie opinii AI
                  </h3>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-[#F8F8F8] leading-relaxed italic">
                  "{aiSummary}"
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
  <CardHeader>
    <h3 className="text-xl font-bold text-[#F8F8F8]">
      Opinie użytkowników
    </h3>
  </CardHeader>
  <CardContent className="space-y-4">
    {reviewsLoading ? (
      <div className="flex justify-center items-center py-10">
        <div className="w-8 h-8 border-4 border-t-[#D4A44A] border-gray-500 rounded-full animate-spin"></div>
      </div>
    ) : reviews.length === 0 ? (
      <p className="text-[#A0A0A0] text-center">Brak opinii dla tego produktu.</p>
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
                {review.userId}
              </p>
              <p className="text-[#A0A0A0] text-xs">
                {new Date(review.createdAt).toLocaleDateString("pl-PL", {
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
  </CardContent>
</Card>

          </div>

          <div className="lg:col-span-1">
            <Card className="bg-[#2A2A2A] border-[#3A3A3A] sticky top-4">
              <CardContent className="p-6 space-y-6">
                <div>
                  <p className="text-[#A0A0A0] text-sm mb-2">Cena:</p>
                  {product.discountPercentage > 0 ? (
                    <div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-bold text-[#D4A44A]">
                          {discountedPrice.toFixed(2)} PLN
                        </span>
                        <span className="text-xl text-[#A0A0A0] line-through">
                          {product.price.toFixed(2)} PLN
                        </span>
                      </div>
                      <p className="text-green-400 text-sm mt-1">
                        Oszczędzasz {(product.price - discountedPrice).toFixed(2)} PLN!
                      </p>
                    </div>
                  ) : (
                    <span className="text-4xl font-bold text-[#D4A44A]">
                      {product.price.toFixed(2)} PLN
                    </span>
                  )}
                </div>

                <div>
                  <Badge
                    className={`${stockStatus.bgColor} ${stockStatus.color} w-full justify-center py-2 text-sm font-semibold`}
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {stockStatus.text}
                  </Badge>
                </div>

{product.stock > 0 ? (
  <Button
    onClick={() => handleAddToCart(product)}
    variant="outline"
    disabled={addedToCart}
    className={`w-full py-6 text-base font-semibold border-2 transition-all duration-300
      ${addedToCart
        ? "bg-transparent border-[#D4A44A] text-[#D4A44A] hover:scale-100"
        : "bg-[#D4A44A] hover:bg-[#C19440] text-black border-[#D4A44A] hover:scale-105"
      }`}
  >
    {addedToCart ? (
      <>
        <CheckCircle className="w-5 h-5 mr-2" />
        Dodano do koszyka
      </>
    ) : (
      <>
        <ShoppingCart className="w-5 h-5 mr-2" />
        Dodaj do koszyka
      </>
    )}
  </Button>
) : (
  <Button
    disabled
    className="w-full bg-[#3A3A3A] text-[#A0A0A0] cursor-not-allowed py-6 text-base"
  >
    <AlertCircle className="w-5 h-5 mr-2" />
    Produkt niedostępny
  </Button>
)}

                <div className="border-t border-[#3A3A3A] pt-4 space-y-3">
                  <div className="flex items-start gap-3 text-sm">
                    <div className="text-[#D4A44A] mt-1">✓</div>
                    <span className="text-[#A0A0A0]">
                      Natychmiastowa dostawa klucza cyfrowego
                    </span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <div className="text-[#D4A44A] mt-1">✓</div>
                    <span className="text-[#A0A0A0]">Bezpieczna płatność</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <div className="text-[#D4A44A] mt-1">✓</div>
                    <span className="text-[#A0A0A0]">
                      Wsparcie techniczne 24/7
                    </span>
                  </div>
                </div>

                <div className="border-t border-[#3A3A3A] pt-4">
                  <p className="text-[#A0A0A0] text-sm">
                    Data wydania:{" "}
                    <span className="text-[#F8F8F8] font-semibold">
                      {product.releaseDate}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
