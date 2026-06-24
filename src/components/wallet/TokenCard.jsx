import React from 'react'
import { Coins, Star, Zap } from 'lucide-react'
import Button from '../ui/Button.jsx'

const PACK_META = {
  10: {
    icon: Coins,
    label: 'Starter',
    description: 'Perfect for trying things out',
    accent: 'from-blue-500/20 to-blue-600/10',
    border: 'border-blue-500/30',
    iconColor: 'text-blue-400',
    badge: null,
  },
  50: {
    icon: Star,
    label: 'Popular',
    description: 'Best value for regular users',
    accent: 'from-brand-primary/20 to-brand-secondary/10',
    border: 'border-brand-primary/50',
    iconColor: 'text-brand-accent',
    badge: 'Most Popular',
  },
  100: {
    icon: Zap,
    label: 'Pro',
    description: 'Unlock everything without limits',
    accent: 'from-amber-500/20 to-orange-600/10',
    border: 'border-amber-500/30',
    iconColor: 'text-amber-400',
    badge: 'Best Deal',
  },
}

const PRICES = { 10: 10, 50: 40, 100: 75 }

export default function TokenCard({ amount, onBuy }) {
  const meta = PACK_META[amount]
  const price = PRICES[amount]
  const Icon = meta.icon

  return (
    <div
      className={`relative bg-gradient-to-br ${meta.accent} border ${meta.border}
        rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200
        hover:scale-105 hover:shadow-xl`}
    >
      {meta.badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-primary text-white
          text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-brand-primary/30 whitespace-nowrap">
          {meta.badge}
        </span>
      )}

      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl bg-dark-800/60`}>
          <Icon className={`w-6 h-6 ${meta.iconColor}`} />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">{meta.label}</p>
          <p className="text-2xl font-bold text-white">{amount} <span className="text-sm font-medium text-gray-400">tokens</span></p>
        </div>
      </div>

      <p className="text-sm text-gray-400">{meta.description}</p>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/10">
        <p className="text-xl font-bold text-white">₹{price}</p>
        <Button onClick={() => onBuy(amount, price)} size="sm" variant="primary">
          Buy Now
        </Button>
      </div>
    </div>
  )
}
