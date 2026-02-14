import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter as Router, Route } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import Header from '../components/Header'
import Home from '../components/Home'
import Footer from '../components/Footer'
import parseUrl from '../utils/parseUrl'
import defaults from '../defaults'

interface PopupState {
  enabled: boolean
  statistics: {
    filesProcessed: number
    bytesProcessed: number
    bytesSaved: number
  }
  disabledHosts: string[]
  convertBw: boolean
  compressionLevel: number
  isWebpSupported: boolean
  proxyUrl: string
  colorScheme: 'light' | 'dark'
}

interface PopupProps {
  currentUrl: string
}

class Popup extends React.Component<PopupProps, PopupState> {
  constructor(props: PopupProps) {
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
      proxyUrl: '',
      colorScheme: 'light'
    }
  }

  componentDidMount() {
    chrome.storage.local.get(null, (stored: any) => {
      this.setState({
        enabled: stored.enabled ?? defaults.enabled,
        statistics: stored.statistics ?? defaults.statistics,
        disabledHosts: stored.disabledHosts ?? defaults.disabledHosts,
        convertBw: stored.convertBw ?? defaults.convertBw,
        compressionLevel: stored.compressionLevel ?? defaults.compressionLevel,
        isWebpSupported: stored.isWebpSupported ?? true,
        proxyUrl: stored.proxyUrl ?? defaults.proxyUrl,
        colorScheme: stored.colorScheme ?? 'light'
      })
    })

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

  disabledHostsWasChanged = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value: string = event.target.value;
    const disabledHosts = value.split('\n').filter(host => host.trim() !== '');
    chrome.storage.local.set({ disabledHosts });
    this.setState({ disabledHosts });
  }

  convertBwWasChanged = () => {
    this.setState(prevState => {
      const convertBw = !prevState.convertBw
      chrome.storage.local.set({ convertBw })
      return { convertBw }
    })
  }

  compressionLevelWasChanged = (_: any, { value }: { value: number }) => {
    this.setState(() => {
      chrome.storage.local.set({ compressionLevel: value })
      return { compressionLevel: value }
    })
  }

  handleColorSchemeChange = (newColorScheme: 'light' | 'dark') => {
    chrome.storage.local.set({ colorScheme: newColorScheme })
    this.setState({ colorScheme: newColorScheme })
  }

  stateWasUpdatedFromBackground = (changes: { [key: string]: chrome.storage.StorageChange }) => {
    const changedItems = Object.keys(changes)
    for (const item of changedItems) {
      if (this.state[item as keyof PopupState] !== changes[item].newValue) {
        this.setState({ [item]: changes[item].newValue } as any)
      }
    }
  }

  render() {
    return (
      <MantineProvider 
        defaultColorScheme={this.state.colorScheme}
        theme={{
          colors: {
            brand: ['#e7f5ff', '#d0ebff', '#a5d8ff', '#74c0fc', '#4dabf7', '#339af0', '#228be6', '#1c7ed6', '#1971c2', '#1864ab'],
          },
          primaryColor: 'brand',
        }}
      >
        <Router>
          <div style={{ width: '380px' }}>
            <Header 
              enabled={this.state.enabled} 
              onChange={this.enableSwitchWasChanged}
              onColorSchemeChange={this.handleColorSchemeChange}
            />
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
      </MantineProvider>
    )
  }
}

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentUrl = tabs[0]?.url || ''
  
  const container = document.getElementById('root')
  if (container) {
    const root = createRoot(container)
    root.render(<Popup currentUrl={currentUrl} />)
  }
})
