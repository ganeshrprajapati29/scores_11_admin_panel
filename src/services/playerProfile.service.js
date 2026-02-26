import { playerProfilesAPI } from './api'

export const playerProfileService = {
  getAll: (params) => playerProfilesAPI.getAll(params),
  
  getById: (id) => playerProfilesAPI.getById(id),
  
  create: (data) => playerProfilesAPI.create(data),
  
  update: (id, data) => playerProfilesAPI.update(id, data),
  
  delete: (id) => playerProfilesAPI.delete(id),
}

export default playerProfileService
