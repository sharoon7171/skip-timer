// MultiUp Service Worker
console.log('MultiUp service worker loaded');

class MultiUpService {
  // Pattern to detect multiup.php?id={ID} on any domain
  private static readonly MULTIUP_PHP_PATTERN = /\/multiup\.php\?id=([a-zA-Z0-9]+)/;
  
  // Pattern to detect direct MultiUp links like multiup.io/{ID} - any length, including single characters
  private static readonly MULTIUP_DIRECT_PATTERN = /multiup\.io\/([a-zA-Z0-9]+)(?:\/|$)/;
  
  // Base URL for MultiUp redirects
  private static readonly MULTIUP_BASE_URL = 'https://multiup.io/en/mirror';

  /**
   * Check if URL has MultiUp ID and redirect to destination page
   */
  static process(url: string): string | null {
    console.log('MultiUp processing URL:', url);
    
    // Skip if URL is already a mirror destination page
    if (url.includes('/en/mirror/')) {
      console.log('URL is already a mirror destination page, skipping:', url);
      return null;
    }
    
    // Check if URL matches MultiUp PHP pattern (multiup.php?id={ID})
    let match = url.match(this.MULTIUP_PHP_PATTERN);
    
    if (match) {
      const id = match[1];
      console.log('MultiUp PHP pattern detected, ID:', id);
      return `${this.MULTIUP_BASE_URL}/${id}`;
    }
    
    // Check if URL matches direct MultiUp pattern (multiup.io/{ID})
    match = url.match(this.MULTIUP_DIRECT_PATTERN);
    
    if (match) {
      const id = match[1];
      console.log('MultiUp direct pattern detected, ID:', id);
      if (id) {
        console.log('ID length:', id.length);
      }
      console.log('Redirecting to:', `${this.MULTIUP_BASE_URL}/${id}`);
      return `${this.MULTIUP_BASE_URL}/${id}`;
    }
    
    console.log('No MultiUp pattern matched for URL:', url);
    return null;
  }
}

// Use webRequest for instant MultiUp redirection
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    try {
      const url = details.url;
      
      // Check if URL has MultiUp ID and get destination page
      const multiUpUrl = MultiUpService.process(url);
      if (multiUpUrl) {
        console.log('MultiUp ID detected, redirecting from:', url);
        console.log('Redirecting to:', multiUpUrl);
        
        // Add error handling for tab update
        chrome.tabs.update(details.tabId, { url: multiUpUrl }).catch((error) => {
          console.error('Failed to update tab for MultiUp redirect:', error);
        });
      }
    } catch (error) {
      console.error('Error in MultiUp webRequest handler:', error);
    }
  },
  {
    urls: ['<all_urls>'],
    types: ['main_frame']
  }
);