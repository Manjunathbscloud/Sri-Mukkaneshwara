// User Header Display Functions
function displayUserHeader() {
    try {
        const userHeaderInfo = document.getElementById('userHeaderInfo');
        if (!userHeaderInfo) return;
        
        // Hide user header by default
        userHeaderInfo.style.display = 'none';
        
        // Check if current page is the overview page (index.html)
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage === 'index.html' || currentPage === '' || currentPage === 'Sri-Mukkaneshwara/') {
            // On overview page, never show user header
            return;
        }
        
        // Check if user is authenticated
        const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true' || localStorage.getItem('isAuthenticated') === 'true';
        
        // Only show user header if user is actually logged in AND not on overview page
        if (isAuthenticated) {
            const userDetails = JSON.parse(sessionStorage.getItem('userDetails') || localStorage.getItem('userDetails') || '{}');
            
            // Only show if we have valid user details
            if (userDetails && userDetails.name && userDetails.name !== 'Loading...') {
                userHeaderInfo.style.display = 'flex';
                
                // Update user name and role
                const userName = document.getElementById('headerUserName');
                const userRole = document.getElementById('headerUserRole');
                if (userName) userName.textContent = userDetails.name;
                if (userRole) userRole.textContent = userDetails.role || 'Member';
                
                // Update user avatar with member image
                const userAvatar = userHeaderInfo.querySelector('.user-avatar-small');
                if (userAvatar && userDetails.id) {
                    const memberId = userDetails.id.toString().padStart(3, '0');
                    const imagePath = `images/members/member-${memberId}.jpeg`;
                    
                    userAvatar.innerHTML = `
                        <img src="${imagePath}" alt="${userDetails.name}" 
                             onerror="this.style.display='none';this.nextElementSibling.style.display='block';"
                             style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255,255,255,0.3);">
                        <i class="fas fa-user-circle" style="display: none; font-size: 2rem;"></i>
                    `;
                }
            }
        }
        
    } catch (error) {
        console.error('Error displaying user header:', error);
        const userHeaderInfo = document.getElementById('userHeaderInfo');
        if (userHeaderInfo) {
            userHeaderInfo.style.display = 'none';
        }
    }
}

function toggleUserMenu() {
    const userMenu = document.getElementById('userMenu');
    if (userMenu) {
        userMenu.style.display = userMenu.style.display === 'none' ? 'block' : 'none';
    }
}

function logout() {
    // Clear all session data
    sessionStorage.clear();
    localStorage.clear();
    
    // Redirect to login page
    window.location.href = 'login.html';
}

// Close user menu when clicking outside
document.addEventListener('click', function(event) {
    const userMenu = document.getElementById('userMenu');
    const userMenuBtn = document.querySelector('.user-menu-btn');
    
    if (userMenu && userMenuBtn && !userMenu.contains(event.target) && !userMenuBtn.contains(event.target)) {
        userMenu.style.display = 'none';
    }
});

// Display user header when page loads
document.addEventListener('DOMContentLoaded', function() {
    displayUserHeader();
});
