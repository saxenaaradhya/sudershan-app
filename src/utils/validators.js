export function validatePhone(phone) {
  const re = /^[6-9]\d{9}$/
  if (!phone || phone.trim() === '') return 'Phone number is required.'
  if (!re.test(phone.trim())) return 'Enter a valid 10-digit Indian mobile number.'
  return null
}

export function validatePassword(password) {
  if (!password || password === '') return 'Password is required.'
  if (password.length < 6) return 'Password must be at least 6 characters.'
  return null
}

export function validateFullName(name) {
  if (!name || name.trim() === '') return 'Full name is required.'
  if (name.trim().length < 2) return 'Name must be at least 2 characters.'
  return null
}

export function validateConfirmPassword(password, confirm) {
  if (!confirm || confirm === '') return 'Please confirm your password.'
  if (password !== confirm) return 'Passwords do not match.'
  return null
}
export function validateOtp(otp) {
  if (!otp || otp.trim() === '') return 'OTP is required.'
  if (!/^\d{6}$/.test(otp.trim())) return 'Enter the 6-digit OTP.'
  return null
}