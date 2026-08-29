import React, { useEffect } from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const styles = {
    success: {
      bg: 'bg-bg-surface border-border-sage text-text-primary shadow-soft-lg',
      icon: <CheckCircle className="w-5 h-5 text-sage shrink-0" />,
      text: 'text-text-primary',
    },
    error: {
      bg: 'bg-bg-surface border-red-500/20 text-text-primary shadow-soft-lg',
      icon: <XCircle className="w-5 h-5 text-red-500 shrink-0" />,
      text: 'text-text-primary',
    },
    info: {
      bg: 'bg-bg-surface border-border-champagne text-text-primary shadow-soft-lg',
      icon: <Info className="w-5 h-5 text-champagne shrink-0" />,
      text: 'text-text-primary',
    },
  }

  const s = styles[type] || styles.info

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border backdrop-blur-md
        ${s.bg} max-w-sm w-full transition-all animate-fade-in`}
    >
      {s.icon}
      <span className={`text-xs sm:text-sm font-medium flex-1 ${s.text}`}>{message}</span>
      <button
        onClick={onClose}
        className="text-text-muted hover:text-text-primary transition-colors shrink-0 p-1"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
