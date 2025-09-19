// HubCDN Redirect Service Worker
console.log('HubCDN Redirect Service Worker loaded');

class HubCDNService {
  // Pattern to detect HubCDN links
  private static readonly HUBCDN_PATTERN = /hubcdn\.fans\/dl\/\?link=(.+)/;

  /**
   * Check if URL is HubCDN link and extract final URL
   */
  static process(url: string): string | null {
    console.log('HubCDN processing URL:', url);
    
    const match = url.match(this.HUBCDN_PATTERN);
    
    if (match && match[1]) {
      const linkParam = match[1];
      console.log('HubCDN pattern detected, link parameter:', linkParam);
      
      try {
        const finalUrl = decodeURIComponent(linkParam);
        console.log('Redirecting to final URL:', finalUrl);
        return finalUrl;
      } catch (error) {
        console.error('Error decoding HubCDN link parameter:', error);
        return null;
      }
    }
    
    console.log('No HubCDN pattern matched for URL:', url);
    return null;
  }
}

// Use webRequest for instant HubCDN redirection
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    try {
      const url = details.url;
      
      // Check if URL is HubCDN link and get final URL
      const finalUrl = HubCDNService.process(url);
      if (finalUrl) {
        console.log('HubCDN link detected, redirecting from:', url);
        console.log('Redirecting to:', finalUrl);
        
        // Add error handling for tab update
        chrome.tabs.update(details.tabId, { url: finalUrl }).catch((error) => {
          console.error('Failed to update tab for HubCDN redirect:', error);
        });
      }
    } catch (error) {
      console.error('Error in HubCDN webRequest handler:', error);
    }
  },
  {
    urls: ['<all_urls>'],
    types: ['main_frame']
  }
);
