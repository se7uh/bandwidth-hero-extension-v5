import React from 'react'
import { Paper, Button } from '@mantine/core'
import parseUrl from '../utils/parseUrl.js'

export default ({ disabledHosts, currentUrl, onSiteDisable, onSiteEnable }) => {
  const { schema, hostname } = parseUrl(currentUrl)

  if (!/^https?:/i.test(schema)) return null
  if (disabledHosts.includes(hostname)) {
    return (
      <Paper withBorder p="sm">
        <Button 
          onClick={onSiteEnable} 
          variant="outline" 
          color="red"
          fullWidth
        >
          Enable on this site
        </Button>
      </Paper>
    )
  } else {
    return (
      <Paper withBorder p="sm">
        <Button 
          onClick={onSiteDisable} 
          variant="outline" 
          color="green"
          fullWidth
        >
          Disable on this site
        </Button>
      </Paper>
    )
  }
}
