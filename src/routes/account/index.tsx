import { createFileRoute } from '@tanstack/react-router'
import { ProductsPage } from "@/pages/ProductsPage.tsx";


// TODO add accountPage?
export const Route  = createFileRoute('/account/')({
  component: ProductsPage,
})