import { RouterProvider } from "@tanstack/react-router"
import { router } from "./router.tsx"
import { ReactKeycloakProvider } from '@react-keycloak/web'
import keycloak from './keycloak.ts'
import React from "react"
import {toast} from "sonner";

const keycloakInitOptions = {
    onLoad: 'check-sso',
    checkLoginIframe: false,
    pkceMethod: 'S256',
    token: localStorage.getItem('kc_token') || undefined,
    refreshToken: localStorage.getItem('kc_refreshToken') || undefined,
}

function App() {
    return <ReactKeycloakProvider authClient={keycloak}
                                  initOptions={keycloakInitOptions}
                                  onTokens={(tokens) => {
                                      if (tokens.token) localStorage.setItem('kc_token', tokens.token);
                                      if (tokens.refreshToken) localStorage.setItem('kc_refreshToken', tokens.refreshToken);
                                  }}
                                  onEvent={(event) => {
                                      if (event === 'onAuthLogout') {
                                          localStorage.clear()
                                          toast.success("Pomyślnie wylogowano")
                                      }
                                  }}
                                  >
        <React.StrictMode>
            <RouterProvider router={router} />
        </React.StrictMode>
    </ReactKeycloakProvider>
}

export default App
