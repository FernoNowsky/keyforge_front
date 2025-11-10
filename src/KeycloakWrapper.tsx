import React, { useState, useEffect, useMemo } from 'react'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import Keycloak from 'keycloak-js'
import { KeycloakContext, setKeycloakInstance } from './KeycloakContext'
import {toast} from "sonner";

interface KeycloakWrapperProps {
    children: React.ReactNode
    keycloakConfig: Keycloak.KeycloakConfig
}

async function isKeycloakReachable(url: string): Promise<boolean> {
    try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000)

        const response = await fetch(`${url}/realms/keyforge`, {
            method: 'GET',
            signal: controller.signal,
            cache: 'no-cache'
        })

        clearTimeout(timeoutId)
        return response.ok || response.status === 404 || response.status < 500
    } catch (error) {
        console.error('Keycloak reachability check failed:', error)
        return false
    }
}

export function KeycloakWrapper({ children, keycloakConfig }: KeycloakWrapperProps) {
    const keycloakInstance = useMemo(() => new Keycloak(keycloakConfig), [])

    const [keycloakState, setKeycloakState] = useState<{
        available: boolean | null
        instance: Keycloak.KeycloakInstance | null
    }>({
        available: null,
        instance: null
    })

    useEffect(() => {
        const checkAndInitKeycloak = async () => {
            const keycloakUrl = 'http://localhost:5000'
            const isReachable = await isKeycloakReachable(keycloakUrl)

            if (!isReachable) {
                console.warn('Keycloak server is not reachable - running without authentication')
                localStorage.setItem('keycloak_disabled', 'true')
                setKeycloakInstance(null) // Set global instance
                setKeycloakState({
                    available: false,
                    instance: null
                })
                return
            }

            try {
                const initPromise = keycloakInstance.init({
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
                setKeycloakInstance(keycloakInstance) // Set global instance
                setKeycloakState({
                    available: true,
                    instance: keycloakInstance
                })
            } catch (error) {
                console.warn('Keycloak initialization failed:', error)
                localStorage.setItem('keycloak_disabled', 'true')
                setKeycloakInstance(null) // Set global instance
                setKeycloakState({
                    available: false,
                    instance: null
                })
            }
        }

        checkAndInitKeycloak()
    }, [keycloakInstance])

    const handleKeycloakEvent = (event: string) => {
        if (event === 'onAuthLogout') {
            toast.error("Sesja zakończyła się")
            localStorage.clear()
        }
    }

    const handleTokens = (tokens: { token?: string; refreshToken?: string }) => {
        if (tokens.token) localStorage.setItem('kc_token', tokens.token)
        if (tokens.refreshToken) localStorage.setItem('kc_refreshToken', tokens.refreshToken)
    }

    if (keycloakState.available === null) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-b from-[#1C1C1C] to-[#2A2A2A]">
                <div className="text-center text-white">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A44A] mx-auto mb-4"></div>
                </div>
            </div>
        )
    }

    if (!keycloakState.available || !keycloakState.instance) {
        return (
            <KeycloakContext.Provider value={null}>
                {children}
            </KeycloakContext.Provider>
        )
    }

    return (
        <KeycloakContext.Provider value={keycloakState.instance}>
            <ReactKeycloakProvider
                authClient={keycloakState.instance}
                onTokens={handleTokens}
                onEvent={handleKeycloakEvent}
            >
                {children}
            </ReactKeycloakProvider>
        </KeycloakContext.Provider>
    )
}