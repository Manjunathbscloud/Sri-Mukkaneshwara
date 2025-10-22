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

        // Update navigation state (don't add dashboard to history)
        if (page !== 'dashboard') {
            this.navigationHistory.push(this.currentPage);
        } else {
            // Clear history when going to dashboard
            this.navigationHistory = [];
        }
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
            case 'deposits':
                this.loadDeposits();
                break;
            case 'meetings':
                this.loadMeetings();
                break;
            case 'rules':
                this.loadRules();
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

                <!-- Association Overview -->
                <div class="association-overview">
                    <div class="overview-header">
                        <h3><i class="fas fa-info-circle"></i> About Our Association</h3>
                    </div>
                    <div class="overview-content">
                        <p>Sri Mukkanneshwara Associate was established in February 2021 with the vision of fostering financial cooperation and mutual growth among its members. Starting with 8 initial members, the association has evolved into a well-structured organization with 8 active members.</p>
                        
                        <div class="association-stats">
                            <div class="stat-item">
                                <i class="fas fa-users"></i>
                                <span>8 Active Members</span>
                            </div>
                            <div class="stat-item">
                                <i class="fas fa-money-bill-wave"></i>
                                <span>₹16,000 Monthly Collection</span>
                            </div>
                            <div class="stat-item">
                                <i class="fas fa-piggy-bank"></i>
                                <span>₹2,000 Per Member</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Current Status -->
                <div class="current-status">
                    <div class="status-header">
                        <h3><i class="fas fa-chart-line"></i> Current Status</h3>
                    </div>
                    <div class="status-content">
                        <p>Currently, in 2024-25, the association has further enhanced its financial structure. The monthly deposit has been increased to ₹2,000 per member, reflecting our growing strength and stability.</p>
                        
                        <div class="recent-updates">
                            <h4><i class="fas fa-calendar-check"></i> Recent Updates</h4>
                            <p>Our 5th year annual meeting was held at Sandur Wonder Valley Resort in October 2025. Key decisions included extending the association to 10 years total (5 more years remaining) and welcoming a new member.</p>
                        </div>
                    </div>
                </div>

                <!-- Banking Details -->
                <div class="banking-details">
                    <div class="banking-header">
                        <h3><i class="fas fa-university"></i> Banking Details</h3>
                    </div>
                    <div class="banking-info">
                        <div class="bank-info-item">
                            <span class="label">Account Name</span>
                            <span class="value">Sri Mukkaneshwara Associates</span>
                        </div>
                        <div class="bank-info-item">
                            <span class="label">Bank</span>
                            <span class="value">ICICI Bank Ltd</span>
                        </div>
                        <div class="bank-info-item">
                            <span class="label">Account No.</span>
                            <span class="value">437601000088</span>
                        </div>
                        <div class="bank-info-item">
                            <span class="label">IFSC Code</span>
                            <span class="value">ICIC0004376</span>
                        </div>
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

                <!-- President Access Button (Only visible to President) -->
                <div class="president-access-section" id="presidentAccessSection" style="display: none;">
                    <button class="president-access-btn" onclick="window.MobileNavigation.showPresidentPanel()">
                        <i class="fas fa-crown"></i>
                        <div class="btn-content">
                            <span class="btn-title">President Access</span>
                            <span class="btn-subtitle">Manage Association Operations</span>
                        </div>
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        `;

        // Update welcome name
        const userDetails = window.AuthUtils ? window.AuthUtils.getCurrentUser() : window.MobileAuth.getCurrentUser();
        const welcomeName = document.getElementById('welcomeName');
        if (welcomeName && userDetails) {
            welcomeName.textContent = userDetails.name;
        }

        // Check President access and show President Access button
        this.checkPresidentAccess();
    }

    loadAccounts() {
        const content = document.getElementById('mobileContent');
        if (!content) return;

        content.innerHTML = `
            <div class="mobile-accounts">
                <div class="account-balance">
                    <h3>Account Balance</h3>
                    <div class="balance-card">
                        <div class="balance-amount" id="mobileBankBalance">Loading...</div>
                        <div class="balance-label">Total Available</div>
                    </div>
                </div>

                <div class="account-loan">
                    <h3>Available Loan</h3>
                    <div class="loan-card">
                        <div class="loan-amount" id="mobileAvailableLoan">Loading...</div>
                        <div class="loan-label">Maximum Loan Amount</div>
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

                <div class="last-updated">
                    <p id="mobileLastUpdated">Last updated: Loading...</p>
                </div>

                <div class="account-actions">
                    <button class="action-btn refresh" onclick="window.MobileNavigation.refreshFinancialData()">
                        <i class="fas fa-sync-alt"></i>
                        <span>Refresh Data</span>
                    </button>
                </div>
            </div>
        `;

        // Load financial data from Google Sheets
        this.loadMobileFinancialData();
        
        // Setup event listeners for financial data updates
        this.setupMobileFinancialDataListeners();
    }

    loadMembers() {
        const content = document.getElementById('mobileContent');
        if (!content) return;

        content.innerHTML = `
            <div class="mobile-members">
                <div class="members-header">
                    <h3>Association Members</h3>
                    <span class="member-count">8 Active Members</span>
                </div>

                <div class="members-list">
                    <div class="member-item president">
                        <div class="member-avatar">
                            <i class="fas fa-crown"></i>
                        </div>
                        <div class="member-info">
                            <h4>Manjunath Banakar</h4>
                            <p class="member-role">President</p>
                            <p class="member-id">Member ID: 001</p>
                        </div>
                        <button class="contact-btn" onclick="window.MobileNavigation.showContact('+919591382942')">
                            <i class="fas fa-phone"></i>
                        </button>
                    </div>

                    <div class="member-item vice-president">
                        <div class="member-avatar">
                            <i class="fas fa-star"></i>
                        </div>
                        <div class="member-info">
                            <h4>Pratap Banakar</h4>
                            <p class="member-role">Vice President</p>
                            <p class="member-id">Member ID: 002</p>
                        </div>
                        <button class="contact-btn" onclick="window.MobileNavigation.showContact('+917259907409')">
                            <i class="fas fa-phone"></i>
                        </button>
                    </div>

                    <div class="member-item">
                        <div class="member-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="member-info">
                            <h4>Sarpabhushana Banakar</h4>
                            <p class="member-role">Member</p>
                            <p class="member-id">Member ID: 003</p>
                        </div>
                        <button class="contact-btn" onclick="window.MobileNavigation.showContact('+919740373454')">
                            <i class="fas fa-phone"></i>
                        </button>
                    </div>

                    <div class="member-item">
                        <div class="member-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="member-info">
                            <h4>Mukkanna Banakar</h4>
                            <p class="member-role">Member</p>
                            <p class="member-id">Member ID: 004</p>
                        </div>
                        <button class="contact-btn" onclick="window.MobileNavigation.showContact('+918618600807')">
                            <i class="fas fa-phone"></i>
                        </button>
                    </div>

                    <div class="member-item">
                        <div class="member-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="member-info">
                            <h4>Santosh Banakar</h4>
                            <p class="member-role">Member</p>
                            <p class="member-id">Member ID: 005</p>
                        </div>
                        <button class="contact-btn" onclick="window.MobileNavigation.showContact('+919739678816')">
                            <i class="fas fa-phone"></i>
                        </button>
                    </div>

                    <div class="member-item">
                        <div class="member-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="member-info">
                            <h4>Pradeep Banakar</h4>
                            <p class="member-role">Member</p>
                            <p class="member-id">Member ID: 006</p>
                        </div>
                        <button class="contact-btn" onclick="window.MobileNavigation.showContact('+919663644751')">
                            <i class="fas fa-phone"></i>
                        </button>
                    </div>

                    <div class="member-item">
                        <div class="member-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="member-info">
                            <h4>Praveen Banakar</h4>
                            <p class="member-role">Member</p>
                            <p class="member-id">Member ID: 007</p>
                        </div>
                        <button class="contact-btn" onclick="window.MobileNavigation.showContact('+919538913204')">
                            <i class="fas fa-phone"></i>
                        </button>
                    </div>

                    <div class="member-item new-member">
                        <div class="member-avatar">
                            <i class="fas fa-user-plus"></i>
                        </div>
                        <div class="member-info">
                            <h4>Appanna Banakar</h4>
                            <p class="member-role">Member</p>
                            <p class="member-id">Member ID: 008</p>
                            <p class="member-joined">Joined: 2025</p>
                        </div>
                        <button class="contact-btn" onclick="window.MobileNavigation.showContact('+91XXXXXXXXXX')">
                            <i class="fas fa-phone"></i>
                        </button>
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
                    <button class="action-btn primary" onclick="window.MobileNavigation.showLoanApplication()">
                        <i class="fas fa-plus"></i>
                        <span>New Loan Application</span>
                    </button>
                    <button class="action-btn secondary" onclick="window.MobileNavigation.showApplicationStatus()">
                        <i class="fas fa-clipboard-check"></i>
                        <span>My Application Status</span>
                    </button>
                </div>

                <!-- Loan Application Form (Hidden by default) -->
                <div class="loan-application-form" id="loanApplicationForm" style="display: none;">
                    <div class="form-header">
                        <h3><i class="fas fa-hand-holding-usd"></i> Loan Application</h3>
                        <button class="close-btn" onclick="window.MobileNavigation.hideLoanApplication()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <form id="mobileLoanForm">
                        <div class="form-group">
                            <label for="loanName">Name:</label>
                            <input type="text" id="loanName" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="loanEmail">Email:</label>
                            <input type="email" id="loanEmail" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="loanPhone">Phone:</label>
                            <input type="tel" id="loanPhone" name="phone" required>
                        </div>
                        <div class="form-group">
                            <label for="loanAmount">Loan Amount (₹):</label>
                            <input type="number" id="loanAmount" name="loan_amount" required>
                        </div>
                        <div class="form-group">
                            <label for="loanReason">Reason for Loan:</label>
                            <textarea id="loanReason" name="loan_reason" required></textarea>
                        </div>
                        <button type="submit" class="submit-btn" id="loanSubmitBtn">
                            <span id="loanBtnText">Submit Application</span>
                            <div id="loanBtnLoader" style="display: none;">
                                <i class="fas fa-spinner fa-spin"></i>
                            </div>
                        </button>
                        <div class="success-message" id="loanSuccessMsg" style="display: none;">
                            ✅ Your application has been submitted successfully!
                        </div>
                    </form>
                </div>

                <!-- Review Applications Section (Hidden by default) -->
                <div class="review-applications" id="reviewApplications" style="display: none;">
                    <div class="review-header">
                        <h3><i class="fas fa-clipboard-check"></i> Review Applications</h3>
                        <button class="close-btn" onclick="window.MobileNavigation.hideReviewApplications()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="applications-list" id="applicationsList">
                        <div class="no-applications">
                            <i class="fas fa-inbox"></i>
                            <p>No applications to review yet</p>
                        </div>
                    </div>
                </div>

                <!-- Admin Panel (Hidden by default) -->
                <div class="admin-panel" id="adminPanel" style="display: none;">
                    <div class="admin-header">
                        <h3><i class="fas fa-cog"></i> Admin Panel</h3>
                        <button class="close-btn" onclick="window.MobileNavigation.hideAdminPanel()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="admin-sections">
                        <!-- Financial Management -->
                        <div class="admin-section">
                            <h4><i class="fas fa-chart-line"></i> Financial Management</h4>
                            <div class="admin-actions">
                                <button class="admin-btn" onclick="window.MobileNavigation.showFinancialUpdate()">
                                    <i class="fas fa-edit"></i>
                                    <span>Update Financial Data</span>
                                </button>
                                <button class="admin-btn" onclick="window.MobileNavigation.showFinancialReports()">
                                    <i class="fas fa-chart-bar"></i>
                                    <span>Financial Reports</span>
                                </button>
                            </div>
                        </div>

                        <!-- Member Management -->
                        <div class="admin-section">
                            <h4><i class="fas fa-users"></i> Member Management</h4>
                            <div class="admin-actions">
                                <button class="admin-btn" onclick="window.MobileNavigation.showMemberApproval()">
                                    <i class="fas fa-user-check"></i>
                                    <span>Approve New Members</span>
                                </button>
                                <button class="admin-btn" onclick="window.MobileNavigation.showMemberManagement()">
                                    <i class="fas fa-user-cog"></i>
                                    <span>Manage Members</span>
                                </button>
                            </div>
                        </div>

                        <!-- Loan Management -->
                        <div class="admin-section">
                            <h4><i class="fas fa-credit-card"></i> Loan Management</h4>
                            <div class="admin-actions">
                                <button class="admin-btn" onclick="window.MobileNavigation.showReviewApplications()">
                                    <i class="fas fa-clipboard-check"></i>
                                    <span>Review Applications</span>
                                </button>
                                <button class="admin-btn" onclick="window.MobileNavigation.showLoanApproval()">
                                    <i class="fas fa-hand-holding-usd"></i>
                                    <span>Approve Loans</span>
                                </button>
                                <button class="admin-btn" onclick="window.MobileNavigation.showLoanReports()">
                                    <i class="fas fa-file-invoice"></i>
                                    <span>Loan Reports</span>
                                </button>
                            </div>
                        </div>

                        <!-- Meeting Management -->
                        <div class="admin-section">
                            <h4><i class="fas fa-calendar-alt"></i> Meeting Management</h4>
                            <div class="admin-actions">
                                <button class="admin-btn" onclick="window.MobileNavigation.showMeetingScheduler()">
                                    <i class="fas fa-calendar-plus"></i>
                                    <span>Schedule Meeting</span>
                                </button>
                                <button class="admin-btn" onclick="window.MobileNavigation.showMeetingMinutes()">
                                    <i class="fas fa-file-alt"></i>
                                    <span>Meeting Minutes</span>
                                </button>
                            </div>
                        </div>

                        <!-- System Settings -->
                        <div class="admin-section">
                            <h4><i class="fas fa-cogs"></i> System Settings</h4>
                            <div class="admin-actions">
                                <button class="admin-btn" onclick="window.MobileNavigation.showSystemSettings()">
                                    <i class="fas fa-sliders-h"></i>
                                    <span>System Settings</span>
                                </button>
                                <button class="admin-btn" onclick="window.MobileNavigation.showBackupRestore()">
                                    <i class="fas fa-database"></i>
                                    <span>Backup & Restore</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Auto-fill user details in loan form
        this.autoFillLoanForm();
        
        // Admin access check removed - consolidated into President Access button
    }

    loadDeposits() {
        const content = document.getElementById('mobileContent');
        if (!content) return;

        content.innerHTML = `
            <div class="mobile-deposits">
                <div class="deposits-header">
                    <div class="balance-card">
                        <h3>Current Bank Balance</h3>
                        <div class="balance-amount">₹8,52,835</div>
                        <p>Total Balance for 8 Members</p>
                        <div class="balance-breakdown">
                            <div class="breakdown-item">
                                <span>Principal Amount</span>
                                <span>₹6,94,500</span>
                            </div>
                            <div class="breakdown-item">
                                <span>Interest Earned</span>
                                <span>₹2,48,650</span>
                            </div>
                            <div class="breakdown-item">
                                <span>Total Expenditure</span>
                                <span>₹90,315</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="deposits-content">
                    <div class="section-header">
                        <h3>Account Balance Summary (2021-2025)</h3>
                        <div class="year-selector">
                            <select id="depositYear" onchange="window.MobileNavigation.filterDeposits()">
                                <option value="all" selected>All Years</option>
                                <option value="2021">2021</option>
                                <option value="2022">2022</option>
                                <option value="2023">2023</option>
                                <option value="2024">2024</option>
                                <option value="2025">2025</option>
                            </select>
                        </div>
                    </div>

                    <div class="deposits-list" id="depositsList">
                        <div class="deposit-item" data-year="2021">
                            <div class="deposit-info">
                                <h4>2021 - 1st Year</h4>
                                <p>Principal: ₹1,11,000</p>
                                <p>Interest: ₹8,700</p>
                                <p>Expenditure: ₹5,600</p>
                            </div>
                            <div class="deposit-amount">₹1,14,100</div>
                        </div>
                        
                        <div class="deposit-item" data-year="2022">
                            <div class="deposit-info">
                                <h4>2022 - 2nd Year</h4>
                                <p>Principal: ₹1,49,000</p>
                                <p>Interest: ₹33,600</p>
                                <p>Expenditure: ₹13,000</p>
                            </div>
                            <div class="deposit-amount">₹1,69,600</div>
                        </div>
                        
                        <div class="deposit-item" data-year="2023">
                            <div class="deposit-info">
                                <h4>2023 - 3rd Year</h4>
                                <p>Principal: ₹1,59,500</p>
                                <p>Interest: ₹45,700</p>
                                <p>Expenditure: ₹17,750</p>
                            </div>
                            <div class="deposit-amount">₹1,87,450</div>
                        </div>
                        
                        <div class="deposit-item" data-year="2024">
                            <div class="deposit-info">
                                <h4>2024 - 4th Year</h4>
                                <p>Principal: ₹1,26,000</p>
                                <p>Interest: ₹57,300</p>
                                <p>Expenditure: ₹33,385</p>
                            </div>
                            <div class="deposit-amount">₹1,49,915</div>
                        </div>
                        
                        <div class="deposit-item" data-year="2025">
                            <div class="deposit-info">
                                <h4>2025 - 5th Year</h4>
                                <p>Principal: ₹1,49,000</p>
                                <p>Interest: ₹1,03,350</p>
                                <p>Expenditure: ₹20,580</p>
                            </div>
                            <div class="deposit-amount">₹2,31,770</div>
                        </div>
                    </div>

                    <div class="deposits-summary">
                        <div class="summary-item">
                            <span>Total Principal Amount</span>
                            <span>₹6,94,500</span>
                        </div>
                        <div class="summary-item">
                            <span>Total Interest Earned</span>
                            <span>₹2,48,650</span>
                        </div>
                        <div class="summary-item">
                            <span>Total Expenditure</span>
                            <span>₹90,315</span>
                        </div>
                        <div class="summary-item total">
                            <span>Total Balance (2021-2025)</span>
                            <span>₹8,52,835</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    loadMeetings() {
        const content = document.getElementById('mobileContent');
        if (!content) return;

        content.innerHTML = `
            <div class="mobile-meetings">
                <div class="meetings-header">
                    <h3>Association Meetings</h3>
                    <p>Annual meetings and important decisions</p>
                </div>

                <div class="meetings-content">
                    <div class="meeting-card featured">
                        <div class="meeting-header">
                            <h4>5th Year Annual Meeting</h4>
                            <span class="meeting-status completed">Completed</span>
                        </div>
                        <div class="meeting-details">
                            <p><i class="fas fa-calendar"></i> October 2025</p>
                            <p><i class="fas fa-map-marker-alt"></i> Sandur Wonder Valley Resort</p>
                            <p><i class="fas fa-users"></i> All 7 Members Present</p>
                        </div>
                        <div class="meeting-decisions">
                            <h5>Key Decisions:</h5>
                            <ul>
                                <li>Association extended to 10 years total</li>
                                <li>Per member share value: ₹1,21,833.57</li>
                                <li>New member added with ₹1,34,016.93</li>
                                <li>Special interest-free loan of ₹70,000</li>
                            </ul>
                        </div>
                        <button class="view-details-btn" onclick="window.open('meeting-2025.html', '_blank')">
                            View Full Details
                        </button>
                    </div>

                    <div class="meeting-card">
                        <div class="meeting-header">
                            <h4>4th Year Annual Meeting</h4>
                            <span class="meeting-status completed">Completed</span>
                        </div>
                        <div class="meeting-details">
                            <p><i class="fas fa-calendar"></i> October 2024</p>
                            <p><i class="fas fa-users"></i> All 7 Members Present</p>
                        </div>
                    </div>

                    <div class="meeting-card">
                        <div class="meeting-header">
                            <h4>3rd Year Annual Meeting</h4>
                            <span class="meeting-status completed">Completed</span>
                        </div>
                        <div class="meeting-details">
                            <p><i class="fas fa-calendar"></i> October 2023</p>
                            <p><i class="fas fa-users"></i> All 7 Members Present</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    loadRules() {
        const content = document.getElementById('mobileContent');
        if (!content) return;

        content.innerHTML = `
            <div class="mobile-rules">
                <div class="rules-header">
                    <h3>Rules & Regulations</h3>
                    <p>Association guidelines and policies</p>
                </div>

                <div class="rules-content">
                    <div class="rules-section">
                        <h4>General Rules</h4>
                        <div class="rules-list">
                            <div class="rule-item">
                                <i class="fas fa-check-circle"></i>
                                <span>Monthly deposits are mandatory for all members</span>
                            </div>
                            <div class="rule-item">
                                <i class="fas fa-check-circle"></i>
                                <span>All decisions require majority vote</span>
                            </div>
                            <div class="rule-item">
                                <i class="fas fa-check-circle"></i>
                                <span>Annual meetings are mandatory</span>
                            </div>
                        </div>
                    </div>

                    <div class="rules-section">
                        <h4>Financial Rules</h4>
                        <div class="rules-list">
                            <div class="rule-item">
                                <i class="fas fa-check-circle"></i>
                                <span>Monthly deposit: ₹2,000 per member</span>
                            </div>
                            <div class="rule-item">
                                <i class="fas fa-check-circle"></i>
                                <span>Interest rate: 12% per annum</span>
                            </div>
                            <div class="rule-item">
                                <i class="fas fa-check-circle"></i>
                                <span>Loan interest: 15% per annum</span>
                            </div>
                        </div>
                    </div>

                    <div class="rules-section">
                        <h4>New Member Rules</h4>
                        <div class="rules-list">
                            <div class="rule-item">
                                <i class="fas fa-check-circle"></i>
                                <span>New members pay current share + 10% additional</span>
                            </div>
                            <div class="rule-item">
                                <i class="fas fa-check-circle"></i>
                                <span>Payment options: Full payment or 18-month EMI</span>
                            </div>
                            <div class="rule-item">
                                <i class="fas fa-check-circle"></i>
                                <span>President approval required for new members</span>
                            </div>
                        </div>
                    </div>

                    <div class="rules-footer">
                        <p><strong>Last Updated:</strong> October 2025 (After 5th Year Annual Meeting)</p>
                        <button class="view-full-rules-btn" onclick="window.open('rules.html', '_blank')">
                            View Full Rules
                        </button>
                    </div>
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
                    <h3>Financial Services</h3>
                    <div class="menu-list">
                        <button class="menu-item" onclick="window.MobileNavigation.navigateToPage('deposits')">
                            <i class="fas fa-piggy-bank"></i>
                            <span>Deposits</span>
                            <i class="fas fa-chevron-right"></i>
                        </button>
                        <button class="menu-item" onclick="window.MobileNavigation.navigateToPage('loans')">
                            <i class="fas fa-credit-card"></i>
                            <span>Loans</span>
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>

                <div class="more-section">
                    <h3>Association</h3>
                    <div class="menu-list">
                        <button class="menu-item" onclick="window.MobileNavigation.navigateToPage('meetings')">
                            <i class="fas fa-calendar-alt"></i>
                            <span>Meetings</span>
                            <i class="fas fa-chevron-right"></i>
                        </button>
                        <button class="menu-item" onclick="window.MobileNavigation.navigateToPage('rules')">
                            <i class="fas fa-book"></i>
                            <span>Rules & Regulations</span>
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>

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
                'deposits': 'Deposits',
                'meetings': 'Meetings',
                'rules': 'Rules & Regulations',
                'more': 'More'
            };
            pageTitle.textContent = titles[page] || 'Dashboard';
        }

        // Handle back button visibility
        if (backBtn) {
            // Hide back button on dashboard/home page
            if (page === 'dashboard') {
                backBtn.style.display = 'none';
            } else {
                // Show back button for other pages
                backBtn.style.display = 'block';
            }
        }
    }

    goBack() {
        if (this.navigationHistory.length > 0) {
            const previousPage = this.navigationHistory.pop();
            this.currentPage = previousPage;
            
            // Update active nav item
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            document.querySelector(`[data-page="${previousPage}"]`)?.classList.add('active');

            // Load page content
            this.loadPageContent(previousPage);

            // Update header
            this.updateHeader(previousPage);
        } else {
            // If no history, go to dashboard
            this.navigateToPage('dashboard');
        }
    }

    filterDeposits() {
        const selectedYear = document.getElementById('depositYear').value;
        const depositItems = document.querySelectorAll('.deposit-item');
        
        depositItems.forEach(item => {
            if (selectedYear === 'all' || item.dataset.year === selectedYear) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    async loadMobileFinancialData() {
        try {
            console.log('Loading mobile financial data from Google Sheets...');
            console.log('SHEETS_CONFIG available:', !!window.SHEETS_CONFIG);
            console.log('SHEETS_CONFIG content:', window.SHEETS_CONFIG);
            
            // Use the same Google Sheets URL as the main website
            const googleSheetsUrl = window.SHEETS_CONFIG?.financialCsvUrl || 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT0BPMTkSH8oDU7AYQLEcTxN-LHh86WLBMyfZH1eT4ABRCB8vwF2z7BBnzN0-SvaZZ0Apcwkkn08jyw/pub?output=csv';
            console.log('Using Google Sheets URL:', googleSheetsUrl);
            
            const response = await fetch(googleSheetsUrl, {
                method: 'GET',
                redirect: 'follow' // Follow redirects automatically
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const csv = await response.text();
            console.log('Raw CSV data from Google Sheets:', csv);
            
            if (csv && csv.trim()) {
                const rows = csv.split('\n');
                console.log('CSV rows:', rows);
                
                if (rows.length >= 2) {
                    const headers = rows[0].split(',');
                    const data = rows[1].split(',');
                    
                    console.log('CSV headers:', headers);
                    console.log('CSV data:', data);
                    
                    // Clean the data (remove quotes and extra spaces)
                    const bankBalance = parseFloat(data[0].replace(/"/g, '').trim()) || 183790;
                    const availableLoanAmount = parseFloat(data[1].replace(/"/g, '').trim()) || 175000;
                    const lastUpdated = data[2].replace(/"/g, '').trim() || new Date().toISOString().split('T')[0];
                    
                    console.log('Parsed financial data:', {
                        bankBalance,
                        availableLoanAmount,
                        lastUpdated
                    });
                    
                    // Update the mobile display
                    this.updateMobileFinancialDisplay({
                        bankBalance: bankBalance,
                        availableLoanAmount: availableLoanAmount,
                        lastUpdated: lastUpdated
                    });
                    
                    console.log('Mobile financial data loaded successfully:', {
                        bankBalance,
                        availableLoanAmount,
                        lastUpdated
                    });
                    return;
                }
            }
            
            // If no data available, use current Google Sheets data
            console.log('No valid data found, using current Google Sheets data...');
            this.updateMobileFinancialDisplay({
                bankBalance: 103996,  // Current data from Google Sheets
                availableLoanAmount: 100000,  // Current data from Google Sheets
                lastUpdated: '2025-10-21'  // Current data from Google Sheets
            });
            
        } catch (error) {
            console.error('Error loading mobile financial data from Google Sheets:', error);
            // Use current Google Sheets data on error
            console.log('Using current Google Sheets data due to error...');
            this.updateMobileFinancialDisplay({
                bankBalance: 103996,  // Current data from Google Sheets
                availableLoanAmount: 100000,  // Current data from Google Sheets
                lastUpdated: '2025-10-21'  // Current data from Google Sheets
            });
        }
    }

    updateMobileFinancialDisplay(data) {
        // Update bank balance (accounts page)
        const bankBalanceElement = document.getElementById('mobileBankBalance');
        if (bankBalanceElement) {
            bankBalanceElement.textContent = `₹${data.bankBalance.toLocaleString('en-IN')}`;
        }

        // Update available loan amount (accounts page)
        const loanAmountElement = document.getElementById('mobileAvailableLoan');
        if (loanAmountElement) {
            loanAmountElement.textContent = `₹${data.availableLoanAmount.toLocaleString('en-IN')}`;
        }

        // Update dashboard bank balance
        const dashboardBankBalance = document.getElementById('dashboardBankBalance');
        if (dashboardBankBalance) {
            dashboardBankBalance.textContent = `₹${data.bankBalance.toLocaleString('en-IN')}`;
        }

        // Update dashboard loan amount
        const dashboardLoanAmount = document.getElementById('dashboardLoanAmount');
        if (dashboardLoanAmount) {
            dashboardLoanAmount.textContent = `₹${data.availableLoanAmount.toLocaleString('en-IN')}`;
        }

        // Update last updated date
        const lastUpdatedElement = document.getElementById('mobileLastUpdated');
        if (lastUpdatedElement) {
            const date = new Date(data.lastUpdated);
            const formattedDate = date.toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            lastUpdatedElement.textContent = `Last updated: ${formattedDate}`;
        }
    }

    // Setup event listeners for financial data updates (same as website)
    setupMobileFinancialDataListeners() {
        // Listen for storage changes (when admin updates data in another tab)
        window.addEventListener('storage', (event) => {
            if (event.key === 'financialData' && event.newValue) {
                console.log('Financial data updated in another tab, refreshing mobile data...');
                this.loadMobileFinancialData();
            }
        });
        
        // Listen for custom events (same tab updates)
        window.addEventListener('financialDataUpdated', () => {
            console.log('Financial data updated event received, refreshing mobile data...');
            this.loadMobileFinancialData();
        });
    }

    // Manual refresh function for financial data
    async refreshFinancialData() {
        console.log('Manual refresh of financial data requested...');
        try {
            await this.loadMobileFinancialData();
            this.showNotification('Financial data refreshed successfully!', 'success');
        } catch (error) {
            console.error('Error refreshing financial data:', error);
            this.showNotification('Error refreshing financial data', 'error');
        }
    }

    autoFillLoanForm() {
        // Auto-fill user details in loan form
        const userDetails = window.AuthUtils ? window.AuthUtils.getCurrentUser() : window.MobileAuth.getCurrentUser();
        if (userDetails) {
            const nameField = document.getElementById('loanName');
            const emailField = document.getElementById('loanEmail');
            const phoneField = document.getElementById('loanPhone');
            
            if (nameField && userDetails.name) nameField.value = userDetails.name;
            if (emailField && userDetails.email) emailField.value = userDetails.email;
            if (phoneField && userDetails.phone) phoneField.value = userDetails.phone;
        }
    }

    showLoanApplication() {
        const form = document.getElementById('loanApplicationForm');
        const review = document.getElementById('reviewApplications');
        
        if (form) {
            form.style.display = 'block';
            if (review) review.style.display = 'none';
            
            // Setup form submission
            this.setupLoanFormSubmission();
        }
    }

    hideLoanApplication() {
        const form = document.getElementById('loanApplicationForm');
        if (form) {
            form.style.display = 'none';
        }
    }

    showReviewApplications() {
        // Check if user is admin/president
        const userDetails = window.AuthUtils ? window.AuthUtils.getCurrentUser() : window.MobileAuth.getCurrentUser();
        
        // Check if user is President based on name (Manjunath Banakar or President)
        const isPresident = userDetails && (
            userDetails.name === 'Manjunath Banakar' || 
            userDetails.name === 'Manjunath' ||
            userDetails.name.toLowerCase().includes('manjunath') ||
            userDetails.name === 'President'
        );
        
        const isAdmin = userDetails && (
            userDetails.role === 'admin' || 
            userDetails.role === 'president' || 
            userDetails.isPresident ||
            isPresident
        );
        
        if (!isAdmin) {
            this.showNotification('Access denied. Only administrators can review applications.', 'error');
            return;
        }

        const form = document.getElementById('loanApplicationForm');
        const review = document.getElementById('reviewApplications');
        
        if (review) {
            review.style.display = 'block';
            if (form) form.style.display = 'none';
            
            // Load applications from localStorage
            this.loadApplications();
        }
    }

    hideReviewApplications() {
        const review = document.getElementById('reviewApplications');
        if (review) {
            review.style.display = 'none';
        }
    }

    setupLoanFormSubmission() {
        const form = document.getElementById('mobileLoanForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('loanSubmitBtn');
            const btnText = document.getElementById('loanBtnText');
            const btnLoader = document.getElementById('loanBtnLoader');
            const successMsg = document.getElementById('loanSuccessMsg');

            // Show loading state
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline-block';

            const formData = {
                name: form.name.value,
                email: form.email.value,
                phone: form.phone.value,
                loan_amount: form.loan_amount.value,
                loan_reason: form.loan_reason.value,
                timestamp: new Date().toISOString(),
                status: 'Pending'
            };

            try {
                // Store in localStorage for review
                const applications = JSON.parse(localStorage.getItem('loanApplications') || '[]');
                applications.push(formData);
                localStorage.setItem('loanApplications', JSON.stringify(applications));

                // Show success message
                successMsg.style.display = 'block';
                form.reset();
                
                // Hide success message after 3 seconds
                setTimeout(() => {
                    successMsg.style.display = 'none';
                }, 3000);

            } catch (error) {
                console.error('Error submitting loan application:', error);
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                btnText.style.display = 'inline';
                btnLoader.style.display = 'none';
            }
        });
    }

    loadApplications() {
        const applicationsList = document.getElementById('applicationsList');
        if (!applicationsList) return;

        const applications = JSON.parse(localStorage.getItem('loanApplications') || '[]');
        
        if (applications.length === 0) {
            applicationsList.innerHTML = `
                <div class="no-applications">
                    <i class="fas fa-inbox"></i>
                    <p>No applications to review yet</p>
                </div>
            `;
            return;
        }

        applicationsList.innerHTML = applications.map((app, index) => `
            <div class="application-item">
                <div class="application-header">
                    <h4>${app.name}</h4>
                    <span class="application-status ${app.status.toLowerCase()}">${app.status}</span>
                </div>
                <div class="application-details">
                    <div class="detail-item">
                        <span class="label">Email:</span>
                        <span class="value">${app.email}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Phone:</span>
                        <span class="value">${app.phone}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Amount:</span>
                        <span class="value">₹${parseInt(app.loan_amount).toLocaleString('en-IN')}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Reason:</span>
                        <span class="value">${app.loan_reason}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Date:</span>
                        <span class="value">${new Date(app.timestamp).toLocaleDateString('en-IN')}</span>
                    </div>
                </div>
                <div class="application-actions">
                    <button class="action-btn approve" onclick="window.MobileNavigation.approveApplication(${index})">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="action-btn reject" onclick="window.MobileNavigation.rejectApplication(${index})">
                        <i class="fas fa-times"></i> Reject
                    </button>
                </div>
            </div>
        `).join('');
    }

    approveApplication(index) {
        const applications = JSON.parse(localStorage.getItem('loanApplications') || '[]');
        if (applications[index]) {
            applications[index].status = 'Approved';
            localStorage.setItem('loanApplications', JSON.stringify(applications));
            this.loadApplications();
        }
    }

    rejectApplication(index) {
        const applications = JSON.parse(localStorage.getItem('loanApplications') || '[]');
        if (applications[index]) {
            applications[index].status = 'Rejected';
            localStorage.setItem('loanApplications', JSON.stringify(applications));
            this.loadApplications();
        }
    }

    // Admin Access Control
    checkAdminAccess() {
        const userDetails = window.AuthUtils ? window.AuthUtils.getCurrentUser() : window.MobileAuth.getCurrentUser();
        
        console.log('🔍 Mobile Admin Check - User Details:', userDetails);
        
        // Check if user is President based on name (Manjunath Banakar or President)
        const isPresident = userDetails && (
            userDetails.name === 'Manjunath Banakar' || 
            userDetails.name === 'Manjunath' ||
            userDetails.name.toLowerCase().includes('manjunath') ||
            userDetails.name === 'President'
        );
        
        const isAdmin = userDetails && (
            userDetails.role === 'admin' || 
            userDetails.role === 'president' || 
            userDetails.isPresident ||
            isPresident
        );
        
        console.log('🔍 Mobile Admin Check - isPresident:', isPresident, 'isAdmin:', isAdmin);
        
        const adminPanelBtn = document.getElementById('adminPanelBtn');
        console.log('🔍 Mobile Admin Check - Admin Panel Button:', adminPanelBtn);
        
        if (adminPanelBtn) {
            adminPanelBtn.style.display = isAdmin ? 'flex' : 'none';
            console.log('🔍 Mobile Admin Check - Button display set to:', isAdmin ? 'flex' : 'none');
        } else {
            console.log('❌ Mobile Admin Check - Admin Panel Button not found!');
        }
        
        // Update user role in session if President
        if (isPresident && userDetails) {
            userDetails.role = 'president';
            userDetails.isPresident = true;
            if (window.AuthUtils) {
                window.AuthUtils.setUserSession(userDetails);
            }
            console.log('🔍 Mobile Admin Check - Updated user role to president');
        }
    }

    // President Access Control
    checkPresidentAccess() {
        const userDetails = window.AuthUtils ? window.AuthUtils.getCurrentUser() : window.MobileAuth.getCurrentUser();
        
        // Check if user is President based on name (Manjunath Banakar or President)
        const isPresident = userDetails && (
            userDetails.name === 'Manjunath Banakar' || 
            userDetails.name === 'Manjunath' ||
            userDetails.name.toLowerCase().includes('manjunath') ||
            userDetails.name === 'President'
        );
        
        const isAdmin = userDetails && (
            userDetails.role === 'admin' || 
            userDetails.role === 'president' || 
            userDetails.isPresident ||
            isPresident
        );
        
        const presidentAccessSection = document.getElementById('presidentAccessSection');
        if (presidentAccessSection) {
            presidentAccessSection.style.display = isAdmin ? 'block' : 'none';
        }
        
        // Update user role in session if President
        if (isPresident && userDetails) {
            userDetails.role = 'president';
            userDetails.isPresident = true;
            if (window.AuthUtils) {
                window.AuthUtils.setUserSession(userDetails);
            }
        }
    }

    showPresidentPanel() {
        const userDetails = window.AuthUtils ? window.AuthUtils.getCurrentUser() : window.MobileAuth.getCurrentUser();
        
        // Check if user is President based on name (Manjunath Banakar or President)
        const isPresident = userDetails && (
            userDetails.name === 'Manjunath Banakar' || 
            userDetails.name === 'Manjunath' ||
            userDetails.name.toLowerCase().includes('manjunath') ||
            userDetails.name === 'President'
        );
        
        const isAdmin = userDetails && (
            userDetails.role === 'admin' || 
            userDetails.role === 'president' || 
            userDetails.isPresident ||
            isPresident
        );
        
        if (!isAdmin) {
            this.showNotification('Access denied. Only the President can access this panel.', 'error');
            return;
        }
        
        // Show comprehensive President panel
        this.showComprehensivePresidentPanel();
    }

    showComprehensivePresidentPanel() {
        const content = document.getElementById('mobileContent');
        if (!content) return;

        content.innerHTML = `
            <div class="president-panel">
                <div class="president-header">
                    <button class="back-btn" onclick="window.MobileNavigation.loadDashboard()">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <h2><i class="fas fa-crown"></i> President Panel</h2>
                    <p>Comprehensive management tools for association operations</p>
                </div>

                <div class="president-sections">
                    <!-- Financial Management -->
                    <div class="president-section">
                        <h3><i class="fas fa-chart-line"></i> Financial Management</h3>
                        <div class="president-actions">
                            <button class="president-btn" onclick="window.MobileNavigation.showFinancialUpdate()">
                                <i class="fas fa-edit"></i>
                                <div class="btn-content">
                                    <span class="btn-title">Update Financial Data</span>
                                    <span class="btn-subtitle">Modify bank balance and loan amounts</span>
                                </div>
                            </button>
                            <button class="president-btn" onclick="window.MobileNavigation.showFinancialReports()">
                                <i class="fas fa-chart-bar"></i>
                                <div class="btn-content">
                                    <span class="btn-title">Financial Reports</span>
                                    <span class="btn-subtitle">View detailed financial analytics</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    <!-- Member Management -->
                    <div class="president-section">
                        <h3><i class="fas fa-users"></i> Member Management</h3>
                        <div class="president-actions">
                            <button class="president-btn" onclick="window.MobileNavigation.showMemberApproval()">
                                <i class="fas fa-user-check"></i>
                                <div class="btn-content">
                                    <span class="btn-title">Approve New Members</span>
                                    <span class="btn-subtitle">Review and approve membership applications</span>
                                </div>
                            </button>
                            <button class="president-btn" onclick="window.MobileNavigation.showMemberManagement()">
                                <i class="fas fa-user-cog"></i>
                                <div class="btn-content">
                                    <span class="btn-title">Manage Members</span>
                                    <span class="btn-subtitle">Update member information and roles</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    <!-- Loan Management -->
                    <div class="president-section">
                        <h3><i class="fas fa-credit-card"></i> Loan Management</h3>
                        <div class="president-actions">
                            <button class="president-btn" onclick="window.MobileNavigation.showReviewApplications()">
                                <i class="fas fa-clipboard-check"></i>
                                <div class="btn-content">
                                    <span class="btn-title">Review Applications</span>
                                    <span class="btn-subtitle">Review and process loan applications</span>
                                </div>
                            </button>
                            <button class="president-btn" onclick="window.MobileNavigation.showLoanApproval()">
                                <i class="fas fa-hand-holding-usd"></i>
                                <div class="btn-content">
                                    <span class="btn-title">Approve Loans</span>
                                    <span class="btn-subtitle">Approve or reject loan requests</span>
                                </div>
                            </button>
                            <button class="president-btn" onclick="window.MobileNavigation.showLoanReports()">
                                <i class="fas fa-file-invoice"></i>
                                <div class="btn-content">
                                    <span class="btn-title">Loan Reports</span>
                                    <span class="btn-subtitle">Generate loan activity reports</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    <!-- Meeting Management -->
                    <div class="president-section">
                        <h3><i class="fas fa-calendar-alt"></i> Meeting Management</h3>
                        <div class="president-actions">
                            <button class="president-btn" onclick="window.MobileNavigation.showMeetingScheduler()">
                                <i class="fas fa-calendar-plus"></i>
                                <div class="btn-content">
                                    <span class="btn-title">Schedule Meeting</span>
                                    <span class="btn-subtitle">Create and schedule association meetings</span>
                                </div>
                            </button>
                            <button class="president-btn" onclick="window.MobileNavigation.showMeetingMinutes()">
                                <i class="fas fa-file-alt"></i>
                                <div class="btn-content">
                                    <span class="btn-title">Meeting Minutes</span>
                                    <span class="btn-subtitle">Record and manage meeting minutes</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    <!-- System Settings -->
                    <div class="president-section">
                        <h3><i class="fas fa-cogs"></i> System Settings</h3>
                        <div class="president-actions">
                            <button class="president-btn" onclick="window.MobileNavigation.showSystemSettings()">
                                <i class="fas fa-sliders-h"></i>
                                <div class="btn-content">
                                    <span class="btn-title">System Settings</span>
                                    <span class="btn-subtitle">Configure system preferences</span>
                                </div>
                            </button>
                            <button class="president-btn" onclick="window.MobileNavigation.showBackupRestore()">
                                <i class="fas fa-database"></i>
                                <div class="btn-content">
                                    <span class="btn-title">Backup & Restore</span>
                                    <span class="btn-subtitle">Manage data backup and restoration</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    hideAdminPanel() {
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel) {
            adminPanel.style.display = 'none';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `mobile-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            right: 20px;
            background: ${type === 'error' ? '#fee2e2' : type === 'success' ? '#d1fae5' : '#dbeafe'};
            color: ${type === 'error' ? '#991b1b' : type === 'success' ? '#065f46' : '#1e40af'};
            border-radius: 12px;
            padding: 16px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            animation: slideDown 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideDown 0.3s ease reverse';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 3000);
    }

    // Admin Functions
    showFinancialUpdate() {
        const content = document.getElementById('mobileContent');
        if (!content) return;

        content.innerHTML = `
            <div class="mobile-financial-update">
                <div class="financial-header">
                    <button class="back-btn" onclick="window.MobileNavigation.loadLoans()">
                        <i class="fas fa-arrow-left"></i>
                        Back to Loans
                    </button>
                    <h3><i class="fas fa-chart-line"></i> Update Financial Data</h3>
                </div>

                <div class="current-data-section">
                    <h4><i class="fas fa-info-circle"></i> Current Financial Data</h4>
                    <div class="current-data-grid">
                        <div class="data-item">
                            <span class="label">Bank Balance:</span>
                            <span class="value" id="currentBankBalance">Loading...</span>
                        </div>
                        <div class="data-item">
                            <span class="label">Available Loan:</span>
                            <span class="value" id="currentLoanAmount">Loading...</span>
                        </div>
                        <div class="data-item">
                            <span class="label">Last Updated:</span>
                            <span class="value" id="currentLastUpdated">Loading...</span>
                        </div>
                    </div>
                </div>

                <div class="update-form-section">
                    <h4><i class="fas fa-edit"></i> Update Financial Data</h4>
                    <form class="financial-update-form" id="mobileFinancialForm">
                        <div class="form-group">
                            <label for="mobileBankBalance">
                                <i class="fas fa-university"></i> Bank Balance (₹)
                            </label>
                            <input type="number" id="mobileBankBalance" name="bankBalance" 
                                   placeholder="Enter new bank balance" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="mobileAvailableLoan">
                                <i class="fas fa-credit-card"></i> Available Loan Amount (₹)
                            </label>
                            <input type="number" id="mobileAvailableLoan" name="availableLoanAmount" 
                                   placeholder="Enter new available loan amount" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="mobileLastUpdated">
                                <i class="fas fa-calendar"></i> Last Updated Date
                            </label>
                            <input type="date" id="mobileLastUpdated" name="lastUpdated" required>
                        </div>
                        
                        <button type="submit" class="update-financial-btn">
                            <i class="fas fa-save"></i>
                            Update Financial Data
                        </button>
                    </form>
                </div>

                <div class="success-message" id="mobileSuccessMessage" style="display: none;">
                    <i class="fas fa-check-circle"></i>
                    Financial data updated successfully!
                </div>
            </div>
        `;

        // Load current financial data
        this.loadCurrentFinancialData();
        
        // Setup form submission
        this.setupFinancialFormSubmission();
    }

    showFinancialReports() {
        const content = document.getElementById('mobileContent');
        if (!content) return;

        content.innerHTML = `
            <div class="financial-reports">
                <div class="reports-header">
                    <button class="back-btn" onclick="window.MobileNavigation.showComprehensivePresidentPanel()">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <h2><i class="fas fa-chart-bar"></i> Financial Reports</h2>
                    <p>Financial analysis and insights</p>
                </div>

                <div class="reports-stats">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-university"></i>
                        </div>
                        <div class="stat-content">
                            <span class="stat-number" id="currentBalance">₹0</span>
                            <span class="stat-label">Current Balance</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-credit-card"></i>
                        </div>
                        <div class="stat-content">
                            <span class="stat-number" id="availableLoans">₹0</span>
                            <span class="stat-label">Available Loans</span>
                        </div>
                    </div>
                </div>

                <div class="charts-section">
                    <div class="chart-container">
                        <h3><i class="fas fa-chart-line"></i> Deposits & Interest Analysis</h3>
                        <div class="chart-wrapper">
                            <canvas id="depositsChart"></canvas>
                        </div>
                    </div>

                    <div class="chart-container">
                        <h3><i class="fas fa-hand-holding-usd"></i> Loan Distribution</h3>
                        <div class="chart-wrapper">
                            <canvas id="loansChart"></canvas>
                        </div>
                    </div>
                </div>

                <div class="reports-actions">
                    <button class="action-btn primary" onclick="window.MobileNavigation.refreshFinancialReports()">
                        <i class="fas fa-sync-alt"></i>
                        <span>Refresh Data</span>
                    </button>
                </div>
            </div>
        `;

        // Load Chart.js and create charts
        this.loadChartJsAndCreateReports();
    }

    // Load Chart.js and create financial reports (same as website)
    async loadChartJsAndCreateReports() {
        try {
            console.log('Loading mobile financial reports...');
            
            // Load current financial data
            await this.loadCurrentFinancialData();
            
            // Load Chart.js if not already loaded
            if (typeof Chart === 'undefined') {
                await this.loadChartJs();
            }
            
            // Create charts using same data as website
            this.createDepositsChart();
            await this.createLoansChart();
            
        } catch (error) {
            console.error('Error loading financial reports:', error);
            this.showNotification('Failed to load financial reports', 'error');
        }
    }

    // Load Chart.js library
    async loadChartJs() {
        return new Promise((resolve, reject) => {
            if (typeof Chart !== 'undefined') {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = () => {
                console.log('Chart.js loaded successfully');
                resolve();
            };
            script.onerror = () => {
                console.error('Failed to load Chart.js');
                reject(new Error('Failed to load Chart.js'));
            };
            document.head.appendChild(script);
        });
    }

    // Load current financial data
    async loadCurrentFinancialData() {
        try {
            const googleSheetsUrl = window.SHEETS_CONFIG?.financialCsvUrl || 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT0BPMTkSH8oDU7AYQLEcTxN-LHh86WLBMyfZH1eT4ABRCB8vwF2z7BBnzN0-SvaZZ0Apcwkkn08jyw/pub?output=csv';
            
            const response = await fetch(googleSheetsUrl, {
                method: 'GET',
                redirect: 'follow'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const csv = await response.text();
            
            if (csv && csv.trim()) {
                const rows = csv.split('\n');
                if (rows.length >= 2) {
                    const data = rows[1].split(',');
                    const bankBalance = parseFloat(data[0].replace(/"/g, '').trim()) || 0;
                    const availableLoanAmount = parseFloat(data[1].replace(/"/g, '').trim()) || 0;
                    
                    // Update display
                    const balanceElement = document.getElementById('currentBalance');
                    const loansElement = document.getElementById('availableLoans');
                    
                    if (balanceElement) {
                        balanceElement.textContent = `₹${bankBalance.toLocaleString('en-IN')}`;
                    }
                    if (loansElement) {
                        loansElement.textContent = `₹${availableLoanAmount.toLocaleString('en-IN')}`;
                    }
                }
            }
        } catch (error) {
            console.error('Error loading financial data:', error);
        }
    }

    // Get deposit analysis data (same as website)
    getDepositAnalysisData() {
        // Updated data from deposits.html account balance summary table (same as website)
        return [
            {
                year: 'First Year (2021-2022)',
                principalAmount: 111000,
                interestEarned: 8700,
                totalBalance: 114100,
                months: '12 months'
            },
            {
                year: 'Second Year (2022-2023)',
                principalAmount: 149000,
                interestEarned: 33600,
                totalBalance: 169600,
                months: '14 months'
            },
            {
                year: 'Third Year (2023-2024)',
                principalAmount: 159500,
                interestEarned: 45700,
                totalBalance: 187450,
                months: '13 months'
            },
            {
                year: 'Fourth Year (2024-2025)',
                principalAmount: 126000,
                interestEarned: 57300,
                totalBalance: 149915,
                months: '8 months'
            },
            {
                year: 'Fifth Year (2025)',
                principalAmount: 149000,
                interestEarned: 103350,
                totalBalance: 252350,
                months: '11 months'
            }
        ];
    }

    // Create deposits and interest chart (same as website)
    createDepositsChart() {
        const ctx = document.getElementById('depositsChart');
        if (!ctx) return;

        const analysisData = this.getDepositAnalysisData();
        const labels = analysisData.map(data => data.year);
        const principalData = analysisData.map(data => data.principalAmount);
        const interestData = analysisData.map(data => data.interestEarned);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Principal Amount',
                        data: principalData,
                        backgroundColor: 'rgba(54, 162, 235, 0.8)',
                        borderColor: '#2E86C1',
                        borderWidth: 3,
                        borderRadius: 8,
                        borderSkipped: false,
                    },
                    {
                        label: 'Interest Earned',
                        data: interestData,
                        backgroundColor: 'rgba(255, 99, 132, 0.8)',
                        borderColor: '#E74C3C',
                        borderWidth: 3,
                        borderRadius: 8,
                        borderSkipped: false,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#007bff',
                        borderWidth: 2,
                        cornerRadius: 8,
                        displayColors: true,
                        callbacks: {
                            title: function(context) {
                                return context[0].label;
                            },
                            label: function(context) {
                                return `${context.dataset.label}: ₹${context.parsed.y.toLocaleString('en-IN')}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 10,
                                weight: 'bold'
                            },
                            maxRotation: 45
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            font: {
                                size: 10,
                                weight: 'bold'
                            },
                            callback: function(value) {
                                return '₹' + value.toLocaleString('en-IN');
                            }
                        }
                    }
                }
            }
        });
    }

    // Create loans distribution chart (using real data)
    async createLoansChart() {
        const ctx = document.getElementById('loansChart');
        if (!ctx) return;

        try {
            // Load loan data from Google Sheets (same as website)
            let loansData = [];
            if (window.SHEETS_CONFIG && window.SHEETS_CONFIG.loansCsvUrl) {
                const loansCsv = await window.SheetsUtils.fetchCsv(window.SHEETS_CONFIG.loansCsvUrl);
                const loansRows = window.SheetsUtils.parseCsv(loansCsv);
                loansData = window.SheetsUtils.rowsToObjects(loansRows);
                console.log('Loans data loaded for chart:', loansData.length, 'records');
            }

            // Calculate loan statistics
            const activeLoans = loansData.filter(loan => loan.status && loan.status.toLowerCase().includes('active'));
            const pendingLoans = loansData.filter(loan => loan.status && loan.status.toLowerCase().includes('pending'));
            
            const activeAmount = activeLoans.reduce((sum, loan) => {
                const amount = parseFloat(loan.amount?.replace(/[₹,]/g, '') || 0);
                return sum + amount;
            }, 0);
            
            const pendingAmount = pendingLoans.reduce((sum, loan) => {
                const amount = parseFloat(loan.amount?.replace(/[₹,]/g, '') || 0);
                return sum + amount;
            }, 0);

            // Get available loan amount from financial data
            const availableAmount = this.getAvailableLoanAmount();

            const chartData = {
                labels: ['Active Loans', 'Pending Applications', 'Available Amount'],
                datasets: [{
                    data: [activeAmount, pendingAmount, availableAmount],
                    backgroundColor: [
                        'rgba(239, 68, 68, 0.8)',   // Red for active
                        'rgba(245, 158, 11, 0.8)',  // Orange for pending
                        'rgba(16, 185, 129, 0.8)'   // Green for available
                    ],
                    borderColor: [
                        '#dc2626',
                        '#d97706',
                        '#059669'
                    ],
                    borderWidth: 2
                }]
            };

            new Chart(ctx, {
                type: 'doughnut',
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                                padding: 20,
                                font: {
                                    size: 10,
                                    weight: 'bold'
                                }
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            borderColor: '#007bff',
                            borderWidth: 2,
                            cornerRadius: 8,
                            callbacks: {
                                label: function(context) {
                                    return context.label + ': ₹' + context.parsed.toLocaleString('en-IN');
                                }
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error creating loans chart:', error);
            // Fallback to sample data
            this.createLoansChartFallback();
        }
    }

    // Fallback loans chart with sample data
    createLoansChartFallback() {
        const ctx = document.getElementById('loansChart');
        if (!ctx) return;

        const chartData = {
            labels: ['Active Loans', 'Pending Applications', 'Available Amount'],
            datasets: [{
                data: [680000, 200000, 100000],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(16, 185, 129, 0.8)'
                ],
                borderColor: [
                    '#dc2626',
                    '#d97706',
                    '#059669'
                ],
                borderWidth: 2
            }]
        };

        new Chart(ctx, {
            type: 'doughnut',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 10,
                                weight: 'bold'
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ₹' + context.parsed.toLocaleString('en-IN');
                            }
                        }
                    }
                }
            }
        });
    }

    // Get available loan amount from current financial data
    getAvailableLoanAmount() {
        try {
            const loansElement = document.getElementById('availableLoans');
            if (loansElement) {
                const text = loansElement.textContent;
                const amount = parseFloat(text.replace(/[₹,]/g, ''));
                return isNaN(amount) ? 100000 : amount;
            }
        } catch (error) {
            console.error('Error getting available loan amount:', error);
        }
        return 100000; // Fallback
    }

    // Refresh financial reports
    async refreshFinancialReports() {
        this.showNotification('Refreshing financial data...', 'info');
        try {
            await this.loadCurrentFinancialData();
            this.showNotification('Financial data refreshed successfully!', 'success');
        } catch (error) {
            console.error('Error refreshing financial data:', error);
            this.showNotification('Failed to refresh financial data', 'error');
        }
    }

    showMemberApproval() {
        const content = document.getElementById('mobileContent');
        if (!content) return;

        content.innerHTML = `
            <div class="member-approval">
                <div class="approval-header">
                    <button class="back-btn" onclick="window.MobileNavigation.showComprehensivePresidentPanel()">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <h2><i class="fas fa-user-check"></i> Member Approval</h2>
                    <p>Review and approve new member applications</p>
                </div>

                <div class="approval-filters">
                    <button class="filter-btn active" onclick="window.MobileNavigation.filterMembers('all')" id="filterAll">
                        <i class="fas fa-users"></i>
                        <span>All Members</span>
                    </button>
                    <button class="filter-btn" onclick="window.MobileNavigation.filterMembers('pending')" id="filterPending">
                        <i class="fas fa-clock"></i>
                        <span>Pending</span>
                    </button>
                    <button class="filter-btn" onclick="window.MobileNavigation.filterMembers('approved')" id="filterApproved">
                        <i class="fas fa-check"></i>
                        <span>Approved</span>
                    </button>
                    <button class="filter-btn" onclick="window.MobileNavigation.filterMembers('rejected')" id="filterRejected">
                        <i class="fas fa-times"></i>
                        <span>Rejected</span>
                    </button>
                </div>

                <div class="approval-stats">
                    <div class="stat-card">
                        <div class="stat-icon pending">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="stat-content">
                            <span class="stat-number" id="pendingCount">0</span>
                            <span class="stat-label">Pending</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon approved">
                            <i class="fas fa-check"></i>
                        </div>
                        <div class="stat-content">
                            <span class="stat-number" id="approvedCount">0</span>
                            <span class="stat-label">Approved</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon rejected">
                            <i class="fas fa-times"></i>
                        </div>
                        <div class="stat-content">
                            <span class="stat-number" id="rejectedCount">0</span>
                            <span class="stat-label">Rejected</span>
                        </div>
                    </div>
                </div>

                <div class="members-list" id="membersList">
                    <div class="loading-state">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>Loading members...</p>
                    </div>
                </div>
            </div>
        `;

        // Load members data
        this.loadMembersForApproval();
    }

    // Load members for approval (same as website)
    async loadMembersForApproval() {
        try {
            console.log('Loading members for approval...');
            const users = await window.SheetsAuth.getAllUsers();
            console.log('Loaded users:', users);
            
            this.allUsers = users;
            this.filteredUsers = users;
            this.currentFilter = 'all';
            
            this.renderMembersList();
            this.updateStats();
            
        } catch (error) {
            console.error('Error loading members:', error);
            this.showNotification('Failed to load members. Please try again.', 'error');
            
            // Show empty state
            const membersList = document.getElementById('membersList');
            if (membersList) {
                membersList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Failed to load members</p>
                        <button class="retry-btn" onclick="window.MobileNavigation.loadMembersForApproval()">
                            <i class="fas fa-redo"></i>
                            <span>Retry</span>
                        </button>
                    </div>
                `;
            }
        }
    }

    // Render members list
    renderMembersList() {
        const membersList = document.getElementById('membersList');
        if (!membersList) return;

        if (!this.filteredUsers || this.filteredUsers.length === 0) {
            membersList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <p>No members found</p>
                </div>
            `;
            return;
        }

        membersList.innerHTML = this.filteredUsers.map(user => `
            <div class="member-card" data-user-id="${user.id}">
                <div class="member-header">
                    <div class="member-info">
                        <h4 class="member-name">${user.name}</h4>
                        <p class="member-email">${user.email || 'No email provided'}</p>
                        <span class="member-date">Joined: ${new Date(user.createdDate).toLocaleDateString()}</span>
                    </div>
                    <div class="member-status">
                        <span class="status-badge status-${user.status}">${user.status}</span>
                    </div>
                </div>
                
                <div class="member-actions">
                    ${user.status === 'pending' ? `
                        <button class="action-btn approve" onclick="window.MobileNavigation.approveMember('${user.id}')">
                            <i class="fas fa-check"></i>
                            <span>Approve</span>
                        </button>
                        <button class="action-btn reject" onclick="window.MobileNavigation.rejectMember('${user.id}')">
                            <i class="fas fa-times"></i>
                            <span>Reject</span>
                        </button>
                    ` : `
                        <button class="action-btn ${user.status === 'approved' ? 'approved' : 'rejected'}" disabled>
                            <i class="fas fa-${user.status === 'approved' ? 'check' : 'times'}"></i>
                            <span>${user.status === 'approved' ? 'Approved' : 'Rejected'}</span>
                        </button>
                    `}
                </div>
            </div>
        `).join('');
    }

    // Update statistics
    updateStats() {
        if (!this.allUsers) return;

        const pendingCount = this.allUsers.filter(user => user.status === 'pending').length;
        const approvedCount = this.allUsers.filter(user => user.status === 'approved').length;
        const rejectedCount = this.allUsers.filter(user => user.status === 'rejected').length;

        const pendingElement = document.getElementById('pendingCount');
        const approvedElement = document.getElementById('approvedCount');
        const rejectedElement = document.getElementById('rejectedCount');

        if (pendingElement) pendingElement.textContent = pendingCount;
        if (approvedElement) approvedElement.textContent = approvedCount;
        if (rejectedElement) rejectedElement.textContent = rejectedCount;
    }

    // Filter members
    filterMembers(filter) {
        this.currentFilter = filter;
        
        // Update filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`filter${filter.charAt(0).toUpperCase() + filter.slice(1)}`).classList.add('active');
        
        if (filter === 'all') {
            this.filteredUsers = this.allUsers;
        } else {
            this.filteredUsers = this.allUsers.filter(user => user.status === filter);
        }
        
        this.renderMembersList();
    }

    // Approve member (same as website)
    async approveMember(userId) {
        try {
            console.log('Approving member:', userId);
            const result = await window.SheetsAuth.updateUserStatus(userId, 'approved', 'President');
            
            if (result.success) {
                this.showNotification('Member approved successfully!', 'success');
                
                // Update local data
                const user = this.allUsers.find(u => u.id === userId);
                if (user) {
                    user.status = 'approved';
                }
                
                // Refresh display
                this.filterMembers(this.currentFilter);
                this.updateStats();
            } else {
                this.showNotification(result.message || 'Failed to approve member', 'error');
            }
        } catch (error) {
            console.error('Error approving member:', error);
            this.showNotification('Failed to approve member. Please try again.', 'error');
        }
    }

    // Reject member (same as website)
    async rejectMember(userId) {
        // Show confirmation dialog
        if (!confirm('Are you sure you want to reject this member?')) {
            return;
        }

        try {
            console.log('Rejecting member:', userId);
            const result = await window.SheetsAuth.updateUserStatus(userId, 'rejected', 'President');
            
            if (result.success) {
                this.showNotification('Member rejected successfully!', 'success');
                
                // Update local data
                const user = this.allUsers.find(u => u.id === userId);
                if (user) {
                    user.status = 'rejected';
                }
                
                // Refresh display
                this.filterMembers(this.currentFilter);
                this.updateStats();
            } else {
                this.showNotification(result.message || 'Failed to reject member', 'error');
            }
        } catch (error) {
            console.error('Error rejecting member:', error);
            this.showNotification('Failed to reject member. Please try again.', 'error');
        }
    }

    showMemberManagement() {
        this.showNotification('Member Management feature coming soon!', 'info');
    }

    showLoanApproval() {
        this.showNotification('Loan Approval feature coming soon!', 'info');
    }

    showLoanReports() {
        this.showNotification('Loan Reports feature coming soon!', 'info');
    }

    showMeetingScheduler() {
        this.showNotification('Meeting Scheduler feature coming soon!', 'info');
    }

    showMeetingMinutes() {
        this.showNotification('Meeting Minutes feature coming soon!', 'info');
    }

    showSystemSettings() {
        this.showNotification('System Settings feature coming soon!', 'info');
    }

    showBackupRestore() {
        this.showNotification('Backup & Restore feature coming soon!', 'info');
    }

    // Application Status for Regular Users
    showApplicationStatus() {
        const content = document.getElementById('mobileContent');
        if (!content) return;

        const userDetails = window.AuthUtils ? window.AuthUtils.getCurrentUser() : window.MobileAuth.getCurrentUser();
        const userName = userDetails ? userDetails.name : 'Unknown User';

        content.innerHTML = `
            <div class="mobile-application-status">
                <div class="status-header">
                    <button class="back-btn" onclick="window.MobileNavigation.loadLoans()">
                        <i class="fas fa-arrow-left"></i>
                        Back to Loans
                    </button>
                    <h3><i class="fas fa-clipboard-check"></i> My Application Status</h3>
                </div>

                <div class="user-info">
                    <div class="user-card">
                        <div class="user-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="user-details">
                            <h4>${userName}</h4>
                            <p>Application Status Tracker</p>
                        </div>
                    </div>
                </div>

                <div class="applications-section">
                    <h4><i class="fas fa-list"></i> My Loan Applications</h4>
                    <div class="applications-list" id="myApplicationsList">
                        <div class="no-applications">
                            <i class="fas fa-inbox"></i>
                            <p>No applications found</p>
                            <p class="help-text">Submit a new loan application to see it here</p>
                        </div>
                    </div>
                </div>

                <div class="quick-actions">
                    <button class="action-btn primary" onclick="window.MobileNavigation.showLoanApplication()">
                        <i class="fas fa-plus"></i>
                        <span>New Application</span>
                    </button>
                </div>
            </div>
        `;

        // Load user's applications
        this.loadMyApplications();
    }

    loadMyApplications() {
        const userDetails = window.AuthUtils ? window.AuthUtils.getCurrentUser() : window.MobileAuth.getCurrentUser();
        const userName = userDetails ? userDetails.name : 'Unknown User';
        
        const applications = JSON.parse(localStorage.getItem('loanApplications') || '[]');
        const myApplications = applications.filter(app => app.applicantName === userName);
        
        const applicationsList = document.getElementById('myApplicationsList');
        if (!applicationsList) return;

        if (myApplications.length === 0) {
            applicationsList.innerHTML = `
                <div class="no-applications">
                    <i class="fas fa-inbox"></i>
                    <p>No applications found</p>
                    <p class="help-text">Submit a new loan application to see it here</p>
                </div>
            `;
            return;
        }

        applicationsList.innerHTML = myApplications.map((app, index) => `
            <div class="application-item">
                <div class="application-header">
                    <div class="application-info">
                        <h5>Application #${index + 1}</h5>
                        <p class="application-date">Submitted: ${new Date(app.submittedAt).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div class="application-status status-${app.status.toLowerCase()}">
                        <i class="fas fa-${app.status === 'Approved' ? 'check-circle' : app.status === 'Rejected' ? 'times-circle' : 'clock'}"></i>
                        <span>${app.status}</span>
                    </div>
                </div>
                
                <div class="application-details">
                    <div class="detail-item">
                        <span class="label">Loan Amount:</span>
                        <span class="value">₹${parseInt(app.loanAmount).toLocaleString('en-IN')}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Purpose:</span>
                        <span class="value">${app.loanPurpose}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Duration:</span>
                        <span class="value">${app.loanDuration} months</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Monthly Income:</span>
                        <span class="value">₹${parseInt(app.monthlyIncome).toLocaleString('en-IN')}</span>
                    </div>
                </div>
                
                ${app.status === 'Pending' ? `
                    <div class="application-note">
                        <i class="fas fa-info-circle"></i>
                        <span>Your application is under review. You will be notified once a decision is made.</span>
                    </div>
                ` : app.status === 'Approved' ? `
                    <div class="application-note approved">
                        <i class="fas fa-check-circle"></i>
                        <span>Congratulations! Your loan application has been approved.</span>
                    </div>
                ` : `
                    <div class="application-note rejected">
                        <i class="fas fa-times-circle"></i>
                        <span>Your loan application has been rejected. Please contact the association for more details.</span>
                    </div>
                `}
            </div>
        `).join('');
    }

    // Financial Update Functions
    async loadCurrentFinancialData() {
        try {
            // Load current financial data from Google Sheets
            const response = await fetch(window.SHEETS_CONFIG?.financialCsvUrl || 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSJmRVixaV5nZiERZy6eC2xVXSfVez2a-Ju040TqqlvM2IU03E5bsW5UlN6ZvL2cS65pdIhMtiQTn6v/pub?output=csv');
            const csvText = await response.text();
            const lines = csvText.split('\n');
            
            if (lines.length > 1) {
                const data = lines[1].split(',');
                const bankBalance = parseInt(data[0]) || 183790;
                const availableLoan = parseInt(data[1]) || 175000;
                const lastUpdated = data[2] || new Date().toISOString().split('T')[0];
                
                // Display current data
                document.getElementById('currentBankBalance').textContent = `₹${bankBalance.toLocaleString('en-IN')}`;
                document.getElementById('currentLoanAmount').textContent = `₹${availableLoan.toLocaleString('en-IN')}`;
                document.getElementById('currentLastUpdated').textContent = lastUpdated;
                
                // Set default values in form
                document.getElementById('mobileBankBalance').value = bankBalance;
                document.getElementById('mobileAvailableLoan').value = availableLoan;
                document.getElementById('mobileLastUpdated').value = new Date().toISOString().split('T')[0];
            } else {
                // Use default values if no data found
                this.displayDefaultFinancialData();
            }
        } catch (error) {
            console.error('Error loading current financial data:', error);
            this.displayDefaultFinancialData();
        }
    }

    displayDefaultFinancialData() {
        const defaultData = {
            bankBalance: 183790,
            availableLoanAmount: 175000,
            lastUpdated: new Date().toISOString().split('T')[0]
        };
        
        document.getElementById('currentBankBalance').textContent = `₹${defaultData.bankBalance.toLocaleString('en-IN')}`;
        document.getElementById('currentLoanAmount').textContent = `₹${defaultData.availableLoanAmount.toLocaleString('en-IN')}`;
        document.getElementById('currentLastUpdated').textContent = defaultData.lastUpdated;
        
        // Set default values in form
        document.getElementById('mobileBankBalance').value = defaultData.bankBalance;
        document.getElementById('mobileAvailableLoan').value = defaultData.availableLoanAmount;
        document.getElementById('mobileLastUpdated').value = defaultData.lastUpdated;
    }

    setupFinancialFormSubmission() {
        const form = document.getElementById('mobileFinancialForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                const formData = new FormData(form);
                const bankBalance = parseInt(formData.get('bankBalance'));
                const availableLoanAmount = parseInt(formData.get('availableLoanAmount'));
                const lastUpdated = formData.get('lastUpdated');
                
                // Validate form data
                if (!bankBalance || bankBalance <= 0) {
                    this.showNotification('Please enter a valid bank balance greater than 0', 'error');
                    return;
                }
                
                if (!availableLoanAmount || availableLoanAmount <= 0) {
                    this.showNotification('Please enter a valid available loan amount greater than 0', 'error');
                    return;
                }
                
                if (!lastUpdated) {
                    this.showNotification('Please select a valid date', 'error');
                    return;
                }
                
                // Show loading state
                const submitBtn = form.querySelector('.update-financial-btn');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
                submitBtn.disabled = true;
                
                // Update financial data
                await this.updateMobileFinancialData({
                    bankBalance: bankBalance,
                    availableLoanAmount: availableLoanAmount,
                    lastUpdated: lastUpdated
                });
                
                // Show success message
                document.getElementById('mobileSuccessMessage').style.display = 'block';
                
                // Reset form
                form.reset();
                
                // Reload current data
                setTimeout(() => {
                    this.loadCurrentFinancialData();
                }, 1000);
                
            } catch (error) {
                console.error('Error updating financial data:', error);
                this.showNotification('Error updating financial data. Please try again.', 'error');
            } finally {
                // Reset button state
                const submitBtn = form.querySelector('.update-financial-btn');
                submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Financial Data';
                submitBtn.disabled = false;
            }
        });
    }

    async updateMobileFinancialData(formData) {
        try {
            // Get user details
            const userDetails = window.AuthUtils ? window.AuthUtils.getCurrentUser() : window.MobileAuth.getCurrentUser();
            
            // Update Google Sheet via Google Apps Script (same as website)
            const params = new URLSearchParams({
                action: 'updateFinancialData',
                bankBalance: formData.bankBalance,
                availableLoanAmount: formData.availableLoanAmount,
                lastUpdated: formData.lastUpdated
            });
            
            const updateUrl = window.SHEETS_CONFIG?.financialUpdateUrl || 'https://script.google.com/macros/s/AKfycbyMSWWzvoAdk4h0LEXuuB0GWiS_M-OjErpUMQqcDoyQlaEEgKQxWOu3tXHjcsNmzF7Y/exec';
            
            const response = await fetch(updateUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params.toString()
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    console.log('Financial data updated successfully in Google Sheet');
                    this.showNotification('Financial data updated successfully!', 'success');
                    
                    // Dispatch event to refresh financial data (same as website)
                    window.dispatchEvent(new CustomEvent('financialDataUpdated'));
                    
                    // Also trigger refresh of mobile financial data
                    setTimeout(() => {
                        this.loadMobileFinancialData();
                    }, 1000);
                } else {
                    throw new Error(result.message || 'Failed to update financial data');
                }
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
        } catch (error) {
            console.error('Error updating financial data:', error);
            throw error;
        }
    }

    showContact(phoneNumber) {
        // Create contact notification
        const contactDiv = document.createElement('div');
        contactDiv.className = 'mobile-contact-notification';
        contactDiv.innerHTML = `
            <div class="contact-content">
                <i class="fas fa-phone"></i>
                <div class="contact-info">
                    <h4>Contact Member</h4>
                    <p>${phoneNumber}</p>
                </div>
                <button class="call-btn" onclick="window.open('tel:${phoneNumber}')">
                    <i class="fas fa-phone"></i>
                </button>
            </div>
        `;
        
        // Add contact styles
        contactDiv.style.cssText = `
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

        // Add contact content styles
        const style = document.createElement('style');
        style.textContent = `
            .contact-content {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px;
            }
            .contact-info h4 {
                margin: 0 0 4px 0;
                font-size: 16px;
                font-weight: 600;
                color: var(--text-primary);
            }
            .contact-info p {
                margin: 0;
                font-size: 14px;
                color: var(--text-secondary);
            }
            .call-btn {
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 8px;
                padding: 8px 12px;
                cursor: pointer;
                margin-left: auto;
            }
        `;
        
        if (!document.getElementById('contact-styles')) {
            style.id = 'contact-styles';
            document.head.appendChild(style);
        }

        document.body.appendChild(contactDiv);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (contactDiv.parentNode) {
                contactDiv.style.animation = 'slideDown 0.3s ease reverse';
                setTimeout(() => {
                    contactDiv.remove();
                }, 300);
            }
        }, 5000);
    }
}

// Initialize mobile navigation
window.MobileNavigation = new MobileNavigation();
