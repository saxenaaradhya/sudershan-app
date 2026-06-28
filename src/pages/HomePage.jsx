import React, { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Search } from 'lucide-react'
import Navbar from '../components/layout/Navbar.jsx'
import ImageCarousel from '../components/home/ImageCarousel.jsx'
import WelcomePopup from '../components/ui/WelcomePopup.jsx'
import { CATEGORIES } from '../constants/categories.js'
import Footer from '../components/layout/Footer.jsx'

export default function HomePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [query, setQuery] = useState('')
  const [showPopup, setShowPopup] = useState(true)

  const filtered = useMemo(() => {
    if (!query.trim()) return CATEGORIES
    const q = query.toLowerCase()
    return CATEGORIES.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    )
  }, [query])

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <WelcomePopup isOpen={showPopup} onClose={() => setShowPopup(false)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-12">

        {/* Banner */}
        <div className="w-full rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-[#0a0a1a] via-[#0d0d2b] to-[#1a0a2e] border border-dark-700">
          <div className="flex flex-row items-stretch justify-between">

            {/* Left — text content */}
            <div className="flex-1 min-w-0 p-4 sm:p-8 flex flex-col justify-center">
              <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-white/10 border border-white/10 mb-3 w-fit" style={{ color: '#FFFFFF'}}>
                Free Consultation
              </span>

              <h2 className="text-lg sm:text-3xl font-bold mb-2 leading-snug" style={{ color: '#FFFFFF' }}>
               Seedhi Baat with{' '}
               <span style={{ color: '#FF8C42' }}>Mr. Sandeep</span>
              </h2>

              <p className="text-xs sm:text-sm mb-4 leading-relaxed" style={{ color: '#FFFFFF' }}>
                Simple, personal and reassuring. Move forward with clarity.
              </p>

              <a
                href="https://wa.me/919792390777?text=Hi%2C%20I%20want%20to%20book%20a%20free%20consultation%20session."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 rounded-xl bg-white text-purple-700 font-bold text-xs sm:text-sm hover:bg-gray-100 transition-all shadow-lg w-fit mb-3"
              >
                Book a Session Now
              </a>

              <p className="text-xs" style={{ color: '#FFFFFF'}}>
                Live from · <span className="text-brand-accent font-medium">Call 9792390777</span>
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#FFFFFF'}} style={{ color: '#FFFFFF'}}>T&C apply, as available on the platform</p>
            </div>

            {/* Right — image placeholder */}
            <div className="w-32 sm:w-72 flex-shrink-0 bg-dark-700 rounded-r-2xl flex items-center justify-center">
              {/* Replace with: <img src="YOUR_IMAGE_URL" className="w-full h-full object-cover" /> */}
              <span className="text-gray-600 text-xs text-center px-2">Photo<br />Here</span>
            </div>

          </div>
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

        {/* Two big sliding clickable image cards */}
        <div className="mb-8">
          <ImageCarousel items={filtered} />
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
                onClick={() => navigate(`/category/${encodeURIComponent(cat.id)}`)}
                className="relative w-full h-64 rounded-xl overflow-hidden group"
                style={{
                  backgroundImage: `url(${cat.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
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