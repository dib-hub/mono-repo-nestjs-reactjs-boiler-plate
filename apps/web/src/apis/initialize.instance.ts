import axios, { AxiosInstance } from 'axios';

const authInstance: AxiosInstance = axios.create({
  baseURL: `${import.meta.env['VITE_API_BASE_URL']}/api/auth/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export { authInstance };
