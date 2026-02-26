import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from '../services/api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setToken: (token) => set({ token }),
      
      login: async (credentials) => {
        try {
          set({ loading: true, error: null })
          const response = await authAPI.login(credentials)
          
          // Handle different response formats
          // Backend returns: { statusCode, message, data: { user, accessToken } }
          const responseData = response.data || response
          const userData = responseData.user || response.user || response
          
          // Check for token in various formats - backend uses accessToken
          const userToken = responseData.accessToken || responseData.token || response.token || response.accessToken
          
          if (userToken) {
            localStorage.setItem('token', userToken)
            set({ 
              user: userData, 
              token: userToken, 
              isAuthenticated: true, 
              loading: false, 
              error: null 
            })
            return { success: true, user: userData }
          } else {
            throw new Error('No token received from server')
          }
        } catch (error) {
          const errorMessage = error.response?.data?.message || error.message || 'Login failed'
          set({ loading: false, error: errorMessage })
          return { success: false, message: errorMessage }
        }
      },
      
      logout: () => {
        localStorage.removeItem('token')
        set({ user: null, token: null, isAuthenticated: false, error: null })
      },
      
      setLoading: (loading) => set({ loading }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),
      
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),
    }),
    {
      name: 'auth-storage',
    }
  )
)

export default useAuthStore
