import { RULES_MIGRATION_VERSION, type Rule } from "./types"

interface LegacyState {
	disabledHosts?: string[]
	invertBlocklist?: boolean
	rules?: Rule[]
	rulesMigrationVersion?: number
}

const makeRuleId = (prefix: string, index: number) => `${prefix}-${index + 1}`

export default function migrateLegacyRules(state: LegacyState): {
	rules: Rule[]
	rulesMigrationVersion: number
} {
	if (
		Array.isArray(state.rules) &&
		state.rulesMigrationVersion === RULES_MIGRATION_VERSION
	) {
		return {
			rules: state.rules,
			rulesMigrationVersion: RULES_MIGRATION_VERSION,
		}
	}

	const hosts = (state.disabledHosts ?? [])
		.map((host) => host.trim())
		.filter(Boolean)
	const invert = Boolean(state.invertBlocklist)

	const rules: Rule[] = hosts.map((host, index) => ({
		id: makeRuleId(invert ? "allow" : "block", index),
		action: invert ? "allow" : "block",
		pattern: `${host.toLowerCase()}/**`,
		patternType: "glob",
		enabled: true,
	}))

	if (invert) {
		rules.push({
			id: "terminal-block",
			action: "block",
			pattern: "**",
			patternType: "glob",
			enabled: true,
		})
	}

	return {
		rules,
		rulesMigrationVersion: RULES_MIGRATION_VERSION,
	}
}
