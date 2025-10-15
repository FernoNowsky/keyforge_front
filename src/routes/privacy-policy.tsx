import { createFileRoute } from '@tanstack/react-router'
import {PrivacyPolicy} from "@/pages/PrivacyPolicy.tsx";

export const Route = createFileRoute('/privacy-policy')({
  component: RouteComponent,
})

function RouteComponent() {
  return <PrivacyPolicy />
}
