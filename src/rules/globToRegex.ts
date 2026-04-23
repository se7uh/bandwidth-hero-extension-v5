const REGEX_SPECIAL_CHARACTERS = /[|\\{}()[\]^$+?.]/g

export default function globToRegex(pattern: string): RegExp {
	let out = ""

	for (let i = 0; i < pattern.length; i += 1) {
		const ch = pattern[i]

		if (ch === "*") {
			if (pattern[i + 1] === "*") {
				out += ".*"
				i += 1
			} else {
				out += "[^/]*"
			}
			continue
		}

		if (ch === "?") {
			out += "."
			continue
		}

		out += ch.replace(REGEX_SPECIAL_CHARACTERS, "\\$&")
	}

	return new RegExp(`^${out}$`, "i")
}
