(() => {
  'use strict';

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));


  function showToast(message, type) {
    type = type || 'success';
    let toast = $('.fh-fs__toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'fh-fs__toast';
      document.body.appendChild(toast);
    }

    const icons = {
      success: 'fa-circle-check',
      error: 'fa-circle-exclamation',
      info: 'fa-circle-info'
    };

    toast.className = 'fh-fs__toast fh-fs__toast--' + type;
    toast.innerHTML = `<i class="fas ${icons[type]}"></i> ${message}`;

    requestAnimationFrame(() => toast.classList.add('is-visible'));
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('is-visible'), 3200);
  }


  function initCounters() {
    const pairs = [
      ['#fhFsTitle', '#fhFsTitleCount'],
      ['#fhFsDesc', '#fhFsDescCount'],
      ['#fhFsBody', '#fhFsBodyCount']
    ];

    pairs.forEach(([inputSel, counterSel]) => {
      const input = $(inputSel);
      const counter = $(counterSel);
      if (!input || !counter) return;

      const update = () => { counter.textContent = input.value.length; };
      input.addEventListener('input', update);
      update();
    });
  }

  function initTypes() {
    $$('.fh-fs__type input[type="radio"]').forEach((radio) => {
      radio.addEventListener('change', () => {
        $$('.fh-fs__type input[type="radio"]').forEach((r) => {
          r.closest('.fh-fs__type').classList.toggle('is-selected', r.checked);
        });
      });
      if (radio.checked) radio.closest('.fh-fs__type').classList.add('is-selected');
    });
  }


  function initUpload() {
    const wrap = $('#fhFsUpload');
    const fileInput = $('#fhFsFile');
    const preview = $('#fhFsPreview');
    const previewImg = $('#fhFsPreviewImg');
    const previewName = $('#fhFsPreviewName');
    const previewSize = $('#fhFsPreviewSize');
    const removeBtn = $('#fhFsPreviewRemove');
    if (!wrap || !fileInput) return;

    let currentFile = null;

    function formatSize(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / 1024 / 1024).toFixed(2) + ' MB';
    }

    function handleFile(file) {
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        showToast('Please select an image file', 'error');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showToast('Image must be smaller than 5 MB', 'error');
        return;
      }

      currentFile = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        previewImg.src = e.target.result;
        previewName.textContent = file.name;
        previewSize.textContent = formatSize(file.size);
        wrap.style.display = 'none';
        preview.style.display = 'flex';
      };
      reader.readAsDataURL(file);
    }

    function removeFile() {
      currentFile = null;
      fileInput.value = '';
      preview.style.display = 'none';
      wrap.style.display = '';
    }

    wrap.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
      handleFile(e.target.files && e.target.files[0]);
    });

    removeBtn && removeBtn.addEventListener('click', removeFile);

    /* Drag & drop */
    ['dragenter', 'dragover'].forEach((evt) => {
      wrap.addEventListener(evt, (e) => {
        e.preventDefault();
        wrap.classList.add('is-drag');
      });
    });

    ['dragleave', 'drop'].forEach((evt) => {
      wrap.addEventListener(evt, (e) => {
        e.preventDefault();
        wrap.classList.remove('is-drag');
      });
    });

    wrap.addEventListener('drop', (e) => {
      const files = e.dataTransfer && e.dataTransfer.files;
      if (files && files[0]) handleFile(files[0]);
    });

    /* expose remove for reset */
    wrap._resetUpload = removeFile;
  }


  function initTags() {
    const tagsWrap = $('#fhFsTags');
    const input = $('#fhFsTagInput');
    if (!tagsWrap || !input) return;

    const MAX_TAGS = 5;
    const tags = [];

    function renderTags() {
      tagsWrap.innerHTML = tags.map((t) =>
        `<span class="fh-fs__tag">${t}<button type="button" data-remove="${t}" aria-label="Remove tag"><i class="fas fa-times"></i></button></span>`
      ).join('');

      $$('[data-remove]', tagsWrap).forEach((btn) => {
        btn.addEventListener('click', () => {
          const i = tags.indexOf(btn.dataset.remove);
          if (i >= 0) tags.splice(i, 1);
          renderTags();
        });
      });
    }

    function addTag(raw) {
      const tag = String(raw || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
      if (!tag) return;
      if (tag.length < 2) {
        showToast('Tag must be at least 2 characters', 'error');
        return;
      }
      if (tags.includes(tag)) return;
      if (tags.length >= MAX_TAGS) {
        showToast(`Max ${MAX_TAGS} tags allowed`, 'error');
        return;
      }
      tags.push(tag);
      renderTags();
    }

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        addTag(input.value);
        input.value = '';
      } else if (e.key === 'Backspace' && !input.value && tags.length) {
        tags.pop();
        renderTags();
      }
    });

    input.addEventListener('blur', () => {
      if (input.value.trim()) {
        addTag(input.value);
        input.value = '';
      }
    });

    $$('.fh-fs__tag-suggest').forEach((btn) => {
      btn.addEventListener('click', () => addTag(btn.dataset.tag));
    });

    window._getTags = () => tags.slice();
    window._resetTags = () => { tags.length = 0; renderTags(); };
  }


  function validate() {
    const title = $('#fhFsTitle');
    const cat = $('#fhFsCategory');
    const desc = $('#fhFsDesc');
    const body = $('#fhFsBody');
    const checks = [
      $('#fhFsAgreeOriginal'),
      $('#fhFsAgreeGuidelines'),
      $('#fhFsAgreeReview')
    ];

    $$('.fh-fs__input').forEach((el) => el.classList.remove('is-error'));

    const errors = [];

    if (!title.value.trim()) {
      title.classList.add('is-error');
      errors.push('Title is required');
    }
    if (!cat.value) {
      cat.classList.add('is-error');
      errors.push('Category is required');
    }
    if (!desc.value.trim()) {
      desc.classList.add('is-error');
      errors.push('Short description is required');
    }
    if (!body.value.trim() || body.value.trim().length < 30) {
      body.classList.add('is-error');
      errors.push('Full content must be at least 30 characters');
    }

    const unchecked = checks.filter((c) => !c.checked).length;
    if (unchecked) {
      errors.push(`Please confirm all ${checks.length} checkboxes`);
    }

    return errors;
  }


  function initForm() {
    const form = $('#fhFsForm');
    const submitBtn = $('#fhFsSubmit');
    const resetBtn = $('#fhFsReset');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const errors = validate();

      if (errors.length) {
        showToast(errors[0], 'error');
        const firstErr = $('.fh-fs__input.is-error');
        if (firstErr) {
          firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstErr.focus({ preventScroll: true });
        }
        return;
      }

      const original = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

      const submission = {
        title: $('#fhFsTitle').value.trim(),
        type: ($$('input[name="type"]:checked')[0] || {}).value || 'article',
        category: $('#fhFsCategory').value,
        fandom: $('#fhFsFandom').value.trim(),
        desc: $('#fhFsDesc').value.trim(),
        body: $('#fhFsBody').value.trim(),
        tags: window._getTags ? window._getTags() : []
      };
      const done = () => {
        submitBtn.disabled = false; submitBtn.innerHTML = original;
        showToast('Submitted! Awaiting admin review.', 'success');
        setTimeout(() => { window.location.href = 'my-submissions.html'; }, 1000);
      };
      if (window.FHApi) {
        window.FHApi.post('/frontend/submissions', {title:submission.title, category:submission.category, body:submission.body})
          .then(done).catch((err) => { submitBtn.disabled=false; submitBtn.innerHTML=original; showToast(err.message || 'Please sign in first.', 'error'); });
      } else { done(); }
    });

    resetBtn && resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!confirm('Clear the entire form? Your progress will be lost.')) return;

      form.reset();
      $$('.fh-fs__input').forEach((el) => el.classList.remove('is-error'));
      $$('.fh-fs__type').forEach((t) => t.classList.remove('is-selected'));
      const firstType = $('.fh-fs__type input[type="radio"]');
      if (firstType) {
        firstType.checked = true;
        firstType.closest('.fh-fs__type').classList.add('is-selected');
      }

      if (window._resetTags) window._resetTags();
      if (window._resetUpload) window._resetUpload();

      showToast('Form reset', 'info');
    });
  }

  function initRecent() {
    const wrap = $('#fhFsRecent');
    if (!wrap) return;

    const TYPE_META = {
      article: { icon: 'fa-newspaper', c1: '#6366f1', c2: '#a855f7' },
      fanart: { icon: 'fa-palette', c1: '#ec4899', c2: '#a855f7' },
      cosplay: { icon: 'fa-user-ninja', c1: '#f59e0b', c2: '#ec4899' },
      character: { icon: 'fa-user', c1: '#22d3ee', c2: '#6366f1' },
      review: { icon: 'fa-star', c1: '#10b981', c2: '#22d3ee' },
      edit: { icon: 'fa-pen-to-square', c1: '#a855f7', c2: '#ec4899' }
    };

    /* Try to load from localStorage first */
    let list = [];
    try {
      const saved = JSON.parse(localStorage.getItem('fanhub-submissions') || '[]');
      list = saved.slice(0, 3);
    } catch (e) {}

    /* Fallback demo data */
    if (!list.length) {
      list = [
        { title: 'Attack on Titan S4 — Review', type: 'article', status: 'approved', submittedAt: '2026-09-20T10:00:00Z' },
        { title: 'Elden Ring Boss Guide', type: 'article', status: 'pending', submittedAt: '2026-09-24T14:00:00Z' },
        { title: 'Spider-Gwen Cosplay', type: 'cosplay', status: 'approved', submittedAt: '2026-09-15T18:00:00Z' }
      ];
    }

    wrap.innerHTML = list.map((s) => {
      const meta = TYPE_META[s.type] || TYPE_META.article;
      const statusLabel = { pending: 'Pending', approved: 'Approved', rejected: 'Rejected' }[s.status] || 'Pending';
      return `
        <a href="my-submissions.html" class="fh-fs-recent-item">
          <div class="fh-fs-recent-icon" style="--c1:${meta.c1}; --c2:${meta.c2}">
            <i class="fas ${meta.icon}"></i>
          </div>
          <div class="fh-fs-recent-body">
            <div class="fh-fs-recent-title">${s.title}</div>
            <div class="fh-fs-recent-meta">
              <span class="fh-fs-recent-status fh-fs-recent-status--${s.status}">${statusLabel}</span>
            </div>
          </div>
        </a>
      `;
    }).join('');
  }

  function init() {
    initCounters();
    initTypes();
    initUpload();
    initTags();
    initForm();
    initRecent();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();