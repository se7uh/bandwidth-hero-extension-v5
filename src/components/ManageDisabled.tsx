import React from 'react'
import { Textarea } from '@mantine/core'

interface ManageDisabledProps {
  disabledHosts: string[]
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export default ({ disabledHosts = [], onChange }: ManageDisabledProps) => {
  return (
    <Textarea
      minRows={4}
      maxRows={8}
      defaultValue={Array.isArray(disabledHosts) ? disabledHosts.join('\n') : ''}
      onChange={onChange}
      placeholder="Enter one domain per line"
    />
  )
}