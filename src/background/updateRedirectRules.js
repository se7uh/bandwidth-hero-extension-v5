import { Netmask } from 'netmask';

// Helper to update dynamic DNR rules based on state
export default async function updateRedirectRules(state) {
  if (!state.enabled || !state.proxyUrl) {
    // If disabled or no proxy, clear rules
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1, 2],
      addRules: []
    });
    await updateIcon(false);
    return;
  }

  // Rule 1: Allow specific requests with our bypass param (Higher Priority)
  // Rule 2: Block all other image requests to prevent download (Lower Priority)
  
  try {
      const proxyHostname = new URL(state.proxyUrl).hostname;
      const excludedDomains = [...(state.disabledHosts || []), proxyHostname, 'localhost', '127.0.0.1'];

      const allowRule = {
        id: 1,
        priority: 2,
        action: {
          type: 'allow'
        },
        condition: {
          regexFilter: "[?&]bh-allow=1",
          resourceTypes: ["image", "xmlhttprequest"]
        }
      };

      const blockRule = {
        id: 2,
        priority: 1,
        action: {
          type: 'block'
        },
        condition: {
          regexFilter: "^https?://.+\\.(jpg|jpeg|png|gif|webp|bmp|ico|svg)(\\?.*)?$",
          resourceTypes: ["image"],
          excludedInitiatorDomains: excludedDomains,
          excludedRequestDomains: excludedDomains
        }
      };

      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1, 2],
        addRules: [allowRule, blockRule]
      });

      await updateIcon(true);

  } catch (e) {
    console.error("Error updating DNR rules:", e);
  }
}

async function updateIcon(isEnabled) {
  const iconPath = isEnabled ? "assets/icon-128.png" : "assets/icon-128-disabled.png";
  if (chrome.action) {
    await chrome.action.setIcon({ path: iconPath });
  }
}