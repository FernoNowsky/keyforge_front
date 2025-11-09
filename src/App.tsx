import { RouterProvider } from "@tanstack/react-router"
import { router } from "./router.tsx"
import React from "react"
import { KeycloakWrapper } from "./KeycloakWrapper"

const keycloakConfig = {
    url: 'http://localhost:5000',
    realm: 'keyforge',
    clientId: 'keyforge-frontend',
}

function App() {
    return (
        <KeycloakWrapper keycloakConfig={keycloakConfig}>
            <React.StrictMode>
                <RouterProvider router={router} />
            </React.StrictMode>
        </KeycloakWrapper>
    )
}

export default App