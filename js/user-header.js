// User Header Display Functions
function displayUserHeader() {
    try {
        const userDetails = JSON.parse(sessionStorage.getItem('userDetails') || localStorage.getItem('userDetails') || '{}');
        const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true' || localStorage.getItem('isAuthenticated') === 'true';
        
        if (isAuthenticated && userDetails.name) {
            const userHeaderInfo = document.getElementById('userHeaderInfo');
            if (userHeaderInfo) {
                userHeaderInfo.style.display = 'flex';
                const userName = document.getElementById('headerUserName');
                const userRole = document.getElementById('headerUserRole');
                if (userName) userName.textContent = userDetails.name;
                if (userRole) userRole.textContent = userDetails.role || 'Member';
                
                // Update user avatar with member image
                const userAvatar = userHeaderInfo.querySelector('.user-avatar-small');
                if (userAvatar && userDetails.id) {
                    // Create member image path based on member ID
                    const memberId = userDetails.id.toString().padStart(3, '0');
                    const imagePath = `images/members/member-${memberId}.jpeg`;
                    
                    // Replace the icon with an image
                    userAvatar.innerHTML = `
                        <img src="${imagePath}" alt="${userDetails.name}" 
                             onerror="this.style.display='none';this.nextElementSibling.style.display='block';"
                             style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255,255,255,0.3);">
                        <i class="fas fa-user-circle" style="display: none; font-size: 2rem;"></i>
                    `;
                }
            }
        } else {
            const userHeaderInfo = document.getElementById('userHeaderInfo');
            if (userHeaderInfo) {
                userHeaderInfo.style.display = 'none';
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
