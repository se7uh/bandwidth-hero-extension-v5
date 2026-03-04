import React from 'react'
import parseUrl from '../utils/parseUrl.js'

interface DisableButtonProps {
  disabledHosts?: string[]
  currentUrl?: string
  onSiteDisable?: () => void
  onSiteEnable?: () => void
}

const btnBase: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  border: 'var(--brut-border)',
  boxShadow: 'var(--brut-shadow)',
  fontWeight: 900,
  fontSize: '13px',
  textTransform: 'uppercase',
  cursor: 'pointer',
  transition: 'transform 0.1s, box-shadow 0.1s',
}

export default ({ disabledHosts = [], currentUrl = '', onSiteDisable, onSiteEnable }: DisableButtonProps) => {
  const { schema, hostname } = parseUrl(currentUrl)

  if (!/^https?:/i.test(schema)) return null
  const isDisabled = disabledHosts.includes(hostname)

  return (
    <button
      onClick={isDisabled ? onSiteEnable : onSiteDisable}
      style={{ ...btnBase, background: isDisabled ? 'var(--brut-cyan)' : 'var(--brut-red)' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translate(2px,2px)'; e.currentTarget.style.boxShadow = 'var(--brut-shadow-sm)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--brut-shadow)' }}
    >
      {isDisabled ? `Enable on ${hostname}` : `Disable on ${hostname}`}
    </button>
  )
}
