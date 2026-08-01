import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase.js'
import { CATEGORIES } from '../constants/categories.js'
import { ArrowLeft, ChevronDown, ChevronRight, Eye, Unlock } from 'lucide-react'
import Navbar from '../components/layout/Navbar.jsx'

export default function AdminPage() {
  const navigate = useNavigate()
  const [analytics, setAnalytics] = useState([])
  const [loading, setLoading] = useState(true)
  const [openCategory, setOpenCategory] = useState(null)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const snap = await getDocs(collection(db, 'analytics'))
        const data = snap.docs.map(d => d.data())
        setAnalytics(data)
      } catch (err) {
        console.error('Failed to fetch analytics:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  function getCount(sessionId, type) {
    return analytics.filter(e => e.sessionId === sessionId && e.type === type).length
  }

  function getCategoryTotal(categoryId, type) {
    return analytics.filter(e => e.categoryId === categoryId && e.type === type).length
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-12">
        
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <h1 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400 text-sm mb-8">Session analytics — listens and unlocks per category</p>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading analytics...</div>
        ) : (
          <div className="flex flex-col gap-3">
            {CATEGORIES.map(category => {
              const isOpen = openCategory === category.id
              const Icon = category.icon
              const totalListens = getCategoryTotal(category.id, 'listen')
              const totalUnlocks = getCategoryTotal(category.id, 'unlock')

              return (
                <div key={category.id} className="bg-dark-800 border border-dark-600 rounded-2xl overflow-hidden">
                  
                  {/* Category Header */}
                  <button
                    onClick={() => setOpenCategory(isOpen ? null : category.id)}
                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-dark-700 transition-colors"
                  >
                    <div className={`p-2 rounded-xl bg-gradient-to-br ${category.color} shrink-0`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{category.name}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-emerald-400 flex items-center gap-1">
                          <Eye className="w-3 h-3" /> {totalListens} listens
                        </span>
                        <span className="text-xs text-brand-accent flex items-center gap-1">
                          <Unlock className="w-3 h-3" /> {totalUnlocks} unlocks
                        </span>
                      </div>
                    </div>
                    {isOpen
                      ? <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                      : <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                    }
                  </button>

                  {/* Session List */}
                  {isOpen && (
                    <div className="border-t border-dark-600">
                      {category.items.map((item, i) => {
                        const listens = getCount(item.id, 'listen')
                        const unlocks = getCount(item.id, 'unlock')
                        return (
                          <div
                            key={item.id}
                            className={`flex items-center gap-4 px-5 py-3.5
                              ${i !== category.items.length - 1 ? 'border-b border-dark-700' : ''}`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-dark-700 flex items-center justify-center text-xs font-bold text-gray-400 shrink-0">
                              {i + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">{item.title}</p>
                              <p className="text-xs text-gray-500 truncate">{item.description}</p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <div className="text-center">
                                <p className="text-sm font-bold text-emerald-400">{listens}</p>
                                <p className="text-xs text-gray-500">listens</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm font-bold text-brand-accent">{unlocks}</p>
                                <p className="text-xs text-gray-500">unlocks</p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      {category.items.length === 0 && (
                        <p className="text-center text-gray-500 text-sm py-4">No sessions yet</p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}