(() => {
  'use strict';

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));

  /* ==================== DOM ==================== */
  const formRequest  = $('#rpFormRequest');
  const formReset    = $('#rpFormReset');
  const successBox   = $('#rpSuccess');

  const emailInput   = $('#rpEmail');
  const newPassInput = $('#rpNewPassword');
  const confPassInput= $('#rpConfirmPassword');

  const emailError   = $('#rpEmailError');
  const newPassError = $('#rpNewPasswordError');
  const confPassError= $('#rpConfirmPasswordError');

  const submitReq    = $('#rpSubmitRequest');
  const submitReset  = $('#rpSubmitReset');

  const strengthBox  = $('#rpStrength');
  const strengthLbl  = $('#rpStrengthLabel');
  const rulesList    = $('#rpRules');

  const clearButtons = $$('[data-clear]');
  const toggleButtons= $$('[data-toggle]');

  /* ==================== VALIDATION HELPERS ==================== */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const rules = {
    length:  v => v.length >= 8,
    upper:   v => /[A-Z]/.test(v),
    lower:   v => /[a-z]/.test(v),
    number:  v => /\d/.test(v),
    special: v => /[^A-Za-z0-9]/.test(v)
  };

  function setFieldState(fieldWrap, state, message) {
    const field = fieldWrap.closest('.rp-field');
    if (!field) return;
    field.classList.toggle('is-invalid', state === 'invalid');
    field.classList.toggle('is-valid', state === 'valid');
    const errEl = field.querySelector('.rp-field__error');
    if (errEl) errEl.textContent = message || '';
  }

  function getFieldWrap(el) {
    return el && el.closest('.rp-field__wrap');
  }

  /* ==================== EMAIL VALIDATION ==================== */
  function validateEmail(showError) {
    const val = (emailInput.value || '').trim();
    const wrap = getFieldWrap(emailInput);
    if (!val) {
      if (showError) setFieldState(wrap, 'invalid', 'Email is required');
      return false;
    }
    if (!EMAIL_RE.test(val)) {
      if (showError) setFieldState(wrap, 'invalid', 'Please enter a valid email address');
      return false;
    }
    setFieldState(wrap, 'valid', '');
    return true;
  }


  function calcStrength(pwd) {
    let score = 0;
    if (rules.length(pwd))  score++;
    if (rules.upper(pwd))   score++;
    if (rules.lower(pwd))   score++;
    if (rules.number(pwd))  score++;
    if (rules.special(pwd)) score++;
    // Map 0-5 → 0-4
    if (score <= 1) return 0;
    if (score === 2) return 1;
    if (score === 3) return 2;
    if (score === 4) return 3;
    return 4;
  }

  function updateStrength(pwd) {
    const level = calcStrength(pwd);
    strengthBox.dataset.level = level;
    const labels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
    strengthLbl.textContent = pwd ? labels[level] : 'Password strength';
  }

  function updateRules(pwd) {
    if (!rulesList) return;
    $$('.rp-rules__item', rulesList).forEach(item => {
      const key = item.dataset.rule;
      const fn  = rules[key];
      if (!fn) return;
      item.classList.toggle('is-met', fn(pwd));
    });
  }


  function validatePassword(showError) {
    const val = newPassInput.value || '';
    const wrap = getFieldWrap(newPassInput);

    if (!val) {
      if (showError) setFieldState(wrap, 'invalid', 'Password is required');
      return false;
    }
    if (val.length < 8) {
      if (showError) setFieldState(wrap, 'invalid', 'Must be at least 8 characters');
      return false;
    }
    const missing = Object.keys(rules).filter(k => !rules[k](val));
    if (missing.length > 0) {
      if (showError) setFieldState(wrap, 'invalid', 'Password does not meet all requirements');
      return false;
    }
    setFieldState(wrap, 'valid', '');
    return true;
  }

  function validateConfirm(showError) {
    const val = confPassInput.value || '';
    const wrap = getFieldWrap(confPassInput);
    if (!val) {
      if (showError) setFieldState(wrap, 'invalid', 'Please confirm your password');
      return false;
    }
    if (val !== newPassInput.value) {
      if (showError) setFieldState(wrap, 'invalid', 'Passwords do not match');
      return false;
    }
    setFieldState(wrap, 'valid', '');
    return true;
  }

  function setLoading(btn, on) {
    if (!btn) return;
    btn.classList.toggle('is-loading', !!on);
    btn.disabled = !!on;
  }

  function simulateAsync(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  if (emailInput) {
    emailInput.addEventListener('input', () => {
      const clearBtn = $('[data-clear="email"]');
      if (clearBtn) clearBtn.hidden = !emailInput.value;
      if (emailInput.closest('.rp-field').classList.contains('is-invalid')) {
        validateEmail(true);
      }
    });
    emailInput.addEventListener('blur', () => {
      if (emailInput.value) validateEmail(true);
    });
  }


  if (newPassInput) {
    newPassInput.addEventListener('input', () => {
      const val = newPassInput.value;
      updateStrength(val);
      updateRules(val);
      const field = newPassInput.closest('.rp-field');
      if (field.classList.contains('is-invalid')) validatePassword(true);
      if (confPassInput.value) validateConfirm(false);
    });
    newPassInput.addEventListener('blur', () => {
      if (newPassInput.value) validatePassword(true);
    });
  }

  if (confPassInput) {
    confPassInput.addEventListener('input', () => {
      const field = confPassInput.closest('.rp-field');
      if (field.classList.contains('is-invalid') || confPassInput.value) {
        validateConfirm(true);
      }
    });
    confPassInput.addEventListener('blur', () => {
      if (confPassInput.value) validateConfirm(true);
    });
  }


  clearButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.clear;
      if (target === 'email') {
        emailInput.value = '';
        emailInput.focus();
        btn.hidden = true;
        setFieldState(getFieldWrap(emailInput), 'idle', '');
      }
    });
  });

  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.toggle;
      const input  = target === 'newPassword' ? newPassInput : confPassInput;
      if (!input) return;
      const isPwd = input.type === 'password';
      input.type = isPwd ? 'text' : 'password';
      const icon = btn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-eye', !isPwd);
        icon.classList.toggle('fa-eye-slash', isPwd);
      }
      btn.setAttribute('aria-label', isPwd ? 'Hide password' : 'Show password');
    });
  });


  if (formRequest) {
    formRequest.addEventListener('submit', async e => {
      e.preventDefault();
      if (!validateEmail(true)) {
        emailInput.focus();
        return;
      }

      setLoading(submitReq, true);
      await simulateAsync(1200);
      setLoading(submitReq, false);

      // In a real app, you'd call the backend here.
      // For the demo, we show a message and move to step 2.
      showToast('Reset link sent! Check your inbox (demo: continue below).');

      // Auto-advance to step 2 (in real app this would happen via email link)
      await simulateAsync(700);
      formRequest.hidden = true;
      formReset.hidden = false;
      if (newPassInput) newPassInput.focus();
    });
  }

  if (formReset) {
    formReset.addEventListener('submit', async e => {
      e.preventDefault();
      const okPwd = validatePassword(true);
      const okCnf = validateConfirm(true);
      if (!okPwd) { newPassInput.focus(); return; }
      if (!okCnf) { confPassInput.focus(); return; }

      setLoading(submitReset, true);
      await simulateAsync(1400);
      setLoading(submitReset, false);

      formReset.hidden = true;
      successBox.hidden = false;
      showToast('Password updated successfully!');
    });
  }


  let toastEl = null;
  let toastTimer = null;
  function showToast(message) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'rp-toast';
      document.body.appendChild(toastEl);
      // Inject minimal styles once
      if (!document.getElementById('rp-toast-style')) {
        const style = document.createElement('style');
        style.id = 'rp-toast-style';
        style.textContent = `
          .rp-toast {
            position: fixed;
            bottom: 28px; left: 50%;
            transform: translateX(-50%) translateY(120%);
            z-index: 9999;
            padding: 14px 22px;
            border-radius: 999px;
            background: rgba(10,22,19,.95);
            border: 1px solid rgba(16,185,129,.55);
            color: #fff;
            font-family: 'Outfit', system-ui, sans-serif;
            font-size: .88rem;
            font-weight: 600;
            box-shadow: 0 20px 40px -14px rgba(16,185,129,.7), 0 8px 24px -10px rgba(0,0,0,.9);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            transition: transform .5s cubic-bezier(.34,1.56,.64,1), opacity .3s;
            opacity: 0;
            pointer-events: none;
            max-width: calc(100vw - 40px);
            text-align: center;
          }
          .rp-toast.is-show {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
        `;
        document.head.appendChild(style);
      }
    }
    toastEl.textContent = message;
    requestAnimationFrame(() => toastEl.classList.add('is-show'));
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-show'), 3200);
  }


  try {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token && formRequest && formReset) {
      formRequest.hidden = true;
      formReset.hidden = false;
      showToast('Reset link verified. Choose a new password.');
      if (newPassInput) setTimeout(() => newPassInput.focus(), 300);
    }
  } catch (e) { /* ignore */ }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const active = document.activeElement;
      if (active && active.tagName === 'INPUT') active.blur();
    }
  });

})();