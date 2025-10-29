import { PaymentFailedPage } from '@/pages/PaymentFailedPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/cart/cancel/')({
  component: PaymentFailedPage,
    validateSearch: (search: Record<string, unknown>) => ({
    orderId: String(search.orderId ?? "")
  }),
})

