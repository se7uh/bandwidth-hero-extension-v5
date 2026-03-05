import debounce from "lodash/debounce"
import { CheckCircle, ExternalLink, Heart, Loader, XCircle } from "lucide-react"
import type React from "react"
import { useCallback, useEffect, useState } from "react"
import { brutalHover } from "./styles"

interface SettingsProps {
	proxyUrl: string
	onChange: (value: string) => void
	onBack: () => void
}

type CheckStatus = "idle" | "checking" | "ok" | "error"

export default ({ proxyUrl, onChange, onBack: _onBack }: SettingsProps) => {
	const [value, setValue] = useState(proxyUrl)
	const [checkStatus, setCheckStatus] = useState<CheckStatus>("idle")
	const [checkError, setCheckError] = useState<string>("")

	const debouncedCheck = useCallback(
		debounce(async (url: string) => {
			const trimmed = url.trim()
			if (!trimmed) {
				setCheckStatus("idle")
				return
			}

			setCheckStatus("checking")
			setCheckError("")

			try {
				const testImage = "https://picsum.photos/id/1/100/100"
				const cleanProxy = trimmed.replace(/\/$/, "")
				const testUrl = `${cleanProxy}?url=${encodeURIComponent(testImage)}&l=40&jpeg=0&avif=0&bw=0`

				const response = await fetch(testUrl, {
					signal: AbortSignal.timeout(8000),
				})

				if (!response.ok) {
					setCheckStatus("error")
					setCheckError(
						`Server returned ${response.status} ${response.statusText}`,
					)
					return
				}

				const hasOriginalSize = response.headers.has("x-original-size")
				const hasBytesSaved = response.headers.has("x-bytes-saved")

				if (hasOriginalSize || hasBytesSaved) {
					setCheckStatus("ok")
				} else {
					setCheckStatus("error")
					setCheckError(
						"URL reachable but does not appear to be a Bandwidth Hero proxy",
					)
				}
			} catch (err: unknown) {
				setCheckStatus("error")
				if (err instanceof Error && err.name === "TimeoutError") {
					setCheckError("Connection timed out")
				} else {
					setCheckError(
						err instanceof Error
							? (err.message ?? "Could not reach proxy")
							: "Could not reach proxy",
					)
				}
			}
		}, 1000),
		[],
	)

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.currentTarget.value
		setValue(newValue)
		setCheckStatus(newValue.trim() ? "checking" : "idle")
		debouncedCheck(newValue)
	}

	const handleSave = () => {
		debouncedCheck.cancel()
		onChange(value)
	}

	useEffect(() => {
		return () => {
			debouncedCheck.cancel()
		}
	}, [debouncedCheck])

	const checkIcon =
		checkStatus === "ok" ? (
			<CheckCircle size={16} strokeWidth={3} />
		) : checkStatus === "error" ? (
			<XCircle size={16} strokeWidth={3} />
		) : null

	const checkBg =
		checkStatus === "ok"
			? "bg-brut-teal"
			: checkStatus === "error"
				? "bg-brut-red"
				: "bg-white"

	return (
		<div className="flex flex-col gap-6">
			{/* Proxy URL */}
			<div className="flex flex-col gap-2">
				<label
					htmlFor="proxy-url-input"
					className={`inline-block border-[3px] border-black bg-white px-2 py-0.5 font-black text-[17px] uppercase shadow-[4px_4px_0_0_#000] ${brutalHover}`}
				>
					Proxy URL
				</label>
				<div className="relative">
					<input
						id="proxy-url-input"
						type="url"
						value={value}
						onChange={handleInputChange}
						spellCheck={false}
						autoComplete="off"
						className={`box-border w-full border-[3px] border-black bg-white p-3 pr-10 font-bold font-mono text-[13px] shadow-[4px_4px_0_0_#000] outline-none ${brutalHover} focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-[2px_2px_0_0_#000]`}
					/>
					{checkStatus === "checking" && (
						<span className="pointer-events-none absolute top-1/2 right-3 z-10 -translate-y-1/2">
							<Loader size={16} strokeWidth={3} className="animate-spin" />
						</span>
					)}
				</div>

				{/* Check status */}
				{checkStatus !== "idle" && (
					<div
						className={`flex items-center gap-2 border-[3px] border-black px-3 py-2 font-bold text-[12px] ${checkBg}`}
					>
						{checkIcon}
						<span>
							{checkStatus === "checking" && "Checking proxy…"}
							{checkStatus === "ok" && "Proxy is reachable"}
							{checkStatus === "error" && (checkError || "Proxy unreachable")}
						</span>
					</div>
				)}
			</div>

			<div className="flex flex-col gap-3 pt-2">
				{/* Save */}
				<button
					type="button"
					onClick={handleSave}
					className={`w-full cursor-pointer border-[3px] border-black bg-black p-3 font-black text-[17px] text-white uppercase shadow-[4px_4px_0_0_#000] ${brutalHover}`}
				>
					Save Config
				</button>

				{/* Install Guide + Donate */}
				<div className="grid grid-cols-2 gap-3 pt-2">
					<button
						type="button"
						onClick={() =>
							window.open(
								"https://github.com/ayastreb/bandwidth-hero-proxy#installation",
								"_blank",
							)
						}
						className={`flex cursor-pointer flex-col items-center justify-center gap-1 border-[3px] border-black bg-brut-red p-3 font-black text-[11px] text-black uppercase shadow-[4px_4px_0_0_#000] ${brutalHover}`}
					>
						<ExternalLink size={20} strokeWidth={3} />
						<span>Install Guide</span>
					</button>
					<button
						type="button"
						onClick={() =>
							window.open("https://www.paypal.me/ayastreb", "_blank")
						}
						className={`flex cursor-pointer flex-col items-center justify-center gap-1 border-[3px] border-black bg-brut-teal p-3 font-black text-[11px] text-black uppercase shadow-[4px_4px_0_0_#000] ${brutalHover}`}
					>
						<Heart size={20} strokeWidth={3} />
						<span>Donate</span>
					</button>
				</div>
			</div>
		</div>
	)
}
