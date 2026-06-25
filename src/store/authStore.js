import { create } from 'zustand'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth'
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  getDocs,
  collection,
  query,
  where,
} from 'firebase/firestore'
import { auth, db } from '../firebase.js'

function phoneToEmail(phone) {
  return `${phone}@tokenapp.com`
}
function generateReferralCode(fullName, uid) {
  const initials = fullName.trim().slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X')
  const suffix = uid.slice(-5).toUpperCase()
  return `${initials}${suffix}`
}

async function findUserByReferralCode(code) {
  const q = query(collection(db, 'users'), where('referralCode', '==', code))
  const snap = await getDocs(q)
  if (snap.empty) return null
  return { id: snap.docs[0].id, ...snap.docs[0].data() }
}

async function creditReferralBonus(referrerId) {
  try {
    const ref = doc(db, 'users', referrerId)
    const snap = await getDoc(ref)
    if (!snap.exists()) return
    const data = snap.data()
    const newBalance = (data.balance || 0) + 20
    const newTx = {
      id: Date.now().toString(),
      type: 'credit',
      amount: 20,
      label: 'Referral bonus',
      date: new Date().toISOString(),
      balanceAfter: newBalance,
    }
    await updateDoc(ref, {
      balance: newBalance,
      transactions: [newTx, ...(data.transactions || [])],
    })
  } catch (err) {
    console.error('Failed to credit referral bonus:', err)
  }
}

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

 init: () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const docRef = doc(db, 'users', firebaseUser.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          let userData = docSnap.data()

          if (!userData.referralCode) {
            const referralCode = generateReferralCode(userData.fullName || 'USR', firebaseUser.uid)
            await updateDoc(docRef, { referralCode })
            userData = { ...userData, referralCode }
          }

          set({ user: { id: firebaseUser.uid, ...userData }, isAuthenticated: true, loading: false })
        }
      } else {
        set({ user: null, isAuthenticated: false, loading: false })
      }
    })
  },

  signUp: async (fullName, phone, password, referralCodeInput) => {
    try {
      const email = phoneToEmail(phone)
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      const referralCode = generateReferralCode(fullName, cred.user.uid)

      let referredBy = null
      if (referralCodeInput && referralCodeInput.trim()) {
        const referrer = await findUserByReferralCode(referralCodeInput.trim().toUpperCase())
        if (referrer) {
          referredBy = referrer.id
          await creditReferralBonus(referrer.id)
        }
      }

      const newUser = {
        fullName,
        phone,
        avatar: fullName.charAt(0).toUpperCase(),
        joinedAt: new Date().toISOString(),
        balance: 0,
        unlockedContent: [],
        referralCode,
        referredBy,
      }
      await setDoc(doc(db, 'users', cred.user.uid), newUser)
      set({ user: { id: cred.user.uid, ...newUser }, isAuthenticated: true })
      return { success: true }
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        return { success: false, error: 'An account with this phone number already exists.' }
      }
      return { success: false, error: err.message }
    }
  },

  signIn: async (phone, password) => {
    try {
      const email = phoneToEmail(phone)
      const cred = await signInWithEmailAndPassword(auth, email, password)
      const docSnap = await getDoc(doc(db, 'users', cred.user.uid))
      if (docSnap.exists()) {
        set({ user: { id: cred.user.uid, ...docSnap.data() }, isAuthenticated: true })
      }
      return { success: true }
    } catch (err) {
      return { success: false, error: 'Invalid phone number or password.' }
    }
  },

  loginByPhone: async (phone) => {
    try {
      const users = []
      const { getDocs, collection, query, where } = await import('firebase/firestore')
      const q = query(collection(db, 'users'), where('phone', '==', phone))
      const snap = await getDocs(q)
      if (snap.empty) return { success: false, error: 'No account found with this phone number.' }
      const userData = snap.docs[0].data()
      const uid = snap.docs[0].id
      set({ user: { id: uid, ...userData }, isAuthenticated: true })
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  },

  updateProfile: async (updates) => {
    const uid = get().user?.id
    if (!uid) return
    await updateDoc(doc(db, 'users', uid), updates)
    set({ user: { ...get().user, ...updates } })
  },

  signOut: async () => {
    await firebaseSignOut(auth)
    set({ user: null, isAuthenticated: false })
  },
}))