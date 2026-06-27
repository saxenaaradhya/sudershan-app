import React, { useEffect } from 'react'
import { X } from 'lucide-react'

export default function WelcomePopup({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup */}
      <div className="relative z-10 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center
            rounded-full bg-black/50 text-white hover:bg-black/80 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Placeholder image — replace src with your real image URL */}
        <img
          src="https://placehold.co/600x400/1a1a2e/a78bfa?text=Welcome+to+TokenApp&font=montserrat"
          alt="Welcome"
          className="w-full object-cover"
        />

      </div>
    </div>
  )
}