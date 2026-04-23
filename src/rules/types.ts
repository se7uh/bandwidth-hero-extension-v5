export type RuleAction = "allow" | "block"
export type RulePatternType = "glob" | "regex"

export interface Rule {
	id: string
	action: RuleAction
	pattern: string
	patternType: RulePatternType
	enabled: boolean
}

export const RULES_MIGRATION_VERSION = 1
