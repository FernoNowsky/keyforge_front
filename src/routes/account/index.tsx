import { createFileRoute } from '@tanstack/react-router'
import {requireAuth} from "@/lib/authGuard.ts";
import PurchasesPage from "@/pages/account/PurchasesPage.tsx";


// TODO add accountPage?
export const Route  = createFileRoute('/account/')({
  beforeLoad: requireAuth,
  component: PurchasesPage,
})