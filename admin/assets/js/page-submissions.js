// fan submissions — search, filter, quick approve/reject
(function () {
  const rows = document.querySelectorAll('#subsTableBody tr');
  const searchInput = document.getElementById('subSearch');
  const statusFilter = document.getElementById('statusFilter');
  const categoryFilter = document.getElementById('categoryFilter');
  const noResults = document.getElementById('noResults');

  function applyFilters() {
    const q = (searchInput?.value || '').toLowerCase().trim();
    const status = statusFilter?.value || '';
    const category = categoryFilter?.value || '';
    let visible = 0;

    rows.forEach(function (row) {
      const matchQ = !q
        || row.dataset.title.includes(q)
        || row.dataset.user.includes(q);
      const matchStatus = !status || row.dataset.status === status;
      const matchCat = !category || row.dataset.category === category;
      const show = matchQ && matchStatus && matchCat;
      row.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    noResults?.classList.toggle('hide', visible > 0);
  }

  searchInput?.addEventListener('input', applyFilters);
  statusFilter?.addEventListener('change', applyFilters);
  categoryFilter?.addEventListener('change', applyFilters);

  // quick approve / reject (backend will POST)
  document.querySelectorAll('[data-approve]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      // action is handled by the server-side form
    });
  });

  document.querySelectorAll('[data-reject]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!confirm('Reject this submission?')) return;
      // action is handled by the server-side form
    });
  });
})();