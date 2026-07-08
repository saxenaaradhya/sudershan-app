import crypto from 'crypto'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Initialize Firebase Admin
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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, amount } = req.body

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  if (generatedSignature !== razorpay_signature) {
    return res.status(400).json({ success: false, error: 'Invalid signature' })
  }

  // Credit tokens in Firebase from the server
  try {
    const db = getFirestore()
    const userRef = db.collection('users').doc(userId)
    const userSnap = await userRef.get()
    const data = userSnap.data()

    const newBalance = (data.balance || 0) + amount
    const newTx = {
      id: Date.now().toString(),
      type: 'credit',
      amount,
      label: `Purchased ${amount} token pack`,
      date: new Date().toISOString(),
      balanceAfter: newBalance,
    }

    await userRef.update({
      balance: newBalance,
      transactions: [newTx, ...(data.transactions || [])],
    })

    return res.status(200).json({ success: true, newBalance })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, error: 'Failed to credit tokens' })
  }
}