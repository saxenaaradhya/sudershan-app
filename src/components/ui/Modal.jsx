import React, { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ isOpen, onClose, title, children, image }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/75 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="relative bg-bg-surface border border-border-subtle rounded-3xl w-full max-w-md shadow-soft-lg z-10 overflow-hidden text-text-primary">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-bg-elevated/30">
          <h2 className="text-base font-semibold text-text-primary tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors p-1.5 rounded-full hover:bg-bg-elevated"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {image && (
          <img src={image} alt="modal banner" className="w-full h-48 object-cover" />
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
