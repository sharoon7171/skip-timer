// HDHub4u Main Domain Instant Redirect Service Worker
console.log('HDHub4u Main Domain Instant Redirect Service Worker loaded');

// Function to get the real final destination from API
async function getFinalDestination(): Promise<string> {
  try {
    // Generate unique hourly seed (same as the original script)
    const d = new Date();
    const uniqueHourlySeed = (d.getFullYear() * 1000000) +
      ((d.getMonth() + 1) * 10000) +
      (d.getDate() * 100) +
      d.getHours() + 1;

    console.log('Generated hourly seed:', uniqueHourlySeed);

    // Fetch the final destination from the API
    const apiUrl = `https://cdn.hub4u.cloud/host/?v=${uniqueHourlySeed}`;
    console.log('API URL:', apiUrl);
    
    const response = await fetch(apiUrl);
    console.log('API response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('API response data:', data);
    
    if (data.c) {
      // Decode the base64 final URL
      const finalUrl = atob(data.c);
      console.log('Final destination decoded:', finalUrl);
      
      // Remove parameters from URL
      const urlWithoutParams = finalUrl.split('?')[0] || finalUrl;
      console.log('Final destination without parameters:', urlWithoutParams);
      return urlWithoutParams;
    }
    
    console.log('No data.c found in response');
    throw new Error('No final destination found in API response');
  } catch (error) {
    console.error('Error fetching final destination:', error);
    throw error;
  }
}

// Instant redirect function to inject - simplified and more robust
function instantRedirect() {
  console.log('HDHub4u Instant Redirect: Starting immediate redirect...');
  
  // Use a more robust approach with proper error handling
  (async () => {
    try {
      const finalUrl = await getFinalDestination();
      console.log('HDHub4u Instant Redirect: Got final destination:', finalUrl);
      
      // Redirect immediately - this happens before any page content loads
      window.location.replace(finalUrl);
      console.log('HDHub4u Instant Redirect: Redirected to:', finalUrl);
    } catch (error) {
      console.error('HDHub4u Instant Redirect: Redirect failed:', error);
    }
  })();
}

// Listen for tab updates to catch HDHub4u domains
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only process when the tab is complete and URL is available
  if (changeInfo.status === 'complete' && tab.url) {
    try {
      const url = new URL(tab.url);
      
      // Check if it's HDHub4u intermediate domain
      if (url.hostname === 'hdhub4u.gs') {
        console.log('HDHub4u domain detected, injecting instant redirect...');
        
        // Inject the redirect script immediately - this runs before any page content
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: instantRedirect
        }).then(() => {
          console.log('HDHub4u instant redirect script injected successfully');
        }).catch((error) => {
          console.error('Failed to inject HDHub4u redirect script:', error);
        });
      }
    } catch (error) {
      console.error('Error in HDHub4u tab update handler:', error);
    }
  }
});

// Also listen for tab creation to catch direct navigation
chrome.tabs.onCreated.addListener((tab) => {
  if (tab.url && tab.id) {
    try {
      const url = new URL(tab.url);
      
      if (url.hostname === 'hdhub4u.gs') {
        console.log('HDHub4u domain detected on tab creation, injecting instant redirect...');
        
        // Wait a tiny bit for the tab to be ready
        setTimeout(() => {
          try {
            if (tab.id) {
              chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: instantRedirect
              }).then(() => {
                console.log('HDHub4u instant redirect script injected on tab creation');
              }).catch((error) => {
                console.error('Failed to inject HDHub4u redirect script on tab creation:', error);
              });
            }
          } catch (error) {
            console.error('Failed to inject HDHub4u redirect script on tab creation:', error);
          }
        }, 100);
      }
    } catch (error) {
      console.error('Error in HDHub4u tab creation handler:', error);
    }
  }
});
