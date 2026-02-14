import React from 'react'
import UsageStatistics from './UsageStatistics'
import DisableButton from './DisableButton'
import CompressionSettings from './CompressionSettings'
import ManageDisabled from './ManageDisabled'
import { Stack, Divider } from '@mantine/core'

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
  onSiteDisable,
  onSiteEnable,
  disabledOnChange,
  compressionLevelOnChange,
  convertBwOnChange,
  onConfigureProxy
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
    <Stack gap="md">
      <UsageStatistics
        filesProcessed={statistics.filesProcessed}
        bytesProcessed={statistics.bytesProcessed}
        bytesSaved={statistics.bytesSaved}
      />
      
      <Divider my="xs" />

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
        onConfigureProxy={onConfigureProxy}
      />
    </Stack>
  )
}
