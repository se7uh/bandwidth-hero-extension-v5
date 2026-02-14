import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider, Container, Paper, Title, Text, Stack, TextInput, Button, Alert, Divider, Group, Box, Anchor } from '@mantine/core'
import { IconWorld, IconDeviceFloppy, IconInfoCircle, IconBrandDocker, IconCloudUp, IconCheck, IconAlertCircle } from '@tabler/icons-react'
import axios from 'axios'
import defaults from '../defaults'
import '@mantine/core/styles.css'

function Setup() {
  const [proxyUrl, setProxyUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    chrome.storage.local.get('proxyUrl', (stored) => {
      if (stored.proxyUrl) setProxyUrl(stored.proxyUrl)
    })
  }, [])

  const handleSave = async () => {
    setIsLoading(true)
    setStatus('idle')
    try {
      const res = await axios.get(proxyUrl)
      if (res.status === 200 && res.data === 'bandwidth-hero-proxy') {
        await chrome.storage.local.set({ proxyUrl })
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch (err) {
      setStatus('error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MantineProvider defaultColorScheme="light">
      <Box bg="#f8f9fa" style={{ minHeight: '100vh', padding: '40px 0' }}>
        <Container size="sm">
          <Paper withBorder p="xl" radius="md" shadow="md">
            <Stack gap="xl">
              <Group justify="center">
                <Box bg="#2b69e3" p="sm" style={{ borderRadius: '12px' }}>
                   <Title order={1} c="white" size="24px">Bandwidth Hero</Title>
                </Box>
              </Group>

              <Title order={2} ta="center" size="28px">Setup Data Compression</Title>

              <Alert 
                color="orange" 
                variant="light" 
                title="Public Service Shutdown"
                icon={<IconInfoCircle />}
                styles={{
                  root: { backgroundColor: '#fff9db', border: '1px solid #ffe066' },
                  title: { color: '#e67700', fontWeight: 700 },
                  message: { color: '#862e00' }
                }}
              >
                Due to increased load, the public data compression service is no longer available. 
                You must configure your own self-hosted service to continue saving data.
              </Alert>

              <Box>
                <Group gap="xs" mb={5}>
                  <IconWorld size={18} color="#2b69e3" />
                  <Text size="sm" fw={700}>Proxy URL</Text>
                </Group>
                <TextInput
                  value={proxyUrl}
                  onChange={(event) => setProxyUrl(event.currentTarget.value)}
                  placeholder="https://your-app.herokuapp.com"
                  size="md"
                  error={status === 'error' && "Invalid compression service address"}
                  styles={{
                    input: {
                      fontFamily: 'monospace',
                    }
                  }}
                  rightSection={
                    status === 'success' ? <IconCheck color="green" size={18} /> : 
                    status === 'error' ? <IconAlertCircle color="red" size={18} /> : null
                  }
                />
                <Text size="xs" c="dimmed" mt={5}>
                  Enter the URL of your self-hosted compression instance.
                </Text>
              </Box>

              <Button 
                fullWidth 
                size="lg" 
                leftSection={<IconDeviceFloppy size={20} />}
                onClick={handleSave}
                loading={isLoading}
                bg="#2b69e3"
              >
                Save Configuration
              </Button>

              <Divider label="INSTALLATION GUIDES" labelPosition="center" />

              <Group grow>
                <Paper withBorder p="md" radius="md">
                  <Stack gap="sm" align="center">
                    <IconCloudUp size={32} color="#2b69e3" />
                    <Text fw={700}>Heroku</Text>
                    <Text size="xs" ta="center" c="dimmed">Deploy to Heroku with one click using their free tier.</Text>
                    <Button 
                      variant="light" 
                      component="a" 
                      href="https://heroku.com/deploy?template=https://github.com/ayastreb/bandwidth-hero-proxy"
                      target="_blank"
                    >
                      Deploy now
                    </Button>
                  </Stack>
                </Paper>

                <Paper withBorder p="md" radius="md">
                  <Stack gap="sm" align="center">
                    <IconBrandDocker size={32} color="#2b69e3" />
                    <Text fw={700}>Docker</Text>
                    <Text size="xs" ta="center" c="dimmed">Run your own instance using Docker or Node.js.</Text>
                    <Button 
                      variant="light" 
                      component="a" 
                      href="https://github.com/ayastreb/bandwidth-hero-proxy#docker"
                      target="_blank"
                    >
                      View guide
                    </Button>
                  </Stack>
                </Paper>
              </Group>

              <Text size="xs" ta="center" c="dimmed">
                Bandwidth Hero is open-source. <Anchor href="https://github.com/ayastreb/bandwidth-hero" target="_blank">Check it out on GitHub</Anchor>.
              </Text>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </MantineProvider>
  )
}

const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(<Setup />)
}
