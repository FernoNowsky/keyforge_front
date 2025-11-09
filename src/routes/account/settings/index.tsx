import { createFileRoute } from '@tanstack/react-router'
import SettingsPage from "@/pages/account/SettingsPage.tsx";
import {requireAuth} from "@/lib/authGuard.ts";

export const Route  = createFileRoute('/account/settings/')({
    beforeLoad: requireAuth,
    component: SettingsPage,
})