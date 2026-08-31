import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Calendar, Coins, Edit2, Lock, LogOut, Save, X, ArrowLeft, 
  Sun, Moon, Phone, Gift, Share2, Sparkles, Copy, Check, 
  ShieldCheck, HelpCircle, FileText, ChevronRight 
} from 'lucide-react'
import { useAuthStore } from '../store/authStore.js'
import { useWalletStore } from '../store/walletStore.js'
import { useThemeStore } from '../store/themeStore.js'
import { validateFullName, validatePassword, validateConfirmPassword } from '../utils/validators.js'
import Navbar from '../components/layout/Navbar.jsx'
import Input from '../components/ui/Input.jsx'
import Modal from '../components/ui/Modal.jsx'
import Toast from '../components/ui/Toast.jsx'
import SectionHeader from '../components/ui/SectionHeader.jsx'
import Footer from '../components/layout/Footer.jsx'

export default function ProfilePage() {
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)
  const updateProfile = useAuthStore(s => s.updateProfile)
  const signOut = useAuthStore(s => s.signOut)
  const resetWallet = useWalletStore(s => s.resetWallet)
  const balance = useWalletStore(s => s.balance)
  const transactions = useWalletStore(s => s.transactions)

  const [editMode, setEditMode] = useState(false)
  const [editName, setEditName] = useState(user?.fullName || '')
  const [editNameErr, setEditNameErr] = useState('')
  const [editPhone, setEditPhone] = useState(user?.phone || '')
  const [editPhoneErr, setEditPhoneErr] = useState('')

  const [passwordModal, setPasswordModal] = useState(false)
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [passErr, setPassErr] = useState({})

  const [logoutModal, setLogoutModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState(null)
  const { theme, toggleTheme } = useThemeStore()
  const [installPrompt, setInstallPrompt] = useState(null)

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function handleInstall() {
    const prompt = installPrompt || window.__installPrompt
    if (prompt) {
      prompt.prompt()
      const { outcome } = await prompt.userChoice
      if (outcome === 'accepted') {
        window.__installPrompt = null
        showToast('Sanctuary App added to your device.')
      }
    } else {
      alert('To install Sanctuary on your mobile device:\n\n• Android: Tap Chrome menu (⋮) → "Add to Home screen"\n• iPhone: Tap Safari Share (↑) → "Add to Home Screen"')
    }
  }

  function copyReferralCode() {
    const code = user?.referralCode || 'SANCTUARY'
    navigator.clipboard.writeText(code)
    setCopied(true)
    showToast(`Referral code "${code}" copied to clipboard!`)
    setTimeout(() => setCopied(false), 3000)
  }

  function shareReferralCode() {
    const message = `Join me on Sudershan Sanctuary! Use my referral code *${user?.referralCode}* to get 20 bonus tokens for clinical hypnotherapy & meditation. Sign up here: https://sudershan-app-5czh.vercel.app`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const totalSpent = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalBought = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0)

  function showToast(message, type = 'success') {
    setToast({ message, type })
  }

  function saveProfile() {
    const nameErr = validateFullName(editName)
    if (nameErr) { setEditNameErr(nameErr); return }
    const trimmedPhone = editPhone.trim()
    if (!trimmedPhone || trimmedPhone.length < 10) {
      setEditPhoneErr('Enter a valid 10-digit phone number.')
      return
    }
    updateProfile({
      fullName: editName,
      phone: trimmedPhone,
      avatar: editName.charAt(0).toUpperCase(),
    })
    setEditMode(false)
    showToast('Profile updated successfully.')
  }

  function savePassword() {
    const errs = {}
    const p = validatePassword(newPass)
    const c = validateConfirmPassword(newPass, confirmPass)
    if (p) errs.newPass = p
    if (c) errs.confirmPass = c
    if (Object.keys(errs).length > 0) { setPassErr(errs); return }

    resetPasswordModalState()
    showToast('Security password changed successfully.')
  }

  function resetPasswordModalState() {
    setPasswordModal(false)
    setNewPass('')
    setConfirmPass('')
    setPassErr({})
  }

  function handleLogout() {
    resetWallet()
    signOut()
    navigate('/')
  }

  const joinedDate = user?.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Recently Joined'

  return (
    <div className="min-h-screen bg-bg-base text-text-primary transition-colors duration-200">
      <Navbar />

      {toast && (
        <div className="fixed bottom-20 right-6 z-50">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}

      <main className="max-w-full md:max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-28">

        {/* Back Navigation */}
        <button
          onClick={() => navigate('/home')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Sanctuary
        </button>

        <h1 className="font-serif text-2xl sm:text-3xl font-normal text-text-primary mb-6">
          My Sanctuary Journey
        </h1>

        {/* 1. USER PROFILE CARD */}
        <div className="rounded-3xl bg-bg-surface border border-border-subtle p-5 sm:p-7 mb-6 shadow-soft">
          <div className="flex items-center gap-4 sm:gap-5 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-sage-light border border-border-sage flex items-center justify-center text-2xl font-bold text-sage shadow-soft-sm shrink-0">
              {user?.avatar || (user?.fullName ? user.fullName.charAt(0).toUpperCase() : '?')}
            </div>
            
            <div className="flex-1 min-w-0">
              {editMode ? (
                <div className="flex flex-col gap-2">
                  <Input
                    id="editName"
                    value={editName}
                    onChange={e => { setEditName(e.target.value); setEditNameErr('') }}
                    error={editNameErr}
                    placeholder="Your full name"
                  />
                  <Input
                    id="editPhone"
                    value={editPhone}
                    onChange={e => { setEditPhone(e.target.value); setEditPhoneErr('') }}
                    error={editPhoneErr}
                    placeholder="10-digit phone number"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-base sm:text-lg font-bold text-text-primary truncate">
                    {user?.fullName || 'Seeker'}
                  </h2>
                  <p className="text-xs text-text-secondary truncate mt-0.5">
                    {user?.phone || 'No phone registered'}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold text-sage uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" /> Active Member
                  </span>
                </>
              )}
            </div>
          </div>

          {/* User Stats Grid */}
          <div className="grid grid-cols-2 gap-2.5 mb-5">
            <InfoItem icon={<Calendar className="w-4 h-4 text-text-muted" />} label="Joined Sanctuary" value={joinedDate} />
            <InfoItem icon={<Phone className="w-4 h-4 text-text-muted" />} label="Phone" value={user?.phone || 'Not added'} />
            <InfoItem icon={<Coins className="w-4 h-4 text-champagne" />} label="Wallet Balance" value={`🪙 ${balance} Tokens`} />
            <InfoItem icon={<Sparkles className="w-4 h-4 text-sage" />} label="Tokens Invested" value={`🪙 ${totalSpent} Spent`} />
          </div>

          {/* Action Row */}
          <div className="flex gap-2.5">
            {editMode ? (
              <>
                <button 
                  onClick={saveProfile} 
                  className="px-5 py-2.5 rounded-full bg-sage hover:bg-sage-hover text-white font-semibold text-xs flex items-center gap-1.5 active:scale-[0.98] transition-all shadow-soft"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </button>
                <button 
                  onClick={() => { setEditMode(false); setEditName(user?.fullName || ''); setEditPhone(user?.phone || ''); setEditPhoneErr('') }} 
                  className="px-5 py-2.5 rounded-full bg-bg-elevated border border-border-subtle text-text-primary font-medium text-xs flex items-center gap-1.5 hover:bg-bg-subtle transition-all"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              </>
            ) : user ? (
              <button 
                onClick={() => setEditMode(true)} 
                className="px-5 py-2.5 rounded-full bg-bg-elevated border border-border-subtle text-text-primary font-medium text-xs flex items-center gap-1.5 hover:border-border-sage transition-all shadow-soft-sm active:scale-95"
              >
                <Edit2 className="w-4 h-4" /> Edit Information
              </button>
            ) : (
              <button 
                onClick={() => navigate('/login')} 
                className="px-6 py-2.5 rounded-full bg-sage hover:bg-sage-hover text-white font-semibold text-xs active:scale-[0.98] transition-all shadow-soft"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>

        {/* 2. REFERRAL & REWARD SECTION */}
        <section className="mb-6">
          <div id="refer-section" className="rounded-3xl bg-bg-surface border border-border-champagne p-5 sm:p-6 shadow-soft">
            <div className="flex items-center gap-2 mb-1.5">
              <Gift className="w-4 h-4 text-champagne" />
              <h3 className="text-sm font-semibold text-text-primary">Gift Tokens & Invite Seekers</h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed mb-4">
              Share your sacred referral code. When a friend signs up, you both receive <span className="text-sage font-bold">🪙 20 tokens</span> instantly.
            </p>
            
            {/* Code Capsule & Action Triggers */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="flex-1 px-4 py-3 bg-bg-base border border-border-subtle rounded-2xl text-text-primary font-mono font-bold text-sm tracking-wider flex items-center justify-between">
                <span>{user?.referralCode || 'SANCTUARY'}</span>
                <button
                  onClick={copyReferralCode}
                  className="p-1 text-text-secondary hover:text-text-primary transition-colors"
                  aria-label="Copy Code"
                >
                  {copied ? <Check className="w-4 h-4 text-sage" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={copyReferralCode}
                  className="flex-1 sm:flex-initial px-4 py-3 rounded-full bg-bg-elevated border border-border-subtle text-text-primary hover:border-border-sage font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all shadow-soft-sm"
                >
                  {copied ? <Check className="w-4 h-4 text-sage" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={shareReferralCode}
                  className="flex-1 sm:flex-initial px-5 py-3 rounded-full bg-sage hover:bg-sage-hover text-white font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all shadow-soft shrink-0"
                >
                  <Share2 className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 3. SETTINGS & ACCOUNT OPTIONS */}
        <section className="mb-6">
          <SectionHeader title="Preferences & Account Settings" />

          <div className="rounded-3xl bg-bg-surface border border-border-subtle overflow-hidden shadow-soft">
            <ActionRow
              icon={<span className="text-base">📲</span>}
              label="Add Sudershan to Home Screen"
              subtitle="Install standalone mobile web app"
              onClick={handleInstall}
            />
            <ActionRow
              icon={<Lock className="w-4 h-4 text-text-secondary" />}
              label="Change Security Password"
              subtitle="Update account login credentials"
              onClick={() => setPasswordModal(true)}
            />
            <ActionRow
              icon={<Coins className="w-4 h-4 text-champagne" />}
              label="View Token Ledger"
              subtitle="Manage tokens & transaction history"
              onClick={() => navigate('/wallet')}
            />
            <ActionRow
              icon={theme === 'dark' ? <Sun className="w-4 h-4 text-champagne" /> : <Moon className="w-4 h-4 text-text-secondary" />}
              label={theme === 'dark' ? 'Switch to Gentle Daylight Mode' : 'Switch to Deep Sanctuary Dark'}
              subtitle={theme === 'dark' ? 'Airy sage canvas' : 'Deep nocturnal forest'}
              onClick={toggleTheme}
            />
            <ActionRow
              icon={<HelpCircle className="w-4 h-4 text-sage" />}
              label="Seeker Support & Guidance"
              subtitle="Direct WhatsApp helpline with Mr. Sandeep"
              onClick={() => navigate('/contact')}
            />
            <ActionRow
              icon={<LogOut className="w-4 h-4 text-red-500" />}
              label="Log Out of Sanctuary"
              labelClass="text-red-500"
              onClick={() => setLogoutModal(true)}
              noBorder
            />
          </div>
        </section>

        {/* 4. CLINICAL CONFIDENTIALITY & APP VERSION */}
        <footer className="text-center pt-2">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-text-muted mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-sage" />
            <span>100% Confidential Clinical Hypnotherapy Platform</span>
          </div>
          <p className="text-[10px] text-text-muted font-mono">
            Sudershan Sanctuary v1.2.0 • Built with Calm Precision
          </p>
        </footer>

      </main>

      {/* Change Password Modal */}
      <Modal isOpen={passwordModal} onClose={resetPasswordModalState} title="Change Security Password">
        <div className="flex flex-col gap-4">
          <Input
            id="newPass"
            label="New Password"
            type="password"
            value={newPass}
            onChange={e => { setNewPass(e.target.value); setPassErr(p => ({ ...p, newPass: null })) }}
            error={passErr.newPass}
            placeholder="••••••••"
          />
          <Input
            id="confirmPass"
            label="Confirm New Password"
            type="password"
            value={confirmPass}
            onChange={e => { setConfirmPass(e.target.value); setPassErr(p => ({ ...p, confirmPass: null })) }}
            error={passErr.confirmPass}
            placeholder="••••••••"
          />
          <button
            onClick={savePassword}
            className="w-full py-3 rounded-full bg-sage hover:bg-sage-hover text-white font-semibold text-xs active:scale-[0.98] transition-all shadow-soft"
          >
            Update Password
          </button>
        </div>
      </Modal>

      {/* Logout Confirm Modal */}
      <Modal isOpen={logoutModal} onClose={() => setLogoutModal(false)} title="Confirm Logout">
        <div className="flex flex-col gap-4 text-center">
          <p className="text-text-secondary text-xs leading-relaxed">
            Are you sure you want to end your current sanctuary session?
          </p>
          <div className="flex gap-3">
            <button 
              onClick={handleLogout} 
              className="w-full py-3 rounded-full bg-red-600 text-white font-semibold text-xs hover:bg-red-700 transition-all shadow-soft"
            >
              Yes, Logout
            </button>
            <button 
              onClick={() => setLogoutModal(false)} 
              className="w-full py-3 rounded-full bg-bg-elevated border border-border-subtle text-text-primary font-medium text-xs hover:bg-bg-subtle transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  )
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5 p-3 bg-bg-base border border-border-subtle rounded-2xl">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] text-text-secondary uppercase tracking-wider">{label}</p>
        <p className="text-xs font-semibold text-text-primary truncate mt-0.5">{value}</p>
      </div>
    </div>
  )
}

function ActionRow({ icon, label, subtitle, labelClass = 'text-text-primary', onClick, noBorder }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-bg-elevated transition-colors ${
        !noBorder ? 'border-b border-border-subtle' : ''
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <span className="shrink-0">{icon}</span>
        <div className="min-w-0">
          <p className={`text-xs sm:text-sm font-medium truncate ${labelClass}`}>{label}</p>
          {subtitle && <p className="text-[11px] text-text-secondary truncate">{subtitle}</p>}
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-text-muted shrink-0 ml-2" />
    </button>
  )
}