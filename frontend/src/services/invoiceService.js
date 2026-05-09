import api from './api.js';

export const invoiceService = {
  getAll: (params) => api.get('/invoices', { params }).then(r => r.data),
  getById: (id) => api.get(`/invoices/${id}`).then(r => r.data),
  create: (data) => api.post('/invoices', data).then(r => r.data),
  update: (id, data) => api.put(`/invoices/${id}`, data).then(r => r.data),
  updateStatut: (id, statut) => api.patch(`/invoices/${id}/statut`, { statut }).then(r => r.data),
  delete: (id) => api.delete(`/invoices/${id}`).then(r => r.data),
  getStats: () => api.get('/invoices/stats').then(r => r.data),
  sendRelance: (id) => api.post(`/invoices/${id}/relance`).then(r => r.data),
  getPdfUrl: (id) => `/api/invoices/${id}/pdf`,
};
