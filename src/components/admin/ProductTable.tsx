import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { ProductRow } from "./ProductRow";
import { ProductsApi, type DetailedProduct } from "@/api";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { ProductFilter } from "./ProductFilter";
interface ProductTableProps {
  onEdit: (product: DetailedProduct) => void;
  onDelete: (product: DetailedProduct) => void;
  onProductsChange?: (products: DetailedProduct[]) => void;
  loading: boolean;
  onAddProduct: () => void;
}


export interface ProductFilters {
  name?: string;
  platforms: number[];
  categories: number[];
  types: number[];
  producentIds: number[];
  visible?: boolean | null;
  priceRange: {
    min: number | null;
    max: number | null;
  };
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
}

interface ProductQueryParams {
  page: number;
  size?: number;
  platformIds?: number[];
  categoryIds?: number[];
  typeIds?: number[];
  producentIds?: number[];
  priceMin?: number;
  priceMax?: number;
  filter?: string;
  visible?: boolean;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
}

export interface FilterOption {
  id: number;
  name: string;
}

export interface ProductFiltersComponentProps {
  onFilterChange: (filters: ProductFilters) => void;
  platforms: FilterOption[];
  categories: FilterOption[];
  types: FilterOption[];
  producentIds: FilterOption[];
}


export const ProductTable = ({
  onEdit,
  onDelete,
  onAddProduct,
  onProductsChange,
}: ProductTableProps) => {
  const [products, setProducts] = useState<DetailedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState<ProductFilters>({
    name: "",
    platforms: [],
    categories: [],
    types: [],
    producentIds: [],
    visible: null,
    priceRange: { min: null, max: null },
    sortBy: "name",
    sortDirection: "ASC",
  });


  const prevFiltersRef = useRef<string>("");

  useEffect(() => {
    const filtersString = JSON.stringify(filters) + page + pageSize;
    if (prevFiltersRef.current === filtersString) return;
    prevFiltersRef.current = filtersString;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: ProductQueryParams = {
          page,
          size: pageSize,
          ...(filters.platforms?.length ? { platformIds: filters.platforms } : {}),
          ...(filters.categories?.length ? { categoryIds: filters.categories } : {}),
          ...(filters.types?.length ? { typeIds: filters.types } : {}),
          ...(filters.producentIds?.length ? { manufacturerIds: filters.producentIds } : {}),
          ...(filters.priceRange.min !== null ? { priceMin: filters.priceRange.min } : {}),
          ...(filters.priceRange.max !== null ? { priceMax: filters.priceRange.max } : {}),
          ...(filters.name ? { filter: filters.name } : {}),
          ...(filters.visible !== null ? { visible: filters.visible } : {}),
          ...(filters.sortBy ? { sortBy: filters.sortBy } : {}),
          ...(filters.sortDirection ? { sortDirection: filters.sortDirection } : {}),
        };

        const data = await ProductsApi.getAllDetailed(params);
        setProducts(data.content);
        setTotalPages(data.totalPages ?? 1);

        if (onProductsChange) {
          onProductsChange(data.content);
        }
      } catch (err) {
        console.error("Błąd pobierania produktów:", err);
        toast.error("Nie udało się pobrać produktów");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, onProductsChange, page, pageSize]);

  const handleFilterChange = (newFilters: ProductFilters) => {
    setPage(0);
    setFilters(newFilters);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleSortChange = <K extends keyof ProductFilters>(
   key: K,
   value: ProductFilters[K]
  ) => {
    setPage(0);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleVisibilityChange = async (product: DetailedProduct) => {
    try {
      await ProductsApi.setVisible(product.id);

      const updatedProducts = products.map((p) =>
        p.id === product.id ? { ...p, visible: !p.visible } : p
      );
      setProducts(updatedProducts);
      
      if (onProductsChange) {
        onProductsChange(updatedProducts);
      }

      setTimeout(() => {
        toast.success(`Pomyślnie zmieniono status produktu: ${product.name}`);
      }, 500);
    } catch (error) {
      console.error("Error changing product visibility:", error);
      setTimeout(() => {
        toast.error("Zmiana statusu produktu nie powiodła się");
      }, 500);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#F8F8F8]">Produkty</h2>
          <p className="text-[#A0A0A0] mt-1">Zarządzaj produktami w sklepie</p>
        </div>
        <Button
          onClick={onAddProduct}
          className="bg-[#D4A44A] text-black hover:bg-[#f1c562]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Dodaj produkt
        </Button>
      </div>

      <ProductFilter
        onFilterChange={handleFilterChange}
      />

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div>
            <label className="text-[#A0A0A0] mr-2">Sortuj według:</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleSortChange("sortBy", e.target.value)}
              className="bg-[#2A2A2A] border border-[#3A3A3A] text-white rounded-xl px-3 py-1"
            >
              <option value="name">Nazwa</option>
              <option value="price">Cena</option>
              <option value="stock">Stan</option>
              {/* TODO: Think about release Date as a data in a row. If yes, then add this below */}
              {/* <option value="discountPercentage">Rabat</option> */}
              <option value="releaseDate">Data wydania</option>
            </select>
          </div>

          <div>
            <label className="text-[#A0A0A0] mr-2">Kierunek:</label>
            <select
              value={filters.sortDirection}
              onChange={(e) =>
                handleSortChange("sortDirection", e.target.value as "ASC" | "DESC")
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
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-[#A0A0A0] text-lg mb-2">Nie znaleziono produktów</p>
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
                    <TableHead className="text-[#A0A0A0]">Nazwa</TableHead>
                    <TableHead className="text-[#A0A0A0]">Cena</TableHead>
                    <TableHead className="text-[#A0A0A0] text-center">Platforma</TableHead>
                    <TableHead className="text-[#A0A0A0] text-center">Stan</TableHead>
                    <TableHead className="text-[#A0A0A0]">Rabat</TableHead>
                    <TableHead className="text-[#A0A0A0] text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onToggleVisibility={handleVisibilityChange}
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
                >
                  Poprzednia
                </Button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      page === index
                        ? "bg-[#D4A44A] text-black"
                        : "bg-[#2A2A2A] text-[#A0A0A0] border border-[#3A3A3A]"
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
                >
                  Następna
                </Button>
              </div>
              </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};