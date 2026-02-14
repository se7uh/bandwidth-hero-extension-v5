import React, { useState } from 'react'
import { Stack, Box, Group, Text, Title, TextInput, Button, Alert, Divider, ActionIcon } from '@mantine/core'
import { IconArrowLeft, IconWorld, IconDeviceFloppy, IconInfoCircle, IconBrandDocker, IconCloudUp } from '@tabler/icons-react'

interface SettingsProps {
  proxyUrl: string
  onChange: (value: string) => void
  onBack: () => void
}

export default ({ proxyUrl, onChange, onBack }: SettingsProps) => {
  const [value, setValue] = useState(proxyUrl)

  return (
    <Box>
      <Box p="md" style={{ borderBottom: '1px solid #dee2e6' }}>
        <Group>
          <ActionIcon variant="subtle" onClick={onBack} color="gray">
            <IconArrowLeft size={20} />
          </ActionIcon>
          <Title order={3} size="20px">Settings</Title>
        </Group>
      </Box>

      <Stack p="md" gap="lg">
        <Alert 
          color="orange" 
          variant="light" 
          title="Compression Service Config"
          icon={<IconInfoCircle />}
          styles={{
            root: { backgroundColor: '#fff9db', border: '1px solid #ffe066' },
            title: { color: '#e67700', fontWeight: 700 },
            message: { color: '#862e00' }
          }}
        >
          You must configure your own data compression service. The public service is no longer available.
        </Alert>

        <Box>
          <Group gap="xs" mb={5}>
            <IconWorld size={18} color="#2b69e3" />
            <Text size="sm" fw={700}>Proxy URL</Text>
          </Group>
          <TextInput
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
            placeholder="https://your-app.herokuapp.com"
            size="md"
          />
          <Text size="xs" c="dimmed" mt={5}>
            Enter the URL of your self-hosted compression instance.
          </Text>
        </Box>

        <Button 
          fullWidth 
          size="md" 
          leftSection={<IconDeviceFloppy size={18} />}
          onClick={() => onChange(value)}
          bg="#2b69e3"
        >
          Save Configuration
        </Button>

        <Divider />

        <Box>
          <Text size="xs" fw={700} c="dimmed" mb="sm">INSTALLATION GUIDES</Text>
          <Stack gap="xs">
            <Button 
              variant="outline" 
              color="gray" 
              fullWidth 
              justify="start"
              leftSection={<IconCloudUp size={18} />}
              onClick={() => window.open('https://github.com/ayastreb/bandwidth-hero#heroku-deployment', '_blank')}
            >
              Deploy to Heroku
            </Button>
            <Button 
              variant="outline" 
              color="gray" 
              fullWidth 
              justify="start"
              leftSection={<IconBrandDocker size={18} />}
              onClick={() => window.open('https://github.com/ayastreb/bandwidth-hero-proxy#docker', '_blank')}
            >
              Self-hosted (Docker)
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
