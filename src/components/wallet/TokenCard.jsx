import React from 'react'
import { Coins, Star, Zap } from 'lucide-react'
import Button from '../ui/Button.jsx'

const PACK_META = {
  20: {
    icon: Coins,
    label: 'Starter',
    description: 'Perfect for exploring sessions',
    badge: null,
  },
  80: {
    icon: Star,
    label: 'Sanctuary',
    description: 'Most popular for continuous healing',
    badge: 'Recommended',
  },
  150: {
    icon: Zap,
    label: 'Mastery',
    description: 'Full lifetime access across all journeys',
    badge: 'Best Value',
  },
}

const PRICES = { 20: 20, 80: 70, 150: 125 }

export default function TokenCard({ amount, onBuy }) {
  const meta = PACK_META[amount] || { icon: Coins, label: 'Custom', description: 'Tokens pack', badge: null }
  const price = PRICES[amount] || amount
  const Icon = meta.icon

  return (
    <div
      className={`relative bg-bg-surface border ${
        meta.badge ? 'border-border-sage shadow-soft-lg ring-1 ring-sage/20' : 'border-border-subtle hover:border-border-sage'
      } rounded-3xl p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-soft-lg`}
    >
      {meta.badge && (
        <span className="absolute -top-3 left-6 bg-sage text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full shadow-soft-sm">
          {meta.badge}
        </span>
      )}

      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 rounded-2xl bg-sage-light text-sage shadow-soft-sm">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">{meta.label}</p>
            <p className="text-2xl font-bold font-mono text-text-primary">
              {amount} <span className="text-xs font-normal text-text-secondary">tokens</span>
            </p>
          </div>
        </div>

        <p className="text-xs text-text-secondary mb-6 leading-relaxed">{meta.description}</p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
        <p className="text-xl font-bold font-mono text-text-primary">₹{price}</p>
        <Button onClick={() => onBuy(amount, price)} size="sm" variant={meta.badge ? "primary" : "secondary"}>
          Add Pack
        </Button>
      </div>
    </div>
  )
}
