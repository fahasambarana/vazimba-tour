import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vazimba-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function getErrorMessage(error) {
  if (error.code === 'ERR_NETWORK') {
    return 'Le serveur est injoignable. Vérifiez que le backend est démarré puis réessayez.'
  }
  return error.response?.data?.message || error.message || 'Une erreur est survenue. Veuillez réessayer.'
}

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  profile: () => api.get('/auth/profile'),
}

export const circuitApi = {
  list: (filters = {}) => api.get('/circuits', { params: filters }),
  get: (id) => api.get(`/circuits/${id}`),
  create: (circuit) => api.post('/circuits', circuit),
  update: (id, circuit) => api.put(`/circuits/${id}`, circuit),
  remove: (id) => api.delete(`/circuits/${id}`),
}

export const etapeApi = {
  list: (circuitId) => api.get(`/etapes/${circuitId}`),
  create: (etape) => api.post('/etapes', etape),
  update: (id, etape) => api.put(`/etapes/${id}`, etape),
  remove: (id) => api.delete(`/etapes/${id}`),
}

export const photoApi = {
  list: (hebergementId) => api.get(`/photos/${hebergementId}`),
  create: (photo) => api.post('/photos', photo, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  remove: (id) => api.delete(`/photos/${id}`),
}

export const devisApi = {
  create: (devis) => api.post('/devis', devis),
  list: () => api.get('/devis'),
  update: (id, status) => api.put(`/devis/${id}`, status),
}

export default api
