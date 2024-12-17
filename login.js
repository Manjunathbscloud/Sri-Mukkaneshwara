function validateCode(event) {
    event.preventDefault();
    
    const accessCode = document.getElementById('accessCode').value;
    
    // Replace this with your desired access code
    const validCode = '123456';
    
    if (accessCode === validCode) {
        try {
            // Store authentication status
            sessionStorage.setItem('isAuthenticated', 'true');
            console.log('Authentication successful');
            // Get the intended destination from URL parameters, or default to accounts.html
            const urlParams = new URLSearchParams(window.location.search);
            const destination = urlParams.get('redirect') || 'accounts.html';
            window.location.href = destination;
        } catch (error) {
            console.error('Error during authentication:', error);
            alert('An error occurred during authentication. Please try again.');
        }
    } else {
        alert('Invalid access code. Please try again.');
    }
}
