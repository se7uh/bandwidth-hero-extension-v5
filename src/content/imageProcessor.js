
const processedImages = new Set();

function processImage(img) {
  if (processedImages.has(img)) return;
  processedImages.add(img);

  const originalSrc = img.src;
  
  if (!originalSrc || originalSrc.startsWith('data:') || originalSrc.startsWith('blob:')) {
    return;
  }

  // If already allowed, don't process again
  if (originalSrc.includes('bh-allow=1')) {
    return;
  }

  chrome.runtime.sendMessage(
    {
      action: 'COMPRESS_IMAGE',
      imageUrl: originalSrc,
      pageUrl: window.location.href
    },
    (response) => {
      if (chrome.runtime.lastError) return;

      if (response && response.success && response.dataUri) {
        if (img.hasAttribute('srcset')) {
          img.removeAttribute('srcset');
        }
        img.src = response.dataUri;
        img.dataset.bhCompressed = 'true';
      } else {
        // Fallback: If not compressed, reload original with bypass param
        const separator = originalSrc.includes('?') ? '&' : '?';
        img.src = `${originalSrc}${separator}bh-allow=1`;
      }
    }
  );
}

function scanImages() {
  const images = document.querySelectorAll('img');
  images.forEach(processImage);
}

// Observe for new images
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === 1) { // ELEMENT_NODE
        if (node.tagName === 'IMG') {
          processImage(node);
        } else {
          // Check children
          const imgs = node.querySelectorAll('img');
          imgs.forEach(processImage);
        }
      }
    });
  });
});

// Start observing
observer.observe(document.body || document.documentElement, {
  childList: true,
  subtree: true
});

// Initial scan
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scanImages);
} else {
  scanImages();
}
