import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, TrendingDown, Clock } from 'lucide-react'
import Navbar from '../components/layout/Navbar.jsx'
import TokenCard from '../components/wallet/TokenCard.jsx'
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
   const user = useAuthStore(s => s.user)
  const [confirmModal, setConfirmModal] = useState(null) // { amount, price }
  const [toast, setToast] = useState(null)

  function handleBuy(amount, price) {
    setConfirmModal({ amount, price })
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
        key: 'rzp_test_T5abuJqGx94vMv',
        amount: order.amount,
        currency: order.currency,
        name: 'Sudershan',
        description: `${amount} Tokens`,
        order_id: order.id,
        prefill: {
          name: user?.fullName || '',
          contact: user?.phone || '',
        },
        handler: async function (response) {
          // 3. Verify payment on the backend
          const verifyRes = await fetch('/api/verifyPayment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          })
          const result = await verifyRes.json()

          if (result.success) {
            addTokens(amount, `Purchased ${amount} token pack`)
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
        theme: { color: '#7C3AED' },
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
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-12">

        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <h1 className="text-2xl font-bold text-white mb-6">My Wallet</h1>

        {/* Balance Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-brand-primary/30 to-brand-secondary/20
          border border-brand-primary/40 rounded-2xl p-5 sm:p-6 mb-6 sm:mb-8">
          <div className="absolute top-0 right-0 w-40 h-40 bg-brand-primary/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <p className="text-xs sm:text-sm text-gray-400 mb-1 uppercase tracking-widest font-medium">Current Balance</p>
          <p className="text-4xl sm:text-5xl font-bold text-white mb-1">🪙 {balance}</p>
          <p className="text-sm text-gray-500">tokens available to spend</p>
        </div>

        {/* Token Packs */}
        <h2 className="text-lg font-semibold text-white mb-4">Add Tokens</h2>
        <div className="flex flex-col gap-3 mb-8 sm:mb-10">
          {[
            { amount: 10, price: 10, label: 'STARTER', desc: 'Perfect for trying things out', badge: null },
            { amount: 50, price: 40, label: 'POPULAR', desc: 'Best value for regular users', badge: 'Most Popular' },
            { amount: 100, price: 75, label: 'PRO', desc: 'Unlock everything without limits', badge: 'Best Deal' },
          ].map(({ amount, price, label, desc, badge }) => (
            <div key={amount} className="relative bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
              {badge && (
                <span className="absolute -top-2.5 left-4 text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-primary text-white">
                  {badge}
                </span>
              )}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-dark-700 flex items-center justify-center text-2xl shrink-0">
                  🪙
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</p>
                  <p className="text-2xl font-bold text-white">{amount} <span className="text-sm font-normal text-gray-400">tokens</span></p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <p className="text-lg font-bold text-white">₹{price}</p>
                <button
                  onClick={() => handleBuy(amount, price)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-brand-primary text-white hover:bg-brand-secondary transition-all duration-200"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Transaction History */}
        <h2 className="text-lg font-semibold text-white mb-4">Transaction History</h2>

        {transactions.length === 0 ? (
          <div className="text-center py-12 bg-dark-800 border border-dark-600 rounded-2xl">
            <p className="text-3xl mb-3">📋</p>
            <p className="text-white font-medium">No transactions yet</p>
            <p className="text-sm text-gray-500 mt-1">Your token activity will appear here</p>
          </div>
        ) : (
          <div className="bg-dark-800 border border-dark-600 rounded-2xl overflow-hidden">
            {transactions.map((tx, i) => (
              <div
                key={tx.id}
                className={`flex items-center gap-3 sm:gap-4 px-3 sm:px-5 py-3 sm:py-4
                  ${i !== transactions.length - 1 ? 'border-b border-dark-600' : ''}`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0
                  ${tx.type === 'credit'
                    ? 'bg-emerald-900/50 text-emerald-400'
                    : 'bg-red-900/50 text-red-400'
                  }`}>
                  {tx.type === 'credit'
                    ? <TrendingUp className="w-4 h-4" />
                    : <TrendingDown className="w-4 h-4" />
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{tx.label}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" /> {formatDate(tx.date)}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className={`text-sm font-bold
                    ${tx.type === 'credit' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {tx.type === 'credit' ? '+' : '-'}🪙 {tx.amount}
                  </p>
                  <p className="text-xs text-gray-500">bal: {tx.balanceAfter}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Confirm Purchase Modal */}
      <Modal
        isOpen={!!confirmModal}
        onClose={() => setConfirmModal(null)}
        title="Confirm Purchase"
      >
        {confirmModal && (
          <div className="flex flex-col gap-5">
            <div className="bg-dark-700 rounded-xl p-4 text-center">
              <p className="text-4xl font-bold text-white mb-1">🪙 {confirmModal.amount}</p>
              <p className="text-gray-400 text-sm">tokens for ₹{confirmModal.price}</p>
            </div>
            <p className="text-sm text-gray-400 text-center">
              Your new balance will be <span className="text-white font-semibold">🪙 {balance + confirmModal.amount}</span>
            </p>
            <div className="flex gap-3">
              <Button onClick={confirmPurchase} fullWidth>Confirm Payment</Button>
              <Button onClick={() => setConfirmModal(null)} variant="secondary" fullWidth>Cancel</Button>
            </div>
          </div>
        )}
      </Modal>
      <Footer />
    </div>
  )
}
