import React, { useEffect } from 'react'
import { Rows, Columns, Hash, Tag, AlertCircle, Copy } from 'lucide-react'
import { useData } from '../../context/DataContext'
import StatCard from './StatCard'
import DataPreview from './DataPreview'

export default function OverviewPanel() {
  const { datasetId, overview, fetchOverview, datasetInfo, preview, columnTypes } = useData()

  useEffect(() => {
    if (datasetId && !overview) {
      fetchOverview()
    }
  }, [datasetId, overview, fetchOverview])

  if (!overview || !datasetInfo) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl" />)}
        </div>
        <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded-xl" />
      </div>
    )
  }

  const stats = [
    { label: 'Total Rows', value: overview.rows?.toLocaleString() || datasetInfo.rows.toLocaleString(), icon: <Rows className="text-blue-500" />, colorClass: 'border-l-blue-500' },
    { label: 'Total Columns', value: overview.columns?.toLocaleString() || datasetInfo.cols.toLocaleString(), icon: <Columns className="text-emerald-500" />, colorClass: 'border-l-emerald-500' },
    { label: 'Numerical Columns', value: overview.numerical_columns?.length || 0, icon: <Hash className="text-purple-500" />, colorClass: 'border-l-purple-500' },
    { label: 'Categorical Columns', value: overview.categorical_columns?.length || 0, icon: <Tag className="text-orange-500" />, colorClass: 'border-l-orange-500' },
    { label: 'Missing Values', value: (overview.missing_values ?? 0).toLocaleString(), icon: <AlertCircle className="text-red-500" />, colorClass: 'border-l-red-500' },
    { label: 'Duplicate Rows', value: (overview.duplicate_rows ?? 0).toLocaleString(), icon: <Copy className="text-yellow-500" />, colorClass: 'border-l-yellow-500' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Dataset Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Data Preview</h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">Showing first {preview?.length || 0} rows</span>
        </div>
        <DataPreview data={preview} columnTypes={columnTypes} />
      </div>
    </div>
  )
}
