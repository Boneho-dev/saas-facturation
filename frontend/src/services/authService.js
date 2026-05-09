import api from './api.js';

export const authService = {
  register: (data) => api.post('/auth/register', data).then(r => r.data),
  login: (email, password) => api.post('/auth/login', { email, password }).then(r => r.data),
  getMe: () => api.get('/auth/me').then(r => r.data),
  updateProfile: (data) => api.put('/auth/me', data).then(r => r.data),
};
