import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add JWT token
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('phishguard_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const apiService = {
    register: async (username, email, password) => {
        const response = await apiClient.post('/register', { username, email, password });
        return response.data;
    },

    login: async (username, password) => {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        const response = await apiClient.post('/login', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        if (response.data.access_token) {
            localStorage.setItem('phishguard_token', response.data.access_token);
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('phishguard_token');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('phishguard_token');
    },

    predictURL: async (url) => {
        const response = await apiClient.post('/predict', { url });
        return response.data;
    },

    getHistory: async () => {
        const response = await apiClient.get('/history');
        return response.data;
    },

    getUserProfile: async () => {
        const response = await apiClient.get('/me');
        return response.data;
    }
};

export default apiService;
