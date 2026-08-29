import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Play, Pause, X, Share2, RotateCcw, RotateCw, Sparkles, Moon, Clock, Volume2 } from 'lucide-react'
import { CATEGORIES } from '../constants/categories.js'
import { useAuthStore } from '../store/authStore.js'
import { trackEvent } from '../utils/analytics.js'
import BilingualText from '../components/ui/BilingualText.jsx'
import Modal from '../components/ui/Modal.jsx'
import Toast from '../components/ui/Toast.jsx'
import Footer from '../components/layout/Footer.jsx'

const AFFIRMATIONS = [
  { en: "My breath is steady, my mind is still, I am completely safe.", hi: "मेरी सांसें शांत हैं, मेरा मन स्थिर है, मैं पूरी तरह सुरक्षित हूँ।" },
  { en: "I release all tension and invite deep, restorative peace into my body.", hi: "मैं सारा तनाव छोड़ता हूँ और अपने शरीर में गहरी शांति को आमंत्रित करता हूँ।" },
  { en: "With every breath, my subconscious mind aligns with wellness and clarity.", hi: "हर सांस के साथ, मेरा अवचेतन मन स्वास्थ्य और स्पष्टता के साथ संरेखित होता है।" },
]

const TIMER_OPTIONS = [
  { label: 'Off', minutes: 0 },
  { label: '15 Mins', minutes: 15 },
  { label: '30 Mins', minutes: 30 },
  { label: '45 Mins', minutes: 45 },
  { label: 'End of Session', minutes: -1 },
]

export default function ContentPage() {
  const { categoryId, itemId } = useParams()
  const navigate = useNavigate()
  const [playing, setPlaying] = useState(false)
  const user = useAuthStore(s => s.user)
  const [language, setLanguage] = useState(() => localStorage.getItem('audioLang') || 'hi')
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(300)
  const [affirmationIndex, setAffirmationIndex] = useState(0)
  const [timerModal, setTimerModal] = useState(false)
  const [sleepTimer, setSleepTimer] = useState(null)
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState(null)
  const [toast, setToast] = useState(null)
  
  const audioRef = useRef(null)
  const timerRef = useRef(null)

  const category = CATEGORIES.find(c => c.id === decodeURIComponent(categoryId))
  const item = category?.items?.find(i => i.id === itemId)

  // Rotating affirmations loop
  useEffect(() => {
    const timer = setInterval(() => {
      setAffirmationIndex(i => (i + 1) % AFFIRMATIONS.length)
    }, 12000)
    return () => clearInterval(timer)
  }, [])

  // Sleep timer countdown
  useEffect(() => {
    if (!sleepTimerRemaining || sleepTimerRemaining <= 0) return
    const interval = setInterval(() => {
      setSleepTimerRemaining(prev => {
        if (prev <= 1) {
          if (audioRef.current) {
            audioRef.current.pause()
            setPlaying(false)
          }
          setToast({ message: '🌙 Sleep timer finished. Sanctuary paused.', type: 'info' })
          return null
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [sleepTimerRemaining])

  function selectLanguage(lang) {
    setLanguage(lang)
    localStorage.setItem('audioLang', lang)
    if (audioRef.current) {
      const wasPlaying = playing
      const curr = currentTime
      audioRef.current.pause()
      audioRef.current.load()
      audioRef.current.currentTime = curr
      if (wasPlaying) audioRef.current.play()
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
      
      // Save last played session
      localStorage.setItem('lastPlayedSession', JSON.stringify({
        title: item?.title,
        subtitle: category?.name,
        path: `/content/${encodeURIComponent(categoryId)}/${itemId}`,
        image: item?.image || category?.image,
        progress: Math.min(100, Math.round((currentTime / (duration || 300)) * 100)) || 10,
      }))
    }
    setPlaying(p => !p)
  }

  function handleSeek(e) {
    const newTime = parseFloat(e.target.value)
    setCurrentTime(newTime)
    if (audioRef.current) audioRef.current.currentTime = newTime
  }

  function skipTime(seconds) {
    if (!audioRef.current) return
    const nextTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds))
    audioRef.current.currentTime = nextTime
    setCurrentTime(nextTime)
  }

  function setTimerDuration(minutes) {
    if (minutes === 0) {
      setSleepTimer(null)
      setSleepTimerRemaining(null)
      setToast({ message: 'Sleep timer disabled.', type: 'info' })
    } else if (minutes === -1) {
      setSleepTimer('End of Session')
      setSleepTimerRemaining(Math.max(0, duration - currentTime))
      setToast({ message: '🌙 Timer set: Stops at end of session.', type: 'success' })
    } else {
      setSleepTimer(`${minutes}m`)
      setSleepTimerRemaining(minutes * 60)
      setToast({ message: `🌙 Sleep timer set for ${minutes} minutes.`, type: 'success' })
    }
    setTimerModal(false)
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  if (!category || !item) {
    return (
      <div className="min-h-screen bg-bg-base text-text-primary flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-4xl mb-3">🔍</p>
          <h2 className="text-lg font-bold text-text-primary mb-2">Session Not Found</h2>
          <button onClick={() => navigate(-1)} className="text-xs font-semibold text-sage hover:underline">
            ← Return to Category
          </button>
        </div>
      </div>
    )
  }

  const audioSrc = language === 'hi' ? item.audioHi : item.audioEn

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex flex-col relative overflow-hidden transition-colors duration-200">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}

      {/* Background Ambient Mist */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {item.image && (
          <img
            src={item.image}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-10 scale-125"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-bg-base/85 via-bg-base/95 to-bg-base" />
      </div>

      {/* Hidden Audio Engine */}
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

      {/* 1. TOP SOLID BAR */}
      <div className="relative z-20 flex items-center justify-between px-4 sm:px-6 pt-6 pb-4 max-w-xl mx-auto w-full">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-bg-surface border border-border-subtle flex items-center justify-center text-text-secondary hover:text-text-primary transition-all active:scale-95 shadow-soft-sm"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <p className="text-[10px] uppercase tracking-widest text-sage font-bold">Guided Sanctuary</p>
          <p className="text-xs text-text-secondary truncate max-w-[180px] sm:max-w-[220px]">
            {category.name.split('/')[0]}
          </p>
        </div>

        {/* Right Actions: Sleep Timer & Share */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTimerModal(true)}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all active:scale-95 shadow-soft-sm ${
              sleepTimer
                ? 'bg-sage text-white border-sage font-semibold text-[11px]'
                : 'bg-bg-surface border-border-subtle text-text-secondary hover:text-text-primary'
            }`}
            aria-label="Sleep Timer"
            title="Sleep Timer"
          >
            {sleepTimer ? sleepTimer : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={async () => {
              const longUrl = `${window.location.origin}/category/${encodeURIComponent(categoryId)}?item=${itemId}`
              if (navigator.share) {
                try { await navigator.share({ title: item.title, text: item.description, url: longUrl }) } catch {}
              } else {
                navigator.clipboard.writeText(longUrl)
                setToast({ message: 'Session link copied to clipboard!', type: 'success' })
              }
            }}
            className="w-10 h-10 rounded-full bg-bg-surface border border-border-subtle flex items-center justify-center text-text-secondary hover:text-text-primary transition-all active:scale-95 shadow-soft-sm"
            aria-label="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. MAIN PLAYER VIEWPORT */}
      <main className="relative z-10 flex-1 flex flex-col justify-center max-w-sm sm:max-w-md mx-auto w-full px-6 py-2">
        
        {/* Album Artwork & Yogic Breathing Ring */}
        <div className="relative aspect-square w-full rounded-3xl overflow-hidden border border-border-subtle shadow-soft-lg mb-5 group mx-auto max-w-[260px] sm:max-w-[280px]">
          <img
            src={item.image || '/images/default-session.jpg'}
            alt={item.title}
            className={`w-full h-full object-cover transition-transform duration-1000 ${
              playing ? 'scale-105' : 'scale-100'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

          {/* Synchronized Breathing Ring */}
          {playing && (
            <div className="absolute inset-0 border-2 border-sage/50 rounded-3xl animate-breathe pointer-events-none" />
          )}

          {/* Bottom frequency tag on artwork */}
          <div className="absolute bottom-3 inset-x-3 text-center">
            <span className="text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/90 border border-white/15 shadow-soft-sm">
              ⚡ 432Hz Alpha Frequency
            </span>
          </div>
        </div>

        {/* Track Info */}
        <div className="text-center mb-4">
          <BilingualText 
            text={item.title}
            titleClassName="font-serif text-lg sm:text-xl font-medium text-text-primary leading-snug"
            subtitleClassName="text-xs text-sage font-hindi font-normal mt-0.5"
          />
          <p className="text-xs text-text-secondary mt-1.5 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Language Switcher Capsule */}
        <div className="flex justify-center mb-5">
          <div className="inline-flex p-1 rounded-full bg-bg-surface border border-border-subtle shadow-soft-sm">
            <button
              onClick={() => selectLanguage('hi')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                language === 'hi'
                  ? 'bg-sage text-white font-semibold shadow-soft-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              हिंदी (Hindi)
            </button>
            <button
              onClick={() => selectLanguage('en')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                language === 'en'
                  ? 'bg-sage text-white font-semibold shadow-soft-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Precision Progress Scrubber */}
        <div className="space-y-1.5 mb-5">
          <input
            type="range"
            min="0"
            max={duration || 300}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-bg-subtle rounded-lg appearance-none cursor-pointer accent-sage"
          />
          <div className="flex justify-between text-[11px] text-text-secondary font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Playback Controls (10s skip controls & central sage button) */}
        <div className="flex items-center justify-center gap-6 mb-5">
          <button
            onClick={() => skipTime(-10)}
            className="w-12 h-12 rounded-full bg-bg-surface border border-border-subtle text-text-secondary hover:text-text-primary active:scale-95 transition-all shadow-soft-sm flex items-center justify-center"
            aria-label="Rewind 10 seconds"
            title="Rewind 10s"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-sage hover:bg-sage-hover text-white flex items-center justify-center active:scale-95 transition-all shadow-soft"
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-0.5" />}
          </button>

          <button
            onClick={() => skipTime(10)}
            className="w-12 h-12 rounded-full bg-bg-surface border border-border-subtle text-text-secondary hover:text-text-primary active:scale-95 transition-all shadow-soft-sm flex items-center justify-center"
            aria-label="Forward 10 seconds"
            title="Forward 10s"
          >
            <RotateCw className="w-5 h-5" />
          </button>
        </div>

        {/* Rotating Hypnotic Affirmations Anchor */}
        <div className="bg-bg-surface border border-border-subtle rounded-2xl p-3.5 text-center shadow-soft-sm">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-sage" />
            <span className="text-[10px] font-semibold text-sage uppercase tracking-wider">
              Hypnotic Affirmation Anchor
            </span>
          </div>
          <p className="text-xs text-text-primary font-medium italic">
            "{AFFIRMATIONS[affirmationIndex].en}"
          </p>
          <p className="text-[11px] text-text-secondary font-hindi mt-0.5">
            "{AFFIRMATIONS[affirmationIndex].hi}"
          </p>
        </div>

      </main>

      {/* Sleep Timer Modal */}
      <Modal
        isOpen={timerModal}
        onClose={() => setTimerModal(false)}
        title="Sanctuary Sleep Timer"
      >
        <div className="flex flex-col gap-3">
          <p className="text-xs text-text-secondary mb-2">
            Set a gentle timer to automatically fade out session audio when you fall asleep.
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            {TIMER_OPTIONS.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setTimerDuration(opt.minutes)}
                className="py-3 px-4 rounded-2xl bg-bg-elevated hover:bg-bg-subtle border border-border-subtle text-text-primary font-medium text-xs hover:border-border-sage active:scale-[0.98] transition-all"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  )
}