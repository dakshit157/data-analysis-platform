import React from 'react'

export default function StatCard({ icon, label, value, subtitle, colorClass }) {
  return (
    <div className={`bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border-l-4 border border-slate-100 dark:border-slate-700 hover:shadow-md transition transform hover:-translate-y-1 ${colorClass}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
          {subtitle && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{subtitle}</p>
          )}
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg opacity-80">
          {icon}
        </div>
      </div>
    </div>
  )
}
