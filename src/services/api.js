import axios from 'axios'

/**
 * api.js - Axios HTTP client configuration.
 *
 * Axios is a promise-based HTTP client for the browser.
 *
 * axios.create() -> Creates a custom instance with default config:
 *   baseURL -> All requests are prefixed with this URL
 *   headers -> Default headers sent with every request
 *
 * Interceptors -> Middleware for requests/responses:
 *
 * Request interceptor:
 *   Runs BEFORE every request is sent.
 *   Reads JWT token from localStorage and adds it to Authorization header.
 *   This is how protected API calls are authenticated.
 *
 * Response interceptor:
 *   Runs AFTER every response is received.
 *   If 401 Unauthorized -> token expired -> clear storage -> redirect to login.
 *   This handles token expiry automatically across the whole app.
 *
 * Data flow:
 *   Component calls api.get('/patients')
 *   -> Request interceptor adds "Authorization: Bearer <token>"
 *   -> Spring Boot JwtAuthFilter validates token
 *   -> Controller returns data
 *   -> Response interceptor passes data to component
 */
const api = axios.create({
  // In dev: Vite proxy forwards /api -> localhost:8080
  // In production: VITE_API_URL = https://your-backend.up.railway.app
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
  headers: { 'Content-Type': 'application/json' }
})

// REQUEST INTERCEPTOR - attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// RESPONSE INTERCEPTOR - handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ==================== AUTH APIs ====================
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
}

// ==================== PATIENT APIs ====================
export const patientAPI = {
  getAll: (search) => api.get('/patients', { params: search ? { search } : {} }),
  getById: (id) => api.get(`/patients/${id}`),
  create: (data) => api.post('/patients', data),
  update: (id, data) => api.put(`/patients/${id}`, data),
  delete: (id) => api.delete(`/patients/${id}`),

  // Note APIs
  addNote: (patientId, data) => api.post(`/patients/${patientId}/notes`, data),
  updateNote: (patientId, noteId, data) => api.put(`/patients/${patientId}/notes/${noteId}`, data),
  deleteNote: (patientId, noteId) => api.delete(`/patients/${patientId}/notes/${noteId}`),
}

// ==================== PUBLIC APIs ====================
export const publicAPI = {
  getClinicInfo: () => api.get('/public/clinic-info'),
}

export default api
