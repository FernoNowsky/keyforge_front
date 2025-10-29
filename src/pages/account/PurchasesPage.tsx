'use client'

import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Star } from 'lucide-react'
import { PlatformBadge } from '@/components/PlatformBadge'
import { OrdersApi, ProductsApi, type Product } from '@/api'
import type { Order, OrdersResponse } from '@/api/ordersApi'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

const statusMap: Record<
  string,
  { label: string; className: string }
> = {
  READY_FOR_PAYMENT: {
    label: 'Przygotowane do płatności',
    className: 'bg-blue-500/20 text-blue-400 border-blue-500/40'
  },
  PAID: {
    label: 'Opłacone',
    className: 'bg-green-500/20 text-green-400 border-green-500/40'
  },
  COMPLETED: {
    label: 'Odebrane',
    className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
  },
  CANCELLED: {
    label: 'Anulowane',
    className: 'bg-red-900/40 text-red-500 border-red-800/50' // 🔹 ciemniejszy
  },
  PAYMENT_FAILED: {
    label: 'Nieudana płatność',
    className: 'bg-red-500/20 text-red-400 border-red-500/40' // 🔹 jaśniejszy
  }
}

export default function PurchasesPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null)
  const [orderProducts, setOrderProducts] = useState<Record<number, Product[]>>({})

  useEffect(() => {
    // TODO: token/get user id from global state
    const userId = 1

    const fetchOrdersAndProducts = async () => {
      try {
        const data: OrdersResponse = await OrdersApi.getByUserId(userId)
        const ordersList = data.content
        setOrders(ordersList)
        console.log(ordersList)
        // unikalne productIds
        const allProductIds = Array.from(
          new Set(ordersList.flatMap(order => order.orderItems.map(i => i.productId)))
        )

        const allProducts = await ProductsApi.getByIds(allProductIds, false)

        // przypisz produkty do odpowiednich zamówień
        const productsByOrder: Record<number, Product[]> = {}
        for (const order of ordersList) {
          const orderProductIds = order.orderItems.map(i => i.productId)
          productsByOrder[order.id] = allProducts.filter(p => orderProductIds.includes(p.id))
        }

        setOrderProducts(productsByOrder)
      } catch (error) {
        console.error('Błąd pobierania zamówień lub produktów:', error)
      }
    }

    fetchOrdersAndProducts()
  }, [])

  const handleExpand = (orderId: number) => {
    setExpandedOrderId(prev => (prev === orderId ? null : orderId))
  }

  return (
    <div className="flex justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="w-full max-w-3xl space-y-8">
        <Card className="bg-[#1F1F1F] border-[#3A3A3A] shadow-md">
          <CardHeader>
            <CardTitle className="text-white text-lg sm:text-xl">Ostatnie zamówienia</CardTitle>
            <CardDescription className="text-gray-400 text-sm">
              Wszystkie Twoje zakupy w KeyForge
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {orders.map(order => {
                const count = order.orderItems.length
                const products = orderProducts[order.id]

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
                          <p className="font-semibold text-white text-sm sm:text-base">
                            <span className="sm:hidden">Zam. </span>
                            <span className="hidden sm:inline">Zamówienie </span>
                            #{order.id}{' '}
                            <span className="text-gray-400 text-xs">
                                ({count} {count === 1 ? 'gra' : 'gry'})
                            </span>
                          </p>
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
                              {order.orderItems.map(item => {
                                const product = products?.find(p => p.id === item.productId)
                                return (
                                  <div
                                    key={item.id}
                                    className="bg-[#1F1F1F] rounded-xl p-3 border border-[#333]"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <p className="text-white font-semibold break-words leading-tight">
                                          {product?.name ?? 'Ładowanie...'}
                                        </p>
                                        <div className="mt-1 w-[75px]">
                                          {product?.platform && (
                                            <PlatformBadge platform={product.platform.name}/>
                                          )}
                                        </div>
                                      </div>
                                      <p className="text-[#D4A44A] font-semibold">
                                        {item.totalPrice.toFixed(2)} PLN
                                      </p>
                                    </div>
                                    <div className="flex justify-between text-gray-400 text-xs mt-2">
                                      <span>Cena: {item.unitPrice.toFixed(2)} PLN</span>
                                      <span>Ilość: {item.quantity}</span>
                                    </div>
                                  </div>
                                )
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
                                      <TableHead className="text-gray-400 text-center">Cena</TableHead>
                                      <TableHead className="text-gray-400 text-center">Ilość</TableHead>
                                      <TableHead className="text-gray-400 text-right">Suma</TableHead>
                                    </TableRow>
                                  </TableHeader>

                                  <TableBody>
                                    {order.orderItems.map(item => {
                                      const product = products.find(p => p.id === item.productId)
                                      return (
                                        <TableRow
                                          key={item.id}
                                          className="border-[#3A3A3A] hover:bg-[#333333]/40 transition-colors"
                                        >
                                          <TableCell className="font-medium text-white w-[220px] sm:w-[260px] whitespace-normal break-words">
                                            {product?.name ?? 'Ładowanie...'}
                                          </TableCell>
                                          <TableCell className="text-white w-[100px]">
                                            {product?.platform ? (
                                              <PlatformBadge platform={product.platform.name} />
                                            ) : (
                                              '-'
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
                                      )
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
                                <p className="text-gray-500 text-sm italic">Ładowanie produktów...</p>
                              )}
                            </div>
                          </>
                        )}

                        <div className="flex flex-wrap gap-3 mt-4">
                          {!order.hasReview ? (
                            <Button
                              size="sm"
                              className="bg-[#D4A44A] text-black hover:bg-[#B8873D] text-xs sm:text-sm border-[#D4A44A]"
                              variant="outline"
                            >
                              <Star className="h-4 w-4 mr-2" /> Wystaw opinię
                            </Button>
                          ) : (
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50 px-2 py-0.5 text-xs">
                              Opinia wystawiona
                            </Badge>
                          )}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>    
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
