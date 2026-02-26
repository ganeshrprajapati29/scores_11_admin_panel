import api from '../config/axiosConfig'

export const matchService = {
  getAllMatches: async (params = {}) => {
    const response = await api.get('/matches/list', { params })
    return response
  },

  getMatchById: async (id) => {
    const response = await api.get(`/matches/${id}`)
    return response
  },

  createMatch: async (data) => {
    const response = await api.post('/matches', data)
    return response
  },

  updateMatch: async (id, data) => {
    const response = await api.put(`/matches/${id}`, data)
    return response
  },

  deleteMatch: async (id) => {
    const response = await api.delete(`/matches/${id}`)
    return response
  },

  startMatch: async (id) => {
    const response = await api.patch(`/matches/${id}/start`)
    return response
  },

  endMatch: async (id) => {
    const response = await api.patch(`/matches/${id}/end`)
    return response
  },

  updateMatchStatus: async (id, status) => {
    const response = await api.patch(`/matches/${id}/status`, { status })
    return response
  }
}

export default matchService
