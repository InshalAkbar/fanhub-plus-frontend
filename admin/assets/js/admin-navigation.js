// dropdown
(function () {
  const dropdowns = document.querySelectorAll('.dropdown');

  dropdowns.forEach(function (dd) {
    const trigger = dd.querySelector('[data-dropdown]');
    if (!trigger) return;

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();

      // close others
      dropdowns.forEach(function (other) {
        if (other !== dd) other.classList.remove('is-open');
      });

      dd.classList.toggle('is-open');
    });
  });

  document.addEventListener('click', function () {
    dropdowns.forEach(function (dd) { dd.classList.remove('is-open'); });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      dropdowns.forEach(function (dd) { dd.classList.remove('is-open'); });
    }
  });

  // search 
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      const input = document.querySelector('.navbar-search input');
      input && input.focus();
    }
  });
})();


(function () {
  const wrap = document.getElementById('adminGlobalSearch');
  const input = document.getElementById('globalSearchInput');
  const box = document.getElementById('globalSearchResults');
  if (!wrap || !input || !box) return;
  let timer;
  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
  }
  function render(results) {
    if (!results.length) {
      box.innerHTML = '<div class="global-search-empty">No results found</div>';
    } else {
      box.innerHTML = results.map(r => '<a class="global-search-item" href="' + r.url + '"><span class="global-search-type">' + escapeHtml(r.type) + '</span><span>' + escapeHtml(r.title) + '</span></a>').join('');
    }
    box.hidden = false;
  }
  async function search() {
    const q = input.value.trim();
    if (q.length < 2) { box.hidden = true; box.innerHTML = ''; return; }
    try {
      const res = await fetch('/admin/search?q=' + encodeURIComponent(q), { headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' } });
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      render(data.results || []);
    } catch (e) {
      box.innerHTML = '<div class="global-search-empty">Search unavailable</div>';
      box.hidden = false;
    }
  }
  input.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(search, 180); });
  input.addEventListener('focus', function () { if (input.value.trim().length >= 2) search(); });
  document.addEventListener('click', function (e) { if (!wrap.contains(e.target)) box.hidden = true; });
  input.addEventListener('keydown', function (e) { if (e.key === 'Escape') { box.hidden = true; input.blur(); } });
})();
