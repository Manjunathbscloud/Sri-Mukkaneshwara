// Progressive Web App functionality
class MobilePWA {
    constructor() {
        this.isInstalled = false;
        this.deferredPrompt = null;
        this.init();
    }

    init() {
        this.registerServiceWorker();
        this.setupInstallPrompt();
        this.setupOfflineHandling();
        this.setupUpdateHandling();
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/service-worker.js');
                console.log('PWA: Service Worker registered successfully', registration);
                
                // Handle updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateNotification();
                        }
                    });
                });
                
            } catch (error) {
                console.error('PWA: Service Worker registration failed', error);
            }
        }
    }

    setupInstallPrompt() {
        // Listen for the beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('PWA: Install prompt triggered');
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });

        // Listen for the appinstalled event
        window.addEventListener('appinstalled', () => {
            console.log('PWA: App installed successfully');
            this.isInstalled = true;
            this.hideInstallButton();
            this.showInstallSuccess();
        });

        // Check if app is already installed
        this.checkInstallStatus();
    }

    setupOfflineHandling() {
        // Handle online/offline status
        window.addEventListener('online', () => {
            console.log('PWA: App is online');
            this.showOnlineNotification();
            this.syncOfflineData();
        });

        window.addEventListener('offline', () => {
            console.log('PWA: App is offline');
            this.showOfflineNotification();
        });

        // Check initial connection status
        if (!navigator.onLine) {
            this.showOfflineNotification();
        }
    }

    setupUpdateHandling() {
        // Listen for service worker updates
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                console.log('PWA: Service Worker controller changed');
                window.location.reload();
            });
        }
    }

    checkInstallStatus() {
        // Check if running as PWA
        if (window.matchMedia('(display-mode: standalone)').matches) {
            this.isInstalled = true;
            console.log('PWA: Running as installed app');
        }

        // Check if running in standalone mode on iOS
        if (window.navigator.standalone === true) {
            this.isInstalled = true;
            console.log('PWA: Running as iOS standalone app');
        }
    }

    showInstallButton() {
        // Create install button if it doesn't exist
        if (!document.getElementById('installButton')) {
            const installButton = document.createElement('button');
            installButton.id = 'installButton';
            installButton.className = 'mobile-install-btn';
            installButton.innerHTML = `
                <i class="fas fa-download"></i>
                <span>Install App</span>
            `;
            
            // Add styles
            installButton.style.cssText = `
                position: fixed;
                bottom: 100px;
                left: 20px;
                right: 20px;
                background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
                color: white;
                border: none;
                border-radius: 12px;
                padding: 16px 24px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
                z-index: 1000;
                animation: slideUp 0.3s ease;
            `;

            // Add animation keyframes
            if (!document.getElementById('install-animation-styles')) {
                const style = document.createElement('style');
                style.id = 'install-animation-styles';
                style.textContent = `
                    @keyframes slideUp {
                        from { transform: translateY(100%); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                `;
                document.head.appendChild(style);
            }

            installButton.addEventListener('click', () => this.installApp());
            document.body.appendChild(installButton);
        }
    }

    hideInstallButton() {
        const installButton = document.getElementById('installButton');
        if (installButton) {
            installButton.style.animation = 'slideUp 0.3s ease reverse';
            setTimeout(() => {
                installButton.remove();
            }, 300);
        }
    }

    async installApp() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            console.log('PWA: Install prompt outcome', outcome);
            this.deferredPrompt = null;
        }
    }

    showInstallSuccess() {
        this.showNotification('App installed successfully!', 'success');
    }

    showUpdateNotification() {
        const updateNotification = document.createElement('div');
        updateNotification.className = 'mobile-update-notification';
        updateNotification.innerHTML = `
            <div class="update-content">
                <i class="fas fa-sync-alt"></i>
                <div class="update-text">
                    <h4>Update Available</h4>
                    <p>A new version of the app is available</p>
                </div>
                <button class="update-btn" onclick="window.MobilePWA.updateApp()">
                    Update
                </button>
            </div>
        `;

        updateNotification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            right: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            animation: slideDown 0.3s ease;
        `;

        // Add update notification styles
        if (!document.getElementById('update-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'update-notification-styles';
            style.textContent = `
                .update-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px;
                }
                .update-text h4 {
                    margin: 0 0 4px 0;
                    font-size: 16px;
                    font-weight: 600;
                    color: #1f2937;
                }
                .update-text p {
                    margin: 0;
                    font-size: 14px;
                    color: #6b7280;
                }
                .update-btn {
                    background: #1e40af;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    padding: 8px 16px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    margin-left: auto;
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(updateNotification);

        // Auto remove after 10 seconds
        setTimeout(() => {
            if (updateNotification.parentNode) {
                updateNotification.style.animation = 'slideDown 0.3s ease reverse';
                setTimeout(() => {
                    updateNotification.remove();
                }, 300);
            }
        }, 10000);
    }

    updateApp() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistration().then((registration) => {
                if (registration && registration.waiting) {
                    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                }
            });
        }
    }

    showOnlineNotification() {
        this.showNotification('Connection restored', 'success');
    }

    showOfflineNotification() {
        this.showNotification('You are offline', 'warning');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `mobile-pwa-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 16px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            animation: slideDown 0.3s ease;
        `;

        // Add notification styles
        if (!document.getElementById('pwa-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'pwa-notification-styles';
            style.textContent = `
                @keyframes slideDown {
                    from { transform: translateY(-100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-weight: 500;
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideDown 0.3s ease reverse';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-triangle',
            'warning': 'exclamation-circle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            'success': '#10b981',
            'error': '#ef4444',
            'warning': '#f59e0b',
            'info': '#3b82f6'
        };
        return colors[type] || '#3b82f6';
    }

    async syncOfflineData() {
        // Implement offline data sync logic
        console.log('PWA: Syncing offline data...');
        
        try {
            // Get pending actions from storage
            const pendingActions = this.getPendingActions();
            
            for (const action of pendingActions) {
                try {
                    await this.processOfflineAction(action);
                    this.removePendingAction(action.id);
                } catch (error) {
                    console.error('PWA: Failed to sync action', error);
                }
            }
        } catch (error) {
            console.error('PWA: Offline sync failed', error);
        }
    }

    getPendingActions() {
        // Get pending actions from localStorage or IndexedDB
        const pending = localStorage.getItem('pendingActions');
        return pending ? JSON.parse(pending) : [];
    }

    async processOfflineAction(action) {
        // Process offline action when back online
        console.log('PWA: Processing offline action', action);
        // Implement action processing logic
    }

    removePendingAction(actionId) {
        // Remove processed action
        const pending = this.getPendingActions();
        const updated = pending.filter(action => action.id !== actionId);
        localStorage.setItem('pendingActions', JSON.stringify(updated));
    }

    // Request notification permission
    async requestNotificationPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }
        return false;
    }

    // Show notification
    showPushNotification(title, options = {}) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                icon: '/icons/icon-192x192.png',
                badge: '/icons/badge-72x72.png',
                ...options
            });
        }
    }
}

// Initialize PWA functionality
window.MobilePWA = new MobilePWA();
