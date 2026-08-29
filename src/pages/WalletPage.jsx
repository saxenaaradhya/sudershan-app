import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, TrendingDown, Clock, Gift, ShieldCheck, Sparkles, Zap, Star, Coins } from 'lucide-react'
import Navbar from '../components/layout/Navbar.jsx'
import Modal from '../components/ui/Modal.jsx'
import Toast from '../components/ui/Toast.jsx'
import SectionHeader from '../components/ui/SectionHeader.jsx'
import Badge from '../components/ui/Badge.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { useWalletStore } from '../store/walletStore.js'
import { useAuthStore } from '../store/authStore.js'
import Footer from '../components/layout/Footer.jsx'

const PACKS = [
  { amount: 20, price: 20, label: 'Starter', desc: 'Ideal for trying out a few sessions', badge: null, icon: Coins },
  { amount: 80, price: 70, label: 'Sanctuary', desc: 'Most popular for continuous healing', badge: 'Recommended', icon: Star },
  { amount: 150, price: 125, label: 'Mastery', desc: 'Full lifetime access across all tracks', badge: 'Best Value', icon: Zap },
]

export default function WalletPage() {
  const navigate = useNavigate()
  const balance = useWalletStore(s => s.balance)  
  const addTokens = useWalletStore(s => s.addTokens)
  const transactions = useWalletStore(s => s.transactions)
  const initWallet = useWalletStore(s => s.initWallet)
  const user = useAuthStore(s => s.user)
  
  const [confirmModal, setConfirmModal] = useState(null)
  const [toast, setToast] = useState(null)
  const [dailyClaimed, setDailyClaimed] = useState(() => {
    const last = localStorage.getItem('lastDailyClaim')
    if (!last) return false
    return Date.now() - new Date(last).getTime() < 24 * 60 * 60 * 1000
  })

  function handleBuy(amount, price) {
    setConfirmModal({ amount, price })
  }

  async function claimDailyReward() {
    await addTokens(2, '🎁 Daily reward')
    localStorage.setItem('lastDailyClaim', new Date().toISOString())
    setDailyClaimed(true)
    setToast({ message: '🎁 You claimed your 2 daily tokens!', type: 'success' })
  }

  async function confirmPurchase() {
    const { amount, price } = confirmModal

    try {
      const orderRes = await fetch('/api/createOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: price }),
      })
      const order = await orderRes.json()

      if (!order.id) {
        setToast({ message: 'Failed to start payment. Try again.', type: 'error' })
        return
      }

      const options = {
        key: 'rzp_live_T6AUTvIMcvsC2D',
        amount: order.amount,
        currency: order.currency,
        name: 'Sudershan Clinical Hypnotherapy',
        description: `${amount} Sanctuary Tokens`,
        order_id: order.id,
        prefill: {
          name: user?.fullName || '',
          contact: user?.phone || '',
        },
        handler: async function (response) {
          const verifyRes = await fetch('/api/verifyPayment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...response,
              userId: user?.id,
              amount,
            }),
          })
          const result = await verifyRes.json()

          if (result.success) {
            await initWallet(user?.id)
            setToast({ message: `🪙 ${amount} tokens added to your wallet!`, type: 'success' })
          } else {
            setToast({ message: 'Payment verification failed.', type: 'error' })
          }
          setConfirmModal(null)
        },
        modal: {
          ondismiss: function () {
            setConfirmModal(null)
          },
        },
        theme: { color: '#2E5643' },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error(err)
      setToast({ message: 'Something went wrong. Try again.', type: 'error' })
      setConfirmModal(null)
    }
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-bg-base text-text-primary transition-colors duration-200">
      <Navbar />

      {toast && (
        <div className="fixed bottom-20 right-6 z-50">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}

      <main className="max-w-md md:max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-28">

        {/* Back Navigation */}
        <button
          onClick={() => navigate('/home')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Sanctuary
        </button>

        {/* 1. REFINED SANCTUARY PASS CARD */}
        <div className="relative overflow-hidden rounded-3xl bg-bg-surface border border-border-champagne p-6 sm:p-7 mb-8 shadow-soft-lg">
          <div className="absolute top-0 right-0 w-48 h-48 bg-champagne-surface rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-champagne" />
                <p className="text-[11px] uppercase tracking-widest text-text-secondary font-semibold">
                  Sanctuary Access Pass
                </p>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-bold font-mono text-text-primary">
                  🪙 {balance}
                </span>
                <span className="text-xs text-text-secondary font-medium">Tokens Active</span>
              </div>
              <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                Tokens grant permanent, lifetime access to all guided hypnotherapy sessions.
              </p>
            </div>

            {!dailyClaimed && (
              <button
                onClick={claimDailyReward}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sage hover:bg-sage-hover text-white font-semibold text-xs active:scale-[0.98] transition-all shadow-soft shrink-0"
              >
                <Gift className="w-4 h-4" />
                Claim Daily +2 🪙
              </button>
            )}
          </div>
        </div>

        {/* 2. TOKEN ACQUISITION PACKS */}
        <section className="mb-10">
          <SectionHeader
            title="Acquire Sanctuary Tokens"
            subtitle="Select a pack to instantly unlock healing sessions"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
            {PACKS.map(({ amount, price, label, desc, badge, icon: Icon }) => (
              <div
                key={amount}
                className={`relative rounded-3xl p-5 sm:p-6 flex flex-col justify-between border transition-all duration-200 ${
                  badge
                    ? 'bg-bg-surface border-border-sage shadow-soft-lg ring-1 ring-sage/15'
                    : 'bg-bg-surface border-border-subtle hover:border-border-sage hover:shadow-soft'
                }`}
              >
                {badge && (
                  <span className="absolute -top-2.5 left-4 text-[9px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-sage text-white shadow-soft-sm">
                    {badge}
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{label}</p>
                    <Icon className="w-4 h-4 text-sage" />
                  </div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-2xl sm:text-3xl font-bold font-mono text-text-primary">{amount}</span>
                    <span className="text-xs text-text-secondary">tokens</span>
                  </div>
                  <p className="text-xs text-text-secondary mb-5 leading-relaxed">{desc}</p>
                </div>

                <div className="pt-3.5 border-t border-border-subtle flex items-center justify-between">
                  <span className="text-base sm:text-lg font-bold font-mono text-text-primary">₹{price}</span>
                  <button
                    onClick={() => handleBuy(amount, price)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold active:scale-[0.98] transition-all shadow-soft-sm ${
                      badge
                        ? 'bg-sage hover:bg-sage-hover text-white'
                        : 'bg-bg-elevated hover:bg-bg-subtle text-text-primary border border-border-subtle'
                    }`}
                  >
                    Add Pack
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-text-muted">
            <ShieldCheck className="w-4 h-4 text-sage" />
            <span>Secure 256-bit encrypted payments powered by Razorpay</span>
          </div>
        </section>

        {/* 3. ACTIVITY LEDGER */}
        <section>
          <SectionHeader
            title="Activity Ledger"
            subtitle="Complete record of token deductions & top-ups"
            count="Last 30 Days"
          />

          {transactions.length === 0 ? (
            <EmptyState
              icon={Clock}
              title="No token transactions recorded yet"
              message="Your session unlocks and daily bonus credits will appear here."
            />
          ) : (
            <div className="rounded-3xl bg-bg-surface border border-border-subtle overflow-hidden shadow-soft">
              {transactions
                .filter(tx => {
                  const oneMonthAgo = new Date()
                  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
                  return new Date(tx.date) >= oneMonthAgo
                })
                .map((tx, i, arr) => (
                  <div
                    key={tx.id}
                    className={`flex items-center gap-4 px-5 py-4 ${
                      i !== arr.length - 1 ? 'border-b border-border-subtle' : ''
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      tx.type === 'credit'
                        ? 'bg-sage-light text-sage'
                        : 'bg-red-500/10 text-red-600 dark:text-red-400'
                    }`}>
                      {tx.type === 'credit' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-text-primary truncate">{tx.label}</p>
                      <p className="text-[11px] text-text-secondary mt-0.5">{formatDate(tx.date)}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className={`text-xs sm:text-sm font-bold font-mono ${
                        tx.type === 'credit' ? 'text-sage' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {tx.type === 'credit' ? '+' : '-'}🪙 {tx.amount}
                      </p>
                      <p className="text-[10px] text-text-secondary">Bal: {tx.balanceAfter}</p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>

      </main>

      {/* Confirmation Modal */}
      <Modal
        isOpen={!!confirmModal}
        onClose={() => setConfirmModal(null)}
        title="Confirm Token Top-up"
      >
        {confirmModal && (
          <div className="flex flex-col gap-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-sage-light border border-border-sage text-sage flex items-center justify-center mx-auto text-2xl shadow-soft-sm">
              🪙
            </div>

            <div>
              <h3 className="text-base font-bold text-text-primary">
                Add {confirmModal.amount} Tokens for ₹{confirmModal.price}
              </h3>
              <p className="text-xs text-text-secondary mt-1">
                Your new balance will become <span className="text-sage font-bold">🪙 {balance + confirmModal.amount}</span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={confirmPurchase}
                className="w-full py-3 rounded-full bg-sage hover:bg-sage-hover text-white font-semibold text-xs active:scale-[0.98] transition-all shadow-soft"
              >
                Proceed with Razorpay
              </button>
              <button
                onClick={() => setConfirmModal(null)}
                className="w-full py-3 rounded-full bg-bg-elevated border border-border-subtle text-text-primary font-medium text-xs hover:bg-bg-subtle transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Footer />
    </div>
  )
}
