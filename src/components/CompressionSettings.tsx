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
    <Stack gap="xs" mt="xs">
      <Box p="xs" pb="xl" style={{ border: '1px solid #eee', borderRadius: '8px' }}>
        <Group justify="space-between" mb={2}>
          <Text size="xs" fw={700} c="dimmed">COMPRESSION QUALITY</Text>
          <Box style={{ border: '1px solid #dee2e6', borderRadius: '4px', padding: '0 4px' }}>
            <Text size="xs" fw={700} c="blue">{compressionLevel}%</Text>
          </Box>
        </Group>
        <Slider
          value={compressionLevel}
          onChange={onCompressionLevelChange}
          min={1}
          max={100}
          step={1}
          label={null}
          marks={[
            { value: 0, label: '0%' },
            { value: 20, label: '20%' },
            { value: 40, label: '40%' },
            { value: 60, label: '60%' },
            { value: 80, label: '80%' },
            { value: 100, label: '100%' },
          ]}
          styles={{
            thumb: {
              borderWidth: rem(2),
              width: rem(20),
              height: rem(20),
            },
            track: {
              height: rem(6),
            },
            markWrapper: {
              top: '50%',
            },
            mark: {
              width: rem(8),
              height: rem(8),
              borderRadius: rem(8),
              borderWidth: rem(2),
              transform: 'translateY(-50%)',
            },
            markLabel: {
              fontSize: rem(9),
              top: rem(10),
              transform: 'translateX(-50%)',
            }
          }}
        />
      </Box>

      <Group justify="space-between" mt={4} mb={4}>
        <Text size="sm" fw={500}>Black & White Mode</Text>
        <Switch
          checked={convertBw}
          onChange={onConvertBwChange}
          size="sm"
        />
      </Group>

      <Box mt="xs">
        <Button 
          variant="light"
          fullWidth
          size="xs" 
          onClick={onConfigureProxy}
          leftSection={<IconSettings size={14} />}
          mb="xs"
          styles={{ section: { marginRight: '8px' } }}
        >
          Configure Proxy Service
        </Button>
        <Group grow gap="sm">
          <Button
            variant="outline"
            size="xs"
            leftSection={<IconHelpCircle size={14} />}
            onClick={() => window.open('https://bandwidth-hero.com/#how-it-works', '_blank')}
            styles={{ section: { marginRight: '6px' } }}
          >
            How it works?
          </Button>
          <Button
            variant="outline"
            color="orange"
            size="xs"
            leftSection={<IconHeart size={14} />}
            onClick={() => window.open('https://www.paypal.me/ayastreb', '_blank')}
            styles={{ section: { marginRight: '6px' } }}
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
