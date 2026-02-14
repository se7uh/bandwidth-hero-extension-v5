import React from 'react'
import { Group, Box, Switch, Text } from '@mantine/core'

interface HeaderProps {
  enabled: boolean
  onChange: () => void
  pt?: string | number
}

export default ({ enabled, onChange, pt = 'md' }: HeaderProps) => {
  return (
    <Box bg="#2b69e3" c="white" px="md" pt={pt} pb={0}>
      <Group justify="space-between" align="center">
        <Text fw={700} size="xl" c="white">
          Bandwidth Hero
        </Text>
        <Switch
          checked={enabled}
          onChange={onChange}
          color="green"
          size="md"
          styles={{
            track: {
              border: 'none',
            }
          }}
        />
      </Group>
    </Box>
  )
}
