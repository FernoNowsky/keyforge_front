import React, { useState, useEffect, useMemo } from 'react'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import Keycloak from 'keycloak-js'
import { Capacitor } from '@capacitor/core'
import { App } from '@capacitor/app'
import { Browser } from '@capacitor/browser'
import { KeycloakContext, setKeycloakInstance } from './KeycloakContext'
import { toast } from 'sonner'

const MOBILE_REDIRECT_URI = 'com.keyforge.app://login'

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

/**
 * Manually exchange an authorization code for tokens using the Keycloak
 * token endpoint. This bypasses keycloak-js's built-in callback handling
 * (which relies on sessionStorage PKCE state that Android WebView can lose).
 *
 * We store our own PKCE code_verifier in localStorage (not sessionStorage)
 * so it survives any WebView session resets.
 */
async function exchangeCodeForTokens(
    keycloakUrl: string,
    realm: string,
    clientId: string,
    code: string,
    codeVerifier: string
): Promise<{ access_token: string; refresh_token: string; id_token: string } | null> {
    try {
        const tokenUrl = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/token`

        const body = new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: clientId,
            code,
            redirect_uri: MOBILE_REDIRECT_URI,
            code_verifier: codeVerifier,
        })

        console.log('[Keycloak] Exchanging code at:', tokenUrl)
        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString(),
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('[Keycloak] Token exchange failed:', response.status, errorText)
            return null
        }

        const tokens = await response.json()
        console.log('[Keycloak] Token exchange successful')
        return tokens
    } catch (error) {
        console.error('[Keycloak] Token exchange error:', error)
        return null
    }
}

/**
 * Generate a PKCE code_verifier and code_challenge.
 */
async function generatePKCE(): Promise<{ verifier: string; challenge: string }> {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    const verifier = btoa(String.fromCharCode(...array))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')

    const encoder = new TextEncoder()
    const data = encoder.encode(verifier)
    const digest = await crypto.subtle.digest('SHA-256', data)
    const challenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')

    return { verifier, challenge }
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

    // ─── Mobile OAuth Callback Listener ───────────────────────────────────────
    // When Keycloak redirects to com.keyforge.app://login?code=X&state=Y,
    // we extract the code and do the token exchange ourselves.
    useEffect(() => {
        if (!Capacitor.isNativePlatform()) return

        const sub = App.addListener('appUrlOpen', async (data: { url: string }) => {
            console.log('[Keycloak] appUrlOpen:', data.url)
            if (!data.url.startsWith(MOBILE_REDIRECT_URI)) return

            await Browser.close().catch(() => {})

            // Parse params from either query string or fragment
            const urlObj = new URL(data.url)
            let params: URLSearchParams

            if (urlObj.search) {
                params = new URLSearchParams(urlObj.search)
            } else if (urlObj.hash) {
                params = new URLSearchParams(urlObj.hash.slice(1))
            } else {
                const suffix = data.url.slice(MOBILE_REDIRECT_URI.length)
                params = new URLSearchParams(suffix.startsWith('?') || suffix.startsWith('#') ? suffix.slice(1) : suffix)
            }

            const code = params.get('code')
            if (!code) {
                console.log('[Keycloak] No code in callback URL (likely logout or error). Reloading to refresh state.')
                window.location.reload()
                return
            }

            const codeVerifier = localStorage.getItem('kc_pkce_verifier')
            if (!codeVerifier) {
                console.error('[Keycloak] No PKCE code_verifier found')
                return
            }

            localStorage.removeItem('kc_pkce_verifier')

            const keycloakUrl = import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:5000'

            const tokens = await exchangeCodeForTokens(
                keycloakUrl,
                'keyforge',
                'keyforge-frontend',
                code,
                codeVerifier
            )

            if (tokens) {
                // Store tokens — keycloak.init() will pick these up on next init
                localStorage.setItem('kc_token', tokens.access_token)
                localStorage.setItem('kc_refreshToken', tokens.refresh_token)
                if (tokens.id_token) {
                    localStorage.setItem('kc_idToken', tokens.id_token)
                }
                console.log('[Keycloak] Tokens stored, reloading...')
                window.location.reload()
            } else {
                console.error('[Keycloak] Token exchange failed')
                toast.error('Logowanie nie powiodło się. Spróbuj ponownie.')
            }
        })

        return () => { sub.then(h => h.remove()).catch(() => {}) }
    }, [])

    // ─── Keycloak Initialisation ───────────────────────────────────────────────
    useEffect(() => {
        const checkAndInitKeycloak = async () => {
            const keycloakUrl = import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:5000'
            const isReachable = await isKeycloakReachable(keycloakUrl)

            if (!isReachable) {
                console.warn('Keycloak not reachable')
                localStorage.setItem('keycloak_disabled', 'true')
                setKeycloakInstance(null)
                setKeycloakState({ available: false, instance: null })
                return
            }

            try {
                const isNative = Capacitor.isNativePlatform()

                const initPromise = keycloakInstance.init({
                    ...(isNative ? {} : { onLoad: 'check-sso' }),
                    checkLoginIframe: false,
                    pkceMethod: isNative ? false : 'S256',  // Disable keycloak-js PKCE on native, we handle it ourselves
                    token: localStorage.getItem('kc_token') || undefined,
                    refreshToken: localStorage.getItem('kc_refreshToken') || undefined,
                    idToken: localStorage.getItem('kc_idToken') || undefined,
                    ...(isNative ? {} : { redirectUri: window.location.origin })
                })

                // ── Native login/logout overrides ──────────────────────────────
                // On mobile: build the auth URL ourselves with our own PKCE,
                // store the verifier in localStorage, open Chrome Custom Tab.
                if (isNative) {
                    keycloakInstance.login = async () => {
                        const { verifier, challenge } = await generatePKCE()
                        localStorage.setItem('kc_pkce_verifier', verifier)

                        const state = crypto.randomUUID()
                        const nonce = crypto.randomUUID()

                        const authUrl = `${keycloakUrl}/realms/keyforge/protocol/openid-connect/auth?` +
                            new URLSearchParams({
                                client_id: 'keyforge-frontend',
                                redirect_uri: MOBILE_REDIRECT_URI,
                                response_type: 'code',
                                response_mode: 'query',    // Use query so URL parsing is simple
                                scope: 'openid',
                                state,
                                nonce,
                                code_challenge: challenge,
                                code_challenge_method: 'S256',
                            }).toString()

                        console.log('[Keycloak] Opening login:', authUrl)
                        await Browser.open({ url: authUrl })
                    }

                    keycloakInstance.logout = async () => {
                        const refreshToken = localStorage.getItem('kc_refreshToken') || keycloakInstance.refreshToken
                        
                        // Clear local state first
                        localStorage.removeItem('kc_token')
                        localStorage.removeItem('kc_refreshToken')
                        localStorage.removeItem('kc_idToken')
                        keycloakInstance.clearToken()

                        if (refreshToken) {
                            try {
                                console.log('[Keycloak] Sending silent API logout request...')
                                const response = await fetch(`${keycloakUrl}/realms/keyforge/protocol/openid-connect/logout`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded'
                                    },
                                    body: new URLSearchParams({
                                        client_id: 'keyforge-frontend',
                                        refresh_token: refreshToken
                                    }).toString()
                                })
                                console.log('[Keycloak] API logout response:', response.status)
                            } catch (e) {
                                console.error('[Keycloak] Silent logout failed:', e)
                            }
                        } else {
                            console.log('[Keycloak] No refresh token found for API logout')
                        }

                        // Reload app to clear memory state and redirect to non-authenticated view
                        console.log('[Keycloak] Reloading app to complete logout')
                        window.location.reload()
                    }
                }

                const timeoutPromise = new Promise<never>((_, reject) =>
                    setTimeout(() => reject(new Error('Keycloak init timeout')), 10000)
                )

                const authenticated = await Promise.race([initPromise, timeoutPromise])
                console.log('[Keycloak] init done, authenticated:', authenticated)

                localStorage.removeItem('keycloak_disabled')
                setKeycloakInstance(keycloakInstance)
                setKeycloakState({ available: true, instance: keycloakInstance })
            } catch (error) {
                console.warn('[Keycloak] init failed:', error)
                localStorage.setItem('keycloak_disabled', 'true')
                setKeycloakInstance(null)
                setKeycloakState({ available: false, instance: null })
            }
        }

        checkAndInitKeycloak()
    }, [keycloakInstance])

    const handleKeycloakEvent = (event: string) => {
        if (event === 'onAuthLogout') {
            toast.error('Sesja zakończyła się')
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