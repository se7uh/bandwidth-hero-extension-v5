import React from 'react'
import { Group, Box, Switch, ActionIcon, useMantineColorScheme } from '@mantine/core'

export default ({ enabled, onChange }) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  
  return (
    <Box bg="#2185d0" c="white" p="md">
      <Group justify="space-between" align="center">
        <h2 style={{ margin: 0, color: 'white' }}>Bandwidth Hero</h2>
        <Group gap="xs">
          {onChange && (
            <Switch
              checked={enabled}
              onChange={onChange}
              color="green"
              size="md"
            />
          )}
          <ActionIcon 
            onClick={() => toggleColorScheme()} 
            variant="filled"
            color="white"
            size="md"
            style={{ 
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white'
            }}
            title={colorScheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {colorScheme === 'dark' ? '☀️' : '🌙'}
          </ActionIcon>
        </Group>
      </Group>
    </Box>
  )
}
