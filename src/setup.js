import React from 'react'
import { createRoot } from 'react-dom/client'
import Setup from './setup/index'
import defaultState from './defaults'
import 'semantic-ui-css/semantic.min.css'
import './index.css'

chrome.storage.local.get(storedState => {
  const initialState = { ...defaultState, ...storedState }

  const container = document.getElementById('root')
  const root = createRoot(container)
  root.render(<Setup {...initialState} />)
})
