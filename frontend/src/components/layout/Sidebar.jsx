import React from 'react'
import { LayoutDashboard, ShieldCheck, BarChart3, GitBranch, Lightbulb, Download, PlusCircle } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useNavigate } from 'react-router-dom'

export default function Sidebar() {
  const { datasetInfo, activeTab, setActiveTab, resetData } = useData()
  const navigate = useNavigate()

  const tabs = [
    { id: 'overview', icon: <LayoutDashboard size={20} />, label: 'Overview' },
    { id: 'quality', icon: <ShieldCheck size={20} />, label: 'Data Quality' },
    { id: 'explore', icon: <BarChart3 size={20} />, label: 'Explore' },
    { id: 'correlations', icon: <GitBranch size={20} />, label: 'Correlations' },
    { id: 'insights', icon: <Lightbulb size={20} />, label: 'Insights' },
    { id: 'export', icon: <Download size={20} />, label: 'Export' },
  ]

  const handleUploadNew = () => {
    resetData()
    navigate('/')
  }

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 h-full bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-4 text-indigo-600 dark:text-indigo-400">
            <BarChart3 className="w-8 h-8" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">DataLens</h1>
          </div>
          {datasetInfo && (
            <div className="text-sm">
              <div className="font-medium text-slate-800 dark:text-slate-200 truncate" title={datasetInfo.filename}>
                {datasetInfo.filename}
              </div>
              <div className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                {datasetInfo.rows.toLocaleString()} rows • {datasetInfo.cols} cols
              </div>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-3">
          <button
            onClick={handleUploadNew}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition"
          >
            <PlusCircle size={18} />
            Upload New
          </button>
        </div>
      </aside>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-around p-2 z-50">
        {tabs.slice(0, 5).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center p-2 rounded-lg ${
              activeTab === tab.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {tab.icon}
            <span className="text-[10px] mt-1">{tab.label}</span>
          </button>
        ))}
      </div>
    </>
  )
}
