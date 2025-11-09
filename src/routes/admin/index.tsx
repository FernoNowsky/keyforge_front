import { AdminPanelPage } from '@/pages/AdminPanelPage'
import { createFileRoute } from '@tanstack/react-router'
import {requireAuth, requireRole} from "@/lib/authGuard.ts";

export const Route = createFileRoute('/admin/')({
    beforeLoad: () => {
        requireAuth()
        requireRole('ADMIN')
    },
    component: AdminPanelPage,
})
