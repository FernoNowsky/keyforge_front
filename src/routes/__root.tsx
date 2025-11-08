import { Outlet, createRootRoute, useLocation } from "@tanstack/react-router";
import { NavigationBar } from "@/components/NavigationBar";
import { Footer } from "@/components/Footer.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";

const Layout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && <NavigationBar/>}
      <main className="flex-1 pt-4 bg-[#1C1C1C] text-white">
        <Outlet />
      </main>
      {!isAdminRoute && <Footer />}
      <Toaster />
    </div>
  );
};

export const Route = createRootRoute({
  component: Layout,
});
