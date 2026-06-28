import React, { useEffect } from 'react'
import { X, Zap } from 'lucide-react'

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

      {/* Popup card */}
      <div className="relative z-10 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-dark-500">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center
            rounded-full bg-black/60 text-white hover:bg-black/90 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {
         <img src="/images/categories/pop.png" alt="Welcome" className="w-full rounded-t-2xl" />
        }
        <div className="w-full h-64 bg-gradient-to-br from-violet-900 via-purple-900 to-dark-900
          flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-primary shadow-2xl shadow-brand-primary/40
            flex items-center justify-center">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <div className="text-center px-6">
            <p className="text-white text-xl font-bold mb-1">Welcome to TokenApp!</p>
            <p className="text-purple-300 text-sm">Your image banner goes here</p>
          </div>
        </div>

      </div>
    </div>
  )
}