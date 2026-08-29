import React from 'react'

export default function Input({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error = null,
  disabled = false,
  autoComplete = 'off',
  className = '',
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-text-secondary">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm bg-bg-surface border text-text-primary placeholder-text-muted
          focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/15
          disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-soft-sm
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/15' : 'border-border-subtle hover:border-border-sage'}`}
      />
      {error && (
        <p className="text-[11px] text-red-500 dark:text-red-400 mt-0.5">{error}</p>
      )}
    </div>
  )
}
