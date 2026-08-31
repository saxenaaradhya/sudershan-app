import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Search, Sparkles, Gift, Play, Brain, Moon, 
  HeartPulse, Activity, Heart, Coins, User, Sun, 
  RotateCcw, Sparkle
} from 'lucide-react'
import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import CategoryCard from '../components/home/CategoryCard.jsx'
import ConsultationCard from '../components/home/ConsultationCard.jsx'
import ImageCarousel from '../components/home/ImageCarousel.jsx'
import SectionHeader from '../components/ui/SectionHeader.jsx'
import FilterPill from '../components/ui/FilterPill.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import WelcomePopup from '../components/ui/WelcomePopup.jsx'
import { CATEGORIES } from '../constants/categories.js'
import { useWalletStore } from '../store/walletStore.js'
import { useAuthStore } from '../store/authStore.js'

const MOOD_FILTERS = [
  { id: 'all', label: 'All Journeys (सभी)', icon: Sparkles },
  { id: 'anxiety', label: 'Anxiety (चिंता)', icon: Brain },
  { id: 'sleep', label: 'Sleep (नींद)', icon: Moon },
  { id: 'overthinking', label: 'Overthinking (विचार)', icon: Activity },
  { id: 'pain', label: 'Pain Relief (दर्द)', icon: HeartPulse },
  { id: 'emotional', label: 'Emotional Healing (मन)', icon: Heart },
]

export default function HomePage() {
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)
  const addTokens = useWalletStore(s => s.addTokens)

  const [query, setQuery] = useState('')
  const [activeMood, setActiveMood] = useState('all')
  const [showPopup, setShowPopup] = useState(() => !sessionStorage.getItem('popupSeen'))
  const [showDailyReward, setShowDailyReward] = useState(() => {
    const last = localStorage.getItem('lastDailyClaim')
    if (!last) return true
    return Date.now() - new Date(last).getTime() >= 24 * 60 * 60 * 1000
  })

  // Check if there is an in-progress session history (other than default)
  const [lastPlayed] = useState(() => {
    const saved = localStorage.getItem('lastPlayedSession')
    if (!saved) return null
    try {
      const parsed = JSON.parse(saved)
      if (parsed.path && parsed.path !== '/session/overthinking-control') {
        return parsed
      }
    } catch {}
    return null
  })

  // Filter categories by search query and mood chip
  const filtered = useMemo(() => {
    let list = CATEGORIES
    if (activeMood !== 'all') {
      list = list.filter(c => {
        const id = c.id.toLowerCase()
        if (activeMood === 'anxiety') return id.includes('anxiety')
        if (activeMood === 'sleep') return id.includes('sleep')
        if (activeMood === 'overthinking') return id.includes('overthinking')
        if (activeMood === 'pain') return id.includes('pain')
        if (activeMood === 'emotional') return id.includes('emotional')
        return true
      })
    }

    if (!query.trim()) return list
    const q = query.toLowerCase()
    return list.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
    )
  }, [query, activeMood])

  async function claimDailyReward() {
    await addTokens(2, '🎁 Daily reward')
    localStorage.setItem('lastDailyClaim', new Date().toISOString())
    setShowDailyReward(false)
  }

  return (
    <div className="min-h-screen bg-bg-base text-text-primary transition-colors duration-200">
      
      {/* 1. NAVBAR */}
      <Navbar />

      <WelcomePopup 
        isOpen={showPopup} 
        onClose={() => {
          sessionStorage.setItem('popupSeen', 'true')
          setShowPopup(false)
        }} 
      />

      {/* MAIN CONTAINER (390px mobile-first width) */}
      <main className="max-w-full md:max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-28">

        {/* 2. SEEDHI BAAT SECTION (Moved to top) */}
        <section className="mb-8">
          <ConsultationCard />
        </section>

        {/* 3. MIND AND CLINICAL SANCTUARY SECTION */}
        <section className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-light border border-border-sage mb-3 shadow-soft-sm">
            <span className="w-2 h-2 rounded-full bg-sage animate-pulse" />
            <span className="text-xs font-semibold text-sage uppercase tracking-wider">
              Mind & Clinical Sanctuary
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-text-primary font-normal tracking-tight">
            Embrace Your <span className="text-sage font-medium">Inner Peace</span>
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-2 leading-relaxed">
            Guided clinical hypnotherapy and meditative soundscapes to dissolve anxiety, restore sleep, and realign subconscious healing.
          </p>
        </section>

        {/* 4. SEARCH BAR */}
        <section className="mb-5">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search healing journeys, sleep, anxiety..."
              className="w-full pl-11 pr-4 py-3 bg-bg-surface border border-border-subtle rounded-full text-xs sm:text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/15 transition-all duration-200 shadow-soft-sm"
            />
          </div>
        </section>

        {/* 5. MOOD FILTER PILLS */}
        <section className="mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {MOOD_FILTERS.map(m => (
              <FilterPill
                key={m.id}
                label={m.label}
                icon={m.icon}
                active={activeMood === m.id}
                onClick={() => setActiveMood(m.id)}
              />
            ))}
          </div>
        </section>

        {/* 6. PERMANENT FREE MEDITATION SPOTLIGHT CARD */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sage" />
              <h2 className="text-sm sm:text-base font-semibold text-text-primary">
                Free Meditation Sanctuary
              </h2>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-champagne-surface border border-border-champagne text-text-primary font-mono">
              0 Tokens • Free Forever
            </span>
          </div>

          <div 
            onClick={() => navigate('/session/overthinking-control')}
            className="group relative rounded-3xl overflow-hidden border border-border-sage bg-bg-surface cursor-pointer hover:border-sage transition-all duration-300 shadow-soft-lg ring-1 ring-sage/15"
          >
            <div className="h-60 sm:h-72 relative">
              <img
                src="/images/free/meditation.jpg"
                alt="Meditation & Overthinking Control"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
              
              {/* Top Badges */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white/95 dark:bg-black/80 backdrop-blur-md text-text-primary font-bold text-[10px] uppercase tracking-wider shadow-soft-sm">
                  ✨ 100% Free Session
                </span>
                <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-sage/90 backdrop-blur-md text-white font-medium text-[10px] uppercase tracking-wider">
                  Overthinking Control
                </span>
              </div>

              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] text-white">
                <span className="text-champagne font-bold font-mono">240+</span>
                <span className="text-white/80">Seekers Healed</span>
              </div>

              {/* Bottom Details & Play FAB */}
              <div className="absolute bottom-5 inset-x-5 flex items-end justify-between gap-4">
                <div className="max-w-[78%]">
                  <span className="text-[10px] uppercase tracking-widest text-champagne font-bold font-mono block mb-1">
                    Guided Clinical Hypnotherapy
                  </span>
                  <h3 className="font-serif text-lg sm:text-2xl font-medium text-white leading-snug group-hover:text-champagne transition-colors">
                    Meditation & Deep Relaxation
                  </h3>
                  <p className="text-xs sm:text-sm text-white/90 font-hindi mt-1 line-clamp-1">
                    ध्यान और गहन विश्राम — अशांत विचारों को शांत करने की गाइडेड थेरेपी
                  </p>
                  <p className="text-[11px] text-white/70 mt-1 hidden sm:block">
                    Full audio session • 432Hz Sound Healing • Available in Hindi & English
                  </p>
                </div>

                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-sage hover:bg-sage-hover text-white flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all shadow-soft shrink-0">
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-0.5" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. OPTIONAL RESUME RECENT TRACK */}
        {lastPlayed && (
          <section className="mb-8">
            <div
              onClick={() => navigate(lastPlayed.path)}
              className="p-4 rounded-2xl bg-bg-surface border border-border-subtle hover:border-border-sage transition-all duration-200 cursor-pointer shadow-soft-sm flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-border-subtle bg-bg-base">
                  <img src={lastPlayed.image} alt={lastPlayed.title} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-sage font-bold">Resume Last Track</p>
                  <p className="text-xs font-semibold text-text-primary truncate">{lastPlayed.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-mono text-text-muted">{lastPlayed.progress}%</span>
                <div className="w-8 h-8 rounded-full bg-bg-elevated border border-border-subtle text-sage flex items-center justify-center">
                  <RotateCcw className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 8. DAILY TOKEN BONUS CARD */}
        {showDailyReward && (
          <section className="mb-8">
            <div className="rounded-3xl bg-bg-surface border border-border-sage p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-soft">
              <div className="flex items-center gap-3.5 text-center sm:text-left">
                <div className="w-11 h-11 rounded-2xl bg-sage-light text-sage flex items-center justify-center text-xl shrink-0">
                  🎁
                </div>
                <div>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-xs font-bold text-sage uppercase tracking-wider">Daily Token Bonus</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-sage-light text-sage font-mono font-bold">+2 🪙</span>
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">Collect your daily sanctuary energy bonus to unlock sessions.</p>
                </div>
              </div>
              <button
                onClick={claimDailyReward}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-sage hover:bg-sage-hover text-white font-semibold text-xs active:scale-95 transition-all shadow-soft"
              >
                Claim +2 Tokens
              </button>
            </div>
          </section>
        )}

        {/* 9. EXPLORE CATEGORIES */}
        <section id="categories-section" className="mb-10">
          <SectionHeader
            title="Healing Journeys"
            subtitle="Explore guided sessions categorized by therapeutic need"
            count={`${filtered.length} Categories`}
          />

          {filtered.length === 0 ? (
            <EmptyState
              title="No therapy categories found"
              message="Try selecting another filter or searching for anxiety, sleep, pain, or meditation."
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
              {filtered.map(cat => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  onClick={() => navigate(`/category/${encodeURIComponent(cat.id)}`)}
                />
              ))}
            </div>
          )}
        </section>

        {/* 10. TRUST & CERTIFICATES CAROUSEL */}
        <section className="mb-6">
          <ImageCarousel />
        </section>

      </main>

      {/* 11. SOLID BOTTOM NAVIGATION DOCK */}
      <Footer />

    </div>
  )
}