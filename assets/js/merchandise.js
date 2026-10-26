(() => {
  'use strict';

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));

  const PER_PAGE = 8;
  const BOOKMARK_KEY = 'fanhub-merch-bookmarks';


  let ITEMS = [
    { id: 1, name: 'Eren Yeager Attack Titan Figure', cat: 'anime', catLabel: 'Anime', catIcon: 'fa-dragon', tag: 'limited', price: 49.99, views: 12400, img: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=800', upcoming: false, added: '2026-09-15' },
    { id: 2, name: 'Elden Ring "Tarnished" T-Shirt', cat: 'gaming', catLabel: 'Gaming', catIcon: 'fa-gamepad', tag: 'preorder', price: 29.99, views: 8200, img: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=800', upcoming: true, added: '2026-09-20' },
    { id: 3, name: 'BTS Light Stick Ver. 4', cat: 'kpop', catLabel: 'K-Pop', catIcon: 'fa-music', tag: 'collectible', price: 89.99, views: 21500, img: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=800', upcoming: false, added: '2026-09-10' },
    { id: 4, name: 'Jinx Cosplay Wig — Arcane', cat: 'cosplay', catLabel: 'Cosplay', catIcon: 'fa-user-ninja', tag: 'collectible', price: 45.00, views: 5600, img: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=800', upcoming: false, added: '2026-09-05' },
    { id: 5, name: 'Naruto Leaf Village Headband', cat: 'anime', catLabel: 'Anime', catIcon: 'fa-dragon', tag: null, price: 19.99, views: 15800, img: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800', upcoming: false, added: '2026-08-28' },
    { id: 6, name: 'Spider-Man No Way Home Hoodie', cat: 'movies', catLabel: 'Movies', catIcon: 'fa-film', tag: null, price: 54.99, views: 9800, img: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=800', upcoming: false, added: '2026-09-12' },
    { id: 7, name: 'Minecraft Creeper Plush XL', cat: 'gaming', catLabel: 'Gaming', catIcon: 'fa-gamepad', tag: null, price: 24.99, views: 7300, img: 'https://images.unsplash.com/photo-1587573089734-599851b0fbd7?q=80&w=800', upcoming: false, added: '2026-08-20' },
    { id: 8, name: 'Sailor Moon Cosmic Heart Compact', cat: 'anime', catLabel: 'Anime', catIcon: 'fa-dragon', tag: 'collectible', price: 64.99, views: 18900, img: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?q=80&w=800', upcoming: false, added: '2026-09-08' },
    { id: 9, name: 'Iron Man Mark 85 Helmet Replica', cat: 'movies', catLabel: 'Movies', catIcon: 'fa-film', tag: 'limited', price: 199.99, views: 32000, img: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=800', upcoming: false, added: '2026-09-01' },
    { id: 10, name: 'Chainsaw Man Pochita Keychain', cat: 'manga', catLabel: 'Manga', catIcon: 'fa-scroll', tag: null, price: 12.99, views: 6400, img: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=800', upcoming: false, added: '2026-09-18' },
    { id: 11, name: 'Attack on Titan Survey Corps Jacket', cat: 'anime', catLabel: 'Anime', catIcon: 'fa-dragon', tag: 'preorder', price: 79.99, views: 11200, img: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=800', upcoming: true, added: '2026-09-22' },
    { id: 12, name: 'Batman The Dark Knight Statue', cat: 'comics', catLabel: 'Comics', catIcon: 'fa-book-open', tag: 'limited', price: 149.99, views: 14300, img: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=800', upcoming: false, added: '2026-08-30' },
    { id: 13, name: 'Demon Slayer Nezuko Figurine', cat: 'anime', catLabel: 'Anime', catIcon: 'fa-dragon', tag: 'collectible', price: 55.00, views: 20100, img: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?q=80&w=800', upcoming: false, added: '2026-09-14' },
    { id: 14, name: 'Zelda Master Sword Replica', cat: 'gaming', catLabel: 'Gaming', catIcon: 'fa-gamepad', tag: 'limited', price: 129.99, views: 26700, img: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=800', upcoming: true, added: '2026-09-25' },
    { id: 15, name: 'Blackpink Born Pink Album Set', cat: 'kpop', catLabel: 'K-Pop', catIcon: 'fa-music', tag: null, price: 39.99, views: 16800, img: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=800', upcoming: false, added: '2026-09-03' }
  ];


  const state = {
    tab: 'all',
    category: 'all',
    tag: 'all',
    sort: 'popular',
    search: '',
    view: 'grid',
    page: 1
  };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function formatViews(n) {
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return String(n);
  }

  function tagLabel(t) {
    return t === 'limited' ? 'Limited Edition'
         : t === 'preorder' ? 'Pre-Order'
         : t === 'collectible' ? 'Collectible'
         : '';
  }

  function getBookmarks() {
    try { return JSON.parse(localStorage.getItem(BOOKMARK_KEY) || '[]'); }
    catch (e) { return []; }
  }

  function isBookmarked(id) {
    return getBookmarks().indexOf(id) !== -1;
  }

  function toggleBookmark(id) {
    const list = getBookmarks();
    const i = list.indexOf(id);
    if (i === -1) list.push(id);
    else list.splice(i, 1);
    try { localStorage.setItem(BOOKMARK_KEY, JSON.stringify(list)); } catch (e) {}
    return i === -1;
  }


  function getFiltered() {
    let list = ITEMS.slice();

    if (state.tab === 'upcoming') list = list.filter((i) => i.upcoming);
    else if (state.tab === 'limited') list = list.filter((i) => i.tag === 'limited');
    else if (state.tab === 'preorder') list = list.filter((i) => i.tag === 'preorder');

    if (state.category !== 'all') list = list.filter((i) => i.cat === state.category);
    if (state.tag !== 'all') list = list.filter((i) => i.tag === state.tag);

    if (state.search.trim()) {
      const q = state.search.trim().toLowerCase();
      list = list.filter((i) => i.name.toLowerCase().includes(q) || i.catLabel.toLowerCase().includes(q));
    }

    switch (state.sort) {
      case 'popular': list.sort((a, b) => b.views - a.views); break;
      case 'recent': list.sort((a, b) => new Date(b.added) - new Date(a.added)); break;
      case 'price-low': list.sort((a, b) => a.price - b.price); break;
      case 'price-high': list.sort((a, b) => b.price - a.price); break;
      case 'alpha': list.sort((a, b) => a.name.localeCompare(b.name)); break;
    }

    return list;
  }


  function renderCard(item) {
    const tagHtml = item.tag
      ? `<span class="fh-merch-card__tag" data-tag="${item.tag}">${tagLabel(item.tag)}</span>`
      : '';
    const bm = isBookmarked(item.id) ? 'is-active' : '';
    const bmIcon = bm ? 'fas fa-bookmark' : 'far fa-bookmark';

    return `
      <article class="fh-merch-card" data-id="${item.id}">
        <a href="merchandise-single.html?id=${item.id}" class="fh-merch-card__img">
          ${tagHtml}
          <img src="${esc(item.img)}" alt="${esc(item.name)}" loading="lazy" />
        </a>
        <button class="fh-merch-card__bookmark ${bm}" data-bookmark="${item.id}" aria-label="Bookmark">
          <i class="${bmIcon}"></i>
        </button>
        <div class="fh-merch-card__body">
          <span class="fh-merch-card__cat"><i class="fas ${item.catIcon}"></i> ${esc(item.catLabel)}</span>
          <h3 class="fh-merch-card__title">
            <a href="merchandise-single.html?id=${item.id}" style="color:inherit;text-decoration:none;">${esc(item.name)}</a>
          </h3>
          <div class="fh-merch-card__price">$${item.price.toFixed(2)}</div>
          <div class="fh-merch-card__meta">
            <span><i class="fas fa-eye"></i> ${formatViews(item.views)}</span>
            <span><i class="fas fa-tag"></i> ${item.tag ? tagLabel(item.tag) : 'Standard'}</span>
          </div>
        </div>
      </article>`;
  }

 
  function render() {
    const grid = $('#fhMerchGrid');
    const empty = $('#fhMerchEmpty');
    const loadWrap = $('#fhMerchLoadWrap');
    const count = $('#fhMerchResultCount');
    if (!grid) return;

    const filtered = getFiltered();
    const shown = filtered.slice(0, state.page * PER_PAGE);

    if (count) count.textContent = `${filtered.length} item${filtered.length === 1 ? '' : 's'}`;

    if (!filtered.length) {
      grid.innerHTML = '';
      if (empty) empty.style.display = 'flex';
      if (loadWrap) loadWrap.style.display = 'none';
      return;
    }

    if (empty) empty.style.display = 'none';
    grid.innerHTML = shown.map(renderCard).join('');
    grid.classList.toggle('is-list', state.view === 'list');

    if (loadWrap) {
      loadWrap.style.display = filtered.length > shown.length ? 'flex' : 'none';
    }
  }


  function initTabs() {
    const tabs = $$('.fh-merch__tab');
    tabs.forEach((t) => {
      t.addEventListener('click', () => {
        tabs.forEach((x) => x.classList.remove('is-active'));
        t.classList.add('is-active');
        state.tab = t.dataset.tab;
        state.page = 1;
        render();
      });
    });

    const setCount = (id, n) => { const el = $(id); if (el) el.textContent = n; };
    setCount('#fhMerchTabAll', ITEMS.length);
    setCount('#fhMerchTabUpcoming', ITEMS.filter((i) => i.upcoming).length);
    setCount('#fhMerchTabLimited', ITEMS.filter((i) => i.tag === 'limited').length);
    setCount('#fhMerchTabPreorder', ITEMS.filter((i) => i.tag === 'preorder').length);

    const s = $('#fhMerchStatItems'); if (s) s.textContent = ITEMS.length;
    const u = $('#fhMerchStatUpcoming'); if (u) u.textContent = ITEMS.filter((i) => i.upcoming).length;
  }

  function initFilters() {
    const search = $('#fhMerchSearch');
    const cat = $('#fhMerchCategory');
    const tag = $('#fhMerchTag');
    const sort = $('#fhMerchSort');

    let debounce;
    if (search) {
      search.addEventListener('input', () => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
          state.search = search.value;
          state.page = 1;
          renderChips();
          render();
        }, 200);
      });
    }

    if (cat) cat.addEventListener('change', () => { state.category = cat.value; state.page = 1; renderChips(); render(); });
    if (tag) tag.addEventListener('change', () => { state.tag = tag.value; state.page = 1; renderChips(); render(); });
    if (sort) sort.addEventListener('change', () => { state.sort = sort.value; state.page = 1; render(); });

    const reset = $('#fhMerchReset');
    if (reset) {
      reset.addEventListener('click', () => {
        state.tab = 'all'; state.category = 'all'; state.tag = 'all';
        state.sort = 'popular'; state.search = ''; state.page = 1;
        if (search) search.value = '';
        if (cat) cat.value = 'all';
        if (tag) tag.value = 'all';
        if (sort) sort.value = 'popular';
        $$('.fh-merch__tab').forEach((t) => t.classList.toggle('is-active', t.dataset.tab === 'all'));
        renderChips();
        render();
      });
    }
  }


  function initView() {
    $$('.fh-merch__view-btn').forEach((b) => {
      b.addEventListener('click', () => {
        $$('.fh-merch__view-btn').forEach((x) => x.classList.remove('is-active'));
        b.classList.add('is-active');
        state.view = b.dataset.view;
        render();
      });
    });
  }


  function initLoadMore() {
    const btn = $('#fhMerchLoadMore');
    if (!btn) return;
    btn.addEventListener('click', () => {
      state.page += 1;
      render();
    });
  }


  function initBookmark() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-bookmark]');
      if (!btn) return;
      e.preventDefault();
      const id = parseInt(btn.dataset.bookmark, 10);
      const nowOn = toggleBookmark(id);
      btn.classList.toggle('is-active', nowOn);
      const i = btn.querySelector('i');
      if (i) i.className = nowOn ? 'fas fa-bookmark' : 'far fa-bookmark';
    });
  }


  function renderChips() {
    const wrap = $('#fhMerchActiveChips');
    if (!wrap) return;
    const chips = [];
    if (state.search) chips.push({ label: `Search: "${state.search}"`, key: 'search' });
    if (state.category !== 'all') chips.push({ label: `Category: ${state.category}`, key: 'category' });
    if (state.tag !== 'all') chips.push({ label: `Tag: ${tagLabel(state.tag)}`, key: 'tag' });

    if (!chips.length) { wrap.innerHTML = ''; return; }

    wrap.innerHTML = chips.map((c) => `
      <span class="fh-merch__chip">
        ${esc(c.label)}
        <button type="button" data-chip="${c.key}" aria-label="Remove filter"><i class="fas fa-xmark"></i></button>
      </span>`).join('');

    $$('[data-chip]', wrap).forEach((b) => {
      b.addEventListener('click', () => {
        const k = b.dataset.chip;
        if (k === 'search') { state.search = ''; const s = $('#fhMerchSearch'); if (s) s.value = ''; }
        if (k === 'category') { state.category = 'all'; const c = $('#fhMerchCategory'); if (c) c.value = 'all'; }
        if (k === 'tag') { state.tag = 'all'; const t = $('#fhMerchTag'); if (t) t.value = 'all'; }
        state.page = 1;
        renderChips();
        render();
      });
    });
  }

  function autoActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    $$('.fh-nav__link, .fh-mobile-menu__link, .fh-dropdown__item').forEach((link) => {
      const href = (link.getAttribute('href') || '').split('?')[0].split('#')[0];
      if (!href) return;
      if (href === path) link.classList.add('is-active');
    });
  }


  function init() {
    autoActiveNav();
    initTabs();
    initFilters();
    initView();
    initLoadMore();
    initBookmark();
    renderChips();
    render();
  }

  async function loadBackendData() {
    try {
      if (window.FHApi) {
        var res = await window.FHApi.merchandise();
        if (res && Array.isArray(res.merchandise) && res.merchandise.length) ITEMS = res;
      }
    } catch (e) {
      console.warn('Fan Hub backend data fallback:', e);
    }
  }

  async function boot() {
    await loadBackendData();
    init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();