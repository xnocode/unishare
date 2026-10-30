/**
 * UniShare - Authentication & Student Verification Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize 6-digit OTP Input Controls
  initOtpInputs();

  // Initialize Drag & Drop File Uploads
  initFileUploads();

  // Initialize Live Email Domain Checking
  initEmailValidator();

  // Initialize Password Requirement Checkers
  initPasswordChecker();
});

/**
 * 6-Digit OTP Input Box Handling
 * Auto-advances to next input, handles backspace, and supports copy-paste!
 */
function initOtpInputs() {
  const otpContainers = document.querySelectorAll('.otp-inputs');
  otpContainers.forEach(container => {
    const inputs = container.querySelectorAll('.otp-box');
    
    inputs.forEach((input, idx) => {
      // Auto-focus first input
      if (idx === 0 && !input.value) {
        setTimeout(() => input.focus(), 300);
      }

      input.addEventListener('input', (e) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        e.target.value = val ? val[0] : '';

        if (val && idx < inputs.length - 1) {
          inputs[idx + 1].focus();
        }
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !input.value && idx > 0) {
          inputs[idx - 1].focus();
        }
      });

      input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, inputs.length);
        pasted.split('').forEach((char, i) => {
          if (inputs[i]) inputs[i].value = char;
        });
        if (inputs[pasted.length]) {
          inputs[pasted.length].focus();
        } else if (inputs[inputs.length - 1]) {
          inputs[inputs.length - 1].focus();
        }
      });
    });
  });
}

/**
 * Drag & Drop File Upload with Preview Feedback
 */
function initFileUploads() {
  const dropzones = document.querySelectorAll('.upload-dropzone');
  dropzones.forEach(zone => {
    const input = zone.querySelector('.upload-input-file');
    const label = zone.querySelector('.upload-label');
    const sub = zone.querySelector('.upload-sub');

    if (!input) return;

    ['dragenter', 'dragover'].forEach(name => {
      zone.addEventListener(name, (e) => {
        e.preventDefault();
        zone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(name => {
      zone.addEventListener(name, (e) => {
        e.preventDefault();
        zone.classList.remove('dragover');
      });
    });

    zone.addEventListener('drop', (e) => {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        input.files = e.dataTransfer.files;
        handleFileSelect(input.files[0], label, sub);
      }
    });

    input.addEventListener('change', () => {
      if (input.files && input.files[0]) {
        handleFileSelect(input.files[0], label, sub);
      }
    });
  });
}

function handleFileSelect(file, labelEl, subEl) {
  if (labelEl) labelEl.textContent = '✓ ' + file.name;
  if (subEl) subEl.textContent = (file.size / (1024 * 1024)).toFixed(2) + ' MB · Ready to upload';
  showToast('File Attached', `${file.name} ready for verification`, 'success');
}

/**
 * Live University Email Domain Checking
 */
function initEmailValidator() {
  const emailInput = document.getElementById('reg-email');
  const emailHelper = document.getElementById('email-helper');
  if (emailInput && emailHelper) {
    emailInput.addEventListener('input', () => {
      const val = emailInput.value.trim().toLowerCase();
      if (val.includes('.edu') || val.includes('.ac.bd') || val.includes('@std.') || val.includes('@student.')) {
        emailHelper.textContent = '✓ University domain recognized';
        emailHelper.classList.add('valid');
      } else if (val.length > 5 && val.includes('@')) {
        emailHelper.textContent = 'Please enter your official university email (e.g. farhana@std.du.ac.bd)';
        emailHelper.classList.remove('valid');
      } else {
        emailHelper.textContent = 'Only students with a university email can join.';
        emailHelper.classList.remove('valid');
      }
    });
  }
}

/**
 * Live Password Criteria Checking (Length, Number/Letter, Match)
 */
function initPasswordChecker() {
  const newPass = document.getElementById('new-pass');
  const confirmPass = document.getElementById('confirm-pass');
  const checkLen = document.getElementById('check-len');
  const checkMix = document.getElementById('check-mix');
  const checkMatch = document.getElementById('check-match');

  if (newPass) {
    newPass.addEventListener('input', () => {
      const val = newPass.value;
      if (checkLen) {
        if (val.length >= 8) checkLen.classList.add('valid');
        else checkLen.classList.remove('valid');
      }
      if (checkMix) {
        if (/[A-Za-z]/.test(val) && /[0-9]/.test(val)) checkMix.classList.add('valid');
        else checkMix.classList.remove('valid');
      }
      checkPasswordMatch();
    });
  }

  if (confirmPass) {
    confirmPass.addEventListener('input', checkPasswordMatch);
  }

  function checkPasswordMatch() {
    if (!newPass || !confirmPass || !checkMatch) return;
    if (newPass.value && confirmPass.value && newPass.value === confirmPass.value) {
      checkMatch.classList.add('valid');
      checkMatch.textContent = '✓ Passwords match';
    } else {
      checkMatch.classList.remove('valid');
      checkMatch.textContent = 'Passwords must match';
    }
  }
}

/**
 * Toggle Password Visibility
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
 * Animated Toast Notification
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

/**
 * Handle Auth Submissions and Navigation
 */
function handleAuthSubmit(event, type) {
  event.preventDefault();
  if (type === 'register') {
    const pass = document.getElementById('reg-pass')?.value;
    const confirm = document.getElementById('reg-confirm-pass')?.value;
    if (pass && confirm && pass !== confirm) {
      showToast('Password Mismatch', 'Passwords do not match. Please verify.', 'error');
      return;
    }
    showToast('Account Created', 'Sending 6-digit confirmation code...', 'success');
    setTimeout(() => {
      window.location.href = 'confirm-email.html';
    }, 900);
  } else if (type === 'login') {
    showToast('Credentials Verified', 'Routing to two-factor verification...', 'success');
    setTimeout(() => {
      window.location.href = 'login-2fa.html';
    }, 900);
  }
}

/**
 * View switcher for tabbed pages
 */
function switchAuthView(target) {
  if (target === 'login') {
    window.location.href = 'login.html';
  } else {
    window.location.href = 'register.html';
  }
}

