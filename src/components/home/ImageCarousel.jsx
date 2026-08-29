import React, { useState, useEffect, useCallback } from 'react'
import { Award } from 'lucide-react'

const CERTIFICATES = [
  { id: '1', image: '/images/certificates/certificates-1.png', title: 'Grandmaster Reiki Healing' },
  { id: '2', image: '/images/certificates/certificates-2.png', title: 'Clinical Hypnotherapy Certified' },
  { id: '3', image: '/images/certificates/certificates-3.png', title: 'Mind Mastery & Somatics' },
  { id: '4', image: '/images/certificates/certificates-4.png', title: 'Advanced Regression Practitioner' },
  { id: '5', image: '/images/certificates/certificates-5.png', title: 'Spiritual Wellness Accreditation' },
  { id: '6', image: '/images/certificates/certificates-6.png', title: 'Holistic Mind Therapy' },
  { id: '7', image: '/images/certificates/certificates-7.png', title: 'Professional Credentials' },
]

export default function ImageCarousel({ intervalMs = 4000 }) {
  const items = CERTIFICATES
  const [index, setIndex] = useState(0)

  const next = useCallback(() => {
    setIndex(i => (i + 1) % items.length)
  }, [items.length])

  useEffect(() => {
    if (items.length <= 1) return
    const timer = setInterval(next, intervalMs)
    return () => clearInterval(timer)
  }, [next, intervalMs, items.length])

  if (items.length === 0) return null

  return (
    <div className="rounded-3xl bg-bg-surface border border-border-subtle p-5 sm:p-6 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-sage" />
          <h3 className="text-sm font-semibold text-text-primary">Verified Credentials & Accreditations</h3>
        </div>
        <span className="text-[11px] text-text-secondary font-mono">
          {index + 1} / {items.length}
        </span>
      </div>

      {/* Carousel viewport */}
      <div className="overflow-hidden rounded-2xl bg-bg-base border border-border-subtle">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {items.map((cert) => (
            <div key={cert.id} className="w-full flex-shrink-0 p-2 sm:p-4">
              <div className="relative w-full aspect-[16/10] sm:aspect-[2/1] rounded-xl overflow-hidden flex items-center justify-center bg-black/5 dark:bg-black/40">
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      {items.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? 'w-6 bg-sage' : 'w-2 bg-border-subtle hover:bg-text-muted'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}