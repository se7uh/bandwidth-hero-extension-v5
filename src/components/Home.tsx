import React from 'react'
import UsageStatistics from './UsageStatistics'
import DisableButton from './DisableButton'
import CompressionSettings from './CompressionSettings'
import ManageDisabled from './ManageDisabled'

interface HomeProps {
  view?: 'home' | 'sites'
  statistics: {
    filesProcessed: number
    bytesProcessed: number
    bytesSaved: number
  }
  disabledHosts: string[]
  currentUrl: string
  compressionLevel: number
  convertBw: boolean
  proxyUrl?: string
  onSiteDisable: () => void
  onSiteEnable: () => void
  disabledOnChange?: (value: string) => void
  compressionLevelOnChange: (value: number) => void
  convertBwOnChange: () => void
  onConfigureProxy: () => void
}

export default ({
  view = 'home',
  statistics,
  disabledHosts,
  currentUrl,
  compressionLevel,
  convertBw,
  proxyUrl,
  onSiteDisable,
  onSiteEnable,
  disabledOnChange,
  compressionLevelOnChange,
  convertBwOnChange,
}: HomeProps) => {
  if (view === 'sites') {
    return (
      <ManageDisabled
        disabledHosts={disabledHosts}
        onChange={disabledOnChange!}
      />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {!proxyUrl && (
        <div style={{ background: 'var(--brut-yellow)', border: 'var(--brut-border)', padding: '8px 12px', boxShadow: 'var(--brut-shadow)' }}>
          <div style={{ fontWeight: 900, fontSize: '12px', textTransform: 'uppercase' }}>Setup Required</div>
          <div style={{ fontSize: '11px', marginTop: '2px' }}>Please configure your compression proxy URL to start saving data.</div>
        </div>
      )}
      <UsageStatistics
        filesProcessed={statistics.filesProcessed}
        bytesProcessed={statistics.bytesProcessed}
        bytesSaved={statistics.bytesSaved}
      />
      <DisableButton
        disabledHosts={disabledHosts}
        currentUrl={currentUrl}
        onSiteDisable={onSiteDisable}
        onSiteEnable={onSiteEnable}
      />
      <CompressionSettings
        convertBw={convertBw}
        compressionLevel={compressionLevel}
        onConvertBwChange={convertBwOnChange}
        onCompressionLevelChange={compressionLevelOnChange}
      />
    </div>
  )
}
