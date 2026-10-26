// users page — search, filter, modal
(function () {
  const body = document.body;
  const rows = document.querySelectorAll('#usersTableBody tr');
  const searchInput = document.getElementById('userSearch');
  const roleFilter = document.getElementById('roleFilter');
  const statusFilter = document.getElementById('statusFilter');
  const noResults = document.getElementById('noResults');

  const modal = document.getElementById('userModal');
  const form = document.getElementById('userForm');

  document.getElementById('addUserBtn')?.addEventListener('click', function () {
    form.reset();
    openModal();
  });

  document.getElementById('saveUser')?.addEventListener('click', function () {
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    form.requestSubmit();
  });

  modal?.querySelectorAll('[data-close]').forEach(function (el) {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  function openModal() {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden';
    setTimeout(function () {
      document.getElementById('userName')?.focus();
    }, 100);
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    body.style.overflow = '';
  }

  function applyFilters() {
    const q = (searchInput?.value || '').toLowerCase().trim();
    const role = roleFilter?.value || '';
    const status = statusFilter?.value || '';
    let visible = 0;

    rows.forEach(function (row) {
      const matchQ = !q || row.dataset.name.includes(q) || row.dataset.email.includes(q);
      const matchRole = !role || row.dataset.role === role;
      const matchStatus = !status || row.dataset.status === status;
      const show = matchQ && matchRole && matchStatus;
      row.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    noResults?.classList.toggle('hide', visible > 0);
  }

  searchInput?.addEventListener('input', applyFilters);
  roleFilter?.addEventListener('change', applyFilters);
  statusFilter?.addEventListener('change', applyFilters);
})();