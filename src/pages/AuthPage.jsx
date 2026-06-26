import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { RecaptchaVerifier, signInWithPhoneNumber, signOut as firebaseSignOut } from 'firebase/auth'
import { auth } from '../firebase.js'
import { useAuthStore } from '../store/authStore.js'
import { useWalletStore } from '../store/walletStore.js'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import Modal from '../components/ui/Modal.jsx'
import {
  validatePhone,
  validatePassword,
  validateFullName,
  validateConfirmPassword,
  validateOtp,
} from '../utils/validators.js'

export default function AuthPage() {
  const navigate = useNavigate()
  const signIn = useAuthStore(s => s.signIn)
  const signUp = useAuthStore(s => s.signUp)
  const loginByPhone = useAuthStore(s => s.loginByPhone)
  const initWallet = useWalletStore(s => s.initWallet)

  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [forgotOpen, setForgotOpen] = useState(false)
  const [forgotPhone, setForgotPhone] = useState('')
  const [forgotSent, setForgotSent] = useState(false)
  const [globalError, setGlobalError] = useState('')

  // OTP states for Sign Up phone verification
  const [signupOtp, setSignupOtp] = useState('')
  const [signupOtpSent, setSignupOtpSent] = useState(false)
  const [signupOtpVerified, setSignupOtpVerified] = useState(false)
  const [signupOtpError, setSignupOtpError] = useState('')
  const confirmationResultRef = useRef(null)
  const recaptchaVerifierRef = useRef(null)

  // OTP states for Forgot Password
  const [forgotOtp, setForgotOtp] = useState('')
  const [forgotOtpSent, setForgotOtpSent] = useState(false)
  const [forgotOtpVerified, setForgotOtpVerified] = useState(false)
  const [forgotOtpError, setForgotOtpError] = useState('')
  const forgotConfirmationResultRef = useRef(null)
  const forgotRecaptchaVerifierRef = useRef(null)

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
  })  

  const [errors, setErrors] = useState({})

  function setField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: null }))
    setGlobalError('')
  }

  function validateSignIn() {
    const errs = {}
    const phoneErr = validatePhone(form.phone)
    const passErr = validatePassword(form.password)
    if (phoneErr) errs.phone = phoneErr
    if (passErr) errs.password = passErr
    return errs
  }

  function validateSignUp() {
    const errs = {}
    const nameErr = validateFullName(form.fullName)
    const phoneErr = validatePhone(form.phone)
    const passErr = validatePassword(form.password)
    const confirmErr = validateConfirmPassword(form.password, form.confirmPassword)
    if (nameErr) errs.fullName = nameErr
    if (phoneErr) errs.phone = phoneErr
    if (passErr) errs.password = passErr
    if (confirmErr) errs.confirmPassword = confirmErr
    return errs
  }

  async function handleSubmit() {
    const errs = mode === 'signin' ? validateSignIn() : validateSignUp()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setLoading(true)

    let result
    if (mode === 'signin') {
      result = await signIn(form.phone, form.password)
    } else {
      result = await signUp(form.fullName, form.phone, form.password, form.referralCode)  
    }
    setLoading(false)

    if (!result.success) {
      setGlobalError(result.error)
      return
    }

    const userId = useAuthStore.getState().user?.id
    if (userId) initWallet(userId)
    navigate('/home')
  }

  // ── OTP helpers ─────────────────────────────────────────────
  // 🔌 REAL SMS INTEGRATION POINT:
  // Replace the two lines that do `alert(...)` below with an API
  // call to your backend, e.g.:
  //   await fetch('/api/send-otp', { method:'POST', body: JSON.stringify({ phone, otp }) })
  // Your backend then calls MSG91 / Fast2SMS / Twilio to deliver it.
  // Everything else in this file stays exactly the same.

  function handleSendSignupOtp() {
    const phoneErr = validatePhone(form.phone)
    if (phoneErr) {
      setErrors(prev => ({ ...prev, phone: phoneErr }))
      return
    }

    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      })
    }

    const fullPhone = `+91${form.phone.trim()}`

    signInWithPhoneNumber(auth, fullPhone, recaptchaVerifierRef.current)
      .then((confirmationResult) => {
        confirmationResultRef.current = confirmationResult
        setSignupOtpSent(true)
        setSignupOtp('')
        setSignupOtpError('')
      })
      .catch((err) => {
        console.error(err)
        setErrors(prev => ({ ...prev, phone: 'Failed to send OTP. Try again.' }))
      })
  }

  async function handleVerifySignupOtp() {
    const otpErr = validateOtp(signupOtp)
    if (otpErr) { setSignupOtpError(otpErr); return }

    try {
      await confirmationResultRef.current.confirm(signupOtp.trim())
      await firebaseSignOut(auth)
      setSignupOtpVerified(true)
      setSignupOtpError('')
    } catch (err) {
      setSignupOtpError('Incorrect OTP. Please try again.')
    }
  }

  function handleForgot() {
    const phoneErr = validatePhone(forgotPhone)
    if (phoneErr) { setForgotOtpError(phoneErr); return }

    const users = JSON.parse(localStorage.getItem('tokenapp_users') || '[]')
    const exists = users.find(u => u.phone === forgotPhone.trim())
    if (!exists) { setForgotOtpError('No account found with this phone number.'); return }

    if (!forgotRecaptchaVerifierRef.current) {
      forgotRecaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container-forgot', {
        size: 'invisible',
      })
    }

    const fullPhone = `+91${forgotPhone.trim()}`

    signInWithPhoneNumber(auth, fullPhone, forgotRecaptchaVerifierRef.current)
      .then((confirmationResult) => {
        forgotConfirmationResultRef.current = confirmationResult
        setForgotOtpSent(true)
        setForgotOtp('')
        setForgotOtpError('')
      })
      .catch((err) => {
        console.error(err)
        setForgotOtpError('Failed to send OTP. Try again.')
      })
  }

  async function handleVerifyForgotOtp() {
    const otpErr = validateOtp(forgotOtp)
    if (otpErr) { setForgotOtpError(otpErr); return }

    try {
      await forgotConfirmationResultRef.current.confirm(forgotOtp.trim())
      await firebaseSignOut(auth)
      setForgotOtpVerified(true)
      setForgotOtpError('')

      // Auto login the user
      const result = loginByPhone(forgotPhone)
      if (result.success) {
        const userId = useAuthStore.getState().user?.id
        if (userId) initWallet(userId)
        setForgotOpen(false)
        navigate('/home')
      }
    } catch (err) {
      setForgotOtpError('Incorrect OTP. Please try again.')
    }
  }
    }
    setForgotOtpVerified(true)
    setForgotOtpError('')
    // Auto login the user
    const result = loginByPhone(forgotPhone)
    if (result.success) {
      const userId = useAuthStore.getState().user?.id
      if (userId) initWallet(userId)
      setForgotOpen(false)
      navigate('/home')
    }
  
  

  function switchMode(newMode) {
    setMode(newMode)
    setErrors({})
    setGlobalError('')
    setForm({ fullName: '', phone: '', password: '', confirmPassword: '', referralCode: '' })
    setSignupOtp('')
    setSignupOtpSent(false)
    setSignupOtpVerified(false)
    setSignupOtpError('')
    confirmationResultRef.current = null
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 py-8">
      <div id="recaptcha-container"></div>
      <div id="recaptcha-container-forgot"></div>
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-brand-secondary/8 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-brand-primary shadow-2xl shadow-brand-primary/40 mb-3 sm:mb-4">
            <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">TokenApp</h1>
          <p className="text-gray-400 mt-1.5 text-sm">Your all-in-one token platform</p>
        </div>

        {/* Card */}
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5 sm:p-8 shadow-2xl">
        </div>

        {/* Card */}
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-8 shadow-2xl">

          {/* Tab Toggle */}
          <div className="flex bg-dark-900 rounded-xl p-1 mb-6">
            <button
              onClick={() => switchMode('signin')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200
                ${mode === 'signin' ? 'bg-brand-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => switchMode('signup')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200
                ${mode === 'signup' ? 'bg-brand-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              Sign Up
            </button>
          </div>

          {/* Global Error */}
          {globalError && (
            <div className="mb-4 px-4 py-3 bg-red-900/50 border border-red-700 rounded-xl">
              <p className="text-sm text-red-300">{globalError}</p>
            </div>
          )}

          {/* Form Fields */}
          <div className="flex flex-col gap-4">
            {mode === 'signup' && (
              <Input
                id="fullName"
                label="Full Name"
                value={form.fullName}
                onChange={e => setField('fullName', e.target.value)}
                placeholder="John Doe"
                error={errors.fullName}
                autoComplete="name"
              />
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">Phone Number</label>
              <div className="flex gap-2">
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={e => { setField('phone', e.target.value); setSignupOtpSent(false); setSignupOtpVerified(false) }}
                  placeholder="98xxxxxxxx"
                  autoComplete="tel"
                  disabled={signupOtpVerified}
                  className={`flex-1 px-4 py-3 rounded-xl text-sm bg-dark-700 border text-white placeholder-gray-500
                    focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent
                    disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                    ${errors.phone ? 'border-red-500' : 'border-dark-400 hover:border-dark-300'}`}
                />
                {mode === 'signup' && !signupOtpVerified && (
                  <button
                    type="button"
                    onClick={handleSendSignupOtp}
                    className="px-3 py-2 rounded-xl text-sm font-semibold bg-dark-600 border border-dark-400
                      text-gray-300 hover:text-white hover:bg-dark-500 transition-all duration-200 whitespace-nowrap"
                  >
                    {signupOtpSent ? 'Resend' : 'Send OTP'}
                  </button>
                )}
                {mode === 'signup' && signupOtpVerified && (
                  <div className="flex items-center gap-1 px-3 text-emerald-400 text-sm font-semibold">
                    <ShieldCheck className="w-4 h-4" /> Verified
                  </div>
                )}
              </div>
              {errors.phone && <p className="text-xs text-red-400">{errors.phone}</p>}
            </div>

            {mode === 'signup' && signupOtpSent && !signupOtpVerified && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-300">Enter OTP</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={signupOtp}
                    onChange={e => { setSignupOtp(e.target.value); setSignupOtpError('') }}
                    placeholder="6-digit OTP"
                    className={`flex-1 px-4 py-3 rounded-xl text-sm bg-dark-700 border text-white placeholder-gray-500
                      focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent
                      transition-all duration-200
                      ${signupOtpError ? 'border-red-500' : 'border-dark-400 hover:border-dark-300'}`}
                  />
                  <button
                    type="button"
                    onClick={handleVerifySignupOtp}
                    className="px-3 py-2 rounded-xl text-sm font-semibold bg-brand-primary text-white
                      hover:bg-brand-secondary transition-all duration-200"
                  >
                    Verify
                  </button>
                </div>
                {signupOtpError && <p className="text-xs text-red-400">{signupOtpError}</p>}
              </div>
            )}

            <div className="relative">
              <Input
                id="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={e => setField('password', e.target.value)}
                placeholder="••••••••"
                error={errors.password}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-3 top-9 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {mode === 'signup' && (
              <>
                <Input
                  id="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  value={form.confirmPassword}
                  onChange={e => setField('confirmPassword', e.target.value)}
                  placeholder="••••••••"
                  error={errors.confirmPassword}
                  autoComplete="new-password"
                />
                <Input
                  id="referralCode"
                  label="Referral Code (optional)"
                  value={form.referralCode}
                  onChange={e => setField('referralCode', e.target.value)}
                  placeholder="e.g. JOH12345"
                />
              </>
            )}

            {mode === 'signin' && (
              <button
                type="button"
                onClick={() => setForgotOpen(true)}
                className="text-right text-xs text-brand-accent hover:text-white transition-colors -mt-2"
              >
                Forgot password?
              </button>
            )}

            <Button
              onClick={handleSubmit}
              disabled={loading || (mode === 'signup' && !signupOtpVerified)}
              fullWidth
              size="lg"
              className="mt-2"
            >
              {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Button>
            {mode === 'signup' && !signupOtpVerified && (
              <p className="text-center text-xs text-gray-500 -mt-2">Verify your phone number to continue</p>
            )}
          </div>

          <p className="text-center text-sm text-gray-500 mt-5">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-brand-accent hover:text-white font-medium transition-colors"
            >
              {mode === 'signin' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      
      
              {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotOpen}
        onClose={() => {
          setForgotOpen(false)
          setForgotPhone('')
          setForgotOtpSent(false)
          setForgotOtpVerified(false)
          setForgotOtp('')
          setForgotOtpError('')
          forgotConfirmationResultRef.current = null
        }}
        title="Reset Password"
      >
        {forgotOtpVerified ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-900/50 border border-emerald-700 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <p className="text-white font-semibold mb-1">Verified! Logging you in…</p>
          </div>
        ) : !forgotOtpSent ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-400">Enter your registered phone number to receive an OTP.</p>
            <Input
              id="forgotPhone"
              label="Phone Number"
              type="tel"
              value={forgotPhone}
              onChange={e => { setForgotPhone(e.target.value); setForgotOtpError('') }}
              placeholder="98xxxxxxxx"
            />
            {forgotOtpError && <p className="text-xs text-red-400 -mt-2">{forgotOtpError}</p>}
            <Button onClick={handleForgot} fullWidth>Get OTP</Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-400">
              Enter the 6-digit OTP sent to <span className="text-brand-accent">{forgotPhone}</span>
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={forgotOtp}
                onChange={e => { setForgotOtp(e.target.value); setForgotOtpError('') }}
                placeholder="6-digit OTP"
                className={`flex-1 px-4 py-3 rounded-xl text-sm bg-dark-700 border text-white placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent
                  transition-all duration-200
                  ${forgotOtpError ? 'border-red-500' : 'border-dark-400 hover:border-dark-300'}`}
              />
              <button
                type="button"
                onClick={handleVerifyForgotOtp}
                className="px-3 py-2 rounded-xl text-sm font-semibold bg-brand-primary text-white
                  hover:bg-brand-secondary transition-all duration-200"
              >
                Verify
              </button>
            </div>
            {forgotOtpError && <p className="text-xs text-red-400">{forgotOtpError}</p>}
            <button
              type="button"
              onClick={handleForgot}
              className="text-xs text-brand-accent hover:text-white transition-colors text-center"
            >
              Resend OTP
            </button>
          </div>
        )}
      </Modal>
    </div>
  )
