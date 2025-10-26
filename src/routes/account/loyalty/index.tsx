import { createFileRoute } from '@tanstack/react-router'
import {LoyaltyPage} from "@/pages/account/LoyaltyPage.tsx";

export const Route  = createFileRoute('/account/loyalty/')({
  component: LoyaltyPage,
})