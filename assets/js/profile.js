(() => {
  'use strict';

  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));

  /* ---------- Tabs ---------- */
  function initTabs() {
    const tabs = $$('.fh-profile__tab');
    const panels = $$('.fh-profile__panel');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const key = tab.dataset.tab;

        tabs.forEach((t) => t.classList.remove('is-active'));
        tab.classList.add('is-active');

        panels.forEach((p) => {
          p.classList.toggle('is-active', p.dataset.panel === key);
        });
      });
    });
  }

  /* ---------- Avatar Upload Preview ---------- */
  function initAvatarUpload() {
    const input = document.getElementById('fhAvatarInput');
    const avatar = document.getElementById('fhProfileAvatar');
    const initial = document.getElementById('fhProfileInitial');
    if (!input || !avatar) return;

    input.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        alert('Please choose an image file.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be smaller than 5 MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        avatar.style.backgroundImage = `url(${ev.target.result})`;
        if (initial) initial.style.opacity = '0';
      };
      reader.readAsDataURL(file);
    });
  }

  /* ---------- Share Profile ---------- */
  function initShare() {
    const btn = document.getElementById('fhShareProfile');
    if (!btn) return;

    btn.addEventListener('click', async () => {
      const url = window.location.href;
      const data = {
        title: 'Fan Hub Plus — Profile',
        text: 'Check out my Fan Hub Plus profile!',
        url
      };

      try {
        if (navigator.share) {
          await navigator.share(data);
        } else if (navigator.clipboard) {
          await navigator.clipboard.writeText(url);
          const original = btn.innerHTML;
          btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
          setTimeout(() => { btn.innerHTML = original; }, 1600);
        }
      } catch (e) {
        /* user cancelled */
      }
    });
  }

  /* ---------- Toggles ---------- */
  function initToggles() {
    $$('.fh-toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const on = btn.getAttribute('aria-checked') === 'true';
        btn.setAttribute('aria-checked', on ? 'false' : 'true');
        btn.classList.toggle('is-on', !on);
      });
    });
  }

  /* ---------- Font Size ---------- */
  function initFontSize() {
    const wrap = document.getElementById('fhPrefFont');
    if (!wrap) return;

    const root = document.documentElement;
    const saved = localStorage.getItem('fanhub-fontsize') || 'md';
    applyFontSize(saved);

    $$('button', wrap).forEach((b) => {
      if (b.dataset.size === saved) b.classList.add('is-active');
      b.addEventListener('click', () => {
        $$('button', wrap).forEach((x) => x.classList.remove('is-active'));
        b.classList.add('is-active');
        applyFontSize(b.dataset.size);
        try { localStorage.setItem('fanhub-fontsize', b.dataset.size); } catch (e) {}
      });
    });

    function applyFontSize(size) {
      const map = { sm: '14px', md: '16px', lg: '18px' };
      root.style.fontSize = map[size] || '16px';
    }
  }

  /* ---------- Dark Mode Toggle (pref card) ---------- */
  function initDarkPref() {
    const btn = document.getElementById('fhPrefDark');
    if (!btn) return;

    const isLight = document.documentElement.classList.contains('light-mode');
    btn.setAttribute('aria-checked', isLight ? 'false' : 'true');
    btn.classList.toggle('is-on', !isLight);

    btn.addEventListener('click', () => {
      const root = document.documentElement;
      const nowLight = root.classList.toggle('light-mode');
      btn.setAttribute('aria-checked', nowLight ? 'false' : 'true');
      btn.classList.toggle('is-on', !nowLight);
      try { localStorage.setItem('fanhub-theme', nowLight ? 'light' : 'dark'); } catch (e) {}
    });
  }

  /* ---------- Init ---------- */
  function init() {
    initTabs();
    initAvatarUpload();
    initShare();
    initToggles();
    initFontSize();
    initDarkPref();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();