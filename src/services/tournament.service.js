import api from '../config/axiosConfig'

export const tournamentService = {
  getAllTournaments: async (params = {}) => {
    const response = await api.get('/tournaments/list', { params })
    return response
  },

  getTournamentById: async (id) => {
    const response = await api.get(`/tournaments/${id}`)
    return response
  },

  createTournament: async (data) => {
    const response = await api.post('/tournaments', data)
    return response
  },

  updateTournament: async (id, data) => {
    const response = await api.put(`/tournaments/${id}`, data)
    return response
  },

  deleteTournament: async (id) => {
    const response = await api.delete(`/tournaments/${id}`)
    return response
  },

  updateTournamentStatus: async (id, status) => {
    const response = await api.patch(`/tournaments/${id}/status`, { status })
    return response
  },

  getPointsTable: async (id) => {
    const response = await api.get(`/tournaments/${id}/points-table`)
    return response
  }
}

export default tournamentService
