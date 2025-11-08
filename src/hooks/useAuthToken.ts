import keycloak from "@/keycloak";

export async function getValidToken() {
    if (!keycloak.refreshToken) return
    try {
        // refresh if token will expire within 30 seconds
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
        return null;
    }
}
