import { useMemo } from 'react'
import useAuth from './useAuth'
import {
  hasPermission,
  hasAnyPermission,
  canManageUsers,
  canManagePlayers,
  canManageTeams,
  canManageTournaments,
  canManageMatches,
  canViewAnalytics,
  canManageWallet,
  canManageNotifications,
  isSuperAdmin
} from '../utils/permissions'

export const usePermission = () => {
  const { user, loading: authLoading } = useAuth()
  const role = user?.role

  const hasPermissionFn = (permission) => {
    if (authLoading || !role) return false
    return hasPermission(role, permission)
  }

  const hasAnyPermissionFn = (permissions) => {
    if (authLoading || !role) return false
    return hasAnyPermission(role, permissions)
  }

  const canAccessAdmin = () => {
    return isSuperAdmin(role) || 
           canManageUsers(role) || 
           role === 'admin' ||
           role === 'moderator'
  }

  const canManageAdminResources = () => {
    return isSuperAdmin(role) || role === 'admin'
  }

  return {
    // Loading state
    loading: authLoading,
    
    // Role info
    role,
    isAdmin: role === 'admin' || role === 'super-admin',
    isSuperAdmin: isSuperAdmin(role),
    
    // Permission checkers
    hasPermission: hasPermissionFn,
    hasAnyPermission: hasAnyPermissionFn,
    
    // Convenience functions
    canManageUsers: () => canManageUsers(role),
    canManagePlayers: () => canManagePlayers(role),
    canManageTeams: () => canManageTeams(role),
    canManageTournaments: () => canManageTournaments(role),
    canManageMatches: () => canManageMatches(role),
    canViewAnalytics: () => canViewAnalytics(role),
    canManageWallet: () => canManageWallet(role),
    
    // Section access
    canAccessAdmin: canAccessAdmin,
    canAccessSuperAdmin: canManageAdminResources
  }
}

// Standalone hooks for specific checks
export const useHasPermission = (permission) => {
  const { hasPermission, loading } = usePermission()
  return useMemo(() => ({
    allowed: !loading && hasPermission(permission),
    loading
  }), [hasPermission, permission, loading])
}

export const useCanAccessAdmin = () => {
  const { canAccessAdmin, loading } = usePermission()
  return useMemo(() => ({
    allowed: !loading && canAccessAdmin(),
    loading
  }), [canAccessAdmin, loading])
}

export const useIsSuperAdmin = () => {
  const { isSuperAdmin, loading } = usePermission()
  return useMemo(() => ({
    isSuperAdmin: !loading && isSuperAdmin,
    loading
  }), [isSuperAdmin, loading])
}

export default usePermission

