import React from 'react'
import { Lock } from 'lucide-react'
import BilingualText from '../ui/BilingualText.jsx'

export default function CategoryCard({ category, onClick }) {
  const isComingSoon = category.comingSoon

  return (
    <div
      onClick={!isComingSoon ? onClick : undefined}
      className={`group relative h-52 sm:h-64 rounded-3xl overflow-hidden border border-border-subtle bg-bg-surface transition-all duration-300 ${
        isComingSoon 
          ? 'opacity-60 cursor-not-allowed' 
          : 'cursor-pointer hover:border-border-sage hover:shadow-soft-lg hover:-translate-y-1'
      }`}
    >
      {/* Category Image with smooth zoom on hover */}
      {category.image && (
        <img
          src={category.image}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      )}

      {/* Multi-layered refined gradient scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />

      {/* Top badges */}
      <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between z-10">
        {category.items?.length > 0 && !isComingSoon && (
          <span className="text-[10px] font-medium tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md text-text-primary shadow-soft-sm">
            {category.items.length} Sessions
          </span>
        )}

        {isComingSoon && (
          <div className="ml-auto px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 flex items-center gap-1.5 shadow-soft-sm">
            <Lock className="w-3 h-3 text-champagne" />
            <span className="text-[10px] uppercase font-medium text-white/80 tracking-wider">Coming Soon</span>
          </div>
        )}
      </div>

      {/* Bottom text block with Bilingual component */}
      <div className="absolute bottom-0 inset-x-0 p-4 z-10">
        <BilingualText 
          text={category.name} 
          titleClassName="text-sm sm:text-base font-semibold text-white leading-tight group-hover:text-champagne transition-colors"
          subtitleClassName="text-[11px] sm:text-xs text-white/80 font-hindi font-normal mt-0.5 line-clamp-1"
        />
      </div>
    </div>
  )
}
