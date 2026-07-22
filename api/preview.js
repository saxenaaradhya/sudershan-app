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

    const { url, title, description, image } = doc.data()

    return res.status(200).send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta property="og:title" content="${title || 'Sudershan App'}" />
  <meta property="og:description" content="${description || 'Meditation and wellness'}" />
  <meta property="og:image" content="${image || ''}" />
  <meta property="og:type" content="website" />
  <meta http-equiv="refresh" content="0;url=${url}" />
  <title>${title || 'Sudershan App'}</title>
</head>
<body>Redirecting...</body>
</html>`)
  } catch (err) {
    console.error('Preview error:', err)
    return res.status(500).send('Server error')
  }
}