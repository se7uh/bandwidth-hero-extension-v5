import React from 'react'
import { Paper, Group, Text } from '@mantine/core'

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export default ({ filesProcessed = 0, bytesProcessed = 0, bytesSaved = 0 }) => {
  const dataSavedPercentage = () => {
    if (bytesProcessed === 0) return `0%`
    const percentage = Math.round(bytesSaved / bytesProcessed * 100)
    return `${percentage}%`
  }

  return (
    <Paper withBorder p="sm">
      <Group grow>
        <div>
          <Text size="xl" fw={700} c="blue">
            {filesProcessed.toLocaleString()}
          </Text>
          <Text size="sm" c="dimmed">
            Images processed
          </Text>
        </div>
        <div>
          <Text size="xl" fw={700} c="blue">
            {formatBytes(bytesSaved)} ({dataSavedPercentage()})
          </Text>
          <Text size="sm" c="dimmed">
            Data saved
          </Text>
        </div>
      </Group>
    </Paper>
  )
}
