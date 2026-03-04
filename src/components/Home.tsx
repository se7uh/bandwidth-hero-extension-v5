import React from 'react'
import UsageStatistics from './UsageStatistics'
import DisableButton from './DisableButton'
import CompressionSettings from './CompressionSettings'
import ManageDisabled from './ManageDisabled'
import { brutalHover } from './styles'

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
    <div className="flex flex-col gap-4">
      {!proxyUrl && (
        <div className={`bg-brut-yellow border-[3px] border-black px-3 py-2 shadow-[4px_4px_0_0_#000] ${brutalHover}`}>
          <div className="font-black text-[12px] uppercase">Setup Required</div>
          <div className="text-[11px] mt-0.5">Please configure your compression proxy URL to start saving data.</div>
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
