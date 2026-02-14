// Check extension state before processing
let isEnabled = true
let observer: MutationObserver | null = null

// Load initial state
chrome.storage.local.get(['enabled'], (result) => {
  isEnabled = (result as any).enabled !== false // default to true
  if (isEnabled) {
    init()
  }
})

// Listen for state changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    isEnabled = (changes.enabled.newValue as boolean) ?? true
    if (isEnabled) {
      init()
    } else {
      // Stop processing when disabled
      if (observer) {
        observer.disconnect()
        observer = null
      }
    }
  }
})

// Early image interception to prevent race condition with DNR
const processedImages = new WeakSet<HTMLImageElement>()
const pendingImages = new Map<HTMLImageElement, {
  url: string
  alt: string
  width: number
  height: number
}>()

// File extensions to skip (small files that don't need compression)
const SKIP_EXTENSIONS = /\.(ico|svg|svgz)(\?.*)?$/i

// Check if URL should be processed (not data/blob/relative/small-files)
function isValidImageUrl(url: string): boolean {
  if (!url) return false
  if (url.startsWith('data:')) return false
  if (url.startsWith('blob:')) return false
  if (url.startsWith('javascript:')) return false
  if (url.includes('bh-allow=1')) return false
  // Skip small file types (ico, svg) - compression not worth it
  if (SKIP_EXTENSIONS.test(url)) return false
  return url.startsWith('http://') || url.startsWith('https://')
}

interface CompressImageResponse {
  success: boolean
  dataUri?: string
  reason?: string
  error?: string
}

// Intercept a single image
function interceptImage(img: HTMLImageElement) {
  if (!isEnabled) return
  
  if (processedImages.has(img) || pendingImages.has(img)) {
    return
  }
  
  const originalSrc = img.src
  
  if (!isValidImageUrl(originalSrc)) {
    return
  }
  
  // Store original URL and clear src temporarily
  // This prevents the browser from loading the image
  img.dataset.bhOriginalSrc = originalSrc
  img.removeAttribute('src')
  img.dataset.bhPending = 'true'
  
  pendingImages.set(img, {
    url: originalSrc,
    alt: img.alt,
    width: img.width,
    height: img.height
  })
  
  // Process this image
  processImage(img, originalSrc)
}

// Process image through background script
function processImage(img: HTMLImageElement, originalSrc: string) {
  chrome.runtime.sendMessage(
    {
      action: 'COMPRESS_IMAGE',
      imageUrl: originalSrc,
      pageUrl: window.location.href
    },
    (response: CompressImageResponse) => {
      pendingImages.delete(img)
      
      if (chrome.runtime.lastError) {
        console.error('Bandwidth Hero: Runtime error', chrome.runtime.lastError)
        loadOriginal(img, originalSrc)
        return
      }
      
      if (response && response.success && response.dataUri) {
        // Success: inject compressed data URI
        injectCompressedImage(img, response.dataUri)
      } else {
        // Failed: load original with bypass param
        loadOriginal(img, originalSrc, response?.reason)
      }
    }
  )
}

// Inject compressed image
function injectCompressedImage(img: HTMLImageElement, dataUri: string) {
  processedImages.add(img)
  
  // Remove srcset to prevent loading other versions
  if (img.hasAttribute('srcset')) {
    img.removeAttribute('srcset')
  }
  
  // Set the compressed data URI
  img.src = dataUri
  img.dataset.bhCompressed = 'true'
  img.removeAttribute('data-bh-pending')
  img.removeAttribute('data-bh-original-src')
  
  console.log('Bandwidth Hero: Image compressed', img.alt || '')
}

// Load original image (when compression fails or is skipped)
function loadOriginal(img: HTMLImageElement, originalSrc: string, reason = 'unknown') {
  processedImages.add(img)
  
  // Add bypass param so DNR will allow this request
  const separator = originalSrc.includes('?') ? '&' : '?'
  const bypassUrl = `${originalSrc}${separator}bh-allow=1`
  
  img.src = bypassUrl
  img.dataset.bhOriginal = 'true'
  img.dataset.bhSkipReason = reason
  img.removeAttribute('data-bh-pending')
  img.removeAttribute('data-bh-original-src')
  
  console.log('Bandwidth Hero: Loading original', reason, img.alt || '')
}

// Process all existing images in the document
function processExistingImages() {
  if (!isEnabled) return
  
  const images = document.querySelectorAll<HTMLImageElement>('img[src]')
  images.forEach(interceptImage)
}

// Setup mutation observer for dynamically added images
function setupMutationObserver() {
  observer = new MutationObserver((mutations) => {
    if (!isEnabled) return
    
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement
          if (element.tagName === 'IMG') {
            interceptImage(element as HTMLImageElement)
          } else {
            // Check for images within added nodes
            const images = element.querySelectorAll<HTMLImageElement>('img[src]')
            images.forEach(interceptImage)
          }
        }
      })
      
      // Also watch for src attribute changes
      if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
        const img = mutation.target as HTMLImageElement
        if (img.tagName === 'IMG' && !processedImages.has(img) && !pendingImages.has(img)) {
          interceptImage(img)
        }
      }
    })
  })
  
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src']
  })
}

// Main initialization
function init() {
  if (!isEnabled) return
  
  // Process existing images immediately
  if (document.readyState === 'loading') {
    // DOM is still loading, process what we have
    processExistingImages()
    
    // Process again when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
      processExistingImages()
      setupMutationObserver()
    })
  } else {
    // DOM is already ready
    processExistingImages()
    setupMutationObserver()
  }
}

// Export for TypeScript
export {}
