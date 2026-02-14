import React, { useState } from 'react'
import { Paper, Accordion } from '@mantine/core'
import ManageDisabled from './ManageDisabled.js'
import CompressionSettings from './CompressionSettings.js'

export default ({
  disabledHosts,
  convertBw,
  compressionLevel,
  disabledOnChange,
  convertBwOnChange,
  isWebpSupported,
  compressionLevelOnChange
}) => {
  const [activeIndex, setActiveIndex] = useState(null)

  const handleChange = (value) => {
    setActiveIndex(value)
  }

  return (
    <Paper withBorder p="sm">
      <Accordion value={activeIndex} onChange={handleChange}>
        <Accordion.Item value="disabled">
          <Accordion.Control>
            Manage disabled sites
          </Accordion.Control>
          <Accordion.Panel>
            <ManageDisabled disabledHosts={disabledHosts} onChange={disabledOnChange} />
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="settings">
          <Accordion.Control>
            Compression settings
          </Accordion.Control>
          <Accordion.Panel>
            <CompressionSettings
              convertBw={convertBw}
              isWebpSupported={isWebpSupported}
              compressionLevel={compressionLevel}
              onConvertBwChange={convertBwOnChange}
              onCompressionLevelChange={compressionLevelOnChange}
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Paper>
  )
}
