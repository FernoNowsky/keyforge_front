import { createFileRoute } from "@tanstack/react-router"
import { ProductPage } from "@/pages/ProductPage.tsx";

export const Route = createFileRoute("/products/$productId")({
    component: ProductPage,
})

