import { create } from 'zustand'

const useUserStore = create((set) => ({
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  
  setUsers: (users) => set({ users }),
  setCurrentUser: (user) => set({ currentUser: user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  addUser: (user) => set((state) => ({ 
    users: [...state.users, user] 
  })),
  
  updateUser: (id, data) => set((state) => ({ 
    users: state.users.map(user => 
      user._id === id ? { ...user, ...data } : user 
    ) 
  })),
  
  deleteUser: (id) => set((state) => ({ 
    users: state.users.filter(user => user._id !== id) 
  })),
  
  clearError: () => set({ error: null }),
}))

export default useUserStore
