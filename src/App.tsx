import { RouterProvider, useNavigate } from "@tanstack/react-router"
import { router } from "./router.tsx"
import React, { useEffect } from "react"
import { KeycloakWrapper } from "./KeycloakWrapper"
import { App as CapacitorApp } from '@capacitor/app';

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
    const navigate = useNavigate();

  useEffect(() => {
    const listenerPromise = CapacitorApp.addListener('appUrlOpen', async (data) => {
        console.log('App.tsx received deep link:', data.url);
        
        // ONLY ignore specific Keycloak login URLs - let KeycloakWrapper handle them
        if (data.url.startsWith('com.keyforge.app://login')) {
            console.log('Keycloak login URL detected, letting KeycloakWrapper handle it');
            return; // KeycloakWrapper will handle this
        }
        
        if (data.url.startsWith('twojaappka://')) {
            let path = data.url.replace('twojaappka://', '/');
            
            if (!path.endsWith('/') && !path.includes('?')) {
                path += '/';
            }
            console.log('Received payment deep link:', data.url, 'Navigating to:', path);
            
            try {
                if (navigate) {
                    navigate(path as any);
                } else {
                    console.log('Navigate function not available, using window.location');
                    window.location.href = window.location.origin + path;
                }
            } catch (error) {
                console.error('Navigation failed, using window.location fallback:', error);
                window.location.href = window.location.origin + path;
            }
        }
    });

    return () => {
        listenerPromise.then((listenerHandle) => {
            listenerHandle.remove();
        });
    };
}, [navigate]);

    return (
        <KeycloakWrapper keycloakConfig={keycloakConfig}>
            <React.StrictMode>
                <RouterProvider router={router} />
            </React.StrictMode>
        </KeycloakWrapper>
    )
}

export default App