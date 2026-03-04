import React, { useState, useEffect, useCallback } from 'react'
import debounce from 'lodash/debounce'

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
  return <span style={{ color: '#555' }}>Saving{'.'.repeat(dots)}</span>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: '14px', textTransform: 'uppercase' }}>Disabled Sites</div>
          <div style={{ fontSize: '11px', color: '#555' }}>One domain per line. Images won't be compressed on these sites.</div>
        </div>
        {count > 0 && (
          <div style={{ fontSize: '10px', fontWeight: 900, background: 'var(--brut-black)', color: 'var(--brut-white)', padding: '2px 7px', border: 'var(--brut-border)', boxShadow: 'var(--brut-shadow-sm)', whiteSpace: 'nowrap', flexShrink: 0, marginLeft: '8px' }}>
            {count} {count === 1 ? 'site' : 'sites'}
          </div>
        )}
      </div>
      <textarea
        value={value}
        onChange={handleChange}
        placeholder="example.com"
        style={{ flex: 1, border: 'var(--brut-border)', padding: '8px', fontFamily: 'monospace', fontSize: '12px', fontWeight: 700, boxShadow: 'var(--brut-shadow)', outline: 'none', resize: 'none', minHeight: '240px', transition: 'transform 0.1s, box-shadow 0.1s' }}
        onFocus={e => { e.currentTarget.style.transform = 'translate(2px,2px)'; e.currentTarget.style.boxShadow = 'var(--brut-shadow-sm)' }}
        onBlur={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--brut-shadow)' }}
      />
      <div style={{ fontSize: '11px', fontWeight: 700, textAlign: 'right' }}>
        {status === 'saving' && <SavingDots />}
        {status === 'saved' && <span style={{ color: 'green' }}>✓ Saved</span>}
        {status === 'unsaved' && <span style={{ color: 'orange' }}>! Unsaved</span>}
      </div>
    </div>
  )
}
