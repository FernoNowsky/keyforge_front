import { createFileRoute } from "@tanstack/react-router"
// import { fetchData } from "@/lib/fetchData"
import { ProductsPage } from "@/pages/ProductsPage.tsx";

// interface Product {
//     id: number
//     name: string
//     price: number
// }

export const Route = createFileRoute("/products/category/$categoryId")({
    // loader: async ({ params }) => {
    //     const data = await fetchData<Product[]>(`/api/products/${params.category}`)
    //     return data
    // },
    component: ProductsPage,
})

