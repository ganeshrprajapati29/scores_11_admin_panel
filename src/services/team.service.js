import api from '../config/axiosConfig'

export const teamService = {
  getAllTeams: async (params = {}) => {
    const response = await api.get('/teams/list', { params })
    return response
  },

  getTeamById: async (id) => {
    const response = await api.get(`/teams/${id}`)
    return response
  },

  createTeam: async (data) => {
    const response = await api.post('/teams', data)
    return response
  },

  updateTeam: async (id, data) => {
    const response = await api.put(`/teams/${id}`, data)
    return response
  },

  deleteTeam: async (id) => {
    const response = await api.delete(`/teams/${id}`)
    return response
  },

  searchTeams: async (query) => {
    const response = await api.get('/teams/search', { params: { q: query } })
    return response
  },

  getTeamRankings: async () => {
    const response = await api.get('/teams/rankings')
    return response
  },

  addPlayer: async (teamId, playerId) => {
    const response = await api.post(`/teams/${teamId}/players`, { playerId })
    return response
  },

  removePlayer: async (teamId, playerId) => {
    const response = await api.delete(`/teams/${teamId}/players`, { data: { playerId } })
    return response
  },

  verifyTeam: async (id) => {
    const response = await api.patch(`/teams/${id}/verify`)
    return response
  },

  uploadLogo: async (teamId, file) => {
    const formData = new FormData()
    formData.append('logo', file)
    const response = await api.post(`/teams/${teamId}/logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response
  }
}

export default teamService
