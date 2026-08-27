import React from 'react'
import { MessageCircle, Phone, Globe, ShieldCheck, ArrowLeft, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'

export default function ContactPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0C0F0E] text-[#F2F4F1]">
      <Navbar />
      
      <main className="max-w-xl mx-auto px-4 sm:px-6 pt-24 pb-28">
        <button
          onClick={() => navigate('/home')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9BA5A0] hover:text-[#F2F4F1] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Sanctuary
        </button>

        <div className="rounded-3xl bg-[#151A17] border border-[#232B26] p-6 sm:p-8 shadow-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C2420] border border-[#D4AF6A]/20 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF6A]" />
            <span className="text-xs font-semibold text-[#D4AF6A] uppercase tracking-wider">
              Seeker Support
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#F2F4F1] mb-2">
            Get in Touch
          </h1>
          <p className="text-xs sm:text-sm text-[#9BA5A0] mb-8 leading-relaxed">
            Have questions about hypnotherapy sessions, customized sound healing, or technical assistance with your tokens? We are here to guide you.
          </p>

          <div className="space-y-3 mb-8">
            <a
              href="https://wa.me/919792390777?text=Hi%2C%20I%20need%20support%20with%20Sudershan%20App."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#0C0F0E] border border-[#232B26] hover:border-[#D4AF6A]/40 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#1C2420] text-[#D4AF6A] flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#F2F4F1] group-hover:text-[#D4AF6A] transition-colors">Direct WhatsApp Support</p>
                <p className="text-xs text-[#9BA5A0]">+91 9792390777</p>
              </div>
            </a>

            <a
              href="tel:+919792390777"
              className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#0C0F0E] border border-[#232B26] hover:border-[#D4AF6A]/40 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#1C2420] text-[#D4AF6A] flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#F2F4F1] group-hover:text-[#D4AF6A] transition-colors">Phone Inquiries</p>
                <p className="text-xs text-[#9BA5A0]">+91 9792390777 (Mon-Sat)</p>
              </div>
            </a>

            <a
              href="https://www.sudershanhypnotherapy.site"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#0C0F0E] border border-[#232B26] hover:border-[#D4AF6A]/40 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#1C2420] text-[#D4AF6A] flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#F2F4F1] group-hover:text-[#D4AF6A] transition-colors">Official Website</p>
                <p className="text-xs text-[#9BA5A0]">sudershanhypnotherapy.site</p>
              </div>
            </a>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#9BA5A0] pt-4 border-t border-[#232B26]">
            <ShieldCheck className="w-4 h-4 text-[#D4AF6A] shrink-0" />
            <span>All inquiries and consultations are strictly confidential.</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}