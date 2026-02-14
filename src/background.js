import defaultState from './defaults';
import getHeaderIntValue from './background/getHeaderIntValue';
import shouldCompress from './background/shouldCompress';
import createProxyUrl from './utils/createProxyUrl';
import updateRedirectRules from './background/updateRedirectRules';

// In Manifest V3, background scripts are Service Workers.
// We use chrome.declarativeNetRequest to block images early (preventing race condition),
// then inject compressed images via content script.

const STORAGE_KEY_STATS = 'statistics';

async function updateIcon(isEnabled) {
  const iconPath = isEnabled ? "assets/icon-128.png" : "assets/icon-128-disabled.png";
  if (chrome.action) {
    await chrome.action.setIcon({ path: iconPath });
  }
}

// --- Event Listeners ---

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'COMPRESS_IMAGE') {
    handleCompressImage(request, sender).then(sendResponse);
    return true; // Indicates async response
  }
});

async function handleCompressImage(request, sender) {
  try {
    const { imageUrl, pageUrl } = request;
    const stored = await chrome.storage.local.get(null);
    const state = { ...defaultState, ...stored };

    if (!state.enabled || !state.proxyUrl) {
      return { success: false, reason: 'disabled_or_no_proxy' };
    }

    const should = shouldCompress({
      imageUrl,
      pageUrl,
      compressed: new Set(),
      proxyUrl: state.proxyUrl,
      disabledHosts: state.disabledHosts,
      enabled: state.enabled,
      type: 'image'
    });

    if (!should) {
      return { success: false, reason: 'should_not_compress' };
    }

    const proxyUrl = createProxyUrl(
      state.proxyUrl,
      imageUrl,
      state.compressionLevel,
      state.convertBw,
      state.isWebpSupported
    );

    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error(`Proxy returned ${response.status} ${response.statusText}`);
    }

    const blob = await response.blob();

    const dataUri = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    
    return { success: true, dataUri };

  } catch (error) {
    return { success: false, error: error.message };
  }
}


// --- Event Listeners ---

chrome.runtime.onInstalled.addListener(async () => {
  const stored = await chrome.storage.local.get(null);
  const state = { ...defaultState, ...stored };

  // Check WebP support (hardcoded true for modern Chrome/Edge)
  state.isWebpSupported = true;
  await chrome.storage.local.set(state);

  await updateRedirectRules(state);
});

chrome.storage.onChanged.addListener(async (changes, namespace) => {
  if (namespace !== 'local') return;

  const stored = await chrome.storage.local.get(null);
  const state = { ...defaultState, ...stored };

  // If specific keys changed, update rules
  if (changes.proxyUrl || changes.enabled || changes.convertBw || changes.compressionLevel || changes.disabledHosts) {
    await updateRedirectRules(state);
  }
});


