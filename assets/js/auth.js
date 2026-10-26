(function () {
  'use strict';

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));


  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function showFormError(msg) {
    const box = $('#formError');
    const txt = $('#formErrorText');
    if (!box || !txt) {
      alert(msg); // fallback
      return;
    }
    txt.textContent = msg;
    box.style.display = 'flex';
  }

  function hideFormError() {
    const box = $('#formError');
    if (box) box.style.display = 'none';
  }

  function initPasswordToggles() {
    $$('.auth-toggle-pw').forEach(function (toggle) {
      const targetId = toggle.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;

      toggle.addEventListener('click', function () {
        const isVisible = input.type === 'text';
        input.type = isVisible ? 'password' : 'text';

        const icon = toggle.querySelector('i');
        if (icon) {
          icon.className = isVisible
            ? 'fa-regular fa-eye'
            : 'fa-regular fa-eye-slash';
        }
        toggle.setAttribute('aria-label', isVisible ? 'Show password' : 'Hide password');
        input.focus({ preventScroll: true });
      });
    });
  }

  /* ============================================================
   RESET PASSWORD
   ============================================================ */
function initResetPassword() {
  const form = $('#fhRpForm');
  const newPassInput = $('#fhRpPassword');
  const confirmInput = $('#fhRpConfirm');
  const submit = $('#fhRpSubmit');
  const strengthBar = $('#fhRpStrengthBar');
  const strengthLabel = $('#fhRpStrengthLabel');
  const validCard = $('#fhRpCard');
  const invalidCard = $('#fhRpInvalid');
  const emailEl = $('#fhRpEmail');
  const reqList = $('#fhRpReqs');

  if (!form || !newPassInput || !confirmInput || !submit) return;

  // ---- Validate token ----
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const emailParam = params.get('email');

  const list = loadRequests();
  const req = list.find(r => r.token === token);

  // No token or token not found → show invalid card
  if (!token || !req) {
    if (validCard) validCard.hidden = true;
    if (invalidCard) invalidCard.hidden = false;
    return;
  }

  // Token expiry check (15 min)
  const ageMin = (Date.now() - new Date(req.createdAt).getTime()) / 60000;
  if (ageMin > 15) {
    if (validCard) validCard.hidden = true;
    if (invalidCard) invalidCard.hidden = false;
    const msg = $('#fhRpInvalidMsg');
    if (msg) msg.textContent = 'This reset link has expired (15 min limit). Please request a new one.';
    return;
  }

  // Show valid card, hide invalid
  if (invalidCard) invalidCard.hidden = true;
  if (validCard) validCard.hidden = false;

  // Show email
  if (emailEl) emailEl.textContent = req.email || emailParam || 'your account';

  // ---- Strength scoring ----
  function scorePassword(p) {
    let score = 0;
    if (!p) return 0;
    if (p.length >= 8) score++;
    if (p.length >= 12) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return Math.min(score, 4);
  }

  function paintStrength(p) {
    if (!strengthBar || !strengthLabel) return;
    const s = scorePassword(p);
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    strengthBar.dataset.level = String(s);
    strengthBar.style.width = (s / 4 * 100) + '%';
    strengthLabel.dataset.level = String(s);
    strengthLabel.textContent = p ? (labels[s] || '') : '';
  }

  // ---- Requirement checklist ----
  function paintReqs(p) {
    if (!reqList) return;
    const checks = {
      length: p.length >= 8,
      upper:  /[A-Z]/.test(p),
      number: /[0-9]/.test(p),
      symbol: /[^A-Za-z0-9]/.test(p)
    };
    Object.keys(checks).forEach(key => {
      const li = reqList.querySelector(`[data-req="${key}"]`);
      if (li) li.classList.toggle('is-met', checks[key]);
    });
  }

  // ---- Field error helpers ----
  function setErr(field, msg) {
    const wrap = field.closest('.fh-auth__field');
    if (!wrap) return;
    const err = wrap.querySelector('.fh-auth__err');
    if (msg) {
      wrap.classList.add('has-error');
      if (err) err.textContent = msg;
    } else {
      wrap.classList.remove('has-error');
      if (err) err.textContent = '';
    }
  }

  // ---- Live listeners ----
  newPassInput.addEventListener('input', () => {
    paintStrength(newPassInput.value);
    paintReqs(newPassInput.value);
    setErr(newPassInput, '');
  });

  confirmInput.addEventListener('input', () => {
    setErr(confirmInput, '');
  });

  paintStrength('');
  paintReqs('');

  // ---- Submit ----
  form.addEventListener('submit', e => {
    e.preventDefault();

    const p = newPassInput.value;
    const c = confirmInput.value;

    if (p.length < 8) {
      setErr(newPassInput, 'Password must be at least 8 characters.');
      newPassInput.focus();
      return;
    }
    if (!/[A-Z]/.test(p)) {
      setErr(newPassInput, 'Add at least one uppercase letter.');
      newPassInput.focus();
      return;
    }
    if (!/[0-9]/.test(p)) {
      setErr(newPassInput, 'Add at least one number.');
      newPassInput.focus();
      return;
    }
    if (p !== c) {
      setErr(confirmInput, 'Passwords do not match.');
      confirmInput.focus();
      return;
    }

    const orig = submit.innerHTML;
    submit.disabled = true;
    submit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';

    setTimeout(() => {
      // Remove used token
      const updated = loadRequests().filter(r => r.token !== token);
      try { localStorage.setItem(STORE_KEY, JSON.stringify(updated)); } catch (err) {}

      // Save new password (demo — real app should hash)
      try {
        localStorage.setItem('fanhub-user-password', p);
      } catch (err) {}

      // Switch to success step
      showStep('success');

      submit.disabled = false;
      submit.innerHTML = orig;

      // Auto-redirect after 4s
      setTimeout(() => {
        window.location.href = 'login.html?reset=1';
      }, 4000);
    }, 900);
  });
}


  function initRegister() {
    const form = document.getElementById('registerForm');
    const btn  = document.getElementById('authBtn');
    if (!form || !btn) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      hideFormError();

      const nameEl    = document.getElementById('name');
      const emailEl   = document.getElementById('email');
      const passEl    = document.getElementById('password');
      const confirmEl = document.getElementById('confirm');
      const agreeEl   = document.getElementById('agree');

      const name     = nameEl    ? nameEl.value.trim()  : '';
      const email    = emailEl   ? emailEl.value.trim() : '';
      const password = passEl    ? passEl.value         : '';
      const confirm  = confirmEl ? confirmEl.value      : '';
      const agree    = agreeEl   ? agreeEl.checked      : true;

      if (name === '' || email === '' || password === '' || confirm === '') {
        showFormError('Please fill in all the fields.');
        return;
      }
      if (!isValidEmail(email)) {
        showFormError('Please enter a valid email address.');
        return;
      }
      if (password.length < 8) {
        showFormError('Password must be at least 8 characters.');
        return;
      }
      if (password !== confirm) {
        showFormError('Passwords do not match.');
        return;
      }
      if (!agree) {
        showFormError('Please accept the Terms and Privacy Policy.');
        return;
      }

      btn.classList.add('is-loading');
      btn.setAttribute('aria-busy', 'true');
      window.FHApi.post('/frontend/register', {name:name,email:email,password:password,confirm:confirm})
        .then(function (data) { window.location.href = data.redirect || 'dashboard.html'; })
        .catch(function (err) { showFormError(err.message || 'Registration failed.'); btn.classList.remove('is-loading'); btn.removeAttribute('aria-busy'); });
    });
  }


  function initLogin() {
    const form = document.getElementById('loginForm');
    const btn  = document.getElementById('authBtn');
    if (!form || !btn) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      hideFormError();

      const emailEl = document.getElementById('email');
      const passEl  = document.getElementById('password');
      const email   = emailEl ? emailEl.value.trim() : '';
      const password = passEl ? passEl.value : '';

      if (!isValidEmail(email)) {
        showFormError('Please enter a valid email address.');
        return;
      }
      if (!password) {
        showFormError('Please enter your password.');
        return;
      }

      btn.classList.add('is-loading');
      btn.setAttribute('aria-busy', 'true');
      window.FHApi.post('/frontend/login', {email:email,password:password,remember:($('#remember') || {}).checked || false})
        .then(function (data) { window.location.href = data.redirect || 'dashboard.html'; })
        .catch(function (err) { showFormError(err.message || 'Login failed.'); btn.classList.remove('is-loading'); btn.removeAttribute('aria-busy'); });
    });
  }

  const RESEND_COOLDOWN = 30;

  function showStep(name) {
    $$('.fh-auth__step').forEach(function (s) {
      s.classList.toggle('is-active', s.dataset.step === name);
    });
    if (history.replaceState) history.replaceState(null, '', name === 'success' ? '#sent' : '#');
  }

  function setFieldError(field, msg) {
    const wrap = field.closest('.fh-auth__field');
    if (!wrap) return;
    const err = wrap.querySelector('.fh-auth__err');
    wrap.classList.toggle('has-error', !!msg);
    if (err) err.textContent = msg || '';
  }

  let timerHandle = null;
  function startResendCooldown() {
    const btn = $('#fhFpResend'), timerEl = $('#fhFpTimer');
    if (!btn || !timerEl) return;
    let remaining = RESEND_COOLDOWN;
    btn.disabled = true; timerEl.hidden = false; timerEl.textContent = '(' + remaining + 's)';
    clearInterval(timerHandle);
    timerHandle = setInterval(function () {
      remaining--;
      if (remaining <= 0) { clearInterval(timerHandle); btn.disabled=false; timerEl.hidden=true; timerEl.textContent=''; }
      else timerEl.textContent='(' + remaining + 's)';
    },1000);
  }

  function initForgotPassword() {
    const form=$('#fhFpForm'), emailInput=$('#fhFpEmail'), submit=$('#fhFpSubmit'), sentTo=$('#fhFpSentTo'), resendBtn=$('#fhFpResend');
    if(!form || !emailInput || !submit || !window.FHApi) return;
    emailInput.addEventListener('input',()=>setFieldError(emailInput,''));

    const send=()=>{
      const email=emailInput.value.trim();
      if(!email){setFieldError(emailInput,'Email is required.');emailInput.focus();return;}
      if(!isValidEmail(email)){setFieldError(emailInput,'Please enter a valid email address.');emailInput.focus();return;}
      setFieldError(emailInput,'');
      const orig=submit.innerHTML; submit.disabled=true; submit.innerHTML='<i class="fas fa-spinner fa-spin"></i> Sending...';
      window.FHApi.post('/frontend/forgot-password',{email:email}).then(function(data){
        if(sentTo) sentTo.textContent=email;
        const mailBtn=$('.fh-auth__mail-btn');
        if(mailBtn && data.reset_url) mailBtn.href=data.reset_url;
        showStep('success'); startResendCooldown();
        if(data.reset_url) console.info('Fan Hub Plus reset link (local/dev):',data.reset_url);
      }).catch(function(err){setFieldError(emailInput,err.message||'Could not generate reset link.');})
      .finally(function(){submit.disabled=false;submit.innerHTML=orig;});
    };
    form.addEventListener('submit',e=>{e.preventDefault();send();});
    if(resendBtn) resendBtn.addEventListener('click',()=>{if(!resendBtn.disabled) send();});
  }

  function initResetPassword() {
    const form=$('#fhRpForm'), newPassInput=$('#fhRpPassword'), confirmInput=$('#fhRpConfirm'), submit=$('#fhRpSubmit');
    const strengthBar=$('#fhRpStrengthBar'), strengthLabel=$('#fhRpStrengthLabel'), invalidCard=$('#fhRpInvalid'), validCard=$('#fhRpCard');
    if(!form || !newPassInput || !confirmInput || !submit || !window.FHApi) return;
    const params=new URLSearchParams(window.location.search), token=params.get('token'), email=params.get('email');
    if(!token || !email){if(validCard)validCard.hidden=true;if(invalidCard)invalidCard.hidden=false;return;}
    if(validCard)validCard.hidden=false;if(invalidCard)invalidCard.hidden=true;
    const emailEl=$('#fhRpEmail');if(emailEl)emailEl.textContent=email;

    function paint(p){
      if(!strengthBar || !strengthLabel)return;
      let n=0;if(p.length>=8)n++;if(p.length>=12)n++;if(/[A-Z]/.test(p))n++;if(/[0-9]/.test(p))n++;if(/[^A-Za-z0-9]/.test(p))n++;
      n=Math.min(n,4);strengthBar.dataset.level=['','weak','fair','good','strong'][n];strengthLabel.textContent=p?['','WEAK','FAIR','GOOD','STRONG'][n]:'';
    }
    newPassInput.addEventListener('input',()=>{paint(newPassInput.value);setFieldError(newPassInput,'');});
    confirmInput.addEventListener('input',()=>setFieldError(confirmInput,''));
    form.addEventListener('submit',e=>{
      e.preventDefault();const pass=newPassInput.value,confirm=confirmInput.value;
      if(pass.length<8){setFieldError(newPassInput,'Password must be at least 8 characters.');return;}
      if(pass!==confirm){setFieldError(confirmInput,'Passwords do not match.');return;}
      const orig=submit.innerHTML;submit.disabled=true;submit.innerHTML='<i class="fas fa-spinner fa-spin"></i> Updating...';
      window.FHApi.post('/frontend/reset-password',{email:email,token:token,password:pass,confirm:confirm}).then(data=>{
        showStep('success');setTimeout(()=>window.location.href=data.redirect||'login.html?reset=1',1000);
      }).catch(err=>setFieldError(newPassInput,err.message||'Could not reset password.')).finally(()=>{submit.disabled=false;submit.innerHTML=orig;});
    });
  }


  function init() {
    initPasswordToggles();
    initRegister();        // register.html
    initLogin();           // login.html
    initForgotPassword();  // forgot-password.html
    initResetPassword();   // reset-password.html
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();