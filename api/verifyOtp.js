const otpStore = {}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { phone, otp } = req.body

  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone and OTP are required' })
  }

  const record = otpStore[phone]

  if (!record) {
    return res.status(400).json({ success: false, error: 'OTP not found. Please request a new one.' })
  }

  if (Date.now() > record.expiry) {
    delete otpStore[phone]
    return res.status(400).json({ success: false, error: 'OTP expired. Please request a new one.' })
  }

  if (record.otp !== otp.trim()) {
    return res.status(400).json({ success: false, error: 'Incorrect OTP. Please try again.' })
  }

  delete otpStore[phone]
  res.status(200).json({ success: true })
}