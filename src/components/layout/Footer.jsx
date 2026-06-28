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
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-dark-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        <button
          onClick={() => {
            navigate('/home')
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
          }}
          className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors
            ${isActive('/home') ? 'text-brand-accent' : 'text-white hover:text-white'}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px] font-medium">Home</span>
        </button>

        <button
           onClick={handleCategory}
            className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors
              ${location.pathname.startsWith('/category') ? 'text-brand-accent' : 'text-white'}`}
        >
            <LayoutGrid className="w-5 h-5" />
           <span className="text-[11px] font-medium">Category</span>
         </button>

        <button
          onClick={() => navigate('/wallet')}
          className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors
            ${isActive('/wallet') ? 'text-brand-accent' : 'text-white hover:text-white'}`}
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[11px] font-medium">Wallet</span>
        </button>

        <button
          onClick={() => navigate('/contact')}
          className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors
            ${isActive('/contact') ? 'text-brand-accent' : 'text-white hover:text-white'}`}
        >
          <Mail className="w-5 h-5" />
          <span className="text-[11px] font-medium">Contact</span>
        </button>

      </div>
    </nav>
  )
}