import api from '../config/axiosConfig'

export const userService = {
  getAllUsers: async (params = {}) => {
    const response = await api.get('/users/list', { params })
    return response
  },

  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`)
    return response
  },

  getProfile: async () => {
    const response = await api.get('/users/me')
    return response
  },

  updateProfile: async (data) => {
    const response = await api.put('/users/me', data)
    return response
  },

  updateUser: async (id, data) => {
    const response = await api.put(`/users/${id}`, data)
    return response
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`)
    return response
  },

  uploadAvatar: async (file) => {
    const formData = new FormData()
    formData.append('avatar', file)
    const response = await api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response
  },

  toggleUserStatus: async (id) => {
    const response = await api.patch(`/users/${id}/toggle-status`)
    return response
  },

  // Admin User Management Methods
  banUser: async (id, reason) => {
    const response = await api.post(`/users/${id}/ban`, { reason })
    return response
  },

  unbanUser: async (id) => {
    const response = await api.post(`/users/${id}/unban`)
    return response
  },

  resetPassword: async (id, newPassword) => {
    const response = await api.post(`/users/${id}/reset-password`, { newPassword })
    return response
  },

  verifyUser: async (id) => {
    const response = await api.post(`/users/${id}/verify`)
    return response
  },

  changeRole: async (id, role) => {
    const response = await api.post(`/users/${id}/change-role`, { role })
    return response
  },

  getLoginHistory: async (id, params = {}) => {
    const response = await api.get(`/users/${id}/login-history`, { params })
    return response
  },

  getUserReports: async (params = {}) => {
    const response = await api.get('/users/reports', { params })
    return response
  },

  actionOnReport: async (reportId, action, adminNote) => {
    const response = await api.post(`/users/reports/${reportId}/action`, { action, adminNote })
    return response
  }
}

export default userService
