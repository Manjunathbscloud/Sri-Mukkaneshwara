function validateLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Replace these with your desired credentials
    const validUsername = 'admin';
    const validPassword = 'secure123';
    
    if (username === validUsername && password === validPassword) {
        // Store authentication status
        sessionStorage.setItem('isAuthenticated', 'true');
        // Redirect to loans page
        window.location.href = 'loans.html';
    } else {
        alert('Invalid credentials. Please try again.');
    }
}
