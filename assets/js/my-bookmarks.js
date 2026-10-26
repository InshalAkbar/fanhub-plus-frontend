(() => {
  'use strict';

  const $  = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));

  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const DATA_URL = 'assets/data/bookmarks.json';

  const FALLBACK = { bookmarks: [] };

  const state = {
    all: [],
    filter: 'all',
    query: '',
    sort: 'recent'
  };

  const TYPE_ICON = {
    movie: 'fa-film',
    'tv-series': 'fa-tv',
    anime: 'fa-dragon',
    character: 'fa-user',
    article: 'fa-newspaper',
    merch: 'fa-store'
  };

  const TYPE_LABEL = {
    movie: 'Movie',
    'tv-series': 'TV Series',
    anime: 'Anime',
    character: 'Character',
    article: 'Article',
    merch: 'Merch'
  };

  function timeAgo(iso) {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function updateChipCounts() {
    const counts = { all: state.all.length };
    state.all.forEach((b) => {
      counts[b.type] = (counts[b.type] || 0) + 1;
    });
    $$('.fh-bm__chip-count').forEach((el) => {
      const key = el.dataset.count;
      el.textContent = counts[key] || 0;
    });
    const totalEl = $('#fhBmCount');
    if (totalEl) totalEl.textContent = state.all.length;
  }

  function applyFilters() {
    let list = [...state.all];

    if (state.filter !== 'all') {
      list = list.filter((b) => b.type === state.filter);
    }

    if (state.query) {
      const q = state.query.toLowerCase();
      list = list.filter((b) =>
        b.title.toLowerCase().includes(q) ||
        (b.subtitle || '').toLowerCase().includes(q) ||
        (b.type || '').toLowerCase().includes(q)
      );
    }

    if (state.sort === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (state.sort === 'type') {
      list.sort((a, b) => a.type.localeCompare(b.type));
    } else {
      list.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
    }

    return list;
  }

  function renderCard(b) {
    const icon = TYPE_ICON[b.type] || 'fa-bookmark';
    const label = TYPE_LABEL[b.type] || b.type;
    return `
      <article class="fh-bm__card" data-bookmark-id="${b.id}" tabindex="0" role="button">
        <button class="fh-bm__card-remove" data-remove="${b.id}" aria-label="Remove" type="button">
          <i class="fas fa-times"></i>
        </button>
        <span class="fh-bm__card-type">
          <i class="fas ${icon}"></i> ${esc(label)}
        </span>
        <div class="fh-bm__card-media">
          <img src="${esc(b.img)}" alt="${esc(b.title)}" loading="lazy" />
        </div>
        <div class="fh-bm__card-body">
          <h3 class="fh-bm__card-title">${esc(b.title)}</h3>
          <div class="fh-bm__card-meta">
            <span class="fh-bm__card-saved">
              <i class="fas fa-clock"></i> ${timeAgo(b.savedAt)}
            </span>
            <span>${esc(b.year || '')}</span>
          </div>
        </div>
      </article>
    `;
  }

  function render() {
    const grid = $('#fhBmGrid');
    const empty = $('#fhBmEmpty');
    if (!grid) return;

    const list = applyFilters();

    if (!list.length) {
      grid.innerHTML = '';
      grid.style.display = 'none';
      empty.style.display = 'flex';

      if (state.all.length === 0) {
        empty.querySelector('h3').textContent = 'No bookmarks yet';
        empty.querySelector('p').textContent = 'Start saving your favorite movies, characters, articles, and more.';
      } else {
        empty.querySelector('h3').textContent = 'No matches found';
        empty.querySelector('p').textContent = 'Try a different filter or clear the search.';
      }
      return;
    }

    grid.style.display = 'grid';
    empty.style.display = 'none';
    grid.innerHTML = list.map(renderCard).join('');

    const cards = $$('.fh-bm__card', grid);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const idx = cards.indexOf(el);
          setTimeout(() => el.classList.add('is-visible'), (idx % 5) * 60);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    cards.forEach((c) => io.observe(c));

    $$('.fh-bm__card', grid).forEach((card) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.fh-bm__card-remove')) return;
        const id = card.dataset.bookmarkId;
        window.location.href = `content-detail.html?id=${id}`;
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const id = card.dataset.bookmarkId;
          window.location.href = `content-detail.html?id=${id}`;
        }
      });
    });

    $$('.fh-bm__card-remove', grid).forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeBookmark(btn.dataset.remove, btn.closest('.fh-bm__card'));
      });
    });
  }

  function removeBookmark(id, card) {
    state.all = state.all.filter((b) => String(b.id) !== String(id));

    if (card) {
      card.style.transition = 'opacity 0.3s, transform 0.3s';
      card.style.opacity = '0';
      card.style.transform = 'scale(0.9)';
      setTimeout(() => {
        updateChipCounts();
        render();
      }, 300);
    } else {
      updateChipCounts();
      render();
    }
  }

  function initFilters() {
    $$('.fh-bm__chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        $$('.fh-bm__chip').forEach((c) => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        state.filter = chip.dataset.filter;
        render();
      });
    });
  }

  function initSearch() {
    const input = $('#fhBmSearch');
    if (!input) return;
    let t = 0;
    input.addEventListener('input', (e) => {
      clearTimeout(t);
      const v = e.target.value;
      t = setTimeout(() => {
        state.query = v.trim();
        render();
      }, 150);
    });
  }

  function initSort() {
    const sel = $('#fhBmSort');
    if (!sel) return;
    sel.addEventListener('change', (e) => {
      state.sort = e.target.value;
      render();
    });
  }

  function initClearAll() {
    const btn = $('#fhBmClearAll');
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (!state.all.length) return;
      if (!confirm('Remove all bookmarks? This cannot be undone.')) return;
      state.all = [];
      updateChipCounts();
      render();
    });
  }

  function initBrowseBtn() {
    const btn = $('#fhBmBrowseBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      window.location.href = 'browse.html';
    });
  }

  function initSortBtn() {
    const btn = $('#fhBmSortBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const sel = $('#fhBmSort');
      if (sel) sel.focus();
    });
  }

  async function loadData() {
    try {
      const res = await fetch(DATA_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error('fail');
      return await res.json();
    } catch (e) {
      return FALLBACK;
    }
  }

  async function init() {
    const data = await loadData();
    state.all = data.bookmarks || [];

    initFilters();
    initSearch();
    initSort();
    initClearAll();
    initBrowseBtn();
    initSortBtn();
    updateChipCounts();
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();