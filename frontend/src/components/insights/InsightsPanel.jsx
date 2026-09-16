import React, { useEffect } from 'react'
import { useData } from '../../context/DataContext'
import { Lightbulb, TrendingUp, AlertTriangle, Info, BarChart2, Hash, Tag } from 'lucide-react'

export default function InsightsPanel() {
  const { datasetId, insights, fetchInsights } = useData()

  useEffect(() => {
    if (datasetId && !insights) {
      fetchInsights()
    }
  }, [datasetId, insights, fetchInsights])

  if (!insights) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1,2,3,4,5,6].map(i => <div key={i} className="h-48 bg-slate-200 dark:bg-slate-700 rounded-xl" />)}
      </div>
    )
  }

  if (insights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400">
        <Lightbulb className="w-16 h-16 mb-4 opacity-50" />
        <h2 className="text-2xl font-medium text-slate-700 dark:text-slate-200">No Insights Found</h2>
        <p className="mt-2 text-center max-w-md">We couldn't generate any automated insights for this dataset. Try exploring the data manually.</p>
      </div>
    )
  }

  const getCategoryConfig = (category) => {
    switch(category?.toLowerCase()) {
      case 'warning':
      case 'quality':
        return { icon: <AlertTriangle className="text-amber-500" />, bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-700/50' }
      case 'success':
      case 'positive':
        return { icon: <TrendingUp className="text-emerald-500" />, bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-700/50' }
      case 'trend':
      case 'distribution':
        return { icon: <BarChart2 className="text-indigo-500" />, bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-200 dark:border-indigo-700/50' }
      case 'categorical':
        return { icon: <Tag className="text-purple-500" />, bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-700/50' }
      case 'numerical':
        return { icon: <Hash className="text-blue-500" />, bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-700/50' }
      default:
        return { icon: <Info className="text-sky-500" />, bg: 'bg-sky-50 dark:bg-sky-900/20', border: 'border-sky-200 dark:border-sky-700/50' }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="w-6 h-6 text-yellow-500" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Smart Insights</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insights.map((insight, idx) => {
          const config = getCategoryConfig(insight.category)
          return (
            <div key={idx} className={`rounded-xl p-6 border shadow-sm transition-all hover:shadow-md ${config.bg} ${config.border}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                  {config.icon}
                </div>
                {insight.category && (
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {insight.category}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 leading-tight">
                {insight.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                {insight.description}
              </p>
              {insight.value && (
                <div className="mt-auto inline-block px-3 py-1 bg-white dark:bg-slate-800 rounded-full text-sm font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm">
                  {insight.value}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
