import React, { useState, useMemo } from 'react'
import {
  BarChart, Bar, LineChart, Line, ScatterChart, Scatter,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { useData } from '../../context/DataContext'
import { postCustomChart } from '../../services/api'
import toast from 'react-hot-toast'
import { Settings2 } from 'lucide-react'

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316']

export default function InteractiveChart() {
  const { datasetId, columnTypes } = useData()
  const [loading, setLoading] = useState(false)
  const [chartResult, setChartResult] = useState(null)

  const [xAxis, setXAxis] = useState('')
  const [yAxis, setYAxis] = useState('')
  const [chartType, setChartType] = useState('bar')
  const [aggregation, setAggregation] = useState('sum')

  // Derive column lists from the columnTypes shape: { numerical: [...], categorical: [...], datetime: [...] }
  const columns = useMemo(() => {
    if (!columnTypes) return { all: [], numeric: [], categorical: [] }
    const numeric = columnTypes.numerical || []
    const categorical = columnTypes.categorical || []
    const datetime = columnTypes.datetime || []
    const all = [...numeric, ...categorical, ...datetime]
    return { all, numeric, categorical }
  }, [columnTypes])

  const generateChart = async () => {
    if (!xAxis) return toast.error('Please select an X-Axis column')

    setLoading(true)
    try {
      const result = await postCustomChart(datasetId, {
        x_column: xAxis,
        y_column: yAxis || null,
        chart_type: chartType,
        aggregation: yAxis ? aggregation : null
      })
      setChartResult(result)
    } catch (error) {
      toast.error('Failed to generate chart')
    } finally {
      setLoading(false)
    }
  }

  const renderChartContent = () => {
    if (!chartResult) return (
      <div className="h-96 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
        <Settings2 className="w-12 h-12 mb-4 opacity-50" />
        <p>Configure and generate a chart to view it here</p>
      </div>
    )

    if (loading) return (
      <div className="h-96 flex items-center justify-center text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )

    const { data, x_key, y_key, chart_type: resultChartType } = chartResult

    if (!data || data.length === 0) return (
      <div className="h-96 flex items-center justify-center text-slate-400">
        <p>No data available for this chart configuration</p>
      </div>
    )

    const tooltipStyle = {
      borderRadius: '8px',
      backgroundColor: '#1e293b',
      border: 'none',
      color: '#f8fafc'
    }

    const commonMargin = { top: 20, right: 30, left: 20, bottom: 60 }

    switch (resultChartType) {
      case 'bar':
      case 'histogram':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={commonMargin}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.2} />
              <XAxis dataKey={x_key} angle={-45} textAnchor="end" height={80} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748b' }} />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={tooltipStyle} />
              <Legend />
              <Bar dataKey={y_key} name={y_key} fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={commonMargin}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.2} />
              <XAxis dataKey={x_key} angle={-45} textAnchor="end" height={80} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748b' }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Line type="monotone" dataKey={y_key} name={y_key} stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        )

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={commonMargin}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.2} />
              <XAxis dataKey={x_key} type="number" name={x_key} tick={{ fill: '#64748b' }} />
              <YAxis dataKey={y_key} type="number" name={y_key} tick={{ fill: '#64748b' }} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={tooltipStyle} />
              <Legend />
              <Scatter name={`${x_key} vs ${y_key}`} data={data} fill="#8b5cf6" />
            </ScatterChart>
          </ResponsiveContainer>
        )

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                dataKey={y_key}
                nameKey={x_key}
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )

      case 'box':
        return (
          <div className="h-96 flex items-center justify-center text-slate-500">
            <p>Box plot rendering — view the raw statistics in the Data Quality tab for detailed quartile information.</p>
          </div>
        )

      default:
        return (
          <div className="h-96 flex items-center justify-center text-slate-400">
            <p>Unsupported chart type: {resultChartType}</p>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Chart Type</label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
              <option value="scatter">Scatter Plot</option>
              <option value="pie">Pie Chart</option>
              <option value="histogram">Histogram</option>
              <option value="box">Box Plot</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">X-Axis</label>
            <select
              value={xAxis}
              onChange={(e) => setXAxis(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Column...</option>
              {columns.all.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Y-Axis (Optional)</label>
            <select
              value={yAxis}
              onChange={(e) => setYAxis(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">None (Count)</option>
              {columns.numeric.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>

          {yAxis && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Aggregation</label>
              <select
                value={aggregation}
                onChange={(e) => setAggregation(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="sum">Sum</option>
                <option value="mean">Mean (Average)</option>
                <option value="median">Median</option>
                <option value="count">Count</option>
              </select>
            </div>
          )}

          <div className={!yAxis ? 'lg:col-span-2' : ''}>
            <button
              onClick={generateChart}
              disabled={loading || !xAxis}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-lg p-2.5 transition-colors"
            >
              {loading ? 'Generating...' : 'Generate Chart'}
            </button>
          </div>

        </div>
      </div>

      {/* Chart Display */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        {renderChartContent()}
      </div>
    </div>
  )
}
