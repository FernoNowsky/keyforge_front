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
  manufacturers: number[];
  visible?: boolean | null;
  priceRange: {
    min: number | null;
    max: number | null;
  };
}

interface ProductQueryParams {
  page: number;
  size?: number;
  platformIds?: number[];
  categoryIds?: number[];
  typeIds?: number[];
  manufacturerIds?: number[];
  priceMin?: number;
  priceMax?: number;
  filter?: string;
  visible?: boolean;
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
  manufacturers: FilterOption[];
}


export const ProductTable = ({
  onEdit,
  onDelete,
  onAddProduct,
  onProductsChange,
}: ProductTableProps) => {
  const [products, setProducts] = useState<DetailedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFilters>({
    name: "",
    platforms: [],
    categories: [],
    types: [],
    manufacturers: [],
    visible: null,
    priceRange: { min: null, max: null },
  });


  const prevFiltersRef = useRef<string>("");

  useEffect(() => {
    const filtersString = JSON.stringify(filters);
    if (prevFiltersRef.current === filtersString) return;
    prevFiltersRef.current = filtersString;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: ProductQueryParams = {
          page: 0,
          size: 50,
          ...(filters.platforms?.length ? { platformIds: filters.platforms } : {}),
          ...(filters.categories?.length ? { categoryIds: filters.categories } : {}),
          ...(filters.types?.length ? { typeIds: filters.types } : {}),
          ...(filters.manufacturers?.length ? { manufacturerIds: filters.manufacturers } : {}),
          ...(filters.priceRange.min !== null ? { priceMin: filters.priceRange.min } : {}),
          ...(filters.priceRange.max !== null ? { priceMax: filters.priceRange.max } : {}),
          ...(filters.name ? { filter: filters.name } : {}),
          ...(filters.visible !== null ? { visible: filters.visible } : {}),
        };

        const data = await ProductsApi.getAllDetailed(params);
        setProducts(data.content);
        
        // Opcjonalnie: powiadom rodzica o zmianie produktów
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
  }, [filters, onProductsChange]);

  const handleFilterChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};