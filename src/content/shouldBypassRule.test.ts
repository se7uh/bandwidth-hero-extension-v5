import { describe, expect, it } from "vitest"
import shouldBypassRule from "./shouldBypassRule"

describe("shouldBypassRule", () => {
	it("returns true when first matching rule blocks", () => {
		const result = shouldBypassRule({
			rules: [
				{
					id: "r1",
					action: "block",
					pattern: "google.com/**",
					patternType: "glob",
					enabled: true,
				},
			],
			pageUrl: "https://google.com",
			imageUrl: "https://google.com/logo.png",
		})

		expect(result).toBe(true)
	})

	it("returns false when first matching rule allows", () => {
		const result = shouldBypassRule({
			rules: [
				{
					id: "r1",
					action: "allow",
					pattern: "google.com/**",
					patternType: "glob",
					enabled: true,
				},
			],
			pageUrl: "https://google.com",
			imageUrl: "https://google.com/logo.png",
		})

		expect(result).toBe(false)
	})

	it("returns false when nothing matches", () => {
		const result = shouldBypassRule({
			rules: [
				{
					id: "r1",
					action: "block",
					pattern: "example.com/blocked/**",
					patternType: "glob",
					enabled: true,
				},
			],
			pageUrl: "https://google.com",
			imageUrl: "https://google.com/logo.png",
		})

		expect(result).toBe(false)
	})
})
