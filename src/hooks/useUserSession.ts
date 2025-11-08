export function getUserSession() {
    const data = localStorage.getItem('userSession');
    if (!data) return null;

    try {
        return JSON.parse(data);
    } catch (e) {
        console.error('Błąd podczas odczytu danych użytkownika:', e);
        return null;
    }
}

export async function isTokenExpired() {
    const session = getUserSession();
    if (!session?.tokenExpiry) return true;

    const expiryDate = new Date(session.tokenExpiry);
    const now = new Date();

    return now >= expiryDate;

}

export function getUserToken() {
    return getUserSession()?.token || null;
}

export function getUserRefreshToken() {
    return getUserSession()?.refreshToken || null;
}

export function getUserTokenExpiry() {
    return getUserSession()?.tokenExpiry || null;
}

export function getUserId() {
    return getUserSession()?.userId || null;
}

export function getUsername() {
    return getUserSession()?.username || null;
}

export function getUserEmail() {
    return getUserSession()?.email || null;
}

export function getUserRoles() {
    return getUserSession()?.roles || [];
}
