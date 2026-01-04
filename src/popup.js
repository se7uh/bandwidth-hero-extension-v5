import React from 'react'
import { createRoot } from 'react-dom/client'
import Popup from './popup/index'
import defaultState from './defaults'
import 'semantic-ui-css/semantic.min.css'
import './index.css'

chrome.storage.local.get(storedState => {
  const initialState = { ...defaultState, ...storedState }

  chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
    const activeTab = tabs[0] || { url: '' }
    const container = document.getElementById('root')
    const root = createRoot(container)
    root.render(<Popup currentUrl={activeTab.url} {...initialState} />)
  })
})
