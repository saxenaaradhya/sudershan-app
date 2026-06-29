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
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-dark-500">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center
            rounded-full bg-black/60 text-white hover:bg-black/90 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative cursor-pointer" onClick={handleInvite}>
          <img src="/images/categories/pop.png" alt="Welcome" className="w-full object-contain" />
        </div>
      </div>
    </div>
  )
}