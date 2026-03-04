const createProxyUrl = (
  proxyUrl: string,
  originalUrl: string,
  compressionLevel: number,
  convertBw: boolean,
  isWebpSupported: boolean
): string => {
  const isJpeg = isWebpSupported ? 0 : 1
  const isBw = convertBw ? 1 : 0
  const level = compressionLevel

  // Remove trailing slash if present
  const cleanProxy = proxyUrl.replace(/\/$/, '')

  // We encode the original URL to ensure it travels safely as a query parameter
  return `${cleanProxy}?jpeg=${isJpeg}&bw=${isBw}&l=${level}&url=${encodeURIComponent(
    originalUrl
  )}`
}

export default createProxyUrl
