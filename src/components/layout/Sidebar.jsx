import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { X, Home, Wallet, Mail, User, MessageCircle, ExternalLink } from 'lucide-react'
import { useAuthStore } from '../../store/authStore.js'
import { useWalletStore } from '../../store/walletStore.js'

const NAV_ITEMS = [
  { path: '/home', label: 'Sanctuary Home', icon: Home },
  { path: '/wallet', label: 'Token Wallet', icon: Wallet },
  { path: '/profile', label: 'My Profile', icon: User },
  { path: '/contact', label: 'Support & Contact', icon: Mail },
]

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore(s => s.user)
  const balance = useWalletStore(s => s.balance)

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
        className={`fixed inset-0 bg-black/75 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Sidebar Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-[#151A17] border-l border-[#232B26] z-50 flex flex-col
          transform transition-transform duration-300 ease-out shadow-2xl shadow-black
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-[#232B26]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D4AF6A]" />
            <span className="text-[#F2F4F1] font-serif font-medium text-base tracking-wide">
              Navigation
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9BA5A0] hover:text-[#F2F4F1] hover:bg-[#1C2420] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card inside Sidebar */}
        <div className="p-4 mx-4 mt-4 rounded-2xl bg-[#0C0F0E] border border-[#232B26]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1C2420] border border-[#D4AF6A]/30 flex items-center justify-center text-[#D4AF6A] font-bold text-sm">
              {user?.avatar || '👤'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#F2F4F1] truncate">{user?.fullName || 'Guest Seeker'}</p>
              <p className="text-xs text-[#D4AF6A] font-medium">🪙 {balance} Tokens Available</p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex flex-col gap-1.5 p-4 flex-1 overflow-y-auto">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <button
              key={path}
              onClick={() => handleNavigate(path)}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive(path)
                  ? 'bg-[#1C2420] text-[#D4AF6A] border border-[#D4AF6A]/30 font-semibold'
                  : 'text-[#9BA5A0] hover:text-[#F2F4F1] hover:bg-[#1C2420] border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          ))}

          {/* Quick WhatsApp Guidance Link */}
          <a
            href="https://wa.me/919792390777?text=Hi%2C%20I%20want%20to%20book%20a%20free%20consultation%20session."
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center justify-between px-4 py-3 mt-4 rounded-xl text-xs font-semibold bg-[#1C2420] border border-[#D4AF6A]/20 text-[#D4AF6A] hover:border-[#D4AF6A]/50 transition-all"
          >
            <span className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              WhatsApp Consultation
            </span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        </div>

        {/* Footer info in sidebar */}
        <div className="p-4 border-t border-[#232B26] text-center">
          <p className="text-[11px] text-[#9BA5A0]">Sudershan Mind & Hypnotherapy</p>
          <p className="text-[10px] text-[#6B7570] mt-0.5">v1.0.0 · All Rights Reserved</p>
        </div>
      </div>
    </>
  )
}