import React, { useCallback, useRef, useState } from 'react'
import { Upload, FileType, AlertCircle } from 'lucide-react'
import { useData } from '../../context/DataContext'

export default function FileUploader() {
  const [isDragging, setIsDragging] = useState(false)
  const { uploadDataset, loadSample, loading } = useData()
  const fileInputRef = useRef(null)

  const onDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const onDrop = useCallback(async (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.name.endsWith('.csv')) {
      await uploadDataset(file)
    } else {
      alert("Please upload a .csv file")
    }
  }, [uploadDataset])

  const onFileChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      await uploadDataset(file)
    }
  }

  return (
    <div className="w-full">
      <div 
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
          isDragging 
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
            : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={onFileChange} 
          accept=".csv" 
          className="hidden" 
        />
        
        <div className="flex flex-col items-center justify-center space-y-4 cursor-pointer">
          <div className="p-4 bg-indigo-100 dark:bg-indigo-900/50 rounded-full text-indigo-600 dark:text-indigo-400 mb-2">
            <Upload className="w-10 h-10" />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
              {loading ? 'Uploading...' : 'Click or drag file to this area to upload'}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Support for a single CSV file. Maximum size 50MB.
            </p>
          </div>
          
          {!loading && (
            <div className="mt-6 flex items-center justify-center text-sm text-slate-400 dark:text-slate-500">
              <FileType className="w-4 h-4 mr-2" />
              Must be standard comma-separated values
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-slate-600 dark:text-slate-400">
          Don't have data right now?{' '}
          <button 
            onClick={loadSample}
            disabled={loading}
            className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline disabled:opacity-50"
          >
            Load sample dataset
          </button>
        </p>
      </div>
    </div>
  )
}
