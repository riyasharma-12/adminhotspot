import React from 'react'
import { Clock, Package } from 'lucide-react'

const Order = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl p-10 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700">
          <Package className="h-10 w-10 text-zinc-300" />
        </div>

        <h1 className="text-4xl font-bold tracking-tight mb-3">Orders</h1>
        <p className="text-amber-400 text-lg font-medium mb-6">Coming Soon</p>

        <p className="text-zinc-400 leading-relaxed mb-8">
          We're building a smooth order experience so you can track purchases, view history, and manage deliveries in one place.
        </p>

        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800 px-5 py-3 text-sm text-zinc-300">
          <Clock className="h-4 w-4" />
          Launching Soon
        </div>
      </div>
    </div>
  )
}

export default Order
