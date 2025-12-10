/**
 * Authentication Utilities
 * Handles password hashing, validation, and user authentication
 */

class AuthUtils {
    /**
     * Simple hash function for passwords
     * Note: In production, use a proper hashing library like bcrypt
     */
    static async hashPassword(password) {
        // Simple hash implementation - in production use crypto.subtle.digest
        const encoder = new TextEncoder();
        const data = encoder.encode(password + 'sri_mukkaneshwara_salt');
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Validate password requirements
     */
    static validatePassword(password) {
        if (!password) return { valid: false, message: 'Password is required' };
        if (password.length < 6) return { valid: false, message: 'Password must be at least 6 characters long' };
        return { valid: true, message: 'Password is valid' };
    }

    /**
     * Validate login name
     */
    static validateLoginName(name) {
        if (!name) return { valid: false, message: 'Login name is required' };
        if (name.length < 2) return { valid: false, message: 'Login name must be at least 2 characters long' };
        if (name.length > 50) return { valid: false, message: 'Login name must be less than 50 characters' };
        if (!/^[a-zA-Z0-9_\s]+$/.test(name)) return { valid: false, message: 'Login name can only contain letters, numbers, spaces, and underscores' };
        return { valid: true, message: 'Login name is valid' };
    }

    /**
     * Validate email format
     */
    static validateEmail(email) {
        if (!email) return { valid: true, message: 'Email is optional' }; // Email is optional
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return { valid: false, message: 'Please enter a valid email address' };
        return { valid: true, message: 'Email is valid' };
    }

    /**
     * Generate unique user ID
     */
    static generateUserId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Format date for display
     */
    static formatDate(date) {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Check if user session is valid
     * Prioritizes sessionStorage (current session)
     * Only checks localStorage if sessionStorage is empty AND "Remember Me" was enabled
     * This ensures old sessions without "Remember Me" don't persist
     */
    static isSessionValid() {
        // Check sessionStorage first (current session)
        let userDetails = sessionStorage.getItem('userDetails');
        let fromLocalStorage = false;
        
        // Only check localStorage if sessionStorage is empty AND "Remember Me" was enabled
        // This prevents old sessions (without rememberMe flag) from persisting
        if (!userDetails) {
            // Only use localStorage if it has the "Remember Me" flag
            const hasRememberMe = localStorage.getItem('rememberMe') === 'true';
            if (hasRememberMe) {
                userDetails = localStorage.getItem('userDetails');
                fromLocalStorage = true;
            } else {
                // Clear old localStorage sessions that don't have rememberMe flag
                localStorage.removeItem('userDetails');
                localStorage.removeItem('isAuthenticated');
            }
        }
        
        if (!userDetails) return false;
        
        try {
            const user = JSON.parse(userDetails);
            // More flexible validation - just need name OR email (and status if present should not be 'rejected')
            if (!user) return false;
            if (!user.name && !user.email) return false;
            // If status exists and is 'rejected', invalid session
            if (user.status === 'rejected') return false;
            
            // If we found user in localStorage but not sessionStorage, sync it back to sessionStorage
            // This handles the case where user closed tab and reopened (sessionStorage was cleared)
            // Only sync if localStorage has the "Remember Me" session
            if (fromLocalStorage && user) {
                sessionStorage.setItem('userDetails', userDetails);
                if (!sessionStorage.getItem('lastActivity')) {
                    sessionStorage.setItem('lastActivity', Date.now().toString());
                }
                if (!sessionStorage.getItem('sessionStartTime')) {
                    sessionStorage.setItem('sessionStartTime', Date.now().toString());
                }
                sessionStorage.setItem('isAuthenticated', 'true');
            }
            
            // Session is valid if user has name or email
            return true;
        } catch (e) {
            console.error('Error parsing user details in isSessionValid:', e);
            return false;
        }
    }

    /**
     * Get current user details
     */
    static getCurrentUser() {
        // Check sessionStorage first, then localStorage (for mobile compatibility)
        let userDetails = sessionStorage.getItem('userDetails');
        if (!userDetails) {
            userDetails = localStorage.getItem('userDetails');
        }
        
        if (!userDetails) return null;
        
        try {
            return JSON.parse(userDetails);
        } catch (e) {
            return null;
        }
    }

    /**
     * Set user session
     * @param {Object} user - User object
     * @param {Boolean} rememberMe - If true, store in localStorage (persists across tab closes). If false, only sessionStorage (logout when tab closes).
     */
    static setUserSession(user, rememberMe = false) {
        const userData = JSON.stringify(user);
        
        // Always store in sessionStorage (for current tab session)
        sessionStorage.setItem('userDetails', userData);
        sessionStorage.setItem('lastActivity', Date.now().toString());
        sessionStorage.setItem('sessionStartTime', Date.now().toString());
        sessionStorage.setItem('isAuthenticated', 'true');
        
        // Only store in localStorage if "Remember Me" is enabled
        if (rememberMe) {
            localStorage.setItem('userDetails', userData);
            localStorage.setItem('isAuthenticated', 'true');
            // Add a flag to indicate this is a "Remember Me" session
            localStorage.setItem('rememberMe', 'true');
        } else {
            // Clear localStorage if not remembering (including old sessions)
            localStorage.removeItem('userDetails');
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('rememberMe');
        }
    }

    /**
     * Clear user session
     */
    static clearUserSession() {
        sessionStorage.removeItem('userDetails');
        sessionStorage.removeItem('lastActivity');
        sessionStorage.removeItem('sessionStartTime');
        sessionStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userDetails');
        localStorage.removeItem('isAuthenticated');
    }

    /**
     * Update last activity
     */
    static updateLastActivity() {
        sessionStorage.setItem('lastActivity', Date.now().toString());
    }

    /**
     * Check session timeout
     */
    static checkSessionTimeout() {
        const lastActivity = sessionStorage.getItem('lastActivity');
        const sessionStartTime = sessionStorage.getItem('sessionStartTime');
        
        if (!lastActivity || !sessionStartTime) {
            return false;
        }
        
        const now = Date.now();
        const lastActivityTime = parseInt(lastActivity);
        const sessionStart = parseInt(sessionStartTime);
        
        // Update last activity
        sessionStorage.setItem('lastActivity', now.toString());
        
        // Check for 60 minutes of inactivity
        const inactivityTimeout = 60 * 60 * 1000; // 60 minutes
        if (now - lastActivityTime > inactivityTimeout) {
            return false;
        }
        
        // Check for total session time (24 hours max)
        const totalSessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
        if (now - sessionStart > totalSessionTimeout) {
            return false;
        }
        
        return true;
    }
}

// Make AuthUtils available globally
window.AuthUtils = AuthUtils;



