import { db } from '../firebase.js'
import { doc, setDoc, increment } from 'firebase/firestore'

export async function trackEvent(type, data, userId = null) {
  try {
    // Save structured data: analytics/categoryId/sessions/sessionId
    const ref = doc(db, 'analytics', data.categoryId, 'sessions', data.sessionId)
    await setDoc(ref, {
      sessionTitle: data.sessionTitle,
      categoryId: data.categoryId,
      [`${type}Count`]: increment(1),
      lastUpdated: new Date().toISOString(),
    }, { merge: true })
  } catch (err) {
    console.error('Analytics error:', err)
  }
}