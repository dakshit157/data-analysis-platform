import React from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const CHART_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316']

export default function AutoCharts({ charts }) {
  if (!charts) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-80 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
        ))}
      </div>
    )
  }

  if (charts.length === 0) {
    return <div className="text-center py-12 text-slate-500">No auto-generated charts available for this dataset.</div>
  }

  const tooltipStyle = {
    borderRadius: '8px',
    backgroundColor: '#1e293b',
    border: 'none',
    color: '#f8fafc'
  }

  const renderChart = (chart, idx) => {
    const { chart_type, data, x_key, y_key } = chart

    if (chart_type === 'bar' || chart_type === 'histogram') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.2} />
            <XAxis dataKey={x_key} tick={{ fill: '#64748b', fontSize: 11 }} angle={-45} textAnchor="end" height={60} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={tooltipStyle} />
            <Bar dataKey={y_key} fill={CHART_COLORS[idx % CHART_COLORS.length]} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )
    }

    if (chart_type === 'line') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.2} />
            <XAxis dataKey={x_key} tick={{ fill: '#64748b', fontSize: 11 }} angle={-45} textAnchor="end" height={60} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey={y_key} stroke={CHART_COLORS[idx % CHART_COLORS.length]} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      )
    }

    return <div className="flex items-center justify-center h-full text-slate-500">Unsupported chart type: {chart_type}</div>
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {charts.map((chart, idx) => (
        <div key={chart.chart_id || idx} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col h-96">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{chart.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Column: {chart.column}</p>
          </div>
          <div className="flex-1 w-full min-h-0">
            {renderChart(chart, idx)}
          </div>
        </div>
      ))}
    </div>
  )
}
