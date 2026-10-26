(() => {
  'use strict';

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));

  const BOOKMARK_KEY = 'fanhub-merch-bookmarks';
  const VIEW_KEY     = 'fanhub-merch-views';

  const ITEMS = {
    1: {
      id: 1,
      name: 'Eren Yeager Attack Titan Figure',
      cat: 'anime', catLabel: 'Anime', catIcon: 'fa-dragon',
      tag: 'limited', price: 49.99, views: 12400, upcoming: false, added: '2026-09-15',
      imgs: [
        'https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=1200',
        'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?q=80&w=1200',
        'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200'
      ],
      desc: 'Premium hand-painted PVC figure of Eren Yeager in his Attack Titan form. This limited edition collectible stands 30cm tall and features intricate detailing from the final season of Attack on Titan.',
      details: {
        Material: 'PVC & ABS',
        Height: '30 cm',
        Manufacturer: 'Good Smile Company',
        Release: 'Oct 2026',
        Scale: '1/7 Scale',
        Origin: 'Japan'
      }
    },
    2: {
      id: 2,
      name: 'Elden Ring "Tarnished" T-Shirt',
      cat: 'gaming', catLabel: 'Gaming', catIcon: 'fa-gamepad',
      tag: 'preorder', price: 29.99, views: 8200, upcoming: true, added: '2026-09-20',
      imgs: [
        'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1200',
        'https://images.unsplash.com/photo-1587573089734-599851b0fbd7?q=80&w=1200'
      ],
      desc: 'Official Elden Ring merchandise. 100% cotton tee with gold-foil Elden Ring logo and Tarnished sigil on chest. Pre-order now for delivery in November 2026.',
      details: {
        Material: '100% Cotton',
        Sizes: 'S / M / L / XL / XXL',
        Manufacturer: 'Bandai Namco',
        Release: 'Nov 2026',
        Color: 'Black',
        Origin: 'Japan'
      }
    },
    3: {
      id: 3,
      name: 'BTS Light Stick Ver. 4',
      cat: 'kpop', catLabel: 'K-Pop', catIcon: 'fa-music',
      tag: 'collectible', price: 89.99, views: 21500, upcoming: false, added: '2026-09-10',
      imgs: [
        'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=1200',
        'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?q=80&w=1200'
      ],
      desc: 'The official BTS Army Bomb Ver. 4. Bluetooth-enabled, syncs with concert light shows. A must-have collectible for every ARMY.',
      details: {
        Material: 'ABS Plastic',
        Height: '25 cm',
        Manufacturer: 'Big Hit Music',
        Release: 'Sep 2026',
        Battery: 'USB-C Rechargeable',
        Origin: 'South Korea'
      }
    },
    4: {
      id: 4,
      name: 'Jinx Cosplay Wig — Arcane',
      cat: 'cosplay', catLabel: 'Cosplay', catIcon: 'fa-user-ninja',
      tag: 'collectible', price: 45.00, views: 5600, upcoming: false, added: '2026-09-05',
      imgs: [
        'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=1200',
        'https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=1200'
      ],
      desc: 'High-quality cosplay wig inspired by Jinx from Arcane. Heat-resistant synthetic fiber, pre-styled with Jinx\'s iconic blue twin braids.',
      details: {
        Material: 'Heat-resistant Fiber',
        Length: '70 cm',
        Manufacturer: 'CosplaySky',
        Release: 'Aug 2026',
        Style: 'Twin Braids',
        Origin: 'China'
      }
    }
  };

  function getItem(id) {
    if (ITEMS[id]) return ITEMS[id];
    const base = ITEMS[1];
    return { ...base, id, name: 'Merchandise Item #' + id };
  }

  function getRelated(currentId, cat) {
    return Object.values(ITEMS)
      .filter((i) => i.id !== currentId && i.cat === cat)
      .slice(0, 4);
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function formatViews(n) {
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return String(n);
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
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

  function bumpView(id) {
    try {
      const v = JSON.parse(localStorage.getItem(VIEW_KEY) || '{}');
      v[id] = (v[id] || 0) + 1;
      localStorage.setItem(VIEW_KEY, JSON.stringify(v));
    } catch (e) {}
  }

  function getId() {
    const p = new URLSearchParams(window.location.search);
    return parseInt(p.get('id'), 10) || 1;
  }


  function render(item) {
    document.title = `${item.name} | Fan Hub Plus`;

    const bc = $('#fhMsBreadcrumb');
    if (bc) bc.textContent = item.name;

    // Gallery main image
    const main = $('#fhMsMainImg');
    if (main) { main.src = item.imgs[0]; main.alt = item.name; }

    // Thumbnails
    const thumbs = $('#fhMsThumbs');
    if (thumbs) {
      thumbs.innerHTML = item.imgs.map((src, i) => `
        <button class="fh-ms__thumb ${i === 0 ? 'is-active' : ''}" data-thumb="${i}" type="button">
          <img src="${esc(src)}" alt="${esc(item.name)} view ${i + 1}" loading="lazy" />
        </button>`).join('');

      $$('.fh-ms__thumb', thumbs).forEach((b) => {
        b.addEventListener('click', () => {
          $$('.fh-ms__thumb', thumbs).forEach((x) => x.classList.remove('is-active'));
          b.classList.add('is-active');
          if (main) main.src = item.imgs[parseInt(b.dataset.thumb, 10)];
        });
      });
    }

    // Tag badge
    const tag = $('#fhMsTag');
    if (tag) {
      if (item.tag) {
        tag.hidden = false;
        tag.dataset.tag = item.tag;
        tag.textContent = tagLabel(item.tag);
      } else {
        tag.hidden = true;
      }
    }

    // Category pill
    const cat = $('#fhMsCat');
    if (cat) {
      cat.href = 'merchandise.html?cat=' + item.cat;
      cat.innerHTML = `<i class="fas ${item.catIcon}"></i> <span>${esc(item.catLabel)}</span>`;
    }

    // Title + desc
    const title = $('#fhMsTitle'); if (title) title.textContent = item.name;
    const desc  = $('#fhMsDesc');  if (desc)  desc.textContent  = item.desc;

    // Meta
    const views = $('#fhMsViews'); if (views) views.textContent = formatViews(item.views);
    const added = $('#fhMsAdded'); if (added) added.textContent = formatDate(item.added);

    // Price
    const price = $('#fhMsPrice'); if (price) price.textContent = '$' + item.price.toFixed(2);

    // Upcoming banner
    const up = $('#fhMsUpcoming');
    if (up) up.hidden = !item.upcoming;

    // Details grid
    const dWrap = $('#fhMsDetails');
    if (dWrap) {
      dWrap.innerHTML = Object.entries(item.details).map(([k, v]) => `
        <div class="fh-ms__detail">
          <div class="fh-ms__detail-label">${esc(k)}</div>
          <div class="fh-ms__detail-value">${esc(v)}</div>
        </div>`).join('');
    }

    // Related
    const rWrap = $('#fhMsRelated');
    if (rWrap) {
      const related = getRelated(item.id, item.cat);
      if (!related.length) {
        rWrap.innerHTML = '<p style="color:var(--fh-text-muted);font-size:0.9rem;">No related items yet.</p>';
      } else {
        rWrap.innerHTML = related.map(renderRelatedCard).join('');
      }
    }

    // Bookmark button initial state
    const bm = $('#fhMsBookmark');
    if (bm) {
      const on = isBookmarked(item.id);
      bm.classList.toggle('is-active', on);
      bm.innerHTML = on
        ? '<i class="fas fa-bookmark"></i> Saved'
        : '<i class="far fa-bookmark"></i> Save to Bookmarks';
    }
  }

  function renderRelatedCard(r) {
    const tagHtml = r.tag
      ? `<span class="fh-merch-card__tag" data-tag="${r.tag}">${tagLabel(r.tag)}</span>`
      : '';
    return `
      <article class="fh-merch-card">
        <a href="merchandise-single.html?id=${r.id}" class="fh-merch-card__img">
          ${tagHtml}
          <img src="${esc(r.imgs[0])}" alt="${esc(r.name)}" loading="lazy" />
        </a>
        <div class="fh-merch-card__body">
          <span class="fh-merch-card__cat"><i class="fas ${r.catIcon}"></i> ${esc(r.catLabel)}</span>
          <h3 class="fh-merch-card__title">${esc(r.name)}</h3>
          <div class="fh-merch-card__price">$${r.price.toFixed(2)}</div>
        </div>
      </article>`;
  }


  function initBookmark(item) {
    const btn = $('#fhMsBookmark');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const on = toggleBookmark(item.id);
      btn.classList.toggle('is-active', on);
      btn.innerHTML = on
        ? '<i class="fas fa-bookmark"></i> Saved'
        : '<i class="far fa-bookmark"></i> Save to Bookmarks';
    });
  }

  function initShare() {
    const btn = $('#fhMsShare');
    if (!btn) return;
    btn.addEventListener('click', async () => {
      const data = { title: document.title, url: window.location.href };
      try {
        if (navigator.share) {
          await navigator.share(data);
        } else if (navigator.clipboard) {
          await navigator.clipboard.writeText(window.location.href);
          const old = btn.innerHTML;
          btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
          setTimeout(() => { btn.innerHTML = old; }, 1600);
        }
      } catch (e) {}
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
    const id = getId();
    const item = getItem(id);
    bumpView(id);
    autoActiveNav();
    render(item);
    initBookmark(item);
    initShare();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();