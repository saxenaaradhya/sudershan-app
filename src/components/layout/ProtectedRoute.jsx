import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore.js'

export default function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const loading = useAuthStore(s => s.loading)
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Save the page they were trying to visit
    return <Navigate to="/" state={{ redirectTo: location.pathname }} replace />
  }

  return children
}