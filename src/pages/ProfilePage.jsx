import Footer from '../components/layout/Footer.jsx'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Calendar, Coins, Edit2, Lock, LogOut, Save, X, ArrowLeft, Sun, Moon, Phone, Gift, Share2 } from 'lucide-react'
import { useAuthStore } from '../store/authStore.js'
import { useWalletStore } from '../store/walletStore.js'
import { useThemeStore } from '../store/themeStore.js'
import { validateFullName, validatePassword, validateConfirmPassword } from '../utils/validators.js'
import Navbar from '../components/layout/Navbar.jsx'
import Button from '../components/ui/Button.jsx'
import Input from '../components/ui/Input.jsx'
import Modal from '../components/ui/Modal.jsx'
import Toast from '../components/ui/Toast.jsx'

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

    // TODO: call your backend/Firebase Auth updatePassword here with `newPass`

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
    : 'N/A'

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-12">

        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <h1 className="text-2xl font-bold text-white mb-6">My Profile</h1>

        {/* Avatar + Name Card */}
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 mb-4">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary
              flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-brand-primary/30">
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
                  <h2 className="text-lg font-bold text-white truncate">{user?.fullName}</h2>
                  <p className="text-sm text-gray-400 truncate">{user?.phone}</p>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-5">
            <InfoItem icon={<Phone className="w-4 h-4" />} label="Phone" value={user?.phone} />
            <InfoItem icon={<Calendar className="w-4 h-4" />} label="Joined" value={joinedDate} />
            <InfoItem icon={<Coins className="w-4 h-4" />} label="Balance" value={`🪙 ${balance}`} />
            <InfoItem icon={<User className="w-4 h-4" />} label="Tokens Spent" value={`🪙 ${totalSpent}`} />
          </div>

          <div className="flex gap-2">
            {editMode ? (
              <>
                <Button onClick={saveProfile} size="sm">
                  <Save className="w-4 h-4 mr-1.5" /> Save
                </Button>
                <Button onClick={() => { setEditMode(false); setEditName(user?.fullName || ''); setEditPhone(user?.phone || ''); setEditPhoneErr('') }} variant="secondary" size="sm">
                  <X className="w-4 h-4 mr-1.5" /> Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setEditMode(true)} variant="secondary" size="sm">
                <Edit2 className="w-4 h-4 mr-1.5" /> Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Refer & Earn */}
        <div id="refer-section" className="bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 border border-brand-primary/30 rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-5 h-5 text-brand-accent" />
            <h3 className="text-sm font-bold text-white">Refer & Earn</h3>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            Share your code — when a friend signs up using it, you get 🪙 20 tokens instantly.
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-4 py-3 bg-dark-900/50 border border-dark-600 rounded-xl text-white font-bold text-sm tracking-wider">
              {user?.referralCode || '—'}
            </div>
            <button
              onClick={shareReferralCode}
              className="w-11 h-11 rounded-xl bg-dark-900/50 border border-dark-600 flex items-center justify-center text-gray-300 hover:text-white transition-all"
            >
            <Share2 className="w-4 h-4" />
           </button>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-dark-800 border border-dark-600 rounded-2xl overflow-hidden mb-4">
          <ActionRow
            icon={<Lock className="w-4 h-4" />}
            label="Change Password"
            onClick={() => setPasswordModal(true)}
          />
          <ActionRow
            icon={<Coins className="w-4 h-4 text-brand-accent" />}
            label="View Transaction History"
            onClick={() => navigate('/wallet')}
          />
          <ActionRow
            icon={theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
            label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            onClick={toggleTheme}
          />
          <ActionRow
            icon={<LogOut className="w-4 h-4 text-red-400" />}
            label="Logout"
            labelClass="text-red-400"
            onClick={() => setLogoutModal(true)}
            noBorder
          />
        </div>

        {/* Stats */}
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">Account Summary</h3>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
            <StatBox value={`🪙 ${balance}`} label="Current Balance" />
            <StatBox value={`🪙 ${totalBought}`} label="Total Bought" />
            <StatBox value={`🪙 ${totalSpent}`} label="Total Spent" />
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
        <div className="flex flex-col gap-4">
          <p className="text-gray-400 text-sm">Are you sure you want to log out of your account?</p>
          <div className="flex gap-3">
            <Button onClick={handleLogout} variant="danger" fullWidth>Yes, Logout</Button>
            <Button onClick={() => setLogoutModal(false)} variant="secondary" fullWidth>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5 p-3 bg-dark-700 rounded-xl">
      <span className="text-gray-500 mt-0.5">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-white truncate">{value}</p>
      </div>
    </div>
  )
}

function ActionRow({ icon, label, labelClass = 'text-white', onClick, noBorder }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-medium
        hover:bg-dark-700 transition-colors text-left
        ${!noBorder ? 'border-b border-dark-600' : ''}`}
    >
      <span className="text-gray-400">{icon}</span>
      <span className={labelClass}>{label}</span>
    </button>
  )
}

function StatBox({ value, label }) {
  return (
    <div className="bg-dark-700 rounded-xl p-2 sm:p-3">
      <p className="text-sm sm:text-base font-bold text-white mb-0.5">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
      <Footer />
    </div>
  )
}