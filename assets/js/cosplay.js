(() => {
  'use strict';

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function initials(name) {
    return String(name || '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  const yearOf = m => (m.release || '').slice(0, 4) || '—';
  const badgeFor = m => m.views >= 55000 ? 'TOP' : m.views >= 38000 ? 'HOT' : 'NEW';

  const posterFor = id => `https://picsum.photos/seed/cosplay-poster-${id}/500/750`;
  const coverFor  = id => `https://picsum.photos/seed/cosplay-cover-${id}/1600/900`;
  const avatarFor = seed => `https://picsum.photos/seed/cosplay-avatar-${encodeURIComponent(seed)}/200/200`;

  function avatarHTML(person, cls) {
    const seed = encodeURIComponent((person && person.name) || 'x');
    const img  = avatarFor(seed);
    const init = esc(initials(person && person.name));
    return `<div class="${cls} ${cls}--photo">
      <img src="${img}" alt="${esc(person.name)}" loading="lazy"
           onerror="this.onerror=null;this.parentNode.classList.remove('${cls}--photo');this.parentNode.innerHTML='${init}';" />
    </div>`;
  }

  let LOOKS = [
    { id: 1301, title: 'Zero Two', sub: 'Anime', type: 'Anime Cosplay', genres: ['anime','sci-fi','romance'],
      views: 64000, release: '2018-05-12', rating: '9.5', character: 'Zero Two',
      series: 'Darling in the Franxx', cosplayer: 'Kira Starlight',
      desc: 'The pink-haired klaxosaur hybrid brought to life with a custom horn prosthetic, hand-sewn bodysuit and slow-motion cape shots in an abandoned hangar.',
      location: 'Neo-Tokyo Backlot', lang: 'EN' },
    { id: 1302, title: 'Jinx', sub: 'Gaming', type: 'Game Cosplay', genres: ['gaming','action','drama'],
      views: 62000, release: '2021-11-20', rating: '9.7', character: 'Jinx',
      series: 'League of Legends / Arcane', cosplayer: 'Nyx Volt',
      desc: 'Full tactical build with hand-painted leather harness, custom tattoo transfers and a real LED-lined rocket launcher strapped across the back.',
      location: 'Zaun Underground', lang: 'EN' },
    { id: 1303, title: 'Geralt of Rivia', sub: 'Gaming', type: 'Game Cosplay', genres: ['gaming','fantasy','adventure'],
      views: 58000, release: '2019-08-03', rating: '9.4', character: 'Geralt',
      series: 'The Witcher 3', cosplayer: 'Wolf of Kaer Morhen',
      desc: 'Weathered steel armour with real chain mail, sculpted medallion, and yellow contact lenses — shot on location in a real Eastern European forest.',
      location: 'Carpathian Forest', lang: 'EN' },
    { id: 1304, title: 'Spider-Gwen', sub: 'Comics', type: 'Comic Cosplay', genres: ['comics','superhero','action'],
      views: 60000, release: '2020-03-14', rating: '9.3', character: 'Gwen Stacy',
      series: 'Spider-Verse', cosplayer: 'Aria Parker',
      desc: 'The hooded ballet-flat Spider-Woman with screen-printed spandex, athletic poses and skyline rooftop photography at golden hour.',
      location: 'Brooklyn Rooftops', lang: 'EN' },
    { id: 1305, title: 'Wednesday Addams', sub: 'TV Series', type: 'TV Cosplay', genres: ['tv','mystery','drama'],
      views: 56000, release: '2022-12-05', rating: '9.4', character: 'Wednesday',
      series: 'Wednesday', cosplayer: 'Raven Noir',
      desc: 'Gothic academy uniform with hand-stitched collar, braided pigtails and the iconic deadpan stare. Shot in a real 19th-century boarding school.',
      location: 'Nevermore Academy', lang: 'EN' },
    { id: 1306, title: 'Levi Ackerman', sub: 'Anime', type: 'Anime Cosplay', genres: ['anime','action','drama'],
      views: 52000, release: '2018-09-15', rating: '9.2', character: 'Levi',
      series: 'Attack on Titan', cosplayer: 'Karasu',
      desc: 'Survey Corps leather harness built from scratch, twin dulled blades and the cold, calculating expression that makes Levi unmistakable.',
      location: 'Wall Maria', lang: 'EN' },
    { id: 1307, title: 'Daenerys Targaryen', sub: 'TV Series', type: 'TV Cosplay', genres: ['tv','fantasy','drama'],
      views: 50000, release: '2019-05-19', rating: '9.1', character: 'Daenerys',
      series: 'Game of Thrones', cosplayer: 'Ember Storm',
      desc: 'Hand-braided platinum wig, embroidered leather coat and dragon-scale embellishments — the Mother of Dragons in her final season armour.',
      location: 'Dragonstone Cliffs', lang: 'EN' },
    { id: 1308, title: 'Harley Quinn', sub: 'Comics', type: 'Comic Cosplay', genres: ['comics','superhero','crime'],
      views: 54000, release: '2020-08-07', rating: '9.3', character: 'Harley Quinn',
      series: 'DC Comics', cosplayer: 'Vix',
      desc: 'Classic red-and-black jester outfit with hand-painted diamond pattern, bubblegum prop and grin. Shot against a spray-painted warehouse wall.',
      location: 'Gotham Warehouse', lang: 'EN' }
  ];

  const COSPLAYERS = [
    { name: 'Kira Starlight',      looks: 'Zero Two · Asuka · Mikasa', tag: 'Anime Specialist' },
    { name: 'Nyx Volt',            looks: 'Jinx · Vi · Tracer', tag: 'Gaming Cosplayer' },
    { name: 'Wolf of Kaer Morhen', looks: 'Geralt · Kratos · Ezio', tag: 'Armour Builder' },
    { name: 'Aria Parker',         looks: 'Spider-Gwen · MJ · Silk', tag: 'Comic Cosplayer' },
    { name: 'Raven Noir',          looks: 'Wednesday · Morticia · Elvira', tag: 'Gothic Aesthetic' },
    { name: 'Ember Storm',         looks: 'Daenerys · Cersei · Melisandre', tag: 'Fantasy Costume' }
  ];

  const CHARACTERS = [
    { name: 'Zero Two',    series: 'Darling in the Franxx', tag: 'Anime Icon' },
    { name: 'Jinx',        series: 'League of Legends',     tag: 'Game Legend' },
    { name: 'Geralt',      series: 'The Witcher',           tag: 'Fantasy Hero' },
    { name: 'Spider-Gwen', series: 'Marvel Comics',         tag: 'Comic Hero' },
    { name: 'Wednesday',   series: 'Wednesday (Netflix)',   tag: 'TV Icon' },
    { name: 'Harley Quinn',series: 'DC Comics',             tag: 'Comic Icon' }
  ];

  const state = { heroIndex: 0, heroTimer: null, sort: 'popular' };

  function init() {
    const hero       = $('#csHero');
    const heroDots   = $('#csHeroDots');
    const topTrack   = $('#csTopCosplayersTrack');
    const gridEl     = $('#csLooksGrid');
    const sortWrap   = $('#csLooksSort');
    const charTrack  = $('#csCharacterTrack');
    const drawer     = $('#csDrawer');
    const drawerBody = $('#csDrawerBody');
    const sideCount  = $('#csSideCount');

    if (!hero || !gridEl || !sortWrap) return;

    const heroSlides = LOOKS.slice(0, 6);

    function buildHero() {
      const slidesHTML = heroSlides.map((m, i) => {
        const castHTML = m.cosplayer
          ? `<div class="cs-hero__cast-member">${avatarHTML({ name: m.cosplayer }, 'cs-hero__cast-avatar')}<span class="cs-hero__cast-name">${esc(m.cosplayer)}</span></div>`
          : '';

        return `<div class="cs-hero__slide${i === 0 ? ' is-active' : ''}">
          <div class="cs-hero__bg"><img src="${coverFor(m.id)}" alt="${esc(m.title)}" /></div>
          <div class="cs-hero__content">
            <div class="cs-hero__card">
              <span class="cs-hero__tag">Cosplay · Featured Look</span>
              <h1 class="cs-hero__title">${esc(m.title)}</h1>
              <div class="cs-hero__meta">
                <span class="cs-hero__pill cs-hero__pill--pink">${esc(m.sub)}</span>
                <span class="cs-hero__pill cs-hero__pill--rating"><i class="fas fa-star"></i> ${esc(m.rating)}</span>
                <span class="cs-hero__pill"><i class="fas fa-calendar"></i> ${esc(yearOf(m))}</span>
                <span class="cs-hero__pill cs-hero__pill--rose"><i class="fas fa-mask"></i> ${esc(m.character)}</span>
              </div>
              <p class="cs-hero__desc">${esc(m.desc)}</p>
              <div class="cs-hero__cast hide-scrollbar">${castHTML}</div>
              <div class="cs-hero__actions">
                <button class="cs-hero__btn cs-hero__btn--primary" data-open="${m.id}" type="button">
                  <i class="fas fa-camera"></i> View Look
                </button>
                <button class="cs-hero__btn cs-hero__btn--ghost" data-open="${m.id}" type="button">
                  <i class="fas fa-circle-info"></i> Details
                </button>
              </div>
            </div>
          </div>
        </div>`;
      }).join('');

      hero.insertAdjacentHTML('beforeend', slidesHTML);

      heroDots.innerHTML = heroSlides.map((m, i) =>
        `<button class="cs-hero__dot${i === 0 ? ' is-active' : ''}" data-hero-dot="${i}" aria-label="${esc(m.title)}" type="button"></button>`
      ).join('');
    }

    function goHero(index) {
      const slides = $$('.cs-hero__slide', hero);
      const dots = $$('.cs-hero__dot', heroDots);
      if (!slides.length) return;
      const next = ((index % slides.length) + slides.length) % slides.length;
      state.heroIndex = next;
      slides.forEach((s, i) => s.classList.toggle('is-active', i === next));
      dots.forEach((d, i) => {
        d.classList.remove('is-active');
        if (i === next) { void d.offsetWidth; d.classList.add('is-active'); }
      });
    }

    function startHeroTimer() {
      if (state.heroTimer) clearInterval(state.heroTimer);
      state.heroTimer = setInterval(() => goHero(state.heroIndex + 1), 6000);
    }

    function renderTopCosplayers() {
      const list = COSPLAYERS.slice(0, 6);
      const items = list.map((c, i) =>
        `<article class="cs-marquee__card" tabindex="0" role="button" aria-label="${esc(c.name)}">
          <span class="cs-marquee__rate"><i class="fas fa-star"></i> ${(9.0 + (i % 3) * 0.3).toFixed(1)}</span>
          <img src="${avatarFor(c.name)}" alt="${esc(c.name)}" loading="lazy" />
          <div class="cs-marquee__body">
            <h3 class="cs-marquee__title">${esc(c.name)}</h3>
            <div class="cs-marquee__meta"><span>${esc(c.tag)}</span></div>
          </div>
        </article>`
      ).join('');
      topTrack.innerHTML = `<div class="cs-marquee__track">${items}${items}</div>`;
    }

    function renderCharacters() {
      const items = CHARACTERS.map(c =>
        `<article class="cs-publisher">
          <div class="cs-publisher__avatar">${esc(initials(c.name))}</div>
          <div class="cs-publisher__body">
            <h3 class="cs-publisher__name">${esc(c.name)}</h3>
            <p class="cs-publisher__titles">${esc(c.series)}</p>
            <span class="cs-publisher__tag"><i class="fas fa-mask"></i> ${esc(c.tag)}</span>
          </div>
        </article>`
      ).join('');
      charTrack.innerHTML = `<div class="cs-marquee__track">${items}${items}</div>`;
    }

    function sortLooks(list, mode) {
      const out = list.slice();
      switch (mode) {
        case 'latest': return out.sort((a, b) => (b.release || '').localeCompare(a.release || ''));
        case 'rating': return out.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        case 'az':     return out.sort((a, b) => a.title.localeCompare(b.title));
        default:       return out.sort((a, b) => b.views - a.views);
      }
    }

    function lookCardHTML(m) {
      return `<article class="cs-card" data-open="${m.id}" tabindex="0" role="button" aria-label="${esc(m.title)}">
        <div class="cs-card__media">
          <span class="cs-card__sub">${esc(m.sub)}</span>
          <span class="cs-card__rate"><i class="fas fa-star"></i> ${esc(m.rating)}</span>
          <img src="${posterFor(m.id)}" alt="${esc(m.title)}" loading="lazy" />
          <span class="cs-card__badge">${badgeFor(m)}</span>
        </div>
        <div class="cs-card__body">
          <h3 class="cs-card__title">${esc(m.title)}</h3>
          <div class="cs-card__meta">
            <span>${esc(m.character)}</span>
            <span>${esc(yearOf(m))}</span>
          </div>
        </div>
      </article>`;
    }

    function renderLooksGrid() {
      const data = sortLooks(LOOKS, state.sort);
      gridEl.innerHTML = data.map(lookCardHTML).join('');
      const cards = $$('.cs-card', gridEl);
      let i = 0;
      function batch() {
        const end = Math.min(i + 4, cards.length);
        for (; i < end; i++) if (cards[i]) cards[i].classList.add('is-visible');
        if (i < cards.length) requestAnimationFrame(batch);
      }
      requestAnimationFrame(batch);
    }

    function drawerRow(label, value) {
      return `<div class="cs-drawer__row">
        <span class="cs-drawer__row-label">${esc(label)}</span>
        <span class="cs-drawer__row-value">${esc(value)}</span>
      </div>`;
    }

    function openDrawer(id) {
      const m = LOOKS.find(x => String(x.id) === String(id));
      if (!m) return;

      const castHTML = m.cosplayer
        ? `<div class="cs-drawer__cast-member">
            ${avatarHTML({ name: m.cosplayer }, 'cs-drawer__cast-avatar')}
            <div class="cs-drawer__cast-name">${esc(m.cosplayer)}</div>
          </div>`
        : '';

      drawerBody.innerHTML = `
        <div class="cs-drawer__hero">
          <img src="${coverFor(m.id)}" alt="${esc(m.title)} backdrop" />
          <div class="cs-drawer__hero-content">
            <h2 class="cs-drawer__title" id="csDrawerTitle">${esc(m.title)}</h2>
            <div class="cs-drawer__meta">
              <span><i class="fas fa-star" style="color:#fbbf24"></i> ${esc(m.rating)}</span>
              <span><i class="fas fa-calendar"></i> ${esc(yearOf(m))}</span>
              <span><i class="fas fa-mask"></i> ${esc(m.character)}</span>
              <span><i class="fas fa-film"></i> ${esc(m.series)}</span>
              <span><i class="fas fa-closed-captioning"></i> ${esc(m.lang)}</span>
            </div>
            <div class="cs-drawer__actions">
              <button class="cs-drawer__btn cs-drawer__btn--primary" type="button"><i class="fas fa-camera"></i> View Gallery</button>
              <button class="cs-drawer__btn cs-drawer__btn--ghost" type="button"><i class="fas fa-heart"></i> Add to Favorites</button>
            </div>
          </div>
        </div>
        <div class="cs-drawer__content">
          <div>
            <h3 class="cs-drawer__section-title">About This Look</h3>
            <p class="cs-drawer__desc">${esc(m.desc)}</p>
            <h3 class="cs-drawer__section-title">Cosplayer</h3>
            <div class="cs-drawer__cast hide-scrollbar">${castHTML}</div>
          </div>
          <aside>
            <div class="cs-drawer__info-card">
              ${drawerRow('Character', m.character)}
              ${drawerRow('From', m.series)}
              ${drawerRow('Cosplayer', m.cosplayer)}
              ${drawerRow('Category', m.sub)}
              ${drawerRow('Shot At', m.location)}
              ${drawerRow('Rating', m.rating + ' / 10')}
              ${drawerRow('Views', m.views.toLocaleString())}
              ${drawerRow('Language', m.lang)}
            </div>
          </aside>
        </div>`;

      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const panel = drawer.querySelector('.cs-drawer__panel');
      if (panel) panel.scrollTop = 0;
    }

    function closeDrawer() {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    buildHero();
    renderTopCosplayers();
    renderLooksGrid();
    renderCharacters();

    if (sideCount) sideCount.textContent = LOOKS.length + '+';
    startHeroTimer();

    heroDots.addEventListener('click', e => {
      const dot = e.target.closest('[data-hero-dot]');
      if (!dot) return;
      goHero(parseInt(dot.dataset.heroDot, 10));
      startHeroTimer();
    });

    document.addEventListener('click', e => {
      const t = e.target;
      if (!t || !t.closest) return;
      const trigger = t.closest('[data-open]');
      if (trigger) {
        e.preventDefault();
        openDrawer(trigger.dataset.open);
        return;
      }
      if (t.closest('[data-drawer-close]')) closeDrawer();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { closeDrawer(); return; }
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const t = e.target;
      if (!t || !t.closest) return;
      const card = t.closest('.cs-card[data-open], .cs-marquee__card[data-open]');
      if (card) { e.preventDefault(); openDrawer(card.dataset.open); }
    });

    sortWrap.addEventListener('click', e => {
      const btn = e.target.closest('.cs-sort__btn');
      if (!btn) return;
      $$('.cs-sort__btn', sortWrap).forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      state.sort = btn.dataset.sort || 'popular';
      renderLooksGrid();
    });

    const revealTargets = $$('[data-reveal]');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
      revealTargets.forEach(t => io.observe(t));
    } else {
      revealTargets.forEach(t => t.classList.add('is-revealed'));
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (state.heroTimer) clearInterval(state.heroTimer);
        state.heroTimer = null;
      } else {
        startHeroTimer();
      }
    });
  }

  async function loadBackendCatalog() {
    try {
      if (!window.FHApi || !window.FHApi.catalog) return;
      var category = 'cosplay';
      if (category === '__PATH__') {
        category = window.location.pathname.indexOf('tv-shows') !== -1 ? 'tv-shows' : 'movies';
      }
      var rows = await window.FHApi.catalog(category === 'all' ? null : category);
      if (Array.isArray(rows) && rows.length) LOOKS = rows;
    } catch (e) {
      console.warn('Fan Hub backend catalog fallback:', e);
    }
  }

  async function boot() {
    await loadBackendCatalog();
    init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();