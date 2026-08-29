import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom' 
import { Sparkles, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { useAuthStore } from '../store/authStore.js'
import { useWalletStore } from '../store/walletStore.js'
import Input from '../components/ui/Input.jsx'
import Modal from '../components/ui/Modal.jsx'
import {
  validatePhone,
  validatePassword,
  validateFullName,
  validateConfirmPassword,
} from '../utils/validators.js'

export default function AuthPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.redirectTo || '/home'
  const signIn = useAuthStore(s => s.signIn)
  const signUp = useAuthStore(s => s.signUp)
  const loginByPhone = useAuthStore(s => s.loginByPhone)
  const initWallet = useWalletStore(s => s.initWallet)

  const [mode, setMode] = useState('signin')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [forgotOpen, setForgotOpen] = useState(false)
  const [forgotPhone, setForgotPhone] = useState('')
  const [forgotError, setForgotError] = useState('')
  const [globalError, setGlobalError] = useState('')

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
    if (userId) {
      await initWallet(userId)
      if (mode === 'signup') {
        await useWalletStore.getState().addTokens(20, '🎁 Welcome bonus')
      }
    }
    navigate(redirectTo, { state: { showWelcome: true } })
  }

  async function handleForgot() {
    const phoneErr = validatePhone(forgotPhone)
    if (phoneErr) { setForgotError(phoneErr); return }
    setLoading(true)
    const result = await loginByPhone(forgotPhone)
    setLoading(false)
    if (result.success) {
      const userId = useAuthStore.getState().user?.id
      if (userId) initWallet(userId)
      setForgotOpen(false)
      navigate(redirectTo, { state: { showWelcome: true } })
    } else {
      setForgotError(result.error || 'Phone number not found.')
    }
  }

  function switchMode(newMode) {
    setMode(newMode)
    setErrors({})
    setGlobalError('')
    setForm({ fullName: '', phone: '', password: '', confirmPassword: '', referralCode: '' })
  }

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex items-center justify-center p-4 py-12 relative overflow-hidden transition-colors duration-300">

      {/* Subtle ambient sage mist */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-sage/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-bg-surface border border-border-sage shadow-soft mb-3 text-sage">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-text-primary">Sudershan Sanctuary</h1>
          <p className="text-text-secondary text-xs mt-1">Clinical Hypnotherapy & Mind Therapy by Mr. SANDEEP</p>
        </div>

        <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 sm:p-8 shadow-soft-lg">

          {/* Toggle pill */}
          <div className="flex bg-bg-base border border-border-subtle rounded-full p-1 mb-6">
            <button
              onClick={() => switchMode('signin')}
              className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all duration-200 ${
                mode === 'signin' 
                  ? 'bg-sage text-white shadow-soft' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => switchMode('signup')}
              className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all duration-200 ${
                mode === 'signup' 
                  ? 'bg-sage text-white shadow-soft' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Create Account
            </button>
          </div>

          {globalError && (
            <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl">
              <p className="text-xs text-red-500 dark:text-red-400">{globalError}</p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {mode === 'signup' && (
              <Input
                id="fullName"
                label="Full Name"
                value={form.fullName}
                onChange={e => setField('fullName', e.target.value)}
                placeholder="Seeker Name"
                error={errors.fullName}
                autoComplete="name"
              />
            )}

            <Input
              id="phone"
              label="Phone Number"
              type="tel"
              value={form.phone}
              onChange={e => setField('phone', e.target.value)}
              placeholder="10-digit mobile number"
              error={errors.phone}
              autoComplete="tel"
            />

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
                className="absolute right-3 top-9 text-text-muted hover:text-text-primary transition-colors"
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
                  label="Referral Code (Optional)"
                  value={form.referralCode}
                  onChange={e => setField('referralCode', e.target.value)}
                  placeholder="e.g. SAN12345"
                />
              </>
            )}

            {mode === 'signin' && (
              <button
                type="button"
                onClick={() => setForgotOpen(true)}
                className="text-right text-xs text-sage hover:underline transition-colors -mt-2 font-medium"
              >
                Forgot password?
              </button>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-2 w-full py-3.5 rounded-full bg-sage hover:bg-sage-hover text-white font-semibold text-xs sm:text-sm active:scale-[0.98] transition-all shadow-soft disabled:opacity-50"
            >
              {loading ? 'Entering Sanctuary…' : mode === 'signin' ? 'Sign In' : 'Create Account (+20 🪙 Bonus)'}
            </button>
          </div>

          <p className="text-center text-xs text-text-secondary mt-6">
            {mode === 'signin' ? "Don't have an account? " : 'Already registered? '}
            <button
              onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-sage hover:underline font-semibold transition-colors"
            >
              {mode === 'signin' ? 'Sign Up (+20 🪙 Bonus)' : 'Sign In'}
            </button>
          </p>
        </div>

        {/* Clinical Privacy Note */}
        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-text-muted">
          <ShieldCheck className="w-4 h-4 text-sage" />
          <span>100% Private, Doctor-Designed Clinical Hypnotherapy</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotOpen}
        onClose={() => {
          setForgotOpen(false)
          setForgotPhone('')
          setForgotError('')
        }}
        title="Reset Account Access"
      >
        <div className="flex flex-col gap-4">
          <p className="text-xs text-text-secondary">Enter your registered phone number to sign in directly.</p>
          <Input
            id="forgotPhone"
            label="Phone Number"
            type="tel"
            value={forgotPhone}
            onChange={e => { setForgotPhone(e.target.value); setForgotError('') }}
            placeholder="10-digit mobile number"
          />
          {forgotError && <p className="text-xs text-red-500 -mt-2">{forgotError}</p>}
          <button 
            onClick={handleForgot} 
            disabled={loading} 
            className="w-full py-3 rounded-full bg-sage hover:bg-sage-hover text-white font-semibold text-xs active:scale-[0.98] transition-all shadow-soft"
          >
            {loading ? 'Verifying…' : 'Access Account'}
          </button>
        </div>
      </Modal>

    </div>
  )
}