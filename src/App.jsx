import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore.js'
import { useWalletStore } from './store/walletStore.js'
import ProtectedRoute from './components/layout/ProtectedRoute.jsx'
import AuthPage from './pages/AuthPage.jsx'
import HomePage from './pages/HomePage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import WalletPage from './pages/WalletPage.jsx'
import CategoryDetailPage from './pages/CategoryDetailPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import ContentPage from './pages/ContentPage.jsx'
import MeditationSessionPage from './pages/MeditationSessionPage.jsx'

export default function App() {
  const user = useAuthStore(s => s.user)
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const initWallet = useWalletStore(s => s.initWallet)

  useEffect(() => {
    useAuthStore.getState().init()
  }, [])

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      initWallet(user.id)
    }
  }, [isAuthenticated, user?.id, initWallet])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route path="/home" element={<HomePage />} />
        <Route path="/category/:id" element={<CategoryDetailPage />} />
        <Route path="/content/:categoryId/:itemId" element={<ContentPage />} />
        <Route path="/session/overthinking-control" element={<MeditationSessionPage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route
          path="/profile"
          element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
        />
        <Route
          path="/wallet"
          element={<ProtectedRoute><WalletPage /></ProtectedRoute>}
        />

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  )
}