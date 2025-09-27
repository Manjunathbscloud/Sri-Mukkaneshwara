// Member database with credentials
const memberDatabase = {
    'Manjunath': {
        id: '001',
        password: '9591382942',
        name: 'Manjunath Banakar',
        role: 'president',
        email: 'manjunath.banakar@gmail.com',
        phone: '9591382942'
    },
    'Pratap': {
        id: '002',
        password: '7259907409',
        name: 'Pratap Banakar',
        role: 'vice-president',
        email: 'pratap.banakar@gmail.com',
        phone: '7259907409'
    },
    'Sarpabhushan': {
        id: '003',
        password: '9740373454',
        name: 'Sarpabhushana Banakar',
        role: 'member',
        email: 'sarpabhushana.banakar@gmail.com',
        phone: '9740373454'
    },
    'Mukkanna': {
        id: '004',
        password: '8147279081',
        name: 'Mukkanna Banakar',
        role: 'member',
        email: 'mukkanna.banakar@gmail.com',
        phone: '8147279081'
    },
    'Santosh': {
        id: '005',
        password: '9739678816',
        name: 'Santosh Banakar',
        role: 'member',
        email: 'santosh.banakar@gmail.com',
        phone: '9739678816'
    },
    'Pradeep': {
        id: '006',
        password: '9663644751',
        name: 'Pradeep Banakar',
        role: 'member',
        email: 'pradeep.banakar@gmail.com',
        phone: '9663644751'
    },
    'Praveen': {
        id: '007',
        password: '9538913204',
        name: 'Praveen Banakar',
        role: 'member',
        email: 'praveen.banakar@gmail.com',
        phone: '9538913204'
    }
};

// OTP storage and management
let currentOtp = null;
let otpExpiry = null;
let currentMember = null;
let otpTimer = null;

// Generate 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP (simulated - in real implementation, this would send SMS)
function sendOTP(phone, otp) {
    console.log(`OTP sent to ${phone}: ${otp}`);
    // In a real implementation, you would integrate with SMS service like:
    // - Twilio
    // - AWS SNS
    // - Firebase Auth
    // - Custom SMS gateway
    
    // For demo purposes, we'll show the OTP in console and alert
    alert(`OTP for ${phone}: ${otp}\n\n(This is a demo - in production, OTP would be sent via SMS)`);
}

// Start OTP timer
function startOTPTimer() {
    let timeLeft = 60; // 60 seconds
    const timerElement = document.getElementById('otpTimer');
    
    if (timerElement) {
        timerElement.textContent = `Resend OTP in ${timeLeft}s`;
    }
    
    otpTimer = setInterval(() => {
        timeLeft--;
        if (timerElement) {
            timerElement.textContent = `Resend OTP in ${timeLeft}s`;
        }
        
        if (timeLeft <= 0) {
            clearInterval(otpTimer);
            if (timerElement) {
                timerElement.textContent = '';
            }
            document.getElementById('resendOtpBtn').disabled = false;
        }
    }, 1000);
}

// Clear OTP timer
function clearOTPTimer() {
    if (otpTimer) {
        clearInterval(otpTimer);
        otpTimer = null;
    }
}

// Show error message
function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    const successElement = document.getElementById('successMessage');
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    if (successElement) {
        successElement.style.display = 'none';
    }
}

// Show success message
function showSuccess(message) {
    const successElement = document.getElementById('successMessage');
    const errorElement = document.getElementById('errorMessage');
    
    if (successElement) {
        successElement.textContent = message;
        successElement.style.display = 'block';
    }
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

// Clear messages
function clearMessages() {
    const errorElement = document.getElementById('errorMessage');
    const successElement = document.getElementById('successMessage');
    
    if (errorElement) {
        errorElement.style.display = 'none';
    }
    if (successElement) {
        successElement.style.display = 'none';
    }
}

// Show phone step
function showPhoneStep() {
    document.getElementById('phoneStep').style.display = 'block';
    document.getElementById('otpStep').style.display = 'none';
    document.getElementById('phone').value = '';
    clearMessages();
    clearOTPTimer();
}

// Show OTP step
function showOTPStep(phone) {
    document.getElementById('phoneStep').style.display = 'none';
    document.getElementById('otpStep').style.display = 'block';
    document.getElementById('phoneDisplay').textContent = phone;
    document.getElementById('otp').value = '';
    document.getElementById('resendOtpBtn').disabled = true;
    clearMessages();
}

// Handle send OTP button click
document.getElementById('sendOtpBtn').addEventListener('click', function(e) {
    e.preventDefault();
    
    let phone = document.getElementById('phone').value.trim();
    const errorMessage = document.getElementById('errorMessage');

    if (!phone) {
        showError('Please enter your phone number');
        return;
    }

    // Clean phone number - remove any non-digit characters
    phone = phone.replace(/\D/g, '');
    
    // Validate phone number format (10 digits starting with 6-9)
    if (phone.length !== 10 || !phone.match(/^[6-9]\d{9}$/)) {
        showError('Please enter a valid 10-digit Indian phone number');
        return;
    }

    // Find member by phone number
    console.log('Looking for phone:', phone);
    console.log('Available phones:', Object.values(memberDatabase).map(m => m.phone));
    
    // Try exact match first
    let member = Object.values(memberDatabase).find(m => m.phone === phone);
    
    // If no exact match, try with different formats
    if (!member) {
        // Try with +91 prefix
        const phoneWithPrefix = '+91' + phone;
        member = Object.values(memberDatabase).find(m => m.phone === phoneWithPrefix);
    }
    
    // If still no match, try without any prefix (just in case)
    if (!member) {
        const phoneWithoutPrefix = phone.replace(/^\+91/, '');
        member = Object.values(memberDatabase).find(m => m.phone === phoneWithoutPrefix);
    }
    
    console.log('Found member:', member);
    
    if (member) {
        currentMember = member;
        currentOtp = generateOTP();
        otpExpiry = Date.now() + (5 * 60 * 1000); // 5 minutes from now
        
        // Send OTP
        sendOTP(phone, currentOtp);
        
        // Show OTP step
        showOTPStep(phone);
        showSuccess('OTP sent successfully!');
        
        // Start timer
        startOTPTimer();
        
    } else {
        showError('Phone number not found. Please check your number.');
    }
});

// Handle verify OTP button click
document.getElementById('verifyOtpBtn').addEventListener('click', function(e) {
    e.preventDefault();
    
    const enteredOtp = document.getElementById('otp').value.trim();
    
    if (!enteredOtp) {
        showError('Please enter the OTP');
        return;
    }
    
    if (enteredOtp.length !== 6) {
        showError('OTP must be 6 digits');
        return;
    }
    
    // Check if OTP is expired
    if (Date.now() > otpExpiry) {
        showError('OTP has expired. Please request a new one.');
        return;
    }
    
    // Verify OTP
    if (enteredOtp === currentOtp) {
        // OTP is correct, proceed with login
        const member = currentMember;
        
        // Store user session data (only sessionStorage for proper session management)
        const sessionStartTime = Date.now().toString();
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('userEmail', member.email);
        sessionStorage.setItem('userName', member.name);
        sessionStorage.setItem('memberId', member.id);
        sessionStorage.setItem('userPhone', member.phone);
        sessionStorage.setItem('role', member.role);
        sessionStorage.setItem('userDetails', JSON.stringify(member));
        sessionStorage.setItem('isPresident', String(member.role === 'president'));
        sessionStorage.setItem('sessionStartTime', sessionStartTime);
        sessionStorage.setItem('lastActivity', Date.now().toString());

        showSuccess('Login successful! Redirecting...');
        
        // Clear OTP data
        currentOtp = null;
        currentMember = null;
        clearOTPTimer();
        
        // Redirect after a short delay
        setTimeout(() => {
            window.location.href = 'accounts.html';
        }, 1500);
        
    } else {
        showError('Invalid OTP. Please try again.');
    }
});

// Handle resend OTP button click
document.getElementById('resendOtpBtn').addEventListener('click', function(e) {
    e.preventDefault();
    
    if (currentMember) {
        currentOtp = generateOTP();
        otpExpiry = Date.now() + (5 * 60 * 1000); // 5 minutes from now
        
        // Send new OTP
        sendOTP(currentMember.phone, currentOtp);
        
        showSuccess('New OTP sent successfully!');
        
        // Reset timer
        clearOTPTimer();
        startOTPTimer();
        document.getElementById('resendOtpBtn').disabled = true;
    }
});

// Clear error when typing in phone field and format input
document.getElementById('phone').addEventListener('input', function(e) {
    clearMessages();
    
    // Only allow numbers and limit to 10 digits
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 10) {
        value = value.substring(0, 10);
    }
    e.target.value = value;
});

// Clear error when typing in OTP field
document.getElementById('otp').addEventListener('input', function() {
    clearMessages();
});

// Auto-format OTP input (only numbers)
document.getElementById('otp').addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
});

// Add timer display element
document.addEventListener('DOMContentLoaded', function() {
    const otpInfo = document.querySelector('.otp-info');
    if (otpInfo) {
        const timerElement = document.createElement('div');
        timerElement.id = 'otpTimer';
        timerElement.className = 'otp-timer';
        otpInfo.appendChild(timerElement);
    }
});