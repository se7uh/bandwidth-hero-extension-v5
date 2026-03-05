import shouldCompress from "./background/shouldCompress"
import updateRedirectRules from "./background/updateRedirectRules"
import defaultState, { type Statistics } from "./defaults"
import createProxyUrl from "./utils/createProxyUrl"

// In Manifest V3, background scripts are Service Workers.
// We use chrome.declarativeNetRequest to block images early (preventing race condition),
// then inject compressed images via content script.

const STORAGE_KEY_STATS = "statistics"

async function incrementStats(bytesProcessed: number, bytesSaved: number) {
	const stored = await chrome.storage.local.get(STORAGE_KEY_STATS)
	const statistics: Statistics = (stored[STORAGE_KEY_STATS] as
		| Statistics
		| undefined) ?? {
		filesProcessed: 0,
		bytesProcessed: 0,
		bytesSaved: 0,
	}

	statistics.filesProcessed += 1
	statistics.bytesProcessed += bytesProcessed
	statistics.bytesSaved += bytesSaved

	await chrome.storage.local.set({ [STORAGE_KEY_STATS]: statistics })
}

async function _updateIcon(isEnabled: boolean) {
	// Using same icon for both states - extension.js handles icon paths
	// You can add badge text or different color treatment instead
	if (chrome.action) {
		await chrome.action.setBadgeText({
			text: isEnabled ? "" : "OFF",
		})
		await chrome.action.setBadgeBackgroundColor({
			color: isEnabled ? "#2185d0" : "#767676",
		})
	}
}

// --- Event Listeners ---

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === "COMPRESS_IMAGE") {
		handleCompressImage(request, sender).then(sendResponse)
		return true // Indicates async response
	}
})

interface CompressImageRequest {
	imageUrl: string
	pageUrl: string
}

interface CompressImageResponse {
	success: boolean
	dataUri?: string
	reason?: string
	error?: string
}

async function handleCompressImage(
	request: CompressImageRequest,
	_sender: chrome.runtime.MessageSender,
): Promise<CompressImageResponse> {
	try {
		const { imageUrl, pageUrl } = request
		const stored = await chrome.storage.local.get(null)
		const state = { ...defaultState, ...stored } as typeof defaultState

		if (!state.enabled || !state.proxyUrl) {
			return { success: false, reason: "disabled_or_no_proxy" }
		}

		const should = shouldCompress({
			imageUrl,
			pageUrl,
			compressed: new Set(),
			proxyUrl: state.proxyUrl,
			disabledHosts: state.disabledHosts,
			enabled: state.enabled,
			type: "image",
		})

		if (!should) {
			return { success: false, reason: "should_not_compress" }
		}

		const proxyUrl = createProxyUrl(
			state.proxyUrl,
			imageUrl,
			state.compressionLevel,
			state.convertBw,
			state.imageFormat ?? "webp",
		)

		const response = await fetch(proxyUrl)
		if (!response.ok) {
			throw new Error(
				`Proxy returned ${response.status} ${response.statusText}`,
			)
		}

		const originalSize = parseInt(
			response.headers.get("x-original-size") || "0",
			10,
		)
		const bytesSaved = parseInt(
			response.headers.get("x-bytes-saved") || "0",
			10,
		)

		if (originalSize > 0) {
			await incrementStats(originalSize, bytesSaved)
		}

		const blob = await response.blob()

		const dataUri = await new Promise<string>((resolve, reject) => {
			const reader = new FileReader()
			reader.onloadend = () => resolve(reader.result as string)
			reader.onerror = reject
			reader.readAsDataURL(blob)
		})

		return { success: true, dataUri }
	} catch (error) {
		return { success: false, error: (error as Error).message }
	}
}

// --- Event Listeners ---

chrome.runtime.onInstalled.addListener(async () => {
	const stored = await chrome.storage.local.get(null)
	const state = { ...defaultState, ...stored }

	// Check WebP support (hardcoded true for modern Chrome/Edge)
	state.isWebpSupported = true
	await chrome.storage.local.set(state)

	await updateRedirectRules(state)
})

chrome.storage.onChanged.addListener(async (changes, namespace) => {
	if (namespace !== "local") return

	const stored = await chrome.storage.local.get(null)
	const state = { ...defaultState, ...stored }

	// If specific keys changed, update rules
	if (
		changes.proxyUrl ||
		changes.enabled ||
		changes.convertBw ||
		changes.compressionLevel ||
		changes.disabledHosts
	) {
		await updateRedirectRules(state)
	}
})
