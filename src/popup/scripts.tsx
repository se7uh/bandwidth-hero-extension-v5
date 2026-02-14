import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter as Router, Route, Switch as RouterSwitch, withRouter, RouteComponentProps } from 'react-router-dom'
import { MantineProvider, Tabs, Box, Group } from '@mantine/core'
import { IconHome, IconWorld } from '@tabler/icons-react'
import '@mantine/core/styles.css'
import Header from '../components/Header'
import Home from '../components/Home'
import Settings from '../components/Settings'
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

interface PopupProps extends RouteComponentProps {
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

  disabledHostsWasChanged = (value: string) => {
    const disabledHosts = value.split('\n').map(h => h.trim()).filter(host => host !== '');
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

  compressionLevelWasChanged = (value: number) => {
    this.setState(() => {
      chrome.storage.local.set({ compressionLevel: value })
      return { compressionLevel: value }
    })
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
    const { history, location } = this.props;
    const isHome = location.pathname === '/';
    const isSites = location.pathname === '/sites';

    return (
      <MantineProvider forceColorScheme="light" theme={{ primaryColor: 'blue' }}>
        <Box style={{ width: '400px', minHeight: '450px', backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
          <RouterSwitch>
            <Route path="/settings">
              <Settings 
                proxyUrl={this.state.proxyUrl} 
                onChange={this.proxyUrlWasChanged}
                onBack={() => history.push('/')}
              />
            </Route>
            <Route path="*">
              <Box style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box bg="#2b69e3" pt="sm">
                  <Header 
                    enabled={this.state.enabled} 
                    onChange={this.enableSwitchWasChanged}
                    pt="md"
                  />
                  <Tabs 
                    value={isSites ? 'sites' : 'home'} 
                    onChange={(val) => history.push(val === 'home' ? '/' : '/sites')}
                    variant="unstyled"
                    styles={{
                      root: { display: 'flex', flexDirection: 'column' },
                      list: {
                        display: 'flex',
                        padding: '0 12px',
                        backgroundColor: '#2b69e3',
                        borderBottom: 0,
                        gap: '8px',
                        marginTop: '5px',
                      }
                    }}
                  >
                    <Tabs.List grow>
                      <Tabs.Tab 
                        value="home" 
                        style={{
                          flex: 1,
                          backgroundColor: !isSites ? 'white' : 'rgba(0, 0, 0, 0.2)',
                          color: !isSites ? '#2b69e3' : 'white',
                          padding: '8px 24px',
                          fontWeight: 700,
                          fontSize: '14px',
                          borderRadius: '8px 8px 0 0',
                          border: 0,
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginBottom: '-1px',
                        }}
                      >
                        <Group gap={4} align="center" justify="center" style={{ height: '100%' }}>
                          <IconHome size={18} style={{ display: 'block' }} />
                          <span style={{ lineHeight: 1 }}>Home</span>
                        </Group>
                      </Tabs.Tab>
                      <Tabs.Tab 
                        value="sites" 
                        style={{
                          flex: 1,
                          backgroundColor: isSites ? 'white' : 'rgba(0, 0, 0, 0.2)',
                          color: isSites ? '#2b69e3' : 'white',
                          padding: '8px 24px',
                          fontWeight: 700,
                          fontSize: '14px',
                          borderRadius: '8px 8px 0 0',
                          border: 0,
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginBottom: '-1px',
                        }}
                      >
                        <Group gap={4} align="center" justify="center" style={{ height: '100%' }}>
                          <IconWorld size={18} style={{ display: 'block' }} />
                          <span style={{ lineHeight: 1 }}>Sites</span>
                        </Group>
                      </Tabs.Tab>
                    </Tabs.List>
                  </Tabs>
                </Box>

                <Box bg="white" p="xs" style={{ flex: 1 }}>
                  <RouterSwitch>
                    <Route exact path="/">
                      <Home
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
                        onConfigureProxy={() => history.push('/settings')}
                      />
                    </Route>
                    <Route path="/sites">
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
                        onConfigureProxy={() => history.push('/settings')}
                      />
                    </Route>
                  </RouterSwitch>
                </Box>
              </Box>
            </Route>
          </RouterSwitch>
        </Box>
      </MantineProvider>
    )
  }
}

const PopupWithRouter = withRouter(Popup);

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentUrl = tabs[0]?.url || ''
  
  const container = document.getElementById('root')
  if (container) {
    const root = createRoot(container)
    root.render(
      <Router>
        <PopupWithRouter currentUrl={currentUrl} />
      </Router>
    )
  }
})
