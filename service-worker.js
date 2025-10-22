// Service Worker for Sri Mukkanneshwara Associate Mobile App
const CACHE_NAME = 'sma-banking-v1.0.0';
const STATIC_CACHE = 'sma-static-v1.0.0';
const DYNAMIC_CACHE = 'sma-dynamic-v1.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
    '/',
    '/mobile-login.html',
    '/mobile/mobile-styles.css',
    '/mobile/mobile-auth.js',
    '/mobile/mobile-navigation.js',
    '/mobile/mobile-utils.js',
    '/manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Service Worker: Static files cached');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker: Error caching static files', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Handle different types of requests
    if (request.destination === 'document') {
        // Handle HTML pages
        event.respondWith(handleDocumentRequest(request));
    } else if (request.destination === 'style' || request.destination === 'script') {
        // Handle CSS and JS files
        event.respondWith(handleStaticRequest(request));
    } else if (request.destination === 'image') {
        // Handle images
        event.respondWith(handleImageRequest(request));
    } else {
        // Handle other requests
        event.respondWith(handleOtherRequest(request));
    }
});

// Handle document requests (HTML pages)
async function handleDocumentRequest(request) {
    try {
        // Try network first for HTML pages
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Cache successful responses
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
            return networkResponse;
        }
        
        throw new Error('Network response not ok');
    } catch (error) {
        console.log('Service Worker: Network failed, trying cache for', request.url);
        
        // Fallback to cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // If no cache, return offline page
        return caches.match('/mobile-login.html');
    }
}

// Handle static requests (CSS, JS)
async function handleStaticRequest(request) {
    try {
        // Try cache first for static files
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // If not in cache, try network
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Cache the response
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
            return networkResponse;
        }
        
        throw new Error('Network response not ok');
    } catch (error) {
        console.log('Service Worker: Failed to fetch static file', request.url);
        
        // Return a basic response for critical files
        if (request.url.includes('mobile-styles.css')) {
            return new Response('/* Offline fallback styles */', {
                headers: { 'Content-Type': 'text/css' }
            });
        }
        
        if (request.url.includes('mobile-auth.js')) {
            return new Response('// Offline fallback script', {
                headers: { 'Content-Type': 'application/javascript' }
            });
        }
        
        throw error;
    }
}

// Handle image requests
async function handleImageRequest(request) {
    try {
        // Try cache first
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Try network
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Cache the response
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
            return networkResponse;
        }
        
        throw new Error('Network response not ok');
    } catch (error) {
        console.log('Service Worker: Failed to fetch image', request.url);
        
        // Return a placeholder image
        return new Response(
            '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#f3f4f6"/><text x="50" y="50" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="12">Image</text></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
        );
    }
}

// Handle other requests
async function handleOtherRequest(request) {
    try {
        // Try network first
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Cache successful responses
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
            return networkResponse;
        }
        
        throw new Error('Network response not ok');
    } catch (error) {
        console.log('Service Worker: Network failed, trying cache for', request.url);
        
        // Fallback to cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return a basic error response
        return new Response('Offline', { status: 503 });
    }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    console.log('Service Worker: Background sync triggered', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

// Handle background sync
async function doBackgroundSync() {
    try {
        // Get pending actions from IndexedDB
        const pendingActions = await getPendingActions();
        
        for (const action of pendingActions) {
            try {
                await processPendingAction(action);
                await removePendingAction(action.id);
            } catch (error) {
                console.error('Service Worker: Failed to process pending action', error);
            }
        }
    } catch (error) {
        console.error('Service Worker: Background sync failed', error);
    }
}

// Get pending actions from storage
async function getPendingActions() {
    // This would typically use IndexedDB
    // For now, return empty array
    return [];
}

// Process a pending action
async function processPendingAction(action) {
    // Implement action processing logic
    console.log('Service Worker: Processing action', action);
}

// Remove processed action
async function removePendingAction(actionId) {
    // Implement action removal logic
    console.log('Service Worker: Removing action', actionId);
}

// Push notification handling
self.addEventListener('push', (event) => {
    console.log('Service Worker: Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'New notification from SMA Banking',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'View Details',
                icon: '/icons/checkmark.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/icons/xmark.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('SMA Banking', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notification clicked');
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/mobile-login.html')
        );
    }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
    console.log('Service Worker: Message received', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                    return cache.addAll(event.data.urls);
                })
        );
    }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
    console.log('Service Worker: Periodic sync triggered', event.tag);
    
    if (event.tag === 'content-sync') {
        event.waitUntil(doPeriodicSync());
    }
});

// Handle periodic sync
async function doPeriodicSync() {
    try {
        // Sync data in background
        console.log('Service Worker: Performing periodic sync');
        // Implement sync logic here
    } catch (error) {
        console.error('Service Worker: Periodic sync failed', error);
    }
}
