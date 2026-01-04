import updateRedirectRules from './background/updateRedirectRules.js';

// Mock chrome API for testing
global.chrome = {
  declarativeNetRequest: {
    updateDynamicRules: jest.fn(() => Promise.resolve())
  },
  action: {
    setIcon: jest.fn()
  }
};

describe('Background Service Worker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create redirect rules when enabled and proxy URL is set', async () => {
    const state = {
      enabled: true,
      proxyUrl: 'https://my-proxy.com',
      convertBw: false,
      compressionLevel: 40,
      isWebpSupported: true,
      disabledHosts: ['example.com']
    };

    await updateRedirectRules(state);

    expect(chrome.declarativeNetRequest.updateDynamicRules).toHaveBeenCalledWith({
      removeRuleIds: [1, 2],
      addRules: expect.arrayContaining([
        expect.objectContaining({
          id: 1,
          action: {
            type: 'redirect',
            redirect: {
              regexSubstitution: 'https://my-proxy.com?jpeg=0&bw=0&l=40&url=\\0'
            }
          }
        })
      ])
    });
  });

  test('should clear rules when disabled', async () => {
    const state = {
      enabled: false,
      proxyUrl: 'https://my-proxy.com',
      convertBw: false,
      compressionLevel: 40,
      isWebpSupported: true,
      disabledHosts: []
    };

    await updateRedirectRules(state);

    expect(chrome.declarativeNetRequest.updateDynamicRules).toHaveBeenCalledWith({
      removeRuleIds: [1, 2],
      addRules: []
    });
    expect(chrome.action.setIcon).toHaveBeenCalledWith({ path: 'assets/icon-128-disabled.png' });
  });

  test('should clear rules when proxy URL is empty', async () => {
    const state = {
      enabled: true,
      proxyUrl: '',
      convertBw: false,
      compressionLevel: 40,
      isWebpSupported: true,
      disabledHosts: []
    };

    await updateRedirectRules(state);

    expect(chrome.declarativeNetRequest.updateDynamicRules).toHaveBeenCalledWith({
      removeRuleIds: [1, 2],
      addRules: []
    });
    expect(chrome.action.setIcon).toHaveBeenCalledWith({ path: 'assets/icon-128-disabled.png' });
  });

  test('should set proper redirect URL when WebP is not supported', async () => {
    const state = {
      enabled: true,
      proxyUrl: 'https://my-proxy.com',
      convertBw: false,
      compressionLevel: 60,
      isWebpSupported: false, // WebP not supported
      disabledHosts: []
    };

    await updateRedirectRules(state);

    expect(chrome.declarativeNetRequest.updateDynamicRules).toHaveBeenCalledWith({
      removeRuleIds: [1, 2],
      addRules: expect.arrayContaining([
        expect.objectContaining({
          action: {
            type: 'redirect',
            redirect: {
              regexSubstitution: 'https://my-proxy.com?jpeg=1&bw=0&l=60&url=\\0' // jpeg=1 because WebP not supported
            }
          }
        })
      ])
    });
  });

  test('should set proper redirect URL when black and white conversion is enabled', async () => {
    const state = {
      enabled: true,
      proxyUrl: 'https://my-proxy.com',
      convertBw: true, // Convert to black and white enabled
      compressionLevel: 60,
      isWebpSupported: true,
      disabledHosts: []
    };

    await updateRedirectRules(state);

    expect(chrome.declarativeNetRequest.updateDynamicRules).toHaveBeenCalledWith({
      removeRuleIds: [1, 2],
      addRules: expect.arrayContaining([
        expect.objectContaining({
          action: {
            type: 'redirect',
            redirect: {
              regexSubstitution: 'https://my-proxy.com?jpeg=0&bw=1&l=60&url=\\0' // bw=1 because conversion enabled
            }
          }
        })
      ])
    });
  });

  test('should exclude disabled hosts from redirection', async () => {
    const state = {
      enabled: true,
      proxyUrl: 'https://my-proxy.com',
      convertBw: false,
      compressionLevel: 40,
      isWebpSupported: true,
      disabledHosts: ['example.com', 'test.com'] // These hosts should be excluded
    };

    await updateRedirectRules(state);

    expect(chrome.declarativeNetRequest.updateDynamicRules).toHaveBeenCalledWith({
      removeRuleIds: [1, 2],
      addRules: expect.arrayContaining([
        expect.objectContaining({
          condition: expect.objectContaining({
            excludedInitiatorDomains: expect.arrayContaining(['example.com', 'test.com', 'my-proxy.com', 'localhost', '127.0.0.1']),
            excludedRequestDomains: expect.arrayContaining(['example.com', 'test.com', 'my-proxy.com', 'localhost', '127.0.0.1'])
          })
        })
      ])
    });
  });
});