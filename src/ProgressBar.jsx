import React from 'react'

export default function ProgressBar({ value = 0 }) {
  const v = Math.min(100, Math.max(0, Number(value) || 0))
  return (
    <div className="w-full">
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all"
          style={{ width: v + '%' }}
        />
      </div>
      <div className="text-xs text-gray-500 mt-1">{v}%</div>
    </div>
  )
}
