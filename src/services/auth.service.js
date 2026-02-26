import api from '../config/axiosConfig'

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response
  },

  logout: async () => {
    const response = await api.post('/auth/logout')
    return response
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me')
    return response
  },

  changePassword: async (passwordData) => {
    const response = await api.post('/auth/change-password', passwordData)
    return response
  },

  refreshToken: async (token) => {
    const response = await api.post('/auth/refresh-token', { token })
    return response
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email })
    return response
  },

  resetPassword: async (resetData) => {
    const response = await api.post('/auth/reset-password', resetData)
    return response
  }
}

export default authService
