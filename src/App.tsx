import "./App.css"
import { Routes, Route } from "react-router-dom"
import { Home } from "./pages/Home.tsx"
import {PrivacyPolicy} from "@/pages/PrivacyPolicy.tsx";
import {TermsOfService} from "@/pages/TermsOfService.tsx";

function App() {

    return (
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/" element={<Home />} />
            </Routes>
    )
}

export default App
