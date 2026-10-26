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

  function daysAgo(iso) {
    try {
      const then = new Date(iso).getTime();
      const now = Date.now();
      return Math.max(1, Math.round((now - then) / 86400000));
    } catch (e) { return 0; }
  }

  // Official movie artwork paths from TMDB. Using the real poster assets keeps
  // each movie card visually tied to the actual title instead of random images.
  const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/';
  const MOVIE_ART = {
    1701: { poster: '6izwz7rsy95ARzTR3poZ8H6c5pp.jpg', backdrop: 'eZ239CUp1d6OryZEBPnO2n87gMG.jpg' },
    1702: { poster: '8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', backdrop: '1ZSKH5GGFlM8M32K34GMdaNS2Ew.jpg' },
    1703: { poster: 'kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg', backdrop: 'gsVC7HMf4VR2XFOyqjTSklY2Tms.jpg' },
    1704: { poster: '74xTEgt7R36Fpooo50r9T25onhq.jpg' },
    1705: { poster: 'w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg' },
    1706: { poster: 'iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg', backdrop: 'ctMserH8g2SeOAnCw5gFjdQF8mo.jpg' },
    1707: { poster: 'dB6Krk806zeqd0YNp2ngQ9zXteH.jpg', backdrop: 'acvE3RWjDLgvbL2RtcyzkrsAyNV.jpg' },
    1708: { poster: '8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg', backdrop: 'kVd3a9YeLGkoeR50jGEXM6EqseS.jpg' },
    1709: { poster: 'vZloFAK7NmvMGKE7VkF5UHaz0I.jpg', backdrop: 'h8gHn0OzBoaefsYseUByqsmEDMY.jpg' },
    1710: { poster: '9GBhzXMFjgcZ3FdR9w3bUMMTps5.jpg', backdrop: 'w4pRLYYbhHn3sh9kqRgPZM6GjyS.jpg' },
    1711: { poster: 'vcZWJGvB5xydWuUO1vaTLI82tGi.jpg', backdrop: 'eHMh7kChaNeD4VTdMCXLJbRTzcI.jpg' },
    1712: { poster: 'z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg', backdrop: 'veIyxxi5Gs8gvztLEW1Ysb8rrzs.jpg' }
  };

  const posterFor = id => {
    const art = MOVIE_ART[id];
    return art ? TMDB_IMAGE_BASE + 'w500/' + art.poster : '';
  };

  const backdropFor = id => {
    const art = MOVIE_ART[id];
    return art && art.backdrop ? TMDB_IMAGE_BASE + 'w1280/' + art.backdrop : posterFor(id);
  };

  const castAvatarFor = seed => `https://picsum.photos/seed/lm-cast-${encodeURIComponent(seed)}/200/200`;

  function avatarHTML(person, cls) {
    const seed = encodeURIComponent((person && person.name) || 'x');
    const img  = castAvatarFor(seed);
    const init = esc(initials(person && person.name));
    return `<div class="${cls} ${cls}--photo">
      <img src="${img}" alt="${esc(person.name)}" loading="lazy"
           onerror="this.onerror=null;this.parentNode.classList.remove('${cls}--photo');this.parentNode.innerHTML='${init}';" />
    </div>`;
  }

  let MOVIES = [
    { id: 1701, title: 'Dune: Part Two', sub: 'Sci-Fi Epic', genres: ['sci-fi','adventure','drama'],
      views: 890000, release: '2024-03-01', rating: '8.5', runtime: '2h 46m',
      desc: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family — an epic that reshaped modern sci-fi cinema.',
      director: 'Denis Villeneuve',
      cast: [{name:'Timothée Chalamet'},{name:'Zendaya'},{name:'Rebecca Ferguson'}], lang: 'EN' },
    { id: 1702, title: 'Oppenheimer', sub: 'Biography', genres: ['biography','drama','history'],
      views: 940000, release: '2023-07-21', rating: '8.3', runtime: '3h 0m',
      desc: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb — a sweeping, three-hour portrait of a man and a moment.',
      director: 'Christopher Nolan',
      cast: [{name:'Cillian Murphy'},{name:'Emily Blunt'},{name:'Robert Downey Jr.'}], lang: 'EN' },
    { id: 1703, title: 'Poor Things', sub: 'Dark Comedy', genres: ['comedy','drama','sci-fi'],
      views: 620000, release: '2023-12-08', rating: '7.9', runtime: '2h 21m',
      desc: 'Brought back to life by an unorthodox scientist, a young woman runs off on a whirlwind adventure across the continents to discover the world on her own terms.',
      director: 'Yorgos Lanthimos',
      cast: [{name:'Emma Stone'},{name:'Mark Ruffalo'},{name:'Willem Dafoe'}], lang: 'EN' },
    { id: 1704, title: 'The Batman', sub: 'Superhero Noir', genres: ['action','crime','mystery'],
      views: 780000, release: '2022-03-04', rating: '7.8', runtime: '2h 56m',
      desc: 'In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.',
      director: 'Matt Reeves',
      cast: [{name:'Robert Pattinson'},{name:'Zoë Kravitz'},{name:'Paul Dano'}], lang: 'EN' },
    { id: 1705, title: 'Everything Everywhere All at Once', sub: 'Sci-Fi Comedy', genres: ['sci-fi','comedy','adventure'],
      views: 720000, release: '2022-03-25', rating: '7.8', runtime: '2h 19m',
      desc: 'An aging Chinese immigrant is swept up in an insane adventure in which she alone can save existence by exploring other universes and connecting with the lives she could have led.',
      director: 'Daniel Kwan & Daniel Scheinert',
      cast: [{name:'Michelle Yeoh'},{name:'Ke Huy Quan'},{name:'Jamie Lee Curtis'}], lang: 'EN' },
    { id: 1706, title: 'Barbie', sub: 'Comedy Fantasy', genres: ['comedy','fantasy','adventure'],
      views: 850000, release: '2023-07-21', rating: '6.8', runtime: '1h 54m',
      desc: 'Barbie suffers a crisis that leads her to question her world and her existence — and journeys to the real world with Ken in tow.',
      director: 'Greta Gerwig',
      cast: [{name:'Margot Robbie'},{name:'Ryan Gosling'},{name:'America Ferrera'}], lang: 'EN' },
    { id: 1707, title: 'Killers of the Flower Moon', sub: 'Crime Drama', genres: ['crime','drama','history'],
      views: 540000, release: '2023-10-20', rating: '7.6', runtime: '3h 26m',
      desc: 'Members of the Osage tribe in 1920s Oklahoma are murdered under mysterious circumstances, sparking a major F.B.I. investigation.',
      director: 'Martin Scorsese',
      cast: [{name:'Leonardo DiCaprio'},{name:'Lily Gladstone'},{name:'Robert De Niro'}], lang: 'EN' },
    { id: 1708, title: 'Spider-Man: Across the Spider-Verse', sub: 'Animation', genres: ['animation','action','adventure'],
      views: 920000, release: '2023-06-02', rating: '8.6', runtime: '2h 20m',
      desc: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
      director: 'Joaquim Dos Santos',
      cast: [{name:'Shameik Moore'},{name:'Hailee Steinfeld'},{name:'Oscar Isaac'}], lang: 'EN' },
    { id: 1709, title: 'John Wick: Chapter 4', sub: 'Action', genres: ['action','crime','thriller'],
      views: 680000, release: '2023-03-24', rating: '7.7', runtime: '2h 49m',
      desc: 'John Wick uncovers a path to defeating the High Table — but before he can earn his freedom, he must face a new enemy with powerful alliances across the globe.',
      director: 'Chad Stahelski',
      cast: [{name:'Keanu Reeves'},{name:'Donnie Yen'},{name:'Bill Skarsgård'}], lang: 'EN' },
    { id: 1710, title: 'The Marvels', sub: 'Superhero', genres: ['action','adventure','sci-fi'],
      views: 420000, release: '2023-11-10', rating: '5.6', runtime: '1h 45m',
      desc: 'Carol Danvers, Kamala Khan, and Monica Rambeau begin swapping places every time they use their powers — and must team up to save the universe.',
      director: 'Nia DaCosta',
      cast: [{name:'Brie Larson'},{name:'Iman Vellani'},{name:'Teyonah Parris'}], lang: 'EN' },
    { id: 1711, title: 'Napoleon', sub: 'Historical Epic', genres: ['biography','history','drama'],
      views: 480000, release: '2023-11-22', rating: '6.4', runtime: '2h 38m',
      desc: 'An original and personal look at Napoleon Bonaparte\'s origins and his swift, ruthless climb to emperor, viewed through the prism of his addictive relationship with Josephine.',
      director: 'Ridley Scott',
      cast: [{name:'Joaquin Phoenix'},{name:'Vanessa Kirby'},{name:'Tahar Rahim'}], lang: 'EN' },
    { id: 1712, title: 'Godzilla x Kong: The New Empire', sub: 'Monster Action', genres: ['action','sci-fi','adventure'],
      views: 610000, release: '2024-03-29', rating: '6.3', runtime: '1h 55m',
      desc: 'Two ancient titans, Godzilla and Kong, clash in an epic battle as humans unravel their intertwined origins and their connection to Skull Island\'s mysteries.',
      director: 'Adam Wingard',
      cast: [{name:'Rebecca Hall'},{name:'Brian Tyree Henry'},{name:'Dan Stevens'}], lang: 'EN' }
  ];

  const GENRES = [
    { name: 'Action',     icon: 'fa-fire',                count: 42 },
    { name: 'Sci-Fi',     icon: 'fa-rocket',              count: 28 },
    { name: 'Drama',      icon: 'fa-masks-theater',       count: 56 },
    { name: 'Comedy',     icon: 'fa-face-laugh-beam',     count: 34 },
    { name: 'Thriller',   icon: 'fa-bolt',                count: 22 },
    { name: 'Adventure',  icon: 'fa-compass',             count: 30 },
    { name: 'Crime',      icon: 'fa-mask',                count: 18 },
    { name: 'Animation',  icon: 'fa-wand-magic-sparkles', count: 24 }
  ];

  const state = {
    heroIndex: 0,
    heroTimer: null,
    sort: 'latest',
    activeNew: 0
  };

  function init() {
    const hero       = $('#lmHero');
    const heroDots   = $('#lmHeroDots');
    const gridEl     = $('#lmGrid');
    const sortWrap   = $('#lmSort');
    const tickerTk   = $('#lmTickerTrack');
    const drawer     = $('#lmDrawer');
    const drawerBody = $('#lmDrawerBody');
    const sideCount  = $('#lmSideCount');
    const newFeature = $('#lmNewFeature');
    const newList    = $('#lmNewList');
    const genresEl   = $('#lmGenres');

    if (!hero || !gridEl || !sortWrap) return;

    function sortByLatest(list) {
      return list.slice().sort((a, b) => (b.release || '').localeCompare(a.release || ''));
    }

    const latestFirst = sortByLatest(MOVIES);
    const heroSlides  = latestFirst.slice(0, 6);

    function buildHero() {
      const slidesHTML = heroSlides.map((m, i) => {
        const castHTML = (m.cast || []).map(c =>
          `<div class="lm-hero__cast-member">${avatarHTML(c, 'lm-hero__cast-avatar')}<span class="lm-hero__cast-name">${esc(c.name)}</span></div>`
        ).join('');

        return `<div class="lm-hero__slide${i === 0 ? ' is-active' : ''}">
          <div class="lm-hero__bg"><img src="${backdropFor(m.id)}" alt="${esc(m.title)}" /></div>
          <div class="lm-hero__content">
            <div class="lm-hero__card">
              <span class="lm-hero__tag">Latest · Featured Release</span>
              <h1 class="lm-hero__title">${esc(m.title)}</h1>
              <div class="lm-hero__meta">
                <span class="lm-hero__pill lm-hero__pill--violet">${esc(m.sub)}</span>
                <span class="lm-hero__pill lm-hero__pill--rating"><i class="fas fa-star"></i> ${esc(m.rating)}</span>
                <span class="lm-hero__pill"><i class="fas fa-calendar"></i> ${esc(yearOf(m))}</span>
                <span class="lm-hero__pill"><i class="fas fa-clock"></i> ${esc(m.runtime)}</span>
                <span class="lm-hero__pill lm-hero__pill--pink"><i class="fas fa-clock-rotate-left"></i> ${daysAgo(m.release)}d ago</span>
              </div>
              <p class="lm-hero__desc">${esc(m.desc)}</p>
              <div class="lm-hero__cast hide-scrollbar">${castHTML}</div>
              <div class="lm-hero__actions">
                <button class="lm-hero__btn lm-hero__btn--primary" data-open="${m.id}" type="button">
                  <i class="fas fa-play"></i> Watch Now
                </button>
                <button class="lm-hero__btn lm-hero__btn--ghost" data-open="${m.id}" type="button">
                  <i class="fas fa-circle-info"></i> Details
                </button>
              </div>
            </div>
          </div>
        </div>`;
      }).join('');

      hero.insertAdjacentHTML('beforeend', slidesHTML);

      heroDots.innerHTML = heroSlides.map((m, i) =>
        `<button class="lm-hero__dot${i === 0 ? ' is-active' : ''}" data-hero-dot="${i}" aria-label="${esc(m.title)}" type="button"></button>`
      ).join('');
    }

    function goHero(index) {
      const slides = $$('.lm-hero__slide', hero);
      const dots = $$('.lm-hero__dot', heroDots);
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

    function badgeFor(m) {
      return m.rating >= 8.4 ? '4K' :
             m.rating >= 7.5 ? 'HD' : 'NEW';
    }

    function newBadgeFor(m) {
      const days = daysAgo(m.release);
      if (days <= 14) return { text: 'NEW', cls: '' };
      if (m.rating >= 8) return { text: 'HOT', cls: ' lm-card__new--hot' };
      return { text: 'NEW', cls: '' };
    }

    function renderTicker() {
      const list = latestFirst.slice(0, 10);
      const items = list.map(m =>
        `<div class="lm-ticker__item" data-open="${m.id}" role="button" tabindex="0" aria-label="${esc(m.title)}">
          <div class="lm-ticker__thumb">
            <img src="${posterFor(m.id)}" alt="${esc(m.title)}" loading="lazy" />
          </div>
          <div class="lm-ticker__text">
            <span class="lm-ticker__title">${esc(m.title)}</span>
            <span class="lm-ticker__meta">${esc(m.sub)} · ${esc(yearOf(m))}</span>
          </div>
          <span class="lm-ticker__badge">${daysAgo(m.release)}d</span>
        </div>`
      ).join('');
      tickerTk.innerHTML = `<div class="lm-ticker__scroll">${items}${items}</div>`;
    }

    function sortMovies(list, mode) {
      const out = list.slice();
      switch (mode) {
        case 'latest':  return out.sort((a, b) => (b.release || '').localeCompare(a.release || ''));
        case 'popular': return out.sort((a, b) => b.views - a.views);
        case 'rating':  return out.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        case 'az':      return out.sort((a, b) => a.title.localeCompare(b.title));
        default:        return out.sort((a, b) => (b.release || '').localeCompare(a.release || ''));
      }
    }

    function cardHTML(m) {
      const nb = newBadgeFor(m);
      return `<article class="lm-card" data-open="${m.id}" tabindex="0" role="button" aria-label="${esc(m.title)}">
        <div class="lm-card__media">
          <span class="lm-card__new${nb.cls}">${nb.text}</span>
          <span class="lm-card__rate"><i class="fas fa-star"></i> ${esc(m.rating)}</span>
          <img src="${posterFor(m.id)}" alt="${esc(m.title)} poster" loading="lazy" />
          <span class="lm-card__badge">${badgeFor(m)}</span>
        </div>
        <div class="lm-card__body">
          <h3 class="lm-card__title">${esc(m.title)}</h3>
          <div class="lm-card__meta">
            <span>${esc(yearOf(m))}</span>
            <span>${esc(m.runtime)}</span>
          </div>
        </div>
      </article>`;
    }

    function renderGrid() {
      const data = sortMovies(MOVIES, state.sort);
      gridEl.innerHTML = data.map(cardHTML).join('');
      const cards = $$('.lm-card', gridEl);
      let i = 0;
      function batch() {
        const end = Math.min(i + 4, cards.length);
        for (; i < end; i++) if (cards[i]) cards[i].classList.add('is-visible');
        if (i < cards.length) requestAnimationFrame(batch);
      }
      requestAnimationFrame(batch);
    }

    function buildNewSection() {
      const top = latestFirst.slice(0, 6);
      if (!top.length) return;
      renderNewFeature(top[0]);
      renderNewList(top);
    }

    function renderNewFeature(m) {
      if (!newFeature || !m) return;
      newFeature.setAttribute('data-open', m.id);
      newFeature.setAttribute('tabindex', '0');
      newFeature.setAttribute('role', 'button');
      newFeature.innerHTML = `
        <img src="${backdropFor(m.id)}" alt="${esc(m.title)}" />
        <span class="lm-new__rank"><i class="fas fa-sparkles"></i> Just Dropped</span>
        <div class="lm-new__feature-body">
          <h3 class="lm-new__feature-title">${esc(m.title)}</h3>
          <div class="lm-new__feature-meta">
            <span><i class="fas fa-star" style="color:#fbbf24"></i> ${esc(m.rating)}</span>
            <span><i class="fas fa-calendar"></i> ${esc(yearOf(m))}</span>
            <span><i class="fas fa-clock"></i> ${esc(m.runtime)}</span>
            <span><i class="fas fa-clock-rotate-left" style="color:#f0abfc"></i> ${daysAgo(m.release)} days ago</span>
          </div>
          <p class="lm-new__feature-desc">${esc(m.desc)}</p>
          <div class="lm-new__feature-actions">
            <button class="lm-new__btn lm-new__btn--primary" type="button"><i class="fas fa-play"></i> Watch Now</button>
            <button class="lm-new__btn lm-new__btn--ghost" type="button"><i class="fas fa-circle-info"></i> Details</button>
          </div>
        </div>`;
    }

    function renderNewList(list) {
      if (!newList) return;
      newList.innerHTML = list.map((m, i) => {
        const isActive = i === state.activeNew;
        return `<div class="lm-new__row${isActive ? ' is-active' : ''}"
                     data-open="${m.id}" data-new-index="${i}"
                     tabindex="0" role="button" aria-label="${esc(m.title)}">
          <div class="lm-new__row-num">${i + 1}</div>
          <div class="lm-new__row-thumb">
            <img src="${posterFor(m.id)}" alt="${esc(m.title)}" loading="lazy" />
          </div>
          <div class="lm-new__row-body">
            <h4 class="lm-new__row-title">${esc(m.title)}</h4>
            <div class="lm-new__row-meta">
              <span><i class="fas fa-star" style="color:#fbbf24"></i> ${esc(m.rating)}</span>
              <span>${esc(yearOf(m))}</span>
            </div>
          </div>
          <span class="lm-new__row-days"><i class="fas fa-clock-rotate-left"></i> ${daysAgo(m.release)}d</span>
        </div>`;
      }).join('');
    }

    function setActiveNew(index, id, skipFeature) {
      state.activeNew = index;
      const rows = $$('.lm-new__row', newList);
      rows.forEach(r => {
        r.classList.toggle('is-active', parseInt(r.dataset.newIndex, 10) === index);
      });
      if (skipFeature) return;
      const m = MOVIES.find(x => String(x.id) === String(id));
      if (m) renderNewFeature(m);
    }

    function renderGenres() {
      if (!genresEl) return;
      genresEl.innerHTML = GENRES.map(g =>
        `<div class="lm-genre" role="button" tabindex="0" data-genre="${esc(g.name)}">
          <div class="lm-genre__icon"><i class="fas ${g.icon}"></i></div>
          <div class="lm-genre__body">
            <h3 class="lm-genre__name">${esc(g.name)}</h3>
            <span class="lm-genre__count">${g.count} titles</span>
          </div>
        </div>`
      ).join('');
    }

    function drawerRow(label, value) {
      return `<div class="lm-drawer__row">
        <span class="lm-drawer__row-label">${esc(label)}</span>
        <span class="lm-drawer__row-value">${esc(value)}</span>
      </div>`;
    }

    function openDrawer(id) {
      const m = MOVIES.find(x => String(x.id) === String(id));
      if (!m) return;

      const castHTML = (m.cast || []).map(c =>
        `<div class="lm-drawer__cast-member">${avatarHTML(c, 'lm-drawer__cast-avatar')}<div class="lm-drawer__cast-name">${esc(c.name)}</div></div>`
      ).join('');

      drawerBody.innerHTML = `
        <div class="lm-drawer__hero">
          <img src="${backdropFor(m.id)}" alt="${esc(m.title)} backdrop" />
          <div class="lm-drawer__hero-content">
            <h2 class="lm-drawer__title" id="lmDrawerTitle">${esc(m.title)}</h2>
            <div class="lm-drawer__meta">
              <span><i class="fas fa-star" style="color:#fbbf24"></i> ${esc(m.rating)}</span>
              <span><i class="fas fa-calendar"></i> ${esc(yearOf(m))}</span>
              <span><i class="fas fa-clock"></i> ${esc(m.runtime)}</span>
              <span><i class="fas fa-clock-rotate-left" style="color:#f0abfc"></i> ${daysAgo(m.release)} days ago</span>
              <span><i class="fas fa-closed-captioning"></i> ${esc(m.lang)}</span>
            </div>
            <div class="lm-drawer__actions">
              <button class="lm-drawer__btn lm-drawer__btn--primary" type="button"><i class="fas fa-play"></i> Watch Now</button>
              <button class="lm-drawer__btn lm-drawer__btn--ghost" type="button"><i class="fas fa-plus"></i> Add to List</button>
            </div>
          </div>
        </div>
        <div class="lm-drawer__content">
          <div>
            <h3 class="lm-drawer__section-title">Synopsis</h3>
            <p class="lm-drawer__desc">${esc(m.desc)}</p>
            <h3 class="lm-drawer__section-title">Cast</h3>
            <div class="lm-drawer__cast hide-scrollbar">${castHTML}</div>
          </div>
          <aside>
            <div class="lm-drawer__info-card">
              ${drawerRow('Director', m.director)}
              ${drawerRow('Released', m.release)}
              ${drawerRow('Runtime', m.runtime)}
              ${drawerRow('Rating', m.rating + ' / 10')}
              ${drawerRow('Genres', (m.genres || []).join(', '))}
              ${drawerRow('Language', m.lang)}
            </div>
          </aside>
        </div>`;

      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const panel = drawer.querySelector('.lm-drawer__panel');
      if (panel) panel.scrollTop = 0;
    }

    function closeDrawer() {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    buildHero();
    renderTicker();
    renderGrid();
    buildNewSection();
    renderGenres();

    if (sideCount) sideCount.textContent = MOVIES.length + '+';
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

      const newRow = t.closest('.lm-new__row[data-new-index]');
      if (newRow) {
        const idx = parseInt(newRow.dataset.newIndex, 10);
        const openId = newRow.dataset.open;
        if (t.closest('.lm-new__row-title') ||
            t.closest('.lm-new__row-meta') ||
            t.closest('.lm-new__row-days') ||
            t.closest('.lm-new__row-num')) {
          e.preventDefault();
          setActiveNew(idx, openId);
          openDrawer(openId);
          return;
        }
        e.preventDefault();
        setActiveNew(idx, openId);
        return;
      }

      const featureBtn = t.closest('.lm-new__feature .lm-new__btn');
      if (featureBtn) {
        const fId = newFeature.dataset.open;
        if (fId) {
          e.preventDefault();
          openDrawer(fId);
        }
        return;
      }

      const trigger = t.closest('[data-open]');
      if (trigger && !trigger.classList.contains('lm-new__row') && !trigger.classList.contains('lm-new__feature') && !trigger.classList.contains('lm-ticker__item')) {
        e.preventDefault();
        openDrawer(trigger.dataset.open);
        return;
      }
      if (trigger && (trigger.classList.contains('lm-new__feature') || trigger.classList.contains('lm-ticker__item'))) {
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
      const newRow = t.closest('.lm-new__row[data-new-index]');
      if (newRow) {
        e.preventDefault();
        setActiveNew(parseInt(newRow.dataset.newIndex, 10), newRow.dataset.open);
        return;
      }
      const card = t.closest('.lm-card[data-open], .lm-ticker__item[data-open]');
      if (card) { e.preventDefault(); openDrawer(card.dataset.open); }
    });

    sortWrap.addEventListener('click', e => {
      const btn = e.target.closest('.lm-sort__btn');
      if (!btn) return;
      $$('.lm-sort__btn', sortWrap).forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      state.sort = btn.dataset.sort || 'latest';
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
      var category = '__PATH__';
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