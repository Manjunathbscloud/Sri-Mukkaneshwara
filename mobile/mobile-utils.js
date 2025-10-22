// Mobile Utilities
class MobileUtils {
    constructor() {
        this.init();
    }

    init() {
        this.setupTouchOptimizations();
        this.setupHapticFeedback();
        this.setupOfflineSupport();
    }

    setupTouchOptimizations() {
        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // Optimize touch events
        document.addEventListener('touchstart', (e) => {
            // Add touch feedback
            if (e.target.classList.contains('mobile-login-btn') || 
                e.target.classList.contains('nav-item') ||
                e.target.classList.contains('action-btn')) {
                e.target.style.transform = 'scale(0.95)';
            }
        });

        document.addEventListener('touchend', (e) => {
            // Remove touch feedback
            if (e.target.classList.contains('mobile-login-btn') || 
                e.target.classList.contains('nav-item') ||
                e.target.classList.contains('action-btn')) {
                setTimeout(() => {
                    e.target.style.transform = 'scale(1)';
                }, 150);
            }
        });
    }

    setupHapticFeedback() {
        // Add haptic feedback for supported devices
        if ('vibrate' in navigator) {
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('mobile-login-btn') ||
                    e.target.classList.contains('nav-item') ||
                    e.target.classList.contains('action-btn')) {
                    navigator.vibrate(50);
                }
            });
        }
    }

    setupOfflineSupport() {
        // Handle online/offline status
        window.addEventListener('online', () => {
            this.showNotification('Connection restored', 'success');
        });

        window.addEventListener('offline', () => {
            this.showNotification('You are offline', 'warning');
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `mobile-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add notification styles
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

    // Format currency for mobile display
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    // Format date for mobile display
    formatDate(date) {
        return new Intl.DateTimeFormat('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(new Date(date));
    }

    // Format time for mobile display
    formatTime(date) {
        return new Intl.DateTimeFormat('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(new Date(date));
    }

    // Check if device is mobile
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Check if device supports touch
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    // Get device info
    getDeviceInfo() {
        return {
            isMobile: this.isMobile(),
            isTouch: this.isTouchDevice(),
            userAgent: navigator.userAgent,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight
        };
    }

    // Save data to local storage
    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to storage:', error);
            return false;
        }
    }

    // Load data from local storage
    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading from storage:', error);
            return null;
        }
    }

    // Clear storage
    clearStorage() {
        try {
            localStorage.clear();
            sessionStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }

    // Show loading spinner
    showLoading(message = 'Loading...') {
        const loading = document.createElement('div');
        loading.id = 'mobile-loading';
        loading.innerHTML = `
            <div class="loading-overlay">
                <div class="loading-spinner">
                    <div class="spinner"></div>
                </div>
                <p>${message}</p>
            </div>
        `;

        loading.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;

        document.body.appendChild(loading);
    }

    // Hide loading spinner
    hideLoading() {
        const loading = document.getElementById('mobile-loading');
        if (loading) {
            loading.remove();
        }
    }

    // Show confirmation dialog
    showConfirmation(message, onConfirm, onCancel) {
        const dialog = document.createElement('div');
        dialog.className = 'mobile-confirmation';
        dialog.innerHTML = `
            <div class="confirmation-overlay">
                <div class="confirmation-content">
                    <h3>Confirm</h3>
                    <p>${message}</p>
                    <div class="confirmation-buttons">
                        <button class="btn-cancel">Cancel</button>
                        <button class="btn-confirm">Confirm</button>
                    </div>
                </div>
            </div>
        `;

        dialog.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        document.body.appendChild(dialog);

        // Add event listeners
        dialog.querySelector('.btn-cancel').addEventListener('click', () => {
            dialog.remove();
            if (onCancel) onCancel();
        });

        dialog.querySelector('.btn-confirm').addEventListener('click', () => {
            dialog.remove();
            if (onConfirm) onConfirm();
        });
    }
}

// Initialize mobile utilities
window.MobileUtils = new MobileUtils();
