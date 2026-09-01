import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { X, Home, Wallet, Mail, User, MessageCircle, ExternalLink, Sun, Moon, Languages } from 'lucide-react'
import { useAuthStore } from '../../store/authStore.js'
import { useWalletStore } from '../../store/walletStore.js'
import { useThemeStore } from '../../store/themeStore.js'
import { useTranslation } from 'react-i18next'
import i18n from '../../i18n/index.js'

const NAV_ITEMS = [
  { path: '/home', key: 'sidebar.sanctuary_home', icon: Home },
  { path: '/wallet', key: 'sidebar.token_wallet', icon: Wallet },
  { path: '/profile', key: 'sidebar.my_journey', icon: User },
  { path: '/contact', key: 'sidebar.guidance_contact', icon: Mail },
]

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore(s => s.user)
  const balance = useWalletStore(s => s.balance)
  const { theme, toggleTheme } = useThemeStore()
  const { t } = useTranslation()
  const currentLang = i18n.language

  const isActive = (path) => location.pathname === path

  const handleNavigate = (path) => {
    navigate(path)
    onClose()
  }

  function switchLanguage(lang) {
    i18n.changeLanguage(lang)
    localStorage.setItem('preferredLanguage', lang)
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 dark:bg-black/75 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Sidebar Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-bg-surface border-l border-border-subtle z-50 flex flex-col
          transform transition-transform duration-300 ease-out shadow-soft-lg text-text-primary
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sage shadow-soft-sm" />
            <span className="text-text-primary font-serif font-medium text-base tracking-wide">
              {t('sidebar.title')}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card inside Sidebar */}
        <div className="p-4 mx-4 mt-4 rounded-2xl bg-bg-base border border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-bg-elevated border border-border-sage flex items-center justify-center text-sage font-bold text-sm">
              {user?.avatar || '👤'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-text-primary truncate">{user?.fullName || t('sidebar.guest')}</p>
              <p className="text-xs text-text-secondary font-medium">🪙 {balance} {t('nav.tokens')}</p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex flex-col gap-1.5 p-4 flex-1 overflow-y-auto">
          {NAV_ITEMS.map(({ path, key, icon: Icon }) => (
            <button
              key={path}
              onClick={() => handleNavigate(path)}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                isActive(path)
                  ? 'bg-sage-light text-sage font-semibold shadow-soft-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {t(key)}
            </button>
          ))}

          {/* Theme switcher row in sidebar */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-elevated border border-transparent transition-all"
          >
            <span className="flex items-center gap-3.5">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-champagne" /> : <Moon className="w-4 h-4 text-text-secondary" />}
              {theme === 'dark' ? t('sidebar.theme_light') : t('sidebar.theme_dark')}
            </span>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-transparent">
            <Languages className="w-4 h-4 shrink-0 text-text-secondary" />
            <span className="text-sm font-medium text-text-secondary flex-1">{t('sidebar.language')}</span>
            <div className="flex items-center gap-1 p-0.5 rounded-full bg-bg-elevated border border-border-subtle">
              <button
                onClick={() => switchLanguage('en')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${currentLang === 'en' ? 'bg-sage text-white shadow-soft-sm' : 'text-text-secondary hover:text-text-primary'}`}
              >
                EN
              </button>
              <button
                onClick={() => switchLanguage('hi')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${currentLang === 'hi' ? 'bg-sage text-white shadow-soft-sm' : 'text-text-secondary hover:text-text-primary'}`}
              >
                हि
              </button>
            </div>
          </div>

          {/* Quick WhatsApp Guidance Link */}
          <a
            href="https://wa.me/919792390777?text=Hi%2C%20I%20want%20to%20book%20a%20free%20consultation%20session."
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center justify-between px-4 py-3 mt-3 rounded-2xl text-xs font-semibold bg-bg-elevated border border-border-sage text-sage hover:bg-sage-light transition-all shadow-soft-sm"
          >
            <span className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              {t('sidebar.whatsapp')}
            </span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        </div>

        {/* Footer info in sidebar */}
        <div className="p-4 border-t border-border-subtle text-center">
          <p className="text-[11px] text-text-secondary font-medium">{t('sidebar.footer_brand')}</p>
          <p className="text-[10px] text-text-muted mt-0.5">{t('sidebar.footer_tagline')}</p>
        </div>
      </div>
    </>
  )
}