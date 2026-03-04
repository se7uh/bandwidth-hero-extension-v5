import React from 'react'

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
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
      <div style={{ background: 'var(--brut-white)', border: 'var(--brut-border)', padding: '12px', boxShadow: 'var(--brut-shadow)' }}>
        <div style={{ fontSize: '28px', fontWeight: 900, lineHeight: 1 }}>{formatBytes(bytesSaved)}</div>
        <div style={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', background: 'var(--brut-black)', color: 'var(--brut-white)', display: 'inline-block', padding: '0 4px', marginTop: '4px' }}>Data Saved</div>
      </div>
      <div style={{ background: 'var(--brut-white)', border: 'var(--brut-border)', padding: '12px', boxShadow: 'var(--brut-shadow)' }}>
        <div style={{ fontSize: '28px', fontWeight: 900, lineHeight: 1 }}>{filesProcessed.toLocaleString()}</div>
        <div style={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', background: 'var(--brut-black)', color: 'var(--brut-white)', display: 'inline-block', padding: '0 4px', marginTop: '4px' }}>Images</div>
      </div>
    </div>
  )
}
