import { reviewsAPI } from './api'

export const reviewService = {
  getAll: (params) => reviewsAPI.getAll(params),
  
  getById: (id) => reviewsAPI.getById(id),
  
  create: (data) => reviewsAPI.create(data),
  
  update: (id, data) => reviewsAPI.update(id, data),
  
  delete: (id) => reviewsAPI.delete(id),
  
  approve: (id) => reviewsAPI.approve(id),
  
  reject: (id) => reviewsAPI.reject(id),
}

export default reviewService
