import { create } from 'zustand'

interface AppState {
  theme: 'dark' | 'light'
  isCartOpen: boolean
  toggleCart: () => void
  setTheme: (theme: 'dark' | 'light') => void
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'dark', // Luxury design defaults to dark mode
  isCartOpen: false,
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  setTheme: (theme) => set({ theme }),
}))
