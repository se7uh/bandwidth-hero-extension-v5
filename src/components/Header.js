import React from 'react'
import { Group, Box, Switch } from '@mantine/core'

export default ({ enabled, onChange }) => {
  return (
    <Box bg="#2185d0" c="white" p="md">
      <Group justify="space-between" align="center">
        <h2 style={{ margin: 0, color: 'white' }}>Bandwidth Hero</h2>
        {onChange && (
          <Switch
            checked={enabled}
            onChange={onChange}
            color="green"
            size="md"
          />
        )}
      </Group>
    </Box>
  )
}
