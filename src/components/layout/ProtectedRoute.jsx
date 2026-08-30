import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore.js'

export default function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const loading = useAuthStore(s => s.loading)
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-sage border-t-transparent animate-spin" />
          <p className="text-xs text-text-secondary">Loading your sanctuary...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Store the page they tried to visit AND pre-select the Sign Up tab
    return (
      <Navigate
        to="/login"
        state={{ redirectTo: location.pathname, mode: 'signup' }}
        replace
      />
    )
  }

  return children
}