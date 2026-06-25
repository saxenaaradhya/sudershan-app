import { useNavigate, useLocation } from 'react-router-dom'
import { Wallet, User, Zap, Sun, Moon } from 'lucide-react'
import { useWalletStore } from '../../store/walletStore.js'
import { useAuthStore } from '../../store/authStore.js'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const balance = useWalletStore(s => s.balance)
  const user = useAuthStore(s => s.user)

  

  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass border-b border-dark-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/40">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white group-hover:text-brand-accent transition-colors">
            SUDERSHAN
          </span>
        </button>

        <div className="flex items-center gap-2">

          {/* Wallet Button */}
          {/* Wallet Display (non-clickable) */}
          <div className="flex items-center gap-1.5 px-2.5 py-2 sm:px-3 rounded-xl text-sm
            bg-dark-700 border border-dark-500">
            <Wallet className="w-4 h-4 shrink-0 text-gray-400" />
            <span className="text-brand-accent font-bold text-xs sm:text-sm">🪙 {balance}</span>
          </div>

          {/* Profile Button */}
          <button
            onClick={() => navigate('/profile')}
            className={`flex items-center gap-1.5 px-2.5 py-2 sm:px-3 rounded-xl text-sm font-semibold
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
            <span className="hidden sm:block">{user?.fullName?.split(' ')[0] || 'Profile'}</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
