/**
 * Google Apps Script Authentication Integration
 * Handles user registration, login, and management through Google Apps Script
 */

class SheetsAuth {
    constructor() {
        // Google Apps Script Web App URL
        this.webAppUrl = 'https://script.google.com/macros/s/AKfycbzflAFN2vzk3kl2O1hRSE-zrjpF3wLtcr80GnLjGA5ShlPzykqPNOkA_Hiu2n8Ejq6sJQ/exec';
        this.initialized = true;
    }

    /**
     * Initialize the authentication system
     */
    async init() {
        return true; // No initialization needed for Apps Script
    }

    /**
     * Check if user exists by name
     */
    async checkUserExists(name) {
        try {
            const params = new URLSearchParams({
                action: 'checkUserExists',
                name: name
            });

            const response = await fetch(`${this.webAppUrl}?${params}`, {
                method: 'GET',
                mode: 'cors'
            });

            const result = await response.json();
            return result.user || null;
        } catch (error) {
            console.error('Error checking user existence:', error);
            return null;
        }
    }

    /**
     * Create new user
     */
    async createUser(userData) {
        try {
            // Validate input
            const nameValidation = window.AuthUtils.validateLoginName(userData.name);
            if (!nameValidation.valid) {
                return { success: false, message: nameValidation.message };
            }

            const passwordValidation = window.AuthUtils.validatePassword(userData.password);
            if (!passwordValidation.valid) {
                return { success: false, message: passwordValidation.message };
            }

            const emailValidation = window.AuthUtils.validateEmail(userData.email);
            if (!emailValidation.valid) {
                return { success: false, message: emailValidation.message };
            }

            // Check if user already exists
            const existingUser = await this.checkUserExists(userData.name);
            if (existingUser) {
                return { success: false, message: 'This login name is already taken. Please choose another.' };
            }

            // Use GET request with URL parameters to avoid CORS issues
            const params = new URLSearchParams({
                action: 'createUser',
                name: userData.name,
                password: userData.password,
                email: userData.email || ''
            });

            const response = await fetch(`${this.webAppUrl}?${params}`, {
                method: 'GET',
                mode: 'cors'
            });

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error creating user:', error);
            return { success: false, message: 'Failed to create user. Please try again.' };
        }
    }

    /**
     * Authenticate user login
     */
    async authenticateUser(name, password) {
        try {
            const params = new URLSearchParams({
                action: 'authenticateUser',
                name: name,
                password: password
            });

            const response = await fetch(`${this.webAppUrl}?${params}`, {
                method: 'GET',
                mode: 'cors'
            });

            const result = await response.json();
            
            if (result.success && result.user) {
                // Set user session
                window.AuthUtils.setUserSession({
                    id: result.user.id,
                    name: result.user.name,
                    email: result.user.email,
                    status: result.user.status,
                    lastLogin: new Date().toISOString()
                });
            }

            return result;
        } catch (error) {
            console.error('Error authenticating user:', error);
            return { success: false, message: 'Authentication failed. Please try again.' };
        }
    }

    /**
     * Update user's last login time
     */
    async updateLastLogin(userId) {
        try {
            const params = new URLSearchParams({
                action: 'updateLastLogin',
                userId: userId
            });

            const response = await fetch(`${this.webAppUrl}?${params}`, {
                method: 'GET',
                mode: 'cors'
            });

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error updating last login:', error);
        }
    }

    /**
     * Get all pending users for admin approval
     */
    async getPendingUsers() {
        try {
            const params = new URLSearchParams({
                action: 'getPendingUsers'
            });

            const response = await fetch(`${this.webAppUrl}?${params}`, {
                method: 'GET',
                mode: 'cors'
            });

            const result = await response.json();
            return result.users || [];
        } catch (error) {
            console.error('Error fetching pending users:', error);
            return [];
        }
    }

    /**
     * Get all users
     */
    async getAllUsers() {
        try {
            const params = new URLSearchParams({
                action: 'getAllUsers'
            });

            const response = await fetch(`${this.webAppUrl}?${params}`, {
                method: 'GET',
                mode: 'cors'
            });

            const result = await response.json();
            return result.users || [];
        } catch (error) {
            console.error('Error fetching all users:', error);
            return [];
        }
    }

    /**
     * Approve or reject user
     */
    async updateUserStatus(userId, status, approvedBy = 'President') {
        try {
            const params = new URLSearchParams({
                action: 'updateUserStatus',
                userId: userId,
                status: status,
                approvedBy: approvedBy
            });

            const response = await fetch(`${this.webAppUrl}?${params}`, {
                method: 'GET',
                mode: 'cors'
            });

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error updating user status:', error);
            return { success: false, message: 'Failed to update user status' };
        }
    }
}

// Create global instance
window.SheetsAuth = new SheetsAuth();