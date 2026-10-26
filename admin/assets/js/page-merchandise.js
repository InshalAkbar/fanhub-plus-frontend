// merchandise page — search + filters
(function () {
  const cards = document.querySelectorAll('.merch-card');
  const searchInput = document.getElementById('merchSearch');
  const categoryFilter = document.getElementById('categoryFilter');
  const tagFilter = document.getElementById('tagFilter');
  const noResults = document.getElementById('noResults');

  function applyFilters() {
    const q = (searchInput?.value || '').toLowerCase().trim();
    const category = categoryFilter?.value || '';
    const tag = tagFilter?.value || '';
    let visible = 0;

    cards.forEach(function (card) {
      const matchQ = !q || card.dataset.name.includes(q);
      const matchCat = !category || card.dataset.category === category;
      const matchTag = !tag || card.dataset.tag === tag;
      const show = matchQ && matchCat && matchTag;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    noResults?.classList.toggle('hide', visible > 0);
  }

  searchInput?.addEventListener('input', applyFilters);
  categoryFilter?.addEventListener('change', applyFilters);
  tagFilter?.addEventListener('change', applyFilters);
})();