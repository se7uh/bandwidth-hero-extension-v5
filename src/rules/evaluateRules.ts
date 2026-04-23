import matchRule from "./matchRule"
import normalizeTarget from "./normalizeTarget"
import type { Rule } from "./types"

export interface RuleDecision {
	matched: boolean
	allow: boolean
	ruleId?: string
}

export default function evaluateRules(
	rules: Rule[],
	pageUrl: string,
	imageUrl: string,
): RuleDecision {
	const targets = [normalizeTarget(pageUrl), normalizeTarget(imageUrl)].filter(
		(target): target is string => Boolean(target),
	)

	for (const rule of rules) {
		for (const target of targets) {
			if (matchRule(rule, target)) {
				return {
					matched: true,
					allow: rule.action === "allow",
					ruleId: rule.id,
				}
			}
		}
	}

	return { matched: false, allow: true }
}
