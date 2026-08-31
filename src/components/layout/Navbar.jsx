import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Coins, User, Menu, Sparkles, Sun, Moon } from 'lucide-react'
import { useWalletStore } from '../../store/walletStore.js'
import { useAuthStore } from '../../store/authStore.js'
import { useThemeStore } from '../../store/themeStore.js'
import Sidebar from './Sidebar.jsx'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const balance = useWalletStore(s => s.balance)
  const user = useAuthStore(s => s.user)
  const { theme, toggleTheme } = useThemeStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Solid, non-transparent luxury header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-bg-surface border-b border-border-sage/40 shadow-soft transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Left: Brand Identity (Prominent SUDERSHAN Title) */}
          <div 
            onClick={() => navigate('/home')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-bg-elevated border border-border-sage flex items-center justify-center text-sage shadow-soft-sm group-hover:scale-105 transition-all">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-2xl text-text-primary font-bold tracking-wider leading-none">
                SUDERSHAN
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-text-secondary font-medium mt-0.5">
                Clinical Hypnotherapy
              </span>
            </div>
          </div>

          {/* Center: Desktop Navigation Pills (Calmara/Sarina Style) */}
          <nav className="hidden md:flex items-center gap-1 bg-bg-elevated border border-border-subtle p-1 rounded-full shadow-soft-sm">
            {[
              { path: '/home', label: 'Sanctuary' },
              { path: '/wallet', label: 'Wallet & Tokens' },
              { path: '/profile', label: 'My Journey' },
              { path: '/contact', label: 'Guidance' },
            ].map(item => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-sage text-white font-semibold shadow-soft'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right: Quick Theme Switcher, Token Counter & Profile Avatar */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-bg-elevated border border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-sage transition-all duration-200 shadow-soft-sm"
              aria-label="Toggle Theme"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-champagne" />
              ) : (
                <Moon className="w-4 h-4 text-text-secondary" />
              )}
            </button>

            {/* Token Counter */}
            <button
              onClick={() => navigate('/wallet')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold
                bg-bg-elevated border border-border-champagne hover:border-champagne text-text-primary
                transition-all duration-200 shadow-soft-sm active:scale-95"
            >
              <Coins className="w-3.5 h-3.5 text-champagne" />
              <span className="font-mono">{balance}</span>
              <span className="hidden sm:inline font-normal text-text-secondary">Tokens</span>
            </button>

            {/* Profile Avatar */}
            <button
              onClick={() => navigate('/profile')}
              className={`flex items-center justify-center w-9 h-9 rounded-full
                transition-all duration-200 border shadow-soft-sm
                ${isActive('/profile')
                  ? 'bg-sage text-white border-sage font-bold'
                  : 'bg-bg-elevated border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-sage'
                }`}
              aria-label="Profile"
            >
              {user?.avatar ? (
                <span className="text-xs font-bold">
                  {user.avatar}
                </span>
              ) : (
                <User className="w-4 h-4" />
              )}
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-2xl bg-bg-elevated border border-border-subtle text-text-secondary
                hover:text-text-primary hover:bg-bg-surface transition-all shadow-soft-sm"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  )
}