import React, { useState } from 'react'
import { Segment, Accordion, Icon } from 'semantic-ui-react'
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
  const [activeIndex, setActiveIndex] = useState(-1)

  const handleClick = (e, titleProps) => {
    const { index } = titleProps
    const newIndex = activeIndex === index ? -1 : index
    setActiveIndex(newIndex)
  }

  return (
    <Segment attached>
      <Accordion>
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={handleClick}
        >
          <Icon name="dropdown" />
          Manage disabled sites
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <ManageDisabled disabledHosts={disabledHosts} onChange={disabledOnChange} />
        </Accordion.Content>
        <Accordion.Title
          active={activeIndex === 1}
          index={1}
          onClick={handleClick}
        >
          <Icon name="dropdown" />
          Compression settings
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          <CompressionSettings
            convertBw={convertBw}
            isWebpSupported={isWebpSupported}
            compressionLevel={compressionLevel}
            onConvertBwChange={convertBwOnChange}
            onCompressionLevelChange={compressionLevelOnChange}
          />
        </Accordion.Content>
      </Accordion>
    </Segment>
  )
}