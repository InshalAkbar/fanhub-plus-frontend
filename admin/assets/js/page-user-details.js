// user details — tabs + edit modal
(function () {
  const body = document.body;

  // tabs
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('is-active'); });
      panels.forEach(function (p) { p.classList.remove('is-active'); });

      this.classList.add('is-active');
      document.querySelector(`[data-panel="${this.dataset.tab}"]`)?.classList.add('is-active');
    });
  });

  // edit modal
  const modal = document.getElementById('editModal');

  document.getElementById('editUser')?.addEventListener('click', function () {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden';
  });

  modal?.querySelectorAll('[data-close]').forEach(function (el) {
    el.addEventListener('click', function () {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      body.style.overflow = '';
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal?.classList.contains('is-open')) {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      body.style.overflow = '';
    }
  });

  // ban — backend handoff: POST /admin/users/{id}/ban
  document.getElementById('banUser')?.addEventListener('click', function (e) {
    if (!confirm('Ban this user?')) {
      e.preventDefault();
      return;
    }
    console.log('ban user');
  });
})();