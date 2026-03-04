import axios, { AxiosInstance } from 'axios';

const authInstance: AxiosInstance = axios.create({
  baseURL: `${import.meta.env['VITE_API_BASE_URL']}/api/auth/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
authInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { authInstance };
