import {
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import type { Order } from "@/api";

const statusMap: Record<string, { label: string; className: string }> = {
  READY_FOR_PAYMENT: {
    label: "Oczekiwanie na płatność",
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

export function OrderRow({ 
  order, 
  onViewDetails 
}: { 
  order: Order; 
  onViewDetails: (order: Order) => void;
}) {
  const productCount = order.orderItems.length;
  const totalQuantity = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <TableRow className="border-[#3A3A3A] hover:bg-[#1C1C1C]">
      <TableCell className="text-[#F8F8F8] font-medium">#{order.id}</TableCell>
      <TableCell className="text-[#F8F8F8]">{order.userId}</TableCell>
      <TableCell className="text-[#A0A0A0] text-center">
        {productCount} ({totalQuantity} szt.)
      </TableCell>
      <TableCell className="text-[#D4A44A] font-semibold">
        {order.totalPrice.toFixed(2)} PLN
      </TableCell>
      <TableCell className="text-center">
        <Badge className={`${statusMap[order.status].className} border w-[180px]`}>
          {statusMap[order.status].label}
        </Badge>
      </TableCell>
      <TableCell className="text-[#A0A0A0] text-sm">
        {new Date(order.createdAt).toLocaleDateString('pl-PL')}
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(order)}
          className="text-[#D4A44A] hover:text-[#f1c562] hover:bg-[#3A3A3A]"
        >
          <Eye className="w-4 h-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};