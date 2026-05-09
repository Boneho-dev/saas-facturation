import api from './api.js';

export const feedbackService = {
  create: (data) => api.post('/feedbacks', data).then(r => r.data),
  getAll: () => api.get('/feedbacks').then(r => r.data),
  getById: (id) => api.get(`/feedbacks/${id}`).then(r => r.data),
};
