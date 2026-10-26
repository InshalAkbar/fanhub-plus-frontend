// releases page — search + filters
(function () {
  const cards = document.querySelectorAll('.release-card');
  const searchInput = document.getElementById('releaseSearch');
  const categoryFilter = document.getElementById('categoryFilter');
  const typeFilter = document.getElementById('typeFilter');
  const noResults = document.getElementById('noResults');

  function applyFilters() {
    const q = (searchInput?.value || '').toLowerCase().trim();
    const category = categoryFilter?.value || '';
    const type = typeFilter?.value || '';
    let visible = 0;

    cards.forEach(function (card) {
      const matchQ = !q || card.dataset.title.includes(q);
      const matchCat = !category || card.dataset.category === category;
      const matchType = !type || card.dataset.type === type;
      const show = matchQ && matchCat && matchType;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    noResults?.classList.toggle('hide', visible > 0);
  }

  searchInput?.addEventListener('input', applyFilters);
  categoryFilter?.addEventListener('change', applyFilters);
  typeFilter?.addEventListener('change', applyFilters);
})();