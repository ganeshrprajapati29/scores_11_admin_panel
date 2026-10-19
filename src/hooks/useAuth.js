import { useCallback } from 'react'
import useAuthStore from '../store/authStore'
import { API_URL } from '../config/apiBase'

const useAuth = () => {
  const { 
    user, 
    token, 
    isAuthenticated, 
    loading, 
    error,
    logout: storeLogout,
    setSession,
    setError,
    clearError,
    updateUser
  } = useAuthStore()

  const login = useCallback(async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }
      
      const payload = data?.data || data
      setSession({
        user: payload?.user,
        token: payload?.accessToken || payload?.token || data?.token || data?.accessToken,
        refreshToken: payload?.refreshToken || data?.refreshToken
      })
      return data
    } catch (error) {
      setError(error.message)
      throw error
    }
  }, [setSession, setError])

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      storeLogout()
    }
  }, [token, storeLogout])

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    clearError,
    updateUser,
  }
}

export default useAuth
