import React, { useMemo } from 'react'

export default function DataPreview({ data, columnTypes }) {
  if (!data || data.length === 0) return <div>No data available</div>

  const columns = Object.keys(data[0])

  // Build a per-column type lookup from {numerical:[...], categorical:[...], datetime:[...]}
  const colTypeMap = useMemo(() => {
    if (!columnTypes) return {}
    const map = {}
    ;(columnTypes.numerical || []).forEach(c => map[c] = 'numeric')
    ;(columnTypes.categorical || []).forEach(c => map[c] = 'categorical')
    ;(columnTypes.datetime || []).forEach(c => map[c] = 'datetime')
    return map
  }, [columnTypes])

  const getTypeColor = (type) => {
    switch(type?.toLowerCase()) {
      case 'numeric':
      case 'integer':
      case 'float':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'categorical':
      case 'string':
      case 'object':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
      case 'datetime':
      case 'date':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
          <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold w-12 text-center text-slate-400">#</th>
              {columns.map(col => (
                <th key={col} className="px-4 py-3 font-semibold whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    <span>{col}</span>
                    {colTypeMap[col] && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full w-max ${getTypeColor(colTypeMap[col])}`}>
                        {colTypeMap[col]}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <td className="px-4 py-3 text-center text-slate-400 text-xs">{rowIndex + 1}</td>
                {columns.map(col => (
                  <td key={col} className="px-4 py-3 truncate max-w-xs" title={String(row[col])}>
                    {row[col] !== null ? String(row[col]) : <span className="text-slate-400 italic">null</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
