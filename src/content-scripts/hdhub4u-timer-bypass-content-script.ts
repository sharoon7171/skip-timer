// HDHub4u Timer Bypass Content Script

// TypeScript type definitions
interface StoredData {
  value: string;
  expiry: number;
}

interface DecodedResult {
  o?: string;
  [key: string]: unknown;
}

type StorageKey = string;
type DecodedString = string;

console.log('🚀 Script loaded!');

// Wrap in IIFE to prevent variable conflicts
(function() {
    // String prototype extensions for decoding
    (String.prototype as any).ca = function() {
        return this.replace(/[a-zA-Z]/g, function(character: string) {
            const codePoint = character.charCodeAt(0);
            if (character >= 'a' && character <= 'z') {
                return String.fromCharCode(((codePoint - 97 + 13) % 26) + 97);
            } else if (character >= 'A' && character <= 'Z') {
                return String.fromCharCode(((codePoint - 65 + 13) % 26) + 65);
            }
            return character;
        });
    };

    (String.prototype as any).en = function() {
        return btoa(this.toString());
    };

    (String.prototype as any).de = function() {
        return atob(this.toString());
    };

    // Get stored data with expiry check
    function getStorageData(storageKey: StorageKey): string | null {
        console.log(`📦 Getting localStorage data for key: ${storageKey}`);
        const rawData = window.localStorage.getItem(storageKey);
        if (!rawData) {
            console.log('❌ No data found in localStorage');
            return null;
        }
        
        try {
            const parsedData = JSON.parse(rawData);
            const currentTime = new Date();
            
            if (currentTime.getTime() > parsedData.expiry) {
                console.log('⏰ Data expired, removing...');
                window.localStorage.removeItem(storageKey);
                return null;
            }
            
            console.log('✅ Valid data found');
            return parsedData.value;
        } catch (parseError) {
            console.log('❌ Error parsing localStorage data:', parseError);
            return null;
        }
    }

    // Get final download URL
    function extractFinalUrl(): string | null {
        console.log('🚀 Getting final download URL...');
        const encodedData: string | null = getStorageData('o');

        if (!encodedData) {
            console.log('❌ No valid data found');
            return null;
        }

        try {
            console.log('🔄 Decoding data...');
            const decodedString: DecodedString = (encodedData as any).de().de().ca().de();
            const decodedObject: DecodedResult = JSON.parse(decodedString);
            console.log('📋 Decoded data:', decodedObject);

            if (decodedObject.o) {
                const downloadUrl: string = atob(decodedObject.o);
                console.log('🎯 Final download URL:', downloadUrl);
                return downloadUrl;
            } else {
                console.log('❌ No download URL in decoded data');
                return null;
            }
        } catch (decodeError) {
            console.error('❌ Error during decoding:', decodeError);
            return null;
        }
    }

    // Main execution
    function performRedirect(): void {
        console.log('🔄 Attempting redirect...');
        const targetUrl: string | null = extractFinalUrl();
        
        if (targetUrl) {
            console.log('✅ SUCCESS! Redirecting to:', targetUrl);
            window.location.href = targetUrl;
        } else {
            console.log('❌ Failed to get download URL');
        }
    }

    // Initialize immediately
    console.log('🚀 HDHub4u Timer Bypass Initialized');
    console.log('🌐 Current URL:', window.location.href);

    // Try multiple times with delays
    setTimeout(() => {
        console.log('🕐 First attempt (1s delay)');
        performRedirect();
    }, 1000);

    setTimeout(() => {
        console.log('🕐 Second attempt (3s delay)');
        performRedirect();
    }, 3000);

    setTimeout(() => {
        console.log('🕐 Third attempt (5s delay)');
        performRedirect();
    }, 5000);
})();