import React from 'react'
import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-20 pb-24">
        <h1 className="text-2xl font-bold text-white mb-4">Contact Us</h1>
        <p className="text-gray-400 text-sm">
          Have a question or feedback? Reach out to us at support@sudershan.app
        </p>
      </main>
      <Footer />
    </div>
  )
}