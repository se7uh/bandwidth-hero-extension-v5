import { describe, expect, it } from "vitest"
import migrateLegacyRules from "../migrateLegacyRules"

describe("migrateLegacyRules", () => {
	it("converts disabled hosts into block rules", () => {
		const output = migrateLegacyRules({
			disabledHosts: ["example.com"],
			invertBlocklist: false,
		})

		expect(output.rules[0]?.action).toBe("block")
		expect(output.rules[0]?.pattern).toBe("example.com/**")
	})

	it("converts invert mode into allow rules and terminal block", () => {
		const output = migrateLegacyRules({
			disabledHosts: ["example.com"],
			invertBlocklist: true,
		})

		expect(output.rules.some((rule) => rule.action === "allow")).toBe(true)
		expect(output.rules.at(-1)?.action).toBe("block")
		expect(output.rules.at(-1)?.pattern).toBe("**")
	})
})
