import React from 'react'
import { Search } from 'lucide-react'

export default function EmptyState({ 
  icon: Icon = Search, 
  title = "No journeys found", 
  message = "Try selecting another filter or searching for anxiety, sleep, or deep meditation.",
  className = ''
}) {
  return (
    <div className={`text-center py-16 px-6 rounded-3xl bg-bg-surface border border-border-subtle shadow-soft ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-bg-elevated border border-border-subtle flex items-center justify-center text-text-muted mx-auto mb-3">
        <Icon className="w-6 h-6 stroke-[1.5]" />
      </div>
      <h3 className="text-sm font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-xs text-text-secondary max-w-xs mx-auto leading-relaxed">{message}</p>
    </div>
  )
}

