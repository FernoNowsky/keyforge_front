import { PaymentSuccessPage } from '@/pages/PaymentSuccessPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/cart/success/')({
  component: PaymentSuccessPage,
  validateSearch: (search: Record<string, unknown>) => ({
    orderId: String(search.orderId ?? "")
  }),
})
