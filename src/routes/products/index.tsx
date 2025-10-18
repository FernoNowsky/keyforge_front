import { createFileRoute } from '@tanstack/react-router'
import { ProductsPage } from "@/pages/ProductsPage.tsx";

export const Route  = createFileRoute('/products/')({
  component: ProductsPage,
})