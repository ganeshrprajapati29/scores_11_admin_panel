import { performanceAPI } from './api'

export const performanceService = {
  getAll: (params) => performanceAPI.getAll(params),
  
  getById: (id) => performanceAPI.getById(id),
  
  getByPlayer: (playerId) => performanceAPI.getByPlayer(playerId),
  
  getByTeam: (teamId) => performanceAPI.getByTeam(teamId),
  
  create: (data) => performanceAPI.create(data),
  
  update: (id, data) => performanceAPI.update(id, data),
}

export default performanceService
