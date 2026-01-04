// Setup for Jest tests
import '@testing-library/jest-dom';

// Mock global objects that are available in browser environment
global.chrome = {
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn(),
      onChanged: {
        hasListener: jest.fn(() => false),
        addListener: jest.fn(),
        removeListener: jest.fn(),
      }
    },
    sync: {
      get: jest.fn(),
      set: jest.fn()
    }
  },
  tabs: {
    query: jest.fn(),
    create: jest.fn()
  },
  runtime: {
    onInstalled: {
      addListener: jest.fn()
    },
    onMessage: {
      addListener: jest.fn()
    }
  },
  webRequest: {
    onCompleted: {
      addListener: jest.fn()
    }
  },
  action: {
    setIcon: jest.fn()
  },
  declarativeNetRequest: {
    updateDynamicRules: jest.fn()
  }
};

// Mock document.createElement for parseUrl function
document.createElement = jest.fn((tag) => {
  if (tag === 'a') {
    const element = {
      href: '',
      protocol: '',
      hostname: '',
      port: '',
      pathname: '',
      search: '',
      hash: '',
      setAttribute: jest.fn(),
      getAttribute: jest.fn(),
    };
    
    Object.defineProperty(element, 'href', {
      get: function() {
        return this._href || '';
      },
      set: function(value) {
        this._href = value;
        try {
          const url = new URL(value);
          this.protocol = url.protocol;
          this.hostname = url.hostname;
          this.port = url.port;
          this.pathname = url.pathname;
          this.search = url.search;
          this.hash = url.hash;
        } catch (e) {
          // Handle relative URLs or invalid URLs
          this.protocol = '';
          this.hostname = '';
          this.port = '';
          this.pathname = '';
          this.search = '';
          this.hash = '';
        }
      }
    });
    
    return element;
  }
  return {};
});