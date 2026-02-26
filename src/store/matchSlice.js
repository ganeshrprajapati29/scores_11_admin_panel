import { create } from 'zustand'

const useMatchStore = create((set) => ({
  matches: [],
  currentMatch: null,
  loading: false,
  error: null,
  
  setMatches: (matches) => set({ matches }),
  setCurrentMatch: (match) => set({ currentMatch: match }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  addMatch: (match) => set((state) => ({ 
    matches: [...state.matches, match] 
  })),
  
  updateMatch: (id, data) => set((state) => ({ 
    matches: state.matches.map(match => 
      match._id === id ? { ...match, ...data } : match 
    ) 
  })),
  
  deleteMatch: (id) => set((state) => ({ 
    matches: state.matches.filter(match => match._id !== id) 
  })),
  
  clearError: () => set({ error: null }),
}))

export default useMatchStore
