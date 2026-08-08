import { useNavigate, useLocation } from 'react-router-dom'
import { X, Home, Grid, Wallet, Mail } from 'lucide-react'

const NAV_ITEMS = [
  { path: '/home', label: 'Home', icon: Home },
  { path: '/category', label: 'Category', icon: Grid },
  { path: '/wallet', label: 'Wallet', icon: Wallet },
  { path: '/contact', label: 'Contact', icon: Mail },
]

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const handleNavigate = (path) => {
    navigate(path)
    onClose()
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-dark-800 border-l border-dark-600 z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-dark-600">
          <span className="text-white font-semibold text-lg">Menu</span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-dark-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-1 p-3">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <button
              key={path}
              onClick={() => handleNavigate(path)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${isActive(path)
                  ? 'bg-brand-primary/20 text-brand-accent border border-brand-primary/50'
                  : 'text-gray-300 hover:text-white hover:bg-dark-700 border border-transparent'
                }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}