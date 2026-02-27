import api from './api';

const adminService = {
  // Dashboard & Analytics
  getDashboard: () => api.get('/admin/dashboard'),
  getSystemStats: () => api.get('/admin/stats'),
  getAdvancedAnalytics: (params) => api.get('/admin/analytics', { params }),
  exportAnalytics: (params) => api.get('/admin/analytics/export', { params, responseType: 'blob' }),

  // User Management
  getAllUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  // Role Management
  getRoles: () => api.get('/admin/roles'),
  createRole: (data) => api.post('/admin/roles', data),
  updateRole: (id, data) => api.put(`/admin/roles/${id}`, data),
  deleteRole: (id) => api.delete(`/admin/roles/${id}`),

  // System Logs
  getSystemLogs: (params) => api.get('/admin/logs', { params }),
  exportLogs: (params) => api.get('/admin/logs/export', { params, responseType: 'blob' }),
  clearOldLogs: (days) => api.post('/admin/logs/clear', { days }),

  // Backup & Restore
  getBackups: () => api.get('/admin/backups'),
  createBackup: (data) => api.post('/admin/backups', data),
  restoreBackup: (id) => api.post(`/admin/backups/${id}/restore`),
  deleteBackup: (id) => api.delete(`/admin/backups/${id}`),
  downloadBackup: (id) => api.get(`/admin/backups/${id}/download`, { responseType: 'blob' }),

  // Email Templates
  getEmailTemplates: () => api.get('/admin/email-templates'),
  createEmailTemplate: (data) => api.post('/admin/email-templates', data),
  updateEmailTemplate: (id, data) => api.put(`/admin/email-templates/${id}`, data),
  deleteEmailTemplate: (id) => api.delete(`/admin/email-templates/${id}`),
  sendTestEmail: (id, email) => api.post(`/admin/email-templates/${id}/test`, { email }),

  // Content Moderation
  getModerationQueue: (params) => api.get('/admin/moderation', { params }),
  moderateContent: (id, data) => api.post(`/admin/moderation/${id}`, data),
  deleteContent: (id) => api.delete(`/admin/moderation/${id}`),

  // Financial Overview
  getFinancialOverview: (params) => api.get('/admin/financial', { params }),
  exportFinancialData: (params) => api.get('/admin/financial/export', { params, responseType: 'blob' }),

  // User Verifications
  getVerifications: (params) => api.get('/admin/verifications', { params }),
  approveVerification: (id, data) => api.post(`/admin/verifications/${id}/approve`, data),
  rejectVerification: (id, data) => api.post(`/admin/verifications/${id}/reject`, data),

  // API Management
  getAPIKeys: () => api.get('/admin/api-keys'),
  createAPIKey: (data) => api.post('/admin/api-keys', data),
  deleteAPIKey: (id) => api.delete(`/admin/api-keys/${id}`),
  regenerateAPIKey: (id) => api.post(`/admin/api-keys/${id}/regenerate`),
  getWebhooks: () => api.get('/admin/webhooks'),
  createWebhook: (data) => api.post('/admin/webhooks', data),
  deleteWebhook: (id) => api.delete(`/admin/webhooks/${id}`),

  // Tournaments & Matches
  getAllTournaments: (params) => api.get('/admin/tournaments', { params }),
  getAllMatches: (params) => api.get('/admin/matches', { params }),

  // Mobile App Management
  getAppBanners: () => api.get('/admin/app/banners'),
  createAppBanner: (data) => api.post('/admin/app/banners', data),
  updateAppBanner: (id, data) => api.put(`/admin/app/banners/${id}`, data),
  deleteAppBanner: (id) => api.delete(`/admin/app/banners/${id}`),
  getAppText: () => api.get('/admin/app/text'),
  updateAppText: (key, data) => api.put(`/admin/app/text/${key}`, data),
  getAppConfig: () => api.get('/admin/app/config'),
  updateAppConfig: (data) => api.put('/admin/app/config', data),
  getAppNotifications: () => api.get('/admin/app/notifications'),
  sendPushNotification: (data) => api.post('/admin/app/notifications/send', data),

  // Store Management
  getStoreData: (params) => api.get('/admin/store', { params }),
  getStoreProducts: (params) => api.get('/admin/store/products', { params }),
  createStoreProduct: (data) => api.post('/admin/store/products', data),
  updateStoreProduct: (id, data) => api.put(`/admin/store/products/${id}`, data),
  deleteStoreProduct: (id) => api.delete(`/admin/store/products/${id}`),
  updateOrderStatus: (id, data) => api.put(`/admin/store/orders/${id}`, data),

  // Contest Management
  getContests: (params) => api.get('/admin/contests', { params }),
  createContest: (data) => api.post('/admin/contests', data),
  updateContest: (id, data) => api.put(`/admin/contests/${id}`, data),
  deleteContest: (id) => api.delete(`/admin/contests/${id}`),
  updateContestStatus: (id, status) => api.patch(`/admin/contests/${id}/status`, { status }),
  getPrizePools: () => api.get('/admin/contests/prize-pools'),
  getContestStats: () => api.get('/admin/contests/stats')
};

export default adminService;
