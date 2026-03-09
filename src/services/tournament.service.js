import api from '../config/axiosConfig'

const tournamentService = {

  getAllTournaments: async (params = {}) => {
    const response = await api.get('/tournaments/list', { params })
    return response.data
  },

  getTournamentById: async (id) => {
    if (!id) throw new Error("Tournament ID is required")

    const response = await api.get(`/tournaments/${id}`)
    return response.data
  },

  createTournament: async (data) => {
    const response = await api.post('/tournaments', data)
    return response.data
  },

  updateTournament: async (id, data) => {
    if (!id) throw new Error("Tournament ID is required")

    const response = await api.put(`/tournaments/${id}`, data)
    return response.data
  },

  deleteTournament: async (id) => {
    if (!id) throw new Error("Tournament ID is required")

    const response = await api.delete(`/tournaments/${id}`)
    return response.data
  },

  updateTournamentStatus: async (id, status) => {
    if (!id) throw new Error("Tournament ID is required")

    const response = await api.patch(`/tournaments/${id}/status`, {
      status: status
    })

    return response.data
  },

  getPointsTable: async (id) => {
    if (!id) throw new Error("Tournament ID is required")

    const response = await api.get(`/tournaments/${id}/points-table`)
    return response.data
  }

}

export default tournamentService