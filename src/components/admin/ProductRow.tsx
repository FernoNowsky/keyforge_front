import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { type DetailedProduct } from "@/api";

interface ProductRowProps {
  product: DetailedProduct;
  onEdit: (product: DetailedProduct) => void;
  onDelete: (id: number) => void;
  onToggleVisibility: (product: DetailedProduct) => Promise<void>;
}

export const ProductRow = ({
  product,
  onEdit,
  onDelete,
  onToggleVisibility,
}: ProductRowProps) => {
  const [changingStatus, setChangingStatus] = useState(false);

  const handleStatusClick = async () => {
    setChangingStatus(true);
    await onToggleVisibility(product);
     setTimeout(() => {
    setChangingStatus(false);
  }, 500);
  };

  return (
    <TableRow className="border-[#3A3A3A] hover:bg-[#1C1C1C]">
      <TableCell className="text-[#F8F8F8] font-medium">{product.name}</TableCell>
      <TableCell className="text-[#D4A44A]">{product.price.toFixed(2)} PLN</TableCell>
      <TableCell>
        <Badge className="bg-[#3A3A3A] text-[#F8F8F8]">{product.platform.name}</Badge>
      </TableCell>
      <TableCell className="text-[#F8F8F8]">{product.stock} szt.</TableCell>
      <TableCell className="text-[#F8F8F8]">
        {product.discountPercentage > 0 ? `${product.discountPercentage}%` : "-"}
      </TableCell>

      <TableCell className="text-center">
        {changingStatus ? (
          <Badge className="bg-[#3A3A3A] text-[#D4A44A]">
            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
          </Badge>
        ) : (
          <Badge
            onClick={handleStatusClick}
            className={
              product.visible
                ? "bg-green-500/20 text-green-500 cursor-pointer"
                : "bg-red-500/20 text-red-500 cursor-pointer"
            }
            style={{ minWidth: "80px" }}
          >
            {product.visible ? "Widoczny" : "Ukryty"}
          </Badge>
        )}
      </TableCell>

      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(product)}
            className="text-[#D4A44A] hover:text-[#f1c562] hover:bg-[#3A3A3A]"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(product.id)}
            className="text-red-400 hover:text-red-300 hover:bg-[#3A3A3A]"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
