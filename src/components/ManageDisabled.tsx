import React, { useState } from 'react'
import { Textarea, Button, Stack, Text, Title } from '@mantine/core'

interface ManageDisabledProps {
  disabledHosts: string[]
  onChange: (value: string) => void
}

export default ({ disabledHosts = [], onChange }: ManageDisabledProps) => {
  const [value, setValue] = useState(Array.isArray(disabledHosts) ? disabledHosts.join('\n') : '')

  return (
    <Stack gap="sm">
      <Title order={4} size="16px">Manage Disabled Sites</Title>
      <Text size="sm" c="dimmed">
        Add domains below to prevent Bandwidth Hero from compressing images on them.
      </Text>
      <Textarea
        minRows={12}
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
        styles={{
          input: {
            fontFamily: 'monospace',
          }
        }}
      />
      <Button 
        fullWidth 
        size="md" 
        onClick={() => onChange(value)}
        bg="#2b69e3"
      >
        Save Changes
      </Button>
    </Stack>
  )
}
