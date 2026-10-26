(() => {
  'use strict';

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));

  const STORE_KEY = 'fanhub-feedback-list';
  const MAX_FILE  = 5 * 1024 * 1024; // 5 MB


  function loadFeedback() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
    } catch (e) { return []; }
  }

  function saveFeedback(list) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch (e) {}
  }

  function makeRefId() {
    const d = new Date();
    const stamp = String(d.getFullYear()).slice(2)
      + String(d.getMonth() + 1).padStart(2, '0')
      + String(d.getDate()).padStart(2, '0');
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `FB-${stamp}-${rand}`;
  }

  function timeAgo(iso) {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  const RATING_LABELS = ['Not rated', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'];

  function initRating() {
    const wrap  = $('#fhFbRating');
    const label = $('#fhFbRatingLabel');
    if (!wrap) return;

    let rating = 0;

    function paint(n, hover) {
      $$('.fh-fb__star', wrap).forEach((btn) => {
        const v = parseInt(btn.dataset.value, 10);
        const on = v <= n;
        btn.classList.toggle('is-on', on);
        const i = btn.querySelector('i');
        if (i) i.className = on ? 'fas fa-star' : 'far fa-star';
      });
      if (label && !hover) label.textContent = RATING_LABELS[rating] || 'Not rated';
      if (label && hover)  label.textContent = RATING_LABELS[n] || 'Not rated';
    }

    $$('.fh-fb__star', wrap).forEach((btn) => {
      const v = parseInt(btn.dataset.value, 10);
      btn.addEventListener('mouseenter', () => paint(v, true));
      btn.addEventListener('mouseleave', () => paint(rating, false));
      btn.addEventListener('click', () => { rating = (rating === v) ? 0 : v; paint(rating, false); });
    });
  }

  function initCounter() {
    const ta = $('#fhFbMessage');
    const c  = $('#fhFbCount');
    if (!ta || !c) return;
    function upd() { c.textContent = ta.value.length; }
    ta.addEventListener('input', upd);
    upd();
  }

  function initFilePreview() {
    const input   = $('#fhFbFile');
    const preview = $('#fhFbPreview');
    const img     = $('#fhFbPreviewImg');
    const remove  = $('#fhFbRemove');
    if (!input || !preview || !img) return;

    let currentUrl = null;

    input.addEventListener('change', () => {
      const file = input.files && input.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        alert('Please choose an image file.');
        input.value = '';
        return;
      }
      if (file.size > MAX_FILE) {
        alert('File is too large. Max 5 MB.');
        input.value = '';
        return;
      }

      if (currentUrl) URL.revokeObjectURL(currentUrl);
      currentUrl = URL.createObjectURL(file);
      img.src = currentUrl;
      preview.hidden = false;
    });

    if (remove) {
      remove.addEventListener('click', () => {
        input.value = '';
        if (currentUrl) { URL.revokeObjectURL(currentUrl); currentUrl = null; }
        img.src = '';
        preview.hidden = true;
      });
    }
  }

  function setErr(field, msg) {
    const wrap = field.closest('.fh-fb__field, .fh-fb__card');
    if (!wrap) return;
    const err = wrap.querySelector('.fh-fb__err');
    if (msg) {
      wrap.classList.add('has-error');
      if (err) err.textContent = msg;
    } else {
      wrap.classList.remove('has-error');
      if (err) err.textContent = '';
    }
  }

  function clearErrors() {
    $$('.fh-fb__field, .fh-fb__card').forEach((w) => w.classList.remove('has-error'));
    $$('.fh-fb__err').forEach((e) => { e.textContent = ''; });
  }

  function validate(form) {
    clearErrors();
    let ok = true;
    let firstBad = null;

    // Type
    const typeEl = form.querySelector('input[name="type"]:checked');
    if (!typeEl) {
      ok = false;
      const types = $('#fhFbForm .fh-fb__types');
      if (types) {
        types.style.transition = 'transform 0.25s';
        types.style.transform = 'translateX(-6px)';
        setTimeout(() => { types.style.transform = ''; }, 120);
      }
      firstBad = firstBad || types;
    }

    // Name
    const name = $('#fhFbName');
    if (name && name.value.trim().length < 2) {
      ok = false; setErr(name, 'Please enter your name.'); firstBad = firstBad || name;
    }

    // Email
    const email = $('#fhFbEmail');
    if (email) {
      const v = email.value.trim();
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(v)) { ok = false; setErr(email, 'Enter a valid email address.'); firstBad = firstBad || email; }
    }

    // Subject
    const subject = $('#fhFbSubject');
    if (subject && subject.value.trim().length < 4) {
      ok = false; setErr(subject, 'Subject is too short.'); firstBad = firstBad || subject;
    }

    // Message
    const message = $('#fhFbMessage');
    if (message && message.value.trim().length < 15) {
      ok = false; setErr(message, 'Please write at least 15 characters.'); firstBad = firstBad || message;
    }

    // Consent
    const consent = $('#fhFbConsent');
    if (consent && !consent.checked) {
      ok = false;
      const card = consent.closest('.fh-fb__card');
      if (card) {
        card.classList.add('has-error');
        const err = card.querySelector('.fh-fb__err[data-err="consent"]');
        if (err) err.textContent = 'Please accept to continue.';
      }
      firstBad = firstBad || consent;
    }

    if (!ok && firstBad) {
      firstBad.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return ok;
  }

  function initForm() {
    const form    = $('#fhFbForm');
    const success = $('#fhFbSuccess');
    const submit  = $('#fhFbSubmit');
    const refId   = $('#fhFbRefId');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validate(form)) return;

      // Fake loading
      const orig = submit.innerHTML;
      submit.disabled = true;
      submit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      const data = {
        id: makeRefId(),
        type: (form.querySelector('input[name="type"]:checked') || {}).value || 'query',
        name: $('#fhFbName').value.trim(),
        email: $('#fhFbEmail').value.trim(),
        subject: $('#fhFbSubject').value.trim(),
        message: $('#fhFbMessage').value.trim(),
        priority: $('#fhFbPriority').value,
        page: $('#fhFbPage').value,
        rating: ($$('.fh-fb__star.is-on').length || 0),
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
      const saveSuccess = () => {
        const list = loadFeedback(); list.unshift(data); saveFeedback(list);
        if (refId) refId.textContent = data.id;
        form.hidden = true;
        if (success) { success.hidden = false; success.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        submit.disabled = false; submit.innerHTML = orig; renderRecent();
      };
      if (window.FHApi) {
        window.FHApi.post('/frontend/feedback', {type:data.type === 'praise' ? 'suggestion' : data.type, message:(data.subject ? data.subject + '\n\n' : '') + data.message})
          .then(saveSuccess).catch((err) => { submit.disabled=false; submit.innerHTML=orig; showToast(err.message || 'Please sign in first.', 'error'); });
      } else { saveSuccess(); }
    });
  }


  function initReset() {
    const btn = $('#fhFbReset');
    const form = $('#fhFbForm');
    if (!btn || !form) return;
    btn.addEventListener('click', () => {
      clearErrors();
      $$('.fh-fb__star').forEach((b) => { b.classList.remove('is-on'); b.querySelector('i').className = 'far fa-star'; });
      const label = $('#fhFbRatingLabel'); if (label) label.textContent = 'Not rated';
      const preview = $('#fhFbPreview'); if (preview) preview.hidden = true;
      const img = $('#fhFbPreviewImg'); if (img) img.src = '';
      const c = $('#fhFbCount'); if (c) c.textContent = '0';
    });
  }


  function initAnother() {
    const btn = $('#fhFbAnother');
    const form = $('#fhFbForm');
    const success = $('#fhFbSuccess');
    if (!btn || !form || !success) return;
    btn.addEventListener('click', () => {
      form.reset();
      clearErrors();
      $$('.fh-fb__star').forEach((b) => { b.classList.remove('is-on'); b.querySelector('i').className = 'far fa-star'; });
      const label = $('#fhFbRatingLabel'); if (label) label.textContent = 'Not rated';
      const preview = $('#fhFbPreview'); if (preview) preview.hidden = true;
      const c = $('#fhFbCount'); if (c) c.textContent = '0';

      success.hidden = true;
      form.hidden = false;
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function renderRecent() {
    const wrap = $('#fhFbRecent');
    if (!wrap) return;

    const list = loadFeedback().slice(0, 3);
    if (!list.length) {
      wrap.innerHTML = '<p class="fh-fb__recent-empty">No feedback yet. Your submissions will show here.</p>';
      return;
    }

    const ICONS = {
      bug:        'fa-bug',
      suggestion: 'fa-lightbulb',
      query:      'fa-circle-question',
      praise:     'fa-heart'
    };

    wrap.innerHTML = list.map((f) => `
      <div class="fh-fb__recent-item">
        <div class="fh-fb__recent-icon" data-type="${esc(f.type)}">
          <i class="fas ${ICONS[f.type] || 'fa-comment'}"></i>
        </div>
        <div class="fh-fb__recent-body">
          <p class="fh-fb__recent-subject">${esc(f.subject)}</p>
          <span class="fh-fb__recent-meta">${esc(f.id)} · ${timeAgo(f.createdAt)}</span>
        </div>
      </div>
    `).join('');
  }


  function autoActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    $$('.fh-nav__link, .fh-mobile-menu__link').forEach((link) => {
      const href = (link.getAttribute('href') || '').split('?')[0].split('#')[0];
      if (!href) return;
      if (href === path) link.classList.add('is-active');
    });
  }

  function init() {
    autoActiveNav();
    initRating();
    initCounter();
    initFilePreview();
    initForm();
    initReset();
    initAnother();
    renderRecent();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();