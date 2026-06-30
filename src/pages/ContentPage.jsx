import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Play, Pause, X, Settings, Check } from 'lucide-react'
import { CATEGORIES } from '../constants/categories.js'
import Footer from '../components/layout/Footer.jsx'

function CountdownTimer({ onEnd, duration, playing }) {
  const [seconds, setSeconds] = React.useState(duration)

useEffect(() => {
  setSeconds(duration)
}, [duration])

  useEffect(() => {
    if (!playing) return
    if (seconds <= 0) { onEnd(); return }
    const interval = setInterval(() => setSeconds(s => s - 1), 1000)
    return () => clearInterval(interval)
  }, [seconds, playing])

  const mins = String(Math.floor(seconds / 60)).padStart(2, '0')
  const secs = String(seconds % 60).padStart(2, '0')

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-52 h-52 rounded-full flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 60%, transparent 100%)',
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
  const [language, setLanguage] = useState(() => localStorage.getItem('audioLang') || 'en')
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [audioDuration, setAudioDuration] = useState(300)
  const audioRef = useRef(null)

  const category = CATEGORIES.find(c => c.id === decodeURIComponent(categoryId))
  const item = category?.items.find(i => i.id === itemId)

  function selectLanguage(lang) {
    setLanguage(lang)
    localStorage.setItem('audioLang', lang)
    setShowLangMenu(false)
    if (audioRef.current) {
      const wasPlaying = playing
      audioRef.current.pause()
      audioRef.current.load()
      if (wasPlaying) audioRef.current.play()
    }
  }

  function togglePlay() {
  if (!audioRef.current) return
  if (playing) {
    audioRef.current.pause()
  } else {
    audioRef.current.play()
  }
  setPlaying(p => !p)
}

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

  const audioSrc = language === 'hi' ? item.audioHi : item.audioEn

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col relative overflow-hidden">

      {item.image && (
        <img
          src={item.image}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/90" />

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={audioSrc}
        onEnded={() => {
        setPlaying(false)
        setTimeout(() => navigate(-1), 1500)
        }}
        onLoadedMetadata={() => setAudioDuration(Math.floor(audioRef.current?.duration || 300))}
      />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-12 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all"
        >
          <X className="w-4 h-4" style={{ color: '#ffffff' }} />
        </button>
        <p className="text-xs text-white/60 uppercase tracking-widest font-medium">Now Playing</p>

        <div className="relative">
          <button
            onClick={() => setShowLangMenu(s => !s)}
            className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <Settings className="w-4 h-4" style={{ color: '#FFFFFF' }} />
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-dark-800 border border-dark-500 rounded-xl shadow-2xl overflow-hidden z-30">
              <button
                onClick={() => selectLanguage('en')}
                className="w-full flex items-center justify-between px-4 py-3 text-sm text-white hover:bg-dark-700 transition-colors"
              >
                English
                {language === 'en' && <Check className="w-4 h-4 text-brand-accent" />}
              </button>
              <button
                onClick={() => selectLanguage('hi')}
                className="w-full flex items-center justify-between px-4 py-3 text-sm text-white hover:bg-dark-700 transition-colors border-t border-dark-600"
              >
                हिंदी (Hindi)
                {language === 'hi' && <Check className="w-4 h-4 text-brand-accent" />}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1" />

      <div className="relative z-10 px-6 pb-32">

        <div className="mb-3">
          <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">
            {category.name}
          </span>
        </div>

        <h1 className="text-3xl font-black text-white leading-tight mb-3"
          style={{ fontStyle: 'italic' }}>
          {item.title}
        </h1>

        <p className="text-sm text-white/60 leading-relaxed mb-6">
          {item.description}
        </p>

        <div className={`fixed inset-0 flex items-center justify-center z-20 pointer-events-none transition-opacity ${playing ? 'opacity-100' : 'opacity-0'}`}>
          <CountdownTimer
          duration={audioDuration}
          onEnd={() => { setPlaying(false); audioRef.current?.pause() }}
           playing={playing}
         />
         </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="w-5 h-5" style={{ color: '#FFFFFF' }} />
          </button>

          <button
            onClick={togglePlay}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full
              bg-green-500 text-white font-bold text-sm hover:bg-green-600 transition-all
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

        </div>

      </div>

      <Footer />
    </div>
  )
}