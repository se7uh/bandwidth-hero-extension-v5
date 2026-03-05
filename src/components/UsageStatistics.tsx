import { brutalHover } from "./styles"

interface UsageStatisticsProps {
	filesProcessed?: number
	bytesProcessed?: number
	bytesSaved?: number
}

function formatBytes(bytes: number) {
	if (bytes === 0) return "0 B"
	const k = 1024
	const sizes = ["B", "KB", "MB", "GB"]
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return `${parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`
}

export default ({
	filesProcessed = 0,
	bytesProcessed: _bytesProcessed = 0,
	bytesSaved = 0,
}: UsageStatisticsProps) => {
	return (
		<div className="grid grid-cols-2 gap-3">
			<div
				className={`border-[3px] border-black bg-white p-3 shadow-[4px_4px_0_0_#000] ${brutalHover}`}
			>
				<div className="font-black text-[28px] leading-none">
					{formatBytes(bytesSaved)}
				</div>
				<div className="mt-1 inline-block bg-black px-1 font-bold text-[10px] text-white uppercase">
					Data Saved
				</div>
			</div>
			<div
				className={`border-[3px] border-black bg-white p-3 shadow-[4px_4px_0_0_#000] ${brutalHover}`}
			>
				<div className="font-black text-[28px] leading-none">
					{filesProcessed.toLocaleString()}
				</div>
				<div className="mt-1 inline-block bg-black px-1 font-bold text-[10px] text-white uppercase">
					Images
				</div>
			</div>
		</div>
	)
}
