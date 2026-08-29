import React from 'react'
import { Lock, Unlock, Play } from 'lucide-react'
import BilingualText from './BilingualText.jsx'

export default function SessionCard({
  track,
  trackNumber = 1,
  isUnlocked = false,
  isHighlighted = false,
  onAccess,
  className = '',
}) {
  return (
    <div
      onClick={onAccess}
      className={`group relative rounded-3xl overflow-hidden border p-4 sm:p-5 bg-bg-surface cursor-pointer transition-all duration-200 shadow-soft-sm ${
        isHighlighted
          ? 'border-sage bg-sage-light/30 shadow-soft'
          : 'border-border-subtle hover:border-border-sage hover:bg-bg-elevated'
      } ${className}`}
    >
      <div className="flex items-center gap-4">
        {/* Thumbnail */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border border-border-subtle bg-bg-base">
          <img
            src={track.image || '/images/default-session.jpg'}
            alt={track.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {!isUnlocked && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
              <Lock className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-sage uppercase tracking-wider">
              Track {trackNumber}
            </span>
            {isUnlocked ? (
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-sage-light border border-border-sage text-sage font-semibold">
                Unlocked
              </span>
            ) : track.free ? (
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-champagne-surface border border-border-champagne text-text-primary font-semibold">
                Free
              </span>
            ) : (
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-bg-elevated border border-border-subtle text-text-secondary font-mono font-medium">
                🪙 {track.tokenCost || 2} Tokens
              </span>
            )}
          </div>

          <BilingualText
            text={track.title}
            titleClassName="text-sm sm:text-base font-semibold text-text-primary truncate group-hover:text-sage transition-colors"
            subtitleClassName="text-xs text-text-secondary font-hindi truncate mt-0.5"
          />

          <p className="text-xs text-text-secondary line-clamp-1 mt-1">
            {track.description}
          </p>
        </div>

        {/* Action button */}
        <div className="shrink-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isUnlocked
              ? 'bg-sage text-white group-hover:scale-105 shadow-soft'
              : 'bg-bg-elevated text-text-primary border border-border-subtle group-hover:border-border-sage group-hover:scale-105 shadow-soft-sm'
          }`}>
            {isUnlocked ? (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            ) : (
              <Unlock className="w-4 h-4 text-text-secondary" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

