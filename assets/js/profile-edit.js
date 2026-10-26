(() => {
  'use strict';

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));

  const STORAGE_KEY = 'fanhub-profile';

  function showToast(message, type) {
    let toast = $('.fh-pe__toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'fh-pe__toast';
      document.body.appendChild(toast);
    }
    const bg = type === 'error'
      ? 'linear-gradient(135deg,#ef4444,#dc2626)'
      : 'linear-gradient(135deg,#10b981,#059669)';
    const icon = type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check';
    toast.style.background = bg;
    toast.style.boxShadow = type === 'error'
      ? '0 20px 40px -14px rgba(239,68,68,0.9)'
      : '0 20px 40px -14px rgba(16,185,129,0.9)';
    toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
    requestAnimationFrame(() => toast.classList.add('is-visible'));
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('is-visible'), 2800);
  }

  function initAvatar() {
    const input = $('#fhPeAvatarInput');
    const avatar = $('#fhPeAvatar');
    const initial = $('#fhPeAvatarInitial');
    const removeBtn = $('#fhPeAvatarRemove');
    const removeBtn2 = $('#fhPeAvatarRemove2');
    if (!input || !avatar) return;

    input.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        showToast('Please choose an image file', 'error');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image must be smaller than 5 MB', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        avatar.style.backgroundImage = `url(${ev.target.result})`;
        if (initial) initial.style.display = 'none';
        showToast('Profile photo updated', 'success');
        try { localStorage.setItem('fanhub-avatar', ev.target.result); } catch (err) {}
      };
      reader.readAsDataURL(file);
    });

    function removeAvatar() {
      avatar.style.backgroundImage = '';
      if (initial) initial.style.display = '';
      input.value = '';
      try { localStorage.removeItem('fanhub-avatar'); } catch (e) {}
      showToast('Profile photo removed', 'success');
    }

    removeBtn && removeBtn.addEventListener('click', removeAvatar);
    removeBtn2 && removeBtn2.addEventListener('click', removeAvatar);

    try {
      const saved = localStorage.getItem('fanhub-avatar');
      if (saved) {
        avatar.style.backgroundImage = `url(${saved})`;
        if (initial) initial.style.display = 'none';
      }
    } catch (e) {}
  }

  function initBioCounter() {
    const bio = $('#fhPeBio');
    const counter = $('#fhPeBioCount');
    if (!bio || !counter) return;
    const update = () => { counter.textContent = bio.value.length; };
    bio.addEventListener('input', update);
    update();
  }


  function initPasswordToggles() {
    $$('.fh-pe__pwd-toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        if (!target) return;
        const isPwd = target.type === 'password';
        target.type = isPwd ? 'text' : 'password';
        const icon = btn.querySelector('i');
        if (icon) {
          icon.className = isPwd ? 'fas fa-eye-slash' : 'fas fa-eye';
        }
      });
    });
  }

  function initToggles() {
    $$('.fh-toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const on = btn.getAttribute('aria-checked') === 'true';
        btn.setAttribute('aria-checked', on ? 'false' : 'true');
        btn.classList.toggle('is-on', !on);
      });
    });
  }


  function initThemeSegmented() {
    const wrap = $('[data-pref="theme"]');
    if (!wrap) return;
    const root = document.documentElement;

    const sync = () => {
      const isLight = root.classList.contains('light-mode');
      $$('button', wrap).forEach((b) => {
        b.classList.toggle('is-active', (b.dataset.value === 'light') === isLight);
      });
    };

    $$('button', wrap).forEach((b) => {
      b.addEventListener('click', () => {
        const light = b.dataset.value === 'light';
        root.classList.toggle('light-mode', light);
        try { localStorage.setItem('fanhub-theme', light ? 'light' : 'dark'); } catch (e) {}
        sync();
      });
    });

    sync();
  }

  function initFontSegmented() {
    const wrap = $('[data-pref="fontsize"]');
    if (!wrap) return;

    const map = { sm: '14px', md: '16px', lg: '18px' };
    const saved = localStorage.getItem('fanhub-fontsize') || 'md';
    document.documentElement.style.fontSize = map[saved] || '16px';

    $$('button', wrap).forEach((b) => {
      b.classList.toggle('is-active', b.dataset.value === saved);
      b.addEventListener('click', () => {
        $$('button', wrap).forEach((x) => x.classList.remove('is-active'));
        b.classList.add('is-active');
        document.documentElement.style.fontSize = map[b.dataset.value] || '16px';
        try { localStorage.setItem('fanhub-fontsize', b.dataset.value); } catch (e) {}
      });
    });
  }

 
  function validateForm() {
    const name = $('#fhPeName');
    const username = $('#fhPeUsername');
    const email = $('#fhPeEmail');
    const newPwd = $('#fhPeNewPwd');
    const confirmPwd = $('#fhPeConfirmPwd');
    const currentPwd = $('#fhPeCurrentPwd');

    let ok = true;

    const markErr = (el, msg) => {
      if (!el) return;
      el.classList.add('is-error');
      ok = false;
    };
    const clearErr = (el) => el && el.classList.remove('is-error');

    $$('.fh-pe__input').forEach(clearErr);

    if (!name.value.trim() || name.value.trim().length < 2) markErr(name);
    if (!username.value.trim() || !/^[a-zA-Z0-9_]{3,30}$/.test(username.value.trim())) markErr(username);
    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) markErr(email);

    const hasNew = newPwd.value.trim().length > 0;
    const hasConfirm = confirmPwd.value.trim().length > 0;

    if (hasNew || hasConfirm) {
      if (!currentPwd.value.trim()) markErr(currentPwd);
      if (newPwd.value.length < 8) markErr(newPwd);
      if (newPwd.value !== confirmPwd.value) markErr(confirmPwd);
    }

    return ok;
  }


  function initForm() {
    const form = $('#fhProfileForm');
    if (!form) return;

    const saveBtn = $('#fhPeSave');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!validateForm()) {
        showToast('Please fix the highlighted fields', 'error');
        const firstErr = $('.fh-pe__input.is-error');
        if (firstErr) {
          firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstErr.focus({ preventScroll: true });
        }
        return;
      }

      if (saveBtn) {
        saveBtn.disabled = true;
        const original = saveBtn.innerHTML;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

        const data = {
          name: $('#fhPeName')?.value.trim(),
          email: $('#fhPeEmail')?.value.trim(),
          bio: $('#fhPeBio')?.value.trim(),
          fandoms: $$('input[name="fandoms[]"]:checked').map(i => i.value)
        };
        if (window.FHApi) {
          window.FHApi.put('/frontend/profile', data).then(() => {
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (err) {}
            saveBtn.disabled = false; saveBtn.innerHTML = original;
            showToast('Profile updated successfully', 'success');
            setTimeout(() => { window.location.href = 'profile.html'; }, 900);
          }).catch((err) => {
            saveBtn.disabled = false; saveBtn.innerHTML = original;
            showToast(err.message || 'Could not update profile', 'error');
          });
        } else {
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (err) {}
          saveBtn.disabled = false; saveBtn.innerHTML = original;
          showToast('Profile updated successfully', 'success');
        }
      }
    });

    const resetBtn = $('#fhPeReset');
    resetBtn && resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!confirm('Reset all unsaved changes?')) return;
      loadSaved();
      showToast('Form reset', 'success');
    });
  }


  async function loadBackendProfile() {
    if (!window.FHApi) return;
    try {
      const r = await window.FHApi.profile();
      const u = r.user || {};
      if (u.name && $('#fhPeName')) $('#fhPeName').value = u.name;
      if (u.email && $('#fhPeEmail')) $('#fhPeEmail').value = u.email;
      if (u.bio && $('#fhPeBio')) { $('#fhPeBio').value = u.bio; const c=$('#fhPeBioCount'); if(c)c.textContent=u.bio.length; }
      if (Array.isArray(u.favorites)) $$('input[name="fandoms[]"]').forEach(i => i.checked = u.favorites.includes(i.value));
    } catch (e) {}
  }

  function loadSaved() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data.name) $('#fhPeName').value = data.name;
      if (data.username) $('#fhPeUsername').value = data.username;
      if (data.email) $('#fhPeEmail').value = data.email;
      if (data.phone) $('#fhPePhone').value = data.phone;
      if (data.bio) {
        $('#fhPeBio').value = data.bio;
        const c = $('#fhPeBioCount');
        if (c) c.textContent = data.bio.length;
      }
      if (data.city) $('#fhPeCity').value = data.city;
      if (data.country) $('#fhPeCountry').value = data.country;
      if (data.website) $('#fhPeWebsite').value = data.website;
      if (Array.isArray(data.fandoms)) {
        $$('input[name="fandoms[]"]').forEach((i) => {
          i.checked = data.fandoms.includes(i.value);
        });
      }
    } catch (e) {}
  }


  function initDanger() {
    const deactivate = $('#fhPeDeactivate');
    const del = $('#fhPeDelete');

    deactivate && deactivate.addEventListener('click', () => {
      if (!confirm('Deactivate your account? You can reactivate anytime.')) return;
      showToast('Account deactivated (demo)', 'success');
    });

    del && del.addEventListener('click', () => {
      const ok = prompt('Type "DELETE" to confirm account deletion:');
      if (ok !== 'DELETE') {
        if (ok !== null) showToast('Deletion cancelled', 'error');
        return;
      }
      showToast('Account deletion requested (demo)', 'success');
    });
  }


  function init() {
    initAvatar();
    initBioCounter();
    initPasswordToggles();
    initToggles();
    initThemeSegmented();
    initFontSegmented();
    initForm();
    initDanger();
    loadSaved();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();