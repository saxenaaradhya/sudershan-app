import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Play, Pause, X, Share2, RotateCcw, RotateCw } from 'lucide-react'
import { CATEGORIES } from '../constants/categories.js'
import { useAuthStore } from '../store/authStore.js'
import { trackEvent } from '../utils/analytics.js'
import Footer from '../components/layout/Footer.jsx'

function BilingualText({ text, en, hi, className = '', titleClassName = 'font-serif text-xl sm:text-2xl font-normal text-[#F2F4F1] leading-snug', subtitleClassName = 'text-xs text-[#D4AF6A] font-hindi font-normal mt-1' }) {
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

export default function ContentPage() {
  const { categoryId, itemId } = useParams()
  const navigate = useNavigate()
  const [playing, setPlaying] = useState(false)
  const user = useAuthStore(s => s.user)
  const [language, setLanguage] = useState(() => localStorage.getItem('audioLang') || 'hi')
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(300)
  const audioRef = useRef(null)

  const category = CATEGORIES.find(c => c.id === decodeURIComponent(categoryId))
  const item = category?.items.find(i => i.id === itemId)

  function selectLanguage(lang) {
    setLanguage(lang)
    localStorage.setItem('audioLang', lang)
    if (audioRef.current) {
      const wasPlaying = playing
      audioRef.current.pause()
      audioRef.current.load()
      if (wasPlaying) {
        audioRef.current.play()
      }
    }
  }

  function togglePlay() {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
      trackEvent('listen', {
        sessionId: itemId,
        sessionTitle: item?.title,
        categoryId: categoryId,
      }, user?.id)
    }
    setPlaying(p => !p)
  }

  function handleSeek(e) {
    const newTime = parseFloat(e.target.value)
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  function skipTime(seconds) {
    if (!audioRef.current) return
    audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds))
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  if (!category || !item) {
    return (
      <div className="min-h-screen bg-[#0C0F0E] text-[#F2F4F1] flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-4xl mb-3">🔍</p>
          <h2 className="text-lg font-bold text-[#F2F4F1] mb-2">Session Not Found</h2>
          <button
            onClick={() => navigate(-1)}
            className="text-xs font-semibold text-[#D4AF6A] hover:underline"
          >
            ← Return to Category
          </button>
        </div>
      </div>
    )
  }

  const audioSrc = language === 'hi' ? item.audioHi : item.audioEn

  return (
    <div className="min-h-screen bg-[#0C0F0E] text-[#F2F4F1] flex flex-col relative overflow-hidden">
      
      {/* Background Ambient Aura */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {item.image && (
          <img
            src={item.image}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-15 scale-125"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C0F0E]/80 via-[#0C0F0E]/95 to-[#0C0F0E]" />
      </div>

      {/* Hidden Audio */}
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(Math.floor(audioRef.current?.duration || 300))}
        onEnded={() => {
          setPlaying(false)
          setTimeout(() => navigate(-1), 1500)
        }}
      />

      {/* Top Bar */}
      <div className="relative z-20 flex items-center justify-between px-5 pt-8 pb-4 max-w-xl mx-auto w-full">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-[#151A17] border border-[#232B26] backdrop-blur-md flex items-center justify-center text-[#9BA5A0] hover:text-white transition-all active:scale-95"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <p className="text-[10px] uppercase tracking-widest text-[#D4AF6A] font-bold">Guided Sanctuary</p>
          <p className="text-xs text-[#9BA5A0] truncate max-w-[200px]">{category.name.split('/')[0]}</p>
        </div>

        {/* Share Action */}
        <button
          onClick={async () => {
            const longUrl = `${window.location.origin}/category/${encodeURIComponent(categoryId)}?item=${itemId}`
            if (navigator.share) {
              try {
                await navigator.share({ title: item.title, text: item.description, url: longUrl })
              } catch {}
            } else {
              navigator.clipboard.writeText(longUrl)
              alert('Session link copied to clipboard!')
            }
          }}
          className="w-10 h-10 rounded-full bg-[#151A17] border border-[#232B26] backdrop-blur-md flex items-center justify-center text-[#9BA5A0] hover:text-white transition-all active:scale-95"
          aria-label="Share"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Player Core Viewport */}
      <main className="relative z-10 flex-1 flex flex-col justify-center max-w-sm sm:max-w-md mx-auto w-full px-6 py-4">
        
        {/* Album Artwork */}
        <div className="relative aspect-square w-full rounded-3xl overflow-hidden border border-[#232B26] shadow-2xl shadow-black/80 mb-6 group mx-auto max-w-[280px] sm:max-w-[320px]">
          <img
            src={item.image || '/images/default-session.jpg'}
            alt={item.title}
            className={`w-full h-full object-cover transition-transform duration-1000 ${
              playing ? 'scale-105' : 'scale-100'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0F0E]/80 via-transparent to-transparent" />

          {/* Meditative Breathing Aura Ring */}
          {playing && (
            <div className="absolute inset-0 border-2 border-[#D4AF6A]/40 rounded-3xl animate-breathe pointer-events-none" />
          )}
        </div>

        {/* Track Info */}
        <div className="text-center mb-5">
          <BilingualText 
            text={item.title}
            titleClassName="font-serif text-xl sm:text-2xl font-normal text-[#F2F4F1] leading-snug"
            subtitleClassName="text-xs text-[#D4AF6A] font-hindi font-normal mt-1"
          />
          <p className="text-xs text-[#9BA5A0] mt-2 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Language Switcher Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex p-1 rounded-full bg-[#151A17] border border-[#232B26]">
            <button
              onClick={() => selectLanguage('hi')}
              className={`px-4 py-1 rounded-full text-xs font-medium transition-all ${
                language === 'hi'
                  ? 'bg-[#D4AF6A] text-[#0C0F0E] font-bold shadow'
                  : 'text-[#9BA5A0] hover:text-[#F2F4F1]'
              }`}
            >
              हिंदी (Hindi)
            </button>
            <button
              onClick={() => selectLanguage('en')}
              className={`px-4 py-1 rounded-full text-xs font-medium transition-all ${
                language === 'en'
                  ? 'bg-[#D4AF6A] text-[#0C0F0E] font-bold shadow'
                  : 'text-[#9BA5A0] hover:text-[#F2F4F1]'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Progress Scrubber */}
        <div className="space-y-1.5 mb-6">
          <input
            type="range"
            min="0"
            max={duration || 300}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-[#232B26] rounded-lg appearance-none cursor-pointer accent-[#D4AF6A]"
          />
          <div className="flex justify-between text-[11px] text-[#9BA5A0] font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <button
            onClick={() => skipTime(-15)}
            className="p-3 rounded-full bg-[#151A17] border border-[#232B26] text-[#9BA5A0] hover:text-[#F2F4F1] active:scale-95 transition-all"
            aria-label="Rewind 15 seconds"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-[#D4AF6A] text-[#0C0F0E] flex items-center justify-center hover:bg-[#C49A4E] active:scale-95 transition-all shadow-xl shadow-[#D4AF6A]/20"
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? (
              <Pause className="w-7 h-7 fill-current" />
            ) : (
              <Play className="w-7 h-7 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={() => skipTime(15)}
            className="p-3 rounded-full bg-[#151A17] border border-[#232B26] text-[#9BA5A0] hover:text-[#F2F4F1] active:scale-95 transition-all"
            aria-label="Forward 15 seconds"
          >
            <RotateCw className="w-5 h-5" />
          </button>
        </div>

      </main>

      <Footer />
    </div>
  )
}