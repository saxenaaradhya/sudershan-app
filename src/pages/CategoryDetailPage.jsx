import React, { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Lock, Unlock, Play, Sparkles, Video } from 'lucide-react'
import Navbar from '../components/layout/Navbar.jsx'
import Modal from '../components/ui/Modal.jsx'
import Button from '../components/ui/Button.jsx'
import Toast from '../components/ui/Toast.jsx'
import Footer from '../components/layout/Footer.jsx'
import { CATEGORIES } from '../constants/categories.js'
import { useWalletStore } from '../store/walletStore.js'
import { useAuthStore } from '../store/authStore.js'
import { trackEvent } from '../utils/analytics.js'

function BilingualText({ text, en, hi, className = '', titleClassName = 'font-serif text-xl sm:text-2xl font-normal text-[#F2F4F1] leading-snug', subtitleClassName = 'text-xs text-[#9BA5A0] font-hindi font-normal mt-0.5' }) {
  let primary = en
  let secondary = hi

  if (text && (!primary || !secondary)) {
    if (text.includes('/')) {
      const parts = text.split('/')
      primary = parts[0]?.trim()
      secondary = parts.slice(1).join('/')?.trim()
    } else {
      primary = text
    }
  }

  return (
    <div className={`flex flex-col leading-tight ${className}`}>
      <span className={titleClassName}>{primary}</span>
      {secondary && (
        <span className={subtitleClassName}>{secondary}</span>
      )}
    </div>
  )
}

export default function CategoryDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const spendTokens = useWalletStore(s => s.spendTokens)
  const user = useAuthStore(s => s.user)

  const [unlocked, setUnlocked] = useState(() => {
    const saved = sessionStorage.getItem(`unlocked_${id}`)
    return saved ? JSON.parse(saved) : {}
  })

  const [insufficientModal, setInsufficientModal] = useState(null)
  const [toast, setToast] = useState(null)

  const category = CATEGORIES.find(c => c.id === decodeURIComponent(id))
  const [searchParams] = useSearchParams()
  const highlightItemId = searchParams.get('item')

  if (!category) {
    return (
      <div className="min-h-screen bg-[#0C0F0E] text-[#F2F4F1] flex items-center justify-center p-4">
        <Navbar />
        <div className="text-center">
          <p className="text-4xl mb-3">🔍</p>
          <h2 className="text-lg font-bold text-[#F2F4F1] mb-2">Category Not Found</h2>
          <Button onClick={() => navigate('/home')} variant="secondary">
            Return to Sanctuary
          </Button>
        </div>
      </div>
    )
  }

  const Icon = category.icon

  async function handleItemAccess(item) {
    const isUnlocked = item.free || unlocked[item.id]

    if (isUnlocked) {
      navigate(`/content/${encodeURIComponent(category.id)}/${item.id}`)
      return
    }

    if (!user) {
      setInsufficientModal({ notLoggedIn: true, item })
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
    trackEvent('unlock', {
      sessionId: item.id,
      sessionTitle: item.title,
      categoryId: id,
      tokenCost: item.tokenCost,
    }, user?.id)

    navigate(`/content/${encodeURIComponent(category.id)}/${item.id}`)
  }

  return (
    <div className="min-h-screen bg-[#0C0F0E] text-[#F2F4F1]">
      <Navbar />

      {toast && (
        <div className="fixed bottom-20 right-6 z-50">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-28">
        
        {/* Back Link */}
        <button
          onClick={() => navigate('/home')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9BA5A0] hover:text-[#F2F4F1] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> All Categories
        </button>

        {/* Category Header Hero */}
        <div className="relative rounded-3xl overflow-hidden border border-[#232B26] bg-[#151A17] p-6 sm:p-8 mb-8 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#1C2420] border border-[#D4AF6A]/30 flex items-center justify-center text-[#D4AF6A] shadow-md shrink-0">
              {Icon ? <Icon className="w-7 h-7" /> : <Sparkles className="w-7 h-7" />}
            </div>
            
            <div className="flex-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF6A]">
                Guided Hypnotherapy
              </span>
              <BilingualText
                text={category.name}
                titleClassName="font-serif text-2xl sm:text-3xl font-medium text-[#F2F4F1] leading-tight"
                subtitleClassName="text-sm text-[#9BA5A0] font-hindi font-normal mt-0.5"
              />
              <p className="text-xs text-[#9BA5A0] mt-2 leading-relaxed">
                {category.description || 'Scientifically structured audio sessions to guide the subconscious mind into deep states of calm and alignment.'}
              </p>
            </div>
          </div>
        </div>

        {/* Video Preview if available */}
        {category.video && (
          <div className="rounded-3xl overflow-hidden mb-8 bg-[#151A17] border border-[#232B26] shadow-lg">
            <div className="px-5 py-3 border-b border-[#232B26] flex items-center gap-2">
              <Video className="w-4 h-4 text-[#D4AF6A]" />
              <span className="text-xs font-semibold text-[#F2F4F1]">Introductory Overview</span>
            </div>
            <video
              src={category.video}
              controls
              className="w-full max-h-64 object-cover"
              poster={category.image}
            />
          </div>
        )}

        {/* Sessions List */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-xl text-[#F2F4F1] font-normal">Available Sessions</h2>
          <span className="text-xs font-mono text-[#D4AF6A]">{category.items?.length || 0} Tracks</span>
        </div>

        {(!category.items || category.items.length === 0) ? (
          <div className="text-center py-16 rounded-3xl bg-[#151A17] border border-[#232B26]">
            <p className="text-4xl mb-3">🌿</p>
            <h3 className="text-sm font-semibold text-[#F2F4F1]">New Sessions Coming Soon</h3>
            <p className="text-xs text-[#9BA5A0] mt-1">Mr. Sandeep is preparing new frequencies for this journey.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {category.items.map((item, index) => {
              const isUnlocked = item.free || unlocked[item.id]
              const isHighlighted = item.id === highlightItemId

              return (
                <div
                  key={item.id}
                  onClick={() => handleItemAccess(item)}
                  className={`group relative rounded-2xl overflow-hidden border p-4 sm:p-5 bg-[#151A17] cursor-pointer transition-all duration-200 shadow-sm ${
                    isHighlighted
                      ? 'border-[#D4AF6A] bg-[#1C2420]'
                      : 'border-[#232B26] hover:border-[#D4AF6A]/40 hover:bg-[#1C2420]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Session Thumbnail */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-[#232B26] bg-[#0C0F0E]">
                      <img
                        src={item.image || category.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {!isUnlocked && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                          <Lock className="w-5 h-5 text-[#D4AF6A]" />
                        </div>
                      )}
                    </div>

                    {/* Session Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-[#D4AF6A] uppercase tracking-wider">
                          Track {index + 1}
                        </span>
                        {isUnlocked ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2E7D5B]/20 border border-[#2E7D5B]/40 text-[#2E7D5B] font-semibold">
                            Unlocked
                          </span>
                        ) : item.free ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF6A]/15 border border-[#D4AF6A]/30 text-[#D4AF6A] font-semibold">
                            Free
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1C2420] border border-[#232B26] text-[#9BA5A0] font-mono">
                            🪙 {item.tokenCost} Tokens
                          </span>
                        )}
                      </div>

                      <BilingualText
                        text={item.title}
                        titleClassName="text-sm sm:text-base font-semibold text-[#F2F4F1] truncate group-hover:text-[#D4AF6A] transition-colors"
                        subtitleClassName="text-xs text-[#9BA5A0] font-hindi truncate mt-0.5"
                      />

                      <p className="text-xs text-[#9BA5A0] line-clamp-1 mt-1">
                        {item.description}
                      </p>
                    </div>

                    {/* Action Trigger */}
                    <div className="shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isUnlocked
                          ? 'bg-[#2E7D5B] text-[#F2F4F1] group-hover:scale-110 shadow-md'
                          : 'bg-[#D4AF6A] text-[#0C0F0E] group-hover:scale-110 shadow-md'
                      }`}>
                        {isUnlocked ? (
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        ) : (
                          <Unlock className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Insufficient Tokens / Login Modal */}
      <Modal
        isOpen={!!insufficientModal}
        onClose={() => setInsufficientModal(null)}
        title={insufficientModal?.notLoggedIn ? 'Sign In Required' : 'Unlock Session'}
      >
        {insufficientModal && (
          <div className="flex flex-col gap-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#1C2420] border border-[#D4AF6A]/30 text-[#D4AF6A] flex items-center justify-center mx-auto text-2xl">
              {insufficientModal.notLoggedIn ? '🔐' : '🪙'}
            </div>
            
            <div>
              <h3 className="text-base font-semibold text-[#F2F4F1] mb-1">
                {insufficientModal.notLoggedIn
                  ? 'Sign in to unlock this sanctuary track'
                  : `Unlock "${insufficientModal.item.title}"`}
              </h3>
              <p className="text-xs text-[#9BA5A0]">
                {insufficientModal.notLoggedIn
                  ? 'Create an account to manage your tokens and unlock lifetime access to all guided hypnotherapy sessions.'
                  : `This session requires ${insufficientModal.item.tokenCost} tokens. Top up your wallet to continue.`}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setInsufficientModal(null)
                  navigate(insufficientModal.notLoggedIn ? '/login' : '/wallet')
                }}
                fullWidth
              >
                {insufficientModal.notLoggedIn ? 'Sign In / Register' : 'Add Tokens'}
              </Button>
              <Button onClick={() => setInsufficientModal(null)} variant="secondary" fullWidth>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Footer />
    </div>
  )
}