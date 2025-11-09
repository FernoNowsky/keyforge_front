import { createFileRoute } from '@tanstack/react-router'
import ReviewsPage from "@/pages/account/ReviewsPage.tsx";
import {requireAuth} from "@/lib/authGuard.ts";

export const Route  = createFileRoute('/account/reviews/')({
    beforeLoad: requireAuth,
    component: ReviewsPage,
})