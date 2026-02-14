import React from 'react'
import { Group, Button } from '@mantine/core'
import { IconHome, IconHeart } from '@tabler/icons-react'

export default () => {
  return (
    <Group justify="flex-end" p="sm">
      <Button
        variant="outline"
        component="a"
        href="https://bandwidth-hero.com/"
        target="_blank"
        leftSection={<IconHome size={16} />}
      >
        How it works?
      </Button>
      <Button
        variant="outline"
        color="orange"
        component="a"
        href="https://paypal.me/ayastreb"
        target="_blank"
        leftSection={<IconHeart size={16} />}
      >
        Donate!
      </Button>
    </Group>
  )
}
