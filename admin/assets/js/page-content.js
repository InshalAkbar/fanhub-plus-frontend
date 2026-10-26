// content library 
(function () {
  const rows = document.querySelectorAll('#contentTableBody tr');
  const searchInput = document.getElementById('contentSearch');
  const categoryFilter = document.getElementById('categoryFilter');
  const typeFilter = document.getElementById('typeFilter');
  const statusFilter = document.getElementById('statusFilter');
  const noResults = document.getElementById('noResults');

  function applyFilters() {
    const q = (searchInput?.value || '').toLowerCase().trim();
    const category = categoryFilter?.value || '';
    const type = typeFilter?.value || '';
    const status = statusFilter?.value || '';
    let visible = 0;

    rows.forEach(function (row) {
      const matchQ = !q || row.dataset.title.includes(q);
      const matchCat = !category || row.dataset.category === category;
      const matchType = !type || row.dataset.type === type;
      const matchStatus = !status || row.dataset.status === status;
      const show = matchQ && matchCat && matchType && matchStatus;
      row.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    noResults?.classList.toggle('hide', visible > 0);
  }

  searchInput?.addEventListener('input', applyFilters);
  categoryFilter?.addEventListener('change', applyFilters);
  typeFilter?.addEventListener('change', applyFilters);
  statusFilter?.addEventListener('change', applyFilters);
})();