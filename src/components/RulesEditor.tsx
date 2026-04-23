import type { Rule, RuleAction, RulePatternType } from "../rules/types"
import { brutalHover } from "./styles"

interface RulesEditorProps {
	rules: Rule[]
	onChange: (rules: Rule[]) => void
}

const createRule = (): Rule => ({
	id: crypto.randomUUID(),
	action: "block",
	pattern: "",
	patternType: "glob",
	enabled: true,
})

const parseRegexError = (pattern: string): string => {
	if (!pattern.trim()) return "Pattern is required"
	try {
		new RegExp(pattern)
		return ""
	} catch {
		return "Invalid regex"
	}
}

export default function RulesEditor({ rules, onChange }: RulesEditorProps) {
	const updateRule = (id: string, patch: Partial<Rule>) => {
		onChange(
			rules.map((rule) => (rule.id === id ? { ...rule, ...patch } : rule)),
		)
	}

	const moveRule = (index: number, offset: -1 | 1) => {
		const nextIndex = index + offset
		if (nextIndex < 0 || nextIndex >= rules.length) return
		const next = [...rules]
		const current = next[index]
		next[index] = next[nextIndex]
		next[nextIndex] = current
		onChange(next)
	}

	const deleteRule = (id: string) => {
		onChange(rules.filter((rule) => rule.id !== id))
	}

	const duplicateRule = (rule: Rule) => {
		onChange([...rules, { ...rule, id: crypto.randomUUID() }])
	}

	const addRule = () => {
		onChange([...rules, createRule()])
	}

	return (
		<div className="flex flex-col gap-3">
			<div className="text-[11px]">
				<div className="font-black text-[14px] uppercase">Rules</div>
				<div className="text-[#555]">
					Top rule wins first. Use glob by default (example:
					<span className="font-mono">example.com/images/covers/**</span>).
				</div>
			</div>

			{rules.map((rule, index) => {
				const regexError =
					rule.patternType === "regex" ? parseRegexError(rule.pattern) : ""

				return (
					<div
						key={rule.id}
						className="flex flex-col gap-2 border-[3px] border-black bg-white p-2 shadow-[4px_4px_0_0_#000]"
					>
						<div className="grid grid-cols-2 gap-2">
							<select
								value={rule.action}
								onChange={(event) =>
									updateRule(rule.id, {
										action: event.currentTarget.value as RuleAction,
									})
								}
								className={`border-[3px] border-black bg-brut-yellow px-2 py-1 font-black text-[11px] uppercase ${brutalHover}`}
							>
								<option value="block">Block</option>
								<option value="allow">Allow</option>
							</select>

							<select
								value={rule.patternType}
								onChange={(event) =>
									updateRule(rule.id, {
										patternType: event.currentTarget.value as RulePatternType,
									})
								}
								className={`border-[3px] border-black bg-brut-cyan px-2 py-1 font-black text-[11px] uppercase ${brutalHover}`}
							>
								<option value="glob">Glob</option>
								<option value="regex">Regex</option>
							</select>
						</div>

						<input
							type="text"
							value={rule.pattern}
							onChange={(event) =>
								updateRule(rule.id, { pattern: event.currentTarget.value })
							}
							placeholder="example.com/path/**"
							spellCheck={false}
							className={`border-[3px] border-black px-2 py-1 font-bold font-mono text-[11px] ${brutalHover}`}
						/>

						{regexError && (
							<div className="font-black text-[10px] text-brut-red">
								{regexError}
							</div>
						)}

						<div className="grid grid-cols-5 gap-1">
							<button
								type="button"
								onClick={() => updateRule(rule.id, { enabled: !rule.enabled })}
								className={`border-[3px] border-black px-2 py-1 font-black text-[10px] uppercase ${rule.enabled ? "bg-brut-teal" : "bg-brut-red"} ${brutalHover}`}
							>
								{rule.enabled ? "On" : "Off"}
							</button>
							<button
								type="button"
								onClick={() => moveRule(index, -1)}
								className={`border-[3px] border-black bg-white px-2 py-1 font-black text-[10px] uppercase ${brutalHover}`}
							>
								Up
							</button>
							<button
								type="button"
								onClick={() => moveRule(index, 1)}
								className={`border-[3px] border-black bg-white px-2 py-1 font-black text-[10px] uppercase ${brutalHover}`}
							>
								Down
							</button>
							<button
								type="button"
								onClick={() => duplicateRule(rule)}
								className={`border-[3px] border-black bg-brut-yellow px-2 py-1 font-black text-[10px] uppercase ${brutalHover}`}
							>
								Copy
							</button>
							<button
								type="button"
								onClick={() => deleteRule(rule.id)}
								className={`border-[3px] border-black bg-black px-2 py-1 font-black text-[10px] text-white uppercase ${brutalHover}`}
							>
								Del
							</button>
						</div>
					</div>
				)
			})}

			<button
				type="button"
				onClick={addRule}
				className={`w-full border-[3px] border-black bg-black px-3 py-2 font-black text-[12px] text-white uppercase ${brutalHover}`}
			>
				Add Rule
			</button>
		</div>
	)
}
