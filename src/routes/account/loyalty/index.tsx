import { createFileRoute } from '@tanstack/react-router'
import {LoyaltyPage} from "@/pages/account/LoyaltyPage.tsx";
import {requireAuth} from "@/lib/authGuard.ts";

export const Route  = createFileRoute('/account/loyalty/')({
    beforeLoad: requireAuth,
    component: LoyaltyPage,
})