// categories page
(function () {
  const body = document.body;
  const modal = document.getElementById('categoryModal');
  const modalTitle = document.getElementById('modalTitle');
  const form = document.getElementById('categoryForm');
  const nameInput = document.getElementById('catName');
  const slugInput = document.getElementById('catSlug');
  const searchInput = document.getElementById('categorySearch');
  const statusFilter = document.getElementById('statusFilter');
  const rows = document.querySelectorAll('#categoryTableBody tr');
  const noResults = document.getElementById('noResults');

  // open modal 
  document.getElementById('addCategoryBtn')?.addEventListener('click', function () {
    modalTitle.textContent = 'Add Category';
    form.action = '/admin/categories';
    form.querySelector('input[name="_method"]')?.remove();
    form.reset();
    document.getElementById('catActive').checked = true;
    openModal();
  });

  // open moda
  document.querySelectorAll('[data-edit]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const row = btn.closest('tr');
      modalTitle.textContent = 'Edit Category';
      form.action = '/admin/categories/' + row.dataset.id;
      let method = form.querySelector('input[name="_method"]'); if (!method) { method = document.createElement('input'); method.type='hidden'; method.name='_method'; form.appendChild(method); } method.value='PUT';
      nameInput.value = row.querySelector('strong').textContent;
      slugInput.value = row.querySelector('.code-pill').textContent;
      document.getElementById('catIcon').value = '';
      document.getElementById('catDesc').value =
        row.querySelector('.cat-desc')?.textContent || '';
      document.getElementById('catActive').checked =
        row.dataset.status === 'active';
      openModal();
    });
  });

// slug from name
  nameInput?.addEventListener('input', function () {
    if (modalTitle.textContent === 'Add Category') {
      slugInput.value = this.value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }
  });

  // save (frontend only — Laravel will POST)
  document.getElementById('saveCategory')?.addEventListener('click', function () {
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    form.requestSubmit();
  });

  // close handlers
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
    setTimeout(function () { nameInput.focus(); }, 100);
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    body.style.overflow = '';
  }

  // live search + filter
  function applyFilters() {
    const q = (searchInput?.value || '').toLowerCase().trim();
    const status = statusFilter?.value || '';
    let visible = 0;

    rows.forEach(function (row) {
      const matchName = !q || row.dataset.name.includes(q);
      const matchStatus = !status || row.dataset.status === status;
      const show = matchName && matchStatus;
      row.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    noResults?.classList.toggle('hide', visible > 0);
  }

  searchInput?.addEventListener('input', applyFilters);
  statusFilter?.addEventListener('change', applyFilters);
})();