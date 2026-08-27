import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Sparkles, Gift, Play, Lock, MessageCircle, Phone, Globe, ShieldCheck } from 'lucide-react'
import Navbar from '../components/layout/Navbar.jsx'
import ImageCarousel from '../components/home/ImageCarousel.jsx'
import WelcomePopup from '../components/ui/WelcomePopup.jsx'
import { CATEGORIES } from '../constants/categories.js'
import Footer from '../components/layout/Footer.jsx'
import { useWalletStore } from '../store/walletStore.js'
import { useAuthStore } from '../store/authStore.js'

function BilingualText({ text, en, hi, className = '', titleClassName = 'text-sm sm:text-base font-semibold text-[#F2F4F1] leading-tight', subtitleClassName = 'text-[11px] sm:text-xs text-[#9BA5A0] font-hindi font-normal mt-0.5 line-clamp-1' }) {
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

function CategoryCard({ category, onClick }) {
  const isComingSoon = category.comingSoon

  return (
    <div
      onClick={!isComingSoon ? onClick : undefined}
      className={`group relative h-48 sm:h-60 rounded-2xl overflow-hidden border border-[#232B26] bg-[#151A17] transition-all duration-300 ${
        isComingSoon 
          ? 'opacity-65 cursor-not-allowed' 
          : 'cursor-pointer hover:border-[#D4AF6A]/50 hover:shadow-xl hover:shadow-black/50 hover:-translate-y-1'
      }`}
    >
      {category.image && (
        <img
          src={category.image}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#0C0F0E] via-[#0C0F0E]/70 to-transparent" />

      <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
        {category.items?.length > 0 && !isComingSoon && (
          <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-md bg-[#0C0F0E]/85 backdrop-blur-md border border-[#232B26] text-[#D4AF6A]">
            {category.items.length} Sessions
          </span>
        )}

        {isComingSoon && (
          <div className="ml-auto px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 flex items-center gap-1.5 shadow-md">
            <Lock className="w-3 h-3 text-[#D4AF6A]" />
            <span className="text-[10px] uppercase font-bold text-[#9BA5A0] tracking-wider">Coming Soon</span>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-4 z-10">
        <BilingualText 
          text={category.name} 
          titleClassName="text-sm sm:text-base font-semibold text-[#F2F4F1] leading-tight group-hover:text-[#D4AF6A] transition-colors"
          subtitleClassName="text-[11px] sm:text-xs text-[#9BA5A0] font-hindi font-normal mt-0.5 line-clamp-1"
        />
      </div>
    </div>
  )
}

function ConsultationCard() {
  return (
    <div className="relative rounded-3xl overflow-hidden border border-[#D4AF6A]/20 bg-[#151A17] p-6 sm:p-8 my-8 shadow-xl">
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#D4AF6A]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        <div className="flex-1 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C2420] border border-[#D4AF6A]/20 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF6A]" />
            <span className="text-[11px] font-semibold text-[#D4AF6A] uppercase tracking-wider">
              Free 1-on-1 Consultation
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl text-[#F2F4F1] font-normal leading-snug mb-1">
            Seedhi Baat with <span className="font-semibold text-[#D4AF6A]">Mr. SANDEEP</span>
          </h2>
          
          <p className="text-xs sm:text-sm text-[#D4AF6A]/90 font-medium mb-3">
            Grandmaster Hypnotherapist & REIKI Healer
          </p>

          <p className="text-xs sm:text-sm text-[#9BA5A0] leading-relaxed mb-6">
            Simple, personal, and reassuring guidance to release subconscious barriers, calm anxiety, and move forward with absolute clarity.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <a
              href="https://wa.me/919792390777?text=Hi%2C%20I%20want%20to%20book%20a%20free%20consultation%20session."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#D4AF6A] text-[#0C0F0E] font-bold text-xs sm:text-sm hover:bg-[#C49A4E] active:scale-95 transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              Book Free Session on WhatsApp
            </a>

            <a
              href="tel:+919792390777"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#1C2420] border border-[#232B26] text-[#F2F4F1] font-semibold text-xs sm:text-sm hover:border-[#D4AF6A]/40 transition-all"
            >
              <Phone className="w-4 h-4 text-[#D4AF6A]" />
              9792390777
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-[11px] text-[#9BA5A0] pt-4 border-t border-[#232B26]">
            <a 
              href="https://www.sudershanhypnotherapy.site" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-1.5 hover:text-[#D4AF6A] transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#D4AF6A]" />
              sudershanhypnotherapy.site
            </a>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF6A]" />
              Confidential & 100% Private
            </span>
          </div>
        </div>

        <div className="shrink-0 relative">
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1 bg-gradient-to-tr from-[#D4AF6A]/60 via-[#232B26] to-[#D4AF6A]/30 shadow-xl">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#151A17]">
              <img
                src="/images/banner/me.png"
                alt="Mr. Sandeep"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)
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
        (c.description && c.description.toLowerCase().includes(q))
    )
  }, [query])

  async function claimDailyReward() {
    await addTokens(2, '🎁 Daily reward')
    localStorage.setItem('lastDailyClaim', new Date().toISOString())
    setShowDailyReward(false)
  }

  return (
    <div className="min-h-screen bg-[#0C0F0E] text-[#F2F4F1]">
      <Navbar />

      <WelcomePopup 
        isOpen={showPopup} 
        onClose={() => {
          sessionStorage.setItem('popupSeen', 'true')
          setShowPopup(false)
        }} 
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-28">

        {/* Hero Section */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151A17] border border-[#232B26] mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF6A]" />
                <span className="text-xs font-semibold text-[#D4AF6A] uppercase tracking-wider">
                  Mind & Spiritual Sanctuary
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#F2F4F1] font-normal tracking-tight">
                Restore Inner <span className="text-gradient font-medium">Clarity</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#9BA5A0] mt-1.5 max-w-lg leading-relaxed">
                Guided hypnotherapy and meditative frequencies to release stress, manage pain, and unlock deep tranquility.
              </p>
            </div>

            {/* Quick Search */}
            <div className="w-full md:w-72 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7570]" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search healing paths..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#151A17] border border-[#232B26] rounded-2xl text-xs sm:text-sm
                  text-[#F2F4F1] placeholder-[#6B7570] focus:outline-none focus:border-[#D4AF6A]/60 focus:ring-1 focus:ring-[#D4AF6A]/30
                  transition-all duration-200"
              />
            </div>
          </div>

          {/* Daily Reward Inline Banner (Muted Emerald #2E7D5B) */}
          {showDailyReward && (
            <div className="mb-6 rounded-2xl bg-[#151A17] border border-[#2E7D5B]/40 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
              <div className="flex items-center gap-3.5 text-center sm:text-left">
                <div className="w-11 h-11 rounded-xl bg-[#2E7D5B]/20 border border-[#2E7D5B]/40 flex items-center justify-center text-xl shrink-0">
                  🎁
                </div>
                <div>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-xs font-bold text-[#2E7D5B] uppercase tracking-wider">Daily Token Bonus</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#2E7D5B]/20 text-[#F2F4F1] font-mono font-bold">+2 🪙</span>
                  </div>
                  <p className="text-xs text-[#9BA5A0] mt-0.5">Your daily token gift is ready to be collected.</p>
                </div>
              </div>
              <button
                onClick={claimDailyReward}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#2E7D5B] hover:bg-[#25664A] text-[#F2F4F1] font-bold text-xs active:scale-95 transition-all shadow-sm"
              >
                Claim +2 Tokens
              </button>
            </div>
          )}

          {/* Featured Spotlight: Overthinking & Deep Relaxation */}
          <div 
            onClick={() => navigate('/session/overthinking-control')}
            className="group relative rounded-3xl overflow-hidden border border-[#232B26] bg-[#151A17] cursor-pointer hover:border-[#D4AF6A]/40 transition-all duration-300 shadow-lg"
          >
            <div className="h-44 sm:h-52 relative">
              <img
                src="/images/free/meditation.jpg"
                alt="Meditation & Overthinking Control"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C0F0E] via-[#0C0F0E]/60 to-transparent" />
              
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-[#D4AF6A] text-[#0C0F0E] font-bold text-[11px] uppercase tracking-wider shadow">
                  Free Spotlight Session
                </span>
              </div>

              <div className="absolute bottom-4 inset-x-4 flex items-end justify-between">
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-medium text-[#F2F4F1] leading-snug group-hover:text-[#D4AF6A] transition-colors">
                    Meditation & Deep Relaxation
                  </h3>
                  <p className="text-xs text-[#9BA5A0] font-hindi mt-0.5">
                    ध्यान और गहन विश्राम — ओवरथिंकिंग नियंत्रण
                  </p>
                </div>

                <div className="w-10 h-10 rounded-full bg-[#D4AF6A] text-[#0C0F0E] flex items-center justify-center group-hover:scale-110 active:scale-95 transition-all shadow-lg shrink-0">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Sessions Section */}
        <section id="categories-section" className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif text-[#F2F4F1] font-normal">
                Healing Journeys
              </h2>
              <p className="text-xs text-[#9BA5A0] mt-0.5">
                Explore guided hypnotherapy sessions categorized by your needs
              </p>
            </div>
            <span className="text-xs text-[#D4AF6A] font-mono font-medium">
              {filtered.length} Categories
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 rounded-3xl bg-[#151A17] border border-[#232B26]">
              <Search className="w-8 h-8 text-[#6B7570] mx-auto mb-3 stroke-[1.5]" />
              <p className="text-sm font-semibold text-[#F2F4F1]">No healing categories found</p>
              <p className="text-xs text-[#9BA5A0] mt-1">Try searching for anxiety, sleep, pain, or meditation</p>
            </div>
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

        {/* Sanctuary 1-on-1 Consultation Section */}
        <section className="mb-12">
          <ConsultationCard />
        </section>

        {/* Trust & Accreditations Slider */}
        <section className="mb-8">
          <ImageCarousel />
        </section>

      </main>

      <Footer />
    </div>
  )
}