import {createFileRoute} from '@tanstack/react-router'
import {TermsOfService} from "@/pages/TermsOfService.tsx";

export const Route = createFileRoute('/terms-of-service')({
    component: RouteComponent,
})

function RouteComponent() {
    return <TermsOfService />
}
