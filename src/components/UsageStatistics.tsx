import React from 'react'
import { brutalHover } from './styles'

interface UsageStatisticsProps {
  filesProcessed?: number
  bytesProcessed?: number
  bytesSaved?: number
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export default ({ filesProcessed = 0, bytesProcessed = 0, bytesSaved = 0 }: UsageStatisticsProps) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className={`bg-white border-[3px] border-black p-3 shadow-[4px_4px_0_0_#000] ${brutalHover}`}>
        <div className="text-[28px] font-black leading-none">{formatBytes(bytesSaved)}</div>
        <div className="font-bold text-[10px] uppercase bg-black text-white inline-block px-1 mt-1">Data Saved</div>
      </div>
      <div className={`bg-white border-[3px] border-black p-3 shadow-[4px_4px_0_0_#000] ${brutalHover}`}>
        <div className="text-[28px] font-black leading-none">{filesProcessed.toLocaleString()}</div>
        <div className="font-bold text-[10px] uppercase bg-black text-white inline-block px-1 mt-1">Images</div>
      </div>
    </div>
  )
}
