// Permission utilities

const ROLE_PERMISSIONS = {
  admin: [
    'manage_users',
    'manage_players',
    'manage_teams',
    'manage_tournaments',
    'manage_matches',
    'view_analytics',
    'manage_wallet',
    'manage_notifications',
    'super_admin'
  ],
  player: [
    'view_own_profile',
    'update_own_profile',
    'view_matches',
    'participate_in_matches',
    'view_teams',
    'update_player_stats'
  ],
  umpire: [
    'view_matches',
    'manage_match_scoring',
    'update_match_status',
    'view_teams'
  ],
  user: [
    'view_own_profile',
    'update_own_profile',
    'view_matches',
    'view_tournaments',
    'create_team',
    'join_tournament'
  ]
}

export const hasPermission = (role, permission) => {
  const permissions = ROLE_PERMISSIONS[role]
  return permissions ? permissions.includes(permission) : false
}

export const hasAnyPermission = (role, permissions) => {
  return permissions.some(permission => hasPermission(role, permission))
}

export const hasAllPermissions = (role, permissions) => {
  return permissions.every(permission => hasPermission(role, permission))
}

export const canManageUsers = (role) => hasPermission(role, 'manage_users')
export const canManagePlayers = (role) => hasPermission(role, 'manage_players')
export const canManageTeams = (role) => hasPermission(role, 'manage_teams')
export const canManageTournaments = (role) => hasPermission(role, 'manage_tournaments')
export const canManageMatches = (role) => hasPermission(role, 'manage_matches')
export const canViewAnalytics = (role) => hasPermission(role, 'view_analytics')
export const canManageWallet = (role) => hasPermission(role, 'manage_wallet')
export const canManageNotifications = (role) => hasPermission(role, 'manage_notifications')
export const isSuperAdmin = (role) => hasPermission(role, 'super_admin')

export default ROLE_PERMISSIONS
