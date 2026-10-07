import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'Please try again later.';
    if (error.response) {
      const { status, data } = error.response;
      message = data?.message || message;
      const isAuthCall = error.config?.url?.startsWith('/auth/');
      if (status === 401 && !isAuthCall) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth:logout'));
        message = 'Your session has expired. Please log in again.';
      } else if (status >= 500 && !data?.message) {
        message = 'Weather service is temporarily unavailable.';
      }
    } else if (error.code === 'ECONNABORTED') {
      message = 'The request timed out. Please try again.';
    } else {
      message = 'Unable to reach the server. Please check your connection.';
    }
    error.userMessage = message;
    return Promise.reject(error);
  }
);

export const getErrorMessage = (error) => error?.userMessage || 'Please try again later.';
export default api;
