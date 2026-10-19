import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from '../services/api'

const normalizeAuthPayload = (response) => {
  const payload = response?.data && (response.data.user || response.data.accessToken || response.data.token)
    ? response.data
    : response

  const user = payload?.user || response?.user || null
  const token = payload?.accessToken || payload?.token || response?.accessToken || response?.token || null
  const refreshToken = payload?.refreshToken || response?.refreshToken || null

  return { user, token, refreshToken }
}

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

      setSession: ({ user, token, refreshToken }) => {
        if (token) {
          localStorage.setItem('token', token)
        }

        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken)
        }

        set({
          user: user || null,
          token: token || null,
          isAuthenticated: !!token,
          loading: false,
          error: null
        })
      },
      
      login: async (credentials) => {
        try {
          set({ loading: true, error: null })
          const response = await authAPI.login(credentials)
          const { user, token, refreshToken } = normalizeAuthPayload(response)
          
          if (token) {
            get().setSession({ user, token, refreshToken })
            set({ 
              isAuthenticated: true, 
              loading: false, 
              error: null 
            })
            return { success: true, user, token }
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
        localStorage.removeItem('refreshToken')
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
