import React from 'react'
import { Stack, Checkbox, Select, Button } from '@mantine/core'
import { IconSettings } from '@tabler/icons-react'
import defaults from '../defaults.js'

interface CompressionSettingsProps {
  convertBw: boolean
  compressionLevel: number
  onConvertBwChange: () => void
  onCompressionLevelChange: (event: any, data: { value: number }) => void
  isWebpSupported: boolean
}

export default ({ convertBw, compressionLevel, onConvertBwChange, onCompressionLevelChange, isWebpSupported }: CompressionSettingsProps) => {
  const compressionToText = (description: string, value: number) => {
    const extension = isWebpSupported ? 'WEBP' : 'JPG';
    return `${description} compression (${extension} ${value})`;
  };
  const compressionLevelOptions = [
    { value: '80', label: compressionToText('Low', 80) },
    { value: '60', label: compressionToText('Medium', 60) },
    { value: '40', label: compressionToText('High', 40) },
    { value: '20', label: compressionToText('Extreme', 20) }
  ]
  return (
    <Stack>
      <div>
        <Checkbox
          label="Convert to black & white"
          checked={convertBw}
          onChange={onConvertBwChange}
        />
      </div>
      <div>
        <Select
          data={compressionLevelOptions}
          value={String(compressionLevel)}
          onChange={(value) => onCompressionLevelChange(null, { value: parseInt(value!) })}
        />
      </div>
      <div>
        <Button
          variant="outline"
          fullWidth
          leftSection={<IconSettings size={16} />}
          onClick={() => chrome.tabs.create({ url: chrome.runtime.getURL('setup/index.html') })}
        >
          Configure data compression service
        </Button>
      </div>
    </Stack>
  )
}
