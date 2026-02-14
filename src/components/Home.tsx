import React from 'react'
import UsageStatistics from './UsageStatistics'
import DisableButton from './DisableButton'
import CompressionSettings from './CompressionSettings'
import ManageDisabled from './ManageDisabled'
import { Stack, Divider, Alert } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'

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
    <Stack gap="xs">
      {!proxyUrl && (
        <Alert 
          color="orange" 
          variant="light" 
          title="Setup Required"
          icon={<IconInfoCircle size={16} />}
          styles={{
            root: { padding: '8px' },
            title: { fontSize: '12px', marginBottom: '2px' },
            message: { fontSize: '11px' },
            icon: { marginRight: '8px' }
          }}
        >
          Please configure your compression proxy URL to start saving data.
        </Alert>
      )}
      <UsageStatistics
        filesProcessed={statistics.filesProcessed}
        bytesProcessed={statistics.bytesProcessed}
        bytesSaved={statistics.bytesSaved}
      />
      
      <Divider my={4} />

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
