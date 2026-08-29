import React from 'react'

export default function FilterPill({ label, icon: Icon, active, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs whitespace-nowrap transition-all duration-200 shadow-soft-sm ${
        active
          ? 'bg-sage text-white font-semibold shadow-soft'
          : 'bg-bg-surface text-text-secondary border border-border-subtle hover:border-border-sage hover:text-text-primary'
      } ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      <span>{label}</span>
    </button>
  )
}

