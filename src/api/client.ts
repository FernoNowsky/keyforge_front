import axios from 'axios';

export const $axios = axios.create({
    baseURL: import.meta.env.VITE_BASE_API_URL || 'http://localhost:8080',
    withCredentials: true,
    timeout: 10000, // 10 seconds timeout
});
