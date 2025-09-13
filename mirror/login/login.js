// Login Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const phoneNumberInput = document.getElementById('phoneNumber');
    const countryCodeSelect = document.getElementById('countryCode');
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const otpSection = document.getElementById('otpSection');
    const phoneDisplay = document.getElementById('phoneDisplay');
    const otpDigits = document.querySelectorAll('.otp-digit');
    const resendOtpBtn = document.getElementById('resendOtpBtn');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    
    let otpTimer = null;
    let otpSent = false;
    let resendCount = 0;
    const maxResends = 3;

    // Phone number formatting
    phoneNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        // Limit to 10 digits for most countries
        if (value.length > 10) {
            value = value.substring(0, 10);
        }
        
        e.target.value = value;
        
        // Enable/disable send OTP button
        sendOtpBtn.disabled = value.length < 10;
    });

    // Country code change handler
    countryCodeSelect.addEventListener('change', function() {
        const countryCode = this.value;
        const phoneInput = phoneNumberInput;
        
        // Reset phone number when country changes
        phoneInput.value = '';
        phoneInput.placeholder = 'Enter your phone number';
        
        // Update max length based on country
        if (countryCode === '+1') {
            phoneInput.maxLength = 10;
        } else if (countryCode === '+44') {
            phoneInput.maxLength = 10;
        } else {
            phoneInput.maxLength = 10; // Default for most countries
        }
        
        sendOtpBtn.disabled = true;
    });

    // Send OTP form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!otpSent) {
            sendOTP();
        }
    });

    // Send OTP function
    function sendOTP() {
        const countryCode = countryCodeSelect.value;
        const phoneNumber = phoneNumberInput.value;
        const fullPhoneNumber = countryCode + phoneNumber;
        
        if (phoneNumber.length < 10) {
            showMessage('Please enter a valid phone number', 'error');
            return;
        }
        
        // Show loading state
        showLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            showLoading(false);
            
            // Show OTP section
            otpSection.style.display = 'block';
            phoneDisplay.textContent = fullPhoneNumber;
            otpSent = true;
            
            // Focus first OTP input
            otpDigits[0].focus();
            
            // Start resend timer
            startResendTimer();
            
            showMessage('OTP sent successfully!', 'success');
            
            // Scroll to OTP section
            otpSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
        }, 2000);
    }

    // OTP input handling
    otpDigits.forEach((digit, index) => {
        digit.addEventListener('input', function(e) {
            const value = e.target.value;
            
            // Only allow numbers
            if (!/^\d$/.test(value)) {
                e.target.value = '';
                return;
            }
            
            // Move to next input
            if (value && index < otpDigits.length - 1) {
                otpDigits[index + 1].focus();
            }
            
            // Check if all digits are filled
            checkOTPComplete();
        });
        
        digit.addEventListener('keydown', function(e) {
            // Handle backspace
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                otpDigits[index - 1].focus();
            }
            
            // Handle paste
            if (e.key === 'v' && e.ctrlKey) {
                e.preventDefault();
                handlePaste();
            }
        });
        
        digit.addEventListener('paste', function(e) {
            e.preventDefault();
            handlePaste();
        });
    });

    // Handle OTP paste
    function handlePaste() {
        navigator.clipboard.readText().then(text => {
            const otp = text.replace(/\D/g, '').substring(0, 6);
            
            if (otp.length === 6) {
                otpDigits.forEach((digit, index) => {
                    digit.value = otp[index] || '';
                    digit.classList.add('filled');
                });
                
                checkOTPComplete();
                otpDigits[5].focus();
            }
        }).catch(() => {
            // Fallback for browsers that don't support clipboard API
            console.log('Clipboard API not supported');
        });
    }

    // Check if OTP is complete
    function checkOTPComplete() {
        const otpValues = Array.from(otpDigits).map(digit => digit.value);
        const isComplete = otpValues.every(value => value !== '');
        
        verifyOtpBtn.disabled = !isComplete;
        
        // Add visual feedback
        otpDigits.forEach(digit => {
            if (digit.value) {
                digit.classList.add('filled');
            } else {
                digit.classList.remove('filled');
            }
        });
    }

    // Verify OTP
    verifyOtpBtn.addEventListener('click', function() {
        const otpValues = Array.from(otpDigits).map(digit => digit.value);
        const otp = otpValues.join('');
        
        if (otp.length !== 6) {
            showMessage('Please enter all 6 digits', 'error');
            return;
        }
        
        // Show loading state
        verifyOtpBtn.disabled = true;
        verifyOtpBtn.innerHTML = '<div class="spinner"></div> Verifying...';
        
        // Simulate verification
        setTimeout(() => {
            // Simulate success/failure
            const isSuccess = Math.random() > 0.3; // 70% success rate for demo
            
            if (isSuccess) {
                showMessage('Login successful! Redirecting...', 'success');
                
                // Simulate redirect
                setTimeout(() => {
                    // In a real app, you would redirect to the dashboard
                    alert('Login successful! This would redirect to the main app.');
                }, 1500);
            } else {
                showMessage('Invalid OTP. Please try again.', 'error');
                clearOTP();
                verifyOtpBtn.disabled = false;
                verifyOtpBtn.innerHTML = 'Verify & Login';
            }
        }, 2000);
    });

    // Resend OTP
    resendOtpBtn.addEventListener('click', function() {
        if (resendCount >= maxResends) {
            showMessage('Maximum resend attempts reached. Please try again later.', 'error');
            return;
        }
        
        resendCount++;
        sendOTP();
        
        // Update button text
        const remaining = maxResends - resendCount;
        if (remaining > 0) {
            resendOtpBtn.textContent = `Resend OTP (${remaining} left)`;
        } else {
            resendOtpBtn.textContent = 'Resend OTP';
            resendOtpBtn.disabled = true;
        }
    });

    // Helper functions
    function showLoading(show) {
        const btnText = sendOtpBtn.querySelector('.btn-text');
        const btnLoader = sendOtpBtn.querySelector('.btn-loader');
        
        if (show) {
            btnText.style.display = 'none';
            btnLoader.style.display = 'block';
            sendOtpBtn.disabled = true;
        } else {
            btnText.style.display = 'block';
            btnLoader.style.display = 'none';
            sendOtpBtn.disabled = false;
        }
    }

    function showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.success-message, .error-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message`;
        messageDiv.textContent = message;
        
        // Insert after login header
        const loginHeader = document.querySelector('.login-header');
        loginHeader.insertAdjacentElement('afterend', messageDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    function clearOTP() {
        otpDigits.forEach(digit => {
            digit.value = '';
            digit.classList.remove('filled');
        });
        otpDigits[0].focus();
    }

    function startResendTimer() {
        let timeLeft = 30;
        
        const updateTimer = () => {
            if (timeLeft > 0) {
                resendOtpBtn.textContent = `Resend OTP in ${timeLeft}s`;
                resendOtpBtn.disabled = true;
                timeLeft--;
                setTimeout(updateTimer, 1000);
            } else {
                resendOtpBtn.textContent = 'Resend OTP';
                resendOtpBtn.disabled = false;
            }
        };
        
        updateTimer();
    }

    // Initialize
    sendOtpBtn.disabled = true;
    verifyOtpBtn.disabled = true;
});
