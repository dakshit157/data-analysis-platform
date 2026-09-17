import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 60000, // 60 second timeout for uploads
})

api.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const uploadFile = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const loadSampleDataset = () => {
  return api.post('/upload/sample')
}

export const getOverview = (id) => api.get(`/overview/${id}`)
export const getQuality = (id) => api.get(`/quality/${id}`)
export const getExplore = (id) => api.get(`/explore/${id}`)
export const getCorrelations = (id) => api.get(`/correlations/${id}`)
export const getCorrelationDetail = (id, column) => api.get(`/correlations/${id}/${column}`)
export const getInsights = (id) => api.get(`/insights/${id}`)

export const postFilter = (id, filters) => api.post(`/filter/${id}`, { filters })
export const postCustomChart = (id, params) => api.post(`/explore/${id}/custom`, params)

const backendUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8000'

export const exportCSV = (id) => {
  window.location.href = `${backendUrl}/api/export/${id}/csv`
}

export const exportSummary = (id) => {
  window.location.href = `${backendUrl}/api/export/${id}/summary`
}