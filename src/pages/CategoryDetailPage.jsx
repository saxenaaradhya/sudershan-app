import React, { useState, useMemo } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Share2, Sparkles, Video, Brain, Moon, HeartPulse, Lock, Unlock, Play, Coins } from 'lucide-react'
import Navbar from '../components/layout/Navbar.jsx'
import Modal from '../components/ui/Modal.jsx'
import Toast from '../components/ui/Toast.jsx'
import BilingualText from '../components/ui/BilingualText.jsx'
import SessionCard from '../components/ui/SessionCard.jsx'
import SectionHeader from '../components/ui/SectionHeader.jsx'
import FilterPill from '../components/ui/FilterPill.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Footer from '../components/layout/Footer.jsx'
import { CATEGORIES } from '../constants/categories.js'
import { useWalletStore } from '../store/walletStore.js'
import { useAuthStore } from '../store/authStore.js'
import { trackEvent } from '../utils/analytics.js'

const FILTER_TAGS = [
  { id: 'all', label: 'All Tracks' },
  { id: 'free', label: 'Free' },
  { id: 'unlocked', label: 'Unlocked' },
  { id: 'locked', label: 'Locked' },
]

export default function CategoryDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const balance = useWalletStore(s => s.balance)
  const spendTokens = useWalletStore(s => s.spendTokens)
  const user = useAuthStore(s => s.user)

  const [activeFilter, setActiveFilter] = useState('all')
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
      <div className="min-h-screen bg-bg-base text-text-primary flex items-center justify-center p-4">
        <Navbar />
        <div className="text-center">
          <p className="text-4xl mb-3">🔍</p>
          <h2 className="text-lg font-bold text-text-primary mb-2">Category Not Found</h2>
          <button
            onClick={() => navigate('/home')}
            className="px-6 py-2.5 rounded-full bg-bg-surface border border-border-subtle text-xs font-semibold text-text-primary shadow-soft-sm"
          >
            Return to Sanctuary
          </button>
        </div>
      </div>
    )
  }

  const Icon = category.icon || Sparkles

  // Filter sessions by tag
  const filteredItems = useMemo(() => {
    if (!category.items) return []
    if (activeFilter === 'free') return category.items.filter(i => i.free)
    if (activeFilter === 'unlocked') return category.items.filter(i => i.free || unlocked[i.id])
    if (activeFilter === 'locked') return category.items.filter(i => !i.free && !unlocked[i.id])
    return category.items
  }, [category.items, activeFilter, unlocked])

  async function handleItemAccess(item) {
    const isUnlocked = item.free || unlocked[item.id]

    // 1. If session is already unlocked or free, open directly
    if (isUnlocked) {
      navigate(`/content/${encodeURIComponent(category.id)}/${item.id}`)
      return
    }

    // 2. Pure credit/token check: Try spending tokens directly (No login forced)
    const result = await spendTokens(item.tokenCost, `Unlocked: ${item.title}`)
    
    // 3. If not enough credits, show "Not enough credits. Please recharge now." modal
    if (!result.success) {
      setInsufficientModal({ item })
      return
    }

    // 4. Token deduction succeeded: Mark as unlocked and navigate to audio player
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
    <div className="min-h-screen bg-bg-base text-text-primary transition-colors duration-200">
      <Navbar />

      {toast && (
        <div className="fixed bottom-20 right-6 z-50">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-md md:max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-28">
        
        {/* Top Breadcrumb & Share Actions */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/home')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> All Journeys
          </button>

          <button
            onClick={async () => {
              const url = window.location.href
              if (navigator.share) {
                try {
                  await navigator.share({ title: category.name, url })
                } catch {}
              } else {
                navigator.clipboard.writeText(url)
                setToast({ message: 'Category link copied to clipboard!', type: 'success' })
              }
            }}
            className="p-2 rounded-full bg-bg-surface border border-border-subtle text-text-secondary hover:text-text-primary transition-all shadow-soft-sm"
            aria-label="Share Category"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* 1. CATEGORY HERO CARD */}
        <div className="relative rounded-3xl overflow-hidden border border-border-subtle bg-bg-surface p-5 sm:p-7 mb-6 shadow-soft">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 mb-4">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-sage-light border border-border-sage flex items-center justify-center text-sage shadow-soft-sm shrink-0">
              <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            
            <div className="flex-1 min-w-0">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-sage">
                Guided Clinical Hypnotherapy
              </span>
              <BilingualText
                text={category.name}
                titleClassName="font-serif text-xl sm:text-2xl font-medium text-text-primary leading-tight mt-0.5"
                subtitleClassName="text-xs sm:text-sm text-text-secondary font-hindi font-normal mt-0.5"
              />
            </div>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed mb-4">
            {category.description?.trim() || 'Scientifically structured audio sessions utilizing theta-frequency relaxation and somatic suggestion for deep mind-body recalibration.'}
          </p>

          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border-subtle">
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-bg-elevated border border-border-subtle text-text-secondary font-medium">
              🎧 {category.items?.length || 0} Sessions
            </span>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-bg-elevated border border-border-subtle text-text-secondary font-medium">
              ⚡ 432Hz Sound Healing
            </span>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-bg-elevated border border-border-subtle text-text-secondary font-medium">
              🌐 Hindi + English
            </span>
          </div>
        </div>

        {/* Video Overview (If Present) */}
        {category.video && (
          <div className="rounded-3xl overflow-hidden mb-6 bg-bg-surface border border-border-subtle shadow-soft">
            <div className="px-5 py-3 border-b border-border-subtle flex items-center gap-2">
              <Video className="w-4 h-4 text-sage" />
              <span className="text-xs font-semibold text-text-primary">Clinical Video Overview</span>
            </div>
            <video
              src={category.video}
              controls
              className="w-full max-h-60 object-cover bg-black"
              poster={category.image}
            />
          </div>
        )}

        {/* 2. FILTER PILLS */}
        {category.items?.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-6 scrollbar-none">
            {FILTER_TAGS.map(f => (
              <FilterPill
                key={f.id}
                label={f.label}
                active={activeFilter === f.id}
                onClick={() => setActiveFilter(f.id)}
              />
            ))}
          </div>
        )}

        {/* 3. SESSIONS LIST */}
        <SectionHeader
          title="Available Sessions"
          subtitle="Select a track to commence guided meditation"
          count={`${filteredItems.length} Tracks`}
        />

        {filteredItems.length === 0 ? (
          <EmptyState
            title="No sessions match this filter"
            message="Try switching back to 'All Tracks' to view all available hypnotherapy sessions."
          />
        ) : (
          <div className="space-y-3.5 sm:space-y-4">
            {filteredItems.map((item, index) => {
              const isUnlocked = item.free || unlocked[item.id]
              const isHighlighted = item.id === highlightItemId

              return (
                <SessionCard
                  key={item.id}
                  track={item}
                  trackNumber={index + 1}
                  isUnlocked={isUnlocked}
                  isHighlighted={isHighlighted}
                  onAccess={() => handleItemAccess(item)}
                />
              )
            })}
          </div>
        )}

      </main>

      {/* Insufficient Tokens / Recharge Modal */}
      <Modal
        isOpen={!!insufficientModal}
        onClose={() => setInsufficientModal(null)}
        title="Not Enough Credits"
      >
        {insufficientModal && (
          <div className="flex flex-col gap-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto text-2xl shadow-soft-sm">
              🪙
            </div>
            
            <div>
              <h3 className="text-base font-semibold text-text-primary mb-1">
                Not enough credits. Please recharge now.
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                This session requires <span className="font-semibold text-text-primary">{insufficientModal.item?.tokenCost} tokens</span>. Your current balance is <span className="font-semibold font-mono text-sage">{balance} tokens</span>.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setInsufficientModal(null)
                  if (!user) {
                    navigate('/login', { state: { redirectTo: '/wallet', mode: 'signup' } })
                  } else {
                    navigate('/wallet')
                  }
                }}
                className="w-full py-3 rounded-full bg-sage hover:bg-sage-hover text-white font-semibold text-xs active:scale-[0.98] transition-all shadow-soft"
              >
                {user ? 'Go to Wallet / Recharge' : 'Sign Up & Recharge'}
              </button>
              <button
                onClick={() => setInsufficientModal(null)}
                className="w-full py-3 rounded-full bg-bg-elevated border border-border-subtle text-text-primary font-medium text-xs hover:bg-bg-subtle transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Solid Bottom Navigation Dock */}
      <Footer />
    </div>
  )
}