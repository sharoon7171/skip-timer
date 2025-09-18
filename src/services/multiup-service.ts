// MultiUp Service - Simple redirect to destination page
export class MultiUpService {
  // Pattern to detect multiup.php?id={ID} on any domain
  private static readonly MULTIUP_PHP_PATTERN = /\/multiup\.php\?id=([a-f0-9]{32})/;
  
  // Pattern to detect direct MultiUp links like multiup.io/{ID}
  private static readonly MULTIUP_DIRECT_PATTERN = /multiup\.io\/([a-f0-9]{32})(?:\/|$)/;
  
  // Base URL for MultiUp redirects
  private static readonly MULTIUP_BASE_URL = 'https://multiup.io/en/mirror';

  /**
   * Get the regex pattern for declarative net request
   */
  static getRegexPattern(): string {
    return ".*/multiup\\.php\\?id=([a-f0-9]{32}).*";
  }

  /**
   * Get the redirect URL template for declarative net request
   */
  static getRedirectUrl(): string {
    return `${this.MULTIUP_BASE_URL}/\\1`;
  }

  /**
   * Check if URL has MultiUp ID and redirect to destination page
   */
  static process(url: string): string | null {
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
      return `${this.MULTIUP_BASE_URL}/${id}`;
    }
    
    return null;
  }
}
