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
  },

  // Generate fixtures
  generateFixtures: async (id, type) => {
    if (!id) throw new Error("Tournament ID is required")

    const response = await api.post(`/tournaments/${id}/generate-fixtures`, { type })
    return response.data
  },

  // Generate league matches
  generateLeagueMatches: async (id) => {
    if (!id) throw new Error("Tournament ID is required")

    const response = await api.post(`/tournaments/${id}/generate/league`)
    return response.data
  },

  // Generate knockout matches
  generateKnockoutMatches: async (id) => {
    if (!id) throw new Error("Tournament ID is required")

    const response = await api.post(`/tournaments/${id}/generate/knockout`)
    return response.data
  },

  // Get tournament matches/fixtures
  getTournamentMatches: async (id, params = {}) => {
    if (!id) throw new Error("Tournament ID is required")

    const response = await api.get(`/tournaments/${id}/matches`, { params })
    return response.data
  },

  // Get tournament stats
  getTournamentStats: async (id) => {
    if (!id) throw new Error("Tournament ID is required")

    const response = await api.get(`/tournaments/${id}/stats`)
    return response.data
  }

}

export default tournamentService
