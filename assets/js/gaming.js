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

  const coverFor = id => `https://picsum.photos/seed/game-cover-${id}/1600/900`;
  const heroFor  = id => `https://picsum.photos/seed/game-hero-${id}/1600/900`;

  let GAMES = [
    { id: 901, title: 'Elden Ring', sub: 'Action RPG',
      genres: ['rpg','action','adventure'], views: 68000, release: '2022-02-25',
      score: '9.6', playtime: '60h', esrb: 'M',
      desc: 'Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring — and become the Elden Lord in the Lands Between.',
      studio: 'FromSoftware', publisher: 'Bandai Namco',
      platforms: ['PC', 'PS5', 'Xbox Series'],
      lang: 'EN', engine: 'Proprietary', mode: 'Single / Co-op' },
    { id: 902, title: 'The Witcher 3: Wild Hunt', sub: 'Open World RPG',
      genres: ['rpg','action','adventure'], views: 65000, release: '2015-05-19',
      score: '9.7', playtime: '100h', esrb: 'M',
      desc: 'As war rages on, Geralt of Rivia takes on the most important contract of his life — to find the Child of Prophecy, a living weapon that can alter the shape of the world.',
      studio: 'CD Projekt Red', publisher: 'CD Projekt',
      platforms: ['PC', 'PS4', 'Xbox One', 'Switch'],
      lang: 'EN', engine: 'REDengine 3', mode: 'Single' },
    { id: 903, title: 'Red Dead Redemption 2', sub: 'Open World Action',
      genres: ['action','adventure','western'], views: 64000, release: '2018-10-26',
      score: '9.7', playtime: '70h', esrb: 'M',
      desc: 'America, 1899. Arthur Morgan and the Van der Linde gang are outlaws on the run — and the end of the Wild West is at hand.',
      studio: 'Rockstar Games', publisher: 'Take-Two Interactive',
      platforms: ['PC', 'PS4', 'Xbox One'],
      lang: 'EN', engine: 'RAGE', mode: 'Single / Online' },
    { id: 904, title: 'The Last of Us Part II', sub: 'Action Adventure',
      genres: ['action','adventure','drama'], views: 60000, release: '2020-06-19',
      score: '9.3', playtime: '25h', esrb: 'M',
      desc: 'Five years after their dangerous journey across the post-pandemic United States, Ellie and Joel have settled in Jackson, Wyoming — but a violent event sets Ellie on a brutal path of revenge.',
      studio: 'Naughty Dog', publisher: 'Sony Interactive',
      platforms: ['PS4', 'PS5'],
      lang: 'EN', engine: 'Proprietary', mode: 'Single' },
    { id: 905, title: 'Cyberpunk 2077', sub: 'Open World RPG',
      genres: ['rpg','action','sci-fi'], views: 58000, release: '2020-12-10',
      score: '9.0', playtime: '50h', esrb: 'M',
      desc: 'In Night City, a mercenary known as V navigates a dystopian society in which humans and machines coexist — chasing a one-of-a-kind implant that may be the key to immortality.',
      studio: 'CD Projekt Red', publisher: 'CD Projekt',
      platforms: ['PC', 'PS5', 'Xbox Series'],
      lang: 'EN', engine: 'REDengine 4', mode: 'Single' },
    { id: 906, title: 'God of War Ragnarök', sub: 'Action Adventure',
      genres: ['action','adventure','fantasy'], views: 61000, release: '2022-11-09',
      score: '9.5', playtime: '40h', esrb: 'M',
      desc: 'Fimbulwinter is well underway. Kratos and Atreus must journey to each of the Nine Realms in search of answers as Asgardian forces prepare for a prophesied battle.',
      studio: 'Santa Monica Studio', publisher: 'Sony Interactive',
      platforms: ['PS4', 'PS5'],
      lang: 'EN', engine: 'Proprietary', mode: 'Single' }
  ];

  const STUDIOS = [
    { name: 'FromSoftware',        games: 'Elden Ring · Dark Souls · Sekiro', tag: 'Action RPG' },
    { name: 'CD Projekt Red',      games: 'The Witcher 3 · Cyberpunk 2077', tag: 'Open World' },
    { name: 'Rockstar Games',      games: 'GTA V · Red Dead Redemption 2', tag: 'Open World' },
    { name: 'Naughty Dog',         games: 'The Last of Us · Uncharted', tag: 'Cinematic Action' },
    { name: 'Santa Monica Studio', games: 'God of War · Ragnarök', tag: 'Action Adventure' },
    { name: 'Nintendo EPD',        games: 'Zelda: BOTW · Mario Odyssey', tag: 'Adventure' }
  ];

  const state = { heroIndex: 0, heroTimer: null, sort: 'popular' };

  function init() {
    const hero       = $('#gmHero');
    const heroDots   = $('#gmHeroDots');
    const topTrack   = $('#gmTopPlayedTrack');
    const gridEl     = $('#gmGrid');
    const sortWrap   = $('#gmSort');
    const studioTk   = $('#gmStudioTrack');
    const drawer     = $('#gmDrawer');
    const drawerBody = $('#gmDrawerBody');
    const sideCount  = $('#gmSideCount');

    if (!hero || !gridEl || !sortWrap) return;

    const heroSlides = GAMES.slice(0, 6);

    function buildHero() {
      const slidesHTML = heroSlides.map((m, i) => {
        const platformsHTML = (m.platforms || []).map(p =>
          `<span class="gm-hero__pill gm-hero__pill--plat"><i class="fas fa-gamepad"></i> ${esc(p)}</span>`
        ).join('');

        return `<div class="gm-hero__slide${i === 0 ? ' is-active' : ''}">
          <div class="gm-hero__bg"><img src="${heroFor(m.id)}" alt="${esc(m.title)}" /></div>
          <div class="gm-hero__content">
            <div class="gm-hero__card">
              <span class="gm-hero__tag">Gaming · Featured</span>
              <h1 class="gm-hero__title">${esc(m.title)}</h1>
              <div class="gm-hero__meta">
                <span class="gm-hero__pill gm-hero__pill--neon">${esc(m.sub)}</span>
                <span class="gm-hero__pill gm-hero__pill--rating"><i class="fas fa-star"></i> ${esc(m.score)}</span>
                <span class="gm-hero__pill"><i class="fas fa-calendar"></i> ${esc(yearOf(m))}</span>
                <span class="gm-hero__pill"><i class="fas fa-clock"></i> ${esc(m.playtime)}</span>
                ${platformsHTML}
              </div>
              <p class="gm-hero__desc">${esc(m.desc)}</p>
              <div class="gm-hero__actions">
                <button class="gm-hero__btn gm-hero__btn--primary" data-open="${m.id}" type="button">
                  <i class="fas fa-play"></i> Play Now
                </button>
                <button class="gm-hero__btn gm-hero__btn--ghost" data-open="${m.id}" type="button">
                  <i class="fas fa-circle-info"></i> Details
                </button>
              </div>
            </div>
          </div>
        </div>`;
      }).join('');

      hero.insertAdjacentHTML('beforeend', slidesHTML);

      heroDots.innerHTML = heroSlides.map((m, i) =>
        `<button class="gm-hero__dot${i === 0 ? ' is-active' : ''}" data-hero-dot="${i}" aria-label="${esc(m.title)}" type="button"></button>`
      ).join('');
    }

    function goHero(index) {
      const slides = $$('.gm-hero__slide', hero);
      const dots = $$('.gm-hero__dot', heroDots);
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

    function renderTopPlayed() {
      const list = GAMES.slice().sort((a, b) => b.views - a.views).slice(0, 6);
      const items = list.map(m =>
        `<article class="gm-marquee__card" data-open="${m.id}" tabindex="0" role="button" aria-label="${esc(m.title)}">
          <span class="gm-marquee__rate"><i class="fas fa-star"></i> ${esc(m.score)}</span>
          <img src="${coverFor(m.id)}" alt="${esc(m.title)} cover" loading="lazy" />
          <div class="gm-marquee__body">
            <h3 class="gm-marquee__title">${esc(m.title)}</h3>
            <div class="gm-marquee__meta">
              <span>${esc(yearOf(m))}</span>
              <span>·</span>
              <span>${esc(m.sub)}</span>
            </div>
          </div>
        </article>`
      ).join('');
      topTrack.innerHTML = `<div class="gm-marquee__track">${items}${items}</div>`;
    }

    function renderStudios() {
      const items = STUDIOS.map(s =>
        `<article class="gm-studio">
          <div class="gm-studio__avatar">${esc(initials(s.name))}</div>
          <div class="gm-studio__body">
            <h3 class="gm-studio__name">${esc(s.name)}</h3>
            <p class="gm-studio__games">${esc(s.games)}</p>
            <span class="gm-studio__tag"><i class="fas fa-code"></i> ${esc(s.tag)}</span>
          </div>
        </article>`
      ).join('');
      studioTk.innerHTML = `<div class="gm-marquee__track">${items}${items}</div>`;
    }

    function sortGames(list, mode) {
      const out = list.slice();
      switch (mode) {
        case 'latest': return out.sort((a, b) => (b.release || '').localeCompare(a.release || ''));
        case 'rating': return out.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
        case 'az':     return out.sort((a, b) => a.title.localeCompare(b.title));
        default:       return out.sort((a, b) => b.views - a.views);
      }
    }

    function cardHTML(m) {
      const primaryPlatform = (m.platforms && m.platforms[0]) || 'PC';
      return `<article class="gm-card" data-open="${m.id}" tabindex="0" role="button" aria-label="${esc(m.title)}">
        <div class="gm-card__media">
          <span class="gm-card__sub">${esc(m.sub)}</span>
          <span class="gm-card__rate"><i class="fas fa-star"></i> ${esc(m.score)}</span>
          <img src="${coverFor(m.id)}" alt="${esc(m.title)} cover" loading="lazy" />
          <span class="gm-card__plat"><i class="fas fa-gamepad"></i> ${esc(primaryPlatform)}</span>
        </div>
        <div class="gm-card__body">
          <h3 class="gm-card__title">${esc(m.title)}</h3>
          <div class="gm-card__meta">
            <span>${esc(yearOf(m))}</span>
            <span>${esc(m.playtime)}</span>
          </div>
        </div>
      </article>`;
    }

    function renderGrid() {
      const data = sortGames(GAMES, state.sort);
      gridEl.innerHTML = data.map(cardHTML).join('');
      const cards = $$('.gm-card', gridEl);
      let i = 0;
      function revealBatch() {
        const end = Math.min(i + 4, cards.length);
        for (; i < end; i++) if (cards[i]) cards[i].classList.add('is-visible');
        if (i < cards.length) requestAnimationFrame(revealBatch);
      }
      requestAnimationFrame(revealBatch);
    }

    function drawerRow(label, value) {
      return `<div class="gm-drawer__row">
        <span class="gm-drawer__row-label">${esc(label)}</span>
        <span class="gm-drawer__row-value">${esc(value)}</span>
      </div>`;
    }

    function openDrawer(id) {
      const m = GAMES.find(x => String(x.id) === String(id));
      if (!m) return;

      const platformsHTML = (m.platforms || []).map(p =>
        `<span class="gm-platforms__chip"><i class="fas fa-gamepad"></i> ${esc(p)}</span>`
      ).join('');

      const specsHTML = `
        <div class="gm-spec"><div class="gm-spec__label">Engine</div><div class="gm-spec__value">${esc(m.engine)}</div></div>
        <div class="gm-spec"><div class="gm-spec__label">Mode</div><div class="gm-spec__value">${esc(m.mode)}</div></div>
        <div class="gm-spec"><div class="gm-spec__label">Age Rating</div><div class="gm-spec__value">${esc(m.esrb)}</div></div>
        <div class="gm-spec"><div class="gm-spec__label">Main Story</div><div class="gm-spec__value">${esc(m.playtime)}</div></div>`;

      drawerBody.innerHTML = `
        <div class="gm-drawer__hero">
          <img src="${heroFor(m.id)}" alt="${esc(m.title)} backdrop" />
          <div class="gm-drawer__hero-content">
            <h2 class="gm-drawer__title" id="gmDrawerTitle">${esc(m.title)}</h2>
            <div class="gm-drawer__meta">
              <span><i class="fas fa-star" style="color:#fbbf24"></i> ${esc(m.score)}</span>
              <span><i class="fas fa-calendar"></i> ${esc(yearOf(m))}</span>
              <span><i class="fas fa-clock"></i> ${esc(m.playtime)}</span>
              <span><i class="fas fa-tag"></i> ${esc(m.esrb)}</span>
              <span><i class="fas fa-closed-captioning"></i> ${esc(m.lang)}</span>
            </div>
            <div class="gm-drawer__actions">
              <button class="gm-drawer__btn gm-drawer__btn--primary" type="button"><i class="fas fa-play"></i> Play Now</button>
              <button class="gm-drawer__btn gm-drawer__btn--ghost" type="button"><i class="fas fa-plus"></i> Add to Library</button>
            </div>
          </div>
        </div>
        <div class="gm-drawer__content">
          <div>
            <h3 class="gm-drawer__section-title">Synopsis</h3>
            <p class="gm-drawer__desc">${esc(m.desc)}</p>
            <h3 class="gm-drawer__section-title">Available On</h3>
            <div class="gm-platforms">${platformsHTML}</div>
            <h3 class="gm-drawer__section-title">Tech Specs</h3>
            <div class="gm-specs">${specsHTML}</div>
          </div>
          <aside>
            <div class="gm-drawer__info-card">
              ${drawerRow('Developer', m.studio)}
              ${drawerRow('Publisher', m.publisher)}
              ${drawerRow('Released', m.release)}
              ${drawerRow('Score', m.score + ' / 10')}
              ${drawerRow('Players', m.views.toLocaleString())}
              ${drawerRow('Genres', (m.genres || []).join(', '))}
              ${drawerRow('Language', m.lang)}
            </div>
          </aside>
        </div>`;

      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const panel = drawer.querySelector('.gm-drawer__panel');
      if (panel) panel.scrollTop = 0;
    }

    function closeDrawer() {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    buildHero();
    renderTopPlayed();
    renderGrid();
    renderStudios();

    if (sideCount) sideCount.textContent = GAMES.length + '+';
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
      const card = t.closest('.gm-card[data-open], .gm-marquee__card[data-open]');
      if (card) { e.preventDefault(); openDrawer(card.dataset.open); }
    });

    sortWrap.addEventListener('click', e => {
      const btn = e.target.closest('.gm-sort__btn');
      if (!btn) return;
      $$('.gm-sort__btn', sortWrap).forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      state.sort = btn.dataset.sort || 'popular';
      renderGrid();
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
      var category = 'gaming';
      if (category === '__PATH__') {
        category = window.location.pathname.indexOf('tv-shows') !== -1 ? 'tv-shows' : 'movies';
      }
      var rows = await window.FHApi.catalog(category === 'all' ? null : category);
      if (Array.isArray(rows) && rows.length) GAMES = rows;
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