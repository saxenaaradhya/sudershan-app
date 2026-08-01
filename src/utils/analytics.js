import { db } from '../firebase.js'
import { collection, addDoc } from 'firebase/firestore'

export async function trackEvent(type, data, userId = null) {
  try {
    await addDoc(collection(db, 'analytics'), {
      type,
      userId: userId || 'guest',
      ...data,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('Analytics error:', err)
  }
}