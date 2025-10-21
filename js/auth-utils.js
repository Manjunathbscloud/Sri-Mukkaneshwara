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
     */
    static isSessionValid() {
        const userDetails = sessionStorage.getItem('userDetails');
        if (!userDetails) return false;
        
        try {
            const user = JSON.parse(userDetails);
            return !!(user && user.id && user.name && user.status === 'approved');
        } catch (e) {
            return false;
        }
    }

    /**
     * Get current user details
     */
    static getCurrentUser() {
        const userDetails = sessionStorage.getItem('userDetails');
        if (!userDetails) return null;
        
        try {
            return JSON.parse(userDetails);
        } catch (e) {
            return null;
        }
    }

    /**
     * Set user session
     */
    static setUserSession(user) {
        sessionStorage.setItem('userDetails', JSON.stringify(user));
        sessionStorage.setItem('lastActivity', Date.now().toString());
        sessionStorage.setItem('sessionStartTime', Date.now().toString());
    }

    /**
     * Clear user session
     */
    static clearUserSession() {
        sessionStorage.removeItem('userDetails');
        sessionStorage.removeItem('lastActivity');
        sessionStorage.removeItem('sessionStartTime');
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



