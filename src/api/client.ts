import axios from "axios";

export const $axios = axios.create({
    baseURL: import.meta.env.VITE_BASE_API_URL || "http://localhost:8090",
    // withCredentials: true, // wywala corsy
    timeout: 10000, // 10s
});

// Interceptor – dodaje token do nagłówków
$axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token"); // lub inna logika
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
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
            console.warn("Nieautoryzowany – być może token wygasł?");
            // tu możesz np. wyczyścić token lub przekierować na login
        }
        return Promise.reject(error);
    }
);
