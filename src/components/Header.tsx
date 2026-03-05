interface HeaderProps {
	enabled?: boolean
	onChange?: () => void
}

export default ({ enabled = false, onChange }: HeaderProps) => {
	return (
		<div className="px-4 py-3 border-b-[3px] border-black bg-white flex justify-between items-center">
			<h1 className="text-[20px] font-black uppercase italic tracking-tight leading-[1.1] m-0">
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
					className={`w-12 h-6 border-[3px] border-black relative cursor-pointer p-0 transition-colors duration-100 ${enabled ? "bg-brut-cyan" : "bg-white"}`}
				>
					<div
						className={`absolute top-[-3px] bottom-[-3px] w-6 bg-black transition-all duration-100 ${enabled ? "right-[-3px]" : "left-[-3px]"}`}
					/>
				</button>
			</div>
		</div>
	)
}
