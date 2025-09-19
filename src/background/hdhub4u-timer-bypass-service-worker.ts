// Timer Bypass Service Worker
console.log('Timer Bypass Service Worker loaded');

// Timer bypass function to inject - bypasses visibility detection and auto-clicks
function timerBypass() {
  console.log('=== HDHub4u Timer Bypass Test ===');

  // Override visibility detection
  Object.defineProperty(document, 'hidden', {
    get: function() { 
      console.log('🔍 Timer checking if page is hidden - returning FALSE');
      return false; 
    }
  });

  Object.defineProperty(document, 'visibilityState', {
    get: function() { 
      console.log('🔍 Timer checking visibility state - returning VISIBLE');
      return 'visible'; 
    }
  });

  // Block visibility change events
  const originalAddEventListener = document.addEventListener;
  document.addEventListener = function(type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions) {
    if (type === 'visibilitychange') {
      console.log('🚫 BLOCKED visibilitychange event listener');
      return; // Block the event
    }
    if (listener) {
      return originalAddEventListener.call(this, type, listener, options);
    }
  };

  // Start the bypass
  const startBypass = () => {
    const verifyBtn = document.querySelector('#verify_btn') as HTMLElement;
    if (verifyBtn) {
      console.log('🚀 Starting timer bypass...');
      verifyBtn.click();
      
      // Track countdown and auto-open link
      let lastCountdownValue = 10;
      const trackCountdown = setInterval(() => {
        const timerElement = document.querySelector('#timer');
        if (timerElement) {
          const currentValue = parseInt(timerElement.textContent) || 0;
          
          if (currentValue !== lastCountdownValue) {
            console.log(`⏰ COUNTDOWN: ${lastCountdownValue} → ${currentValue}`);
            lastCountdownValue = currentValue;
          }
          
          if (currentValue === 0) {
            const currentBtn = document.querySelector('#verify_btn') as HTMLAnchorElement;
            if (currentBtn && currentBtn.href && currentBtn.href !== 'javascript:void(0)') {
              console.log('🎯 TIMER FINISHED! Opening link in same tab:', currentBtn.href);
              
              // Open in same tab
              window.location.href = currentBtn.href;
              
              clearInterval(trackCountdown);
            }
          }
        }
      }, 100);
    } else {
      console.log('❌ Verify button not found, retrying...');
      setTimeout(startBypass, 500);
    }
  };

  // Start bypass
  startBypass();

  console.log('✅ Timer bypass started! You can switch tabs now - timer will keep running.');
}

// Listen for tab updates to catch timer pages
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const url = new URL(tab.url);
    if (url.hostname === 'inventoryidea.com' || url.hostname === 'taazabull24.com') {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: timerBypass
      });
    }
  }
});
