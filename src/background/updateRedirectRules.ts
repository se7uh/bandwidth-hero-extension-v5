import type { State } from "../defaults"

// Helper to update dynamic DNR rules based on state
const updateRedirectRules = async (state: State): Promise<void> => {
	if (!state.enabled || !state.proxyUrl) {
		// If disabled or no proxy, clear rules
		await chrome.declarativeNetRequest.updateDynamicRules({
			removeRuleIds: [1, 2],
			addRules: [],
		})
		await updateIcon(false)
		return
	}

	// Rule 1: Allow specific requests with our bypass param (Higher Priority)
	// Rule 2: Block all other image requests to prevent download (Lower Priority)

	try {
		const proxyHostname = new URL(state.proxyUrl).hostname
		const excludedDomains = [
			...(state.disabledHosts || []),
			proxyHostname,
			"localhost",
			"127.0.0.1",
		]

		const allowRule: chrome.declarativeNetRequest.Rule = {
			id: 1,
			priority: 2,
			action: {
				type: chrome.declarativeNetRequest.RuleActionType.ALLOW,
			},
			condition: {
				regexFilter: "[?&]bh-allow=1",
				resourceTypes: [
					chrome.declarativeNetRequest.ResourceType.IMAGE,
					chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST,
				],
			},
		}

		const blockRule: chrome.declarativeNetRequest.Rule = {
			id: 2,
			priority: 1,
			action: {
				type: chrome.declarativeNetRequest.RuleActionType.BLOCK,
			},
			condition: {
				// Block only larger image types (skip ico, svg - already small)
				regexFilter: "^https?://.+\\.(jpg|jpeg|png|gif|webp|bmp)(\\?.*)?$",
				resourceTypes: [chrome.declarativeNetRequest.ResourceType.IMAGE],
				excludedInitiatorDomains: excludedDomains,
				excludedRequestDomains: excludedDomains,
			},
		}

		await chrome.declarativeNetRequest.updateDynamicRules({
			removeRuleIds: [1, 2],
			addRules: [allowRule, blockRule],
		})

		await updateIcon(true)
	} catch (e) {
		console.error("Error updating DNR rules:", e)
	}
}

async function updateIcon(isEnabled: boolean): Promise<void> {
	// extension.js handles icon paths from src/images
	const _iconPath = isEnabled ? "images/icon.png" : "images/icon.png" // Should probably have a disabled icon but for now we use the same or badge
	if (chrome.action) {
		// In background.ts we also set badge, we can keep it consistent here
		await chrome.action.setBadgeText({
			text: isEnabled ? "" : "OFF",
		})
		await chrome.action.setBadgeBackgroundColor({
			color: isEnabled ? "#2185d0" : "#767676",
		})
	}
}

export default updateRedirectRules
