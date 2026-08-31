import React from 'react'
import { Phone, Globe, ShieldCheck, Sparkles, MessageCircle } from 'lucide-react'

export default function ConsultationCard() {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-bg-surface border border-border-sage p-5 sm:p-7 shadow-soft-lg transition-all">
      
      {/* Ambient sage glow — top-right */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-sage/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      {/* Ambient champagne glow — bottom-left */}
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-champagne/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-5 sm:gap-7">

        {/* Left / Top column — badge → photo → text (vertical on mobile, side column on sm+) */}
        <div className="flex flex-col items-center shrink-0">

          {/* 1. Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-light border border-border-sage mb-4 shadow-soft-sm self-center">
            <Sparkles className="w-3.5 h-3.5 text-sage" />
            <span className="text-[10px] sm:text-[11px] font-semibold text-sage uppercase tracking-wider">
              Personalized Guidance
            </span>
          </div>

          {/* 2. Profile Photo (above title on mobile, left column on desktop) */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-tr from-border-sage via-bg-elevated to-border-champagne shadow-soft-lg">
            <div className="w-full h-full rounded-full overflow-hidden bg-bg-surface flex items-center justify-center">
              <img
                src="/images/banner/my.png"
                alt="Mr. Sandeep - Grandmaster Hypnotherapist"
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src = '/images/free/meditation.jpg'
                }}
              />
            </div>
          </div>
        </div>

        {/* Right / Bottom column — title + text + buttons */}
        <div className="flex-1 min-w-0">

          {/* 3. Title */}
          <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl text-text-primary font-normal leading-snug mb-1">
            Seedhi Baat with   <span className="font-semibold text-sage">Mr. SANDEEP</span>
          </h2>
          
          {/* 4. Designation subtitle */}
          <p className="text-xs sm:text-sm text-text-secondary font-medium mb-2.5">
            Grandmaster Hypnotherapist & REIKI Healer
          </p>

          {/* 5. Description */}
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-5">
            Private, compassionate 1-on-1 guidance designed to help you dissolve subconscious blocks, soothe chronic anxiety, and restore inner equilibrium.
          </p>

          {/* 6. Action buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-5">
            <a
              href="https://wa.me/919792390777?text=Hi%2C%20I%20want%20to%20book%20a%20free%20consultation%20session."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:py-3 rounded-full bg-sage hover:bg-sage-hover text-white font-semibold text-xs sm:text-sm active:scale-[0.98] transition-all shadow-soft"
            >
              <MessageCircle className="w-4 h-4" />
              Book Free Session on WhatsApp
            </a>

            <a
              href="tel:+919792390777"
              className="inline-flex items-center gap-2 px-4 py-2.5 sm:py-3 rounded-full bg-bg-elevated border border-border-subtle text-text-primary font-medium text-xs sm:text-sm hover:border-border-sage transition-all shadow-soft-sm"
            >
              <Phone className="w-4 h-4 text-sage" />
              9792390777
            </a>
          </div>

          {/* 7. Trust footer */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-y-2 gap-x-6 text-[11px] text-text-secondary pt-3.5 border-t border-border-subtle">
            <a 
              href="https://www.sudershanhypnotherapy.site" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-1.5 hover:text-sage transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-sage" />
              sudershanhypnotherapy.site
            </a>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-sage" />
              Confidential & 100% Private
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}
