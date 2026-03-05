import type { ImageFormat } from "../defaults"

const createProxyUrl = (
	proxyUrl: string,
	originalUrl: string,
	compressionLevel: number,
	convertBw: boolean,
	imageFormat: ImageFormat,
): string => {
	const jpeg = imageFormat === "jpeg" ? 1 : 0
	const avif = imageFormat === "avif" ? 1 : 0
	const bw = convertBw ? 1 : 0

	// Remove trailing slash if present
	const cleanProxy = proxyUrl.replace(/\/$/, "")

	return `${cleanProxy}?jpeg=${jpeg}&avif=${avif}&bw=${bw}&l=${compressionLevel}&url=${encodeURIComponent(originalUrl)}`
}

export default createProxyUrl
