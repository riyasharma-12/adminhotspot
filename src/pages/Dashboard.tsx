
import React from 'react'
import { BarChart3, Users, Plane, Hotel, Car, Shield, MessageSquare, Globe, TrendingUp, Search, Bell } from 'lucide-react'

export default function SkyDashboard() {
  const stats = [
    { label: 'Total Users',       value: '12,480', icon: Users,         color: 'text-blue-400',    bg: 'bg-blue-900/20',    border: 'border-blue-800/40' },
    { label: 'Affiliate Clicks',  value: '84,221', icon: TrendingUp,    color: 'text-emerald-400', bg: 'bg-emerald-900/20', border: 'border-emerald-800/40' },
    { label: 'Flight Searches',   value: '31,902', icon: Plane,         color: 'text-sky-400',     bg: 'bg-sky-900/20',     border: 'border-sky-800/40' },
    { label: 'Pending Reviews',   value: '128',    icon: MessageSquare, color: 'text-amber-400',   bg: 'bg-amber-900/20',   border: 'border-amber-800/40' },
  ]

  const cards = [
    { title: 'Flights',    desc: 'Manage partners, routes and redirects',   icon: Plane },
    { title: 'Hotels',     desc: 'Booking offers and stay campaigns',        icon: Hotel },
    { title: 'Car Rentals',desc: 'Rental providers and conversions',         icon: Car },
    { title: 'Insurance',  desc: 'Travel cover partners & plans',            icon: Shield },
    { title: 'Content',    desc: 'Blogs, airports, banners & SEO',           icon: Globe },
    { title: 'Analytics',  desc: 'UTM, pixels and traffic insights',         icon: BarChart3 },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ── Page Header ─────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
            <p className="text-gray-500 text-sm mt-1">Travel affiliate platform performance summary</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2">
              <Search size={16} className="text-gray-500" />
              <input
                placeholder="Search..."
                className="bg-transparent outline-none text-sm text-white placeholder-gray-500 w-40"
              />
            </div>
            <button className="p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-white transition-colors">
              <Bell size={18} />
            </button>
          </div>
        </div>

        {/* ── Stat Cards ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {stats.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{item.label}</p>
                  <div className={`p-1.5 rounded-lg ${item.bg} border ${item.border}`}>
                    <Icon size={14} className={item.color} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{item.value}</p>
              </div>
            )
          })}
        </div>

        {/* ── Mid Row ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">

          {/* Top Airports */}
          <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800">
              <h3 className="text-white font-semibold">Top Airports</h3>
              <p className="text-gray-500 text-xs mt-0.5">Most visited airport pages this month</p>
            </div>
            <div className="divide-y divide-gray-800">
              {[
                { name: 'Bratislava (BTS)', value: '18,420 visits', pct: 75 },
                { name: 'Košice (KSC)',      value: '11,208 visits', pct: 46 },
                { name: 'Poprad-Tatry (TAT)',value: '6,932 visits',  pct: 28 },
              ].map(({ name, value, pct }) => (
                <div key={name} className="px-5 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm">{name}</span>
                    <span className="text-gray-400 text-xs">{value}</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800">
              <h3 className="text-white font-semibold">Pending Tasks</h3>
              <p className="text-gray-500 text-xs mt-0.5">Requires your attention</p>
            </div>
            <div className="divide-y divide-gray-800">
              {[
                { task: 'Approve 128 reviews',          color: 'bg-amber-400' },
                { task: 'Update Summer seasonal routes', color: 'bg-sky-400' },
                { task: 'Check partner redirects',       color: 'bg-blue-400' },
                { task: 'Review GDPR consent logs',      color: 'bg-red-400' },
              ].map(({ task, color }) => (
                <div key={task} className="flex items-center gap-3 px-5 py-3.5">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${color}`} />
                  <span className="text-gray-300 text-sm">{task}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Module Cards ─────────────────────────────────────────────────── */}
        {/* <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <h3 className="text-white font-semibold">Quick Access</h3>
            <p className="text-gray-500 text-xs mt-0.5">Jump to any management module</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-800">
            {cards.map((card) => {
              const Icon = card.icon
              return (
                <div
                  key={card.title}
                  className="flex items-start gap-4 p-5 hover:bg-gray-800/50 transition-colors cursor-pointer group"
                >
                  <div className="p-2 rounded-lg bg-gray-800 border border-gray-700 group-hover:border-sky-700 group-hover:bg-sky-900/20 transition-colors flex-shrink-0">
                    <Icon size={16} className="text-gray-400 group-hover:text-sky-400 transition-colors" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium group-hover:text-sky-400 transition-colors">{card.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{card.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div> */}

      </div>
    </div>
  )
}