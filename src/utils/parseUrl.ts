export interface ParsedUrl {
  schema: string
  hostname: string
  port: string
  pathname: string
  search: string
  hash: string
}

const parseUrl = (url: string): ParsedUrl => {
  try {
    const parser = new URL(url)
    return {
      schema: parser.protocol,
      hostname: parser.hostname,
      port: parser.port,
      pathname: parser.pathname,
      search: parser.search,
      hash: parser.hash
    }
  } catch (e) {
    console.warn('Invalid URL passed to parseUrl:', url)
    return {
      schema: '',
      hostname: '',
      port: '',
      pathname: '',
      search: '',
      hash: ''
    }
  }
}

export default parseUrl
