import { create } from 'zustand'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '../firebase.js'

export const useWalletStore = create((set, get) => ({
  balance: 0,
  transactions: [],

  initWallet: async (userId) => {
    const docSnap = await getDoc(doc(db, 'users', userId))
    if (docSnap.exists()) {
      const data = docSnap.data()
      set({
        balance: data.balance || 0,
        transactions: data.transactions || [],
      })
    }
  },

  addTokens: async (amount, label) => {
    const { balance, transactions } = get()
    const newBalance = balance + amount
    const newTx = {
      id: Date.now().toString(),
      type: 'credit',
      amount,
      label,
      date: new Date().toISOString(),
      balanceAfter: newBalance,
    }
    const newTransactions = [newTx, ...transactions]
    set({ balance: newBalance, transactions: newTransactions })

    const uid = (await import('../store/authStore.js')).useAuthStore.getState().user?.id
    if (uid) {
      await updateDoc(doc(db, 'users', uid), {
        balance: newBalance,
        transactions: newTransactions,
      })
    }
  },

  spendTokens: async (amount, label) => {
    const { balance, transactions } = get()
    if (balance < amount) return { success: false, error: 'Insufficient tokens.' }
    const newBalance = balance - amount
    const newTx = {
      id: Date.now().toString(),
      type: 'debit',
      amount,
      label,
      date: new Date().toISOString(),
      balanceAfter: newBalance,
    }
    const newTransactions = [newTx, ...transactions]
    set({ balance: newBalance, transactions: newTransactions })

    const uid = (await import('../store/authStore.js')).useAuthStore.getState().user?.id
    if (uid) {
      await updateDoc(doc(db, 'users', uid), {
        balance: newBalance,
        transactions: newTransactions,
      })
    }
    return { success: true }
  },

  resetWallet: () => set({ balance: 0, transactions: [] }),
}))