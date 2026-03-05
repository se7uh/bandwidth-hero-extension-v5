interface HeaderProps {
	enabled?: boolean
	onChange?: () => void
}

export default ({ enabled = false, onChange }: HeaderProps) => {
	return (
		<div className="flex items-center justify-between border-black border-b-[3px] bg-white px-4 py-3">
			<h1 className="m-0 font-black text-[20px] uppercase italic leading-[1.1] tracking-tight">
				Bandwidth
				<br />
				Hero
			</h1>
			<div className="flex items-center gap-2">
				<span className="font-bold text-[11px] uppercase">
					{enabled ? "ON" : "OFF"}
				</span>
				<button
					type="button"
					onClick={onChange}
					aria-label={enabled ? "Disable" : "Enable"}
					className={`relative h-6 w-12 cursor-pointer border-[3px] border-black p-0 transition-colors duration-100 ${enabled ? "bg-brut-cyan" : "bg-white"}`}
				>
					<div
						className={`absolute -top-0.75 -bottom-0.75 w-6 bg-black transition-all duration-100 ${enabled ? "-right-0.75" : "-left-0.75"}`}
					/>
				</button>
			</div>
		</div>
	)
}
