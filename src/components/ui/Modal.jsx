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
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="relative bg-[#151A17] border border-[#232B26] rounded-3xl w-full max-w-md shadow-2xl z-10 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#232B26]">
          <h2 className="text-base font-semibold text-[#F2F4F1]">{title}</h2>
          <button
            onClick={onClose}
            className="text-[#9BA5A0] hover:text-white transition-colors p-1.5 rounded-full hover:bg-[#1C2420]"
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
