import React, { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function LanguageSelectPage({ onSelect }) {
  const [selecting, setSelecting] = useState(null)
  const { t } = useTranslation()

  function choose(lang) {
    setSelecting(lang)
    localStorage.setItem('preferredLanguage', lang)
    setTimeout(() => onSelect(lang), 220)
  }

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex flex-col items-center justify-center px-6 relative overflow-hidden transition-colors duration-300">

      {/* Ambient sage mist — top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-sage/6 rounded-full blur-3xl pointer-events-none" />
      {/* Ambient champagne mist — bottom */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-champagne/8 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">

        {/* Logo mark */}
        <div className="w-14 h-14 rounded-2xl bg-bg-surface border border-border-sage flex items-center justify-center text-sage shadow-soft mb-5">
          <Sparkles className="w-7 h-7" />
        </div>

        {/* Brand */}
        <p className="font-serif text-2xl sm:text-3xl text-text-primary font-bold tracking-wider mb-1">
          SUDERSHAN
        </p>
        <p className="text-[11px] uppercase tracking-widest text-text-secondary font-medium mb-10">
          {t('lang.tagline')}
        </p>

        {/* Divider */}
        <div className="w-full border-t border-border-subtle mb-10" />

        {/* Language prompt */}
        <p className="text-base sm:text-lg font-medium text-text-primary text-center mb-1 leading-snug">
          {t('lang.choose')}
        </p>
        <p className="text-sm text-text-secondary font-hindi text-center mb-8">
          {t('lang.choose_hi')}
        </p>

        {/* Language buttons */}
        <div className="flex flex-col gap-4 w-full">
          {/* English */}
          <button
            onClick={() => choose('en')}
            disabled={!!selecting}
            className={`w-full py-4 px-6 rounded-2xl border-2 flex items-center justify-between gap-4 transition-all duration-200 active:scale-[0.98] shadow-soft-sm ${
              selecting === 'en'
                ? 'bg-sage border-sage text-white shadow-soft'
                : 'bg-bg-surface border-border-sage hover:border-sage hover:shadow-soft text-text-primary'
            }`}
          >
            <div className="text-left">
              <p className="text-base font-bold leading-tight">{t('lang.english')}</p>
              <p className="text-xs text-text-secondary mt-0.5 font-medium">{t('lang.english_sub')}</p>
            </div>
            <span className="text-2xl">🇬🇧</span>
          </button>

          {/* Hindi */}
          <button
            onClick={() => choose('hi')}
            disabled={!!selecting}
            className={`w-full py-4 px-6 rounded-2xl border-2 flex items-center justify-between gap-4 transition-all duration-200 active:scale-[0.98] shadow-soft-sm ${
              selecting === 'hi'
                ? 'bg-sage border-sage text-white shadow-soft'
                : 'bg-bg-surface border-border-sage hover:border-sage hover:shadow-soft text-text-primary'
            }`}
          >
            <div className="text-left">
              <p className="text-base font-bold leading-tight font-hindi">{t('lang.hindi')}</p>
              <p className="text-xs text-text-secondary mt-0.5 font-medium font-hindi">{t('lang.hindi_sub')}</p>
            </div>
            <span className="text-2xl">🇮🇳</span>
          </button>
        </div>

        {/* Trust footer */}
        <p className="text-[11px] text-text-muted text-center mt-10 leading-relaxed">
          {t('lang.saved_note')}
          <br />
          <span className="font-hindi">{t('lang.saved_note_hi')}</span>
        </p>

      </div>
    </div>
  )
}

