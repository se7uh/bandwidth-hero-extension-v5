import { Check } from "lucide-react"
import type { ImageFormat } from "../defaults"
import { brutalHover } from "./styles"

interface CompressionSettingsProps {
	convertBw: boolean
	compressionLevel: number
	imageFormat: ImageFormat
	onConvertBwChange: () => void
	onCompressionLevelChange: (value: number) => void
	onImageFormatChange: (format: ImageFormat) => void
}

const FORMATS: { value: ImageFormat; label: string }[] = [
	{ value: "webp", label: "WebP" },
	{ value: "avif", label: "AVIF" },
	{ value: "jpeg", label: "JPEG" },
]

export default ({
	convertBw,
	compressionLevel,
	imageFormat,
	onConvertBwChange,
	onCompressionLevelChange,
	onImageFormatChange,
}: CompressionSettingsProps) => {
	return (
		<div
			className={`flex flex-col gap-4 border-[3px] border-black bg-brut-purple p-4 shadow-[4px_4px_0_0_#000] ${brutalHover}`}
		>
			{/* Quality slider */}
			<div className="flex flex-col gap-2">
				<div className="flex justify-between font-bold text-[13px]">
					<label htmlFor="quality-slider">QUALITY</label>
					<span className="border-2 border-black bg-white px-1">
						{compressionLevel}%
					</span>
				</div>
				<input
					id="quality-slider"
					type="range"
					min="1"
					max="100"
					value={compressionLevel}
					onChange={(e) =>
						onCompressionLevelChange(parseInt(e.target.value, 10))
					}
				/>
			</div>

			{/* Image format picker */}
			<div className="flex flex-col gap-2">
				<label
					className="font-bold text-[13px] uppercase"
					htmlFor="format-picker"
				>
					Output Format
				</label>
				<div className="flex gap-0">
					{FORMATS.map(({ value, label }) => (
						<button
							type="button"
							key={value}
							onClick={() => onImageFormatChange(value)}
							className={`-ml-0.75 flex-1 cursor-pointer border-[3px] border-black py-1.5 font-black text-[12px] uppercase first:ml-0 ${
								imageFormat === value
									? "bg-black text-white"
									: "bg-white text-black"
							}`}
						>
							{label}
						</button>
					))}
				</div>
			</div>

			{/* Grayscale mode */}
			<div className="flex items-center justify-between pt-1">
				<label
					className="font-bold text-[13px] uppercase"
					htmlFor="grayscale-toggle"
				>
					Grayscale Mode
				</label>
				<button
					id="grayscale-toggle"
					type="button"
					onClick={onConvertBwChange}
					className={`flex h-6 w-6 cursor-pointer items-center justify-center border-[3px] border-black p-0 ${convertBw ? "bg-black text-white" : "bg-white"}`}
				>
					{convertBw && <Check size={16} strokeWidth={4} />}
				</button>
			</div>
		</div>
	)
}
