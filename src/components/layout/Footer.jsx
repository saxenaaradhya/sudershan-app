import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, LayoutGrid, Wallet, Mail } from 'lucide-react'

export default function Footer() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

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

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#151A17]/95 backdrop-blur-md border-t border-[#232B26]">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">

        {/* Home */}
        <button
          onClick={() => {
            navigate('/home')
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
          }}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all ${
            isActive('/home') 
              ? 'text-[#D4AF6A]' 
              : 'text-[#9BA5A0] hover:text-[#F2F4F1]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight">Sanctuary</span>
        </button>

        {/* Category */}
        <button
          onClick={handleCategory}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all ${
            location.pathname.startsWith('/category') 
              ? 'text-[#D4AF6A]' 
              : 'text-[#9BA5A0] hover:text-[#F2F4F1]'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight">Sessions</span>
        </button>

        {/* Wallet */}
        <button
          onClick={() => navigate('/wallet')}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all ${
            isActive('/wallet') 
              ? 'text-[#D4AF6A]' 
              : 'text-[#9BA5A0] hover:text-[#F2F4F1]'
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight">Wallet</span>
        </button>

        {/* Contact */}
        <button
          onClick={() => navigate('/contact')}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all ${
            isActive('/contact') 
              ? 'text-[#D4AF6A]' 
              : 'text-[#9BA5A0] hover:text-[#F2F4F1]'
          }`}
        >
          <Mail className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight">Connect</span>
        </button>

      </div>
    </nav>
  )
}