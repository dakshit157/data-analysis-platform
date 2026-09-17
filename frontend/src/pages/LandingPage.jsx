import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, Database, BarChart3, ShieldCheck, GitBranch, Download, Play, Loader2, FileSpreadsheet, FileText } from 'lucide-react'
import { useData } from '../context/DataContext'

export default function LandingPage() {
  const navigate = useNavigate()
  const { uploadDataset, loadSample, loading } = useData()
  const fileInputRef = useRef(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      const success = await uploadDataset(file)
      if (success) {
        navigate('/dashboard')
      }
      setIsUploading(false)
    }
  }

  const handleSampleClick = async () => {
    setIsUploading(true)
    const success = await loadSample()
    if (success) {
      navigate('/dashboard')
    }
    setIsUploading(false)
  }

  const features = [
    { icon: <Database className="w-6 h-6" />, title: 'Upload & Parse', desc: 'Instantly ingest CSV files with automatic schema detection.' },
    { icon: <BarChart3 className="w-6 h-6" />, title: 'Interactive Charts', desc: 'Create stunning visualizations with zero configuration.' },
    { icon: <ShieldCheck className="w-6 h-6" />, title: 'Data Quality', desc: 'Spot missing values and outliers with automated profiling.' },
    { icon: <GitBranch className="w-6 h-6" />, title: 'Correlations', desc: 'Discover hidden relationships in your numerical data.' },
    { icon: <Play className="w-6 h-6" />, title: 'Smart Analysis', desc: 'Get automated insights and trend detection immediately.' },
    { icon: <Download className="w-6 h-6" />, title: 'Export Results', desc: 'Download your cleaned data and generated reports.' }
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="bg-white/20 p-3 rounded-full">
              <BarChart3 className="w-10 h-10" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight">DataLens</h1>
          </div>
          <p className="text-2xl font-light mb-10 text-indigo-100">
            Transform raw data into actionable insights
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={handleUploadClick}
              disabled={loading || isUploading}
              className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg shadow-lg hover:bg-indigo-50 transition transform hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
              {isUploading ? 'Uploading...' : 'Upload Dataset'}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".csv,.xlsx,.xls,.json" 
              className="hidden" 
            />
            <button 
              onClick={handleSampleClick}
              disabled={loading || isUploading}
              className="px-8 py-4 bg-indigo-500/30 text-white border border-indigo-300/30 font-semibold rounded-lg hover:bg-indigo-500/50 transition transform hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Database className="w-5 h-5" />}
              {isUploading ? 'Loading...' : 'Try Sample Dataset'}
            </button>
          </div>
          
          {/* Supported Formats Info */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-indigo-100 opacity-90">
            <span className="flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4" /> CSV
            </span>
            <span className="flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4" /> Excel (.xlsx, .xls)
            </span>
            <span className="flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> JSON
            </span>
            <span className="flex items-center gap-1.5">
              <Upload className="w-4 h-4" /> Max 20MB
            </span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm hover:shadow-md transition transform hover:-translate-y-1 border border-slate-100 dark:border-slate-700">
              <div className="text-indigo-600 dark:text-indigo-400 mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-slate-600 dark:text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-white dark:bg-slate-800 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-indigo-100 dark:bg-indigo-900/50 -z-10 -translate-y-1/2"></div>
            {[
              { num: 1, title: 'Upload', desc: 'Drag & drop your CSV file' },
              { num: 2, title: 'Analyze', desc: 'Explore auto-generated charts' },
              { num: 3, title: 'Act', desc: 'Export insights and reports' }
            ].map(step => (
              <div key={step.num} className="flex flex-col items-center bg-white dark:bg-slate-800 p-4">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4 shadow-lg">
                  {step.num}
                </div>
                <h3 className="font-semibold text-lg">{step.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-1">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
        <p>Built with ❤️ for data enthusiasts</p>
      </footer>
    </div>
  )
}
