import React from 'react'
import { Check } from 'lucide-react'

interface CompressionSettingsProps {
  convertBw: boolean
  compressionLevel: number
  onConvertBwChange: () => void
  onCompressionLevelChange: (value: number) => void
}

export default ({ convertBw, compressionLevel, onConvertBwChange, onCompressionLevelChange }: CompressionSettingsProps) => {
  return (
    <div style={{ background: 'var(--brut-purple)', border: 'var(--brut-border)', padding: '16px', boxShadow: 'var(--brut-shadow)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Quality slider */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '13px' }}>
          <label>QUALITY</label>
          <span style={{ background: 'var(--brut-white)', border: '2px solid var(--brut-black)', padding: '0 4px' }}>{compressionLevel}%</span>
        </div>
        <input
          type="range"
          min="1"
          max="100"
          value={compressionLevel}
          onChange={e => onCompressionLevelChange(parseInt(e.target.value))}
        />
      </div>

      {/* B&W mode */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
        <label style={{ fontWeight: 700, fontSize: '13px', textTransform: 'uppercase' }}>B&W Mode</label>
        <button
          onClick={onConvertBwChange}
          style={{ width: '24px', height: '24px', border: 'var(--brut-border)', background: convertBw ? 'var(--brut-black)' : 'var(--brut-white)', color: 'var(--brut-white)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
        >
          {convertBw && <Check size={16} strokeWidth={4} />}
        </button>
      </div>
    </div>
  )
}
