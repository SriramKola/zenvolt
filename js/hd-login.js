class HDLoginApp {
    constructor() {
        this.init();
    }
    init() {
        this.setupEventListeners();
        this.checkRememberedUser();
    }
    setupEventListeners() {
        const loginForm = document.getElementById('loginForm');
        const toggleBtn = document.getElementById('togglePassword');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.togglePasswordVisibility());
        }
    }
    handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const rememberMe = document.getElementById('rememberMe');
        
        if (!this.validateForm(email, password)) {
            return;
        }
        
        this.showLoadingState();
        
        setTimeout(() => {
            this.loginUser(email.value, rememberMe.checked);
        }, 1500);
    }
    validateForm(email, password) {
        let isValid = true;
        
        if (!email.value || !this.isValidEmail(email.value)) {
            this.showFieldError(email, 'Please enter a valid email address');
            isValid = false;
        } else {
            this.clearFieldError(email);
        }
        if (!password.value || password.value.length < 6) {
            this.showFieldError(password, 'Password must be at least 6 characters');
            isValid = false;
        } else {
            this.clearFieldError(password);
        }
        return isValid;
    }
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    showFieldError(field, message) {
        field.classList.add('is-invalid');
        let feedback = field.parentNode.querySelector('.invalid-feedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            field.parentNode.appendChild(feedback);
        }
        feedback.textContent = message;
    }
    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const feedback = field.parentNode.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.remove();
        }
    }
    togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const toggleIcon = document.querySelector('#togglePassword i');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            toggleIcon.classList.remove('fa-eye-slash');
            toggleIcon.classList.add('fa-eye');
        }
    }
    showLoadingState() {
        const submitBtn = document.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        submitBtn.disabled = true;
    }
    hideLoadingState() {
        const submitBtn = document.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
        submitBtn.disabled = false;
    }
    loginUser(email, rememberMe) {
        localStorage.setItem('zonvolt_user', JSON.stringify({
            email: email,
            isLoggedIn: true,
            loginTime: new Date().toISOString()
        }));
        
        if (rememberMe) {
            localStorage.setItem('zonvolt_email', email);
        }        
        this.showSuccessMessage();       
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
    showSuccessMessage() {
        this.hideLoadingState();        
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
                z-index: 9999;
                animation: slideIn 0.3s ease;
            ">
                <i class="fas fa-check-circle me-2"></i>
                Login successful! Redirecting...
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    checkRememberedUser() {
        const rememberedEmail = localStorage.getItem('zonvolt_email');
        const emailInput = document.getElementById('email');
        const rememberCheckbox = document.getElementById('rememberMe');
        
        if (rememberedEmail && emailInput) {
            emailInput.value = rememberedEmail;
            if (rememberCheckbox) {
                rememberCheckbox.checked = true;
            }
        }
    }
}
function socialLogin(provider) {
    alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login would be implemented here`);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    .is-invalid {
        border-color: #dc3545 !important;
    }
    .invalid-feedback {
        display: block;
        width: 100%;
        margin-top: 0.25rem;
        font-size: 0.875em;
        color: #dc3545;
    }
`;
document.head.appendChild(style);
document.addEventListener('DOMContentLoaded', () => {
    new HDLoginApp();
});