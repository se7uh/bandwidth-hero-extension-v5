import type { Rule } from "../rules/types"
import parseUrl from "../utils/parseUrl"

interface DisableButtonProps {
	rules?: Rule[]
	currentUrl?: string
	onSiteDisable?: () => void
	onSiteEnable?: () => void
}

export default ({
	rules = [],
	currentUrl = "",
	onSiteDisable,
	onSiteEnable,
}: DisableButtonProps) => {
	const { schema, hostname } = parseUrl(currentUrl)

	if (!/^https?:/i.test(schema)) return null
	const currentSitePattern = `${hostname}/**`
	const isDisabled = rules.some(
		(rule) =>
			rule.action === "block" &&
			rule.patternType === "glob" &&
			rule.pattern === currentSitePattern,
	)

	return (
		<button
			type="button"
			onClick={isDisabled ? onSiteEnable : onSiteDisable}
			className={`w-full cursor-pointer border-[3px] border-black px-3 py-2.5 font-black text-[13px] uppercase shadow-[4px_4px_0_0_#000] transition-[transform,box-shadow] duration-100 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] ${isDisabled ? "bg-brut-cyan" : "bg-brut-red"}`}
		>
			{isDisabled ? `Unblock ${hostname}` : `Block ${hostname}`}
		</button>
	)
}
