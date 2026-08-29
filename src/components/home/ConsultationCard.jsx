import React from 'react'
import { Calendar, Phone, Globe, ShieldCheck, Sparkles, MessageCircle } from 'lucide-react'

export default function ConsultationCard() {
  return (
    <div className="relative rounded-3xl overflow-hidden border border-border-subtle bg-bg-surface p-6 sm:p-8 my-8 shadow-soft transition-all">
      
      {/* Soft Ambient Sage Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-sage/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        
        {/* Left text column */}
        <div className="flex-1 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-light border border-border-sage mb-4">
            <Sparkles className="w-3.5 h-3.5 text-sage" />
            <span className="text-[11px] font-semibold text-sage uppercase tracking-wider">
              Personalized Guidance
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl text-text-primary font-normal leading-snug mb-1">
            Seedhi Baat with <span className="font-semibold text-sage">Mr. SANDEEP</span>
          </h2>
          
          <p className="text-xs sm:text-sm text-text-secondary font-medium mb-3">
            Grandmaster Hypnotherapist & REIKI Healer
          </p>

          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-6">
            Private, compassionate 1-on-1 guidance designed to help you dissolve subconscious blocks, soothe chronic anxiety, and restore inner equilibrium.
          </p>

          {/* Action buttons & Trust badges */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <a
              href="https://wa.me/919792390777?text=Hi%2C%20I%20want%20to%20book%20a%20free%20consultation%20session."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-sage hover:bg-sage-hover text-white font-semibold text-xs sm:text-sm active:scale-[0.98] transition-all shadow-soft"
            >
              <MessageCircle className="w-4 h-4" />
              Book Free Session on WhatsApp
            </a>

            <a
              href="tel:+919792390777"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-bg-elevated border border-border-subtle text-text-primary font-medium text-xs sm:text-sm hover:border-border-sage transition-all shadow-soft-sm"
            >
              <Phone className="w-4 h-4 text-sage" />
              9792390777
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-[11px] text-text-secondary pt-4 border-t border-border-subtle">
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

        {/* Right photo column */}
        <div className="shrink-0 relative">
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1 bg-gradient-to-tr from-border-sage via-bg-elevated to-border-champagne shadow-soft">
            <div className="w-full h-full rounded-full overflow-hidden bg-bg-surface">
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
