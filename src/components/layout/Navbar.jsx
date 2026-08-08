import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Wallet, User, Menu } from 'lucide-react'
import { useWalletStore } from '../../store/walletStore.js'
import { useAuthStore } from '../../store/authStore.js'
import Sidebar from './Sidebar.jsx'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const balance = useWalletStore(s => s.balance)
  const user = useAuthStore(s => s.user)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 glass border-b border-dark-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Profile (icon in a box, greeting text outside) */}
<div className="flex items-center gap-2">
  <button
    onClick={() => navigate('/profile')}
    className={`flex items-center justify-center p-2 sm:p-2.5 rounded-xl
      transition-all duration-200 border
      ${isActive('/profile')
        ? 'bg-brand-primary/20 border-brand-primary/50 text-brand-accent'
        : 'bg-dark-700 border-dark-500 text-gray-300 hover:text-white hover:bg-dark-600 hover:border-dark-400'
      }`}
  >
    {user?.avatar ? (
      <div className="w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center text-xs font-bold text-white shrink-0">
        {user.avatar}
      </div>
    ) : (
      <User className="w-4 h-4" />
    )}
  </button>
  <span className="text-sm font-semibold text-gray-200">
    Hi, {user?.fullName?.split(' ')[0] || 'User'}
  </span>
</div>

          {/* Right side: Wallet + Hamburger */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-2 sm:px-3 rounded-xl text-sm
              bg-dark-700 border border-dark-500">
              <Wallet className="w-4 h-4 shrink-0 text-gray-400" />
              <span className="text-brand-accent font-bold text-xs sm:text-sm">🪙 {balance}</span>
            </div>

            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2.5 rounded-xl bg-dark-700 border border-dark-500 text-gray-300
                hover:text-white hover:bg-dark-600 hover:border-dark-400 transition-all duration-200"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

        </div>
      </nav>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  )
}