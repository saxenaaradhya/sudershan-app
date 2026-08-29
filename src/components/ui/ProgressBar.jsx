import React from 'react'

export default function ProgressBar({ progress = 50, className = '' }) {
  return (
    <div className={`w-full h-1.5 bg-bg-subtle rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-sage rounded-full transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  )
}

