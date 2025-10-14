// User Header Display Functions
function displayUserHeader() {
    // Always hide the user header badge
    const userHeaderInfo = document.getElementById('userHeaderInfo');
    if (userHeaderInfo) {
        userHeaderInfo.style.display = 'none';
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
