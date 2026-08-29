import React from 'react'

/**
 * Clean bilingual text renderer (English / Hindi) with theme typography
 */
export default function BilingualText({ 
  text, 
  en, 
  hi, 
  className = '', 
  titleClassName = 'text-sm sm:text-base font-semibold text-text-primary leading-tight', 
  subtitleClassName = 'text-xs text-text-secondary font-hindi font-normal mt-0.5' 
}) {
  let primary = en
  let secondary = hi

  if (text && (!primary || !secondary)) {
    if (text.includes('/')) {
      const parts = text.split('/')
      primary = parts[0]?.trim()
      secondary = parts.slice(1).join('/')?.trim()
    } else {
      primary = text
    }
  }

  return (
    <div className={`flex flex-col leading-tight ${className}`}>
      <span className={titleClassName}>{primary}</span>
      {secondary && (
        <span className={subtitleClassName}>{secondary}</span>
      )}
    </div>
  )
}
