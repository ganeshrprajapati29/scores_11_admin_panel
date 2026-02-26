import { leaderboardAPI } from './api'

export const leaderboardService = {
  getAll: (params) => leaderboardAPI.getAll(params),
  
  getById: (id) => leaderboardAPI.getById(id),
  
  create: (data) => leaderboardAPI.create(data),
  
  update: (id, data) => leaderboardAPI.update(id, data),
  
  delete: (id) => leaderboardAPI.delete(id),
  
  getByUser: (userId) => leaderboardAPI.getByUser(userId),
  
  getByTournament: (tournamentId) => leaderboardAPI.getByTournament(tournamentId),
}

export default leaderboardService
