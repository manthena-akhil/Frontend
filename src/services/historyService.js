import api from './api';

export const list = () => api.get('/history').then((r) => r.data);
export const remove = (id) => api.delete(`/history/${id}`);
export const clear = () => api.delete('/history');
