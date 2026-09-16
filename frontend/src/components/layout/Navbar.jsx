import React from 'react'
import { useData } from '../../context/DataContext'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { activeTab, datasetInfo } = useData()

  const formatTabName = (tab) => {
    const names = {
      overview: 'Overview',
      quality: 'Data Quality',
      explore: 'Explore',
      correlations: 'Correlations',
      insights: 'Insights',
      export: 'Export'
    }
    return names[tab] || 'Dashboard'
  }

  return (
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 transition-colors duration-300 z-10">
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        {formatTabName(activeTab)}
      </h2>
      
      <div className="flex items-center gap-4">
        {datasetInfo && (
          <div className="hidden sm:block">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
              {datasetInfo.filename}
            </span>
          </div>
        )}
        <ThemeToggle />
      </div>
    </header>
  )
}
