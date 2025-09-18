// HDHub4u Intermediate Domain Content Script
console.log('HDHub4u Intermediate Bypass Content Script loaded');

// Only run on hdhub4u.gs domain
if (window.location.hostname === 'hdhub4u.gs') {
  console.log('HDHub4u domain detected, initializing bypass...');

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

// Auto-redirect when page loads
async function autoRedirect() {
  console.log('HDHub4u Intermediate Bypass: Starting auto-redirect...');
  
  try {
    const finalUrl = await getFinalDestination();
    console.log('HDHub4u Intermediate Bypass: Got final destination:', finalUrl);
    
    // Redirect to the final destination
    window.location.href = finalUrl;
    console.log('HDHub4u Intermediate Bypass: Redirected to:', finalUrl);
  } catch (error) {
    console.error('HDHub4u Intermediate Bypass: Auto-redirect failed:', error);
  }
}

  // Run auto-redirect when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoRedirect);
  } else {
    autoRedirect();
  }
}
