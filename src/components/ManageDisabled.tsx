import debounce from "lodash/debounce"
import type React from "react"
import { useCallback, useEffect, useState } from "react"
import { brutalHover } from "./styles"

interface ManageDisabledProps {
	disabledHosts?: string[]
	invertBlocklist?: boolean
	onChange?: (value: string) => void
}

type SaveStatus = "saved" | "saving" | "unsaved"

const SavingDots = () => {
	const [dots, setDots] = useState(1)
	useEffect(() => {
		const interval = setInterval(() => setDots((d) => (d % 3) + 1), 400)
		return () => clearInterval(interval)
	}, [])
	return <span className="text-[#555]">Saving{".".repeat(dots)}</span>
}

export default ({
	disabledHosts = [],
	invertBlocklist = false,
	onChange,
}: ManageDisabledProps) => {
	const [value, setValue] = useState(
		Array.isArray(disabledHosts) ? disabledHosts.join("\n") : "",
	)
	const [status, setStatus] = useState<SaveStatus>("saved")

	const debouncedOnChange = useCallback(
		debounce((newValue: string) => {
			onChange?.(newValue)
			setStatus("saved")
		}, 1000),
		[],
	)

	const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newValue = event.currentTarget.value
		setValue(newValue)
		setStatus("saving")
		debouncedOnChange(newValue)
	}

	useEffect(() => {
		const joined = Array.isArray(disabledHosts) ? disabledHosts.join("\n") : ""
		if (joined !== value && status === "saved") {
			setValue(joined)
		}
	}, [disabledHosts, status, value])

	const count = value
		.split("\n")
		.map((h) => h.trim())
		.filter((h) => h !== "").length

	return (
		<div className="flex h-full flex-col gap-2">
			<div className="flex items-start justify-between">
				<div>
					<div className="font-black text-[14px] uppercase">
						{invertBlocklist ? "Allowed Sites" : "Disabled Sites"}
					</div>
					<div className="text-[#555] text-[11px]">
						{invertBlocklist
							? "One domain per line. Only these sites will be compressed."
							: "One domain per line. Images won't be compressed on these sites."}
					</div>
				</div>
				{count > 0 && (
					<div
						className={`ml-2 shrink-0 whitespace-nowrap border-[3px] border-black bg-black px-1.75 py-0.5 font-black text-[10px] text-white shadow-[2px_2px_0_0_#000] ${brutalHover}`}
					>
						{count} {count === 1 ? "site" : "sites"}
					</div>
				)}
			</div>
			<textarea
				value={value}
				onChange={handleChange}
				placeholder="example.com"
				spellCheck={false}
				className={`min-h-60 flex-1 resize-none border-[3px] border-black p-2 font-bold font-mono text-[12px] shadow-[4px_4px_0_0_#000] outline-none ${brutalHover} focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-[2px_2px_0_0_#000]`}
			/>
			<div className="text-right font-bold text-[11px]">
				{status === "saving" && <SavingDots />}
				{status === "saved" && <span className="text-green-600">✓ Saved</span>}
				{status === "unsaved" && (
					<span className="text-orange-500">! Unsaved</span>
				)}
			</div>
		</div>
	)
}
