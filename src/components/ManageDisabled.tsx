import React, { useState, useEffect, useCallback } from 'react'
import debounce from 'lodash/debounce'
import { brutalHover } from './styles'

interface ManageDisabledProps {
  disabledHosts?: string[]
  onChange?: (value: string) => void
}

type SaveStatus = 'saved' | 'saving' | 'unsaved'

const SavingDots = () => {
  const [dots, setDots] = useState(1)
  useEffect(() => {
    const interval = setInterval(() => setDots(d => (d % 3) + 1), 400)
    return () => clearInterval(interval)
  }, [])
  return <span className="text-[#555]">Saving{'.'.repeat(dots)}</span>
}

export default ({ disabledHosts = [], onChange }: ManageDisabledProps) => {
  const [value, setValue] = useState(Array.isArray(disabledHosts) ? disabledHosts.join('\n') : '')
  const [status, setStatus] = useState<SaveStatus>('saved')

  const debouncedOnChange = useCallback(
    debounce((newValue: string) => {
      onChange?.(newValue)
      setStatus('saved')
    }, 1000),
    [onChange]
  )

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.currentTarget.value
    setValue(newValue)
    setStatus('saving')
    debouncedOnChange(newValue)
  }

  useEffect(() => {
    const joined = Array.isArray(disabledHosts) ? disabledHosts.join('\n') : ''
    if (joined !== value && status === 'saved') {
      setValue(joined)
    }
  }, [disabledHosts, status, value])

  const count = value.split('\n').map(h => h.trim()).filter(h => h !== '').length

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-black text-[14px] uppercase">Disabled Sites</div>
          <div className="text-[11px] text-[#555]">One domain per line. Images won't be compressed on these sites.</div>
        </div>
        {count > 0 && (
          <div className={`text-[10px] font-black bg-black text-white px-[7px] py-[2px] border-[3px] border-black shadow-[2px_2px_0_0_#000] whitespace-nowrap shrink-0 ml-2 ${brutalHover}`}>
            {count} {count === 1 ? 'site' : 'sites'}
          </div>
        )}
      </div>
      <textarea
        value={value}
        onChange={handleChange}
        placeholder="example.com"
        spellCheck={false}
        className={`flex-1 border-[3px] border-black p-2 font-mono text-[12px] font-bold shadow-[4px_4px_0_0_#000] outline-none resize-none min-h-[240px] ${brutalHover} focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0_0_#000]`}
      />
      <div className="text-[11px] font-bold text-right">
        {status === 'saving' && <SavingDots />}
        {status === 'saved' && <span className="text-green-600">✓ Saved</span>}
        {status === 'unsaved' && <span className="text-orange-500">! Unsaved</span>}
      </div>
    </div>
  )
}
