import React from 'react'

export default function Badge({ label, variant = 'default', className = '' }) {
  const styles = {
    default: 'bg-bg-elevated text-text-secondary border-border-subtle',
    sage: 'bg-sage-light text-sage border-border-sage font-semibold',
    champagne: 'bg-champagne-surface text-text-primary border-border-champagne font-semibold',
    free: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 font-semibold',
  }[variant] || 'bg-bg-elevated text-text-secondary border-border-subtle'

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] tracking-wide border uppercase ${styles} ${className}`}>
      {label}
    </span>
  )
}

