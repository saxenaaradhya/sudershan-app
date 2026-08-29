import React from 'react'

export default function SectionHeader({ title, subtitle, actionText, onAction, count, className = '' }) {
  return (
    <div className={`flex items-end justify-between mb-4 ${className}`}>
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-text-primary tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-text-secondary mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {count !== undefined && (
          <span className="text-xs text-text-secondary font-mono font-medium">
            {count}
          </span>
        )}
        {actionText && (
          <button
            onClick={onAction}
            className="text-xs font-semibold text-sage hover:underline transition-colors shrink-0"
          >
            {actionText}
          </button>
        )}
      </div>
    </div>
  )
}

