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
        <label htmlFor={id} className="text-xs font-medium text-[#9BA5A0]">
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
        className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm bg-[#0C0F0E] border text-[#F2F4F1] placeholder-[#6B7570]
          focus:outline-none focus:border-[#D4AF6A]/70 focus:ring-1 focus:ring-[#D4AF6A]/30
          disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
          ${error ? 'border-red-500' : 'border-[#232B26] hover:border-[#2D3831]'}`}
      />
      {error && (
        <p className="text-[11px] text-red-400 mt-0.5">{error}</p>
      )}
    </div>
  )
}
