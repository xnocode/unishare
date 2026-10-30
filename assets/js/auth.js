/**
 * UniShare - Authentication & Registration Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check URL query parameters (e.g. ?mode=login or ?mode=register)
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');
  if (mode === 'login') {
    switchAuthView('login');
  } else {
    switchAuthView('register');
  }

  // Live University Email Validation
  const emailInput = document.getElementById('reg-email');
  const emailHelper = document.getElementById('email-helper');
  if (emailInput && emailHelper) {
    emailInput.addEventListener('input', () => {
      const val = emailInput.value.trim().toLowerCase();
      if (val.includes('.edu') || val.includes('.ac.bd') || val.includes('@std.') || val.includes('@student.')) {
        emailHelper.textContent = '✓ University domain recognized';
        emailHelper.classList.add('valid');
      } else if (val.length > 5 && val.includes('@')) {
        emailHelper.textContent = 'Please enter your official university email (e.g., student@du.ac.bd)';
        emailHelper.classList.remove('valid');
      } else {
        emailHelper.textContent = 'Only students with a university email can join.';
        emailHelper.classList.remove('valid');
      }
    });
  }
});

/**
 * Switch Between "Create account" and "Log in" views with smooth transitions
 * @param {'register' | 'login'} viewName 
 */
function switchAuthView(viewName) {
  const registerView = document.getElementById('view-register');
  const loginView = document.getElementById('view-login');
  const tabRegister = document.getElementById('tab-register');
  const tabLogin = document.getElementById('tab-login');
  const stepper = document.getElementById('auth-stepper');

  if (viewName === 'login') {
    if (registerView) registerView.classList.remove('active');
    if (loginView) loginView.classList.add('active');

    if (tabLogin) tabLogin.classList.add('active');
    if (tabRegister) tabRegister.classList.remove('active');

    // Hide stepper on login for cleaner view
    if (stepper) stepper.style.display = 'none';
  } else {
    if (loginView) loginView.classList.remove('active');
    if (registerView) registerView.classList.add('active');

    if (tabRegister) tabRegister.classList.add('active');
    if (tabLogin) tabLogin.classList.remove('active');

    // Show stepper on register
    if (stepper) stepper.style.display = 'grid';
  }
}

/**
 * Toggle Password Visibility
 * @param {string} inputId 
 * @param {HTMLButtonElement} btn 
 */
function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;

  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = 'Hide';
  } else {
    input.type = 'password';
    btn.textContent = 'Show';
  }
}

/**
 * Update Stepper Active State
 * @param {number} stepNum 
 */
function setStepperStep(stepNum) {
  for (let i = 1; i <= 4; i++) {
    const item = document.getElementById(`step-item-${i}`);
    if (!item) continue;

    item.classList.remove('active', 'completed');
    if (i < stepNum) {
      item.classList.add('completed');
    } else if (i === stepNum) {
      item.classList.add('active');
    }
  }
}

/**
 * Handle Registration & Login Form Submissions
 * @param {Event} event 
 * @param {'register' | 'login'} type 
 */
function handleAuthSubmit(event, type) {
  event.preventDefault();

  if (type === 'register') {
    const email = document.getElementById('reg-email')?.value;
    const pass = document.getElementById('reg-pass')?.value;
    const confirmPass = document.getElementById('reg-confirm-pass')?.value;

    if (pass !== confirmPass) {
      showToast('Password Mismatch', 'Passwords do not match. Please verify.', 'error');
      return;
    }

    // Advance stepper to Step 2: Confirm email
    setStepperStep(2);
    showToast('Verification Code Sent', `A 6-digit code was sent to ${email}`, 'success');
  } else {
    showToast('Welcome Back!', 'Logging you into your campus shelf...', 'success');
    setTimeout(() => {
      window.location.href = '../index.html';
    }, 1500);
  }
}

/**
 * Toast Notification Banner
 */
let toastTimer;
function showToast(title, message, status = 'success') {
  const toast = document.getElementById('auth-toast');
  const toastTitle = document.getElementById('toast-title');
  const toastMsg = document.getElementById('toast-msg');
  const toastIcon = document.getElementById('toast-icon');

  if (!toast || !toastTitle || !toastMsg) return;

  toastTitle.textContent = title;
  toastMsg.textContent = message;

  if (status === 'error') {
    toast.style.borderColor = '#c53030';
    if (toastIcon) toastIcon.style.background = '#c53030';
  } else {
    toast.style.borderColor = 'var(--brand)';
    if (toastIcon) toastIcon.style.background = 'var(--brand)';
  }

  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
