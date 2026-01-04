/**
 * Functional test for the Bandwidth Hero extension
 * Tests the complete flow from image request to compression
 */

describe('Bandwidth Hero Extension Functional Tests', () => {
  describe('Image compression functionality', () => {
    test('should redirect image requests to proxy when enabled', () => {
      // Mock chrome API
      const mockRules = [];
      global.chrome = {
        declarativeNetRequest: {
          updateDynamicRules: jest.fn((config) => {
            mockRules.push(...config.addRules);
            return Promise.resolve();
          })
        },
        storage: {
          local: {
            get: jest.fn(() => Promise.resolve({
              enabled: true,
              proxyUrl: 'https://test-proxy.com',
              convertBw: false,
              compressionLevel: 40,
              isWebpSupported: true,
              disabledHosts: []
            })),
            set: jest.fn(() => Promise.resolve()),
            onChanged: {
              hasListener: jest.fn(() => false),
              addListener: jest.fn()
            }
          }
        },
        action: {
          setIcon: jest.fn(() => Promise.resolve())
        },
        runtime: {
          onInstalled: {
            addListener: jest.fn()
          }
        }
      };

      // Import and run the background script logic
      const updateRedirectRules = require('./background/updateRedirectRules.js').default;
      
      const state = {
        enabled: true,
        proxyUrl: 'https://test-proxy.com',
        convertBw: false,
        compressionLevel: 40,
        isWebpSupported: true,
        disabledHosts: []
      };

      return updateRedirectRules(state).then(() => {
        // Verify that redirect rules were created properly
        expect(chrome.declarativeNetRequest.updateDynamicRules).toHaveBeenCalledWith(
          expect.objectContaining({
            addRules: expect.arrayContaining([
              expect.objectContaining({
                action: expect.objectContaining({
                  type: 'redirect',
                  redirect: expect.objectContaining({
                    regexSubstitution: 'https://test-proxy.com?jpeg=0&bw=0&l=40&url=\\0'
                  })
                })
              })
            ])
          })
        );
      });
    });

    test('should not redirect image requests when disabled', () => {
      const mockRules = [];
      global.chrome = {
        declarativeNetRequest: {
          updateDynamicRules: jest.fn((config) => {
            mockRules.push(...config.addRules);
            return Promise.resolve();
          })
        },
        storage: {
          local: {
            get: jest.fn(() => Promise.resolve({
              enabled: false,
              proxyUrl: 'https://test-proxy.com',
              convertBw: false,
              compressionLevel: 40,
              isWebpSupported: true,
              disabledHosts: []
            })),
            set: jest.fn(() => Promise.resolve()),
            onChanged: {
              hasListener: jest.fn(() => false),
              addListener: jest.fn()
            }
          }
        },
        action: {
          setIcon: jest.fn(() => Promise.resolve())
        }
      };

      const updateRedirectRules = require('./background/updateRedirectRules.js').default;
      
      const state = {
        enabled: false,
        proxyUrl: 'https://test-proxy.com',
        convertBw: false,
        compressionLevel: 40,
        isWebpSupported: true,
        disabledHosts: []
      };

      return updateRedirectRules(state).then(() => {
        // Verify that no redirect rules were created (only clearing rules)
        expect(chrome.declarativeNetRequest.updateDynamicRules).toHaveBeenCalledWith({
          removeRuleIds: [1, 2],
          addRules: []
        });
      });
    });

    test('should not redirect when proxy URL is empty', () => {
      const mockRules = [];
      global.chrome = {
        declarativeNetRequest: {
          updateDynamicRules: jest.fn((config) => {
            mockRules.push(...config.addRules);
            return Promise.resolve();
          })
        },
        storage: {
          local: {
            get: jest.fn(() => Promise.resolve({
              enabled: true,
              proxyUrl: '',
              convertBw: false,
              compressionLevel: 40,
              isWebpSupported: true,
              disabledHosts: []
            })),
            set: jest.fn(() => Promise.resolve()),
            onChanged: {
              hasListener: jest.fn(() => false),
              addListener: jest.fn()
            }
          }
        },
        action: {
          setIcon: jest.fn(() => Promise.resolve())
        }
      };

      const updateRedirectRules = require('./background/updateRedirectRules.js').default;
      
      const state = {
        enabled: true,
        proxyUrl: '',
        convertBw: false,
        compressionLevel: 40,
        isWebpSupported: true,
        disabledHosts: []
      };

      return updateRedirectRules(state).then(() => {
        // Verify that no redirect rules were created (only clearing rules)
        expect(chrome.declarativeNetRequest.updateDynamicRules).toHaveBeenCalledWith({
          removeRuleIds: [1, 2],
          addRules: []
        });
      });
    });
  });

  describe('Proxy URL construction', () => {
    test('should construct proper proxy URL with WebP support', () => {
      global.chrome = {
        declarativeNetRequest: {
          updateDynamicRules: jest.fn(() => Promise.resolve())
        },
        action: {
          setIcon: jest.fn(() => Promise.resolve())
        }
      };

      const updateRedirectRules = require('./background/updateRedirectRules.js').default;
      
      const state = {
        enabled: true,
        proxyUrl: 'https://my-proxy.com',
        convertBw: false,  // not converting to black and white
        compressionLevel: 60,
        isWebpSupported: true,  // WebP is supported
        disabledHosts: []
      };

      return updateRedirectRules(state).then(() => {
        expect(chrome.declarativeNetRequest.updateDynamicRules).toHaveBeenCalledWith(
          expect.objectContaining({
            addRules: expect.arrayContaining([
              expect.objectContaining({
                action: expect.objectContaining({
                  redirect: expect.objectContaining({
                    // jpeg=0 because WebP is supported, bw=0 because B&W conversion is off
                    regexSubstitution: 'https://my-proxy.com?jpeg=0&bw=0&l=60&url=\\0'
                  })
                })
              })
            ])
          })
        );
      });
    });

    test('should construct proper proxy URL without WebP support', () => {
      global.chrome = {
        declarativeNetRequest: {
          updateDynamicRules: jest.fn(() => Promise.resolve())
        },
        action: {
          setIcon: jest.fn(() => Promise.resolve())
        }
      };

      const updateRedirectRules = require('./background/updateRedirectRules.js').default;
      
      const state = {
        enabled: true,
        proxyUrl: 'https://my-proxy.com',
        convertBw: false,
        compressionLevel: 60,
        isWebpSupported: false,  // WebP not supported
        disabledHosts: []
      };

      return updateRedirectRules(state).then(() => {
        expect(chrome.declarativeNetRequest.updateDynamicRules).toHaveBeenCalledWith(
          expect.objectContaining({
            addRules: expect.arrayContaining([
              expect.objectContaining({
                action: expect.objectContaining({
                  redirect: expect.objectContaining({
                    // jpeg=1 because WebP is not supported
                    regexSubstitution: 'https://my-proxy.com?jpeg=1&bw=0&l=60&url=\\0'
                  })
                })
              })
            ])
          })
        );
      });
    });

    test('should construct proper proxy URL with black and white conversion', () => {
      global.chrome = {
        declarativeNetRequest: {
          updateDynamicRules: jest.fn(() => Promise.resolve())
        },
        action: {
          setIcon: jest.fn(() => Promise.resolve())
        }
      };

      const updateRedirectRules = require('./background/updateRedirectRules.js').default;
      
      const state = {
        enabled: true,
        proxyUrl: 'https://my-proxy.com',
        convertBw: true,  // Converting to black and white
        compressionLevel: 60,
        isWebpSupported: true,
        disabledHosts: []
      };

      return updateRedirectRules(state).then(() => {
        expect(chrome.declarativeNetRequest.updateDynamicRules).toHaveBeenCalledWith(
          expect.objectContaining({
            addRules: expect.arrayContaining([
              expect.objectContaining({
                action: expect.objectContaining({
                  redirect: expect.objectContaining({
                    // bw=1 because black and white conversion is enabled
                    regexSubstitution: 'https://my-proxy.com?jpeg=0&bw=1&l=60&url=\\0'
                  })
                })
              })
            ])
          })
        );
      });
    });
  });
});