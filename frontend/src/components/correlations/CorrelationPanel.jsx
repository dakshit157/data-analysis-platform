import React, { useEffect, useState, useMemo } from 'react'
import { useData } from '../../context/DataContext'
import HeatmapChart from './HeatmapChart'
import { getCorrelationDetail } from '../../services/api'
import { TrendingUp, TrendingDown, Info } from 'lucide-react'

export default function CorrelationPanel() {
  const { datasetId, correlations, fetchCorrelations } = useData()
  const [selectedCol, setSelectedCol] = useState(null)
  const [colDetails, setColDetails] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  useEffect(() => {
    if (datasetId && !correlations) {
      fetchCorrelations()
    }
  }, [datasetId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Convert dict-of-dicts matrix into a 2D array for the HeatmapChart
  const matrixArray = useMemo(() => {
    if (!correlations || !correlations.matrix || !correlations.columns) return []
    const cols = correlations.columns
    return cols.map(row =>
      cols.map(col => {
        const val = correlations.matrix[row]?.[col]
        return val !== undefined && val !== null ? parseFloat(val) : null
      })
    )
  }, [correlations])

  useEffect(() => {
    if (selectedCol && datasetId) {
      setLoadingDetail(true)
      getCorrelationDetail(datasetId, selectedCol)
        .then(data => {
          // Backend returns { column, correlations: [{column, value}, ...] }
          // Split into positive and negative for the UI
          const positive = (data.correlations || [])
            .filter(c => c.value > 0)
            .sort((a, b) => b.value - a.value)
          const negative = (data.correlations || [])
            .filter(c => c.value < 0)
            .sort((a, b) => a.value - b.value)
          setColDetails({ positive, negative })
        })
        .catch(err => console.error(err))
        .finally(() => setLoadingDetail(false))
    }
  }, [selectedCol, datasetId])

  if (!correlations) {
    return (
      <div className="animate-pulse flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3 h-96 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        <div className="lg:w-1/3 h-96 bg-slate-200 dark:bg-slate-700 rounded-xl" />
      </div>
    )
  }

  if (!correlations.columns || correlations.columns.length < 2) {
    return (
      <div className="bg-white dark:bg-slate-800 p-12 rounded-xl text-center shadow-sm border border-slate-200 dark:border-slate-700">
        <Info className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-2">Not Enough Numerical Data</h3>
        <p className="text-slate-500 dark:text-slate-400">
          Correlation analysis requires at least two numerical columns. This dataset does not have enough numerical variables to compute correlations.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Heatmap */}
      <div className="lg:w-2/3 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Correlation Matrix</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Click on any cell to view detailed relationships for that variable.
          </p>
        </div>
        <div className="w-full overflow-x-auto">
          <HeatmapChart
            columns={correlations.columns}
            matrix={matrixArray}
            onCellClick={(col) => setSelectedCol(col)}
          />
        </div>
      </div>

      {/* Detail Panel */}
      <div className="lg:w-1/3 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Variable Analysis
        </h3>

        {!selectedCol ? (
          <div className="h-48 flex flex-col items-center justify-center text-slate-400 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-4">
            <Info className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">Select a cell in the heatmap to view strongly correlated variables</p>
          </div>
        ) : loadingDetail ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-12 bg-slate-100 dark:bg-slate-700 rounded-lg" />)}
          </div>
        ) : colDetails ? (
          <div className="space-y-6">
            {/* Selected Variable */}
            <div>
              <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                Selected Variable
              </h4>
              <div className="px-4 py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg font-medium">
                {selectedCol}
              </div>
            </div>

            {/* Strongest Positive */}
            <div>
              <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                Strongest Positive
              </h4>
              <div className="space-y-2">
                {colDetails.positive.length > 0 ? (
                  colDetails.positive.map((item, i) => (
                    <div key={i} className="flex justify-between items-center px-3 py-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-sm">
                      <span className="text-slate-700 dark:text-slate-200 font-medium truncate pr-4">{item.column}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${Math.abs(item.value) * 100}%` }}
                          />
                        </div>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold w-12 text-right">{item.value.toFixed(2)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 italic">No positive correlations found</p>
                )}
              </div>
            </div>

            {/* Strongest Negative */}
            <div>
              <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-red-500" />
                Strongest Negative
              </h4>
              <div className="space-y-2">
                {colDetails.negative.length > 0 ? (
                  colDetails.negative.map((item, i) => (
                    <div key={i} className="flex justify-between items-center px-3 py-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-sm">
                      <span className="text-slate-700 dark:text-slate-200 font-medium truncate pr-4">{item.column}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-500 rounded-full"
                            style={{ width: `${Math.abs(item.value) * 100}%` }}
                          />
                        </div>
                        <span className="text-red-600 dark:text-red-400 font-bold w-12 text-right">{item.value.toFixed(2)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 italic">No negative correlations found</p>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
