import React from 'react'

interface HeaderProps {
  enabled?: boolean
  onChange?: () => void
}

export default ({ enabled = false, onChange }: HeaderProps) => {
  return (
    <div style={{ padding: '12px 16px', borderBottom: 'var(--brut-border)', background: 'var(--brut-white)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h1 style={{ fontSize: '20px', fontWeight: 900, textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '-0.05em', margin: 0, lineHeight: 1.1 }}>
        Bandwidth<br />Hero
      </h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>{enabled ? 'ON' : 'OFF'}</span>
        <button
          onClick={onChange}
          aria-label={enabled ? 'Disable' : 'Enable'}
          style={{ width: '48px', height: '24px', border: 'var(--brut-border)', position: 'relative', background: enabled ? 'var(--brut-cyan)' : 'var(--brut-white)', cursor: 'pointer', padding: 0, transition: 'background 0.1s' }}
        >
          <div style={{ position: 'absolute', top: '-3px', bottom: '-3px', width: '24px', background: 'var(--brut-black)', transition: 'all 0.1s', ...(enabled ? { right: '-3px' } : { left: '-3px' }) }} />
        </button>
      </div>
    </div>
  )
}
