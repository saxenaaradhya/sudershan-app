import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Coins, Edit2, Lock, LogOut, Save, X, ArrowLeft, Sun, Moon, Phone, Gift, Share2, Sparkles } from 'lucide-react'
import { useAuthStore } from '../store/authStore.js'
import { useWalletStore } from '../store/walletStore.js'
import { useThemeStore } from '../store/themeStore.js'
import { validateFullName, validatePassword, validateConfirmPassword } from '../utils/validators.js'
import Navbar from '../components/layout/Navbar.jsx'
import Button from '../components/ui/Button.jsx'
import Input from '../components/ui/Input.jsx'
import Modal from '../components/ui/Modal.jsx'
import Toast from '../components/ui/Toast.jsx'
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
      }
    } else {
      alert('To install:\n\nAndroid: Tap the 3 dots menu in Chrome → "Add to Home screen"\n\niPhone: Tap the Share button in Safari → "Add to Home Screen"')
    }
  }

  function shareReferralCode() {
    const message = `Join me on Sudershan App! Use my referral code *${user?.referralCode}* to get bonus tokens. Sign up here: https://sudershan-app-5czh.vercel.app`
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
      setEditPhoneErr('Enter a valid phone number.')
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
    showToast('Password changed successfully.')
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
    ? new Date(user.joinedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Recently Joined'

  return (
    <div className="min-h-screen bg-[#0C0F0E] text-[#F2F4F1]">
      <Navbar />

      {toast && (
        <div className="fixed bottom-20 right-6 z-50">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-28">

        <button
          onClick={() => navigate('/home')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9BA5A0] hover:text-[#F2F4F1] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Sanctuary
        </button>

        <h1 className="font-serif text-2xl font-normal text-[#F2F4F1] mb-6">Seeker Profile</h1>

        {/* Avatar + Name Card */}
        <div className="rounded-3xl bg-[#151A17] border border-[#232B26] p-6 sm:p-7 mb-6 shadow-xl">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-[#1C2420] border border-[#D4AF6A]/40
              flex items-center justify-center text-2xl font-bold text-[#D4AF6A] shadow-lg">
              {user?.avatar || '?'}
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
                    placeholder="Phone number"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-[#F2F4F1] truncate">{user?.fullName || 'Seeker'}</h2>
                  <p className="text-xs text-[#9BA5A0] truncate">{user?.phone || 'No phone added'}</p>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
            <InfoItem icon={<Phone className="w-4 h-4" />} label="Phone" value={user?.phone || 'Not added'} />
            <InfoItem icon={<Calendar className="w-4 h-4" />} label="Sanctuary Journey Since" value={joinedDate} />
            <InfoItem icon={<Coins className="w-4 h-4 text-[#D4AF6A]" />} label="Active Balance" value={`🪙 ${balance} Tokens`} />
            <InfoItem icon={<Sparkles className="w-4 h-4 text-[#D4AF6A]" />} label="Tokens Invested" value={`🪙 ${totalSpent} Spent`} />
          </div>

          <div className="flex gap-2.5">
            {editMode ? (
              <>
                <Button onClick={saveProfile} size="sm">
                  <Save className="w-4 h-4 mr-1.5" /> Save Changes
                </Button>
                <Button onClick={() => { setEditMode(false); setEditName(user?.fullName || ''); setEditPhone(user?.phone || ''); setEditPhoneErr('') }} variant="secondary" size="sm">
                  <X className="w-4 h-4 mr-1.5" /> Cancel
                </Button>
              </>
            ) : user ? (
              <Button onClick={() => setEditMode(true)} variant="secondary" size="sm">
                <Edit2 className="w-4 h-4 mr-1.5" /> Edit Profile
              </Button>
            ) : (
              <Button onClick={() => navigate('/login')} size="sm">
                Sign In / Register
              </Button>
            )}
          </div>
        </div>

        {/* Refer & Earn */}
        <div id="refer-section" className="rounded-3xl bg-[#151A17] border border-[#D4AF6A]/30 p-6 mb-6 shadow-xl">
          <div className="flex items-center gap-2 mb-1.5">
            <Gift className="w-4 h-4 text-[#D4AF6A]" />
            <h3 className="text-sm font-bold text-[#F2F4F1]">Gift Tokens & Invite Friends</h3>
          </div>
          <p className="text-xs text-[#9BA5A0] mb-4">
            Share your unique code. When a friend joins, you both receive <span className="text-[#D4AF6A] font-bold">🪙 20 tokens</span> instantly.
          </p>
          <div className="flex items-center gap-2.5">
            <div className="flex-1 px-4 py-3 bg-[#0C0F0E] border border-[#232B26] rounded-xl text-[#F2F4F1] font-mono font-bold text-sm tracking-wider">
              {user?.referralCode || 'SIGN-IN-TO-GET-CODE'}
            </div>
            <button
              onClick={shareReferralCode}
              className="px-4 py-3 rounded-xl bg-[#D4AF6A] text-[#0C0F0E] font-bold text-xs flex items-center gap-1.5 hover:bg-[#C49A4E] active:scale-95 transition-all shadow-md"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Code</span>
            </button>
          </div>
        </div>

        {/* Action Menu */}
        <div className="rounded-3xl bg-[#151A17] border border-[#232B26] overflow-hidden mb-6 shadow-sm">
          <ActionRow
            icon={<span>📲</span>}
            label="Add App to Home Screen"
            onClick={handleInstall}
          />
          <ActionRow
            icon={<Lock className="w-4 h-4 text-[#9BA5A0]" />}
            label="Change Security Password"
            onClick={() => setPasswordModal(true)}
          />
          <ActionRow
            icon={<Coins className="w-4 h-4 text-[#D4AF6A]" />}
            label="View Token Ledger"
            onClick={() => navigate('/wallet')}
          />
          <ActionRow
            icon={theme === 'dark' ? <Sun className="w-4 h-4 text-[#D4AF6A]" /> : <Moon className="w-4 h-4 text-[#9BA5A0]" />}
            label={theme === 'dark' ? 'Switch to Gentle Light Mode' : 'Switch to Deep Sanctuary Dark'}
            onClick={toggleTheme}
          />
          <ActionRow
            icon={<LogOut className="w-4 h-4 text-[#F87171]" />}
            label="Log Out of Sanctuary"
            labelClass="text-[#F87171]"
            onClick={() => setLogoutModal(true)}
            noBorder
          />
        </div>

        {/* Stats */}
        <div className="rounded-3xl bg-[#151A17] border border-[#232B26] p-5 shadow-sm">
          <h3 className="text-xs font-semibold text-[#9BA5A0] uppercase tracking-wider mb-3">Sanctuary Activity Summary</h3>
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <StatBox value={`🪙 ${balance}`} label="Current Balance" />
            <StatBox value={`🪙 ${totalBought}`} label="Acquired" />
            <StatBox value={`🪙 ${totalSpent}`} label="Invested" />
          </div>
        </div>
      </main>

      {/* Change Password Modal */}
      <Modal isOpen={passwordModal} onClose={resetPasswordModalState} title="Change Password">
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
          <Button onClick={savePassword} fullWidth>Update Password</Button>
        </div>
      </Modal>

      {/* Logout Confirm Modal */}
      <Modal isOpen={logoutModal} onClose={() => setLogoutModal(false)} title="Confirm Logout">
        <div className="flex flex-col gap-4 text-center">
          <p className="text-[#9BA5A0] text-xs">Are you sure you want to log out of your session?</p>
          <div className="flex gap-3">
            <Button onClick={handleLogout} variant="danger" fullWidth>Yes, Logout</Button>
            <Button onClick={() => setLogoutModal(false)} variant="secondary" fullWidth>Cancel</Button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  )
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-[#0C0F0E] border border-[#232B26] rounded-2xl">
      <span className="text-[#9BA5A0] mt-0.5">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] text-[#9BA5A0] uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-xs sm:text-sm font-medium text-[#F2F4F1] truncate">{value}</p>
      </div>
    </div>
  )
}

function ActionRow({ icon, label, labelClass = 'text-[#F2F4F1]', onClick, noBorder }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3.5 px-5 py-4 text-xs sm:text-sm font-medium
        hover:bg-[#1C2420] transition-colors text-left
        ${!noBorder ? 'border-b border-[#232B26]' : ''}`}
    >
      <span className="shrink-0">{icon}</span>
      <span className={labelClass}>{label}</span>
    </button>
  )
}

function StatBox({ value, label }) {
  return (
    <div className="bg-[#0C0F0E] border border-[#232B26] rounded-2xl p-3">
      <p className="text-sm sm:text-base font-bold font-mono text-[#F2F4F1] mb-0.5">{value}</p>
      <p className="text-[10px] text-[#9BA5A0]">{label}</p>
    </div>
  )
}