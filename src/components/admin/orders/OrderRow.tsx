import {
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, Eye } from "lucide-react";
import { useState } from "react";
import { OrdersApi, type Order } from "@/api";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
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
  const [currentStatus, setCurrentStatus] = useState(order.status);

  const handleOrderStatusChange = async (newStatus: Order["status"]) => {
    if (newStatus === currentStatus) return;
    if (currentStatus === "COMPLETED") {
      toast.error("Nie można zmienić statusu zamówienia, które zostało odebrane.");
      return;
    }
    try {
      await OrdersApi.updateOrderById({orderId: order.id, status: newStatus });

      setTimeout(() => {
        setCurrentStatus(newStatus);

        toast.success(`Status zamówienia zmieniony na: ${statusMap[newStatus].label}`);
      }, 300);
    } catch (error) {
      console.error("Error updating order status:", error);
      setTimeout(() => {
        toast.error("Nie udało się zmienić statusu zamówienia");
      }, 300);
    }
  };

  const productCount = order.orderItems.length;
  const totalQuantity = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <TableRow className="border-[#3A3A3A] hover:bg-[#1C1C1C]">
      <TableCell className="text-[#F8F8F8] font-medium">#{order.id}</TableCell>
      <TableCell className="text-[#F8F8F8]">{order.userId}</TableCell>
      <TableCell className="text-[#A0A0A0] text-center">
        {productCount} ({totalQuantity} szt.)
      </TableCell>
      <TableCell className="text-[#D4A44A] text-center font-semibold">
        {order.totalPrice.toFixed(2)} PLN
      </TableCell>
      <TableCell className="flex justify-center ml-6">
          <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                      <Badge
                          className={`w-[180px] border ${
                              statusMap[currentStatus].className
                          }`}
                      >
                          {statusMap[currentStatus].label}
                      </Badge>
                      <ChevronDown className="w-4 h-4 text-[#A0A0A0]" />
                  </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="bg-[#2A2A2A] border-[#3A3A3A]">
                  <DropdownMenuItem
                      onClick={() => handleOrderStatusChange("READY_FOR_PAYMENT")}
                      className="text-blue-400 hover:bg-blue-500/20 cursor-pointer"
                  >
                      Oczekuje na płatność
                  </DropdownMenuItem>

                  <DropdownMenuItem
                      onClick={() => handleOrderStatusChange("PAID")}
                      className="text-green-400 hover:bg-green-500/20 cursor-pointer"
                  >
                      Opłacone
                  </DropdownMenuItem>

                  <DropdownMenuItem
                      onClick={() => handleOrderStatusChange("COMPLETED")}
                      className="text-[#D4A44A] hover:bg-[#D4A44A]/20 cursor-pointer"
                  >
                      Odebrane
                  </DropdownMenuItem>

                  <DropdownMenuItem
                      onClick={() => handleOrderStatusChange("CANCELLED")}
                      className="text-red-500 hover:bg-red-500/20 cursor-pointer"
                  >
                      Anulowane
                  </DropdownMenuItem>

                  <DropdownMenuItem
                      onClick={() => handleOrderStatusChange("PAYMENT_FAILED")}
                      className="text-red-400 hover:bg-red-500/20 cursor-pointer"
                  >
                      Płatność nieudana
                  </DropdownMenuItem>
              </DropdownMenuContent>
          </DropdownMenu>
      </TableCell>
      <TableCell className="text-[#A0A0A0] text-sm text-center">
        {new Date(order.createdAt).toLocaleDateString("pl-PL")}
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