import React, { useState, useEffect, useCallback } from 'react'
import { ExternalLink, Heart, CheckCircle, XCircle, Loader } from 'lucide-react'
import debounce from 'lodash/debounce'
import { brutalHover } from './styles'

interface SettingsProps {
  proxyUrl: string
  onChange: (value: string) => void
  onBack: () => void
}

type CheckStatus = 'idle' | 'checking' | 'ok' | 'error'

export default ({ proxyUrl, onChange, onBack }: SettingsProps) => {
  const [value, setValue] = useState(proxyUrl)
  const [checkStatus, setCheckStatus] = useState<CheckStatus>('idle')
  const [checkError, setCheckError] = useState<string>('')

  const debouncedCheck = useCallback(
    debounce(async (url: string) => {
      const trimmed = url.trim()
      if (!trimmed) {
        setCheckStatus('idle')
        return
      }

      setCheckStatus('checking')
      setCheckError('')

      try {
        const testImage = 'https://picsum.photos/id/1/100/100'
        const cleanProxy = trimmed.replace(/\/$/, '')
        const testUrl = `${cleanProxy}?url=${encodeURIComponent(testImage)}&l=40&jpeg=0&avif=0&bw=0`

        const response = await fetch(testUrl, { signal: AbortSignal.timeout(8000) })

        if (!response.ok) {
          setCheckStatus('error')
          setCheckError(`Server returned ${response.status} ${response.statusText}`)
          return
        }

        const hasOriginalSize = response.headers.has('x-original-size')
        const hasBytesSaved = response.headers.has('x-bytes-saved')

        if (hasOriginalSize || hasBytesSaved) {
          setCheckStatus('ok')
        } else {
          setCheckStatus('error')
          setCheckError('URL reachable but does not appear to be a Bandwidth Hero proxy')
        }
      } catch (err: any) {
        setCheckStatus('error')
        if (err.name === 'TimeoutError') {
          setCheckError('Connection timed out')
        } else {
          setCheckError(err.message ?? 'Could not reach proxy')
        }
      }
    }, 1000),
    []
  )

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value
    setValue(newValue)
    setCheckStatus(newValue.trim() ? 'checking' : 'idle')
    debouncedCheck(newValue)
  }

  const handleSave = () => {
    debouncedCheck.cancel()
    onChange(value)
  }

  useEffect(() => {
    return () => { debouncedCheck.cancel() }
  }, [debouncedCheck])

  const checkIcon = checkStatus === 'ok'
    ? <CheckCircle size={16} strokeWidth={3} />
    : checkStatus === 'error'
    ? <XCircle size={16} strokeWidth={3} />
    : null

  const checkBg = checkStatus === 'ok'
    ? 'bg-brut-teal'
    : checkStatus === 'error'
    ? 'bg-brut-red'
    : 'bg-white'

  return (
    <div className="flex flex-col gap-6">
      {/* Proxy URL */}
      <div className="flex flex-col gap-2">
        <label className={`font-black text-[17px] uppercase bg-white border-[3px] border-black px-2 py-0.5 inline-block shadow-[4px_4px_0_0_#000] ${brutalHover}`}>
          Proxy URL
        </label>
        <div className="relative">
          <input
            type="url"
            value={value}
            onChange={handleInputChange}
            spellCheck={false}
            autoComplete="off"
            className={`w-full border-[3px] border-black p-3 pr-10 font-mono font-bold text-[13px] shadow-[4px_4px_0_0_#000] outline-none bg-white box-border ${brutalHover} focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0_0_#000]`}
          />
          {checkStatus === 'checking' && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
              <Loader size={16} strokeWidth={3} className="animate-spin" />
            </span>
          )}
        </div>

        {/* Check status */}
        {checkStatus !== 'idle' && (
          <div className={`flex items-center gap-2 border-[3px] border-black px-3 py-2 font-bold text-[12px] ${checkBg}`}>
            {checkIcon}
            <span>
              {checkStatus === 'checking' && 'Checking proxy…'}
              {checkStatus === 'ok' && 'Proxy is reachable'}
              {checkStatus === 'error' && (checkError || 'Proxy unreachable')}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 pt-2">
        {/* Save */}
        <button
          onClick={handleSave}
          className={`w-full p-3 bg-black text-white border-[3px] border-black font-black uppercase text-[17px] cursor-pointer shadow-[4px_4px_0_0_#000] ${brutalHover}`}
        >
          Save Config
        </button>

        {/* Install Guide + Donate */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => window.open('https://github.com/ayastreb/bandwidth-hero-proxy#installation', '_blank')}
            className={`p-3 bg-brut-red text-black border-[3px] border-black font-black uppercase text-[11px] cursor-pointer shadow-[4px_4px_0_0_#000] flex flex-col items-center justify-center gap-1 ${brutalHover}`}
          >
            <ExternalLink size={20} strokeWidth={3} />
            <span>Install Guide</span>
          </button>
          <button
            onClick={() => window.open('https://www.paypal.me/ayastreb', '_blank')}
            className={`p-3 bg-brut-teal text-black border-[3px] border-black font-black uppercase text-[11px] cursor-pointer shadow-[4px_4px_0_0_#000] flex flex-col items-center justify-center gap-1 ${brutalHover}`}
          >
            <Heart size={20} strokeWidth={3} />
            <span>Donate</span>
          </button>
        </div>
      </div>
    </div>
  )
}
