import { createFileRoute } from '@tanstack/react-router'
import KeysPage from "@/pages/account/KeysPage.tsx";
import {requireAuth} from "@/lib/authGuard.ts";

export const Route  = createFileRoute('/account/keys/')({
    beforeLoad: requireAuth,
    component: KeysPage,
})