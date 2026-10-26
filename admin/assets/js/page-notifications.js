// notifications — filters + dismiss + mark all read
(function () {
  const cards = document.querySelectorAll('.notif-card');
  const readFilter = document.getElementById('readFilter');
  const typeFilter = document.getElementById('typeFilter');
  const noResults = document.getElementById('noResults');

  function applyFilters() {
    const read = readFilter?.value || '';
    const type = typeFilter?.value || '';
    let visible = 0;

    cards.forEach(function (card) {
      const matchRead = !read || card.dataset.read === read;
      const matchType = !type || card.dataset.type === type;
      const show = matchRead && matchType;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    noResults?.classList.toggle('hide', visible > 0);
  }

  readFilter?.addEventListener('change', applyFilters);
  typeFilter?.addEventListener('change', applyFilters);

  // mark all as read
  document.getElementById('markAllBtn')?.addEventListener('click', function () {
    // backend handoff: POST /admin/notifications/mark-all-read
    cards.forEach(function (card) {
      card.classList.remove('is-unread');
      card.classList.add('is-read');
      card.dataset.read = 'read';
    });
    applyFilters();
  });

  // dismiss
  document.querySelectorAll('[data-dismiss]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      // backend handoff: DELETE /admin/notifications/{id}
      btn.closest('.notif-card')?.remove();
    });
  });

  // click card → mark as read
  cards.forEach(function (card) {
    card.addEventListener('click', function (e) {
      if (e.target.closest('.notif-close')) return;
      if (card.classList.contains('is-unread')) {
        // backend handoff: POST /admin/notifications/{id}/read
        card.classList.remove('is-unread');
        card.classList.add('is-read');
        card.dataset.read = 'read';
      }
    });
  });
})();