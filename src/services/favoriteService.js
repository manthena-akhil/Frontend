import api from './api';

export const list = () => api.get('/favorites').then((r) => r.data);
export const add = (payload) => api.post('/favorites', payload).then((r) => r.data);
export const remove = (id) => api.delete(`/favorites/${id}`);
