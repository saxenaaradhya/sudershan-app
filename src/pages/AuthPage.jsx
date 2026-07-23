import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom' 
import { Zap, Eye, EyeOff } from 'lucide-react'
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
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 py-8">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-brand-secondary/8 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-brand-primary shadow-2xl shadow-brand-primary/40 mb-3 sm:mb-4">
            <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Sudershan Hypnotherapy</h1>
          <p className="text-gray-400 mt-1.5 text-sm">Your all-in-one healing platform</p>
        </div>

        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5 sm:p-8 shadow-2xl">

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

          {globalError && (
            <div className="mb-4 px-4 py-3 bg-red-900/50 border border-red-700 rounded-xl">
              <p className="text-sm text-red-300">{globalError}</p>
            </div>
          )}

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

            <Input
              id="phone"
              label="Phone Number"
              type="tel"
              value={form.phone}
              onChange={e => setField('phone', e.target.value)}
              placeholder="98xxxxxxxx"
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
              disabled={loading}
              fullWidth
              size="lg"
              className="mt-2"
            >
              {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Button>
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
      <Modal
        isOpen={forgotOpen}
        onClose={() => {
          setForgotOpen(false)
          setForgotPhone('')
          setForgotError('')
        }}
        title="Reset Password"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-400">Enter your registered phone number to log in directly.</p>
          <Input
            id="forgotPhone"
            label="Phone Number"
            type="tel"
            value={forgotPhone}
            onChange={e => { setForgotPhone(e.target.value); setForgotError('') }}
            placeholder="98xxxxxxxx"
          />
          {forgotError && <p className="text-xs text-red-400 -mt-2">{forgotError}</p>}
          <Button onClick={handleForgot} disabled={loading} fullWidth>
            {loading ? 'Please wait…' : 'Login'}
          </Button>
        </div>
      </Modal>

    </div>
  )
}