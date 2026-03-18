import { RouterProvider } from "@tanstack/react-router"
import { router } from "./router.tsx"
import React from "react"
import { KeycloakWrapper } from "./KeycloakWrapper"

const keycloakConfig = {
    url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:5000',
    realm: 'keyforge',
    clientId: 'keyforge-frontend',
}

// Debug log for mobile
console.log('Keycloak URL:', keycloakConfig.url);
console.log('Current URL:', window.location.href);
console.log('Origin:', window.location.origin);
console.log('Hostname:', window.location.hostname);
console.log('Port:', window.location.port);
console.log('Protocol:', window.location.protocol);

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