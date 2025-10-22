// User Header Display Functions
function displayUserHeader() {
    // Check if user is logged in
    const userDetails = JSON.parse(sessionStorage.getItem('userDetails') || localStorage.getItem('userDetails') || '{}');
    const userHeaderInfo = document.getElementById('userHeaderInfo');
    const headerUserName = document.getElementById('headerUserName');
    const headerUserRole = document.getElementById('headerUserRole');
    if (userDetails && userDetails.name) {
        // Show user header if logged in
        if (userHeaderInfo) {
            userHeaderInfo.style.display = 'flex';
        }
        if (headerUserName) {
            headerUserName.textContent = userDetails.name;
        }
        if (headerUserRole) {
            // Advanced President detection (same as mobile app)
            var isPresident = userDetails.name === 'Manjunath Banakar' || 
                             userDetails.name === 'Manjunath' ||
                             userDetails.name.toLowerCase().includes('manjunath');
            
            headerUserRole.textContent = (userDetails.name === 'President' || isPresident) ? 'President' : 'Member';
        }
        console.log('User header displayed for:', userDetails.name);
    } else {
        // Hide user header if not logged in
        if (userHeaderInfo) {
            userHeaderInfo.style.display = 'none';
        }
        console.log('User not logged in, hiding user header');
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
