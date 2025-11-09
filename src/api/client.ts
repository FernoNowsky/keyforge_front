import axios from "axios";
import {getValidToken} from "@/hooks/useAuthToken.ts";
import {toast} from "sonner";

export const $axios = axios.create({
    baseURL: import.meta.env.VITE_BASE_API_URL || "http://localhost:8090",
    withCredentials: true,
    timeout: 10000,
});

// Interceptor – dodaje token do nagłówków
$axios.interceptors.request.use(
    async (config) => {

        const requiresAuth = config.headers?.['X-Requires-Auth'] !== 'false';

        if (config.headers) {
            delete config.headers['X-Requires-Auth'];
        }

        if (requiresAuth) {
            const token = await getValidToken();
            if (token) {
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Obsługa błędów globalnie (np. odświeżanie tokena / przekierowanie na login)
$axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("userSession")
            localStorage.removeItem("kc-token")
            localStorage.removeItem("kc-refreshToken")
            toast.error("Twoja sesja wygasła. Zaloguj się ponownie. Trwa przekierowanie do strony głównej");

            setTimeout(() => {
                window.location.href = "/"
            },3500)
        }
        return Promise.reject(error);
    }
);
