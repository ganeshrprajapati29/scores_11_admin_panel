import { contestsAPI } from './api'

export const contestService = {
  getAll: (params) => contestsAPI.getAll(params),
  
  getById: (id) => contestsAPI.getById(id),
  
  create: (data) => contestsAPI.create(data),
  
  update: (id, data) => contestsAPI.update(id, data),
  
  delete: (id) => contestsAPI.delete(id),
  
  getByMatch: (matchId) => contestsAPI.getByMatch(matchId),
  
  join: (id, teamId) => contestsAPI.join(id, teamId),
}

export default contestService
