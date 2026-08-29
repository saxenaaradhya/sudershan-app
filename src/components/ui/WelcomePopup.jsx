import React, { useEffect } from 'react'
import { X } from 'lucide-react'
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
        className="absolute inset-0 bg-black/50 dark:bg-black/75 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-sm rounded-3xl overflow-hidden shadow-soft-lg bg-bg-surface border border-border-subtle">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center
            rounded-full bg-black/50 text-white/80 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative cursor-pointer" onClick={handleInvite}>
          <img src="/images/categories/pop.png" alt="Welcome Gift" className="w-full object-contain" />
        </div>

        <div className="p-4 text-center bg-bg-surface border-t border-border-subtle">
          <button
            onClick={handleInvite}
            className="w-full py-3 rounded-2xl bg-sage hover:bg-sage-hover text-white font-semibold text-xs active:scale-[0.98] transition-all shadow-soft"
          >
            Claim Referral Benefits (+20 🪙)
          </button>
        </div>
      </div>
    </div>
  )
}