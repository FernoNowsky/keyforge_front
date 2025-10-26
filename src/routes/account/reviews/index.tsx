import { createFileRoute } from '@tanstack/react-router'
import ReviewsPage from "@/pages/account/ReviewsPage.tsx";

export const Route  = createFileRoute('/account/reviews/')({
  component: ReviewsPage,
})