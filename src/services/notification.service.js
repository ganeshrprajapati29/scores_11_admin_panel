import { notificationsAPI } from './api'

export const notificationService = {
  getAll: (params) => notificationsAPI.getAll(params),
  
  getById: (id) => notificationsAPI.getById(id),
  
  create: (data) => notificationsAPI.create(data),
  
  sendToUser: (userId, data) => notificationsAPI.sendToUser(userId, data),
  
  sendToAll: (data) => notificationsAPI.sendToAll(data),
  
  markAsRead: (id) => notificationsAPI.markAsRead(id),
  
  markAllAsRead: () => notificationsAPI.markAllAsRead(),
  
  delete: (id) => notificationsAPI.delete(id),
}

export default notificationService
