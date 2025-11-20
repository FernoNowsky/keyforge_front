import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { PlatformBadge } from "@/components/PlatformBadge";
import type { Order, Product } from "@/api";

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

export function OrderDetailsDialog({ 
  order, 
  products, 
  open, 
  onOpenChange 
}: { 
  order: Order | null; 
  products: Record<number, Product>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1F1F1F] border-[#3A3A3A] text-white !max-w-6xl w-full max-h-[90vh] overflow-y-auto !px-8 p-0">
        <DialogHeader className="sticky top-0 z-20 bg-[#1F1F1F] border-b border-[#3A3A3A] py-8">
        <DialogTitle className="text-2xl font-bold text-[#D4A44A]">
          Szczegóły zamówienia #{order.id}
        </DialogTitle>
      </DialogHeader>


        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#2A2A2A] rounded-lg p-4 border border-[#3A3A3A]">
              <p className="text-gray-400 text-sm mb-1">ID Użytkownika</p>
              <p className="text-white font-semibold text-lg">{order.userId}</p>
            </div>
            <div className="bg-[#2A2A2A] rounded-lg p-4 border border-[#3A3A3A]">
              <p className="text-gray-400 text-sm mb-1">Status</p>
              <Badge className={`${statusMap[order.status].className} border`}>
                {statusMap[order.status].label}
              </Badge>
            </div>
            <div className="bg-[#2A2A2A] rounded-lg p-4 border border-[#3A3A3A]">
              <p className="text-gray-400 text-sm mb-1">Data zamówienia</p>
              <p className="text-white font-semibold">
                {new Date(order.createdAt).toLocaleString('pl-PL')}
              </p>
            </div>
           <div className="bg-[#2A2A2A] rounded-lg p-4 border border-[#3A3A3A]">
                <p className="text-gray-400 text-sm mb-1">Payment ID</p>
                <p className="text-white font-mono text-sm break-words">{order.paymentId}</p>
            </div>
          </div>

          <Separator className="bg-[#3A3A3A]" />

          <div>
            <h3 className="text-xl font-bold text-white mb-4">Produkty</h3>
            <div className="space-y-3">
              {order.orderItems.map((item) => {
                const product = products[item.productId];
                return (
                  <div
                    key={item.id}
                    className="bg-[#2A2A2A] rounded-xl p-4 border border-[#3A3A3A] flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <p className="text-white font-semibold text-lg">
                        {product?.name ?? `Produkt #${item.productId}`}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        {product?.platform && (
                          <PlatformBadge platform={product.platform.name} />
                        )}
                        <span className="text-gray-400 text-sm">
                          {item.unitPrice.toFixed(2)} PLN × {item.quantity}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[#D4A44A] font-bold text-lg">
                        {item.totalPrice.toFixed(2)} PLN
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator className="bg-[#3A3A3A]" />

          <div className="bg-[#2A2A2A] rounded-xl p-4 border-2 border-[#3A3A3A] flex justify-between items-center mb-6">
            <span className="text-white font-bold text-xl">Razem:</span>
            <span className="text-[#D4A44A] font-bold text-2xl">
              {order.totalPrice.toFixed(2)} PLN
            </span>
          </div>

          {order.reviewed && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
              <p className="text-green-400 text-sm font-medium">
                ✓ Klient wystawił opinię
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};