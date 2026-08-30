import React from 'react'
import { Calendar, Phone, Globe, ShieldCheck, Sparkles, MessageCircle } from 'lucide-react'

export default function ConsultationCard() {
  return (
    <div className="relative rounded-3xl overflow-hidden border border-[#D8B168]/20 bg-gradient-to-br from-[#131916] via-[#101512] to-[#0B0E0D] p-6 sm:p-8 my-8 shadow-2xl shadow-black/40">
      
      {/* Background Decorative Ambient Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#D8B168]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        
        {/* Left text column */}
        <div className="flex-1 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D8B168]/10 border border-[#D8B168]/20 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#D8B168]" />
            <span className="text-[11px] font-semibold text-[#D8B168] uppercase tracking-wider">
              Free 1-on-1 Consultation
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl text-[#F5F5F0] font-normal leading-snug mb-1">
            Seedhi Baat with <span className="font-semibold text-[#D8B168]">Mr. SANDEEP</span>
          </h2>
          
          <p className="text-xs sm:text-sm text-[#D8B168]/90 font-medium mb-3">
            Grandmaster Hypnotherapist & REIKI Healer
          </p>

          <p className="text-xs sm:text-sm text-[#A2ACA6] leading-relaxed mb-6">
            Simple, personal, and reassuring guidance to release subconscious barriers, calm anxiety, and move forward with absolute clarity.
          </p>

          {/* Action buttons & Trust badges */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <a
              href="https://wa.me/919792390777?text=Hi%2C%20I%20want%20to%20book%20a%20free%20consultation%20session."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#D8B168] text-[#0B0E0D] font-bold text-xs sm:text-sm hover:bg-[#E5C27E] active:scale-95 transition-all shadow-lg shadow-[#D8B168]/15"
            >
              <MessageCircle className="w-4 h-4" />
              Book Free Session on WhatsApp
            </a>

            <a
              href="tel:+919792390777"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#1C2621] border border-[#26332C] text-[#F5F5F0] font-semibold text-xs sm:text-sm hover:border-[#D8B168]/40 transition-all"
            >
              <Phone className="w-4 h-4 text-[#D8B168]" />
              9792390777
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-[11px] text-[#A2ACA6] pt-4 border-t border-[#1E2722]">
            <a 
              href="https://www.sudershanhypnotherapy.site" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-1.5 hover:text-[#D8B168] transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#D8B168]" />
              sudershanhypnotherapy.site
            </a>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D8B168]" />
              Confidential & 100% Private
            </span>
          </div>
        </div>

        {/* Right photo column */}
        <div className="shrink-0 relative">
          <div className="relative w-36 h-36 sm:w-48 sm:h-48 rounded-full p-1 bg-gradient-to-tr from-[#D8B168] via-transparent to-[#D8B168]/40 shadow-xl shadow-black/50">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#131916]">
              <img
                src="/images/banner/my.png"
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

