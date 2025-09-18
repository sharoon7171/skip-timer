// HDHubList Auto-Redirect Service Worker
console.log('HDHubList Auto-Redirect Service Worker loaded');

// Use webRequest for instant HDHubList redirection (same as MultiUp)
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    try {
      const url = details.url;
      console.log('HDHubList processing URL:', url);
      
      // Check if it's the main HDHubList domain without redirect parameter
      if (url === 'https://hdhublist.com/' || url === 'https://hdhublist.com') {
        console.log('HDHubList main domain detected, redirecting instantly to re=hdhub...');
        console.log('Redirecting to: https://hdhublist.com/?re=hdhub');
        
        // Add error handling for tab update
        chrome.tabs.update(details.tabId, { url: 'https://hdhublist.com/?re=hdhub' }).catch((error) => {
          console.error('Failed to update tab for HDHubList redirect:', error);
        });
      }
    } catch (error) {
      console.error('Error in HDHubList webRequest handler:', error);
    }
  },
  {
    urls: ['<all_urls>'],
    types: ['main_frame']
  }
);
