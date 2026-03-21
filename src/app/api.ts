import axios from 'axios';

const API = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? '/api' : 'http://127.0.0.1:5001/api',
});

// Add a request interceptor to include the token in headers
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default API;
