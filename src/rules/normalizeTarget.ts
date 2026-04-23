export default function normalizeTarget(url: string): string | null {
	try {
		const parsed = new URL(url)
		if (!/^https?:$/i.test(parsed.protocol)) return null
		return `${parsed.hostname.toLowerCase()}${parsed.pathname}`
	} catch {
		return null
	}
}
