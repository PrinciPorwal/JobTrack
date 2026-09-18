import axios from 'axios';

// Determine API base URL: use VITE_API_URL in production/deployed environment, fallback to '/api' for local dev proxy
const rawBaseUrl = import.meta.env.VITE_API_URL;
const baseURL = rawBaseUrl
  ? (rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl.replace(/\/+$/, '')}/api`)
  : '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor for consistent data extraction & error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected network error occurred';
    return Promise.reject(new Error(message));
  }
);

// Applications API
export const applicationService = {
  getAll: (params = {}) => api.get('/applications', { params }),
  getById: (id) => api.get(`/applications/${id}`),
  create: (data) => api.post('/applications', data),
  update: (id, data) => api.put(`/applications/${id}`, data),
  updateStatus: (id, status) => api.patch(`/applications/${id}/status`, { status }),
  delete: (id) => api.delete(`/applications/${id}`),
};

// Interviews API
export const interviewService = {
  getAll: (params = {}) => api.get('/interviews', { params }),
  getById: (id) => api.get(`/interviews/${id}`),
  create: (data) => api.post('/interviews', data),
  update: (id, data) => api.put(`/interviews/${id}`, data),
  delete: (id) => api.delete(`/interviews/${id}`),
};

// Resume API
export const resumeService = {
  get: () => api.get('/resume'),
  save: (data) => api.post('/resume', data),
  delete: () => api.delete('/resume'),
};

// Analytics API
export const analyticsService = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getMonthly: () => api.get('/analytics/monthly'),
};

export default api;
