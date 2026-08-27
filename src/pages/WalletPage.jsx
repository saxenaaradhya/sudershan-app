import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, TrendingDown, Clock, Gift } from 'lucide-react'
import Navbar from '../components/layout/Navbar.jsx'
import Modal from '../components/ui/Modal.jsx'
import Button from '../components/ui/Button.jsx'
import Toast from '../components/ui/Toast.jsx'
import { useWalletStore } from '../store/walletStore.js'
import { useAuthStore } from '../store/authStore.js'
import Footer from '../components/layout/Footer.jsx'

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
      // 1. Create order on the backend
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

      // 2. Open Razorpay checkout
      const options = {
        key: 'rzp_live_T6AUTvIMcvsC2D',
        amount: order.amount,
        currency: order.currency,
        name: 'Sudershan Mind Therapy',
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
        theme: { color: '#D4AF6A' },
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
    <div className="min-h-screen bg-[#0C0F0E] text-[#F2F4F1]">
      <Navbar />

      {toast && (
        <div className="fixed bottom-20 right-6 z-50">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-28">

        <button
          onClick={() => navigate('/home')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9BA5A0] hover:text-[#F2F4F1] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Sanctuary
        </button>

        {/* Balance Hero Card */}
        <div className="relative overflow-hidden rounded-3xl bg-[#151A17] border border-[#D4AF6A]/30 p-6 sm:p-8 mb-8 shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF6A]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#D4AF6A] font-bold mb-1">
                Your Sanctuary Balance
              </p>
              <div className="flex items-center gap-2">
                <span className="text-4xl sm:text-5xl font-bold font-mono text-[#F2F4F1]">
                  🪙 {balance}
                </span>
                <span className="text-sm text-[#9BA5A0] self-end mb-1.5">Tokens</span>
              </div>
              <p className="text-xs text-[#9BA5A0] mt-2">
                Tokens grant permanent access to guided hypnotherapy sessions.
              </p>
            </div>

            {!dailyClaimed && (
              <button
                onClick={claimDailyReward}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#2E7D5B] text-[#F2F4F1] font-bold text-xs hover:bg-[#25664A] active:scale-95 transition-all shadow-md"
              >
                <Gift className="w-4 h-4" />
                Claim Daily +2 🪙
              </button>
            )}
          </div>
        </div>

        {/* Token Packs */}
        <div className="mb-10">
          <h2 className="font-serif text-xl text-[#F2F4F1] font-normal mb-1">Acquire Tokens</h2>
          <p className="text-xs text-[#9BA5A0] mb-5">Select a pack to instantly unlock healing sessions</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { amount: 20, price: 20, label: 'Starter', desc: 'Ideal for trying out a few sessions', badge: null },
              { amount: 80, price: 70, label: 'Sanctuary', desc: 'Most popular for continuous healing', badge: 'Recommended' },
              { amount: 150, price: 125, label: 'Mastery', desc: 'Full lifetime access across tracks', badge: 'Best Value' },
            ].map(({ amount, price, label, desc, badge }) => (
              <div
                key={amount}
                className={`relative rounded-2xl p-5 flex flex-col justify-between border transition-all duration-200 ${
                  badge
                    ? 'bg-[#1C2420] border-[#D4AF6A]/50 shadow-xl'
                    : 'bg-[#151A17] border-[#232B26] hover:border-[#D4AF6A]/30'
                }`}
              >
                {badge && (
                  <span className="absolute -top-2.5 left-4 text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#D4AF6A] text-[#0C0F0E] shadow">
                    {badge}
                  </span>
                )}

                <div>
                  <p className="text-xs font-bold text-[#D4AF6A] uppercase tracking-wider mb-2">{label}</p>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-bold font-mono text-[#F2F4F1]">{amount}</span>
                    <span className="text-xs text-[#9BA5A0]">tokens</span>
                  </div>
                  <p className="text-xs text-[#9BA5A0] mb-6">{desc}</p>
                </div>

                <div className="pt-4 border-t border-[#232B26] flex items-center justify-between">
                  <span className="text-lg font-bold text-[#F2F4F1]">₹{price}</span>
                  <button
                    onClick={() => handleBuy(amount, price)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#D4AF6A] text-[#0C0F0E] hover:bg-[#C49A4E] active:scale-95 transition-all shadow-sm"
                  >
                    Add Pack
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-[#F2F4F1] font-normal">Activity Ledger</h2>
            <span className="text-xs text-[#9BA5A0]">Last 30 Days</span>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-12 rounded-3xl bg-[#151A17] border border-[#232B26]">
              <Clock className="w-7 h-7 text-[#6B7570] mx-auto mb-2" />
              <p className="text-xs text-[#9BA5A0]">No token transactions recorded yet.</p>
            </div>
          ) : (
            <div className="rounded-3xl bg-[#151A17] border border-[#232B26] overflow-hidden shadow-sm">
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
                      i !== arr.length - 1 ? 'border-b border-[#232B26]' : ''
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      tx.type === 'credit'
                        ? 'bg-[#2E7D5B]/20 text-[#2E7D5B]'
                        : 'bg-[#3B1E1E] text-[#F87171]'
                    }`}>
                      {tx.type === 'credit' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-[#F2F4F1] truncate">{tx.label}</p>
                      <p className="text-[11px] text-[#9BA5A0] mt-0.5">{formatDate(tx.date)}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className={`text-xs sm:text-sm font-bold font-mono ${
                        tx.type === 'credit' ? 'text-[#2E7D5B]' : 'text-[#F87171]'
                      }`}>
                        {tx.type === 'credit' ? '+' : '-'}🪙 {tx.amount}
                      </p>
                      <p className="text-[10px] text-[#9BA5A0]">Bal: {tx.balanceAfter}</p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

      </main>

      {/* Confirmation Modal */}
      <Modal
        isOpen={!!confirmModal}
        onClose={() => setConfirmModal(null)}
        title="Confirm Token Top-up"
      >
        {confirmModal && (
          <div className="flex flex-col gap-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#1C2420] border border-[#D4AF6A]/30 text-[#D4AF6A] flex items-center justify-center mx-auto text-2xl">
              🪙
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#F2F4F1]">
                Add {confirmModal.amount} Tokens for ₹{confirmModal.price}
              </h3>
              <p className="text-xs text-[#9BA5A0] mt-1">
                Your new balance will become <span className="text-[#D4AF6A] font-bold">🪙 {balance + confirmModal.amount}</span>
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={confirmPurchase} fullWidth>
                Proceed with Razorpay
              </Button>
              <Button onClick={() => setConfirmModal(null)} variant="secondary" fullWidth>
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
