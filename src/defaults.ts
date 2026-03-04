export interface Statistics {
  filesProcessed: number
  bytesProcessed: number
  bytesSaved: number
}

export interface State {
  enabled: boolean
  statistics: Statistics
  disabledHosts: string[]
  convertBw: boolean
  compressionLevel: number
  proxyUrl: string
  isWebpSupported: boolean
  colorScheme: 'light' | 'dark'
}

const defaultState: State = {
  enabled: true,
  statistics: {
    filesProcessed: 0,
    bytesProcessed: 0,
    bytesSaved: 0
  },
  disabledHosts: [],
  convertBw: false,
  compressionLevel: 40,
  proxyUrl: '',
  isWebpSupported: true,
  colorScheme: 'light'
}

export default defaultState
