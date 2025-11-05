import { useState } from 'react';
import {
  ChevronRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Edit,
  Trash2,
  Plus,
  Search,
  Star,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import type { DetailedProduct, Review } from '@/api';
import { mockProducts, mockReviews } from '@/assets/adminData';
// Mock data
const mockChartData = [
  { date: 'Nov 1', revenue: 850, orders: 12 },
  { date: 'Nov 2', revenue: 1200, orders: 18 },
  { date: 'Nov 3', revenue: 950, orders: 14 },
  { date: 'Nov 4', revenue: 1400, orders: 21 },
  { date: 'Nov 5', revenue: 1250, orders: 19 },
];

export function AdminPanelPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<DetailedProduct[]>(mockProducts);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [selectedProductItem, setSelectedProductItem] = useState<DetailedProduct | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const pendingReviews = reviews.filter((r) => r.status === 'PENDING').length
  const stats = {
    todayRevenue: 1250.00,
    todayOrders: 19,
    todayRevenueChange: 12.5,
    todayOrdersChange: -20,
    monthRevenue: 45678.50,
    monthOrders: 234,
    activeUsers: 45678,
    growthRate: 4.5
  };

const handleEditProduct = (product: DetailedProduct) => {
  setSelectedProductItem(product);
  setEditDialogOpen(true);
};

const handleSaveProduct = () => {
  if (selectedProductItem) {
    setProducts(products.map(p => p.id === selectedProductItem.id ? selectedProductItem : p));
    setEditDialogOpen(false);
  }
};

 const handleDeleteProduct = (id: number) => {
  setProducts(products.filter(p => p.id !== id));
};

const handleDeleteReview = (id: number) => {
  setReviews(reviews.filter(r => r.id !== id));
};

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex min-h-screen bg-[#1C1C1C]">
        
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingReviews={pendingReviews}
        />

      {/* Main Content */}
      <main className="flex-1 py-4 mr-14">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-[#F8F8F8]">Dashboard</h2>
              <p className="text-[#A0A0A0] mt-1">Przegląd statystyk i aktywności</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-[#A0A0A0]">
                    Przychód dziś
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-[#F8F8F8]">
                        ${stats.todayRevenue.toFixed(2)}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-500">+{stats.todayRevenueChange}%</span>
                      </div>
                    </div>
                    <DollarSign className="w-8 h-8 text-[#D4A44A]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-[#A0A0A0]">
                    Zamówienia dziś
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-[#F8F8F8]">
                        {stats.todayOrders}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingDown className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-red-500">{stats.todayOrdersChange}%</span>
                      </div>
                    </div>
                    <ShoppingCart className="w-8 h-8 text-[#D4A44A]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-[#A0A0A0]">
                    Aktywni użytkownicy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-[#F8F8F8]">
                        {stats.activeUsers.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-500">+12.5%</span>
                      </div>
                    </div>
                    <Users className="w-8 h-8 text-[#D4A44A]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-[#A0A0A0]">
                    Tempo wzrostu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-[#F8F8F8]">
                        {stats.growthRate}%
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-500">+4.5%</span>
                      </div>
                    </div>
                    <ChevronRight className="w-8 h-8 text-[#D4A44A]" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
                <CardHeader>
                  <CardTitle className="text-[#F8F8F8]">Przychód</CardTitle>
                  <CardDescription className="text-[#A0A0A0]">
                    Przychód od początku miesiąca
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={mockChartData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D4A44A" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#D4A44A" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3A" />
                      <XAxis dataKey="date" stroke="#A0A0A0" />
                      <YAxis stroke="#A0A0A0" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#2A2A2A',
                          border: '1px solid #3A3A3A',
                          borderRadius: '8px',
                          color: '#F8F8F8'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#D4A44A"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
                <CardHeader>
                  <CardTitle className="text-[#F8F8F8]">Zamówienia</CardTitle>
                  <CardDescription className="text-[#A0A0A0]">
                    Liczba zamówień w ostatnich dniach
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3A" />
                      <XAxis dataKey="date" stroke="#A0A0A0" />
                      <YAxis stroke="#A0A0A0" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#2A2A2A',
                          border: '1px solid #3A3A3A',
                          borderRadius: '8px',
                          color: '#F8F8F8'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="orders"
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

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-[#F8F8F8]">Produkty</h2>
                <p className="text-[#A0A0A0] mt-1">Zarządzaj produktami w sklepie</p>
              </div>
              <Button className="bg-[#D4A44A] text-black hover:bg-[#f1c562]">
                <Plus className="w-4 h-4 mr-2" />
                Dodaj produkt
              </Button>
            </div>

            <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-[#3A3A3A] hover:bg-transparent">
                        <TableHead className="text-[#A0A0A0]">Nazwa</TableHead>
                        <TableHead className="text-[#A0A0A0]">Cena</TableHead>
                        <TableHead className="text-[#A0A0A0]">Platforma</TableHead>
                        <TableHead className="text-[#A0A0A0]">Stan</TableHead>
                        <TableHead className="text-[#A0A0A0]">Rabat</TableHead>
                        <TableHead className="text-[#A0A0A0]">Status</TableHead>
                        <TableHead className="text-[#A0A0A0] text-right">Akcje</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id} className="border-[#3A3A3A] hover:bg-[#1C1C1C]">
                          <TableCell className="text-[#F8F8F8] font-medium">
                            {product.name}
                          </TableCell>
                          <TableCell className="text-[#D4A44A]">
                            {product.price.toFixed(2)} PLN
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-[#3A3A3A] text-[#F8F8F8]">
                              {product.platform.name}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-[#F8F8F8]">
                            {product.stock} szt.
                          </TableCell>
                          <TableCell className="text-[#F8F8F8]">
                            {product.discountPercentage > 0 ? `${product.discountPercentage}%` : '-'}
                          </TableCell>
                          <TableCell>
                            <Badge className={product.visible ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}>
                              {product.visible ? 'Widoczny' : 'Ukryty'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditProduct(product)}
                                className="text-[#D4A44A] hover:text-[#f1c562] hover:bg-[#3A3A3A]"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-400 hover:text-red-300 hover:bg-[#3A3A3A]"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-[#F8F8F8]">Opinie użytkowników</h2>
                <p className="text-[#A0A0A0] mt-1">Moderuj i zarządzaj opiniami</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#A0A0A0]" />
                <Input
                  placeholder="Szukaj opinii..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#2A2A2A] border-[#3A3A3A] text-[#F8F8F8]"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 bg-[#2A2A2A] border-[#3A3A3A] text-[#F8F8F8]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A]">
                  <SelectItem value="all" className="text-[#F8F8F8]">Wszystkie</SelectItem>
                  <SelectItem value="PENDING" className="text-[#F8F8F8]">Oczekujące</SelectItem>
                  <SelectItem value="APPROVED" className="text-[#F8F8F8]">Zatwierdzone</SelectItem>
                  <SelectItem value="REJECTED" className="text-[#F8F8F8]">Odrzucone</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-[#3A3A3A] hover:bg-transparent">
                        <TableHead className="text-[#A0A0A0]">Użytkownik</TableHead>
                        <TableHead className="text-[#A0A0A0]">Treść</TableHead>
                        <TableHead className="text-[#A0A0A0]">Ocena</TableHead>
                        <TableHead className="text-[#A0A0A0]">Status</TableHead>
                        <TableHead className="text-[#A0A0A0]">Data</TableHead>
                        <TableHead className="text-[#A0A0A0] text-right">Akcje</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReviews.map((review) => (
                        <TableRow key={review.id} className="border-[#3A3A3A] hover:bg-[#1C1C1C]">
                          <TableCell className="text-[#F8F8F8] font-medium">
                            {review.userId}
                          </TableCell>
                          <TableCell className="text-[#F8F8F8] max-w-md">
                            <div className="truncate">{review.content}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-[#D4A44A] text-[#D4A44A]" />
                              <span className="text-[#F8F8F8]">{review.rating}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              review.status === 'APPROVED' 
                                ? 'bg-green-500/20 text-green-500'
                                : review.status === 'REJECTED'
                                ? 'bg-red-500/20 text-red-500'
                                : 'bg-yellow-500/20 text-yellow-500'
                            }>
                              {review.status === 'APPROVED' ? 'Zatwierdzono' : 
                               review.status === 'REJECTED' ? 'Odrzucono' : 'Oczekuje'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-[#A0A0A0]">
                            {review.createdAt.toLocaleDateString('pl-PL')}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                // onClick={() => handleEditReview(review)}
                                className="text-[#D4A44A] hover:text-[#f1c562] hover:bg-[#3A3A3A]"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteReview(review.id)}
                                className="text-red-400 hover:text-red-300 hover:bg-[#3A3A3A]"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Product Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-[#2A2A2A] border-[#3A3A3A] text-[#F8F8F8]">
          <DialogHeader>
            <DialogTitle className="text-[#F8F8F8]">Edytuj produkt</DialogTitle>
            <DialogDescription className="text-[#A0A0A0]">
              Wprowadź zmiany w produkcie
            </DialogDescription>
          </DialogHeader>
          {selectedProductItem && (
            <div className="space-y-4">
              <div>
                <Label className="text-[#A0A0A0]">Nazwa</Label>
                <Input
                  value={selectedProductItem.name}
                  onChange={(e) => setSelectedProductItem({...selectedProductItem, name: e.target.value})}
                  className="bg-[#1C1C1C] border-[#3A3A3A] text-[#F8F8F8]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#A0A0A0]">Cena (PLN)</Label>
                  <Input
                    type="number"
                    value={selectedProductItem.price}
                    onChange={(e) => setSelectedProductItem({...selectedProductItem, price: parseFloat(e.target.value)})}
                    className="bg-[#1C1C1C] border-[#3A3A3A] text-[#F8F8F8]"
                  />
                </div>
                <div>
                  <Label className="text-[#A0A0A0]">Stan magazynowy</Label>
                  <Input
                    type="number"
                    value={selectedProductItem.stock}
                    onChange={(e) => setSelectedProductItem({...selectedProductItem, stock: parseInt(e.target.value)})}
                    className="bg-[#1C1C1C] border-[#3A3A3A] text-[#F8F8F8]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#A0A0A0]">Rabat (%)</Label>
                  <Input
                    type="number"
                    value={selectedProductItem.discountPercentage}
                    onChange={(e) => setSelectedProductItem({...selectedProductItem, discountPercentage: parseInt(e.target.value)})}
                    className="bg-[#1C1C1C] border-[#3A3A3A] text-[#F8F8F8]"
                  />
                </div>
                <div>
                  <Label className="text-[#A0A0A0]">Status</Label>
                  <Select 
                    value={selectedProductItem.visible ? 'visible' : 'hidden'}
                    onValueChange={(value) => setSelectedProductItem({...selectedProductItem, visible: value === 'visible'})}
                  >
                    <SelectTrigger className="bg-[#1C1C1C] border-[#3A3A3A] text-[#F8F8F8]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A]">
                      <SelectItem value="visible" className="text-[#F8F8F8]">Widoczny</SelectItem>
                      <SelectItem value="hidden" className="text-[#F8F8F8]">Ukryty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              className="border-[#3A3A3A] text-[#F8F8F8] hover:bg-[#3A3A3A]"
            >
              Anuluj
            </Button>
            <Button
              onClick={handleSaveProduct}
              className="bg-[#D4A44A] text-black hover:bg-[#f1c562]"
            >
              Zapisz zmiany
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}