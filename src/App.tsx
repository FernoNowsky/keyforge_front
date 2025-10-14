import "./App.css"
import {Routes, Route, Navigate} from "react-router-dom"
import { Home } from "./pages/Home.tsx"
import { PrivacyPolicy } from "@/pages/PrivacyPolicy.tsx";
import { TermsOfService } from "@/pages/TermsOfService.tsx";
import { ProductsPage } from "@/pages/ProductsPage.tsx";

function App() {

    return (
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/products/:category" element={<ProductsPage />} />
                <Route path="/products" element={<Navigate to="/products/games" replace />} />

            </Routes>
    )
}

export default App
