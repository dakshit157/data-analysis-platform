import React, { useState } from 'react'
import { FileDown, FileJson, Image as ImageIcon, Download } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { exportCSV, exportSummary } from '../../services/api'
import toast from 'react-hot-toast'
import html2canvas from 'html2canvas'

export default function ExportPanel() {
  const { datasetId, datasetInfo } = useData()
  const [isExportingImage, setIsExportingImage] = useState(false)

  const handleDownloadCSV = () => {
    try {
      exportCSV(datasetId)
      toast.success('Downloading CSV...')
    } catch (e) {
      toast.error('Failed to download CSV')
    }
  }

  const handleDownloadSummary = () => {
    try {
      exportSummary(datasetId)
      toast.success('Downloading Summary JSON...')
    } catch (e) {
      toast.error('Failed to download summary')
    }
  }

  const handleDownloadCharts = async () => {
    setIsExportingImage(true)
    const toastId = toast.loading('Capturing visible charts...')
    try {
      const dashboard = document.querySelector('main')
      if (dashboard) {
        const canvas = await html2canvas(dashboard, {
          backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#f8fafc',
          scale: 2,
          logging: false
        })
        const link = document.createElement('a')
        link.download = `datalens_charts_${Date.now()}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
        toast.success('Screenshot downloaded!', { id: toastId })
      } else {
        toast.error('No dashboard content found to capture', { id: toastId })
      }
    } catch (e) {
      console.error(e)
      toast.error('Failed to capture charts', { id: toastId })
    } finally {
      setIsExportingImage(false)
    }
  }

  const options = [
    {
      title: 'Export Filtered Data',
      description: 'Download the current view of your dataset as a standard CSV file. Includes any active filters.',
      icon: <FileDown className="w-8 h-8 text-emerald-500" />,
      action: handleDownloadCSV,
      btnText: 'Download CSV'
    },
    {
      title: 'Export Analysis Summary',
      description: 'Download a comprehensive JSON report containing data quality metrics, insights, and correlations.',
      icon: <FileJson className="w-8 h-8 text-indigo-500" />,
      action: handleDownloadSummary,
      btnText: 'Download JSON'
    },
    {
      title: 'Export Current View',
      description: 'Take a high-resolution screenshot of the currently visible charts and tables for your presentations.',
      icon: <ImageIcon className="w-8 h-8 text-purple-500" />,
      action: handleDownloadCharts,
      btnText: isExportingImage ? 'Capturing...' : 'Download Image',
      disabled: isExportingImage
    }
  ]

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Export & Share</h2>
        <p className="text-slate-500 dark:text-slate-400">
          Download your processed data, analysis results, or visual reports.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {options.map((opt, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-md">
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-full mb-6">
              {opt.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">
              {opt.title}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 flex-1">
              {opt.description}
            </p>
            <button
              onClick={opt.action}
              disabled={opt.disabled}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-5 h-5" />
              {opt.btnText}
            </button>
          </div>
        ))}
      </div>
      
      {datasetInfo && (
        <div className="mt-12 text-center text-sm text-slate-400 dark:text-slate-500">
          Original dataset: <span className="font-medium text-slate-600 dark:text-slate-300">{datasetInfo.filename}</span> ({Math.round(datasetInfo.fileSize / 1024)} KB)
        </div>
      )}
    </div>
  )
}
