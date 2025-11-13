"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, Key, X, Check, Loader2, AlertTriangle, Pause, Play } from "lucide-react";
import { PlatformBadge } from "@/components/PlatformBadge";
import { OrdersApi, ProductsApi, type Product } from "@/api";
import type { Order } from "@/api/ordersApi";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "@tanstack/react-router";
import { ReviewDialog } from "@/components/ReviewDialog";
import {useAuth} from "@/hooks/useAuthToken.ts";
import {pointsPerZloty} from "@/assets/loyaltyLevelsData.ts";
import {eventBus} from "@/utils/events.ts";

const statusMap: Record<string, { label: string; className: string }> = {
  READY_FOR_PAYMENT: {
    label: "Przygotowane do płatności",
    className: "bg-blue-500/20 text-blue-400 border-blue-500/40",
  },
  PAID: {
    label: "Opłacone",
    className: "bg-green-500/20 text-green-400 border-green-500/40",
  },
  COMPLETED: {
    label: "Odebrane",
    className: "bg-[#D4A44A]/20 text-[#D4A44A] border-[#D4A44A]",
  },
  CANCELLED: {
    label: "Anulowane",
    className: "bg-red-900/40 text-red-500 border-red-800/50",
  },
  PAYMENT_FAILED: {
    label: "Nieudana płatność",
    className: "bg-red-500/20 text-red-400 border-red-500/40",
  },
};

export default function PurchasesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [orderProducts, setOrderProducts] = useState<Record<number, Product[]>>({});
  
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [reviewProducts, setReviewProducts] = useState<Product[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState(false);
  const [totalOrders, setTotalOrders] = useState(0);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [autoLoadEnabled, setAutoLoadEnabled] = useState(true);

  const PAGE_SIZE = 10;
  const {userId} = useAuth();
  const orderProductsRef = useRef<Record<number, Product[]>>({});
  const loadedProductIdsRef = useRef<Set<number>>(new Set());
  const isFetchingRef = useRef<Record<number, boolean>>({});
  const mountedRef = useRef(false);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const productCacheRef = useRef<Map<number, Product>>(new Map());
  const navigate = useNavigate();

const fetchOrdersPage = useCallback(
  async (pageToLoad: number) => {
    if (isFetchingRef.current[pageToLoad]) return;
    isFetchingRef.current[pageToLoad] = true;
    setOrdersLoading(true);
    setError(false);

    try {
      const data = await OrdersApi.getByUserId(userId, {
        page: pageToLoad,
        size: PAGE_SIZE,
      });

      const raw = data.content ?? [];

      const isOrderWrapper = (obj: unknown): obj is { content: Order } =>
        !!obj && typeof obj === "object" && "content" in obj;

      const newOrders: Order[] = (raw as unknown[]).map((item) =>
        isOrderWrapper(item) ? item.content : (item as Order)
      );

      const total = data.totalElements ?? 0;

      // merge orders
      setOrders((prev) => {
        const existingIds = new Set(prev.map((o) => o.id));
        return [...prev, ...newOrders.filter((o) => !existingIds.has(o.id))];
      });
      setTotalOrders(total);

      const loadedSoFar = (pageToLoad + 1) * PAGE_SIZE;
      setHasMore(loadedSoFar < total);

      // collect all product IDs
      const allProductIds = Array.from(
        new Set(
          newOrders.flatMap((order) =>
            order.orderItems.map((i) => i.productId)
          )
        )
      );

      // determine missing IDs (not yet cached)
      const productCache = productCacheRef.current;
      const missingIds = allProductIds.filter((id) => !productCache.has(id));

      // fetch missing products
      if (missingIds.length > 0) {
        const newProducts = await ProductsApi.getByIds(missingIds, false);
        newProducts.forEach((p) => productCache.set(p.id, p));
        newProducts.forEach((p) => loadedProductIdsRef.current.add(p.id));
      }

      // build mapping order → products
      const productsByOrder: Record<number, Product[]> = {};
      for (const order of newOrders) {
        const products = order.orderItems
          .map((item) => productCache.get(item.productId))
          .filter((p): p is Product => !!p);
        productsByOrder[order.id] = products;
      }

      // update state + refs
      setOrderProducts((prev) => {
        const next = { ...prev, ...productsByOrder };
        orderProductsRef.current = next;
        return next;
      });
    } catch (err) {
      console.error("Błąd pobierania zamówień lub produktów:", err);
      setError(true);
    } finally {
      isFetchingRef.current[pageToLoad] = false;
      setOrdersLoading(false);
    }
  },
  [PAGE_SIZE, userId]
);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    fetchOrdersPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // load next pages
  useEffect(() => {
    if (page === 0) return;
    fetchOrdersPage(page);
  }, [page, fetchOrdersPage]);

  // intersection observer to trigger next page load
  useEffect(() => {
    if (!hasMore || !autoLoadEnabled) return;
    const el = observerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !ordersLoading) {
          setPage((prev) => prev + 1);
        }
      },
      { root: null, rootMargin: "0px", threshold: 0.9 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, ordersLoading, autoLoadEnabled]);

  // retry helper
  const retry = () => {
    setError(false);
    // reset everything and reload from scratch
    setOrders([]);
    setOrderProducts({});
    orderProductsRef.current = {};
    loadedProductIdsRef.current = new Set();
    isFetchingRef.current = {};
    setPage(0);
    setHasMore(true);
    fetchOrdersPage(0);
  };

  const handleExpand = (orderId: number) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleClaimKeys = (order: Order) => {
    if (order.status === "PAID") {
      setSelectedOrder(order);
      setShowConfirmDialog(true);
    } else if (order.status === "COMPLETED") {
      // TODO: spinner while waiting for keyspage
      navigateToKeysPage(order);
    }
  };

  const confirmClaimKeys = async () => {
    if (!selectedOrder) return;

    setIsProcessing(true);
    try {
      await OrdersApi.updateOrderById({
        orderId: selectedOrder.id,
        status: "COMPLETED",
      });

      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id ? { ...o, status: "COMPLETED" } : o
        )
      );
      console.log(selectedOrder)
      setShowConfirmDialog(false);
      navigateToKeysPage(selectedOrder);
        setTimeout(() => {
            eventBus.emit('loyaltyPointsUpdated');
            toast.success(`Otrzymałeś ${Math.floor(selectedOrder.totalPrice) * pointsPerZloty} KeyPoints!`);
        }, 500);
    } catch (error) {
      console.error("Błąd podczas odbierania kluczy:", error);
      toast.error("Nie udało się odebrać kluczy");
    } finally {
      setIsProcessing(false);
      setSelectedOrder(null);
    }
  };

  const handleReturnOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowReturnDialog(true);
  };

  const confirmReturnOrder = async () => {
    if (!selectedOrder) return;
    setIsProcessing(true);
    try {
      await OrdersApi.updateOrderById({
        orderId: selectedOrder.id,
        status: "CANCELLED",
      });

      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id ? { ...o, status: "CANCELLED" } : o
        )
      );

      setShowReturnDialog(false);
      toast.success("Zamówienie zostało zwrócone");
    } catch (error) {
      console.error("Błąd podczas zwracania zamówienia:", error);
      toast.error("Nie udało się zwrócić zamówienia");
    } finally {
      setIsProcessing(false);
      setSelectedOrder(null);
    }
  };

  const navigateToKeysPage = (order: Order) => {
    const products = orderProducts[order.id];

    const productsWithQuantity = products.map((product) => {
      const matchingItem = order.orderItems.find(
        (item) => item.productId === product.id
      );
      return {
        ...product,
        quantity: matchingItem?.quantity ?? 1,
      };
    });

    sessionStorage.setItem(
      "keysPageData",
      JSON.stringify({
        orderId: order.id,
        products: productsWithQuantity,
        date: order.createdAt,
      })
    );

    navigate({ to: "/account/keys" });
  };

  const handleOpenReviewDialog = (order: Order) => {
    const products = orderProducts[order.id];
    if (!products) return;

    // Get unique products (in case user bought multiple copies of the same game)
    const uniqueProducts = products.filter(
      (p, index, self) => index === self.findIndex((x) => x.id === p.id)
    );

    setSelectedOrderId(order.id);
    setReviewProducts(uniqueProducts);
    setShowReviewDialog(true);
  };

  const handleReviewsCompleted = async () => {
    if (selectedOrderId === null) return;

    // Mark order as reviewed
    setOrders((prev) =>
      prev.map((o) =>
        o.id === selectedOrderId ? { ...o, reviewed: true } : o
      )
    );
  };

  const getGameWord = (count: number) => {
    if (count === 1) return "gra";
    if (count >= 2 && count <= 4) return "gry";
    return "gier";
  };

  const getKeyWord = (keyCount: number) => {
    if (keyCount === 1) return "klucz";
    if (keyCount >= 2 && keyCount <= 4) return "klucze";
    return "kluczy";
  };


  return (
    <div className="flex justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="w-full max-w-3xl space-y-8">
        <Card className="bg-[#1F1F1F] border-[#3A3A3A] shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white text-lg sm:text-xl">
                  Ostatnie zamówienia
                </CardTitle>
                <CardDescription className="text-gray-400 text-sm">
                  Wszystkie Twoje zakupy w KeyForge
                </CardDescription>
                {!ordersLoading && !error && orders.length > 0 && (
                  <div className="text-gray-400 text-sm mt-2">
                    Wyświetlono{" "}
                    <span className="text-[#D4A44A] font-semibold">
                      {orders.length}
                    </span>{" "}
                    z{" "}
                    <span className="text-[#D4A44A] font-semibold">
                      {totalOrders}
                    </span>{" "}
                    {totalOrders === 1
                      ? "zamówienia"
                      : totalOrders < 5
                        ? "zamówień"
                        : "zamówień"}
                  </div>
                )}
              </div>
              {hasMore && orders.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAutoLoadEnabled(!autoLoadEnabled)}
                  className={`${
                    autoLoadEnabled
                      ? "bg-[#D4A44A]/20 text-[#D4A44A] border-[#D4A44A]/40 hover:bg-[#D4A44A]/30"
                      : "bg-gray-500/20 text-gray-400 border-gray-500/40 hover:bg-gray-500/30"
                  }`}
                >
                  {autoLoadEnabled ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Wstrzymaj wczytywanie
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Wznów
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {ordersLoading && orders.length === 0 && (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin w-10 h-10 text-[#D4A44A]" />
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
                <AlertTriangle className="w-8 h-8 text-[#D4A44A] mb-3" />
                <p>Nie udało się wczytać zamówień. Spróbuj ponownie później.</p>
                <button
                  onClick={retry}
                  className="mt-4 px-4 py-2 bg-[#D4A44A]/20 border border-[#D4A44A]/40 rounded-lg hover:bg-[#D4A44A]/30 transition"
                >
                  Spróbuj ponownie
                </button>
              </div>
            )}

            {!error && orders.length === 0 && !ordersLoading && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 text-center">
                <Key className="w-10 h-10 text-[#D4A44A] mb-3" />
                <p>Nie masz jeszcze żadnych zamówień.</p>
              </div>
            )}

            {!error && orders.length > 0 && (
              <>
                <Accordion type="single" collapsible className="w-full">
                  {orders.map((order) => {
                    const count = order.orderItems.length;
                    const keyCount = order.orderItems.reduce(
                      (total, item) => total + item.quantity,
                      0
                    );
                    const products = orderProducts[order.id];

                    return (
                      <AccordionItem
                        key={order.id}
                        value={`order-${order.id}`}
                        className="border-[#3A3A3A] !rounded-none"
                      >
                        <AccordionTrigger
                          className="hover:no-underline bg-[#2A2A2A] px-4 py-3 rounded-none"
                          onClick={() => handleExpand(order.id)}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col text-left">
                              <div className="flex flex-col font-semibold text-white text-sm sm:text-base">
                                <span>Zamówienie #{order.id} </span>
                                <span className="text-gray-400 text-xs">
                                  ({count} {getGameWord(count)}, {keyCount}{" "}
                                  {getKeyWord(keyCount)})
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-[#D4A44A] font-bold text-sm sm:text-base">
                                {order.totalPrice.toFixed(2)} PLN
                              </span>
                            </div>
                          </div>
                        </AccordionTrigger>

                        <AccordionContent className="bg-[#262626] px-5 py-4 border-t border-[#3A3A3A] !rounded-none">
                          <div className="space-y-4 text-sm">
                            <div className="flex flex-col">
                              <div>
                                <p className="text-gray-400 mb-2">Data zakupu</p>
                                <p className="text-white font-semibold">
                                  {new Date(order.createdAt).toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-400 mt-4 mb-2">Status</p>
                                <Badge
                                  className={`${statusMap[order.status].className} px-2 py-0.5 text-xs font-medium border`}
                                >
                                  {statusMap[order.status].label}
                                </Badge>
                              </div>
                            </div>

                            <Separator className="bg-[#3A3A3A]" />

                            {expandedOrderId === order.id && products && (
                              <div className="space-y-3 mt-4">
                                {order.orderItems.map((item) => {
                                  const product = products.find(
                                    (p) => p.id === item.productId
                                  );
                                  return (
                                    <div
                                      key={item.id}
                                      className="bg-[#1F1F1F] rounded-xl p-3 border border-[#333] flex justify-between items-center"
                                    >
                                      <div className="flex-1">
                                        <p className="text-white font-semibold break-words">
                                          {product?.name ?? "Ładowanie..."}
                                        </p>
                                        <div className="flex items-center gap-3 mt-2">
                                          {product?.platform && (
                                            <PlatformBadge
                                              platform={product.platform.name}
                                            />
                                          )}
                                          <span className="text-gray-400 text-xs">
                                            {item.unitPrice.toFixed(2)} PLN × {item.quantity}
                                          </span>
                                        </div>
                                      </div>
                                      <p className="text-[#D4A44A] font-semibold ml-4">
                                        {item.totalPrice.toFixed(2)} PLN
                                      </p>
                                    </div>
                                  );
                                })}
                                <div className="bg-[#1F1F1F]/70 rounded-xl p-3 border-2 border-[#3A3A3A] flex justify-between items-center">
                                  <span className="text-gray-200 font-semibold">
                                    Razem:
                                  </span>
                                  <span className="text-[#FFD166] font-bold text-lg">
                                    {order.totalPrice.toFixed(2)} PLN
                                  </span>
                                </div>
                              </div>
                            )}

                            <div className="flex flex-wrap items-center justify-between mt-4 gap-3">
                              <div className="flex items-center">
                                {order.status === "PAID" && (
                                  <Button
                                    size="sm"
                                    className="bg-transparent !text-red-600 border border-red-700 hover:!bg-[#3A3A3A] text-xs sm:text-sm flex items-center"
                                    variant="outline"
                                    onClick={() => handleReturnOrder(order)}
                                  >
                                    <X className="h-4 w-4 mr-2" />
                                    Zwróć zamówienie
                                  </Button>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center gap-3">
                                {order.status === "COMPLETED" &&
                                  (!order.reviewed ? (
                                    <Button
                                      size="sm"
                                      className="bg-[#D4A44A] text-black hover:!bg-[#B8873D] text-xs sm:text-sm border-[#D4A44A]"
                                      variant="outline"
                                      onClick={() => handleOpenReviewDialog(order)}
                                    >
                                      <Star className="h-4 w-4 mr-2" /> Wystaw opinię
                                    </Button>
                                  ) : (
                                    <Badge className="!bg-transparent text-green-400 border-green-500/50 px-2 py-1.25 text-xs sm:text-sm">
                                      <Check className="h-4 w-4 text-green-400 scale-105 mr-2" />
                                      Opinia wystawiona
                                    </Badge>
                                  ))}
                                {(order.status === "PAID" ||
                                  order.status === "COMPLETED") && (
                                  <Button
                                    size="sm"
                                    className=" hover:!bg-[#3A3A3A] text-xs sm:text-sm border-[#D4A44A]"
                                    variant="outline"
                                    onClick={() => handleClaimKeys(order)}
                                  >
                                    <Key className="h-4 w-4 mr-2" />
                                    {order.status === "COMPLETED"
                                      ? count === 1
                                        ? "Sprawdź klucz"
                                        : "Sprawdź klucze"
                                      : count === 1
                                        ? "Odbierz klucz"
                                        : "Odbierz klucze"}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>

                {/* sentinel element observed by IntersectionObserver */}
                <div ref={observerRef} className="flex justify-center py-6">
                  {hasMore && autoLoadEnabled && (
                    <Loader2 className="animate-spin w-6 h-6 text-[#D4A44A]" />
                  )}
                  {hasMore && !autoLoadEnabled && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPage((prev) => prev + 1)}
                      disabled={ordersLoading}
                      className="bg-[#D4A44A]/20 text-[#D4A44A] border-[#D4A44A]/40 hover:bg-[#D4A44A]/30"
                    >
                      {ordersLoading ? (
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      ) : null}
                      Załaduj więcej
                    </Button>
                  )}
                  {!hasMore && (
                    <div className="text-sm text-gray-400">
                      Brak dalszych zamówień
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent className="bg-[#1F1F1F] border-[#3A3A3A] text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-[#D4A44A] flex items-center gap-2">
                <Key className="h-5 w-5" />
                Potwierdź odbiór kluczy
              </DialogTitle>
              <DialogDescription className="text-gray-300 text-sm mt-3">
                Przed odebraniem kluczy upewnij się, że:
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 my-4">
              <div className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-[#D4A44A] mt-0.5">✓</span>
                <span>Zakupione gry są zgodne z Twoimi oczekiwaniami</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-[#D4A44A] mt-0.5">✓</span>
                <span>Platformy gier są odpowiednie dla Twojego systemu</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-[#D4A44A] mt-0.5">✓</span>
                <span>
                  Posiadasz konta na platformach, do których zakupiłeś gry
                </span>
              </div>
            </div>

            <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg p-3 text-xs text-gray-400">
              <strong className="text-yellow-500">Uwaga:</strong> Po odebraniu
              kluczy nie będzie możliwości zwrotu zamówienia.
            </div>

            <DialogFooter className="gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
                disabled={isProcessing}
                className="bg-transparent border-[#3A3A3A] text-white hover:!bg-[#3A3A3A]"
              >
                Anuluj
              </Button>
              <Button
                onClick={confirmClaimKeys}
                disabled={isProcessing}
                variant={"outline"}
                className="border-[#D4A44A]  hover:!bg-[#3A3A3A]"
              >
                {isProcessing ? "Przetwarzanie..." : "Tak, są zgodne"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={showReturnDialog} onOpenChange={setShowReturnDialog}>
          <DialogContent className="bg-[#1F1F1F] border-[#3A3A3A] text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-red-700">
                Potwierdź zwrot zamówienia
              </DialogTitle>
              <DialogDescription className="text-gray-300 text-sm mt-3">
                Czy na pewno chcesz zwrócić to zamówienie? Po potwierdzeniu
                środki zostaną zwrócone, a dostęp do kluczy zostanie anulowany.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowReturnDialog(false)}
                disabled={isProcessing}
                className="!bg-transparent border-[#3A3A3A] text-white hover:!bg-[#2A2A2A]/30"
              >
                Anuluj
              </Button>
              <Button
                onClick={confirmReturnOrder}
                variant="outline"
                disabled={isProcessing}
                className="!bg-transparent !text-red-600 !border-[#3A3A3A] hover:!bg-red-800/20"
              >
                {isProcessing ? "Przetwarzanie..." : "Tak, zwróć zamówienie"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <ReviewDialog
          open={showReviewDialog}
          onOpenChange={setShowReviewDialog}
          products={reviewProducts}
          orderId={selectedOrderId ?? 0}
          userId={1}
          onReviewsCompleted={handleReviewsCompleted}
        />
      </div>
    </div>
  )
}