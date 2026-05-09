import api from './api.js';

export const devisService = {
  getAll: (params) => api.get('/devis', { params }).then(r => r.data),
  getById: (id) => api.get(`/devis/${id}`).then(r => r.data),
  create: (data) => api.post('/devis', data).then(r => r.data),
  update: (id, data) => api.put(`/devis/${id}`, data).then(r => r.data),
  updateStatut: (id, statut) => api.patch(`/devis/${id}/statut`, { statut }).then(r => r.data),
  delete: (id) => api.delete(`/devis/${id}`).then(r => r.data),
  getPdfUrl: (id) => `/api/devis/${id}/pdf`,
};
