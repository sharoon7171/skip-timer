// Link Redirect Bypass Service Worker
import { MultiUpService } from '../services/multiup-service';

console.log('Link Redirect Bypass service worker loaded');

// Use webRequest for instant redirection (most effective)
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const url = details.url;
    
    // Check if URL has MultiUp ID and get destination page
    const destinationUrl = MultiUpService.process(url);
    
    if (destinationUrl) {
      console.log('MultiUp ID detected, redirecting from:', url);
      console.log('Redirecting to:', destinationUrl);
      
      // Redirect immediately
      chrome.tabs.update(details.tabId, { url: destinationUrl });
    }
  },
  {
    urls: ['<all_urls>'],
    types: ['main_frame']
  }
);
