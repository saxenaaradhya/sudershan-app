import React, { useEffect } from 'react'
import { X, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function WelcomePopup({ isOpen, onClose }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  function handleInvite() {
    onClose()
    navigate('/profile')
    setTimeout(() => {
      document.getElementById('refer-section')?.scrollIntoView({ behavior: 'smooth' })
    }, 300)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl bg-[#131916] border border-[#D8B168]/30">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center
            rounded-full bg-black/70 text-[#A2ACA6] hover:text-white hover:bg-black transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative cursor-pointer" onClick={handleInvite}>
          <img src="/images/categories/pop.png" alt="Welcome Gift" className="w-full object-contain" />
        </div>

        <div className="p-4 text-center bg-[#131916]">
          <button
            onClick={handleInvite}
            className="w-full py-2.5 rounded-xl bg-[#D8B168] text-[#0B0E0D] font-bold text-xs hover:bg-[#E5C27E] transition-all"
          >
            Claim Referral Benefits
          </button>
        </div>
      </div>
    </div>
  )
}