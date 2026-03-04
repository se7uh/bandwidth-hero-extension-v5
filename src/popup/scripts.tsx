import React from 'react'
import { createRoot } from 'react-dom/client'
import { Home as HomeIcon, Globe, Settings as SettingsIcon } from 'lucide-react'
import '../index.css'
import Header from '../components/Header'
import Home from '../components/Home'
import Settings from '../components/Settings'
import parseUrl from '../utils/parseUrl'
import defaults from '../defaults'

type ActiveTab = 'home' | 'sites' | 'settings'

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
  activeTab: ActiveTab
}


class Popup extends React.Component<{ currentUrl: string }, PopupState> {
  constructor(props: { currentUrl: string }) {
    super(props)
    this.state = {
      enabled: true,
      statistics: { filesProcessed: 0, bytesProcessed: 0, bytesSaved: 0 },
      disabledHosts: [],
      convertBw: false,
      compressionLevel: 40,
      isWebpSupported: true,
      proxyUrl: '',
      activeTab: 'home',
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

  disabledHostsWasChanged = (value: string) => {
    const disabledHosts = value.split('\n').map(h => h.trim()).filter(host => host !== '')
    chrome.storage.local.set({ disabledHosts })
    this.setState({ disabledHosts })
  }

  convertBwWasChanged = () => {
    this.setState(prevState => {
      const convertBw = !prevState.convertBw
      chrome.storage.local.set({ convertBw })
      return { convertBw }
    })
  }

  compressionLevelWasChanged = (value: number) => {
    chrome.storage.local.set({ compressionLevel: value })
    this.setState({ compressionLevel: value })
  }

  proxyUrlWasChanged = (proxyUrl: string) => {
    chrome.storage.local.set({ proxyUrl })
    this.setState({ proxyUrl })
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
    const { activeTab } = this.state

    return (
      <div style={{ width: '380px', minHeight: '460px', background: 'var(--brut-yellow)', display: 'flex', flexDirection: 'column', border: '3px solid #000', boxShadow: '8px 8px 0 0 #000' }}>
        {/* Header */}
        <Header enabled={this.state.enabled} onChange={this.enableSwitchWasChanged} />

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', background: 'var(--brut-yellow)' }}>
          {activeTab === 'home' && (
            <Home
              view="home"
              statistics={this.state.statistics}
              disabledHosts={this.state.disabledHosts}
              currentUrl={this.props.currentUrl}
              compressionLevel={this.state.compressionLevel}
              convertBw={this.state.convertBw}
              proxyUrl={this.state.proxyUrl}
              onSiteDisable={this.siteWasDisabled}
              onSiteEnable={this.siteWasEnabled}
              compressionLevelOnChange={this.compressionLevelWasChanged}
              convertBwOnChange={this.convertBwWasChanged}
              onConfigureProxy={() => this.setState({ activeTab: 'settings' })}
            />
          )}
          {activeTab === 'sites' && (
            <Home
              view="sites"
              statistics={this.state.statistics}
              disabledHosts={this.state.disabledHosts}
              currentUrl={this.props.currentUrl}
              compressionLevel={this.state.compressionLevel}
              convertBw={this.state.convertBw}
              proxyUrl={this.state.proxyUrl}
              onSiteDisable={this.siteWasDisabled}
              onSiteEnable={this.siteWasEnabled}
              disabledOnChange={this.disabledHostsWasChanged}
              compressionLevelOnChange={this.compressionLevelWasChanged}
              convertBwOnChange={this.convertBwWasChanged}
              onConfigureProxy={() => this.setState({ activeTab: 'settings' })}
            />
          )}
          {activeTab === 'settings' && (
            <Settings
              proxyUrl={this.state.proxyUrl}
              onChange={this.proxyUrlWasChanged}
              onBack={() => this.setState({ activeTab: 'home' })}
            />
          )}
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', borderTop: '3px solid #000', background: 'var(--brut-white)' }}>
          <button onClick={() => this.setState({ activeTab: 'home' })} style={{ flex: 1, padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: 'none', borderRight: '3px solid #000', background: activeTab === 'home' ? 'var(--brut-cyan)' : 'var(--brut-white)', cursor: 'pointer' }}>
            <HomeIcon size={24} strokeWidth={3} />
          </button>
          <button onClick={() => this.setState({ activeTab: 'sites' })} style={{ flex: 1, padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: 'none', borderRight: '3px solid #000', background: activeTab === 'sites' ? 'var(--brut-cyan)' : 'var(--brut-white)', cursor: 'pointer' }}>
            <Globe size={24} strokeWidth={3} />
          </button>
          <button onClick={() => this.setState({ activeTab: 'settings' })} style={{ flex: 1, padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: 'none', background: activeTab === 'settings' ? 'var(--brut-cyan)' : 'var(--brut-white)', cursor: 'pointer' }}>
            <SettingsIcon size={24} strokeWidth={3} />
          </button>
        </div>
      </div>
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
