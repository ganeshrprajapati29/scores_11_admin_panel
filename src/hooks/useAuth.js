import { useCallback } from 'react'
import useAuthStore from '../store/authStore'

const useAuth = () => {
  const { 
    user, 
    token, 
    isAuthenticated, 
    loading, 
    error,
    login: storeLogin,
    logout: storeLogout,
    setError,
    clearError,
    updateUser
  } = useAuthStore()

  const login = useCallback(async (email, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || '/api/v1'}/auth/login`, {
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
      
      storeLogin(data.data, data.token || data.accessToken)
      return data
    } catch (error) {
      setError(error.message)
      throw error
    }
  }, [storeLogin, setError])

  const logout = useCallback(async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || '/api/v1'}/auth/logout`, {
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
