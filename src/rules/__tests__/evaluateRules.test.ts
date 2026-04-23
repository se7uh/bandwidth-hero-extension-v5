import { describe, expect, it } from "vitest"
import evaluateRules from "../evaluateRules"
import type { Rule } from "../types"

describe("evaluateRules", () => {
	it("uses first match wins ordering", () => {
		const rules: Rule[] = [
			{
				id: "r1",
				action: "allow",
				pattern: "example.com/**",
				patternType: "glob",
				enabled: true,
			},
			{
				id: "r2",
				action: "block",
				pattern: "example.com/sam/**",
				patternType: "glob",
				enabled: true,
			},
		]

		const decision = evaluateRules(
			rules,
			"https://example.com",
			"https://example.com/images/covers",
		)

		expect(decision.matched).toBe(true)
		expect(decision.allow).toBe(true)
		expect(decision.ruleId).toBe("r1")
	})

	it("returns unmatched when no rules apply", () => {
		const decision = evaluateRules(
			[
				{
					id: "r1",
					action: "block",
					pattern: "example.com/blocked/**",
					patternType: "glob",
					enabled: true,
				},
			],
			"https://example.com",
			"https://example.com/free/image.jpg",
		)

		expect(decision.matched).toBe(false)
		expect(decision.allow).toBe(true)
	})
})
