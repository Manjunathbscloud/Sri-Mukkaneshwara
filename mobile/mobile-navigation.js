// Mobile Navigation System
class MobileNavigation {
    constructor() {
        this.currentPage = 'dashboard';
        this.navigationHistory = [];
        this.init();
    }

    init() {
        this.setupNavigation();
        this.loadDashboard();
    }

    setupNavigation() {
        // Create mobile navigation structure
        const mainApp = document.getElementById('mainApp');
        if (mainApp) {
            mainApp.innerHTML = this.getNavigationHTML();
            this.setupEventListeners();
        }
    }

    getNavigationHTML() {
        return `
            <!-- Mobile Header -->
            <div class="mobile-header">
                <div class="header-left">
                    <button class="back-btn" id="backBtn" style="display: none;">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <div class="page-title" id="pageTitle">Dashboard</div>
                </div>
                <div class="header-right">
                    <button class="notification-btn" id="notificationBtn">
                        <i class="fas fa-bell"></i>
                        <span class="notification-badge" id="notificationBadge">3</span>
                    </button>
                    <button class="profile-btn" id="profileBtn">
                        <div class="profile-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                    </button>
                </div>
            </div>

            <!-- Main Content Area -->
            <div class="mobile-content" id="mobileContent">
                <!-- Content will be loaded here -->
            </div>

            <!-- Bottom Navigation -->
            <div class="mobile-bottom-nav">
                <button class="nav-item active" data-page="dashboard">
                    <i class="fas fa-home"></i>
                    <span>Home</span>
                </button>
                <button class="nav-item" data-page="accounts">
                    <i class="fas fa-wallet"></i>
                    <span>Accounts</span>
                </button>
                <button class="nav-item" data-page="members">
                    <i class="fas fa-users"></i>
                    <span>Members</span>
                </button>
                <button class="nav-item" data-page="loans">
                    <i class="fas fa-hand-holding-usd"></i>
                    <span>Loans</span>
                </button>
                <button class="nav-item" data-page="more">
                    <i class="fas fa-ellipsis-h"></i>
                    <span>More</span>
                </button>
            </div>

            <!-- Profile Menu (Hidden) -->
            <div class="mobile-profile-menu" id="profileMenu" style="display: none;">
                <div class="profile-menu-content">
                    <div class="profile-info">
                        <div class="profile-avatar-large">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="profile-details">
                            <h3 id="profileName">Loading...</h3>
                            <p id="profileRole">Loading...</p>
                        </div>
                    </div>
                    <div class="profile-menu-items">
                        <button class="menu-item" onclick="window.MobileNavigation.navigateToPage('profile')">
                            <i class="fas fa-user-edit"></i>
                            <span>Edit Profile</span>
                        </button>
                        <button class="menu-item" onclick="window.MobileNavigation.navigateToPage('settings')">
                            <i class="fas fa-cog"></i>
                            <span>Settings</span>
                        </button>
                        <button class="menu-item" onclick="window.MobileNavigation.navigateToPage('help')">
                            <i class="fas fa-question-circle"></i>
                            <span>Help & Support</span>
                        </button>
                        <button class="menu-item logout-btn" onclick="window.MobileAuth.logout()">
                            <i class="fas fa-sign-out-alt"></i>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Bottom navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.navigateToPage(page);
            });
        });

        // Profile button
        const profileBtn = document.getElementById('profileBtn');
        const profileMenu = document.getElementById('profileMenu');
        
        if (profileBtn && profileMenu) {
            profileBtn.addEventListener('click', () => {
                this.toggleProfileMenu();
            });
        }

        // Back button
        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.goBack();
            });
        }

        // Close profile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (profileMenu && !profileMenu.contains(e.target) && !profileBtn.contains(e.target)) {
                profileMenu.style.display = 'none';
            }
        });

        // Update profile info
        this.updateProfileInfo();
    }

    updateProfileInfo() {
        // Use the same user data source as the main website
        const userDetails = window.AuthUtils ? window.AuthUtils.getCurrentUser() : window.MobileAuth.getCurrentUser();
        if (userDetails) {
            const profileName = document.getElementById('profileName');
            const profileRole = document.getElementById('profileRole');
            
            if (profileName) profileName.textContent = userDetails.name;
            if (profileRole) profileRole.textContent = userDetails.role || 'Member';
        }
    }

    toggleProfileMenu() {
        const profileMenu = document.getElementById('profileMenu');
        if (profileMenu) {
            const isVisible = profileMenu.style.display !== 'none';
            profileMenu.style.display = isVisible ? 'none' : 'block';
        }
    }

    navigateToPage(page) {
        // Hide profile menu
        const profileMenu = document.getElementById('profileMenu');
        if (profileMenu) {
            profileMenu.style.display = 'none';
        }

        // Update navigation state
        this.navigationHistory.push(this.currentPage);
        this.currentPage = page;

        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`)?.classList.add('active');

        // Load page content
        this.loadPageContent(page);

        // Update header
        this.updateHeader(page);
    }

    loadPageContent(page) {
        const content = document.getElementById('mobileContent');
        if (!content) return;

        switch (page) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'accounts':
                this.loadAccounts();
                break;
            case 'members':
                this.loadMembers();
                break;
            case 'loans':
                this.loadLoans();
                break;
            case 'more':
                this.loadMore();
                break;
            default:
                this.loadDashboard();
        }
    }

    loadDashboard() {
        const content = document.getElementById('mobileContent');
        if (!content) return;

        content.innerHTML = `
            <div class="mobile-dashboard">
                <!-- Welcome Section -->
                <div class="welcome-section">
                    <div class="welcome-content">
                        <h2>Welcome back!</h2>
                        <p id="welcomeName">Loading...</p>
                    </div>
                    <div class="welcome-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                </div>

                <!-- Quick Stats -->
                <div class="quick-stats">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-wallet"></i>
                        </div>
                        <div class="stat-content">
                            <h3>₹8,52,835</h3>
                            <p>Total Balance</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="stat-content">
                            <h3>8</h3>
                            <p>Active Members</p>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="quick-actions">
                    <h3>Quick Actions</h3>
                    <div class="action-grid">
                        <button class="action-btn" onclick="window.MobileNavigation.navigateToPage('accounts')">
                            <i class="fas fa-wallet"></i>
                            <span>View Accounts</span>
                        </button>
                        <button class="action-btn" onclick="window.MobileNavigation.navigateToPage('loans')">
                            <i class="fas fa-hand-holding-usd"></i>
                            <span>Loans</span>
                        </button>
                        <button class="action-btn" onclick="window.MobileNavigation.navigateToPage('members')">
                            <i class="fas fa-users"></i>
                            <span>Members</span>
                        </button>
                        <button class="action-btn" onclick="window.MobileNavigation.navigateToPage('meetings')">
                            <i class="fas fa-calendar-alt"></i>
                            <span>Meetings</span>
                        </button>
                    </div>
                </div>

                <!-- Recent Activity -->
                <div class="recent-activity">
                    <h3>Recent Activity</h3>
                    <div class="activity-list">
                        <div class="activity-item">
                            <div class="activity-icon">
                                <i class="fas fa-plus-circle"></i>
                            </div>
                            <div class="activity-content">
                                <h4>New Member Added</h4>
                                <p>Appanna Banakar joined the association</p>
                                <span class="activity-time">2 days ago</span>
                            </div>
                        </div>
                        <div class="activity-item">
                            <div class="activity-icon">
                                <i class="fas fa-calendar-check"></i>
                            </div>
                            <div class="activity-content">
                                <h4>5th Year Meeting</h4>
                                <p>Annual meeting completed successfully</p>
                                <span class="activity-time">1 week ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Update welcome name
        const userDetails = window.AuthUtils ? window.AuthUtils.getCurrentUser() : window.MobileAuth.getCurrentUser();
        const welcomeName = document.getElementById('welcomeName');
        if (welcomeName && userDetails) {
            welcomeName.textContent = userDetails.name;
        }
    }

    loadAccounts() {
        const content = document.getElementById('mobileContent');
        if (!content) return;

        content.innerHTML = `
            <div class="mobile-accounts">
                <div class="account-balance">
                    <h3>Account Balance</h3>
                    <div class="balance-card">
                        <div class="balance-amount">₹8,52,835</div>
                        <div class="balance-label">Total Available</div>
                    </div>
                </div>

                <div class="account-details">
                    <h3>Account Information</h3>
                    <div class="info-card">
                        <div class="info-item">
                            <span class="label">Account Name</span>
                            <span class="value">Sri Mukkaneshwara Associates</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Bank</span>
                            <span class="value">ICICI Bank Ltd</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Account Number</span>
                            <span class="value">437601000088</span>
                        </div>
                        <div class="info-item">
                            <span class="label">IFSC Code</span>
                            <span class="value">ICIC0004376</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    loadMembers() {
        const content = document.getElementById('mobileContent');
        if (!content) return;

        content.innerHTML = `
            <div class="mobile-members">
                <div class="members-header">
                    <h3>Active Members</h3>
                    <span class="member-count">8 Members</span>
                </div>

                <div class="members-list">
                    <div class="member-item">
                        <div class="member-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="member-info">
                            <h4>Manjunath Banakar</h4>
                            <p>President • ID: 001</p>
                        </div>
                        <div class="member-status">
                            <span class="status-badge active">Active</span>
                        </div>
                    </div>
                    <div class="member-item">
                        <div class="member-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="member-info">
                            <h4>Pratap Banakar</h4>
                            <p>Vice President • ID: 002</p>
                        </div>
                        <div class="member-status">
                            <span class="status-badge active">Active</span>
                        </div>
                    </div>
                    <div class="member-item">
                        <div class="member-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="member-info">
                            <h4>Appanna Banakar</h4>
                            <p>Member • ID: 008</p>
                        </div>
                        <div class="member-status">
                            <span class="status-badge new">New</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    loadLoans() {
        const content = document.getElementById('mobileContent');
        if (!content) return;

        content.innerHTML = `
            <div class="mobile-loans">
                <div class="loans-summary">
                    <h3>Loan Summary</h3>
                    <div class="summary-card">
                        <div class="summary-item">
                            <span class="label">Total Active Loans</span>
                            <span class="value">₹6,80,000</span>
                        </div>
                        <div class="summary-item">
                            <span class="label">Active Members</span>
                            <span class="value">4</span>
                        </div>
                    </div>
                </div>

                <div class="loans-actions">
                    <button class="action-btn primary">
                        <i class="fas fa-plus"></i>
                        <span>New Loan</span>
                    </button>
                    <button class="action-btn secondary">
                        <i class="fas fa-list"></i>
                        <span>View All Loans</span>
                    </button>
                </div>
            </div>
        `;
    }

    loadMore() {
        const content = document.getElementById('mobileContent');
        if (!content) return;

        content.innerHTML = `
            <div class="mobile-more">
                <div class="more-section">
                    <h3>Account</h3>
                    <div class="menu-list">
                        <button class="menu-item">
                            <i class="fas fa-user-edit"></i>
                            <span>Edit Profile</span>
                            <i class="fas fa-chevron-right"></i>
                        </button>
                        <button class="menu-item">
                            <i class="fas fa-cog"></i>
                            <span>Settings</span>
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>

                <div class="more-section">
                    <h3>Support</h3>
                    <div class="menu-list">
                        <button class="menu-item">
                            <i class="fas fa-question-circle"></i>
                            <span>Help & Support</span>
                            <i class="fas fa-chevron-right"></i>
                        </button>
                        <button class="menu-item">
                            <i class="fas fa-info-circle"></i>
                            <span>About</span>
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>

                <div class="more-section">
                    <button class="logout-btn" onclick="window.MobileAuth.logout()">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        `;
    }

    updateHeader(page) {
        const pageTitle = document.getElementById('pageTitle');
        const backBtn = document.getElementById('backBtn');
        
        if (pageTitle) {
            const titles = {
                'dashboard': 'Dashboard',
                'accounts': 'Accounts',
                'members': 'Members',
                'loans': 'Loans',
                'more': 'More'
            };
            pageTitle.textContent = titles[page] || 'Dashboard';
        }

        if (backBtn) {
            backBtn.style.display = this.navigationHistory.length > 0 ? 'block' : 'none';
        }
    }

    goBack() {
        if (this.navigationHistory.length > 0) {
            const previousPage = this.navigationHistory.pop();
            this.navigateToPage(previousPage);
        }
    }
}

// Initialize mobile navigation
window.MobileNavigation = new MobileNavigation();
