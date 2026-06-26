const otpStore = {}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { phone } = req.body

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' })
  }

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    otpStore[phone] = {
      otp,
      expiry: Date.now() + 5 * 60 * 1000
    }

    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': process.env.FAST2SMS_API_KEY,
        'Content-Type': 'application/json',
        'cache-control': 'no-cache'
      },
      body: JSON.stringify({
        route: 'otp',
        variables_values: otp,
        flash: 0,
        numbers: phone,
      })
    })

    const data = await response.json()

    if (data.return === true) {
      res.status(200).json({ success: true })
    } else {
      console.error('Fast2SMS error:', data)
      res.status(500).json({ error: 'Failed to send OTP' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong' })
  }
}