import React from 'react'
import { useData } from '../context/DataContext'
import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'
import FileUploader from '../components/upload/FileUploader'
import FilterBar from '../components/filters/FilterBar'
import OverviewPanel from '../components/overview/OverviewPanel'
import QualityPanel from '../components/quality/QualityPanel'
import ExplorePanel from '../components/explore/ExplorePanel'
import CorrelationPanel from '../components/correlations/CorrelationPanel'
import InsightsPanel from '../components/insights/InsightsPanel'
import ExportPanel from '../components/export/ExportPanel'

export default function DashboardPage() {
  const { datasetId, activeTab } = useData()

  if (!datasetId) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <h1 className="text-3xl font-bold text-center mb-8 text-slate-900 dark:text-white">
            Get Started with DataLens
          </h1>
          <FileUploader />
        </div>
      </div>
    )
  }

  const renderPanel = () => {
    switch (activeTab) {
      case 'overview': return <OverviewPanel />
      case 'quality': return <QualityPanel />
      case 'explore': return <ExplorePanel />
      case 'correlations': return <CorrelationPanel />
      case 'insights': return <InsightsPanel />
      case 'export': return <ExportPanel />
      default: return <OverviewPanel />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Navbar />
        <FilterBar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {renderPanel()}
        </main>
      </div>
    </div>
  )
}
