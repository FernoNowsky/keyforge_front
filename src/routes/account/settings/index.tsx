import { createFileRoute } from '@tanstack/react-router'
import SettingsPage from "@/pages/account/SettingsPage.tsx";

export const Route  = createFileRoute('/account/settings/')({
  component: SettingsPage,
})