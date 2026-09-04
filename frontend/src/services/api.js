import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('yuzuki_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor: handle session expiration
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    // Only redirect if not already on login page
    if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
      localStorage.removeItem('yuzuki_token');
      localStorage.removeItem('yuzuki_user');
      window.location.href = '/login';
    }
  }
  return Promise.reject(error);
});

export const authAPI = {
  login: (identifier, password) => api.post('/auth/login', { identifier, password }),
  register: (userData) => api.post('/auth/register', userData),
  registerExisting: (userData) => api.post('/auth/register-existing', userData),
  getMe: () => api.get('/auth/me'),
  subscribe: (data) => api.post('/auth/subscribe', data || {}),
};

export const courseAPI = {
  getAll: () => api.get('/courses'),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
};

export const examAPI = {
  getAvailable: () => api.get('/exams'),
  getSession: (id) => api.get(`/exams/${id}/session`),
  submit: (id, data) => api.post(`/exams/${id}/submit`, data),
  getMyAttempts: () => api.get('/exams/attempts/my'),
  getAttemptDetail: (id) => api.get(`/exams/attempts/${id}`),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getStudents: (params) => api.get('/admin/students', { params }),
  updateStudentStatus: (id, data) => api.patch(`/admin/students/${id}/status`, data),
  toggleDualTrack: (id) => api.patch(`/admin/students/${id}/dual-track`),
  deleteStudent: (id) => api.delete(`/admin/students/${id}`),
  
  getExams: () => api.get('/admin/exams'),
  createExam: (data) => api.post('/admin/exams', data),
  updateExam: (id, data) => api.put(`/admin/exams/${id}`, data),
  deleteExam: (id) => api.delete(`/admin/exams/${id}`),
  
  getQuestions: (examId) => api.get(`/admin/exams/${examId}/questions`),
  createQuestion: (examId, data) => api.post(`/admin/exams/${examId}/questions`, data),
  updateQuestion: (id, data) => api.put(`/admin/questions/${id}`, data),
  deleteQuestion: (id) => api.delete(`/admin/questions/${id}`),
  
  uploadImage: (formData) => api.post('/admin/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadAudio: (formData) => api.post('/admin/upload/audio', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  getResults: (params) => api.get('/admin/results', { params }),
  extendSubscription: (studentId, data) => api.post(`/admin/students/${studentId}/extend-subscription`, data || {}),
};


export const paymentAPI = {
  checkout: (data) => api.post('/payments/checkout', data),
  getMy: () => api.get('/payments/my'),
  getAdminAll: () => api.get('/payments/admin/all'),
};

export const inquiryAPI = {
  submit: (data) => api.post('/inquiries', data),
  getAll: () => api.get('/inquiries'),
  updateStatus: (id, status) => api.put(`/inquiries/${id}/status`, { status }),
};

export default api;
