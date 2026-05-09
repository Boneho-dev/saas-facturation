import api from './api.js';

export const aiService = {
  generateLines: (description) =>
    api.post('/ai/generate-lines', { description }).then(r => r.data),
};
