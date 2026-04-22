import type { ImageFormat } from "../defaults"
import CompressionSettings from "./CompressionSettings"
import DisableButton from "./DisableButton"
import ManageDisabled from "./ManageDisabled"
import { brutalHover } from "./styles"
import UsageStatistics from "./UsageStatistics"

interface HomeProps {
	view?: "home" | "sites"
	statistics: {
		filesProcessed: number
		bytesProcessed: number
		bytesSaved: number
	}
	disabledHosts: string[]
	currentUrl: string
	compressionLevel: number
	convertBw: boolean
	imageFormat: ImageFormat
	invertBlocklist: boolean
	proxyUrl?: string
	onSiteDisable: () => void
	onSiteEnable: () => void
	disabledOnChange?: (value: string) => void
	compressionLevelOnChange: (value: number) => void
	convertBwOnChange: () => void
	imageFormatOnChange: (format: ImageFormat) => void
	onInvertBlocklistChange: () => void
	onConfigureProxy: () => void
}

export default ({
	view = "home",
	statistics,
	disabledHosts,
	currentUrl,
	compressionLevel,
	convertBw,
	imageFormat,
	invertBlocklist,
	proxyUrl,
	onSiteDisable,
	onSiteEnable,
	disabledOnChange,
	compressionLevelOnChange,
	convertBwOnChange,
	imageFormatOnChange,
	onInvertBlocklistChange,
}: HomeProps) => {
	if (view === "sites") {
		return (
			<ManageDisabled
				disabledHosts={disabledHosts}
				invertBlocklist={invertBlocklist}
				onChange={disabledOnChange}
			/>
		)
	}

	return (
		<div className="flex flex-col gap-4">
			{!proxyUrl && (
				<div
					className={`border-[3px] border-black bg-brut-yellow px-3 py-2 shadow-[4px_4px_0_0_#000] ${brutalHover}`}
				>
					<div className="font-black text-[12px] uppercase">Setup Required</div>
					<div className="mt-0.5 text-[11px]">
						Please configure your compression proxy URL to start saving data.
					</div>
				</div>
			)}
			<UsageStatistics
				filesProcessed={statistics.filesProcessed}
				bytesProcessed={statistics.bytesProcessed}
				bytesSaved={statistics.bytesSaved}
			/>
			<DisableButton
				disabledHosts={disabledHosts}
				invertBlocklist={invertBlocklist}
				currentUrl={currentUrl}
				onSiteDisable={onSiteDisable}
				onSiteEnable={onSiteEnable}
			/>
			<button
				type="button"
				onClick={onInvertBlocklistChange}
				className={`w-full cursor-pointer border-[3px] border-black px-3 py-2.5 font-black text-[13px] uppercase shadow-[4px_4px_0_0_#000] transition-[transform,box-shadow] duration-100 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] ${invertBlocklist ? "bg-brut-teal" : "bg-white"}`}
			>
				{invertBlocklist ? "Invert Blocklist: ON" : "Invert Blocklist: OFF"}
			</button>
			<CompressionSettings
				convertBw={convertBw}
				compressionLevel={compressionLevel}
				imageFormat={imageFormat}
				onConvertBwChange={convertBwOnChange}
				onCompressionLevelChange={compressionLevelOnChange}
				onImageFormatChange={imageFormatOnChange}
			/>
		</div>
	)
}
