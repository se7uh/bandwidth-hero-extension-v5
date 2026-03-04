import React from 'react'
import parseUrl from '../utils/parseUrl.js'

interface DisableButtonProps {
  disabledHosts?: string[]
  currentUrl?: string
  onSiteDisable?: () => void
  onSiteEnable?: () => void
}

export default ({ disabledHosts = [], currentUrl = '', onSiteDisable, onSiteEnable }: DisableButtonProps) => {
  const { schema, hostname } = parseUrl(currentUrl)

  if (!/^https?:/i.test(schema)) return null
  const isDisabled = disabledHosts.includes(hostname)

  return (
    <button
      onClick={isDisabled ? onSiteEnable : onSiteDisable}
      className={`w-full py-[10px] px-3 border-[3px] border-black shadow-[4px_4px_0_0_#000] font-black text-[13px] uppercase cursor-pointer transition-[transform,box-shadow] duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] ${isDisabled ? 'bg-brut-cyan' : 'bg-brut-red'}`}
    >
      {isDisabled ? `Enable on ${hostname}` : `Disable on ${hostname}`}
    </button>
  )
}
