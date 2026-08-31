import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, Pause, X, Share2, RotateCcw, RotateCw, Sparkles, Moon } from 'lucide-react'
import BilingualText from '../components/ui/BilingualText.jsx'
import Modal from '../components/ui/Modal.jsx'
import Toast from '../components/ui/Toast.jsx'
import Footer from '../components/layout/Footer.jsx'

const SESSION = {
  title: 'Meditation & Deep Relaxation / ध्यान और गहन विश्राम',
  description: 'A free guided clinical hypnotherapy experience to soothe overthinking, calm the nervous system, and restore inner peace.',
  image: '/images/free/meditation.jpg',
  audioEn: 'https://res.cloudinary.com/dtlitc3nv/video/upload/v1782998298/meditation_1_oevnh7.mp3',
  audioHi: 'https://res.cloudinary.com/dtlitc3nv/video/upload/v1782998298/meditation_1_oevnh7.mp3',
}

const AFFIRMATIONS = [
  { en: "I release all thoughts of the day and surrender to total stillness.", hi: "मैं दिन के सभी विचारों को छोड़ता हूँ और पूर्ण शांति को स्वीकार करता हूँ।" },
  { en: "My nervous system is calm, safe, and deeply restored.", hi: "मेरा तंत्रिका तंत्र शांत, सुरक्षित और गहराई से स्वस्थ हो रहा है।" },
  { en: "Peace flows into every cell of my body with every breath.", hi: "हर सांस के साथ मेरे शरीर की प्रत्येक कोशिका में शांति का प्रवाह होता है।" },
]

const TIMER_OPTIONS = [
  { label: 'Off', minutes: 0 },
  { label: '15 Mins', minutes: 15 },
  { label: '30 Mins', minutes: 30 },
  { label: '45 Mins', minutes: 45 },
  { label: 'End of Session', minutes: -1 },
]

export default function MeditationSessionPage() {
  const navigate = useNavigate()
  const [playing, setPlaying] = useState(false)
  const [language, setLanguage] = useState(() => localStorage.getItem('audioLang') || 'hi')
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(300)
  const [affirmationIndex, setAffirmationIndex] = useState(0)
  const [timerModal, setTimerModal] = useState(false)
  const [sleepTimer, setSleepTimer] = useState(null)
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState(null)
  const [toast, setToast] = useState(null)
  
  const audioRef = useRef(null)

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
          setToast({ message: '🌙 Sleep timer finished. Session paused.', type: 'info' })
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
      localStorage.setItem('lastPlayedSession', JSON.stringify({
        title: 'Overthinking Control & Deep Relaxation',
        subtitle: 'ध्यान और गहन विश्राम — अशांत विचारों को शांत करने की थेरेपी',
        path: '/session/overthinking-control',
        image: SESSION.image,
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
      setSleepTimer('End')
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

  const audioSrc = language === 'hi' ? SESSION.audioHi : SESSION.audioEn

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex flex-col relative overflow-hidden transition-colors duration-200">
      
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}

      {/* Background Ambient Mist */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src={SESSION.image}
          alt={SESSION.title}
          className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-10 scale-125"
        />
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
          <span className="text-[10px] uppercase tracking-widest text-sage font-bold">Free Spotlight</span>
          <p className="text-xs text-text-secondary">Overthinking Control</p>
        </div>

        {/* Right Actions */}
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
        </div>
      </div>

      {/* 2. MAIN PLAYER VIEWPORT */}
      <main className="relative z-10 flex-1 flex flex-col justify-center max-w-sm sm:max-w-md mx-auto w-full px-6 py-2">
        
        {/* Album Artwork & Yogic Breathing Ring */}
        <div className="relative aspect-square w-full rounded-3xl overflow-hidden border border-border-subtle shadow-soft-lg mb-5 group mx-auto max-w-[260px] sm:max-w-[280px]">
          <img
            src={SESSION.image}
            alt={SESSION.title}
            className={`w-full h-full object-cover transition-transform duration-1000 ${
              playing ? 'scale-105' : 'scale-100'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

          {playing && (
            <div className="absolute inset-0 border-2 border-sage/50 rounded-3xl animate-breathe pointer-events-none" />
          )}

          <div className="absolute bottom-3 inset-x-3 text-center">
            <span className="text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/90 border border-white/15 shadow-soft-sm">
              ⚡ 432Hz Alpha Waves
            </span>
          </div>
        </div>

        {/* Track Info */}
        <div className="text-center mb-4">
          <BilingualText 
            text={SESSION.title}
            titleClassName="font-serif text-lg sm:text-xl font-medium text-text-primary leading-snug"
            subtitleClassName="text-xs text-sage font-hindi font-normal mt-0.5"
          />
          <p className="text-xs text-text-secondary mt-1.5 line-clamp-2 leading-relaxed">
            {SESSION.description}
          </p>
        </div>

        {/* Progress Bar */}
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

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mb-5">
          <button
            onClick={() => skipTime(-10)}
            className="w-12 h-12 rounded-full bg-bg-surface border border-border-subtle text-text-secondary hover:text-text-primary active:scale-95 transition-all shadow-soft-sm flex items-center justify-center"
            aria-label="Rewind 10 seconds"
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
          >
            <RotateCw className="w-5 h-5" />
          </button>
        </div>

        {/* Hypnotic Affirmations Anchor */}
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