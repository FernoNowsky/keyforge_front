import { getKeycloakInstance, useKeycloakInstance } from "@/KeycloakContext";

export function isAuthenticated(): boolean {
    const keycloak = getKeycloakInstance()
    return keycloak?.authenticated ?? false
}

export function getUsername(): string | null {
    const keycloak = getKeycloakInstance()
    return keycloak?.idTokenParsed?.preferred_username ?? null
}

export function getEmail(): string | null {
    const keycloak = getKeycloakInstance()
    return keycloak?.idTokenParsed?.email ?? null
}

export function getUserId(): string | null {
    const keycloak = getKeycloakInstance()
    return keycloak?.idTokenParsed?.sub ?? null
}

export function getToken(): string | null {
    const keycloak = getKeycloakInstance()
    return keycloak?.token ?? null
}

export function getRefreshToken(): string | null {
    const keycloak = getKeycloakInstance()
    return keycloak?.refreshToken ?? null
}

export function getRoles(): string[] {
    const keycloak = getKeycloakInstance()
    return keycloak?.tokenParsed?.realm_access?.roles ?? []
}

export function hasRole(role: string): boolean {
    return getRoles().includes(role)
}

export async function getValidToken() {
    const keycloak = getKeycloakInstance()
    if (!keycloak || !keycloak.authenticated) {
        console.warn("Keycloak not available or not authenticated")
        return null
    }

    try {
        await keycloak.updateToken(30);
        const userData = {
            token: keycloak.token,
            refreshToken: keycloak.refreshToken,
            tokenExpiry: keycloak.tokenParsed?.exp ? new Date(keycloak.tokenParsed.exp * 1000).toISOString() : null,
            userId: keycloak.idTokenParsed?.sub,
            username: keycloak.idTokenParsed?.preferred_username,
            email: keycloak.idTokenParsed?.email,
            roles: keycloak.tokenParsed?.realm_access?.roles || []
        };

        localStorage.setItem('userSession', JSON.stringify(userData));
        return keycloak.token;
    } catch (error) {
        console.error("Token refresh failed:", error);
        return null
    }
}

export async function login() {
    const keycloak = getKeycloakInstance()
    if (keycloak) {
        await keycloak.login()
    }
}

export async function logout() {
    const keycloak = getKeycloakInstance()
    if (keycloak) {
        await keycloak.logout()
    }
}

export function useAuth() {
    const keycloak = useKeycloakInstance()
    return {
        isAuthenticated: keycloak?.authenticated ?? false,
        username: keycloak?.idTokenParsed?.preferred_username ?? null,
        email: keycloak?.idTokenParsed?.email ?? null,
        firstName: keycloak?.idTokenParsed?.given_name ?? null,
        lastName: keycloak?.idTokenParsed?.family_name ?? null,
        userId: keycloak?.idTokenParsed?.sub ?? undefined,
        token: keycloak?.token ?? null,
        refreshToken: keycloak?.refreshToken ?? null,
        roles: keycloak?.tokenParsed?.realm_access?.roles ?? [],
        hasRole: (role: string) => keycloak?.tokenParsed?.realm_access?.roles?.includes(role) ?? false,
        login: () => keycloak?.login(),
        logout: () => keycloak?.logout(),
    }
}

export function useGetValidToken() {
    const keycloak = useKeycloakInstance()

    return async () => {
        if (!keycloak || !keycloak.authenticated) {
            console.warn("Keycloak not available or not authenticated")
            return null
        }

        try {
            await keycloak.updateToken(30);
            const userData = {
                token: keycloak.token,
                refreshToken: keycloak.refreshToken,
                tokenExpiry: keycloak.tokenParsed?.exp ? new Date(keycloak.tokenParsed.exp * 1000).toISOString() : null,
                userId: keycloak.idTokenParsed?.sub,
                username: keycloak.idTokenParsed?.preferred_username,
                email: keycloak.idTokenParsed?.email,
                roles: keycloak.tokenParsed?.realm_access?.roles || []
            };

            localStorage.setItem('userSession', JSON.stringify(userData));
            return keycloak.token;
        } catch (error) {
            console.error("Token refresh failed:", error);
            return null
        }
    }
}
