import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add JWT token to requests
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: async (email: string, password: string) => {
        const response = await apiClient.post('/auth/login', { email, password });
        return response.data;
    },
    register: async (email: string, password: string, role: string) => {
        const response = await apiClient.post('/auth/register', { email, password, role });
        return response.data;
    },
};

// Products API
export const productsAPI = {
    getAll: async () => {
        const response = await apiClient.get('/products');
        return response.data;
    },
    getActive: async () => {
        const response = await apiClient.get('/products/active');
        return response.data;
    },
    getById: async (id: string) => {
        const response = await apiClient.get(`/products/${id}`);
        return response.data;
    },
    create: async (data: any) => {
        const response = await apiClient.post('/products', data);
        return response.data;
    },
    update: async (id: string, data: any) => {
        const response = await apiClient.put(`/products/${id}`, data);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await apiClient.delete(`/products/${id}`);
        return response.data;
    },
    search: async (query: string) => {
        const response = await apiClient.get(`/products/search?q=${query}`);
        return response.data;
    },
    getByCategory: async (category: string) => {
        const response = await apiClient.get(`/products/category/${category}`);
        return response.data;
    },
};

// Warehouses API
export const warehousesAPI = {
    getAll: async () => {
        const response = await apiClient.get('/warehouses');
        return response.data;
    },
    getActive: async () => {
        const response = await apiClient.get('/warehouses/active');
        return response.data;
    },
    getById: async (id: string) => {
        const response = await apiClient.get(`/warehouses/${id}`);
        return response.data;
    },
    create: async (data: any) => {
        const response = await apiClient.post('/warehouses', data);
        return response.data;
    },
    update: async (id: string, data: any) => {
        const response = await apiClient.put(`/warehouses/${id}`, data);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await apiClient.delete(`/warehouses/${id}`);
        return response.data;
    },
};

// Stock API
export const stockAPI = {
    getAll: async () => {
        const response = await apiClient.get('/stock');
        return response.data;
    },
    getByWarehouse: async (warehouseId: string) => {
        const response = await apiClient.get(`/stock/warehouse/${warehouseId}`);
        return response.data;
    },
    getByProduct: async (productId: string) => {
        const response = await apiClient.get(`/stock/product/${productId}`);
        return response.data;
    },
    getTotalForProduct: async (productId: string) => {
        const response = await apiClient.get(`/stock/product/${productId}/total`);
        return response.data;
    },
    getLowStock: async () => {
        const response = await apiClient.get('/stock/low');
        return response.data;
    },
    createOrUpdate: async (data: any) => {
        const response = await apiClient.post('/stock', data);
        return response.data;
    },
    adjust: async (productId: string, warehouseId: string, adjustment: number) => {
        const response = await apiClient.put('/stock/adjust', {
            productId,
            warehouseId,
            adjustment,
        });
        return response.data;
    },
};

// Dashboard API
export const dashboardAPI = {
    getData: async () => {
        const response = await apiClient.get('/dashboard');
        return response.data;
    },
    getStockValue: async () => {
        const response = await apiClient.get('/dashboard/stock-value');
        return response.data;
    },
};

// Receipts API
export const receiptsAPI = {
    getAll: async () => {
        const response = await apiClient.get('/receipts');
        return response.data;
    },
    getById: async (id: string) => {
        const response = await apiClient.get(`/receipts/${id}`);
        return response.data;
    },
    getByStatus: async (status: string) => {
        const response = await apiClient.get(`/receipts/status/${status}`);
        return response.data;
    },
    getByWarehouse: async (warehouseId: string) => {
        const response = await apiClient.get(`/receipts/warehouse/${warehouseId}`);
        return response.data;
    },
    create: async (data: any) => {
        const response = await apiClient.post('/receipts', data);
        return response.data;
    },
    validate: async (id: string) => {
        const response = await apiClient.put(`/receipts/${id}/validate`);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await apiClient.delete(`/receipts/${id}`);
        return response.data;
    },
};

// Deliveries API
export const deliveriesAPI = {
    getAll: async () => {
        const response = await apiClient.get('/deliveries');
        return response.data;
    },
    getById: async (id: string) => {
        const response = await apiClient.get(`/deliveries/${id}`);
        return response.data;
    },
    getByStatus: async (status: string) => {
        const response = await apiClient.get(`/deliveries/status/${status}`);
        return response.data;
    },
    getByWarehouse: async (warehouseId: string) => {
        const response = await apiClient.get(`/deliveries/warehouse/${warehouseId}`);
        return response.data;
    },
    create: async (data: any) => {
        const response = await apiClient.post('/deliveries', data);
        return response.data;
    },
    validate: async (id: string) => {
        const response = await apiClient.put(`/deliveries/${id}/validate`);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await apiClient.delete(`/deliveries/${id}`);
        return response.data;
    },
};

export default apiClient;
