import { createContext, useContext, useState, useEffect } from 'react'
import useAuthStore from '../store/authStore'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const { user, token, isAuthenticated, login: storeLogin, logout: storeLogout, setLoading, loading } = useAuthStore()
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token')
      if (storedToken && !token) {
        try {
          setLoading(true)
          const response = await authAPI.getCurrentUser()
          storeLogin(response.data, storedToken)
        } catch (error) {
          storeLogout()
        } finally {
          setLoading(false)
          setInitialized(true)
        }
      } else {
        setInitialized(true)
      }
    }
    initAuth()
  }, [])

  const login = async (email, password) => {
    try {
      setLoading(true)
      const response = await authAPI.login({ email, password })
      storeLogin(response.data, response.token)
      return response
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      storeLogout()
    }
  }

  const value = {
    user,
    token,
    isAuthenticated,
    loading: loading || !initialized,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
