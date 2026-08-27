import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Coins, User, Menu } from 'lucide-react'
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
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#151A17]/90 backdrop-blur-md border-b border-[#232B26]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Left: User Profile Avatar & Greeting */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/profile')}
              className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full
                transition-all duration-200 border
                ${isActive('/profile')
                  ? 'bg-[#1C2420] border-[#D4AF6A] text-[#D4AF6A]'
                  : 'bg-[#151A17] border-[#232B26] text-[#9BA5A0] hover:text-[#F2F4F1] hover:border-[#D4AF6A]/40'
                }`}
              aria-label="Profile"
            >
              {user?.avatar ? (
                <span className="text-xs sm:text-sm font-bold text-[#D4AF6A]">
                  {user.avatar}
                </span>
              ) : (
                <User className="w-4 h-4 text-[#9BA5A0]" />
              )}
            </button>

            <div className="flex flex-col">
              <span className="text-[10px] text-[#9BA5A0] uppercase tracking-wider font-medium">Namaste</span>
              <span className="text-xs sm:text-sm font-semibold text-[#F2F4F1] leading-none">
                {user?.fullName?.split(' ')[0] || 'Seeker'}
              </span>
            </div>
          </div>

          {/* Center Brand Identity (on larger screens) */}
          <div 
            onClick={() => navigate('/home')}
            className="hidden md:flex flex-col items-center cursor-pointer select-none"
          >
            <span className="font-serif text-lg text-[#F2F4F1] tracking-wider font-semibold">
              SUDERSHAN
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[#D4AF6A] font-medium">
              Mind & Soul Healing
            </span>
          </div>

          {/* Right: Token Counter & Hamburger */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate('/wallet')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                bg-[#1C2420] border border-[#D4AF6A]/30 hover:border-[#D4AF6A]/70 text-[#D4AF6A]
                transition-all duration-200 shadow-sm active:scale-95"
            >
              <Coins className="w-3.5 h-3.5 text-[#D4AF6A]" />
              <span>{balance}</span>
              <span className="hidden sm:inline font-normal text-[#9BA5A0]">Tokens</span>
            </button>

            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 sm:p-2.5 rounded-xl bg-[#151A17] border border-[#232B26] text-[#9BA5A0]
                hover:text-[#F2F4F1] hover:bg-[#1C2420] hover:border-[#232B26] transition-all duration-200"
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