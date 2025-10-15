import { Outlet, createRootRoute } from "@tanstack/react-router"
import { NavigationBar } from "@/components/NavigationBar"
import {Footer} from "@/components/Footer.tsx";

export const Route = createRootRoute({
    component: () => (
        <div className="min-h-screen flex flex-col">
            <NavigationBar isLoggedIn={false} />
            <main className="flex-1 pt-4 bg-[#1C1C1C] text-white">
                <Outlet />
            </main>
            <Footer />
        </div>
    ),
})
