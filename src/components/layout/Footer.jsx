import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, LayoutGrid, Wallet, Mail } from 'lucide-react'

export default function Footer() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => {
    if (path === '/home') return location.pathname === '/home' || location.pathname === '/'
    if (path === '/categories') return location.pathname.startsWith('/category')
    return location.pathname === path
  }

  function handleCategory() {
    if (location.pathname !== '/home') {
      navigate('/home')
      setTimeout(() => {
        document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    } else {
      document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const navItems = [
    { id: 'home', path: '/home', label: 'Sanctuary', icon: Home, onClick: () => { navigate('/home'); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100); } },
    { id: 'categories', path: '/categories', label: 'Sessions', icon: LayoutGrid, onClick: handleCategory },
    { id: 'wallet', path: '/wallet', label: 'Wallet', icon: Wallet, onClick: () => navigate('/wallet') },
    { id: 'contact', path: '/contact', label: 'Connect', icon: Mail, onClick: () => navigate('/contact') },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-bg-surface border-t border-border-subtle shadow-soft-lg transition-colors duration-200 md:hidden">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
        {navItems.map((item) => {
          const active = isActive(item.path)
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-3.5 rounded-2xl transition-all duration-200 ${
                active 
                  ? 'bg-sage-light text-sage font-semibold shadow-soft-sm scale-105' 
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}