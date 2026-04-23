import { describe, expect, it } from "vitest"
import globToRegex from "../globToRegex"

describe("globToRegex", () => {
	it("matches nested path with double wildcard", () => {
		expect(globToRegex("example.com/sam/**").test("example.com/sam/a/b")).toBe(
			true,
		)
	})

	it("does not overmatch sibling prefix", () => {
		expect(
			globToRegex("example.com/images/covers/**").test(
				"example.com/images/covers-v2",
			),
		).toBe(false)
	})

	it("matches one-segment wildcard", () => {
		expect(
			globToRegex("example.com/sam/*/chapter-?.jpg").test(
				"example.com/sam/v1/chapter-1.jpg",
			),
		).toBe(true)
	})
})
