"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import {Trash2, Plus, Minus, ShoppingCart, CreditCard, Trophy} from "lucide-react"
import { toast } from "sonner"
import { PlatformBadge } from "@/components/PlatformBadge"
import { OrdersApi, ProductsApi, type Product } from "@/api"
import {loyaltyLevels, pointsPerZloty} from "@/assets/loyaltyLevelsData.ts";
import {UsersApi} from "@/api/usersApi.ts";
import {isAuthenticated, useAuth} from "@/hooks/useAuthToken.ts";
import {getKeycloakInstance} from "@/KeycloakContext.tsx";

type CartItem = {
  id: number
  name: string
  imgId: string
  platform: string
  price: number
  quantity: number
}

type StockIssue = {
  productId: number
  message: string
}

export function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stockIssues, setStockIssues] = useState<StockIssue[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const navigate = useNavigate()
  const [loyaltyDiscount, setLoyaltyDiscount] = useState<number>(0)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [loyaltyPoints, setLoyaltyPoints] = useState(0)
  const auth = isAuthenticated()
  const { userId } = useAuth()
  const isKeycloakDisabled = localStorage.getItem('keycloak_disabled') === 'true'
  const keycloak = getKeycloakInstance()
  useEffect(() => {
      if (!auth) return

      const fetchLoyaltyPoints = async () => {
          try {
              const userData = await UsersApi.getLoyaltyPoints(userId)
              setLoyaltyPoints(userData.loyaltyPoints)
              const currentLevel =
                  loyaltyLevels
                      .slice()
                      .reverse()
                      .find(level => userData.loyaltyPoints >= level.pointsRequired) || loyaltyLevels[0]

              setLoyaltyDiscount(currentLevel.discount)
          } catch (err) {
              console.error("Błąd pobierania danych o punktach lojalnościowych", err)
          }
      }

      fetchLoyaltyPoints()
  }, [auth, userId])

    useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    try {
      const cartData = localStorage.getItem("gameCart")
      if (!cartData) {
        setIsLoading(false)
        return
      }

      const parsedCart = JSON.parse(cartData) as CartItem[]
      setCart(parsedCart)

      const productIds = parsedCart.map((p) => p.id)
      const allProducts: Product[] = await ProductsApi.getByIds(productIds, false)
      setProducts(allProducts)

      const issues: StockIssue[] = []

      parsedCart.forEach((item) => {
        const product = allProducts.find((p) => p.id === item.id)
        if (!product) {
          issues.push({
            productId: item.id,
            message: "Produkt został usunięty z oferty",
          })
        } else if (product.stock <= 0) {
          issues.push({
            productId: item.id,
            message: "Produkt nie jest już dostępny w magazynie",
          })
        } else if (item.quantity > product.stock) {
          issues.push({
            productId: item.id,
            message: `Możesz zamówić maksymalnie ${product.stock} szt.`,
          })
        }
      })

      setStockIssues(issues)
    } catch (error) {
      console.error("Błąd podczas weryfikacji stanów:", error)
    } finally {
      setIsLoading(false)
    }
  }

const validateStock = (currentCart: CartItem[]) => {
    const issues: StockIssue[] = []

    currentCart.forEach((item) => {
        const product = products.find((p) => p.id === item.id)
        if (!product) {
        issues.push({ productId: item.id, message: "Produkt został usunięty z oferty" })
        } else if (product.stock <= 0) {
        issues.push({ productId: item.id, message: "Produkt nie jest już dostępny w magazynie" })
        } else if (item.quantity > product.stock) {
        issues.push({
            productId: item.id,
            message: `Możesz zamówić maksymalnie ${product.stock} szt.`,
        })
        }
    })

    setStockIssues(issues)
    }

  const saveCart = (updatedCart: CartItem[]) => {
    try {
      localStorage.setItem("gameCart", JSON.stringify(updatedCart))
      window.dispatchEvent(new Event('cartUpdated'));
      setCart(updatedCart)
    } catch (error) {
      console.error("Błąd zapisu koszyka:", error)
    }
  }

    const handleLogin = () => {
        if (isKeycloakDisabled) {
            alert('System logowania jest obecnie niedostępny. Spróbuj ponownie później')
            return
        }

        const currentUrl = window.location.href;

        const redirectUri = currentUrl.includes("error")
            ? window.location.origin
            : window.location.href;

        keycloak?.login({ redirectUri });
    }

  const updateQuantity = (id: number, delta: number) => {
    const updatedCart = cart
      .map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta
          if (newQuantity <= 0) return null
          return { ...item, quantity: newQuantity }
        }
        return item
      })
      .filter(Boolean) as CartItem[]

    saveCart(updatedCart)
    validateStock(updatedCart)
  }

  const removeItem = (id: number, name: string) => {
    const updatedCart = cart.filter((item) => item.id !== id)
    saveCart(updatedCart)
    validateStock(updatedCart)
    toast.success(`Usunięto ${name} z koszyka`)
  }

  const getDiscountedPrice = (product: Product | undefined, basePrice: number) => {
    if (!product || !product.discountPercentage) return basePrice
    const discounted = basePrice * (1 - product.discountPercentage / 100)
    return parseFloat(discounted.toFixed(2))
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const product = products.find((p) => p.id === item.id)
      const price = product?.price ?? 0
      return total + price * item.quantity
    }, 0)
  }
    const getTotalBeforeDiscount = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0)
    }

    const getTotalAfterDiscount = () => {
        return cart.reduce((total, item) => {
            const product = products.find((p) => p.id === item.id)
            const discountedPrice = getDiscountedPrice(product, item.price)
            return total + discountedPrice * item.quantity
        }, 0)
    }

    const getTotalDiscount = () => {
        const before = getTotalBeforeDiscount()
        const after = getTotalAfterDiscount()
        return before - after
    }
    const hasStockIssues = stockIssues.length > 0

  const handleCheckout = async (): Promise<void> => {
    if (!isAuthenticated()) {
      setShowLoginDialog(true)
      return
    }

    if (cart.length === 0) {
      toast.warning("Pusty koszyk")
      return
    }
    if (hasStockIssues) {
      toast.error("Popraw błędy w koszyku przed przejściem do płatności")
      return
    }

    try {
      const items = cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }))

      const orderRequest = {
        products: items,
      }

      type OrderResponse = {
        orderId: number
        paymentId: string
        paymentUrl: string
      }

      const order: OrderResponse = await OrdersApi.create(orderRequest)

      toast.success(`Zamówienie utworzone, ID: ${order.orderId}`)
      window.location.href = order.paymentUrl
    } catch (error) {
      console.error("Błąd tworzenia zamówienia:", error)
      toast.error("Nie udało się utworzyć zamówienia")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#D4A44A] text-xl">Ładowanie...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {cart.length === 0 ? (
          <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <ShoppingCart className="w-24 h-24 text-[#D4A44A] mb-4 opacity-50" />
              <h2 className="text-2xl font-semibold text-[#F8F8F8] mb-2">
                Twój koszyk jest pusty
              </h2>
              <p className="text-[#A0A0A0] mb-6">
                Dodaj gry do koszyka, aby kontynuować zakupy
              </p>
              <Button
                onClick={() => navigate({ to: "/products" })}
                variant="outline"
                className="border-[#D4A44A] text-[#D4A44A] hover:bg-[#D4A44A] hover:text-black transition"
              >
                Przeglądaj gry
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ======== PRODUKTY ======== */}
            <div className="lg:col-span-2">
              <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
                <CardHeader>
                  <CardTitle className="text-[#F8F8F8]">
                    Produkty ({cart.reduce((sum, i) => sum + i.quantity, 0)})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* MOBILE */}
                  <div className="block md:hidden space-y-4">
                    {cart.map((item) => {
                      const issue = stockIssues.find((i) => i.productId === item.id)
                      const product = products.find((p) => p.id === item.id)
                      const discounted = getDiscountedPrice(product, item.price)
                      return (
                        <div
                          key={item.id}
                          className={`bg-[#1C1C1C] rounded-lg p-4 border border-[#3A3A3A] ${
                            issue ? "opacity-50" : ""
                          }`}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex flex-col">
                              <h3 className="text-[#F8F8F8] font-semibold pr-2">
                                {item.name}
                              </h3>
                              {product?.platform && (
                                <span className="pt-1 w-max">
                                  <PlatformBadge platform={product.platform.name} />
                                </span>
                              )}
                              {issue && (
                                <span className="text-red-400 text-xs mt-1">{issue.message}</span>
                              )}
                            </div>
                            <button
                              onClick={() => removeItem(item.id, item.name)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-8 h-8 rounded bg-[#2A2A2A] text-[#D4A44A] hover:bg-[#3A3A3A] flex items-center justify-center"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="text-[#F8F8F8] font-semibold w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-8 h-8 rounded bg-[#2A2A2A] text-[#D4A44A] hover:bg-[#3A3A3A] flex items-center justify-center"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="text-right">
                              {(product?.discountPercentage ?? 0) > 0 ? (
                                <>
                                  <div className="text-[#D4A44A] font-bold text-lg">
                                    {(discounted * item.quantity).toFixed(2)} PLN
                                  </div>
                                  <div className="text-[#A0A0A0] text-sm line-through">
                                    {(item.price * item.quantity).toFixed(2)} PLN
                                  </div>
                                </>
                              ) : (
                                <div className="text-[#D4A44A] font-bold text-lg">
                                  {(item.price * item.quantity).toFixed(2)} PLN
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* DESKTOP */}
                  <div className="hidden md:block overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-[#3A3A3A] hover:bg-transparent">
                          <TableHead className="text-[#A0A0A0]">Produkt</TableHead>
                          <TableHead className="text-[#A0A0A0]" />
                          <TableHead className="text-[#A0A0A0] text-center">Ilość</TableHead>
                          <TableHead className="text-[#A0A0A0] text-right">Cena</TableHead>
                          <TableHead className="text-[#A0A0A0] text-right">Suma</TableHead>
                          <TableHead className="text-[#A0A0A0]" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cart.map((item) => {
                          const issue = stockIssues.find((i) => i.productId === item.id)
                          const product = products.find((p) => p.id === item.id)
                          const discounted = getDiscountedPrice(product, item.price)

                          return (
                            <TableRow
                              key={item.id}
                              className={`border-[#3A3A3A] hover:bg-[#1C1C1C] ${
                                issue ? "opacity-50" : ""
                              }`}
                            >
                              <TableCell className="p-2">
                                <img
                                  src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${item.imgId}/header.jpg`}
                                  alt={item.name}
                                  className="w-16 h-8 rounded"
                                />
                              </TableCell>
                              <TableCell className="text-[#F8F8F8] font-medium">
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-2">
                                    <button
                                                                    onClick={() => navigate({ to: `/products/${item.id}` })}
                                                                    className="flex-1 text-left !bg-transparent border-none p-0 m-0"
                                    >
                                      {item.name}
                                    </button>
                                    {product?.platform && (
                                      <PlatformBadge platform={product.platform.name} />
                                    )}
                                  </div>
                                  {issue && (
                                    <span className="text-red-400 text-xs mt-1">
                                      {issue.message}
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => updateQuantity(item.id, -1)}
                                    className="w-8 h-8 rounded bg-[#2A2A2A] text-[#D4A44A] hover:bg-[#3A3A3A] flex items-center justify-center"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="text-[#F8F8F8] font-semibold w-8 text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.id, 1)}
                                    className="w-8 h-8 rounded bg-[#2A2A2A] text-[#D4A44A] hover:bg-[#3A3A3A] flex items-center justify-center"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                {(product?.discountPercentage ?? 0) > 0 ? (
                                  <>
                                    <div className="text-[#D4A44A] font-bold">
                                      {loyaltyDiscount > 0 ? (discounted * (1-loyaltyDiscount / 100)).toFixed(2) : discounted.toFixed(2)} PLN
                                    </div>
                                    <div className="text-[#A0A0A0] text-sm line-through">
                                      {item.price.toFixed(2)} PLN
                                    </div>
                                  </>
                                ) : (
                                  <div className="text-[#D4A44A] font-bold">
                                    {loyaltyDiscount > 0 ? (item.price * (1-loyaltyDiscount/100)).toFixed(2) : item.price.toFixed(2)} PLN
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="text-[#D4A44A] font-bold text-right">
                                {loyaltyDiscount > 0 ? (discounted * item.quantity * (1-loyaltyDiscount / 100)).toFixed(2) : (discounted * item.quantity).toFixed(2)} PLN
                              </TableCell>
                              <TableCell>
                                <button
                                  onClick={() => removeItem(item.id, item.name)}
                                                                className="text-red-400 hover:text-red-300 transition-colors !bg-transparent"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ======== PODSUMOWANIE ======== */}
            <div className="lg:col-span-1">
              <Card className="bg-[#2A2A2A] border-[#3A3A3A] sticky top-4">
                  <CardHeader>
                      <CardTitle className="text-[#F8F8F8] text-center">Podsumowanie</CardTitle>
                      {isAuthenticated() && (
                          <div className="mt-2 flex items-center gap-2 bg-[#1C1C1C] border border-[#3A3A3A] rounded-lg px-3 py-2">
                              <div className="flex items-center justify-center w-8 h-8 bg-[#D4A44A]/20 rounded-full">
                                  <Trophy className="w-5 h-5 text-[#D4A44A]" />
                              </div>
                              <span className="text-[#D4A44A] font-medium text-sm md:text-base">
                                 Otrzymasz{" "}
                                  <span className="font-bold text-[#FFD166]">
                                     {(getTotalAfterDiscount() * (1 - loyaltyDiscount / 100) * pointsPerZloty).toFixed(0)}
                                 </span>{" "}
                                  KeyPoints za ten zakup!
                                </span>
                          </div>)}
                      {isAuthenticated() && (
                          <div className="mt-3 bg-[#1C1C1C] border border-[#3A3A3A] rounded-lg px-3 py-3">
                              {(() => {
                                  const earnedPoints = (getTotalAfterDiscount() * (1 - loyaltyDiscount / 100) * pointsPerZloty);
                                  const newTotal = loyaltyPoints + earnedPoints;

                                  const currentLevel =
                                      loyaltyLevels.slice().reverse().find(level => loyaltyPoints >= level.pointsRequired) || loyaltyLevels[0];

                                  const levelAfterPurchase =
                                      loyaltyLevels.slice().reverse().find(level => newTotal >= level.pointsRequired) || loyaltyLevels[0];

                                  const nextLevelAfterPurchase = loyaltyLevels.find(level => level.pointsRequired > newTotal);

                                  const willLevelUp = currentLevel.name !== levelAfterPurchase.name;

                                  const progress = nextLevelAfterPurchase
                                      ? Math.min(((newTotal - levelAfterPurchase.pointsRequired) / (nextLevelAfterPurchase.pointsRequired - levelAfterPurchase.pointsRequired)) * 100, 100)
                                      : 100;

                                  return (
                                      <div>
                                          <div className="flex justify-between items-center mb-1">
                                              <span className="text-sm text-[#A0A0A0]">Twój poziom po zakupie</span>
                                              <span className={`text-${levelAfterPurchase.color} font-medium`}>
                                                {levelAfterPurchase.name}
                                            </span>
                                          </div>

                                          <div className="w-full bg-[#3A3A3A] rounded-full h-2 overflow-hidden">
                                              <div
                                                  className="h-2 bg-[#D4A44A] transition-all duration-1000 ease-out"
                                                  style={{ width: `${progress}%` }}
                                              ></div>
                                          </div>

                                          <div className="flex justify-between mt-1 text-xs text-[#A0A0A0]">
                                              <span>{Math.floor(newTotal)}/{nextLevelAfterPurchase ? nextLevelAfterPurchase.pointsRequired : levelAfterPurchase.pointsRequired} pkt</span>
                                              {nextLevelAfterPurchase && <span>Do {nextLevelAfterPurchase.name}: {Math.max(nextLevelAfterPurchase.pointsRequired - newTotal, 0).toFixed(0)} pkt</span>}
                                          </div>

                                          {willLevelUp && (
                                              <div className="mt-2 flex items-center gap-2 text-[#FFD166] text-sm font-medium">
                                                  <Trophy className="w-4 h-4" />
                                                  Awansujesz na poziom:{" "}
                                                  <span className="font-semibold">
                                                    {levelAfterPurchase.name}
                                                </span> 🎉
                                              </div>
                                          )}
                                      </div>
                                  );
                              })()}
                          </div>
                      )}
                  </CardHeader>
                <CardContent className="space-y-4">

                  <div className="border-t border-[#3A3A3A] pt-4 space-y-3">
                    <div className="flex justify-between text-[#A0A0A0]">
                      <span>Produkty</span>
                      <span>{getTotalPrice().toFixed(2)} PLN</span>
                    </div>
                    <div className="flex justify-between text-[#A0A0A0]">
                      <span>Rabat</span>
                      <span>-{getTotalDiscount().toFixed(2)} PLN</span>
                    </div>
                      {isAuthenticated() && (
                              <div className="flex justify-between text-[#A0A0A0]">
                                  <span>Rabat lojalnościowy (-{loyaltyDiscount}%)</span>
                                  <span className="text-[#A0A0A0]">-{((getTotalPrice()-getTotalDiscount())*(loyaltyDiscount/100)).toFixed((2))} PLN</span>
                              </div>
                      )}
                      <div className="border-t border-[#3A3A3A] pt-3 flex justify-between text-[#F8F8F8] text-xl font-bold">
                          <span>Suma</span>
                          <span className="text-[#D4A44A]">
                            {(getTotalAfterDiscount() * (1 - loyaltyDiscount / 100)).toFixed(2)} PLN
                          </span>
                      </div>
                  </div>

                    {!isAuthenticated() ? (
                        <Button
                            onClick={() => setShowLoginDialog(true)}
                            variant="outline"
                            className="w-full bg-[#D4A44A] text-black hover:bg-[#f1c562] font-semibold py-6 text-base"
                        >
                            Zaloguj się, aby zapłacić
                        </Button>
                    ) : (
                        <Button
                            onClick={handleCheckout}
                            variant="outline"
                            disabled={hasStockIssues}
                            className={`w-full  hover:!bg-[#3A3A3A] font-semibold py-6 text-base ${
                                hasStockIssues ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            <CreditCard className="w-5 h-5 mr-2" />
                            Przejdź do płatności
                        </Button>
                    )}
                  {hasStockIssues && (
                    <p className="text-red-400 text-sm text-center">
                      Popraw błędy w koszyku, aby przejść dalej
                    </p>
                  )}
                  <p className="text-[#606060] text-xs text-center">
                    Bezpieczne płatności przez szyfrowane połączenie
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
        <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
            <DialogContent className="bg-[#2A2A2A] border-[#3A3A3A] text-[#F8F8F8]">
                <DialogHeader>
                    <DialogTitle className="text-[#D4A44A]">Wymagane logowanie</DialogTitle>
                    <DialogDescription className="text-[#A0A0A0]">
                        Aby dokończyć zakup, musisz być zalogowany.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setShowLoginDialog(false)}
                        className="hover:!bg-[#3A3A3A]"
                    >
                        Anuluj
                    </Button>
                    <Button
                        onClick={() => handleLogin()}
                        variant={"outline"}
                        className="border-[#D4A44A] text-black hover:!bg-[#3A3A3A]"
                    >
                        Zaloguj się
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>

  )
}