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
      bg: 'bg-emerald-900/90 border-emerald-700',
      icon: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
      text: 'text-emerald-100',
    },
    error: {
      bg: 'bg-red-900/90 border-red-700',
      icon: <XCircle className="w-5 h-5 text-red-400 shrink-0" />,
      text: 'text-red-100',
    },
    info: {
      bg: 'bg-blue-900/90 border-blue-700',
      icon: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
      text: 'text-blue-100',
    },
  }

  const s = styles[type] || styles.info

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl
        ${s.bg} max-w-sm w-full animate-fade-in`}
    >
      {s.icon}
      <span className={`text-sm font-medium flex-1 ${s.text}`}>{message}</span>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-white transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
