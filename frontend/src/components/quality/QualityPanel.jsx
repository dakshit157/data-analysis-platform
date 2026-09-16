import React, { useEffect } from 'react'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import { useData } from '../../context/DataContext'
import StatCard from '../overview/StatCard'
import MissingValuesChart from './MissingValuesChart'
import DataTypeBadges from './DataTypeBadges'

export default function QualityPanel() {
  const { datasetId, quality, fetchQuality, columnTypes, overview } = useData()

  useEffect(() => {
    if (datasetId && !quality) {
      fetchQuality()
    }
  }, [datasetId]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!quality) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl" />)}
        </div>
        <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded-xl" />
      </div>
    )
  }

  // quality is { columns: [...], total_missing, total_duplicates }
  const qualityColumns = quality.columns || []
  const totalMissing = quality.total_missing ?? 0
  const totalDuplicates = quality.total_duplicates ?? 0

  const columnsWithMissing = qualityColumns
    .filter(col => col.missing_count > 0)
    .sort((a, b) => b.missing_percentage - a.missing_percentage)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Data Quality Report</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatCard
            label="Total Missing Values"
            value={totalMissing.toLocaleString()}
            icon={<AlertTriangle className="text-red-500" />}
            colorClass="border-l-red-500"
          />
          <StatCard
            label="Duplicate Rows"
            value={totalDuplicates.toLocaleString()}
            icon={<AlertTriangle className="text-yellow-500" />}
            colorClass="border-l-yellow-500"
          />
          <StatCard
            label="Columns Analyzed"
            value={qualityColumns.length}
            icon={<CheckCircle className="text-green-500" />}
            colorClass="border-l-green-500"
          />
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Data Types Distribution</h3>
          <DataTypeBadges columnTypes={columnTypes} />
        </div>
      </div>

      {columnsWithMissing.length > 0 && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6">Missing Values by Column</h3>
          <MissingValuesChart data={columnsWithMissing} />
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Column Quality Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Column</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Missing Count</th>
                <th className="px-6 py-4 font-semibold w-1/4">Missing %</th>
                <th className="px-6 py-4 font-semibold">Unique Values</th>
                <th className="px-6 py-4 font-semibold">Potential Outliers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {qualityColumns.map((col, idx) => {
                const missingPct = col.missing_percentage ?? 0
                let pColor = 'bg-green-500'
                if (missingPct > 10) pColor = 'bg-yellow-500'
                if (missingPct > 30) pColor = 'bg-orange-500'
                if (missingPct > 60) pColor = 'bg-red-500'

                return (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{col.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-200">
                        {col.dtype}
                      </span>
                    </td>
                    <td className="px-6 py-4">{col.missing_count?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="w-12">{missingPct.toFixed(1)}%</span>
                        <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className={`h-full ${pColor} rounded-full`} style={{ width: `${Math.min(missingPct, 100)}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{col.unique_count?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      {col.outlier_count > 0 ? (
                        <span className="text-orange-500 font-medium flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4" />
                          {col.outlier_count}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
