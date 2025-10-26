import { createFileRoute } from '@tanstack/react-router'
import PurchasesPage from "@/pages/account/PurchasesPage.tsx";

export const Route  = createFileRoute('/account/purchases/')({
  component: PurchasesPage,
})