import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Play, Pause,  X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { CATEGORIES } from '../constants/categories.js'
import Footer from '../components/layout/Footer.jsx'

function CountdownTimer({ onEnd }) {
  const [seconds, setSeconds] = React.useState(5 * 60)

  useEffect(() => {
    if (seconds <= 0) { onEnd(); return }
    const interval = setInterval(() => setSeconds(s => s - 1), 1000)
    return () => clearInterval(interval)
  }, [seconds])

  const mins = String(Math.floor(seconds / 60)).padStart(2, '0')
  const secs = String(seconds % 60).padStart(2, '0')

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Outer glow ring */}
      <div className="w-52 h-52 rounded-full flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 60%, transparent 100%)',
          boxShadow: '0 0 60px rgba(255,255,255,0.2), 0 0 120px rgba(255,255,255,0.1)',
          border: '2px solid rgba(255,255,255,0.2)'
        }}
      >
        <div className="text-center">
          <p className="text-6xl font-black text-white tracking-tight"
            style={{ fontVariantNumeric: 'tabular-nums' }}>
            {mins}:{secs}
          </p>
          <p className="text-white/50 text-xs mt-1 uppercase tracking-widest">remaining</p>
        </div>
      </div>
    </div>
  )
}
export default function ContentPage() {
  const { categoryId, itemId } = useParams()
  const navigate = useNavigate()
  const [playing, setPlaying] = useState(false)

  const category = CATEGORIES.find(c => c.id === categoryId)
  const item = category?.items.find(i => i.id === itemId)

  if (!category || !item) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-xl font-bold text-white mb-2">Content not found</p>
          <button
            onClick={() => navigate(-1)}
            className="text-brand-accent hover:text-white transition-colors text-sm"
          >
            ← Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col relative overflow-hidden">

      {/* Full screen background image */}
      {item.image && (
        <img
          src={item.image}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Dark gradient overlay — stronger at bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/90" />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-12 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
        <p className="text-xs text-white/60 uppercase tracking-widest font-medium">Now Playing</p>
        <button className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all">
        </button>
      </div>

      {/* Spacer to push content to bottom */}
      <div className="flex-1" />

      {/* Bottom content overlay */}
      <div className="relative z-10 px-6 pb-32">

        {/* Category tag */}
        <div className="mb-3">
          <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">
            {category.name}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-black text-white leading-tight mb-3"
          style={{ fontStyle: 'italic' }}>
          {item.title}
        </h1>

        {/* Description */}
        <p className="text-sm text-white/60 leading-relaxed mb-6"> 
          {item.description}
        </p>

        {/* Countdown Timer */}
        {playing && (
          <div className="fixed inset-0 flex items-center justify-center z-20 pointer-events-none">
            <CountdownTimer onEnd={() => setPlaying(false)} />
          </div>
        )}

        {/* Play Now button + close */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => setPlaying(p => !p)}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full
              bg-white text-dark-900 font-bold text-sm hover:bg-gray-100 transition-all
              shadow-2xl"
          >
            {playing ? (
              <>
                <Pause className="w-5 h-5" /> Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5" /> Play Now
              </>
            )}
          </button>

          <button className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all">
          </button>
        </div>

      </div>

      <Footer />
    </div>
  )
}