function validateCode(event) {
    event.preventDefault();
    
    const accessCode = document.getElementById('accessCode').value;
    
    // Replace this with your desired access code
    const validCode = 'Banakar';
    
    if (accessCode === validCode) {
        // Store authentication status
        sessionStorage.setItem('isAuthenticated', 'true');
        // Redirect to loans page
        window.location.href = 'loans.html';
    } else {
        alert('Invalid access code. Please try again.');
    }
}
