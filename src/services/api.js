import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api/v1'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error.response?.data || error)
  }
)

// Auth API
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  changePassword: (data) => api.post('/auth/change-password', data),
}

// Users API
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users/register', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
}

// Teams API
export const teamsAPI = {
  getAll: (params) => api.get('/teams', { params }),
  getById: (id) => api.get(`/teams/${id}`),
  create: (data) => api.post('/teams', data),
  update: (id, data) => api.put(`/teams/${id}`, data),
  delete: (id) => api.delete(`/teams/${id}`),
  getMyTeams: () => api.get('/teams/my-teams'),
  search: (q) => api.get('/teams/search', { params: { q } }),
  getRankings: (params) => api.get('/teams/rankings', { params }),
  addPlayer: (id, playerId) => api.post(`/teams/${id}/players`, { playerId }),
  removePlayer: (id, playerId) => api.delete(`/teams/${id}/players`, { data: { playerId } }),
  setCaptain: (id, playerId) => api.post(`/teams/${id}/captain`, { playerId }),
  setViceCaptain: (id, playerId) => api.post(`/teams/${id}/vice-captain`, { playerId }),
  verifyTeam: (id) => api.patch(`/teams/${id}/verify`),
}

// Players API
export const playersAPI = {
  getAll: (params) => api.get('/players', { params }),
  getById: (id) => api.get(`/players/${id}`),
  create: (data) => api.post('/players', data),
  update: (id, data) => api.put(`/players/${id}`, data),
  delete: (id) => api.delete(`/players/${id}`),
  search: (q) => api.get('/players/search', { params: { q } }),
}

// Matches API
export const matchesAPI = {
  getAll: (params) => api.get('/matches', { params }),
  getById: (id) => api.get(`/matches/${id}`),
  create: (data) => api.post('/matches', data),
  update: (id, data) => api.put(`/matches/${id}`, data),
  delete: (id) => api.delete(`/matches/${id}`),
  getLive: () => api.get('/matches/live'),
  getUpcoming: (params) => api.get('/matches/upcoming', { params }),
  getCompleted: (params) => api.get('/matches/completed', { params }),
  getTournamentMatches: (tournamentId, params) => api.get(`/matches/tournament/${tournamentId}`, { params }),
  getTeamMatches: (teamId, params) => api.get(`/matches/team/${teamId}`, { params }),
  updateStatus: (id, status) => api.patch(`/matches/${id}/status`, { status }),
  updateToss: (id, data) => api.patch(`/matches/${id}/toss`, data),
  updateResult: (id, data) => api.patch(`/matches/${id}/result`, data),
  search: (q) => api.get('/matches/search', { params: { q } }),
}

// Tournaments API
export const tournamentsAPI = {
  getAll: (params) => api.get('/tournaments', { params }),
  getById: (id) => api.get(`/tournaments/${id}`),
  create: (data) => api.post('/tournaments', data),
  update: (id, data) => api.put(`/tournaments/${id}`, data),
  delete: (id) => api.delete(`/tournaments/${id}`),
  getByStatus: (status, params) => api.get(`/tournaments/status/${status}`, { params }),
  updateStatus: (id, status) => api.patch(`/tournaments/${id}/status`, { status }),
  search: (q) => api.get('/tournaments/search', { params: { q } }),
}

// Contests API
export const contestsAPI = {
  getAll: (params) => api.get('/contests', { params }),
  getById: (id) => api.get(`/contests/${id}`),
  create: (data) => api.post('/contests', data),
  update: (id, data) => api.put(`/contests/${id}`, data),
  delete: (id) => api.delete(`/contests/${id}`),
  getByMatch: (matchId) => api.get(`/contests/match/${matchId}`),
  join: (id, teamId) => api.post(`/contests/${id}/join`, { teamId }),
}

// Leaderboard API
export const leaderboardAPI = {
  getAll: (params) => api.get('/leaderboard', { params }),
  getById: (id) => api.get(`/leaderboard/${id}`),
  create: (data) => api.post('/leaderboard', data),
  update: (id, data) => api.put(`/leaderboard/${id}`, data),
  delete: (id) => api.delete(`/leaderboard/${id}`),
  getByUser: (userId) => api.get(`/leaderboard/user/${userId}`),
  getByTournament: (tournamentId) => api.get(`/leaderboard/tournament/${tournamentId}`),
}

// Wallet API
export const walletAPI = {
  getBalance: () => api.get('/wallet/balance'),
  getTransactions: (params) => api.get('/wallet/transactions', { params }),
  getUserWallet: (userId) => api.get(`/wallet/user/${userId}`),
  getAdminOverview: () => api.get('/wallet/admin/overview'),
  addFunds: (data) => api.post('/wallet/add-funds', data),
  withdraw: (data) => api.post('/wallet/withdraw', data),
}

// Notifications API
export const notificationsAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  getById: (id) => api.get(`/notifications/${id}`),
  create: (data) => api.post('/notifications', data),
  sendToUser: (userId, data) => api.post(`/notifications/user/${userId}`, data),
  sendToAll: (data) => api.post('/notifications/send-all', data),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
}

// Blogs API
export const blogsAPI = {
  getAll: (params) => api.get('/blogs', { params }),
  getById: (id) => api.get(`/blogs/${id}`),
  create: (data) => api.post('/blogs', data),
  update: (id, data) => api.put(`/blogs/${id}`, data),
  delete: (id) => api.delete(`/blogs/${id}`),
  publish: (id) => api.patch(`/blogs/${id}/publish`),
  unpublish: (id) => api.patch(`/blogs/${id}/unpublish`),
}

// News API
export const newsAPI = {
  getAll: (params) => api.get('/news', { params }),
  getById: (id) => api.get(`/news/${id}`),
  create: (data) => api.post('/news', data),
  update: (id, data) => api.put(`/news/${id}`, data),
  delete: (id) => api.delete(`/news/${id}`),
  publish: (id) => api.patch(`/news/${id}/publish`),
  unpublish: (id) => api.patch(`/news/${id}/unpublish`),
}

// Community API
export const communityAPI = {
  getAllPosts: (params) => api.get('/community/posts', { params }),
  getPostById: (id) => api.get(`/community/posts/${id}`),
  createPost: (data) => api.post('/community/posts', data),
  updatePost: (id, data) => api.put(`/community/posts/${id}`, data),
  deletePost: (id) => api.delete(`/community/posts/${id}`),
  likePost: (id) => api.post(`/community/posts/${id}/like`),
  commentPost: (id, data) => api.post(`/community/posts/${id}/comment`, data),
  getReportedPosts: (params) => api.get('/community/reported', { params }),
  reportPost: (id, data) => api.post(`/community/posts/${id}/report`, data),
  ignoreReport: (id) => api.post(`/community/reports/${id}/ignore`),
  deleteReportedPost: (id) => api.delete(`/community/reports/${id}`),
}

// Store API
export const storeAPI = {
  getProducts: (params) => api.get('/store/products', { params }),
  getProductById: (id) => api.get(`/store/products/${id}`),
  createProduct: (data) => api.post('/store/products', data),
  updateProduct: (id, data) => api.put(`/store/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/store/products/${id}`),
  getOrders: (params) => api.get('/store/orders', { params }),
  getOrderById: (id) => api.get(`/store/orders/${id}`),
  updateOrderStatus: (id, status) => api.patch(`/store/orders/${id}/status`, { status }),
}

// Clubs API
export const clubsAPI = {
  getAll: (params) => api.get('/clubs', { params }),
  getById: (id) => api.get(`/clubs/${id}`),
  create: (data) => api.post('/clubs', data),
  update: (id, data) => api.put(`/clubs/${id}`, data),
  delete: (id) => api.delete(`/clubs/${id}`),
  verify: (id) => api.patch(`/clubs/${id}/verify`),
}

// Associations API
export const associationsAPI = {
  getAll: (params) => api.get('/associations', { params }),
  getById: (id) => api.get(`/associations/${id}`),
  create: (data) => api.post('/associations', data),
  update: (id, data) => api.put(`/associations/${id}`, data),
  delete: (id) => api.delete(`/associations/${id}`),
}

// Awards API
export const awardsAPI = {
  getAll: (params) => api.get('/awards', { params }),
  getById: (id) => api.get(`/awards/${id}`),
  create: (data) => api.post('/awards', data),
  update: (id, data) => api.put(`/awards/${id}`, data),
  delete: (id) => api.delete(`/awards/${id}`),
}

// Subscriptions API
export const subscriptionsAPI = {
  getPlans: (params) => api.get('/subscriptions/plans', { params }),
  getPlanById: (id) => api.get(`/subscriptions/plans/${id}`),
  createPlan: (data) => api.post('/subscriptions/plans', data),
  updatePlan: (id, data) => api.put(`/subscriptions/plans/${id}`, data),
  deletePlan: (id) => api.delete(`/subscriptions/plans/${id}`),
  getSubscribers: (params) => api.get('/subscriptions/subscribers', { params }),
  getSubscriberById: (id) => api.get(`/subscriptions/subscribers/${id}`),
  cancelSubscription: (id) => api.post(`/subscriptions/subscribers/${id}/cancel`),
}

// Settings API
export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
  updateSection: (section, data) => api.put(`/settings/${section}`, data),
}

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getSystemStats: () => api.get('/admin/stats'),
}

// Player Profiles API
export const playerProfilesAPI = {
  getAll: (params) => api.get('/profiles', { params }),
  getById: (id) => api.get(`/profiles/${id}`),
  create: (data) => api.post('/profiles', data),
  update: (id, data) => api.put(`/profiles/${id}`, data),
  delete: (id) => api.delete(`/profiles/${id}`),
}

// Scoring API
export const scoringAPI = {
  getMatchScoring: (matchId) => api.get(`/scoring/match/${matchId}`),
  updateBall: (matchId, data) => api.post(`/scoring/match/${matchId}/ball`, data),
  updateOver: (matchId, data) => api.post(`/scoring/match/${matchId}/over`, data),
  updateInnings: (matchId, data) => api.post(`/scoring/match/${matchId}/innings`, data),
  endMatch: (matchId) => api.post(`/scoring/match/${matchId}/end`),
}

// Contact API
export const contactAPI = {
  getAll: (params) => api.get('/contact', { params }),
  getById: (id) => api.get(`/contact/${id}`),
  create: (data) => api.post('/contact', data),
  reply: (id, data) => api.post(`/contact/${id}/reply`, data),
  delete: (id) => api.delete(`/contact/${id}`),
}

// Reviews API
export const reviewsAPI = {
  getAll: (params) => api.get('/reviews', { params }),
  getById: (id) => api.get(`/reviews/${id}`),
  create: (data) => api.post('/reviews', data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
  approve: (id) => api.patch(`/reviews/${id}/approve`),
  reject: (id) => api.patch(`/reviews/${id}/reject`),
}

// Performance API
export const performanceAPI = {
  getAll: (params) => api.get('/performance', { params }),
  getById: (id) => api.get(`/performance/${id}`),
  getByPlayer: (playerId) => api.get(`/performance/player/${playerId}`),
  getByTeam: (teamId) => api.get(`/performance/team/${teamId}`),
  create: (data) => api.post('/performance', data),
  update: (id, data) => api.put(`/performance/${id}`, data),
}

export default api
