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
  }
}

export default userService
