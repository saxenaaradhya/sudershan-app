import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ImageCarousel({ items, intervalMs = 3000 }) {
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
                    className="relative flex-1 h-80 rounded-2xl overflow-hidden"
                    style={{
                      backgroundImage: `url(${cat.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4 text-left">
                      <p className="text-white font-semibold text-base">{cat.name}</p>
                      <p className="text-gray-300 text-xs">{cat.itemCount} items</p>
                    </div>
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