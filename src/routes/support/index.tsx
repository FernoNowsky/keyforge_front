import { createFileRoute } from '@tanstack/react-router'
import SupportPage from "@/pages/account/SupportPage.tsx";

export const Route  = createFileRoute('/support/')({
  component: SupportPage,
})