import React, { useState, useEffect, useCallback } from 'react'

const CERTIFICATES = [
  { id: '1', image: '/images/certificates/certificates-1.png', title: 'Certificate 1' },
  { id: '2', image: '/images/certificates/certificates-2.png', title: 'Certificate 2' },
  { id: '3', image: '/images/certificates/certificates-3.png', title: 'Certificate 3' },
  { id: '4', image: '/images/certificates/certificates-4.png', title: 'Certificate 4' },
  { id: '5', image: '/images/certificates/certificates-5.png', title: 'Certificate 5' },
  { id: '6', image: '/images/certificates/certificates-6.png', title: 'Certificate 6' },
  { id: '7', image: '/images/certificates/certificates-7.png', title: 'Certificate 7' },
]

export default function ImageCarousel({ intervalMs = 3000 }) {
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
    <div className="overflow-hidden">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {items.map((cert) => (
          <div key={cert.id} className="w-full flex-shrink-0">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-dark-700 border border-dark-500">
              <img
                src={cert.image}
                alt={cert.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      {items.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {items.map((_, i) => (
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