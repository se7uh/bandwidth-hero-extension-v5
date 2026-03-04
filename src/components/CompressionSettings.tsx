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
    <div className="bg-brut-purple border-[3px] border-black p-4 shadow-[4px_4px_0_0_#000] flex flex-col gap-4">
      {/* Quality slider */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between font-bold text-[13px]">
          <label>QUALITY</label>
          <span className="bg-white border-2 border-black px-1">{compressionLevel}%</span>
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
      <div className="flex justify-between items-center pt-1">
        <label className="font-bold text-[13px] uppercase">B&W Mode</label>
        <button
          onClick={onConvertBwChange}
          className={`w-6 h-6 border-[3px] border-black cursor-pointer flex items-center justify-center p-0 ${convertBw ? 'bg-black text-white' : 'bg-white'}`}
        >
          {convertBw && <Check size={16} strokeWidth={4} />}
        </button>
      </div>
    </div>
  )
}
