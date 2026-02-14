import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter as Router, Route } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import Header from '../components/Header.js'
import Home from '../components/Home.js'
import Footer from '../components/Footer.js'
import parseUrl from '../utils/parseUrl.js'
import defaults from '../defaults.js'

class Popup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      enabled: true,
      statistics: {
        filesProcessed: 0,
        bytesProcessed: 0,
        bytesSaved: 0
      },
      disabledHosts: [],
      convertBw: false,
      compressionLevel: 40,
      isWebpSupported: true,
      proxyUrl: ''
    }
  }

  componentDidMount() {
    // Load initial state
    chrome.storage.local.get(null, (stored) => {
      this.setState({
        enabled: stored.enabled ?? defaults.enabled,
        statistics: stored.statistics ?? defaults.statistics,
        disabledHosts: stored.disabledHosts ?? defaults.disabledHosts,
        convertBw: stored.convertBw ?? defaults.convertBw,
        compressionLevel: stored.compressionLevel ?? defaults.compressionLevel,
        isWebpSupported: stored.isWebpSupported ?? true,
        proxyUrl: stored.proxyUrl ?? defaults.proxyUrl
      })
    })

    // Listen for state changes
    chrome.storage.onChanged.addListener(this.stateWasUpdatedFromBackground)
  }

  componentWillUnmount() {
    chrome.storage.onChanged.removeListener(this.stateWasUpdatedFromBackground)
  }

  enableSwitchWasChanged = () => {
    this.setState(prevState => {
      const enabled = !prevState.enabled
      chrome.storage.local.set({ enabled })
      return { enabled }
    })
  }

  siteWasDisabled = () => {
    const { hostname } = parseUrl(this.props.currentUrl)
    this.setState(prevState => {
      const disabledHosts = [...prevState.disabledHosts, hostname]
      chrome.storage.local.set({ disabledHosts })
      return { disabledHosts }
    })
  }

  siteWasEnabled = () => {
    const { hostname } = parseUrl(this.props.currentUrl)
    this.setState(prevState => {
      const disabledHosts = prevState.disabledHosts.filter(site => site !== hostname)
      chrome.storage.local.set({ disabledHosts })
      return { disabledHosts }
    })
  }

  disabledHostsWasChanged = (_, { value }) => {
    this.setState(() => {
      const disabledHosts = value.split('\n')
      chrome.storage.local.set({ disabledHosts })
      return { disabledHosts }
    })
  }

  convertBwWasChanged = () => {
    this.setState(prevState => {
      const convertBw = !prevState.convertBw
      chrome.storage.local.set({ convertBw })
      return { convertBw }
    })
  }

  compressionLevelWasChanged = (_, { value }) => {
    this.setState(() => {
      chrome.storage.local.set({ compressionLevel: value })
      return { compressionLevel: value }
    })
  }

  stateWasUpdatedFromBackground = (changes) => {
    const changedItems = Object.keys(changes)
    for (const item of changedItems) {
      if (this.state[item] !== changes[item].newValue) {
        this.setState({ [item]: changes[item].newValue })
      }
    }
  }

  render() {
    return (
      <Router>
        <div style={{ width: '380px' }}>
          <Header enabled={this.state.enabled} onChange={this.enableSwitchWasChanged} />
          <Route
            exact
            path="/"
            render={() => (
              <Home
                statistics={this.state.statistics}
                disabledHosts={this.state.disabledHosts}
                currentUrl={this.props.currentUrl}
                compressionLevel={this.state.compressionLevel}
                convertBw={this.state.convertBw}
                onSiteDisable={this.siteWasDisabled}
                onSiteEnable={this.siteWasEnabled}
                disabledOnChange={this.disabledHostsWasChanged}
                convertBwOnChange={this.convertBwWasChanged}
                isWebpSupported={this.state.isWebpSupported}
                compressionLevelOnChange={this.compressionLevelWasChanged}
              />
            )}
          />
          <Footer />
        </div>
      </Router>
    )
  }
}

// Initialize popup
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentUrl = tabs[0]?.url || ''
  
  const container = document.getElementById('root')
  if (container) {
    const root = createRoot(container)
    root.render(<Popup currentUrl={currentUrl} />)
  }
})
