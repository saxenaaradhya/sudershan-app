import React from 'react'

export default function Card({ children, className = '', onClick, highlight = false }) {
  const clickable = typeof onClick === 'function'
  return (
    <div
      onClick={onClick}
      className={`sanctuary-card rounded-3xl p-5 sm:p-6 transition-all duration-300
        ${highlight 
          ? 'border-border-champagne bg-champagne-surface/30' 
          : 'hover:border-border-sage hover:shadow-soft'
        }
        ${clickable ? 'cursor-pointer active:scale-[0.99]' : ''}
        ${className}`}
    >
      {children}
    </div>
  )
}
