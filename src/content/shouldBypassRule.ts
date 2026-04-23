import evaluateRules from "../rules/evaluateRules"
import type { Rule } from "../rules/types"

interface ShouldBypassRuleOptions {
	rules: Rule[]
	pageUrl: string
	imageUrl: string
}

export default function shouldBypassRule({
	rules,
	pageUrl,
	imageUrl,
}: ShouldBypassRuleOptions): boolean {
	const decision = evaluateRules(rules, pageUrl, imageUrl)
	return decision.matched && !decision.allow
}
