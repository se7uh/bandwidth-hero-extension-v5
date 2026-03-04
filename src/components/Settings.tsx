import React, { useState, useEffect, useCallback } from 'react'
import { ExternalLink, Heart } from 'lucide-react'
import debounce from 'lodash/debounce'

interface SettingsProps {
  proxyUrl: string
  onChange: (value: string) => void
  onBack: () => void
}

type SaveStatus = 'saved' | 'saving'

const hoverIn = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.transform = 'translate(2px,2px)'
  e.currentTarget.style.boxShadow = 'var(--brut-shadow-sm)'
}
const hoverOut = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.transform = ''
  e.currentTarget.style.boxShadow = 'var(--brut-shadow)'
}

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Proxy URL */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontWeight: 900, fontSize: '17px', textTransform: 'uppercase', background: 'var(--brut-white)', border: 'var(--brut-border)', padding: '2px 8px', display: 'inline-block', boxShadow: 'var(--brut-shadow)' }}>
          Proxy URL
        </label>
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder="https://bh.psht.me/api/index"
          style={{ width: '100%', border: 'var(--brut-border)', padding: '12px', fontFamily: 'monospace', fontWeight: 700, fontSize: '13px', boxShadow: 'var(--brut-shadow)', outline: 'none', boxSizing: 'border-box', background: 'var(--brut-white)', transition: 'transform 0.1s, box-shadow 0.1s' }}
          onFocus={e => { e.currentTarget.style.transform = 'translate(2px,2px)'; e.currentTarget.style.boxShadow = 'var(--brut-shadow-sm)' }}
          onBlur={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--brut-shadow)' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '8px' }}>
        {/* Save Config */}
        <button
          onClick={handleSave}
          style={{ width: '100%', padding: '12px', background: 'var(--brut-black)', color: 'var(--brut-white)', border: '3px solid transparent', fontWeight: 900, textTransform: 'uppercase', fontSize: '17px', cursor: 'pointer', boxShadow: '4px 4px 0 0 #fff', transition: 'all 0.1s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--brut-white)'; e.currentTarget.style.color = 'var(--brut-black)'; e.currentTarget.style.borderColor = 'var(--brut-black)'; e.currentTarget.style.boxShadow = 'var(--brut-shadow)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--brut-black)'; e.currentTarget.style.color = 'var(--brut-white)'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.boxShadow = '4px 4px 0 0 #fff' }}
        >
          Save Config
        </button>

        {/* Install Guide + Donate */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '8px' }}>
          <button
            onClick={() => window.open('https://github.com/ayastreb/bandwidth-hero-proxy#installation', '_blank')}
            style={{ padding: '12px', background: 'var(--brut-red)', color: 'var(--brut-black)', border: 'var(--brut-border)', fontWeight: 900, textTransform: 'uppercase', fontSize: '11px', cursor: 'pointer', boxShadow: 'var(--brut-shadow)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', transition: 'transform 0.1s, box-shadow 0.1s' }}
            onMouseEnter={hoverIn} onMouseLeave={hoverOut}
          >
            <ExternalLink size={20} strokeWidth={3} />
            <span>Install Guide</span>
          </button>
          <button
            onClick={() => window.open('https://www.paypal.me/ayastreb', '_blank')}
            style={{ padding: '12px', background: 'var(--brut-teal)', color: 'var(--brut-black)', border: 'var(--brut-border)', fontWeight: 900, textTransform: 'uppercase', fontSize: '11px', cursor: 'pointer', boxShadow: 'var(--brut-shadow)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', transition: 'transform 0.1s, box-shadow 0.1s' }}
            onMouseEnter={hoverIn} onMouseLeave={hoverOut}
          >
            <Heart size={20} strokeWidth={3} />
            <span>Donate</span>
          </button>
        </div>
      </div>
    </div>
  )
}
