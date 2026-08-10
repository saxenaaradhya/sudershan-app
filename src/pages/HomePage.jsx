import React, { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Search, UserRound, Calendar, Globe, Phone, ShieldCheck } from 'lucide-react'
import Navbar from '../components/layout/Navbar.jsx'
import ImageCarousel from '../components/home/ImageCarousel.jsx'
import WelcomePopup from '../components/ui/WelcomePopup.jsx'
import { CATEGORIES } from '../constants/categories.js'
import Footer from '../components/layout/Footer.jsx'
import { useWalletStore } from '../store/walletStore.js'

export default function HomePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const addTokens = useWalletStore(s => s.addTokens)
  const [query, setQuery] = useState('')

  const [showPopup, setShowPopup] = useState(() => {
    const seen = sessionStorage.getItem('popupSeen')
    return !seen
  })

  const [showDailyReward, setShowDailyReward] = useState(() => {
    const last = localStorage.getItem('lastDailyClaim')
    if (!last) return true
    return Date.now() - new Date(last).getTime() >= 24 * 60 * 60 * 1000
  })

  const filtered = useMemo(() => {
    if (!query.trim()) return CATEGORIES
    const q = query.toLowerCase()
    return CATEGORIES.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    )
  }, [query])

  async function claimDailyReward() {
    await addTokens(2, '🎁 Daily reward')
    localStorage.setItem('lastDailyClaim', new Date().toISOString())
    setShowDailyReward(false)
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      <WelcomePopup isOpen={showPopup} onClose={() => {
        sessionStorage.setItem('popupSeen', 'true')
        setShowPopup(false)
      }} />

      {showDailyReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowDailyReward(false)} />
          <div className="relative z-10 w-full max-w-sm bg-dark-800 border border-emerald-700/50 rounded-2xl p-6 text-center shadow-2xl">
            <button
              onClick={() => setShowDailyReward(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
            >
              ✕
            </button>
            <div className="text-6xl mb-4">🎁</div>
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Daily Reward</p>
            <p className="text-2xl font-bold text-white mb-1">+2 Tokens</p>
            <p className="text-sm text-gray-400 mb-6">Your daily bonus is ready to claim!</p>
            <button
              onClick={claimDailyReward}
              className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-all"
            >
              Claim Reward
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-12">

        {/* Banner */}
<div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] rounded-none sm:rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-[#0a0a1a] via-[#0d0d2b] to-[#1a0a2e] border border-dark-700">
  <div className="flex flex-row items-stretch justify-between">

    {/* Left — text content */}
    <div className="flex-1 min-w-0 p-4 sm:p-8 flex flex-col justify-center">
      <span
        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 w-fit"
        style={{ backgroundColor: '#F0D080', color: '#1a0a2e' }}
      >
        <UserRound className="w-3.5 h-3.5" />
        Free Consultation
      </span>

      <h2 className="font-serif text-lg sm:text-3xl font-bold leading-snug" style={{ color: '#FFFFFF' }}>
        Seedhi Baat with
      </h2>
      <h2 className="font-serif text-2xl sm:text-4xl font-extrabold mb-2 leading-snug" style={{ color: '#D4AF37' }}>
        SANDEEP
      </h2>

      <div className="h-px w-2/3 mb-3" style={{ background: 'linear-gradient(to right, #D4AF37, transparent)' }} />

      <h2 className="text-sm sm:text-lg font-extrabold mb-3 leading-snug" style={{ color: '#F5D020' }}>
        Hypnotherapist and REIKI Grandmaster
      </h2>

      <p className="text-xs sm:text-sm leading-snug" style={{ color: '#ffffff' }}>
        Simple, personal and reassuring.
      </p>
      <div className="h-px w-2/3 my-1.5" style={{ background: 'linear-gradient(to right, #D4AF37, transparent)' }} />
      <p className="text-xs sm:text-sm mb-4 leading-snug" style={{ color: '#ffffff' }}>
        Move forward with clarity.
      </p>

      <a
        
        href="https://wa.me/919792390777?text=Hi%2C%20I%20want%20to%20book%20a%20free%20consultation%20session."
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm hover:brightness-110 transition-all shadow-lg w-fit mb-4"
        style={{ backgroundColor: '#F0D080', color: '#1a0a2e' }}
      >
        <Calendar className="w-4 h-4" />
        Book Your Session Now
      </a>

      <div className="flex items-center gap-2 text-xs" style={{ color: '#FFFFFF' }}>
        <Globe className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#D4AF37' }} />
        <span>
          WEBSITE:-{' '}
          <a
            href="https://www.sudershanhypnotherapy.site"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline hover:text-white transition-colors"
            style={{ color: '#D4AF37' }}
          >
            www.sudershanhypnotherapy.site
          </a>
        </span>
      </div>
      <div className="h-px w-2/3 my-1.5" style={{ background: 'linear-gradient(to right, #D4AF37, transparent)' }} />

      <div className="flex items-center gap-2 text-xs" style={{ color: '#FFFFFF' }}>
        <Phone className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#D4AF37' }} />
        <span>
          Contact Now :-{' '}
          <a href="tel:+919792390777" className="font-extrabold text-base sm:text-xl" style={{ color: '#D4AF37' }}>
            9792390777
          </a>
        </span>
      </div>
      <div className="h-px w-2/3 my-1.5" style={{ background: 'linear-gradient(to right, #D4AF37, transparent)' }} />

      <div className="flex items-center gap-2 text-xs" style={{ color: '#FFFFFF' }}>
        <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#D4AF37' }} />
        <span>T&C apply, as available on the platform</span>
      </div>
    </div>

     {/* Right — image */}
    <div className="w-36 sm:w-80 flex-shrink-0 relative overflow-hidden">
      {/* Gold wave divider */}
      <svg
        className="absolute -left-6 sm:-left-10 top-0 h-full w-10 sm:w-16 z-10"
        viewBox="0 0 60 400"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#F5D020" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
        </defs>
        <path
          d="M60,0 C20,100 20,300 60,400 L0,400 L0,0 Z"
          fill="url(#waveGold)"
        />
      </svg>

      <div
        className="absolute -left-3 sm:-left-6 top-0 h-full w-8 sm:w-12 z-20 bg-gradient-to-br from-[#0a0a1a] via-[#0d0d2b] to-[#1a0a2e]"
        style={{ clipPath: 'polygon(0 0, 30% 0, 55% 50%, 30% 100%, 0 100%)' }}
      />

      <img
        src="/images/banner/me.png"
        alt="Mr. Sandeep"
        className="w-full h-full object-cover object-top"
      />
    </div>
   </div>
  </div>


        {/* Clickable Full Width Image */}
        <div className="w-full mb-6 cursor-pointer" onClick={() => navigate('/session/overthinking-control')}>
         <img 
          src="/images/free/meditation.jpg" 
          alt="Banner" 
          className="w-full rounded-2xl object-cover"
          />
        </div>

        {/* Hero Header */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Your <span className="text-gradient">Trust</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Discover content across all topics. Use your tokens to unlock premium items.
          </p>
        </div>

        {/* Carousel */}
        <div className="mb-8">
          <ImageCarousel />
        </div>

        {/* Hero Header */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Explore <span className="text-gradient">Categories</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Discover content across all topics. Use your tokens to unlock premium items.
          </p>
        </div>

        {/* Search Bar */}
        <div id="categories-section" className="relative mb-8 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search categories…"
            className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-dark-500 rounded-xl text-sm
              text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary
              focus:border-transparent transition-all"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-white font-semibold text-lg">No categories found</p>
            <p className="text-gray-500 text-sm mt-1">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(cat => (
  <button
    key={cat.id}
    onClick={() => {
      if (cat.comingSoon) return
      navigate(`/category/${encodeURIComponent(cat.id)}`)
    }}
    className={`relative w-full h-64 rounded-xl overflow-hidden group ${cat.comingSoon ? 'cursor-not-allowed' : ''}`}
    style={{
      backgroundImage: `url(${cat.image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    {cat.comingSoon && (
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
        <span className="text-white font-bold text-sm px-4 py-2 bg-white/10 border border-white/30 rounded-full">
          Coming Soon
        </span>
      </div>
    )}
    <span
      className="absolute bottom-2 left-3 text-base font-semibold"
      style={{ color: '#FFFFFF' }}
    >
      {cat.name}
    </span>
  </button>
))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}