import React from 'react'
import { MessageCircle, Phone, Globe, ShieldCheck, ArrowLeft, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'

export default function ContactPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-bg-base text-text-primary transition-colors duration-300">
      <Navbar />
      
      <main className="max-w-xl mx-auto px-4 sm:px-6 pt-24 pb-28">
        <button
          onClick={() => navigate('/home')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Sanctuary
        </button>

        <div className="rounded-3xl bg-bg-surface border border-border-subtle p-6 sm:p-8 shadow-soft-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sage-light border border-border-sage mb-4">
            <Sparkles className="w-3.5 h-3.5 text-sage" />
            <span className="text-xs font-semibold text-sage uppercase tracking-wider">
              Seeker Support & Guidance
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-text-primary mb-2">
            Get in Touch
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mb-8 leading-relaxed">
            Have questions about hypnotherapy sessions, customized sound healing, or technical assistance with your tokens? We are here to guide you.
          </p>

          <div className="space-y-3.5 mb-8">
            <a
              href="https://wa.me/919792390777?text=Hi%2C%20I%20need%20support%20with%20Sudershan%20App."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-2xl bg-bg-base border border-border-subtle hover:border-border-sage transition-all group shadow-soft-sm"
            >
              <div className="w-11 h-11 rounded-2xl bg-sage-light text-sage flex items-center justify-center shrink-0 shadow-soft-sm">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-text-primary group-hover:text-sage transition-colors">Direct WhatsApp Support</p>
                <p className="text-xs text-text-secondary">+91 9792390777</p>
              </div>
            </a>

            <a
              href="tel:+919792390777"
              className="flex items-center gap-4 p-4 rounded-2xl bg-bg-base border border-border-subtle hover:border-border-sage transition-all group shadow-soft-sm"
            >
              <div className="w-11 h-11 rounded-2xl bg-sage-light text-sage flex items-center justify-center shrink-0 shadow-soft-sm">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-text-primary group-hover:text-sage transition-colors">Phone Inquiries</p>
                <p className="text-xs text-text-secondary">+91 9792390777 (Mon-Sat)</p>
              </div>
            </a>

            <a
              href="https://www.sudershanhypnotherapy.site"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-2xl bg-bg-base border border-border-subtle hover:border-border-sage transition-all group shadow-soft-sm"
            >
              <div className="w-11 h-11 rounded-2xl bg-sage-light text-sage flex items-center justify-center shrink-0 shadow-soft-sm">
                <Globe className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-text-primary group-hover:text-sage transition-colors">Official Website</p>
                <p className="text-xs text-text-secondary">sudershanhypnotherapy.site</p>
              </div>
            </a>
          </div>

          <div className="flex items-center gap-2 text-xs text-text-secondary pt-4 border-t border-border-subtle">
            <ShieldCheck className="w-4 h-4 text-sage shrink-0" />
            <span>All inquiries and consultations are strictly confidential.</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}