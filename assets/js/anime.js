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
  const badgeFor = m => m.views >= 55000 ? '4K' : m.views >= 38000 ? 'HD' : 'NEW';

  const posterFor   = id => `https://picsum.photos/seed/anime-poster-${id}/500/750`;
  const backdropFor = id => `https://picsum.photos/seed/anime-back-${id}/1600/900`;
  const castAvatarFor = seed => `https://picsum.photos/seed/anime-cast-${encodeURIComponent(seed)}/200/200`;

  function avatarHTML(person, cls) {
    const seed = encodeURIComponent((person && person.name) || 'x');
    const img  = castAvatarFor(seed);
    const init = esc(initials(person && person.name));
    return `<div class="${cls} ${cls}--photo">
      <img src="${img}" alt="${esc(person.name)}" loading="lazy"
           onerror="this.onerror=null;this.parentNode.classList.remove('${cls}--photo');this.parentNode.innerHTML='${init}';" />
    </div>`;
  }

  /* ============================================================
     MOCK DATA
     ============================================================ */
  let MOVIES = [
    { id: 701, title: 'Spirited Away', sub: 'Studio Ghibli', genres: ['anime','fantasy','adventure'],
      views: 64000, release: '2001-07-20', rating: '8.6', runtime: '2h 5m',
      desc: 'A young girl wanders into a world ruled by gods, witches, and spirits — and must work in a bathhouse for the spirits to free her parents from a curse.',
      director: 'Hayao Miyazaki',
      cast: [{name:'Rumi Hiiragi'},{name:'Miyu Irino'},{name:'Mari Natsuki'}], lang: 'JA' },
    { id: 702, title: 'Your Name', sub: 'Modern Classic', genres: ['anime','romance','fantasy'],
      views: 62000, release: '2016-08-26', rating: '8.4', runtime: '1h 46m',
      desc: 'Two teenagers share a profound, magical connection upon discovering they are swapping bodies. But a disaster threatens to tear them apart across time and space.',
      director: 'Makoto Shinkai',
      cast: [{name:'Ryunosuke Kamiki'},{name:'Mone Kamishiraishi'},{name:'Ryo Narita'}], lang: 'JA' },
    { id: 703, title: 'Akira', sub: 'Cyberpunk', genres: ['anime','sci-fi','action'],
      views: 58000, release: '1988-07-16', rating: '8.0', runtime: '2h 4m',
      desc: 'In a dystopian Neo-Tokyo, a biker gang member is subjected to a secret government project and gains devastating psychic powers.',
      director: 'Katsuhiro Otomo',
      cast: [{name:'Mitsuo Iwata'},{name:'Nozomu Sasaki'},{name:'Mami Koyama'}], lang: 'JA' },
    { id: 704, title: 'Princess Mononoke', sub: 'Studio Ghibli', genres: ['anime','fantasy','adventure'],
      views: 60000, release: '1997-07-12', rating: '8.4', runtime: '2h 14m',
      desc: 'On a journey to find the cure for a Tatarigami\'s curse, Ashitaka finds himself in the middle of a war between the forest gods and a mining colony.',
      director: 'Hayao Miyazaki',
      cast: [{name:'Yoji Matsuda'},{name:'Yuriko Ishida'},{name:'Yuko Tanaka'}], lang: 'JA' },
    { id: 705, title: 'Grave of the Fireflies', sub: 'Historical', genres: ['anime','drama','war'],
      views: 56000, release: '1988-04-16', rating: '8.5', runtime: '1h 29m',
      desc: 'A young boy and his little sister struggle to survive in Japan during the final months of World War II.',
      director: 'Isao Takahata',
      cast: [{name:'Tsutomu Tatsumi'},{name:'Ayano Shiraishi'},{name:'Yoshiko Shinohara'}], lang: 'JA' },
    { id: 706, title: 'Perfect Blue', sub: 'Psychological', genres: ['anime','thriller','mystery'],
      views: 54000, release: '1997-08-05', rating: '8.0', runtime: '1h 21m',
      desc: 'A pop singer quits her group to pursue acting — but the transition unravels her grip on reality, and a stalker blurs the line between performance and truth.',
      director: 'Satoshi Kon',
      cast: [{name:'Junko Iwao'},{name:'Rica Matsumoto'},{name:'Shinpachi Tsuji'}], lang: 'JA' },
    { id: 707, title: 'Ghost in the Shell', sub: 'Cyberpunk', genres: ['anime','sci-fi','action'],
      views: 55000, release: '1995-11-18', rating: '8.0', runtime: '1h 23m',
      desc: 'A cyborg policewoman and her partner hunt a mysterious hacker known as the Puppet Master in a future where technology has blurred the line between human and machine.',
      director: 'Mamoru Oshii',
      cast: [{name:'Atsuko Tanaka'},{name:'Akio Otsuka'},{name:'Koichi Yamadera'}], lang: 'JA' },
    { id: 708, title: 'Wolf Children', sub: 'Slice of Life', genres: ['anime','drama','fantasy'],
      views: 52000, release: '2012-07-21', rating: '8.1', runtime: '1h 57m',
      desc: 'After her werewolf lover passes away, a young woman must raise their two half-wolf children in the countryside, away from prying eyes.',
      director: 'Mamoru Hosoda',
      cast: [{name:'Aoi Miyazaki'},{name:'Takao Osawa'},{name:'Haru Kuroki'}], lang: 'JA' }
  ];

  const DIRECTORS = [
    { name: 'Hayao Miyazaki',   films: 'Spirited Away · Princess Mononoke', tag: 'Studio Ghibli' },
    { name: 'Makoto Shinkai',   films: 'Your Name · Weathering with You', tag: 'Modern Classic' },
    { name: 'Satoshi Kon',      films: 'Perfect Blue · Paprika', tag: 'Psychological' },
    { name: 'Mamoru Hosoda',    films: 'Wolf Children · The Girl Who Leapt', tag: 'Slice of Life' },
    { name: 'Katsuhiro Otomo',  films: 'Akira · Steamboy', tag: 'Cyberpunk' },
    { name: 'Isao Takahata',    films: 'Grave of the Fireflies · Only Yesterday', tag: 'Historical' }
  ];

  const state = {
    heroIndex: 0,
    heroTimer: null,
    sort: 'popular'
  };


  function init() {
    const hero       = $('#anHero');
    const heroDots   = $('#anHeroDots');
    const topTrack   = $('#anTopWatchedTrack');
    const gridEl     = $('#anGrid');
    const gridSec    = $('#anGridSection');
    const sortWrap   = $('#anSort');
    const dirTrack   = $('#anDirectorTrack');
    const drawer     = $('#anDrawer');
    const drawerBody = $('#anDrawerBody');
    const sideCount  = $('#anSideCount');

    if (!hero || !gridEl || !sortWrap) return;

    /* ---------- HERO ---------- */
    const heroSlides = MOVIES.slice(0, 6);

    function buildHero() {
      const slidesHTML = heroSlides.map((m, i) => {
        const castHTML = (m.cast || []).map(c =>
          `<div class="an-hero__cast-member">${avatarHTML(c, 'an-hero__cast-avatar')}<span class="an-hero__cast-name">${esc(c.name)}</span></div>`
        ).join('');

        return `<div class="an-hero__slide${i === 0 ? ' is-active' : ''}">
          <div class="an-hero__bg"><img src="${backdropFor(m.id)}" alt="${esc(m.title)}" /></div>
          <div class="an-hero__content">
            <div class="an-hero__card">
              <span class="an-hero__tag">Anime · Featured</span>
              <h1 class="an-hero__title">${esc(m.title)}</h1>
              <div class="an-hero__meta">
                <span class="an-hero__pill an-hero__pill--sakura">${esc(m.sub)}</span>
                <span class="an-hero__pill an-hero__pill--rating"><i class="fas fa-star"></i> ${esc(m.rating)}</span>
                <span class="an-hero__pill"><i class="fas fa-calendar"></i> ${esc(yearOf(m))}</span>
                <span class="an-hero__pill"><i class="fas fa-clock"></i> ${esc(m.runtime)}</span>
                <span class="an-hero__pill an-hero__pill--hd">${badgeFor(m)}</span>
              </div>
              <p class="an-hero__desc">${esc(m.desc)}</p>
              <div class="an-hero__cast hide-scrollbar">${castHTML}</div>
              <div class="an-hero__actions">
                <button class="an-hero__btn an-hero__btn--primary" data-open="${m.id}" type="button">
                  <i class="fas fa-play"></i> Watch Now
                </button>
                <button class="an-hero__btn an-hero__btn--ghost" data-open="${m.id}" type="button">
                  <i class="fas fa-circle-info"></i> Details
                </button>
              </div>
            </div>
          </div>
        </div>`;
      }).join('');

      hero.insertAdjacentHTML('beforeend', slidesHTML);

      heroDots.innerHTML = heroSlides.map((m, i) =>
        `<button class="an-hero__dot${i === 0 ? ' is-active' : ''}" data-hero-dot="${i}" aria-label="${esc(m.title)}" type="button"></button>`
      ).join('');
    }

    function goHero(index) {
      const slides = $$('.an-hero__slide', hero);
      const dots = $$('.an-hero__dot', heroDots);
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


    function renderTopWatched() {
      const list = MOVIES.slice().sort((a, b) => b.views - a.views).slice(0, 8);
      const items = list.map(m =>
        `<article class="an-marquee__card" data-open="${m.id}" tabindex="0" role="button" aria-label="${esc(m.title)}">
          <span class="an-marquee__rate"><i class="fas fa-star"></i> ${esc(m.rating)}</span>
          <img src="${posterFor(m.id)}" alt="${esc(m.title)} poster" loading="lazy" />
          <div class="an-marquee__body">
            <h3 class="an-marquee__title">${esc(m.title)}</h3>
            <div class="an-marquee__meta">
              <span>${esc(yearOf(m))}</span>
              <span>·</span>
              <span>${esc(m.sub)}</span>
            </div>
          </div>
        </article>`
      ).join('');
      topTrack.innerHTML = `<div class="an-marquee__track">${items}${items}</div>`;
    }

    function renderDirectors() {
      const items = DIRECTORS.map(d =>
        `<article class="an-director">
          <div class="an-director__avatar">${esc(initials(d.name))}</div>
          <div class="an-director__body">
            <h3 class="an-director__name">${esc(d.name)}</h3>
            <p class="an-director__films">${esc(d.films)}</p>
            <span class="an-director__tag"><i class="fas fa-clapperboard"></i> ${esc(d.tag)}</span>
          </div>
        </article>`
      ).join('');
      dirTrack.innerHTML = `<div class="an-marquee__track">${items}${items}</div>`;
    }

    /* ---------- SORT ---------- */
    function sortMovies(list, mode) {
      const out = list.slice();
      switch (mode) {
        case 'latest': return out.sort((a, b) => (b.release || '').localeCompare(a.release || ''));
        case 'rating': return out.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        case 'az':     return out.sort((a, b) => a.title.localeCompare(b.title));
        default:       return out.sort((a, b) => b.views - a.views);
      }
    }


    function cardHTML(m) {
      return `<article class="an-card" data-open="${m.id}" tabindex="0" role="button" aria-label="${esc(m.title)}">
        <div class="an-card__media">
          <span class="an-card__sub">${esc(m.sub)}</span>
          <span class="an-card__rate"><i class="fas fa-star"></i> ${esc(m.rating)}</span>
          <img src="${posterFor(m.id)}" alt="${esc(m.title)} poster" loading="lazy" />
          <span class="an-card__badge">${badgeFor(m)}</span>
        </div>
        <div class="an-card__body">
          <h3 class="an-card__title">${esc(m.title)}</h3>
          <div class="an-card__meta">
            <span>${esc(yearOf(m))}</span>
            <span>${esc(m.runtime)}</span>
          </div>
        </div>
      </article>`;
    }

    function emptyStateHTML(query) {
      return `<div class="an-empty">
        <i class="fas fa-dragon" aria-hidden="true"></i>
        <p>No anime titles match "${esc(query)}".</p>
      </div>`;
    }

    function renderGrid(list) {
      const data = (list && list.length) ? list : sortMovies(MOVIES, state.sort);
      gridEl.innerHTML = data.map(cardHTML).join('');
      const cards = $$('.an-card', gridEl);
      let i = 0;
      function revealBatch() {
        const end = Math.min(i + 4, cards.length);
        for (; i < end; i++) if (cards[i]) cards[i].classList.add('is-visible');
        if (i < cards.length) requestAnimationFrame(revealBatch);
      }
      requestAnimationFrame(revealBatch);
    }

    function renderGridFiltered(list, label) {
      if (!list || !list.length) {
        gridEl.innerHTML = emptyStateHTML(label || '');
        return;
      }
      renderGrid(list);
    }

    /* ---------- DRAWER ---------- */
    function drawerRow(label, value) {
      return `<div class="an-drawer__row">
        <span class="an-drawer__row-label">${esc(label)}</span>
        <span class="an-drawer__row-value">${esc(value)}</span>
      </div>`;
    }

    function openDrawer(id) {
      const m = MOVIES.find(x => String(x.id) === String(id));
      if (!m) return;

      const castHTML = (m.cast || []).map(c =>
        `<div class="an-drawer__cast-member">${avatarHTML(c, 'an-drawer__cast-avatar')}<div class="an-drawer__cast-name">${esc(c.name)}</div></div>`
      ).join('');

      drawerBody.innerHTML = `
        <div class="an-drawer__hero">
          <img src="${backdropFor(m.id)}" alt="${esc(m.title)} backdrop" />
          <div class="an-drawer__hero-content">
            <h2 class="an-drawer__title" id="anDrawerTitle">${esc(m.title)}</h2>
            <div class="an-drawer__meta">
              <span><i class="fas fa-star" style="color:#fbbf24"></i> ${esc(m.rating)}</span>
              <span><i class="fas fa-calendar"></i> ${esc(yearOf(m))}</span>
              <span><i class="fas fa-clock"></i> ${esc(m.runtime)}</span>
              <span><i class="fas fa-film"></i> ${esc(m.sub)}</span>
              <span><i class="fas fa-closed-captioning"></i> ${esc(m.lang)}</span>
            </div>
            <div class="an-drawer__actions">
              <button class="an-drawer__btn an-drawer__btn--primary" type="button"><i class="fas fa-play"></i> Watch Now</button>
              <button class="an-drawer__btn an-drawer__btn--ghost" type="button"><i class="fas fa-plus"></i> Add to List</button>
            </div>
          </div>
        </div>
        <div class="an-drawer__content">
          <div>
            <h3 class="an-drawer__section-title">Synopsis</h3>
            <p class="an-drawer__desc">${esc(m.desc)}</p>
            <h3 class="an-drawer__section-title">Cast</h3>
            <div class="an-drawer__cast hide-scrollbar">${castHTML}</div>
          </div>
          <aside>
            <div class="an-drawer__info-card">
              ${drawerRow('Director', m.director)}
              ${drawerRow('Release', m.release)}
              ${drawerRow('Runtime', m.runtime)}
              ${drawerRow('Rating', m.rating + ' / 10')}
              ${drawerRow('Views', m.views.toLocaleString())}
              ${drawerRow('Genres', (m.genres || []).join(', '))}
              ${drawerRow('Language', m.lang)}
            </div>
          </aside>
        </div>`;

      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const panel = drawer.querySelector('.an-drawer__panel');
      if (panel) panel.scrollTop = 0;
    }

    function closeDrawer() {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }


    function initGenreDropdown() {
      const wrap = $('#fhGenreDropdown');
      if (!wrap) return;

    }

    buildHero();
    renderTopWatched();
    renderGrid();
    renderDirectors();

    if (sideCount) sideCount.textContent = MOVIES.length + '+';
    startHeroTimer();

    /* ---------- EVENTS ---------- */
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
      const card = t.closest('.an-card[data-open], .an-marquee__card[data-open]');
      if (card) { e.preventDefault(); openDrawer(card.dataset.open); }
    });

    sortWrap.addEventListener('click', e => {
      const btn = e.target.closest('.an-sort__btn');
      if (!btn) return;
      $$('.an-sort__btn', sortWrap).forEach(b => b.classList.remove('is-active'));
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

    initGenreDropdown();
  }

  async function loadBackendCatalog() {
    try {
      if (!window.FHApi || !window.FHApi.catalog) return;
      var category = 'anime';
      if (category === '__PATH__') {
        category = window.location.pathname.indexOf('tv-shows') !== -1 ? 'tv-shows' : 'movies';
      }
      var rows = await window.FHApi.catalog(category === 'all' ? null : category);
      if (Array.isArray(rows) && rows.length) MOVIES = rows;
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