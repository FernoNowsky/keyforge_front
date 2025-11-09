import React, { useState, useEffect } from 'react'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import Keycloak from 'keycloak-js'
import { toast } from 'sonner'

interface KeycloakWrapperProps {
    children: React.ReactNode
    keycloakConfig: Keycloak.KeycloakConfig
}

// Simple network check - try to reach the server without initializing Keycloak
async function isKeycloakReachable(url: string): Promise<boolean> {
    try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 2000)

        // Use fetch with no-cors mode to just check if server responds
        await fetch(url, {
            method: 'GET',
            mode: 'no-cors',
            signal: controller.signal,
            cache: 'no-cache'
        })

        clearTimeout(timeoutId)
        return true
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return false
    }
}

export function KeycloakWrapper({ children, keycloakConfig }: KeycloakWrapperProps) {
    const [keycloakState, setKeycloakState] = useState<{
        available: boolean | null
        instance: Keycloak.KeycloakInstance | null
    }>({
        available: null,
        instance: null
    })

    useEffect(() => {
        const checkAndInitKeycloak = async () => {
            // TODO: change hardcoded url
            const keycloakUrl = 'http://localhost:5000'

            const isReachable = await isKeycloakReachable(keycloakUrl)

            if (!isReachable) {
                console.warn('Keycloak server is not reachable - running without authentication')
                localStorage.setItem('keycloak_disabled', 'true')
                setKeycloakState({
                    available: false,
                    instance: null
                })
                return
            }

            // Server is reachable, now try to initialize Keycloak
            try {
                const kc = new Keycloak(keycloakConfig)

                const initPromise = kc.init({
                    onLoad: 'check-sso',
                    checkLoginIframe: false,
                    pkceMethod: 'S256',
                    token: localStorage.getItem('kc_token') || undefined,
                    refreshToken: localStorage.getItem('kc_refreshToken') || undefined,
                })

                const timeoutPromise = new Promise<never>((_, reject) => {
                    setTimeout(() => reject(new Error('Keycloak initialization timeout')), 5000)
                })

                await Promise.race([initPromise, timeoutPromise])

                localStorage.removeItem('keycloak_disabled')
                setKeycloakState({
                    available: true,
                    instance: kc
                })
            } catch (error) {
                console.warn('Keycloak initialization failed:', error)
                localStorage.setItem('keycloak_disabled', 'true')
                setKeycloakState({
                    available: false,
                    instance: null
                })
            }
        }

        checkAndInitKeycloak()
    }, [])

    const handleKeycloakEvent = (event: string) => {
        if (event === 'onAuthLogout') {
            localStorage.clear()
            toast.success('Pomyślnie wylogowano')
        }
    }

    const handleTokens = (tokens: { token?: string; refreshToken?: string }) => {
        if (tokens.token) localStorage.setItem('kc_token', tokens.token)
        if (tokens.refreshToken) localStorage.setItem('kc_refreshToken', tokens.refreshToken)
    }

    // TODO: Below are elements that client sees before content. Edit if needed
    if (keycloakState.available === null) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-b from-[#1C1C1C] to-[#2A2A2A]">
                <div className="text-center text-white">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A44A] mx-auto mb-4"></div>
                    <p>Checking authentication service...</p>
                </div>
            </div>
        )
    }

    // Keycloak is not available - render without provider
    if (!keycloakState.available || !keycloakState.instance) {
        return <>{children}</>
    }

    // Keycloak is available and already initialized
    return (
        <ReactKeycloakProvider
            authClient={keycloakState.instance}
            initOptions={{
                onLoad: 'check-sso',
            }}
            onTokens={handleTokens}
            onEvent={handleKeycloakEvent}
        >
            {children}
        </ReactKeycloakProvider>
    )
}