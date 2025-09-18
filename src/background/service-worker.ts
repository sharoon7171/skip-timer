// Link Redirect Bypass Service Worker
console.log('Link Redirect Bypass service worker loaded');

// Global error handler to catch any unhandled errors
self.addEventListener('error', (event) => {
  console.error('Service Worker Error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker Unhandled Rejection:', event.reason);
});

// Import all service worker modules
import './multiup-service-worker';
import './hdhublist-main-domain-service-worker';
import './hdhub4u-main-domain-instant-redirect-service-worker';

console.log('All service worker modules loaded successfully');

// All functionality is now imported from separate service workers
