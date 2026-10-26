// feedback list — search + filters
(function () {
  const rows = document.querySelectorAll('#feedbackTableBody tr');
  const searchInput = document.getElementById('feedbackSearch');
  const typeFilter = document.getElementById('typeFilter');
  const statusFilter = document.getElementById('statusFilter');
  const noResults = document.getElementById('noResults');

  function applyFilters() {
    const q = (searchInput?.value || '').toLowerCase().trim();
    const type = typeFilter?.value || '';
    const status = statusFilter?.value || '';
    let visible = 0;

    rows.forEach(function (row) {
      const matchQ = !q
        || row.dataset.subject.includes(q)
        || row.dataset.user.includes(q);
      const matchType = !type || row.dataset.type === type;
      const matchStatus = !status || row.dataset.status === status;
      const show = matchQ && matchType && matchStatus;
      row.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    noResults?.classList.toggle('hide', visible > 0);
  }

  searchInput?.addEventListener('input', applyFilters);
  typeFilter?.addEventListener('change', applyFilters);
  statusFilter?.addEventListener('change', applyFilters);
})();
