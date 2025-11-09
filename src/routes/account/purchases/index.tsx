import { createFileRoute } from '@tanstack/react-router'
import PurchasesPage from "@/pages/account/PurchasesPage.tsx"
import { requireAuth } from "@/lib/authGuard"

export const Route = createFileRoute('/account/purchases/')({
    beforeLoad: requireAuth,
    component: PurchasesPage,
})