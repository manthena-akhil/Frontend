import api from './api';

export const login = (email, password) => api.post('/auth/login', { email, password }).then((r) => r.data);
export const register = (payload) => api.post('/auth/register', payload).then((r) => r.data);
export const getProfile = () => api.get('/user/profile').then((r) => r.data);
export const updateProfile = (payload) => api.put('/user/profile', payload).then((r) => r.data);
