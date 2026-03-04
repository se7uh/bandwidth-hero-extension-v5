import React from 'react'
import { Check } from 'lucide-react'
import { brutalHover } from './styles'
import type { ImageFormat } from '../defaults'

interface CompressionSettingsProps {
  convertBw: boolean
  compressionLevel: number
  imageFormat: ImageFormat
  onConvertBwChange: () => void
  onCompressionLevelChange: (value: number) => void
  onImageFormatChange: (format: ImageFormat) => void
}

const FORMATS: { value: ImageFormat; label: string }[] = [
  { value: 'webp', label: 'WebP' },
  { value: 'avif', label: 'AVIF' },
  { value: 'jpeg', label: 'JPEG' },
]

export default ({ convertBw, compressionLevel, imageFormat, onConvertBwChange, onCompressionLevelChange, onImageFormatChange }: CompressionSettingsProps) => {
  return (
    <div className={`bg-brut-purple border-[3px] border-black p-4 shadow-[4px_4px_0_0_#000] flex flex-col gap-4 ${brutalHover}`}>
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

      {/* Image format picker */}
      <div className="flex flex-col gap-2">
        <label className="font-bold text-[13px] uppercase">Output Format</label>
        <div className="flex gap-0">
          {FORMATS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onImageFormatChange(value)}
              className={`flex-1 py-1.5 border-[3px] border-black font-black text-[12px] uppercase cursor-pointer -ml-[3px] first:ml-0 ${
                imageFormat === value
                  ? 'bg-black text-white'
                  : 'bg-white text-black'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grayscale mode */}
      <div className="flex justify-between items-center pt-1">
        <label className="font-bold text-[13px] uppercase">Grayscale Mode</label>
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
