import React from 'react'
import { Textarea } from '@mantine/core'

export default ({ disabledHosts = [], onChange }) => {
  return (
    <Textarea
      rows={4}
      value={disabledHosts.join('\n')}
      onChange={onChange}
    />
  )
}
