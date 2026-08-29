import React from 'react'

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary' (sage) | 'secondary' | 'champagne' | 'ghost' | 'outline' | 'danger'
  size = 'md',
  disabled = false,
  fullWidth = false,
  className = '',
}) {
  const base =
    'inline-flex items-center justify-center font-medium rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-base disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]'

  const variants = {
    primary:
      'bg-sage hover:bg-sage-hover text-white shadow-soft font-semibold focus:ring-sage',
    secondary:
      'bg-bg-elevated hover:bg-bg-subtle text-text-primary border border-border-subtle focus:ring-border-subtle hover:border-border-sage',
    champagne:
      'bg-champagne/15 hover:bg-champagne/25 text-text-primary border border-border-champagne focus:ring-champagne',
    ghost:
      'bg-transparent hover:bg-sage-surface text-text-secondary hover:text-text-primary focus:ring-border-subtle',
    danger:
      'bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 focus:ring-red-500',
    outline:
      'bg-transparent border border-border-sage text-sage hover:bg-sage-surface focus:ring-sage',
  }

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs rounded-xl gap-1.5',
    md: 'px-5 py-2.5 text-xs sm:text-sm rounded-2xl gap-2',
    lg: 'px-6 py-3 text-sm sm:text-base rounded-2xl gap-2.5',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  )
}
