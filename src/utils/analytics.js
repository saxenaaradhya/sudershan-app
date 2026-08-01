import { db } from '../firebase.js'
import { doc, setDoc, increment } from 'firebase/firestore'

export async function trackEvent(type, data, userId = null) {
  try {
    const safeCategory = data.categoryId.replace(/\//g, '-').replace(/\s+/g, '_')
    const ref = doc(db, 'analytics', safeCategory, 'sessions', data.sessionId)
    await setDoc(ref, {
      sessionTitle: data.sessionTitle,
      [`${type}Count`]: increment(1),
      lastUpdated: new Date().toISOString(),
    }, { merge: true })
  } catch (err) {
    console.error('Analytics error:', err)
  }
}