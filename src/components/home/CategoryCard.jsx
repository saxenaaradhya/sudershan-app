import React from 'react'
import { Lock, Sparkles } from 'lucide-react'
import BilingualText from '../ui/BilingualText.jsx'

export default function CategoryCard({ category, onClick }) {
  const isComingSoon = category.comingSoon

  return (
    <div
      onClick={!isComingSoon ? onClick : undefined}
      className={`group relative h-48 sm:h-60 rounded-2xl overflow-hidden border border-[#1E2722] bg-[#131916] transition-all duration-300 ${
        isComingSoon 
          ? 'opacity-65 cursor-not-allowed' 
          : 'cursor-pointer hover:border-[#D8B168]/50 hover:shadow-xl hover:shadow-black/50 hover:-translate-y-1'
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

      {/* Bottom dark gradient scrim for text readability (leaves top half of image completely clear) */}
      <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-[#0B0E0D] via-[#0B0E0D]/80 to-transparent" />

      {/* Top badges */}
      <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
        {category.items?.length > 0 && !isComingSoon && (
          <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md bg-[#0B0E0D]/75 backdrop-blur-md border border-[#1E2722] text-[#D8B168]">
            {category.items.length} Sessions
          </span>
        )}

        {isComingSoon && (
          <div className="ml-auto px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 flex items-center gap-1.5 shadow-md">
            <Lock className="w-3 h-3 text-[#D8B168]" />
            <span className="text-[10px] uppercase font-bold text-[#A2ACA6] tracking-wider">Coming Soon</span>
          </div>
        )}
      </div>

      {/* Bottom text block with Bilingual component */}
      <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-4 z-10">
        <BilingualText 
          text={category.name} 
          titleClassName="text-sm sm:text-base font-semibold text-[#F5F5F0] leading-tight group-hover:text-[#D8B168] transition-colors"
          subtitleClassName="text-[11px] sm:text-xs text-[#A2ACA6] font-hindi font-normal mt-0.5 line-clamp-1"
        />
      </div>
    </div>
  )
}

