import {createFileRoute} from '@tanstack/react-router'
import { CartPage } from "@/pages/CartPage.tsx";

export const Route = createFileRoute('/cart')({
    component: CartPage,
})

