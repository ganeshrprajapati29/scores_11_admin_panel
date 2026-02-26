import { contactAPI } from './api'

export const contactService = {
  getAll: (params) => contactAPI.getAll(params),
  
  getById: (id) => contactAPI.getById(id),
  
  create: (data) => contactAPI.create(data),
  
  reply: (id, data) => contactAPI.reply(id, data),
  
  delete: (id) => contactAPI.delete(id),
}

export default contactService
