import React from 'react'
import { Stack, Switch, Slider, Text, Group, Box, Button } from '@mantine/core'
import { IconSettings, IconHelpCircle, IconHeart } from '@tabler/icons-react'

interface CompressionSettingsProps {
  convertBw: boolean
  compressionLevel: number
  onConvertBwChange: () => void
  onCompressionLevelChange: (value: number) => void
  onConfigureProxy: () => void
}

export default ({ 
  convertBw, 
  compressionLevel, 
  onConvertBwChange, 
  onCompressionLevelChange,
  onConfigureProxy
}: CompressionSettingsProps) => {
  return (
    <Stack gap="md" mt="lg">
      <Box p="md" style={{ border: '1px solid #eee', borderRadius: '8px' }}>
        <Group justify="space-between" mb="xs">
          <Text size="xs" fw={700} c="dimmed">COMPRESSION QUALITY</Text>
          <Box style={{ border: '1px solid #dee2e6', borderRadius: '4px', padding: '0 4px' }}>
            <Text size="xs" fw={700} c="blue">{compressionLevel}%</Text>
          </Box>
        </Group>
        <Slider
          value={compressionLevel}
          onChange={onCompressionLevelChange}
          min={10}
          max={90}
          step={5}
          label={null}
          styles={{
            thumb: {
              borderWidth: rem(2),
              width: rem(20),
              height: rem(20),
            },
            track: {
              height: rem(6),
            }
          }}
        />
      </Box>

      <Group justify="space-between">
        <Text size="md" fw={500}>Black & White Mode</Text>
        <Switch
          checked={convertBw}
          onChange={onConvertBwChange}
          size="md"
        />
      </Group>

      <Box mt="xl">
        <Button 
          variant="light"
          fullWidth
          size="sm" 
          onClick={onConfigureProxy}
          leftSection={<IconSettings size={16} />}
          mb="sm"
        >
          Configure Proxy Service
        </Button>
        <Group grow gap="sm">
          <Button
            variant="outline"
            size="xs"
            leftSection={<IconHelpCircle size={16} />}
            onClick={() => window.open('https://bandwidth-hero.com/#how-it-works', '_blank')}
          >
            How it works?
          </Button>
          <Button
            variant="outline"
            color="orange"
            size="xs"
            leftSection={<IconHeart size={16} />}
            onClick={() => window.open('https://www.paypal.me/ayastreb', '_blank')}
          >
            Donate!
          </Button>
        </Group>
      </Box>
    </Stack>
  )
}

function rem(value: number) {
  return `${value / 16}rem`
}
