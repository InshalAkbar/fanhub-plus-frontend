// events page — search + filters
(function () {
  const cards = document.querySelectorAll('.event-card');
  const searchInput = document.getElementById('eventSearch');
  const categoryFilter = document.getElementById('categoryFilter');
  const cityFilter = document.getElementById('cityFilter');
  const noResults = document.getElementById('noResults');

  function applyFilters() {
    const q = (searchInput?.value || '').toLowerCase().trim();
    const category = categoryFilter?.value || '';
    const city = cityFilter?.value || '';
    let visible = 0;

    cards.forEach(function (card) {
      const matchQ = !q
        || card.dataset.title.includes(q)
        || card.dataset.venue.includes(q);
      const matchCat = !category || card.dataset.category === category;
      const matchCity = !city || card.dataset.city === city;
      const show = matchQ && matchCat && matchCity;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    noResults?.classList.toggle('hide', visible > 0);
  }

  searchInput?.addEventListener('input', applyFilters);
  categoryFilter?.addEventListener('change', applyFilters);
  cityFilter?.addEventListener('change', applyFilters);

  // add event → backend will have event-form.php
  document.getElementById('addEventBtn')?.addEventListener('click', function () {
    window.location.href = this.dataset.url;
  });
})();