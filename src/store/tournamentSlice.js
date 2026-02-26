import { create } from 'zustand'

const useTournamentStore = create((set) => ({
  tournaments: [],
  currentTournament: null,
  loading: false,
  error: null,
  
  setTournaments: (tournaments) => set({ tournaments }),
  setCurrentTournament: (tournament) => set({ currentTournament: tournament }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  addTournament: (tournament) => set((state) => ({ 
    tournaments: [...state.tournaments, tournament] 
  })),
  
  updateTournament: (id, data) => set((state) => ({ 
    tournaments: state.tournaments.map(tournament => 
      tournament._id === id ? { ...tournament, ...data } : tournament 
    ) 
  })),
  
  deleteTournament: (id) => set((state) => ({ 
    tournaments: state.tournaments.filter(tournament => tournament._id !== id) 
  })),
  
  clearError: () => set({ error: null }),
}))

export default useTournamentStore
