// HubCDN Redirect Content Script

// TypeScript type definitions
type LinkParam = string;
type DecodedUrl = string;
type MatchResult = RegExpMatchArray | null;

// Pattern constant with proper typing
const LINK_PATTERN = /\/dl\/\?link=(.+)/;

// Main function with TypeScript
(function(): void {
  const pageUrl: string = window.location.href;

  console.log('✅ HubCDN domain detected (via manifest), processing URL:', pageUrl);

  // Extract link parameter with proper TypeScript
  const extractLinkParameter = (url: string): LinkParam | null => {
    const match: MatchResult = url.match(LINK_PATTERN);

    if (match && match[1]) {
      console.log('🔗 Found link parameter:', match[1]);
      return match[1];
    }

    return null;
  };

  const linkParam: LinkParam | null = extractLinkParameter(pageUrl);

  // Process and redirect if link parameter found
  if (linkParam) {
    try {
      const finalUrl: DecodedUrl = decodeURIComponent(linkParam);
      console.log('🚀 Redirecting to final URL:', finalUrl);
      window.location.href = finalUrl;
    } catch (error) {
      console.log('❌ Error decoding link parameter:', error);
    }
  } else {
    console.log('❌ No HubCDN link parameter found in URL');
  }
})();
