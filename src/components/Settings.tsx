import React, { useState, useEffect, useCallback } from 'react'
import { Stack, Box, Group, Text, Title, TextInput, Button, Divider, ActionIcon, Loader } from '@mantine/core'
import { IconArrowLeft, IconWorld, IconBrandDocker, IconCheck, IconAlertCircle, IconSettings } from '@tabler/icons-react'
import debounce from 'lodash/debounce'

interface SettingsProps {
  proxyUrl: string
  onChange: (value: string) => void
  onBack: () => void
}

type SaveStatus = 'saved' | 'saving'

export default ({ proxyUrl, onChange, onBack }: SettingsProps) => {
  const [value, setValue] = useState(proxyUrl)
  const [status, setStatus] = useState<SaveStatus>('saved')

  // Create a debounced version of the onChange function
  const debouncedOnChange = useCallback(
    debounce((newValue: string) => {
      onChange(newValue)
      setStatus('saved')
    }, 1000),
    [onChange]
  )

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value
    setValue(newValue)
    setStatus('saving')
    debouncedOnChange(newValue)
  }

  // Update local state if proxyUrl prop changes
  useEffect(() => {
    if (proxyUrl !== value && status === 'saved') {
      setValue(proxyUrl)
    }
  }, [proxyUrl, status, value])

  return (
    <Box style={{ display: 'flex', flexDirection: 'column' }}>
      <Box p="md" bg="#2b69e3" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <ActionIcon variant="transparent" onClick={onBack} color="white">
              <IconArrowLeft size={20} />
            </ActionIcon>
            <IconSettings size={20} color="white" />
            <Title order={3} size="20px" c="white">Settings</Title>
          </Group>
          
          <Group gap={4}>
            {status === 'saving' && (
              <>
                <Loader size={12} color="white" />
                <Text size="xs" c="white" fw={500} style={{ opacity: 0.9 }}>Saving...</Text>
              </>
            )}
            {status === 'saved' && value && (
              <>
                <IconCheck size={12} color="white" />
                <Text size="xs" c="white" fw={500} style={{ opacity: 0.9 }}>Saved</Text>
              </>
            )}
          </Group>
        </Group>
      </Box>

      <Stack p="md" gap="lg">
        <Box>
          <Group gap="xs" mb={5}>
            <IconWorld size={18} color="#2b69e3" />
            <Text size="sm" fw={700}>Proxy URL</Text>
          </Group>
          <Text size="xs" c="dimmed" mb={5}>
            Enter the URL of your self-hosted compression instance.
          </Text>
          <TextInput
            value={value}
            onChange={handleInputChange}
            placeholder="https://your-proxy.com"
            size="md"
          />
        </Box>

        <Divider />

        <Box>
          <Text size="xs" fw={700} c="dimmed" mb="sm">INSTALLATION GUIDES</Text>
          <Stack gap="xs">
            <Button 
              variant="outline" 
              color="gray" 
              fullWidth 
              justify="start"
              leftSection={<IconBrandDocker size={18} />}
              onClick={() => window.open('https://github.com/ayastreb/bandwidth-hero-proxy#installation', '_blank')}
            >
              Self-hosted (Docker / Manual)
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
