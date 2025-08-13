// Member database with credentials
const memberDatabase = {
    'Manjunath': {
        id: '001',
        password: '9591382942',
        name: 'Manjunath Banakar',
        role: 'president',
        email: 'manjunath.banakar@gmail.com',
        phone: '+919591382942'
    },
    'Pratap': {
        id: '002',
        password: '7259907409',
        name: 'Pratap Banakar',
        role: 'vice-president',
        email: 'pratap.banakar@gmail.com',
        phone: '+917259907409'
    },
    'Sarpabhushan': {
        id: '003',
        password: '9740373454',
        name: 'Sarpabhushana Banakar',
        role: 'member',
        email: 'sarpabhushana.banakar@gmail.com',
        phone: '+919740373454'
    },
    'Mukkanna': {
        id: '004',
        password: '8147279081',
        name: 'Mukkanna Banakar',
        role: 'member',
        email: 'mukkanna.banakar@gmail.com',
        phone: '+918618600807'
    },
    'Santosh': {
        id: '005',
        password: '9739678816',
        name: 'Santosh Banakar',
        role: 'member',
        email: 'santosh.banakar@gmail.com',
        phone: '+919739678816'
    },
    'Pradeep': {
        id: '006',
        password: '9663644751',
        name: 'Pradeep Banakar',
        role: 'member',
        email: 'pradeep.banakar@gmail.com',
        phone: '+919663644751'
    },
    'Praveen': {
        id: '007',
        password: '9538913204',
        name: 'Praveen Banakar',
        role: 'member',
        email: 'praveen.banakar@gmail.com',
        phone: '+919538913204'
    }
};

// Handle login form submission
document.getElementById('loginBtn').addEventListener('click', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('errorMessage');

    const member = memberDatabase[username];
    
    if (member && member.password === password) {
        // Store user session data
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('userEmail', member.email);
        sessionStorage.setItem('userName', member.name);
        sessionStorage.setItem('memberId', member.id);
        sessionStorage.setItem('userPhone', member.phone);
        sessionStorage.setItem('role', member.role); // store role
        sessionStorage.setItem('userDetails', JSON.stringify(member));

        // Everyone lands on accounts.html
        sessionStorage.setItem('isPresident', member.role === 'president');
        window.location.href = 'accounts.html';
    } else {
        errorMessage.textContent = 'Invalid username or password';
    }
});

// Clear error when typing
document.getElementById('username').addEventListener('input', clearError);
document.getElementById('password').addEventListener('input', clearError);

function clearError() {
    document.getElementById('errorMessage').textContent = '';
}
