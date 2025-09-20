// HDHubList Main Domain Content Script

// TypeScript type definitions
type RedirectUrl = 'https://hdhublist.com/?re=hdhub';

// Main function with TypeScript
(function(): void {
  const currentUrl: string = window.location.href;
  const hasReParam: boolean = currentUrl.includes('re=hdhub');
  const redirectUrl: RedirectUrl = 'https://hdhublist.com/?re=hdhub';

  console.log('✅ HDHubList domain detected (via manifest)');

  // Only redirect if we don't already have the re=hdhub parameter
  if (!hasReParam) {
    console.log('🚀 Adding re=hdhub parameter...');
    window.location.href = redirectUrl;
  } else {
    console.log('❌ Already has re=hdhub parameter, no redirect needed');
  }
})();
