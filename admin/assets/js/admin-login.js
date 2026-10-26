(function () {
  'use strict';

  const form    = document.querySelector('.login-form');
  const btn     = document.getElementById('submitBtn');
  const toggle  = document.querySelector('.pw-toggle');
  const pwInput = document.getElementById('password');


  if (toggle && pwInput) {
    const icon = toggle.querySelector('i');
    toggle.addEventListener('click', function () {
      const visible = pwInput.type === 'text';
      pwInput.type = visible ? 'password' : 'text';
      icon.className = visible ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash';
      toggle.setAttribute('aria-label', visible ? 'Show password' : 'Hide password');
      pwInput.focus({ preventScroll: true });
    });
  }

  /* Loading state */
  if (form && btn) {
    form.addEventListener('submit', function (e) {
      if (!form.checkValidity()) {
        form.reportValidity();
        e.preventDefault();
        return;
      }
      btn.classList.add('is-loading');
      btn.setAttribute('aria-busy', 'true');
    });
  }
})();