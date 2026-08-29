import { create } from 'zustand'

const getInitialTheme = () => {
  const saved = localStorage.getItem('theme')
  if (saved && (saved === 'light' || saved === 'dark')) return saved
  return 'light'
}

export const useThemeStore = create((set) => ({
  theme: getInitialTheme(),
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', next)
      document.documentElement.setAttribute('data-theme', next)
      return { theme: next }
    }),
  initTheme: () => {
    const theme = getInitialTheme()
    document.documentElement.setAttribute('data-theme', theme)
  },
  setTheme: (theme) => {
    localStorage.setItem('theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
    set({ theme })
  }
}))