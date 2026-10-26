// characters page
(function () {
  const cards = document.querySelectorAll('.char-card');
  const searchInput = document.getElementById('characterSearch');
  const categoryFilter = document.getElementById('categoryFilter');
  const roleFilter = document.getElementById('roleFilter');
  const noResults = document.getElementById('noResults');

  function applyFilters() {
    const q = (searchInput?.value || '').toLowerCase().trim();
    const category = categoryFilter?.value || '';
    const role = roleFilter?.value || '';
    let visible = 0;

    cards.forEach(function (card) {
      const matchQ = !q
        || card.dataset.name.includes(q)
        || card.dataset.fandom.includes(q);
      const matchCat = !category || card.dataset.category === category;
      const matchRole = !role || card.dataset.role === role;
      const show = matchQ && matchCat && matchRole;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    noResults?.classList.toggle('hide', visible > 0);
  }

  searchInput?.addEventListener('input', applyFilters);
  categoryFilter?.addEventListener('change', applyFilters);
  roleFilter?.addEventListener('change', applyFilters);
})();