import { $axios } from './client';

$axios.interceptors.request.use(async (config) => {
    const token = ''; //TODO: replace with real token retrieval logic
    if (token) {
        if (!config.headers) {
            config.headers = {} as import('axios').AxiosRequestHeaders;
        }
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});