import { AdminPanelPage } from '@/pages/AdminPanelPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/')({
    component: AdminPanelPage,
})
