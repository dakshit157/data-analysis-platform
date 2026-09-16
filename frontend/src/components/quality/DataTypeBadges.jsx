import React from 'react'

export default function DataTypeBadges({ columnTypes }) {
  if (!columnTypes) return null

  // columnTypes is { numerical: [...], categorical: [...], datetime: [...] }
  const numCount = columnTypes.numerical?.length || 0
  const catCount = columnTypes.categorical?.length || 0
  const dateCount = columnTypes.datetime?.length || 0

  return (
    <div className="flex flex-wrap gap-3">
      {numCount > 0 && (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
          {numCount} Numeric
        </span>
      )}
      {catCount > 0 && (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
          {catCount} Categorical
        </span>
      )}
      {dateCount > 0 && (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
          {dateCount} DateTime
        </span>
      )}
    </div>
  )
}
