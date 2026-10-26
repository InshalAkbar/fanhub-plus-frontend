(function () {
  const rows = document.querySelectorAll('#articlesTableBody tr');
  const searchInput = document.getElementById('articleSearch');
  const categoryFilter = document.getElementById('categoryFilter');
  const statusFilter = document.getElementById('statusFilter');
  const noResults = document.getElementById('noResults');

  function applyFilters() {
    const q = (searchInput?.value || '').toLowerCase().trim();
    const category = categoryFilter?.value || '';
    const status = statusFilter?.value || '';
    let visible = 0;

    rows.forEach(function (row) {
      const matchQ = !q
        || row.dataset.title.includes(q)
        || row.dataset.author.includes(q);
      const matchCat = !category || row.dataset.category === category;
      const matchStatus = !status || row.dataset.status === status;
      const show = matchQ && matchCat && matchStatus;
      row.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    noResults?.classList.toggle('hide', visible > 0);
  }

  searchInput?.addEventListener('input', applyFilters);
  categoryFilter?.addEventListener('change', applyFilters);
  statusFilter?.addEventListener('change', applyFilters);
})();