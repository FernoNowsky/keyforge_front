"use client";

import { useEffect, useState } from "react";
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
import { Star, Key, X, Check } from "lucide-react";
import { PlatformBadge } from "@/components/PlatformBadge";
import { OrdersApi, ProductsApi, type Product } from "@/api";
import type { Order, OrdersResponse } from "@/api/ordersApi";
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

  const navigate = useNavigate();

  useEffect(() => {
    // TODO: token/get user id from global state
    const userId = 1;

    // TODO: Pagination and spinner
    const fetchOrdersAndProducts = async () => {
      try {
        const data: OrdersResponse = await OrdersApi.getByUserId(userId);
        const ordersList = data.content;
        setOrders(ordersList);
        
        // Get unique productIds from all orders
        const allProductIds = Array.from(
          new Set(
            ordersList.flatMap((order) =>
              order.orderItems.map((i) => i.productId)
            )
          )
        );

        const allProducts = await ProductsApi.getByIds(allProductIds, false);

        // Map products to their orders
        const productsByOrder: Record<number, Product[]> = {};
        for (const order of ordersList) {
          const orderProductIds = order.orderItems.map((i) => i.productId);
          productsByOrder[order.id] = allProducts.filter((p) =>
            orderProductIds.includes(p.id)
          );
        }

        setOrderProducts(productsByOrder);
      } catch (error) {
        console.error("Błąd pobierania zamówień lub produktów:", error);
        toast.error("Nie udało się pobrać zamówień");
      }
    };

    fetchOrdersAndProducts();
  }, []);

  const handleExpand = (orderId: number) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleClaimKeys = (order: Order) => {
    if (order.status === "PAID") {
      setSelectedOrder(order);
      setShowConfirmDialog(true);
    } else if (order.status === "COMPLETED") {
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

      setShowConfirmDialog(false);
      navigateToKeysPage(selectedOrder);
      toast.success("Klucze zostały odebrane!");
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
            <CardTitle className="text-white text-lg sm:text-xl">
              Ostatnie zamówienia
            </CardTitle>
            <CardDescription className="text-gray-400 text-sm">
              Wszystkie Twoje zakupy w KeyForge
            </CardDescription>
          </CardHeader>

          <CardContent>
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
                                className="bg-transparent !text-red-600 border border-red-700 hover:!bg-red-900/30 text-xs sm:text-sm flex items-center"
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
                                className="bg-[#D4A44A] text-black hover:!bg-[#B8873D] text-xs sm:text-sm border-[#D4A44A]"
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
                className="bg-transparent border-[#3A3A3A] text-white hover:!bg-[#2A2A2A]/30"
              >
                Anuluj
              </Button>
              <Button
                onClick={confirmClaimKeys}
                disabled={isProcessing}
                className="bg-[#D4A44A] text-black hover:!bg-[#B8873D]"
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
  );
}