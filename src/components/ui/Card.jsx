import React from 'react'

export default function Card({ children, className = '', onClick }) {
  const clickable = typeof onClick === 'function'
  return (
    <div
      onClick={onClick}
      className={`bg-dark-800 border border-dark-600 rounded-2xl
        ${clickable ? 'cursor-pointer hover:border-brand-primary/50 hover:bg-dark-700 transition-all duration-200' : ''}
        ${className}`}
    >
      {children}
    </div>
  )
}
