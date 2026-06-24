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
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-brand-primary hover:bg-brand-secondary text-white focus:ring-brand-primary shadow-lg shadow-brand-primary/25',
    secondary:
      'bg-dark-600 hover:bg-dark-500 text-white border border-dark-400 focus:ring-dark-400',
    ghost:
      'bg-transparent hover:bg-dark-700 text-gray-300 hover:text-white focus:ring-dark-400',
    danger:
      'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-lg shadow-red-600/25',
    outline:
      'bg-transparent border border-brand-primary text-brand-accent hover:bg-brand-primary/10 focus:ring-brand-primary',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
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
