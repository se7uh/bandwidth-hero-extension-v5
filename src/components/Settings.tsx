import React, { useState, useEffect, useCallback } from 'react'
import { ExternalLink, Heart } from 'lucide-react'
import debounce from 'lodash/debounce'

interface SettingsProps {
  proxyUrl: string
  onChange: (value: string) => void
  onBack: () => void
}

type SaveStatus = 'saved' | 'saving'

// Shared hover classes for brutalist buttons
const brutHover = 'transition-[transform,box-shadow] duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000]'

export default ({ proxyUrl, onChange, onBack }: SettingsProps) => {
  const [value, setValue] = useState(proxyUrl)
  const [status, setStatus] = useState<SaveStatus>('saved')

  const debouncedOnChange = useCallback(
    debounce((newValue: string) => {
      onChange(newValue)
      setStatus('saved')
    }, 1000),
    [onChange]
  )

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value
    setValue(newValue)
    setStatus('saving')
    debouncedOnChange(newValue)
  }

  const handleSave = () => {
    debouncedOnChange.cancel()
    onChange(value)
    setStatus('saved')
  }

  useEffect(() => {
    if (proxyUrl !== value && status === 'saved') {
      setValue(proxyUrl)
    }
  }, [proxyUrl, status, value])

  return (
    <div className="flex flex-col gap-6">
      {/* Proxy URL */}
      <div className="flex flex-col gap-2">
        <label className="font-black text-[17px] uppercase bg-white border-[3px] border-black px-2 py-0.5 inline-block shadow-[4px_4px_0_0_#000]">
          Proxy URL
        </label>
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder="https://bh.psht.me/api/index"
          className={`w-full border-[3px] border-black p-3 font-mono font-bold text-[13px] shadow-[4px_4px_0_0_#000] outline-none bg-white box-border ${brutHover} focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0_0_#000]`}
        />
      </div>

      <div className="flex flex-col gap-3 pt-2">
        {/* Save Config */}
        <button
          onClick={handleSave}
          className={`w-full p-3 bg-black text-white border-[3px] border-black font-black uppercase text-[17px] cursor-pointer shadow-[4px_4px_0_0_#000] ${brutHover}`}
        >
          Save Config
        </button>

        {/* Install Guide + Donate */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => window.open('https://github.com/ayastreb/bandwidth-hero-proxy#installation', '_blank')}
            className={`p-3 bg-brut-red text-black border-[3px] border-black font-black uppercase text-[11px] cursor-pointer shadow-[4px_4px_0_0_#000] flex flex-col items-center justify-center gap-1 ${brutHover}`}
          >
            <ExternalLink size={20} strokeWidth={3} />
            <span>Install Guide</span>
          </button>
          <button
            onClick={() => window.open('https://www.paypal.me/ayastreb', '_blank')}
            className={`p-3 bg-brut-teal text-black border-[3px] border-black font-black uppercase text-[11px] cursor-pointer shadow-[4px_4px_0_0_#000] flex flex-col items-center justify-center gap-1 ${brutHover}`}
          >
            <Heart size={20} strokeWidth={3} />
            <span>Donate</span>
          </button>
        </div>
      </div>
    </div>
  )
}
