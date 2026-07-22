import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

export default async function handler(req, res) {
  const { code } = req.query
  if (!code) return res.status(400).send('Missing code')

  try {
    const db = getFirestore()
    const doc = await db.collection('shortlinks').doc(code).get()
    if (!doc.exists) return res.status(404).send('Link not found')
    return res.redirect(302, doc.data().url)
  } catch (err) {
    console.error('Redirect error:', err)
    return res.status(500).send('Server error')
  }
}