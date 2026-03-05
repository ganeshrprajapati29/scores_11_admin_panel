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
  
  // User Management
  users: '/users',
  verifiedUsers: '/users/verified',
  scorers: '/users/scorers',
  suspendedUsers: '/users/suspended',
  userReports: '/users/reports',
  
  // Player Management
  players: '/players',
  playerProfiles: '/players/profiles',
  
  // Team Management
  teams: '/teams',
  teamApproval: '/teams/approvals',
  
  // Match Management
  matches: '/matches',
  upcomingMatches: '/matches/upcoming',
  liveMatches: '/matches/live',
  completedMatches: '/matches/completed',
  
  // Tournament Management
  tournaments: '/tournaments',
  tournamentFixtures: '/tournaments/fixtures',
  pointsTable: '/tournaments/points',
  tournamentApprovals: '/tournaments/approvals',
  
  // Leaderboard
  leaderboard: '/leaderboard',
  topBatsmen: '/leaderboard/batsmen',
  topBowlers: '/leaderboard/bowlers',
  
  // Club Management
  clubs: '/clubs',
  clubApprovals: '/clubs/approvals',
  
  // Association Management
  associations: '/associations',
  
  // Awards
  awards: '/awards',
  
  // Wallet & Finance
  wallet: '/wallet',
  withdrawRequests: '/wallet/withdraw',
  
  // Subscriptions
  subscriptions: '/subscriptions',
  
  // Notifications
  notifications: '/notifications',
  broadcast: '/notifications/broadcast',
  
  // Content
  blogs: '/blogs',
  news: '/news',
  community: '/community',
  store: '/store',
  
  // Settings & Admin
  settings: '/settings',
  admin: {
    analytics: '/admin/analytics',
    finance: '/admin/finance',
    logs: '/admin/logs',
    roles: '/admin/roles',
    verifications: '/admin/verifications',
    moderation: '/admin/moderation',
    backups: '/admin/backups',
    api: '/admin/api',
    mobile: '/admin/mobile-app',
    store: '/admin/store-manager',
    contest: '/admin/contest-manager',
    system: '/admin/system',
  }
}

// Menu items configuration
export const menuItems = [
  { name: 'Dashboard', path: routesConfig.dashboard, icon: 'LayoutDashboard' },
  
  // User Management Section
  { name: 'Users', path: routesConfig.users, icon: 'Users', category: 'users' },
  { name: 'Verified Players', path: routesConfig.verifiedUsers, icon: 'BadgeCheck', category: 'users' },
  { name: 'Scorers', path: routesConfig.scorers, icon: 'ClipboardList', category: 'users' },
  { name: 'Suspended Users', path: routesConfig.suspendedUsers, icon: 'UserX', category: 'users' },
  { name: 'User Reports', path: routesConfig.userReports, icon: 'Flag', category: 'users' },
  
  // Cricket Operations Section
  { name: 'Players', path: routesConfig.players, icon: 'UsersRound', category: 'cricket' },
  { name: 'Teams', path: routesConfig.teams, icon: 'Target', category: 'cricket' },
  { name: 'Matches', path: routesConfig.matches, icon: 'Gamepad2', category: 'cricket' },
  { name: 'Tournaments', path: routesConfig.tournaments, icon: 'Trophy', category: 'cricket' },
  { name: 'Leaderboard', path: routesConfig.leaderboard, icon: 'Flag', category: 'cricket' },
  
  // Commerce Section
  { name: 'Wallet', path: routesConfig.wallet, icon: 'Wallet', category: 'commerce' },
  { name: 'Subscriptions', path: routesConfig.subscriptions, icon: 'CreditCard', category: 'commerce' },
  { name: 'Store', path: routesConfig.store, icon: 'Store', category: 'commerce' },
  
  // Organizations Section
  { name: 'Clubs', path: routesConfig.clubs, icon: 'Building2', category: 'orgs' },
  { name: 'Associations', path: routesConfig.associations, icon: 'landmark', category: 'orgs' },
  { name: 'Awards', path: routesConfig.awards, icon: 'Award', category: 'orgs' },
  
  // Content Section
  { name: 'Blogs', path: routesConfig.blogs, icon: 'Newspaper', category: 'content' },
  { name: 'News', path: routesConfig.news, icon: 'ScrollText', category: 'content' },
  { name: 'Community', path: routesConfig.community, icon: 'Users', category: 'content' },
  
  // Notifications
  { name: 'Notifications', path: routesConfig.notifications, icon: 'Bell', category: 'notifications' },
  
  // Settings
  { name: 'Settings', path: routesConfig.settings, icon: 'Settings', category: 'settings' },
]

export default routesConfig
