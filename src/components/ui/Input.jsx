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
        <label htmlFor={id} className="text-sm font-medium text-gray-300">
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
        className={`w-full px-4 py-3 rounded-xl text-sm bg-dark-700 border text-white placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
          ${error ? 'border-red-500' : 'border-dark-400 hover:border-dark-300'}`}
      />
      {error && (
        <p className="text-xs text-red-400 mt-0.5">{error}</p>
      )}
    </div>
  )
}
