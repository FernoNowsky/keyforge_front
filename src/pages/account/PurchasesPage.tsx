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
import { Star, Key, Check, X } from "lucide-react";
import { PlatformBadge } from "@/components/PlatformBadge";
import { OrdersApi, ProductsApi, type Product } from "@/api";
import type { Order, OrdersResponse } from "@/api/ordersApi";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "@tanstack/react-router";

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
  const [orderProducts, setOrderProducts] = useState<Record<number, Product[]>>(
    {},
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    // TODO: token/get user id from global state
    const userId = 1;

    const fetchOrdersAndProducts = async () => {
      try {
        const data: OrdersResponse = await OrdersApi.getByUserId(userId);
        const ordersList = data.content;
        setOrders(ordersList);
        // unikalne productIds
        const allProductIds = Array.from(
          new Set(
            ordersList.flatMap((order) =>
              order.orderItems.map((i) => i.productId),
            ),
          ),
        );

        const allProducts = await ProductsApi.getByIds(allProductIds, false);

        // przypisz produkty do odpowiednich zamówień
        const productsByOrder: Record<number, Product[]> = {};
        for (const order of ordersList) {
          const orderProductIds = order.orderItems.map((i) => i.productId);
          productsByOrder[order.id] = allProducts.filter((p) =>
            orderProductIds.includes(p.id),
          );
        }

        setOrderProducts(productsByOrder);
      } catch (error) {
        console.error("Błąd pobierania zamówień lub produktów:", error);
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
          o.id === selectedOrder.id ? { ...o, status: "COMPLETED" } : o,
        ),
      );

      setShowConfirmDialog(false);

      navigateToKeysPage(selectedOrder);
    } catch (error) {
      console.error("Błąd podczas odbierania kluczy:", error);
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

      // Aktualizujemy lokalny stan, by nie wymagać reloadu
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id ? { ...o, status: "CANCELLED" } : o,
        ),
      );

      setShowReturnDialog(false);
    } catch (error) {
      console.error("Błąd podczas zwracania zamówienia:", error);
    } finally {
      setIsProcessing(false);
      setSelectedOrder(null);
    }
  };

  const navigateToKeysPage = (order: Order) => {
    const products = orderProducts[order.id];

    const productsWithQuantity = products.map((product) => {
      const matchingItem = order.orderItems.find(
        (item) => item.productId === product.id,
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
      }),
    );

    navigate({ to: "/account/keys" });
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
                  0,
                );
                const products = orderProducts[order.id];

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

                        {expandedOrderId === order.id && (
                          <>
                            {/*Mobile layout*/}
                            <div className="space-y-3 sm:hidden mt-4">
                              {order.orderItems.map((item) => {
                                const product = products?.find(
                                  (p) => p.id === item.productId,
                                );
                                return (
                                  <div
                                    key={item.id}
                                    className="bg-[#1F1F1F] rounded-xl p-3 border border-[#333]"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <p className="text-white font-semibold break-words leading-tight">
                                          {product?.name ?? "Ładowanie..."}
                                        </p>
                                        <div className="mt-1 w-[75px]">
                                          {product?.platform && (
                                            <PlatformBadge
                                              platform={product.platform.name}
                                            />
                                          )}
                                        </div>
                                      </div>
                                      <p className="text-[#D4A44A] font-semibold">
                                        {item.totalPrice.toFixed(2)} PLN
                                      </p>
                                    </div>
                                    <div className="flex justify-between text-gray-400 text-xs mt-2">
                                      <span>
                                        Cena: {item.unitPrice.toFixed(2)} PLN
                                      </span>
                                      <span>Ilość: {item.quantity}</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/*Desktop layout*/}
                            <div className="hidden sm:block mt-4 overflow-x-auto">
                              {products ? (
                                <Table className="min-w-[600px] sm:min-w-full">
                                  <TableHeader className="bg-[#1F1F1F]">
                                    <TableRow className="border-[#3A3A3A]">
                                      <TableHead className="text-gray-400 w-[220px] sm:w-[260px]">
                                        Nazwa
                                      </TableHead>
                                      <TableHead className="text-gray-400 w-[100px] text-center">
                                        Platforma
                                      </TableHead>
                                      <TableHead className="text-gray-400 text-center">
                                        Cena
                                      </TableHead>
                                      <TableHead className="text-gray-400 text-center">
                                        Ilość
                                      </TableHead>
                                      <TableHead className="text-gray-400 text-right">
                                        Suma
                                      </TableHead>
                                    </TableRow>
                                  </TableHeader>

                                  <TableBody>
                                    {order.orderItems.map((item) => {
                                      const product = products.find(
                                        (p) => p.id === item.productId,
                                      );
                                      return (
                                        <TableRow
                                          key={item.id}
                                          className="border-[#3A3A3A] hover:!bg-[#333333]/40 transition-colors"
                                        >
                                          <TableCell className="font-medium text-white w-[220px] sm:w-[260px] whitespace-normal break-words">
                                            {product?.name ?? "Ładowanie..."}
                                          </TableCell>
                                          <TableCell className="text-white w-[100px]">
                                            {product?.platform ? (
                                              <PlatformBadge
                                                platform={product.platform.name}
                                              />
                                            ) : (
                                              "-"
                                            )}
                                          </TableCell>
                                          <TableCell className="text-center text-gray-300">
                                            {item.unitPrice.toFixed(2)} PLN
                                          </TableCell>
                                          <TableCell className="text-center text-gray-300">
                                            {item.quantity}
                                          </TableCell>
                                          <TableCell className="text-right text-[#D4A44A] font-semibold">
                                            {item.totalPrice.toFixed(2)} PLN
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })}

                                    <TableRow className="border-t-2 border-[#3A3A3A] bg-[#1F1F1F]/70">
                                      <TableCell
                                        colSpan={4}
                                        className="text-right font-semibold text-gray-200"
                                      >
                                        Razem:
                                      </TableCell>
                                      <TableCell className="text-right text-[#FFD166] font-bold">
                                        {order.totalPrice.toFixed(2)} PLN
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              ) : (
                                <p className="text-gray-500 text-sm italic">
                                  Ładowanie produktów...
                                </p>
                              )}
                            </div>
                          </>
                        )}

                        <div className="flex flex-wrap items-center justify-between mt-4">
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
                            {![
                              "PAYMENT_FAILED",
                              "CANCELLED",
                              "READY_FOR_PAYMENT",
                              "PAID",
                            ].includes(order.status) &&
                              (!order.hasReview ? (
                                <Button
                                  size="sm"
                                  className="bg-[#D4A44A] text-black hover:!bg-[#B8873D]/30 text-xs sm:text-sm border-[#D4A44A]"
                                  variant="outline"
                                >
                                  <Star className="h-4 w-4 mr-2" /> Wystaw
                                  opinię
                                </Button>
                              ) : (
                                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50 px-2 py-0.5 text-xs">
                                  Opinia wystawiona
                                </Badge>
                              ))}
                            {(order.status === "PAID" ||
                              order.status === "COMPLETED") && (
                              <Button
                                size="sm"
                                className="bg-[#D4A44A] text-black hover:!bg-[#B8873D]/30 text-xs sm:text-sm border-[#D4A44A]"
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
                <Check className="h-5 w-5 text-[#D4A44A] flex-shrink-0 mt-0.5" />
                <span>Zakupione gry są zgodne z Twoimi oczekiwaniami</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-300">
                <Check className="h-5 w-5 text-[#D4A44A] flex-shrink-0 mt-0.5" />
                <span>Platformy gier są odpowiednie dla Twojego systemu</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-300">
                <Check className="h-5 w-5 text-[#D4A44A] flex-shrink-0 mt-0.5" />
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
                className="bg-[#D4A44A] text-black hover:!bg-[#B8873D]/30"
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
      </div>
    </div>
  );
}
