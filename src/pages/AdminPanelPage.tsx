import {useEffect, useState} from 'react';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    Loader2,
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import {ProductsApi, type DetailedProduct, type Review, OrdersApi, ReviewsAPI} from '@/api';
import { ProductEditDialog } from "@/components/admin/ProductEditDialog.tsx";
import { toast } from 'sonner';
import { ProductTable } from '@/components/admin/ProductTable';
import { ProductCreateDialog } from '@/components/admin/ProductCreateDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {eventBus} from "@/utils/events.ts";
import { UsersApi } from '@/api/usersApi';
import {ReviewsPagination} from "@/components/admin/reviews/ReviewsPagination.tsx";
import {ReviewsTable} from "@/components/admin/reviews/ReviewsTable.tsx";
import {ReviewsFilters} from "@/components/admin/reviews/ReviewsFilters.tsx";
import {ReviewsHeader} from "@/components/admin/reviews/ReviewsHeader.tsx";
import type {ReviewStatus} from "@/components/admin/reviews/ReviewsRow.tsx";
import { OrdersTable } from '@/components/admin/orders/OrdersTable';

interface RevenueData {
    date: string;
    revenue: number;
}

interface OrdersData {
    date: string;
    amount: number;
}

interface ChartDataPoint {
    date: string;
    revenue: number;
    amount: number;
}

interface ReviewsQueryParams {
    page: number;
    size?: number;
    filter?: string;
    status?: "PENDING" | "APPROVED" | "REJECTED";
    userId?: string;
    sortBy?: string;
    sortDirection?: "ASC" | "DESC";
}

const getLast30Days = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    return { startDate: thirtyDaysAgo, endDate: today };
};

const fillMissingDates = (
    revenueData: RevenueData[],
    ordersData: OrdersData[],
    startDate: Date,
    endDate: Date
): ChartDataPoint[] => {
    const result: ChartDataPoint[] = [];
    const revenueMap = new Map(revenueData.map(item => [item.date, item.revenue]));
    const ordersMap = new Map(ordersData.map(item => [item.date, item.amount]));

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const formattedDate = `${day}-${month}`;

        result.push({
            date: formattedDate,
            revenue: revenueMap.get(dateStr) || 0,
            amount: ordersMap.get(dateStr) || 0,
        });

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
};

const calcPercentChange = (today: number, yesterday: number): number => {
    if (yesterday === 0 && today > 0) return 100;
    if (yesterday === 0 && today === 0) return 0;

    return Number((((today - yesterday) / yesterday) * 100).toFixed(2));
};

export function AdminPanelPage() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedProductItem, setSelectedProductItem] = useState<DetailedProduct | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<DetailedProduct | null>(null);
    const [dashboardLoading, setDashboardLoading] = useState(true);
    const [products, setProducts] = useState<DetailedProduct[]>([]);
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [revenueToday, setRevenueToday] = useState(0)
    const [ordersToday, setOrdersToday] = useState(0)
    const [todayRevenueChange, setTodayRevenueChange] = useState(0);
    const [todayOrdersChange, setTodayOrdersChange] = useState(0);
    const [reviews, setReviews] = useState<Review[]>([])

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState<string>("createdAt");
    const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");
    const [searchInput, setSearchInput] = useState('');


    const handleSearch = () => {
        setPage(0);
        setSearchTerm(searchInput);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    const loadDashboardData = async () => {
        try {
            setDashboardLoading(true);

            const { startDate, endDate } = getLast30Days();

            const params = {
                fromDate: startDate,
                toDate: endDate,
            };

            const [
                revenueRes,
                ordersRes,
                revenueTodayVal,
                ordersTodayVal,
            ] = await Promise.all([
                OrdersApi.getRevenueStats(params),
                OrdersApi.getOrdersAmountStats(params),
                OrdersApi.getRevenueStatsToday(),
                OrdersApi.getOrdersAmountStatsToday(),
            ]);

            const revenueMapped: RevenueData[] = (revenueRes as unknown as RevenueData[]).map((r) => ({
                date: r.date,
                revenue: r.revenue,
            }));

            const ordersMapped: OrdersData[] = (ordersRes as unknown as OrdersData[]).map((o) => ({
                date: o.date,
                amount: o.amount,
            }));

            const filled = fillMissingDates(revenueMapped, ordersMapped, startDate, endDate);

            setChartData(filled);

            setRevenueToday(revenueTodayVal);
            setOrdersToday(ordersTodayVal);

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yDate = yesterday.toISOString().split('T')[0];

            const revYesterday =
                revenueMapped.find((r) => r.date === yDate)?.revenue ?? 0;
            const ordYesterday =
                ordersMapped.find((o) => o.date === yDate)?.amount ?? 0;

            setTodayRevenueChange(calcPercentChange(revenueTodayVal, revYesterday));
            setTodayOrdersChange(calcPercentChange(ordersTodayVal, ordYesterday));
        } catch (err) {
            console.error(err);
        } finally {
            setDashboardLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadReviews = async () => {
        try {
            const params: ReviewsQueryParams = {
                page,
                size: pageSize,
                sortBy,
                sortDirection,
                filter: searchTerm
            };

            if (statusFilter !== "all") {
                params.status = statusFilter as ReviewStatus;
            }

            const res = await ReviewsAPI.getAll(params);
            const reviewsWithUserId = res.content;
            const allUserIds = Array.from(new Set(reviewsWithUserId.map(r => r.userId)));
            const usersData = await UsersApi.getUsersById(allUserIds);
            const userIdToUsername = new Map<string, string>();
            usersData.forEach(user => {
                userIdToUsername.set(user.id, user.username);
            });

            const updatedReviews = reviewsWithUserId.map(review => {
                const username = userIdToUsername.get(review.userId);
                    return {
                        ...review,
                        userId: username || review.userId,
                    };
            });

            setReviews(updatedReviews);
            setTotalPages(res.totalPages ?? 1);
        } catch (error) {
            console.error(error)
            toast.error("Nie udało się pobrać opinii użytkowników")
        }
    }

    useEffect(() => {
        loadReviews();
    }, [page, pageSize, statusFilter, sortBy, sortDirection, searchTerm]);


    const monthRevenueTotal = chartData.reduce((s, d) => s + d.revenue, 0);
    const avgOrderValue =
        ordersToday > 0 ? (revenueToday / ordersToday).toFixed(2) : '0.00';


    const handleEditProduct = (product: DetailedProduct) => {
        setSelectedProductItem(product);
        setEditDialogOpen(true);
    };

    const handleDeleteProduct = (product: DetailedProduct) => {
        setProductToDelete(product);
        setConfirmDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;

        try {
            await ProductsApi.setDeleted(productToDelete.id);

            setProducts(products.filter(p => p.id !== productToDelete.id));
            eventBus.emit("products:reload");
            setTimeout(() => {
                toast.success(`Pomyślnie usunięto produkt: ${productToDelete.name}`);
            }, 500);
        } catch (error) {
            console.error('Error deleting product:', error);
            setTimeout(() => {
                toast.error("Usuwanie produktu nie powiodło się");
            }, 500);
        } finally {
            setConfirmDeleteOpen(false);
            setProductToDelete(null);
        }
    };

    const handleReviewStatusChange = async (
        reviewId: number, 
        currentStatus: string, 
        newStatus: "PENDING" | "APPROVED" | "REJECTED"
    ) => {
        if (currentStatus === newStatus) return;

        const shouldRefresh = 
            newStatus === "APPROVED" || 
            (currentStatus === "APPROVED" && (newStatus === "PENDING" || newStatus === "REJECTED"));
        console.log(shouldRefresh)
        try {
            
            await ReviewsAPI.updateReviewStatus(reviewId, {
                status: newStatus,
                refreshMainReviewProduct: shouldRefresh
            });

            setTimeout(() => {
                setReviews(prevReviews =>
                    prevReviews.map(review =>
                        review.id === reviewId ? { ...review, status: newStatus } : review
                    )
                );
                toast.success(`Status opinii został zaktualizowany na: ${
                    newStatus === 'APPROVED' ? 'Zatwierdzono' :
                    newStatus === 'REJECTED' ? 'Odrzucono' : 'Oczekuje'
                }`);
            }, 500);
        } catch (error) {
            console.error('Error updating review status:', error);
            setTimeout(() => {
                toast.error("Nie udało się zaktualizować statusu opinii");
            }, 500);
        }
    };

    if (dashboardLoading && activeTab === 'dashboard') {
        return (
            <div className="flex min-h-screen bg-[#1C1C1C]">
                <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                <main className="flex-1 py-4 mr-14">
                    <div className="space-y-6 flex justify-center items-center min-h-screen">
                        <Loader2 className="animate-spin w-10 h-10 text-[#D4A44A]" />
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#1C1C1C]">
            <AdminSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            <main className="flex-1 py-4 mr-14">
                {activeTab === 'dashboard' && (
                    <div className="space-y-8">

                        <h2 className="text-3xl font-bold text-white">Dashboard</h2>


                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

                            <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
                                <CardHeader>
                                    <CardTitle className="text-sm text-gray-400">Przychód dziś</CardTitle>
                                </CardHeader>
                                <CardContent className="flex justify-between items-center">
                                    <div>
                                        <p className="text-3xl font-bold text-white">
                                            {revenueToday.toFixed(2)} PLN
                                        </p>
                                        <p
                                            className={`flex items-center gap-1 mt-1 text-sm ${
                                                todayRevenueChange >= 0
                                                    ? 'text-green-500'
                                                    : 'text-red-500'
                                            }`}
                                        >
                                            {todayRevenueChange >= 0 ? (
                                                <TrendingUp className="w-4 h-4" />
                                            ) : (
                                                <TrendingDown className="w-4 h-4" />
                                            )}
                                            {todayRevenueChange}%
                                        </p>
                                    </div>
                                    <DollarSign className="w-10 h-10 text-[#D4A44A]" />
                                </CardContent>
                            </Card>

                            <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
                                <CardHeader>
                                    <CardTitle className="text-sm text-gray-400">Zamówienia dziś</CardTitle>
                                </CardHeader>
                                <CardContent className="flex justify-between items-center">
                                    <div>
                                        <p className="text-3xl font-bold text-white">{ordersToday}</p>
                                        <p
                                            className={`flex items-center gap-1 mt-1 text-sm ${
                                                todayOrdersChange >= 0
                                                    ? 'text-green-500'
                                                    : 'text-red-500'
                                            }`}
                                        >
                                            {todayOrdersChange >= 0 ? (
                                                <TrendingUp className="w-4 h-4" />
                                            ) : (
                                                <TrendingDown className="w-4 h-4" />
                                            )}
                                            {todayOrdersChange}%
                                        </p>
                                    </div>
                                    <ShoppingCart className="w-10 h-10 text-[#D4A44A]" />
                                </CardContent>
                            </Card>

                            <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
                                <CardHeader>
                                    <CardTitle className="text-sm text-gray-400">
                                        Średnia wartość zamówienia dziś
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-bold text-white">{avgOrderValue} PLN</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
                                <CardHeader>
                                    <CardTitle className="text-sm text-gray-400">
                                        Przychód (ostatnie 30 dni)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-bold text-white">
                                        {monthRevenueTotal.toFixed(2)} PLN
                                    </p>
                                </CardContent>
                            </Card>

                        </div>


                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
                                <CardHeader>
                                    <CardTitle className="text-white">Przychód</CardTitle>
                                    <CardDescription className="text-gray-400">
                                        Z ostatnich 30 dni
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={350}>
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#D4A44A" stopOpacity={0.4} />
                                                    <stop offset="100%" stopColor="#D4A44A" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>

                                            <CartesianGrid stroke="#3A3A3A" strokeDasharray="3 3" />
                                            <XAxis stroke="#aaa" dataKey="date" />
                                            <YAxis stroke="#aaa" />

                                            <Tooltip
                                                contentStyle={{
                                                    background: '#2A2A2A',
                                                    border: '1px solid #3A3A3A',
                                                    color: 'white',
                                                }}
                                                formatter={(value: number, name: string) => {
                                                    const label = name === 'revenue' ? 'Przychód' : name;
                                                    return [value, label];
                                                }}
                                            />

                                            <Area
                                                type="monotone"
                                                dataKey="revenue"
                                                stroke="#D4A44A"
                                                fill="url(#revGrad)"
                                                strokeWidth={2}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
                                <CardHeader>
                                    <CardTitle className="text-white">Zamówienia</CardTitle>
                                    <CardDescription className="text-gray-400">
                                        Z ostatnich 30 dni
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={350}>
                                        <LineChart data={chartData}>
                                            <CartesianGrid stroke="#3A3A3A" strokeDasharray="3 3" />
                                            <XAxis stroke="#aaa" dataKey="date" />
                                            <YAxis stroke="#aaa" />

                                            <Tooltip
                                                contentStyle={{
                                                    background: '#2A2A2A',
                                                    border: '1px solid #3A3A3A',
                                                    color: 'white',
                                                }}
                                                formatter={(value: number, name: string) => {
                                                    const label = name === 'amount' ? 'Zamówienia' : name;
                                                    return [value, label];
                                                }}
                                            />

                                            <Line
                                                type="monotone"
                                                dataKey="amount"
                                                stroke="#D4A44A"
                                                strokeWidth={3}
                                                dot={{ fill: '#D4A44A', r: 4 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                        </div>

                    </div>
                )}

                {activeTab === "orders" && (
                    <OrdersTable/>
                )}

                {activeTab === "products" && (
                    <ProductTable
                        onEdit={handleEditProduct}
                        onDelete={handleDeleteProduct}
                        onAddProduct={() => setCreateDialogOpen(true)}
                        onProductsChange={setProducts}
                        loading={true}          />
                )}

                {activeTab === 'reviews' && (
                    <div className="space-y-6">

                        <ReviewsHeader />

                        <ReviewsFilters
                            searchTerm={searchInput}
                            setSearchTerm={setSearchInput}
                            onSearch={handleSearch}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            pageSize={pageSize}
                            setPageSize={(size) => {
                                setPageSize(size);
                                setPage(0);
                            }}
                        />
                        <div className="flex items-center gap-4 mb-4">

                            <div>
                                <label className="text-[#A0A0A0] mr-2">Sortuj według:</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => { setSortBy(e.target.value); setPage(0); }}
                                    className="bg-[#2A2A2A] border border-[#3A3A3A] text-white rounded-xl px-3 py-1"
                                >
                                    <option value="createdAt">Data dodania</option>
                                    <option value="rating">Ocena</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[#A0A0A0] mr-2">Kierunek:</label>
                                <select
                                    value={sortDirection}
                                    onChange={(e) =>
                                    { setSortDirection(e.target.value as "ASC" | "DESC"); setPage(0); }
                                    }
                                    className="bg-[#2A2A2A] border border-[#3A3A3A] text-white rounded-xl px-3 py-1"
                                >
                                    <option value="ASC">Rosnąco</option>
                                    <option value="DESC">Malejąco</option>
                                </select>
                            </div>

                        </div>

                        <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
                            <CardContent className="p-6">

                                <ReviewsTable
                                    filteredReviews={reviews}
                                    handleReviewStatusChange={handleReviewStatusChange}
                                />

                                <ReviewsPagination
                                    page={page}
                                    totalPages={totalPages}
                                    handlePageChange={handlePageChange}
                                />

                            </CardContent>
                        </Card>

                    </div>
                )}
            </main>

            <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
                <AlertDialogContent className="bg-[#2A2A2A] border-[#3A3A3A] text-[#F8F8F8]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Czy na pewno chcesz usunąć produkt?</AlertDialogTitle>
                        <AlertDialogDescription className="text-[#A0A0A0]">
                            Produkt <span className="text-[#D4A44A] font-semibold">
                                    {productToDelete?.name}
                                  </span>{" "}
                            zostanie trwale usunięty z listy. Tej operacji nie można cofnąć.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Nie, anuluj</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="!bg-red-600/40 hover:!bg-red-800 !text-white"
                        >
                            Tak, usuń
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <ProductCreateDialog
                createDialogOpen={createDialogOpen}
                setCreateDialogOpen={setCreateDialogOpen}
                products={products}
                setProducts={setProducts}
            />

            <ProductEditDialog
                editDialogOpen={editDialogOpen}
                setEditDialogOpen={setEditDialogOpen}
                selectedProductItem={selectedProductItem}
                setSelectedProductItem={setSelectedProductItem}
                products={products}
                setProducts={setProducts}
            />
        </div>
    );
}