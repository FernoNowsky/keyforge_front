import { createFileRoute } from '@tanstack/react-router'
import KeysPage from "@/pages/account/KeysPage.tsx";

export const Route  = createFileRoute('/account/keys/')({
  component: KeysPage,
})