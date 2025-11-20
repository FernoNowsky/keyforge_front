import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, X } from "lucide-react";
import { OrdersApi, ProductsApi, type Order, type Product } from "@/api";
import { OrderDetailsDialog } from "./OrdersDetailsDialog";
import { OrderRow } from "./OrderRow";

interface OrderFilters {
  orderId?: string;
  userId?: string;
  status?: string;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
}

interface OrderQueryParams {
  page: number;
  size: number;
  orderId?: number;
  userId?: string;
  status?: string;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
}

export function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Record<number, Product>>({});
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const [filters, setFilters] = useState<OrderFilters>({
    orderId: "",
    userId: "",
    status: "",
    sortBy: "createdAt",
    sortDirection: "DESC",
  });

  const [tempFilters, setTempFilters] = useState({
    orderId: "",
    userId: "",
    status: "",
  });

  const prevFiltersRef = useRef<string>("");
  const productCacheRef = useRef<Map<number, Product>>(new Map());

  const applyFilters = () => {
    setFilters((prev) => ({
      ...prev,
      orderId: tempFilters.orderId,
      userId: tempFilters.userId,
      status: tempFilters.status,
    }));
    setPage(0);
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      applyFilters();
    }
  };

  const fetchOrders = async () => {
    setLoading(true);

    if (filters.orderId && filters.orderId.trim()) {
      const orderIdNum = parseInt(filters.orderId.trim());

      if (!isNaN(orderIdNum)) {
        try {
          const order = await OrdersApi.getById(orderIdNum);
          setOrders([order]);
          setTotalPages(1);
          setLoading(false);
          return;
        } catch {
          setOrders([]);
          setTotalPages(1);
          setLoading(false);
          return;
        }
      }
    }

    try {
      const params: OrderQueryParams = {
        page,
        size: pageSize,
      };

      if (filters.userId && filters.userId.trim()) {
        params.userId = filters.userId;
      }

      if (filters.status && filters.status.trim()) {
        params.status = filters.status;
      }

      if (filters.sortBy) {
        params.sortBy = filters.sortBy;
      }

      if (filters.sortDirection) {
        params.sortDirection = filters.sortDirection;
      }

      const ordersData = await OrdersApi.getAll(params);
      if (ordersData.content) {
        setOrders(ordersData.content as unknown as Order[]);
        setTotalPages(ordersData.totalPages || 1);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtersString = JSON.stringify(filters) + page + pageSize;
    if (prevFiltersRef.current === filtersString) return;
    prevFiltersRef.current = filtersString;
    fetchOrders();
  }, [filters, page, pageSize]);

  const handleClearFilters = () => {
    setPage(0);
    setTempFilters({
      orderId: "",
      userId: "",
      status: "",
    });
    setFilters({
      orderId: "",
      userId: "",
      status: "",
      sortBy: "createdAt",
      sortDirection: "DESC",
    });
  };

  const fetchOrderDetails = async (orderId: number) => {
    setLoadingDetails(true);
    try {
      const orderDetails = await OrdersApi.getById(orderId);

      const allProductIds = Array.from(
        new Set(orderDetails.orderItems.map((item) => item.productId))
      );

      const productCache = productCacheRef.current;
      const missingIds = allProductIds.filter((id) => !productCache.has(id));

      if (missingIds.length > 0) {
        const newProducts = await ProductsApi.getByIds(missingIds, false);

        newProducts.forEach((p: Product) => productCache.set(p.id, p));

        setProducts((prev) => {
          const updated: Record<number, Product> = { ...prev };
          newProducts.forEach((p: Product) => {
            updated[p.id] = p;
          });
          return updated;
        });
      }

      setSelectedOrder(orderDetails);
      setShowDetailsDialog(true);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleViewDetails = (order: Order) => {
    fetchOrderDetails(order.id);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#F8F8F8]">Zamówienia</h2>
          <p className="text-[#A0A0A0] mt-1">Zarządzaj zamówieniami klientów</p>
        </div>
      </div>

      <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-[#A0A0A0] text-sm mb-2 block">ID Zamówienia</label>
              <div className="relative">
                <Input
                  placeholder="Wyszukaj..."
                  value={tempFilters.orderId}
                  onChange={(e) =>
                    setTempFilters(prev => ({ ...prev, orderId: e.target.value }))
                  }
                  onKeyDown={handleEnter}
                  className="bg-[#1F1F1F] border-[#3A3A3A] text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[#A0A0A0] text-sm mb-2 block">ID Użytkownika</label>
              <Input
                placeholder="Wyszukaj..."
                value={tempFilters.userId}
                onChange={(e) =>
                  setTempFilters(prev => ({ ...prev, userId: e.target.value }))
                }
                onKeyDown={handleEnter}
                className="bg-[#1F1F1F] border-[#3A3A3A] text-white"
              />
            </div>

            <div>
              <label className="text-[#A0A0A0] text-sm mb-2 block">Status</label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
                className="w-full bg-[#1F1F1F] border border-[#3A3A3A] text-white rounded-xl px-3 py-2"
              >
                <option value="">Wszystkie</option>
                <option value="READY_FOR_PAYMENT">Oczekiwanie na płatność</option>
                <option value="PAID">Opłacone</option>
                <option value="COMPLETED">Odebrane</option>
                <option value="CANCELLED">Anulowane</option>
                <option value="PAYMENT_FAILED">Nieudana płatność</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="w-full bg-transparent border-[#3A3A3A] text-white hover:bg-[#3A3A3A]"
              >
                <X className="w-4 h-4 mr-2" />
                Wyczyść filtry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div>
            <label className="text-[#A0A0A0] mr-2">Sortuj według:</label>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, sortBy: e.target.value }))
              }
              className="bg-[#2A2A2A] border border-[#3A3A3A] text-white rounded-xl px-3 py-1"
            >

              <option value="id">ID</option>
              <option value="userId">ID Użytkownika</option>
              <option value="totalPrice">Cena</option>
              <option value="createdAt">Data utworzenia</option>
            </select>
          </div>

          <div>
            <label className="text-[#A0A0A0] mr-2">Kierunek:</label>
            <select
              value={filters.sortDirection}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sortDirection: e.target.value as "ASC" | "DESC",
                }))
              }
              className="bg-[#2A2A2A] border border-[#3A3A3A] text-white rounded-xl px-3 py-1"
            >
              <option value="ASC">Rosnąco</option>
              <option value="DESC">Malejąco</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-[#A0A0A0] mr-2">Liczba na stronę:</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(0);
            }}
            className="bg-[#2A2A2A] border border-[#3A3A3A] text-white rounded-xl px-3 py-1"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
        <CardContent className="p-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#D4A44A] animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-[#A0A0A0] text-lg mb-2">Nie znaleziono zamówień</p>
              <p className="text-[#6A6A6A] text-sm">
                Spróbuj zmienić kryteria filtrowania
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#3A3A3A] hover:bg-transparent">
                      <TableHead className="text-[#A0A0A0]">ID</TableHead>
                      <TableHead className="text-[#A0A0A0]">User ID</TableHead>
                      <TableHead className="text-[#A0A0A0] text-center">Produkty</TableHead>
                      <TableHead className="text-[#A0A0A0]">Cena</TableHead>
                      <TableHead className="text-[#A0A0A0] text-center">Status</TableHead>
                      <TableHead className="text-[#A0A0A0]">Data</TableHead>
                      <TableHead className="text-[#A0A0A0] text-right">Akcje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <OrderRow
                        key={order.id}
                        order={order}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-center items-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => handlePageChange(page - 1)}
                  className="bg-transparent border-[#3A3A3A] text-white hover:bg-[#3A3A3A]"
                >
                  Poprzednia
                </Button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index)}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      page === index
                        ? "bg-[#D4A44A] text-black"
                        : "bg-[#2A2A2A] text-[#A0A0A0] border border-[#3A3A3A] hover:bg-[#3A3A3A]"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => handlePageChange(page + 1)}
                  className="bg-transparent border-[#3A3A3A] text-white hover:bg-[#3A3A3A]"
                >
                  Następna
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {loadingDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1F1F1F] border border-[#3A3A3A] rounded-lg p-6">
            <Loader2 className="w-8 h-8 text-[#D4A44A] animate-spin mx-auto" />
            <p className="text-white mt-4">Ładowanie szczegółów...</p>
          </div>
        </div>
      )}

      <OrderDetailsDialog
        order={selectedOrder}
        products={products}
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
      />
    </div>
  );
}