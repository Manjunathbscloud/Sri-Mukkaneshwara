// User credentials (in real application, this would be on server)
const users = [
    {
        username: "manjunath",
        password: "mb2024",
        role: "president",
        name: "Manjunath Banakar"
    },
    {
        username: "pratap",
        password: "pb2024",
        role: "vicePresident",
        name: "Pratap Banakar"
    },
    {
        username: "sarpa",
        password: "sb2024",
        role: "member",
        name: "Sarpabhushana Banakar"
    },
    {
        username: "pradeep",
        password: "pb2024",
        role: "member",
        name: "Pradeep Banakar"
    },
    {
        username: "santosh",
        password: "sb2024",
        role: "member",
        name: "Santosh Banakar"
    },
    {
        username: "mukkanna",
        password: "mb2024",
        role: "member",
        name: "Mukkanna Banakar"
    },
    {
        username: "praveen",
        password: "pb2024",
        role: "member",
        name: "Praveen Banakar"
    }
];

document.getElementById('loginBtn').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    // Find user
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Store login state
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('userName', user.name);
        sessionStorage.setItem('userRole', user.role);

        // Change this line to redirect to accounts page instead of deposits
        const returnUrl = sessionStorage.getItem('returnUrl') || 'accounts.html';
        window.location.href = returnUrl;
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