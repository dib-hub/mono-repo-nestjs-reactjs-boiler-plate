import axios, { AxiosInstance } from 'axios';

const withAuthInterceptor = (instance: AxiosInstance): AxiosInstance => {
  instance.interceptors.request.use(
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

  return instance;
};

const apiInstance: AxiosInstance = withAuthInterceptor(
  axios.create({
    baseURL: `${import.meta.env['VITE_API_BASE_URL']}/api/`,
    headers: {
      'Content-Type': 'application/json',
    },
  })
);

const authInstance: AxiosInstance = axios.create({
  baseURL: `${import.meta.env['VITE_API_BASE_URL']}/api/auth/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

withAuthInterceptor(authInstance);

export { authInstance, apiInstance };
