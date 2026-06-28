import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const CAROUSEL_IMAGES = [
  { id: '1', image: '/images/carousel/chronic.jpg' },
  { id: '2', image: '/images/carousel/confidence.jpg' },
  { id: '3', image: '/images/carousel/emotional.jpg' },
  { id: '4', image: '/images/carousel/habit.jpg' },
  { id: '5', image: '/images/carousel/insomnia.jpg' },
  { id: '6', image: '/images/carousel/phobia.jpg' },
  { id: '7', image: '/images/carousel/procastination.jpg' },
  { id: '8', image: '/images/carousel/stress.jpg' },
  { id: '9', image: '/images/carousel/weight.jpg' },
  { id: '10', image: '/images/carousel/performance.jpg' },
]

export default function ImageCarousel({ intervalMs = 3000 }) {
    const items = CAROUSEL_IMAGES
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)

  const pairCount = Math.max(1, Math.ceil(items.length / 2))

  const next = useCallback(() => {
    setIndex(i => (i + 1) % pairCount)
  }, [pairCount])

  useEffect(() => {
    if (items.length <= 2) return
    const timer = setInterval(next, intervalMs)
    return () => clearInterval(timer)
  }, [next, intervalMs, items.length])

  if (items.length === 0) return null

  return (
    <div className="overflow-hidden">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {Array.from({ length: pairCount }).map((_, pageIdx) => {
          const left = items[pageIdx * 2]
          const right = items[pageIdx * 2 + 1]
          return (
            <div key={pageIdx} className="flex w-full flex-shrink-0 gap-4">
              {[left, right].map((cat, i) =>
                cat ? (
                  <div
                    key={cat.id}
                   className="relative flex-1 h-80 rounded-2xl overflow-hidden bg-dark-700 border border-dark-500"
                  >
                </div>
                ) : (
                  <div key={`empty-${i}`} className="flex-1" />
                )
              )}
            </div>
          )
        })}
      </div>

      {/* Dots */}
      {pairCount > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {Array.from({ length: pairCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-6 bg-brand-primary' : 'w-1.5 bg-dark-500'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}