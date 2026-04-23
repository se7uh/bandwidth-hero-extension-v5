import globToRegex from "./globToRegex"
import type { Rule } from "./types"

export default function matchRule(rule: Rule, target: string): boolean {
	if (!rule.enabled) return false

	const pattern = rule.pattern.trim()
	if (!pattern) return false

	try {
		const re =
			rule.patternType === "regex"
				? new RegExp(pattern, "i")
				: globToRegex(pattern)
		return re.test(target)
	} catch {
		return false
	}
}
