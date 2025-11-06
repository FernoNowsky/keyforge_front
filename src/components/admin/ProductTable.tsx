import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { ProductRow } from "./ProductRow";
import { type DetailedProduct } from "@/api";

interface ProductTableProps {
  products: DetailedProduct[];
  onEdit: (product: DetailedProduct) => void;
  onDelete: (product: DetailedProduct) => void;
  onToggleVisibility: (product: DetailedProduct) => Promise<void>;
  loading: boolean;
  onAddProduct: () => void;
}

export const ProductTable = ({
  products,
  onEdit,
  onDelete,
  onToggleVisibility,
  loading,
  onAddProduct,
}: ProductTableProps) => {
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

      <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
        <CardContent className="p-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#D4A44A] animate-spin" />
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
                      onToggleVisibility={onToggleVisibility}
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
