import React from 'react'

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  className = '',
}) {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0C0F0E] disabled:opacity-50 disabled:cursor-not-allowed active:scale-98'

  const variants = {
    primary:
      'bg-[#D4AF6A] hover:bg-[#C49A4E] text-[#0C0F0E] font-bold focus:ring-[#D4AF6A] shadow-md',
    secondary:
      'bg-[#1C2420] hover:bg-[#232B26] text-[#F2F4F1] border border-[#232B26] focus:ring-[#232B26]',
    ghost:
      'bg-transparent hover:bg-[#151A17] text-[#9BA5A0] hover:text-[#F2F4F1] focus:ring-[#232B26]',
    danger:
      'bg-[#DC2626] hover:bg-[#B91C1C] text-white focus:ring-[#DC2626] shadow-md',
    outline:
      'bg-transparent border border-[#D4AF6A]/50 text-[#D4AF6A] hover:bg-[#D4AF6A]/10 focus:ring-[#D4AF6A]',
  }

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-xs sm:text-sm',
    lg: 'px-6 py-3 text-sm sm:text-base',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  )
}
