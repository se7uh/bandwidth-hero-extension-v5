// Mock Chrome API for tests
module.exports = {
  storage: {
    local: {
      get: jest.fn(() => Promise.resolve({})),
      set: jest.fn(() => Promise.resolve()),
      onChanged: {
        hasListener: jest.fn(() => false),
        addListener: jest.fn(),
        removeListener: jest.fn(),
      }
    },
    sync: {
      get: jest.fn(() => Promise.resolve({})),
      set: jest.fn(() => Promise.resolve())
    }
  },
  tabs: {
    query: jest.fn(() => Promise.resolve([])),
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
    updateDynamicRules: jest.fn(() => Promise.resolve())
  }
};