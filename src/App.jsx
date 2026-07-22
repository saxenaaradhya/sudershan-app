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
    if (isAuthenticated && user?.id) {
      initWallet(user.id)
    }
  }, [isAuthenticated, user?.id, initWallet])

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/home" replace /> : <AuthPage />}
        />
        <Route
          path="/home"
          element={<ProtectedRoute><HomePage /></ProtectedRoute>}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
        />
        <Route
          path="/wallet"
          element={<ProtectedRoute><WalletPage /></ProtectedRoute>}
        />
        <Route
          path="/category/:id"
          element={<ProtectedRoute><CategoryDetailPage /></ProtectedRoute>}
        />
        <Route
          path="/contact"
          element={<ProtectedRoute><ContactPage /></ProtectedRoute>}
        />
        <Route
          path="/content/:categoryId/:itemId"
          element={
         <ProtectedRoute>
          <ContentPage />
         </ProtectedRoute>
       }
       />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route
         path="/session/overthinking-control"
         element={<ProtectedRoute><MeditationSessionPage /></ProtectedRoute>}
       />
      </Routes>
    </BrowserRouter>
  )
}
