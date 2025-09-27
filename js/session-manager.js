// Enhanced Session Management System
class SessionManager {
    constructor() {
        this.inactivityTimer = null;
        this.sessionTimer = null;
        this.INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes
        this.SESSION_TIMEOUT = 60 * 60 * 1000; // 60 minutes
        this.init();
    }

    init() {
        // Only apply session management to protected pages
        const protectedPages = [
            'accounts.html', 'loans.html', 'deposits.html', 'members.html', 'meetings.html', 'rules.html',
            'loans-2021.html', 'loans-2022.html', 'loans-2023.html', 'loans-2024.html', 'loans-2025.html',
            'deposits-2021.html', 'deposits-2022.html', 'deposits-2023.html', 'deposits-2024.html', 'deposits-2025.html',
            'loan-application.html', 'loan-status.html', 'loan-applications-admin.html', 'admin-financial.html', 'president-view.html'
        ];
        const currentPage = window.location.pathname.split('/').pop();
        
        // Check if current page is protected
        if (!protectedPages.includes(currentPage)) {
            return; // Don't apply session management to public pages
        }
        
        // Check if user is authenticated
        if (!this.isAuthenticated()) {
            this.redirectToLogin();
            return;
        }

        // Set session start time if not already set
        this.setSessionStartTime();
        
        // Start session management
        this.startInactivityTimer();
        this.startSessionTimeout();
        this.setupEventListeners();
        this.setupWindowCloseHandlers();
    }

    isAuthenticated() {
        const isAuth = (localStorage.getItem('isAuthenticated') === 'true' || 
                       sessionStorage.getItem('isAuthenticated') === 'true');
        
        if (!isAuth) return false;
        
        // Check if user details exist
        const userDetails = localStorage.getItem('userDetails') || sessionStorage.getItem('userDetails');
        if (!userDetails) return false;
        
        try {
            const user = JSON.parse(userDetails);
            // More lenient check - just need basic user info
            return !!(user && (user.id || user.name || user.email));
        } catch (e) {
            return false;
        }
    }

    setSessionStartTime() {
        const sessionStartTime = localStorage.getItem('sessionStartTime');
        if (!sessionStartTime) {
            const currentTime = Date.now().toString();
            localStorage.setItem('sessionStartTime', currentTime);
            sessionStorage.setItem('sessionStartTime', currentTime);
        }
    }

    startInactivityTimer() {
        this.resetInactivityTimer();
    }

    resetInactivityTimer() {
        clearTimeout(this.inactivityTimer);
        this.inactivityTimer = setTimeout(() => {
            this.logout('inactivity');
        }, this.INACTIVITY_TIMEOUT);
    }

    startSessionTimeout() {
        // Check session timeout every minute
        this.sessionTimer = setInterval(() => {
            this.checkSessionTimeout();
        }, 60 * 1000);
    }

    checkSessionTimeout() {
        const sessionStartTime = localStorage.getItem('sessionStartTime');
        if (sessionStartTime) {
            const currentTime = Date.now();
            const sessionDuration = currentTime - parseInt(sessionStartTime);
            
            if (sessionDuration > this.SESSION_TIMEOUT) {
                this.logout('session_timeout');
            }
        }
    }

    setupEventListeners() {
        // Events that reset the inactivity timer
        const events = [
            'mousedown', 'mousemove', 'keypress', 'keydown', 
            'scroll', 'touchstart', 'click', 'visibilitychange'
        ];
        
        events.forEach(event => {
            document.addEventListener(event, () => {
                this.resetInactivityTimer();
            }, true);
        });

        // Handle visibility change (tab switching)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // User switched to another tab or minimized window
                // Continue with normal timeout
            } else {
                // User came back to the tab
                this.resetInactivityTimer();
            }
        });
    }

    setupWindowCloseHandlers() {
        // Handle window close
        window.addEventListener('beforeunload', () => {
            this.clearAllSessionData();
        });
        
        window.addEventListener('unload', () => {
            this.clearAllSessionData();
        });

        // Handle page refresh
        window.addEventListener('pagehide', () => {
            this.clearAllSessionData();
        });
    }

    logout(reason = 'manual') {
        this.clearAllSessionData();
        
        let message = 'You have been logged out. Please login again.';
        
        if (reason === 'inactivity') {
            message = 'You have been logged out due to inactivity (5 minutes). Please login again.';
        } else if (reason === 'session_timeout') {
            message = 'Your session has expired (30 minutes). Please login again.';
        }
        
        // Show logout message
        alert(message);
        
        // Redirect to login page
        this.redirectToLogin();
    }

    clearAllSessionData() {
        // Clear localStorage
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userDetails');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('memberId');
        localStorage.removeItem('userPhone');
        localStorage.removeItem('role');
        localStorage.removeItem('isPresident');
        localStorage.removeItem('sessionStartTime');
        
        // Clear sessionStorage
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('userDetails');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('userName');
        sessionStorage.removeItem('memberId');
        sessionStorage.removeItem('userPhone');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('isPresident');
        sessionStorage.removeItem('sessionStartTime');
    }

    redirectToLogin() {
        // Store current URL for redirect after login
        sessionStorage.setItem('returnUrl', window.location.href);
        window.location.href = 'login.html';
    }

    // Manual logout function
    manualLogout() {
        this.logout('manual');
    }

    // Get remaining session time
    getRemainingSessionTime() {
        const sessionStartTime = localStorage.getItem('sessionStartTime');
        if (!sessionStartTime) return 0;
        
        const currentTime = Date.now();
        const sessionDuration = currentTime - parseInt(sessionStartTime);
        const remaining = this.SESSION_TIMEOUT - sessionDuration;
        
        return Math.max(0, remaining);
    }

    // Get remaining inactivity time
    getRemainingInactivityTime() {
        return this.INACTIVITY_TIMEOUT;
    }
}

// Initialize session manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.SessionManager = new SessionManager();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SessionManager;
}
