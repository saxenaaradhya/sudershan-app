import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Lock, Unlock, Coins } from 'lucide-react'
import Navbar from '../components/layout/Navbar.jsx'
import Button from '../components/ui/Button.jsx'
import Modal from '../components/ui/Modal.jsx'
import Toast from '../components/ui/Toast.jsx'
import { CATEGORIES } from '../constants/categories.js'
import { useWalletStore } from '../store/walletStore.js'

const STRIP_COLORS = ['#E07A7A', '#E0A47A', '#D9C46A', '#9FCB6E', '#5FCBA0']

export default function CategoryDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const spendTokens = useWalletStore(s => s.spendTokens)

  const [unlocked, setUnlocked] = useState(() => {
  const saved = sessionStorage.getItem(`unlocked_${id}`)
  return saved ? JSON.parse(saved) : {}
})
  const [activeIndex, setActiveIndex] = useState(0)
  const [insufficientModal, setInsufficientModal] = useState(null)
  const [toast, setToast] = useState(null)

  const category = CATEGORIES.find(c => c.id === decodeURIComponent(id))

  if (!category) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-xl font-bold text-white mb-2">Category not found</p>
          <Button onClick={() => navigate('/home')} variant="secondary">Go Back Home</Button>
        </div>
      </div>
    )
  }

  const Icon = category.icon

  async function handleCardClick(item, index) {
    // If clicking a collapsed strip, expand it
    if (index !== activeIndex) {
      setActiveIndex(index)
      return
    }
    // If clicking the active card, access it
    if (item.free || unlocked[item.id]) {
      setToast({ message: `Now viewing: ${item.title}`, type: 'info' })
      return
    }
    const result = await spendTokens(item.tokenCost, `Unlocked: ${item.title}`)
    if (!result.success) {
      setInsufficientModal({ item })
      return
    }
    setUnlocked(prev => {
  const updated = { ...prev, [item.id]: true }
  sessionStorage.setItem(`unlocked_${id}`, JSON.stringify(updated))
  return updated
})
    setToast({ message: `🪙 ${item.tokenCost} tokens spent. ${item.title} unlocked!`, type: 'success' })
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}

      <main className="max-w-lg mx-auto px-4 sm:px-6 pt-24 pb-12">

        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> All Categories
        </button>

        {/* Category Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 rounded-2xl bg-gradient-to-br ${category.color} shrink-0`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-white">{category.name}</h1>
            <p className="text-gray-400 text-xs">{category.description}</p>
          </div>
        </div>


        {/* Category Video */}
        {category.video && (
          <div className="w-full rounded-2xl overflow-hidden mb-6 bg-dark-800 border border-dark-600">
            <video
              src={category.video}
              controls
              className="w-full h-48 object-cover"
              poster={category.image}
            />
          </div>
        )}

        {/* Stacked Cards */}
        {category.items.length === 0 ? (
          <div className="text-center py-16 bg-dark-800 border border-dark-600 rounded-2xl">
            <p className="text-4xl mb-3">📦</p>
            <p className="text-white font-semibold">No items here yet</p>
            <p className="text-sm text-gray-500 mt-1">Check back soon for new content</p>
          </div>
        ) : (
          <div className="relative flex flex-col">

            {/* Collapsed strips (items before activeIndex) */}
            <div className="flex flex-col gap-0 mb-0">
              {category.items.map((item, i) => {
                if (i >= activeIndex) return null
                const color = STRIP_COLORS[i % STRIP_COLORS.length]
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveIndex(i)}
                    className="cursor-pointer rounded-2xl flex items-center px-4 h-16 mb-[-8px] shadow-md transition-all duration-200 hover:brightness-110"
                    style={{ backgroundColor: color, zIndex: i + 1 }}
                  >
                    <span className="text-xs font-semibold text-white truncate">{item.title}</span>
                  </div>
                )
              })}
            </div>

            {/* Active expanded card */}
            {(() => {
              const item = category.items[activeIndex]
              const isUnlocked = item.free || unlocked[item.id]
              const color = STRIP_COLORS[activeIndex % STRIP_COLORS.length]
              return (
                <div
                  key={item.id}
                  className="relative rounded-2xl shadow-xl overflow-hidden min-h-[360px]"
                  style={{ backgroundColor: color }}
                >
                  {/* Full bleed background image */}
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}

                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black/55" />

                  {/* Lock overlay if locked */}
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <Lock className="w-7 h-7 text-white/80" />
                      </div>
                    </div>
                  )}

                  {/* Content overlay */}
                  <div className="relative z-10 flex flex-col justify-between min-h-[360px] p-5" onClick={e => e.stopPropagation()}>
                    {/* Top: title + token badge */}
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-white/60 mb-1 uppercase tracking-widest">
                          {isUnlocked ? 'Unlocked' : 'Locked'}
                        </p>
                        <h3 className="text-lg font-bold leading-snug" style={{ color: '#FFFFFF' }}>{item.title}</h3>
                        <p className="text-sm text-white/70 mt-1">{item.description}</p>
                      </div>
                      <div className="ml-3 shrink-0">
                        {item.free ? (
                          <span className="text-xs font-bold text-white bg-white/20 px-2 py-1 rounded-full"  style={{ color: '#FFFFFF' }}>
                            FREE
                          </span>
                        ) : (
                          <span className="text-sm font-bold bg-white/20 px-3 py-1 rounded-full" style={{ color: '#FFFFFF' }}>
                           🪙 {item.tokenCost}
                           </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom: action button + next */}
                    <div className="flex items-center justify-between mt-6">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          if (isUnlocked) {
                            navigate(`/content/${encodeURIComponent(id)}/${item.id}`)
                          } else {
                            handleCardClick(item, activeIndex)
                          }
                        }}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all
                          ${isUnlocked
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-brand-primary text-white hover:bg-brand-secondary'
                          }`}
                      >
                        {isUnlocked ? (
                          <>
                            <span className="w-5 h-5 rounded-full bg-dark-900/20 flex items-center justify-center text-xs">▶</span>
                            <span>View Content</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="w-4 h-4" />
                            Unlock · 🪙 {item.tokenCost}
                          </>
                        )}
                      </button>

                      {activeIndex < category.items.length - 1 && (
                        <button
                          onClick={() => setActiveIndex(i => i + 1)}
                          className="text-xs text-white/60 hover:text-white transition-colors"
                        >
                          Next →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })()}

            {/* Collapsed strips (items after activeIndex) */}
            <div className="flex flex-col gap-0 mt-0">
              {category.items.map((item, i) => {
                if (i <= activeIndex) return null
                const color = STRIP_COLORS[i % STRIP_COLORS.length]
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveIndex(i)}
                    className="cursor-pointer rounded-2xl flex items-center px-4 h-16 mt-[-8px] shadow-md transition-all duration-200 hover:brightness-110"
                    style={{ backgroundColor: color, zIndex: i + 1 }}
                  >
                    <span className="text-xs font-semibold text-white truncate">{item.title}</span>
                  </div>
                )
              })}
            </div>

          </div>
        )}
      </main>

      {/* Insufficient Tokens Modal */}
      <Modal
        isOpen={!!insufficientModal}
        onClose={() => setInsufficientModal(null)}
        title="Not Enough Tokens"
      >
        {insufficientModal && (
          <div className="flex flex-col gap-4">
            <div className="bg-dark-700 rounded-xl p-4 text-center">
              <p className="text-4xl mb-2">🪙</p>
              <p className="text-white font-semibold">You need {insufficientModal.item.tokenCost} tokens</p>
              <p className="text-sm text-gray-400 mt-1">
                to unlock <span className="text-white">{insufficientModal.item.title}</span>
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => { setInsufficientModal(null); navigate('/wallet') }} fullWidth>
                Go to Wallet
              </Button>
              <Button onClick={() => setInsufficientModal(null)} variant="secondary" fullWidth>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}