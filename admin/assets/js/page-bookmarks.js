// bookmarks 
(function () {
  const rows = document.querySelectorAll('#bookmarksTableBody tr');
  const searchInput = document.getElementById('bookmarkSearch');
  const categoryFilter = document.getElementById('categoryFilter');
  const typeFilter = document.getElementById('typeFilter');
  const noResults = document.getElementById('noResults');

  function applyFilters() {
    const q = (searchInput?.value || '').toLowerCase().trim();
    const category = categoryFilter?.value || '';
    const type = typeFilter?.value || '';
    let visible = 0;

    rows.forEach(function (row) {
      const matchQ = !q
        || row.dataset.user.includes(q)
        || row.dataset.content.includes(q);
      const matchCat = !category || row.dataset.category === category;
      const matchType = !type || row.dataset.type === type;
      const show = matchQ && matchCat && matchType;
      row.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    noResults?.classList.toggle('hide', visible > 0);
  }

  searchInput?.addEventListener('input', applyFilters);
  categoryFilter?.addEventListener('change', applyFilters);
  typeFilter?.addEventListener('change', applyFilters);

  // chart
  const chartEl = document.getElementById('topChart');
  if (chartEl && typeof Chart !== 'undefined') {
    const ctx = chartEl.getContext('2d');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'Attack on Titan S4 Review',
          'Elden Ring Boss Guide',
          'BTS Dynamite Live',
          'Top 10 Manga of 2025',
          'Spider-Verse Soundtrack'
        ],
        datasets: [{
          data: [420, 380, 340, 290, 210],
          backgroundColor: [
            'rgba(130, 55, 172, 0.7)',
            'rgba(101, 60, 158, 0.7)',
            'rgba(111, 55, 136, 0.7)',
            'rgba(105, 26, 130, 0.7)',
            'rgba(34, 33, 122, 0.7)'
          ],
          borderRadius: 8,
          borderSkipped: false,
          barThickness: 22
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1A1C59',
            borderColor: '#452454',
            borderWidth: 1,
            titleColor: '#EDE9F5',
            bodyColor: '#B6A9CE',
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: function (c) {
                return ' ' + c.parsed.x + ' bookmarks';
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: 'rgba(90, 69, 120, 0.18)', drawTicks: false },
            border: { display: false },
            ticks: {
              color: '#7C7099',
              font: { size: 11 },
              padding: 8
            }
          },
          y: {
            grid: { display: false },
            border: { display: false },
            ticks: {
              color: '#B6A9CE',
              font: { size: 11.5, weight: '500' },
              padding: 8
            }
          }
        }
      }
    });
  }
})();