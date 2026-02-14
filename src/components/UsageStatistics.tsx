import React from 'react'
import { Group, Text, Divider, Stack, rem } from '@mantine/core'

interface UsageStatisticsProps {
  filesProcessed: number
  bytesProcessed: number
  bytesSaved: number
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + sizes[i]
}

export default ({ filesProcessed = 0, bytesProcessed = 0, bytesSaved = 0 }: UsageStatisticsProps) => {
  const percentage = bytesProcessed === 0 ? 0 : Math.round(bytesSaved / bytesProcessed * 100)

  return (
    <Stack gap="xs" align="center" my="xl">
      <Group gap={4} align="baseline">
        <Text style={{ fontSize: rem(48), fontWeight: 700, color: '#2b69e3', lineHeight: 1 }}>
          {percentage}%
        </Text>
        <Text size="sm" c="dimmed" fw={500}>
          saved
        </Text>
      </Group>

      <Group gap="xl" justify="center" style={{ width: '100%' }}>
        <Stack gap={0} align="center" style={{ flex: 1 }}>
          <Text fw={700} size="md">
            {formatBytes(bytesSaved)}
          </Text>
          <Text size="xs" c="dimmed" fw={700}>
            DATA
          </Text>
        </Stack>
        
        <Divider orientation="vertical" h={40} />

        <Stack gap={0} align="center" style={{ flex: 1 }}>
          <Text fw={700} size="md">
            {filesProcessed.toLocaleString()}
          </Text>
          <Text size="xs" c="dimmed" fw={700}>
            IMAGES
          </Text>
        </Stack>
      </Group>
    </Stack>
  )
}
