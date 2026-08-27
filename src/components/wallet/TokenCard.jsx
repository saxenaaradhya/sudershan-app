import React from 'react'
import { Coins, Star, Zap } from 'lucide-react'
import Button from '../ui/Button.jsx'

const PACK_META = {
  20: {
    icon: Coins,
    label: 'Starter',
    description: 'Perfect for trying things out',
    badge: null,
  },
  80: {
    icon: Star,
    label: 'Sanctuary',
    description: 'Best value for continuous healing',
    badge: 'Recommended',
  },
  150: {
    icon: Zap,
    label: 'Mastery',
    description: 'Full lifetime access across tracks',
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
      className={`relative bg-[#151A17] border ${
        meta.badge ? 'border-[#D4AF6A]/50 shadow-xl' : 'border-[#232B26]'
      } rounded-3xl p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl`}
    >
      {meta.badge && (
        <span className="absolute -top-2.5 left-6 bg-[#D4AF6A] text-[#0C0F0E] text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">
          {meta.badge}
        </span>
      )}

      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 rounded-2xl bg-[#1C2420] border border-[#232B26] text-[#D4AF6A]">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#D4AF6A] uppercase tracking-wider">{meta.label}</p>
            <p className="text-2xl font-bold font-mono text-[#F2F4F1]">
              {amount} <span className="text-xs font-normal text-[#9BA5A0]">tokens</span>
            </p>
          </div>
        </div>

        <p className="text-xs text-[#9BA5A0] mb-6">{meta.description}</p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#232B26]">
        <p className="text-xl font-bold font-mono text-[#F2F4F1]">₹{price}</p>
        <Button onClick={() => onBuy(amount, price)} size="sm" variant="primary">
          Add Pack
        </Button>
      </div>
    </div>
  )
}
