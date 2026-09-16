import React, { useState } from 'react'

export default function HeatmapChart({ columns, matrix, onCellClick }) {
  const [hoveredCell, setHoveredCell] = useState(null)

  // Color interpolation from dark red (-1) to white (0) to dark blue (+1)
  const getColor = (value) => {
    if (value === null || value === undefined) return 'transparent'
    
    // Convert to 0-1 scale where 0 is -1, 0.5 is 0, 1 is +1
    const normalized = (value + 1) / 2
    
    let r, g, b
    if (normalized < 0.5) {
      // Red to White
      const t = normalized * 2 // 0 to 1
      r = 255
      g = Math.round(t * 255)
      b = Math.round(t * 255)
    } else {
      // White to Blue
      const t = (normalized - 0.5) * 2 // 0 to 1
      r = Math.round((1 - t) * 255)
      g = Math.round((1 - t) * 255)
      b = 255
    }
    
    // Darken slightly in dark mode - using opacity with currentColor
    return `rgb(${r}, ${g}, ${b})`
  }

  const getTextColor = (value) => {
    if (value === null || value === undefined) return 'transparent'
    return Math.abs(value) > 0.6 ? '#ffffff' : '#334155'
  }

  return (
    <div className="relative inline-block pb-16 pr-4">
      <div className="flex">
        {/* Y Axis Labels */}
        <div className="flex flex-col mt-[60px] mr-2">
          {columns.map((col, i) => (
            <div 
              key={`y-${i}`} 
              className="h-10 flex items-center justify-end pr-2 text-xs font-medium text-slate-600 dark:text-slate-400 truncate w-32"
              title={col}
            >
              {col}
            </div>
          ))}
        </div>

        {/* Heatmap Grid */}
        <div className="flex flex-col">
          {/* X Axis Labels */}
          <div className="flex h-[60px] mb-2 items-end">
            {columns.map((col, i) => (
              <div 
                key={`x-${i}`} 
                className="w-10 flex justify-center text-xs font-medium text-slate-600 dark:text-slate-400 truncate"
              >
                <div className="-rotate-45 translate-x-3 -translate-y-2 origin-bottom-left w-24 text-left" title={col}>
                  {col}
                </div>
              </div>
            ))}
          </div>

          {/* Matrix Cells */}
          <div className="flex flex-col gap-1">
            {matrix.map((row, i) => (
              <div key={`row-${i}`} className="flex gap-1">
                {row.map((val, j) => (
                  <div
                    key={`cell-${i}-${j}`}
                    className="w-10 h-10 rounded text-[10px] flex items-center justify-center cursor-pointer transition-transform hover:scale-110 hover:z-10 relative"
                    style={{ 
                      backgroundColor: getColor(val),
                      color: getTextColor(val),
                      border: val === 1 ? '1px solid rgba(0,0,0,0.1)' : 'none'
                    }}
                    onClick={() => onCellClick(columns[j])}
                    onMouseEnter={() => setHoveredCell({ row: i, col: j, val })}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    {val !== null ? Math.abs(val) === 1 ? '1.0' : val.toFixed(2) : '-'}
                    
                    {hoveredCell?.row === i && hoveredCell?.col === j && val !== null && (
                      <div className="absolute z-20 bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none">
                        {columns[i]} & {columns[j]}: {val.toFixed(3)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
