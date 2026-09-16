import React, { useState, useMemo } from 'react'
import { Filter, X, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import { useData } from '../../context/DataContext'
import toast from 'react-hot-toast'

export default function FilterBar() {
  const { datasetId, columnTypes, overview, filters, applyFilters, clearFilters, loading } = useData()
  const [expanded, setExpanded] = useState(false)
  const [localFilters, setLocalFilters] = useState([])

  // Build column info from columnTypes and overview
  const columnInfo = useMemo(() => {
    if (!columnTypes) return []
    const all = []
    ;(columnTypes.numerical || []).forEach(col => all.push({ name: col, type: 'numerical' }))
    ;(columnTypes.categorical || []).forEach(col => all.push({ name: col, type: 'categorical' }))
    ;(columnTypes.datetime || []).forEach(col => all.push({ name: col, type: 'datetime' }))
    return all
  }, [columnTypes])

  if (!datasetId) return null

  const addFilter = () => {
    setLocalFilters(prev => [...prev, { column: '', operator: 'eq', value: '' }])
  }

  const removeFilter = (index) => {
    setLocalFilters(prev => prev.filter((_, i) => i !== index))
  }

  const updateFilter = (index, field, val) => {
    setLocalFilters(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: val }
      // Reset operator and value when column changes
      if (field === 'column') {
        const colInfo = columnInfo.find(c => c.name === val)
        updated[index].operator = colInfo?.type === 'numerical' ? 'gt' : 'eq'
        updated[index].value = ''
      }
      return updated
    })
  }

  const getOperatorsForColumn = (colName) => {
    const colInfo = columnInfo.find(c => c.name === colName)
    if (!colInfo) return []
    if (colInfo.type === 'numerical') {
      return [
        { value: 'eq', label: '=' },
        { value: 'neq', label: '≠' },
        { value: 'gt', label: '>' },
        { value: 'gte', label: '≥' },
        { value: 'lt', label: '<' },
        { value: 'lte', label: '≤' },
      ]
    }
    if (colInfo.type === 'categorical') {
      return [
        { value: 'eq', label: 'Equals' },
        { value: 'neq', label: 'Not Equals' },
      ]
    }
    // datetime
    return [
      { value: 'eq', label: 'Equals' },
      { value: 'gt', label: 'After' },
      { value: 'lt', label: 'Before' },
    ]
  }

  const handleApply = () => {
    // Only send filters with a column and value
    const validFilters = localFilters.filter(f => f.column && f.value !== '')
    if (validFilters.length === 0) {
      toast('No valid filters to apply', { icon: 'ℹ️' })
      return
    }
    // Convert numeric values
    const mapped = validFilters.map(f => {
      const colInfo = columnInfo.find(c => c.name === f.column)
      let value = f.value
      if (colInfo?.type === 'numerical') {
        value = parseFloat(value)
        if (isNaN(value)) {
          toast.error(`Invalid number for column "${f.column}"`)
          return null
        }
      }
      return { column: f.column, operator: f.operator, value }
    }).filter(Boolean)

    if (mapped.length > 0) {
      applyFilters(mapped)
      setExpanded(false)
    }
  }

  const handleClear = () => {
    setLocalFilters([])
    clearFilters()
  }

  const activeCount = filters.length

  return (
    <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-2 transition-all">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-2"
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeCount > 0 && (
            <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full text-xs">
              {activeCount}
            </span>
          )}
          {expanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
        </button>

        {activeCount > 0 && !expanded && (
          <button
            onClick={handleClear}
            className="text-xs text-slate-500 hover:text-red-500 transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Clear All
          </button>
        )}
      </div>

      {expanded && (
        <div className="py-4 border-t border-slate-100 dark:border-slate-700 mt-2 space-y-3">
          {/* Filter Rows */}
          {localFilters.map((filter, index) => (
            <div key={index} className="flex items-center gap-3 flex-wrap">
              {/* Column Select */}
              <select
                value={filter.column}
                onChange={(e) => updateFilter(index, 'column', e.target.value)}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg p-2 text-sm min-w-[160px]"
              >
                <option value="">Select column...</option>
                {columnInfo.map(c => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.type})
                  </option>
                ))}
              </select>

              {/* Operator Select */}
              {filter.column && (
                <select
                  value={filter.operator}
                  onChange={(e) => updateFilter(index, 'operator', e.target.value)}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg p-2 text-sm min-w-[100px]"
                >
                  {getOperatorsForColumn(filter.column).map(op => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                  ))}
                </select>
              )}

              {/* Value Input */}
              {filter.column && (
                <input
                  type={columnInfo.find(c => c.name === filter.column)?.type === 'numerical' ? 'number' : 'text'}
                  value={filter.value}
                  onChange={(e) => updateFilter(index, 'value', e.target.value)}
                  placeholder="Value..."
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg p-2 text-sm min-w-[140px]"
                />
              )}

              {/* Remove Button */}
              <button
                onClick={() => removeFilter(index)}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Add Filter + Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={addFilter}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Filter
            </button>

            {localFilters.length > 0 && (
              <>
                <button
                  onClick={handleApply}
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {loading ? 'Applying...' : 'Apply Filters'}
                </button>
                <button
                  onClick={handleClear}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 text-sm font-medium rounded-lg transition-colors"
                >
                  Clear All
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
