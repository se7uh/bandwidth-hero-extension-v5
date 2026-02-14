import React from 'react'
import { Button } from '@mantine/core'
import parseUrl from '../utils/parseUrl.js'

interface DisableButtonProps {
  disabledHosts: string[]
  currentUrl: string
  onSiteDisable: () => void
  onSiteEnable: () => void
}

export default ({ disabledHosts, currentUrl, onSiteDisable, onSiteEnable }: DisableButtonProps) => {
  const { schema, hostname } = parseUrl(currentUrl)

  if (!/^https?:/i.test(schema)) return null
  const isDisabled = disabledHosts.includes(hostname)

  return (
    <Button 
      onClick={isDisabled ? onSiteEnable : onSiteDisable} 
      variant="filled" 
      color={isDisabled ? "green" : "red"}
      fullWidth
      radius="xs"
      h={32}
      styles={(theme) => ({
        root: {
          backgroundColor: isDisabled ? '#e6fffa' : '#fff5f5',
          color: isDisabled ? '#2f855a' : '#e53e3e',
          border: `1px solid ${isDisabled ? '#c6f6d5' : '#fed7d7'}`,
          '&:hover': {
            backgroundColor: isDisabled ? '#f0fff4' : '#fff5f5',
          }
        },
        label: {
          fontWeight: 700,
          fontSize: '14px'
        }
      })}
    >
      {isDisabled ? 'Enable on this site' : 'Disable on this site'}
    </Button>
  )
}
