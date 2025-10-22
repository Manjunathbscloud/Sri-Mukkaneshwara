// Mobile Authentication System
class MobileAuth {
    constructor() {
        this.isAuthenticated = false;
        this.userDetails = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkExistingSession();
    }

    setupEventListeners() {
        const loginForm = document.getElementById('mobileLoginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
    }

    checkExistingSession() {
        // Use the same session validation as the main website
        if (window.AuthUtils && window.AuthUtils.isSessionValid()) {
            this.userDetails = window.AuthUtils.getCurrentUser();
            this.isAuthenticated = true;
            this.showMainApp();
            return;
        }

        // Fallback to mobile-specific session check
        const userDetails = JSON.parse(sessionStorage.getItem('userDetails') || localStorage.getItem('userDetails') || '{}');
        if (userDetails && userDetails.name) {
            this.userDetails = userDetails;
            this.isAuthenticated = true;
            this.showMainApp();
        }
    }

    async handleLogin(event) {
        event.preventDefault();
        
        const username = document.getElementById('mobileUsername').value.trim();
        const password = document.getElementById('mobilePassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        if (!username || !password) {
            this.showError('Please enter both username and password');
            return;
        }

        this.showLoading();

        try {
            // Simulate API call
            await this.authenticateUser(username, password);
            
            // Store session
            this.storeSession(rememberMe);
            
            // Hide loading and show main app
            setTimeout(() => {
                this.hideLoading();
                this.showMainApp();
            }, 1500);

        } catch (error) {
            this.hideLoading();
            this.showError(error.message);
        }
    }

    async authenticateUser(username, password) {
        try {
            // Use the same authentication system as the main website
            if (!window.SheetsAuth) {
                throw new Error('Authentication system not available');
            }

            // Initialize SheetsAuth
            await window.SheetsAuth.init();

            // Authenticate using the same system as the main website
            const result = await window.SheetsAuth.authenticateUser(username, password);

            if (!result.success) {
                throw new Error(result.message || 'Invalid username or password');
            }

            // Store user details in the same format as the main website
            this.userDetails = {
                id: result.user.id,
                name: result.user.name,
                role: result.user.role || 'Member',
                status: result.user.status,
                username: username,
                loginTime: new Date().toISOString()
            };

            this.isAuthenticated = true;
        } catch (error) {
            console.error('Mobile authentication error:', error);
            throw new Error(error.message || 'Authentication failed');
        }
    }

    storeSession(rememberMe) {
        // Use the same session management as the main website
        window.AuthUtils.setUserSession(this.userDetails);
        
        // Also set mobile-specific session data
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('userDetails', JSON.stringify(this.userDetails));
        storage.setItem('isAuthenticated', 'true');
    }

    showLoading() {
        const loadingScreen = document.getElementById('loadingScreen');
        const loginScreen = document.getElementById('loginScreen');
        
        if (loadingScreen && loginScreen) {
            loadingScreen.style.display = 'flex';
            loginScreen.style.display = 'none';
        }
    }

    hideLoading() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }

    showMainApp() {
        const loginScreen = document.getElementById('loginScreen');
        const mainApp = document.getElementById('mainApp');
        
        if (loginScreen && mainApp) {
            loginScreen.style.display = 'none';
            mainApp.style.display = 'block';
            this.loadMainAppContent();
        }
    }

    loadMainAppContent() {
        // Load the main app content
        if (window.MobileNavigation) {
            window.MobileNavigation.loadDashboard();
        }
    }

    showError(message) {
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'mobile-error-notification';
        errorDiv.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add error styles
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 16px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
            z-index: 1000;
            animation: slideDown 0.3s ease;
        `;

        // Add animation keyframes
        if (!document.getElementById('error-animation-styles')) {
            const style = document.createElement('style');
            style.id = 'error-animation-styles';
            style.textContent = `
                @keyframes slideDown {
                    from { transform: translateY(-100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .error-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-weight: 500;
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(errorDiv);

        // Auto remove after 4 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.style.animation = 'slideDown 0.3s ease reverse';
                setTimeout(() => {
                    errorDiv.remove();
                }, 300);
            }
        }, 4000);
    }

    logout() {
        // Use the same session clearing as the main website
        window.AuthUtils.clearUserSession();
        
        // Clear all session data
        sessionStorage.clear();
        localStorage.removeItem('userDetails');
        localStorage.removeItem('isAuthenticated');
        
        // Reset state
        this.isAuthenticated = false;
        this.userDetails = null;
        
        // Show login screen
        this.showLoginScreen();
    }

    showLoginScreen() {
        const loginScreen = document.getElementById('loginScreen');
        const mainApp = document.getElementById('mainApp');
        
        if (loginScreen && mainApp) {
            loginScreen.style.display = 'block';
            mainApp.style.display = 'none';
            
            // Clear form
            document.getElementById('mobileLoginForm').reset();
        }
    }

    getCurrentUser() {
        return this.userDetails;
    }

    isLoggedIn() {
        return this.isAuthenticated;
    }
}

// Initialize mobile authentication
window.MobileAuth = new MobileAuth();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileAuth;
}
