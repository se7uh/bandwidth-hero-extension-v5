import { Netmask } from 'netmask';

// Helper to update dynamic DNR rules based on state
export default async function updateRedirectRules(state) {
  if (!state.enabled || !state.proxyUrl) {
    // If disabled or no proxy, clear rules
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1, 2], // Rule 1: Redirect, Rule 2: Headers
      addRules: []
    });
    await updateIcon(false);
    return;
  }

  const { proxyUrl, convertBw, compressionLevel, isWebpSupported, disabledHosts } = state;

  // Parse params for the proxy
  // NOTE: In MV3 regexSubstitution, we cannot url-encode the capture group.
  // We must rely on putting the URL as the last parameter so the proxy can parse it correctly
  // even if it contains query parameters.
  // Expected Proxy URL format: proxyUrl?jpeg=X&bw=Y&l=Z&url=ORIGINAL_URL

  const isJpeg = isWebpSupported ? 0 : 1;
  const isBw = convertBw ? 1 : 0;
  const level = compressionLevel;

  // Construct the base of the redirect URL
  // Remove trailing slash if present
  const cleanProxy = proxyUrl.replace(/\/$/, '');
  const redirectPath = `${cleanProxy}?jpeg=${isJpeg}&bw=${isBw}&l=${level}&url=\\0`;

  // Rule 1: Redirect Images
  // We filter out the proxy itself to prevent infinite loops
  try {
      const proxyHostname = new URL(proxyUrl).hostname;
      const excludedDomains = [...disabledHosts, proxyHostname, 'localhost', '127.0.0.1'];

      const redirectRule = {
        id: 1,
        priority: 1,
        action: {
          type: 'redirect',
          redirect: {
            regexSubstitution: redirectPath
          }
        },
        condition: {
          regexFilter: "^https?://.+$",
          resourceTypes: ["image", "xmlhttprequest"],
          excludedInitiatorDomains: excludedDomains,
          excludedRequestDomains: excludedDomains
        }
      };

      // Rule 2: Patch CSP Headers to allow loading images from proxy
      const cspRule = {
        id: 2,
        priority: 1,
        action: {
          type: 'modifyHeaders',
          responseHeaders: [
            { header: 'content-security-policy', operation: 'set', value: '' }
            // Note: completely clearing CSP is drastic but simplest for 'patchContentSecurity' equivalent
            // A safer approach would be parsing and appending, but DNR static modification is limited.
            // For better security, we should ideally parse and append the proxy host to img-src,
            // but DNR requires static string values or regex replace on headers which is complex for CSP.
            // Removing block-all-mixed-content is also common.
          ]
        },
        condition: {
          resourceTypes: ["main_frame", "sub_frame"]
        }
      };

      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1, 2],
        addRules: [redirectRule] // Adding cspRule is optional/experimental depending on strictness needed
      });

      await updateIcon(true);

  } catch (e) {
    console.error("Invalid Proxy URL", e);
  }
}

async function updateIcon(isEnabled) {
  const iconPath = isEnabled ? "assets/icon-128.png" : "assets/icon-128-disabled.png";
  if (chrome.action) {
    await chrome.action.setIcon({ path: iconPath });
  }
}