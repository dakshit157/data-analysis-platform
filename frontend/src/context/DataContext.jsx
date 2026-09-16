import React, { createContext, useContext, useState } from 'react'
import * as api from '../services/api'
import toast from 'react-hot-toast'

const DataContext = createContext()

export function DataProvider({ children }) {
  const [datasetId, setDatasetId] = useState(null)
  const [datasetInfo, setDatasetInfo] = useState(null)
  const [preview, setPreview] = useState(null)
  const [columnTypes, setColumnTypes] = useState(null)
  
  const [overview, setOverview] = useState(null)
  const [quality, setQuality] = useState(null)
  const [exploreData, setExploreData] = useState(null)
  const [correlations, setCorrelations] = useState(null)
  const [insights, setInsights] = useState(null)
  
  const [filters, setFilters] = useState([])
  const [filteredData, setFilteredData] = useState(null)
  
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const resetData = () => {
    setDatasetId(null)
    setDatasetInfo(null)
    setPreview(null)
    setColumnTypes(null)
    setOverview(null)
    setQuality(null)
    setExploreData(null)
    setCorrelations(null)
    setInsights(null)
    setFilters([])
    setFilteredData(null)
    setActiveTab('overview')
  }

  const handleUploadResponse = (data) => {
    setDatasetId(data.dataset_id)
    setDatasetInfo({
      filename: data.filename,
      rows: data.rows,
      cols: data.columns,
      fileSize: data.file_size
    })
    setPreview(data.preview)
    setColumnTypes(data.column_types)
  }

  const uploadDataset = async (file) => {
    setLoading(true)
    try {
      const data = await api.uploadFile(file)
      handleUploadResponse(data)
      toast.success('Dataset uploaded successfully')
    } catch (error) {
      toast.error('Failed to upload dataset')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const loadSample = async () => {
    setLoading(true)
    try {
      const data = await api.loadSampleDataset()
      handleUploadResponse(data)
      toast.success('Sample dataset loaded')
    } catch (error) {
      toast.error('Failed to load sample dataset')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOverview = async () => {
    if (!datasetId || overview) return
    setLoading(true)
    try {
      const data = await api.getOverview(datasetId)
      setOverview(data)
    } catch (error) {
      toast.error('Failed to load overview')
    } finally {
      setLoading(false)
    }
  }

  const fetchQuality = async () => {
    if (!datasetId || quality) return
    setLoading(true)
    try {
      const data = await api.getQuality(datasetId)
      setQuality(data)
    } catch (error) {
      toast.error('Failed to load quality metrics')
    } finally {
      setLoading(false)
    }
  }

  const fetchExplore = async () => {
    if (!datasetId || exploreData) return
    setLoading(true)
    try {
      const data = await api.getExplore(datasetId)
      setExploreData(data)
    } catch (error) {
      toast.error('Failed to load explore data')
    } finally {
      setLoading(false)
    }
  }

  const fetchCorrelations = async () => {
    if (!datasetId || correlations) return
    setLoading(true)
    try {
      const data = await api.getCorrelations(datasetId)
      setCorrelations(data)
    } catch (error) {
      toast.error('Failed to load correlations')
    } finally {
      setLoading(false)
    }
  }

  const fetchInsights = async () => {
    if (!datasetId || insights) return
    setLoading(true)
    try {
      const data = await api.getInsights(datasetId)
      setInsights(data.insights || data)
    } catch (error) {
      toast.error('Failed to load insights')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = async (filterSpecs) => {
    setLoading(true)
    try {
      const data = await api.postFilter(datasetId, filterSpecs)
      setFilters(filterSpecs)
      setFilteredData(data)
      toast.success('Filters applied')
    } catch (error) {
      toast.error('Failed to apply filters')
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setFilters([])
    setFilteredData(null)
  }

  return (
    <DataContext.Provider
      value={{
        datasetId, datasetInfo, preview, columnTypes,
        overview, quality, exploreData, correlations, insights,
        filters, filteredData,
        loading, activeTab,
        uploadDataset, loadSample,
        fetchOverview, fetchQuality, fetchExplore, fetchCorrelations, fetchInsights,
        applyFilters, clearFilters, setActiveTab, resetData, setLoading
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
