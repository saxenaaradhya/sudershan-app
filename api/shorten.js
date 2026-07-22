import crypto from 'crypto'
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
  if (req.method !== 'POST') return res.status(405).end()

  const { url } = req.body
  if (!url) return res.status(400).json({ error: 'No URL provided' })

  try {
    const db = getFirestore()
    const code = crypto.randomBytes(3).toString('hex') // e.g. "a1b2c3"
    
    await db.collection('shortlinks').doc(code).set({
      url,
      createdAt: new Date().toISOString(),
    })

    const shortUrl = `${req.headers.origin}/s/${code}`
    return res.status(200).json({ shortUrl })
  } catch (err) {
    console.error('Shorten error:', err)
    return res.status(500).json({ error: err.message })
  }
}