import React, { useState, useEffect, useCallback } from 'react'
import debounce from 'lodash/debounce'

interface ManageDisabledProps {
  disabledHosts?: string[]
  onChange?: (value: string) => void
}

type SaveStatus = 'saved' | 'saving' | 'unsaved'

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: '14px', textTransform: 'uppercase' }}>Disabled Sites</div>
          <div style={{ fontSize: '11px', color: '#555' }}>One domain per line. Images won't be compressed on these sites.</div>
        </div>
        <div style={{ fontSize: '11px', fontWeight: 700 }}>
          {status === 'saving' && <span style={{ color: '#555' }}>Saving…</span>}
          {status === 'saved' && <span style={{ color: 'green' }}>✓ Saved</span>}
          {status === 'unsaved' && <span style={{ color: 'orange' }}>! Unsaved</span>}
        </div>
      </div>
      <textarea
        value={value}
        onChange={handleChange}
        placeholder="example.com"
        style={{ flex: 1, border: 'var(--brut-border)', padding: '8px', fontFamily: 'monospace', fontSize: '12px', fontWeight: 700, boxShadow: 'var(--brut-shadow)', outline: 'none', resize: 'none', minHeight: '240px', transition: 'transform 0.1s, box-shadow 0.1s' }}
        onFocus={e => { e.currentTarget.style.transform = 'translate(2px,2px)'; e.currentTarget.style.boxShadow = 'var(--brut-shadow-sm)' }}
        onBlur={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--brut-shadow)' }}
      />
    </div>
  )
}
