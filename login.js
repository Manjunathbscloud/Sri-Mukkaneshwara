// Member database with credentials
const memberDatabase = {
    'MB001': {  // Manjunath Banakar
        id: '001',
        password: 'mb001',  // You should use more secure passwords
        name: 'Manjunath Banakar',
        role: 'president',
        email: 'manjunath.banakar@gmail.com',
        phone: '+919591382942'
    },
    'PB002': {  // Pratap Banakar
        id: '002',
        password: 'pb002',
        name: 'Pratap Banakar',
        role: 'vice-president',
        email: 'pratap.banakar@gmail.com',
        phone: '+917259907409'
    },
    'SB003': {  // Sarpabhushana Banakar
        id: '003',
        password: 'sb003',
        name: 'Sarpabhushana Banakar',
        role: 'member',
        email: 'sarpabhushana.banakar@gmail.com',
        phone: '+919740373454'
    },
    'MB004': {  // Mukkanna Banakar
        id: '004',
        password: 'mb004',
        name: 'Mukkanna Banakar',
        role: 'member',
        email: 'mukkanna.banakar@gmail.com',
        phone: '+918618600807'
    },
    'SB005': {  // Santosh Banakar
        id: '005',
        password: 'sb005',
        name: 'Santosh Banakar',
        role: 'member',
        email: 'santosh.banakar@gmail.com',
        phone: '+919739678816'
    },
    'PB006': {  // Pradeep Banakar
        id: '006',
        password: 'pb006',
        name: 'Pradeep Banakar',
        role: 'member',
        email: 'pradeep.banakar@gmail.com',
        phone: '+919663644751'
    },
    'PB007': {  // Praveen Banakar
        id: '007',
        password: 'pb007',
        name: 'Praveen Banakar',
        role: 'member',
        email: 'praveen.banakar@gmail.com',
        phone: '+919538913204'
    }
};

// Handle login form submission
document.getElementById('loginBtn').addEventListener('click', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    // Check if user exists
    const member = memberDatabase[username];
    
    if (member && member.password === password) {
        // Store user info in session
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('userEmail', member.email);
        sessionStorage.setItem('userName', member.name);
        sessionStorage.setItem('memberId', member.id);
        
        // Set president status if applicable
        if (member.role === 'president') {
            sessionStorage.setItem('isPresident', 'true');
        } else {
            sessionStorage.setItem('isPresident', 'false');
        }

        // Redirect to accounts page
        const returnUrl = sessionStorage.getItem('returnUrl');
        if (returnUrl) {
            sessionStorage.removeItem('returnUrl');
            window.location.href = returnUrl;
        } else {
            window.location.href = 'accounts.html';
        }
    } else {
        errorMessage.textContent = 'Invalid username or password';
    }
});

// Clear error message when typing
document.getElementById('username').addEventListener('input', clearError);
document.getElementById('password').addEventListener('input', clearError);

function clearError() {
    document.getElementById('errorMessage').textContent = '';
}