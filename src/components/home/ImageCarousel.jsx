import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const CAROUSEL_IMAGES = [
  { id: '1', image: '/images/carousel/chronic.jpg', title: 'chronic' },
  { id: '2', image: '/images/carousel/confidence.jpg', title: 'confidence' },
  { id: '3', image: '/images/carousel/emotional.jpg', title: 'emotional' },
  { id: '4', image: '/images/carousel/habit.jpg', title: 'habit' },
  { id: '5', image: '/images/carousel/insomnia.jpg', title: 'insomnia' },
  { id: '6', image: '/images/carousel/phobia.jpg', title: 'phobia' },
  { id: '7', image: '/images/carousel/procastination.jpg', title: 'procrastination' },
  { id: '8', image: '/images/carousel/stress.jpg', title: 'stress' },
  { id: '9', image: '/images/carousel/weight.jpg', title: 'weight' },
  { id: '10', image: '/images/carousel/performance.jpg', title: 'performance' },
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
                   <img src={cat.image} alt={cat.title} className="w-full h-full object-cover" />
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