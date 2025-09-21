// HubCDN Redirect Content Script - Simple version
// Only execute if URL contains /dl/

(function(): void {
  const url = window.location.href;

  // Only execute if URL contains /dl/
  if (!url.includes('/dl/')) {
    return;
  }

  console.log('✅ HubCDN /dl/ detected, processing URL:', url);

  // Extract link parameter
  const linkMatch = url.match(/\/dl\/\?link=(.+)/);

  if (linkMatch && linkMatch[1]) {
    try {
      // Decode the real link
      const realLink = decodeURIComponent(linkMatch[1]);
      console.log('🚀 Redirecting to real link:', realLink);

      // Redirect to the real download link
      window.location.href = realLink;
    } catch (error) {
      console.error('❌ Error decoding link:', error);
    }
  } else {
    console.log('❌ No link parameter found');
  }
})();
