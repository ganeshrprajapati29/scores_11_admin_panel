// Route configuration for the application
export const routesConfig = {
  // Auth routes
  auth: {
    login: '/login',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
  },

  // Main routes
  dashboard: '/dashboard',
  users: '/users',
  teams: '/teams',
  matches: '/matches',
  tournaments: '/tournaments',
  players: '/players',
  leaderboard: '/leaderboard',
  wallet: '/wallet',
  notifications: '/notifications',
  blogs: '/blogs',
  news: '/news',
  community: '/community',
  store: '/store',
  clubs: '/clubs',
  associations: '/associations',
  awards: '/awards',
  subscriptions: '/subscriptions',
  settings: '/settings',
}

// Menu items configuration
export const menuItems = [
  { name: 'Dashboard', path: routesConfig.dashboard, icon: 'LayoutDashboard' },
  { name: 'Users', path: routesConfig.users, icon: 'Users' },
  { name: 'Teams', path: routesConfig.teams, icon: 'Target' },
  { name: 'Matches', path: routesConfig.matches, icon: 'Gamepad2' },
  { name: 'Tournaments', path: routesConfig.tournaments, icon: 'Trophy' },
  { name: 'Players', path: routesConfig.players, icon: 'UsersRound' },
  { name: 'Leaderboard', path: routesConfig.leaderboard, icon: 'Flag' },
  { name: 'Wallet', path: routesConfig.wallet, icon: 'Wallet' },
  { name: 'Notifications', path: routesConfig.notifications, icon: 'Bell' },
  { name: 'Blogs', path: routesConfig.blogs, icon: 'Newspaper' },
  { name: 'News', path: routesConfig.news, icon: 'ScrollText' },
  { name: 'Community', path: routesConfig.community, icon: 'Users' },
  { name: 'Store', path: routesConfig.store, icon: 'Store' },
  { name: 'Clubs', path: routesConfig.clubs, icon: 'Building2' },
  { name: 'Associations', path: routesConfig.associations, icon: 'Building2' },
  { name: 'Awards', path: routesConfig.awards, icon: 'Award' },
  { name: 'Subscriptions', path: routesConfig.subscriptions, icon: 'CreditCard' },
  { name: 'Settings', path: routesConfig.settings, icon: 'Settings' },
]

export default routesConfig
