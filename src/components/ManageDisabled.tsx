import React, { useState, useEffect, useCallback } from 'react'
import { Textarea, Stack, Text, Title, Box, Group, Loader, rem } from '@mantine/core'
import { IconCheck, IconAlertCircle, IconWorldOff } from '@tabler/icons-react'
import debounce from 'lodash/debounce'

interface ManageDisabledProps {
  disabledHosts: string[]
  onChange: (value: string) => void
}

type SaveStatus = 'saved' | 'saving' | 'unsaved'

export default ({ disabledHosts = [], onChange }: ManageDisabledProps) => {
  const [value, setValue] = useState(Array.isArray(disabledHosts) ? disabledHosts.join('\n') : '')
  const [status, setStatus] = useState<SaveStatus>('saved')

  // Create a debounced version of the onChange function
  const debouncedOnChange = useCallback(
    debounce((newValue: string) => {
      onChange(newValue)
      setStatus('saved')
    }, 1000),
    [onChange]
  )

  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.currentTarget.value
    setValue(newValue)
    setStatus('saving')
    debouncedOnChange(newValue)
  }

  // Update local state if disabledHosts prop changes (e.g. from background sync)
  useEffect(() => {
    const joined = Array.isArray(disabledHosts) ? disabledHosts.join('\n') : ''
    if (joined !== value && status === 'saved') {
      setValue(joined)
    }
  }, [disabledHosts, status, value])

  return (
    <Stack gap="xs" style={{ height: '330px' }}>
      <Box>
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <IconWorldOff size={18} color="#2b69e3" />
            <Title order={4} size="14px">Manage Disabled Sites</Title>
          </Group>
          <Group gap={4}>
            {status === 'saving' && (
              <>
                <Loader size={12} />
                <Text size="xs" c="blue" fw={500}>Saving...</Text>
              </>
            )}
            {status === 'saved' && (
              <>
                <IconCheck size={12} color="green" />
                <Text size="xs" c="green" fw={500}>Saved</Text>
              </>
            )}
            {status === 'unsaved' && (
              <>
                <IconAlertCircle size={12} color="orange" />
                <Text size="xs" c="orange" fw={500}>Unsaved changes</Text>
              </>
            )}
          </Group>
        </Group>
        <Text size="xs" c="dimmed">
          Add domains below to prevent Bandwidth Hero from compressing images on them.
        </Text>
      </Box>
      <Textarea
        value={value}
        onChange={handleTextareaChange}
        placeholder="example.com"
        styles={{
          root: { flex: 1, display: 'flex', flexDirection: 'column' },
          wrapper: { flex: 1, display: 'flex', flexDirection: 'column' },
          input: {
            flex: 1,
            fontFamily: 'monospace',
            fontSize: '12px',
            padding: '8px',
          }
        }}
      />
    </Stack>
  )
}
