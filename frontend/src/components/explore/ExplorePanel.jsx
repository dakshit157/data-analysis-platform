import React, { useState, useEffect } from 'react'
import { useData } from '../../context/DataContext'
import AutoCharts from './AutoCharts'
import InteractiveChart from './InteractiveChart'
import { Wand2, Settings2 } from 'lucide-react'

export default function ExplorePanel() {
  const [mode, setMode] = useState('auto') // 'auto' or 'custom'
  const { datasetId, exploreData, fetchExplore } = useData()

  useEffect(() => {
    if (datasetId && mode === 'auto' && !exploreData) {
      fetchExplore()
    }
  }, [datasetId, mode, exploreData, fetchExplore])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Data Exploration</h2>
        
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setMode('auto')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'auto' 
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            Auto Analysis
          </button>
          <button
            onClick={() => setMode('custom')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'custom' 
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Settings2 className="w-4 h-4" />
            Custom Chart
          </button>
        </div>
      </div>

      {mode === 'auto' ? (
        <AutoCharts charts={exploreData?.charts} />
      ) : (
        <InteractiveChart />
      )}
    </div>
  )
}
