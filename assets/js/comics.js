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

  const posterFor = id => `https://picsum.photos/seed/comic-poster-${id}/500/750`;
  const coverFor  = id => `https://picsum.photos/seed/comic-cover-${id}/1600/900`;
  const creatorAvatarFor = seed => `https://picsum.photos/seed/comic-creator-${encodeURIComponent(seed)}/200/200`;

  function creatorHTML(person, cls) {
    const seed = encodeURIComponent((person && person.name) || 'x');
    const img  = creatorAvatarFor(seed);
    const init = esc(initials(person && person.name));
    return `<div class="${cls} ${cls}--photo">
      <img src="${img}" alt="${esc(person.name)}" loading="lazy"
           onerror="this.onerror=null;this.parentNode.classList.remove('${cls}--photo');this.parentNode.innerHTML='${init}';" />
    </div>`;
  }

  /* ============================================================
     MOCK DATA
     ============================================================ */
  let COMICS = [
    { id: 1101, title: 'Watchmen', sub: 'Superhero', type: 'Comic', genres: ['superhero','mystery','drama'],
      views: 66000, release: '1986-09-01', rating: '9.8', issues: 12,
      desc: 'A murder investigation pulls a retired team of masked vigilantes back into a world that has outgrown them. Alan Moore and Dave Gibbons deconstruct the superhero genre into something colder, stranger, and unforgettable.',
      writer: 'Alan Moore', artist: 'Dave Gibbons', publisher: 'DC Comics',
      creators: [{name:'Alan Moore'},{name:'Dave Gibbons'},{name:'John Higgins'}], lang: 'EN' },
    { id: 1102, title: 'The Sandman', sub: 'Fantasy', type: 'Comic', genres: ['fantasy','horror','drama'],
      views: 62000, release: '1989-01-01', rating: '9.7', issues: 75,
      desc: 'Dream of the Endless escapes a seventy-year imprisonment and must rebuild his shattered realm. Neil Gaiman blends mythology, horror and literature into a landmark of the medium.',
      writer: 'Neil Gaiman', artist: 'Sam Kieth', publisher: 'DC / Vertigo',
      creators: [{name:'Neil Gaiman'},{name:'Sam Kieth'},{name:'Mike Dringenberg'}], lang: 'EN' },
    { id: 1103, title: 'Saga', sub: 'Space Opera', type: 'Comic', genres: ['sci-fi','fantasy','drama'],
      views: 58000, release: '2012-03-14', rating: '9.5', issues: 60,
      desc: 'Two soldiers from opposite sides of an endless galactic war fall in love and go on the run with their newborn daughter.',
      writer: 'Brian K. Vaughan', artist: 'Fiona Staples', publisher: 'Image Comics',
      creators: [{name:'Brian K. Vaughan'},{name:'Fiona Staples'}], lang: 'EN' },
    { id: 1104, title: 'Batman: The Killing Joke', sub: 'Superhero', type: 'Graphic Novel', genres: ['superhero','crime','drama'],
      views: 60000, release: '1988-03-29', rating: '9.4', issues: 1,
      desc: 'The Joker escapes Arkham and tries to prove that one bad day can drive anyone insane.',
      writer: 'Alan Moore', artist: 'Brian Bolland', publisher: 'DC Comics',
      creators: [{name:'Alan Moore'},{name:'Brian Bolland'}], lang: 'EN' },
    { id: 1105, title: 'V for Vendetta', sub: 'Dystopian', type: 'Comic', genres: ['dystopian','thriller','drama'],
      views: 54000, release: '1982-01-01', rating: '9.3', issues: 10,
      desc: 'In a fascist Britain, a masked anarchist called V wages war against the state.',
      writer: 'Alan Moore', artist: 'David Lloyd', publisher: 'DC / Vertigo',
      creators: [{name:'Alan Moore'},{name:'David Lloyd'}], lang: 'EN' },
    { id: 1106, title: 'Maus', sub: 'Historical', type: 'Graphic Novel', genres: ['history','drama','memoir'],
      views: 56000, release: '1980-01-01', rating: '9.7', issues: 2,
      desc: 'Art Spiegelman interviews his father about surviving the Holocaust. The only graphic novel to win a Pulitzer Prize.',
      writer: 'Art Spiegelman', artist: 'Art Spiegelman', publisher: 'Pantheon Books',
      creators: [{name:'Art Spiegelman'}], lang: 'EN' },
    { id: 1107, title: 'Invincible', sub: 'Superhero', type: 'Comic', genres: ['superhero','action','drama'],
      views: 52000, release: '2003-01-22', rating: '9.0', issues: 144,
      desc: 'Mark Grayson just wanted to be a normal teenager — until his powers kicked in.',
      writer: 'Robert Kirkman', artist: 'Cory Walker', publisher: 'Image Comics',
      creators: [{name:'Robert Kirkman'},{name:'Cory Walker'},{name:'Ryan Ottley'}], lang: 'EN' },
    { id: 1108, title: 'Persepolis', sub: 'Memoir', type: 'Graphic Novel', genres: ['memoir','history','drama'],
      views: 48000, release: '2000-01-01', rating: '9.2', issues: 4,
      desc: 'Growing up during the Islamic Revolution in Iran — Marjane Satrapi tells her story through bold black-and-white panels.',
      writer: 'Marjane Satrapi', artist: 'Marjane Satrapi', publisher: "L'Association",
      creators: [{name:'Marjane Satrapi'}], lang: 'FR' }
  ];

  const MOVIES = [
    { id: 1201, title: 'The Dark Knight', sub: 'Superhero', type: 'Movie', genres: ['superhero','crime','thriller'],
      views: 68000, release: '2008-07-18', rating: '9.0', runtime: '2h 32m',
      desc: 'When the Joker unleashes chaos on Gotham, Batman, Gordon and Harvey Dent must confront the fine line between hero and vigilante.',
      director: 'Christopher Nolan', publisher: 'Warner Bros.', basedOn: 'DC Comics',
      creators: [{name:'Christian Bale'},{name:'Heath Ledger'},{name:'Aaron Eckhart'}], lang: 'EN' },
    { id: 1202, title: 'Avengers: Endgame', sub: 'Superhero', type: 'Movie', genres: ['superhero','action','sci-fi'],
      views: 72000, release: '2019-04-26', rating: '8.4', runtime: '3h 1m',
      desc: 'After the devastating events of Infinity War, the remaining Avengers assemble one final time.',
      director: 'Anthony & Joe Russo', publisher: 'Marvel Studios', basedOn: 'Marvel Comics',
      creators: [{name:'Robert Downey Jr.'},{name:'Chris Evans'},{name:'Scarlett Johansson'}], lang: 'EN' },
    { id: 1203, title: 'Spider-Man: Into the Spider-Verse', sub: 'Animation', type: 'Movie', genres: ['superhero','animation','action'],
      views: 66000, release: '2018-12-14', rating: '8.4', runtime: '1h 57m',
      desc: 'Teenager Miles Morales becomes Spider-Man of his reality and joins heroes from across dimensions.',
      director: 'Bob Persichetti', publisher: 'Sony Pictures', basedOn: 'Marvel Comics',
      creators: [{name:'Shameik Moore'},{name:'Jake Johnson'},{name:'Hailee Steinfeld'}], lang: 'EN' },
    { id: 1204, title: 'Watchmen', sub: 'Superhero', type: 'Movie', genres: ['superhero','mystery','drama'],
      views: 52000, release: '2009-03-06', rating: '7.6', runtime: '2h 42m',
      desc: 'A gritty adaptation of Moore and Gibbons\' graphic novel.',
      director: 'Zack Snyder', publisher: 'Warner Bros.', basedOn: 'DC Comics',
      creators: [{name:'Malin Akerman'},{name:'Billy Crudup'},{name:'Jackie Earle Haley'}], lang: 'EN' },
    { id: 1205, title: 'Sin City', sub: 'Neo-Noir', type: 'Movie', genres: ['crime','thriller','neo-noir'],
      views: 48000, release: '2005-04-01', rating: '8.0', runtime: '2h 4m',
      desc: 'An anthology of interlocking crime stories set in Basin City.',
      director: 'Frank Miller & Robert Rodriguez', publisher: 'Miramax', basedOn: 'Dark Horse Comics',
      creators: [{name:'Bruce Willis'},{name:'Mickey Rourke'},{name:'Jessica Alba'}], lang: 'EN' },
    { id: 1206, title: '300', sub: 'Historical', type: 'Movie', genres: ['action','history','war'],
      views: 50000, release: '2006-03-09', rating: '7.6', runtime: '1h 57m',
      desc: 'King Leonidas and three hundred Spartans hold the pass at Thermopylae.',
      director: 'Zack Snyder', publisher: 'Warner Bros.', basedOn: 'Dark Horse Comics',
      creators: [{name:'Gerard Butler'},{name:'Lena Headey'},{name:'David Wenham'}], lang: 'EN' }
  ];

  const PUBLISHERS = [
    { name: 'DC Comics',         titles: 'Batman · Superman · Watchmen',         tag: 'The Big Two' },
    { name: 'Marvel Comics',     titles: 'Spider-Man · Avengers · X-Men',        tag: 'The Big Two' },
    { name: 'Image Comics',      titles: 'Saga · Invincible · The Walking Dead', tag: 'Creator-Owned' },
    { name: 'Dark Horse Comics', titles: 'Sin City · Hellboy · 300',             tag: 'Indie Giant' },
    { name: 'Vertigo',           titles: 'Sandman · V for Vendetta · Preacher',  tag: 'Mature Readers' },
    { name: 'IDW Publishing',    titles: 'Locke & Key · TMNT · Sonic',           tag: 'Licensed & Indie' }
  ];

  const state = {
    heroIndex: 0,
    heroTimer: null,
    comicsSort: 'popular',
    moviesSort: 'popular'
  };

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    const hero       = $('#cmHero');
    const heroDots   = $('#cmHeroDots');
    const topTrack   = $('#cmTopRatedTrack');
    const comicsGrid = $('#cmComicsGrid');
    const comicsSort = $('#cmComicsSort');
    const moviesGrid = $('#cmMoviesGrid');
    const moviesSort = $('#cmMoviesSort');
    const pubTrack   = $('#cmPublisherTrack');
    const drawer     = $('#cmDrawer');
    const drawerBody = $('#cmDrawerBody');
    const sideCount  = $('#cmSideCount');

    if (!hero || !comicsGrid || !moviesGrid) return;

    /* ---------- HERO ---------- */
    const heroSlides = COMICS.slice(0, 6);

    function buildHero() {
      const slidesHTML = heroSlides.map((m, i) => {
        const creatorsHTML = (m.creators || []).map(p =>
          `<div class="cm-hero__creator">${creatorHTML(p, 'cm-hero__creator-avatar')}<span class="cm-hero__creator-name">${esc(p.name)}</span></div>`
        ).join('');

        return `<div class="cm-hero__slide${i === 0 ? ' is-active' : ''}">
          <div class="cm-hero__bg"><img src="${coverFor(m.id)}" alt="${esc(m.title)}" /></div>
          <div class="cm-hero__content">
            <div class="cm-hero__card">
              <span class="cm-hero__tag">Comics · Featured</span>
              <h1 class="cm-hero__title">${esc(m.title)}</h1>
              <div class="cm-hero__meta">
                <span class="cm-hero__pill cm-hero__pill--yellow">${esc(m.sub)}</span>
                <span class="cm-hero__pill cm-hero__pill--rating"><i class="fas fa-star"></i> ${esc(m.rating)}</span>
                <span class="cm-hero__pill"><i class="fas fa-calendar"></i> ${esc(yearOf(m))}</span>
                <span class="cm-hero__pill"><i class="fas fa-book"></i> ${esc(m.issues)} Issues</span>
                <span class="cm-hero__pill cm-hero__pill--red"><i class="fas fa-building"></i> ${esc(m.publisher)}</span>
              </div>
              <p class="cm-hero__desc">${esc(m.desc)}</p>
              <div class="cm-hero__creators hide-scrollbar">${creatorsHTML}</div>
              <div class="cm-hero__actions">
                <button class="cm-hero__btn cm-hero__btn--primary" data-open="${m.id}" type="button">
                  <i class="fas fa-book-open"></i> Read Now
                </button>
                <button class="cm-hero__btn cm-hero__btn--ghost" data-open="${m.id}" type="button">
                  <i class="fas fa-circle-info"></i> Details
                </button>
              </div>
            </div>
          </div>
        </div>`;
      }).join('');

      hero.insertAdjacentHTML('beforeend', slidesHTML);

      heroDots.innerHTML = heroSlides.map((m, i) =>
        `<button class="cm-hero__dot${i === 0 ? ' is-active' : ''}" data-hero-dot="${i}" aria-label="${esc(m.title)}" type="button"></button>`
      ).join('');
    }

    function goHero(index) {
      const slides = $$('.cm-hero__slide', hero);
      const dots = $$('.cm-hero__dot', heroDots);
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

    /* ---------- TOP RATED MARQUEE ---------- */
    function renderTopRated() {
      if (!topTrack) return;
      const list = COMICS.slice().sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating)).slice(0, 6);
      const items = list.map(m =>
        `<article class="cm-marquee__card" data-open="${m.id}" tabindex="0" role="button" aria-label="${esc(m.title)}">
          <span class="cm-marquee__rate"><i class="fas fa-star"></i> ${esc(m.rating)}</span>
          <img src="${posterFor(m.id)}" alt="${esc(m.title)} cover" loading="lazy" />
          <div class="cm-marquee__body">
            <h3 class="cm-marquee__title">${esc(m.title)}</h3>
            <div class="cm-marquee__meta">
              <span>${esc(yearOf(m))}</span>
              <span>·</span>
              <span>${esc(m.sub)}</span>
            </div>
          </div>
        </article>`
      ).join('');
      topTrack.innerHTML = `<div class="cm-marquee__track">${items}${items}</div>`;
    }

    /* ---------- PUBLISHERS ---------- */
    function renderPublishers() {
      if (!pubTrack) return;
      const items = PUBLISHERS.map(p =>
        `<article class="cm-publisher">
          <div class="cm-publisher__avatar">${esc(initials(p.name))}</div>
          <div class="cm-publisher__body">
            <h3 class="cm-publisher__name">${esc(p.name)}</h3>
            <p class="cm-publisher__titles">${esc(p.titles)}</p>
            <span class="cm-publisher__tag"><i class="fas fa-building"></i> ${esc(p.tag)}</span>
          </div>
        </article>`
      ).join('');
      pubTrack.innerHTML = `<div class="cm-marquee__track">${items}${items}</div>`;
    }

    /* ---------- SORT ---------- */
    function sortList(list, mode) {
      const out = list.slice();
      switch (mode) {
        case 'latest': return out.sort((a, b) => (b.release || '').localeCompare(a.release || ''));
        case 'rating': return out.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        case 'az':     return out.sort((a, b) => a.title.localeCompare(b.title));
        default:       return out.sort((a, b) => b.views - a.views);
      }
    }

    /* ---------- CARDS ---------- */
    function comicCardHTML(m) {
      return `<article class="cm-card" data-open="${m.id}" tabindex="0" role="button" aria-label="${esc(m.title)}">
        <div class="cm-card__media">
          <span class="cm-card__sub">${esc(m.sub)}</span>
          <span class="cm-card__rate"><i class="fas fa-star"></i> ${esc(m.rating)}</span>
          <img src="${posterFor(m.id)}" alt="${esc(m.title)} poster" loading="lazy" />
          <span class="cm-card__badge">${badgeFor(m)}</span>
        </div>
        <div class="cm-card__body">
          <h3 class="cm-card__title">${esc(m.title)}</h3>
          <div class="cm-card__meta">
            <span>${esc(yearOf(m))}</span>
            <span>${esc(m.issues)} Issues</span>
          </div>
        </div>
      </article>`;
    }

    function movieCardHTML(m) {
      return `<article class="cm-card" data-open="${m.id}" tabindex="0" role="button" aria-label="${esc(m.title)}">
        <div class="cm-card__media">
          <span class="cm-card__sub">${esc(m.sub)}</span>
          <span class="cm-card__rate"><i class="fas fa-star"></i> ${esc(m.rating)}</span>
          <img src="${coverFor(m.id)}" alt="${esc(m.title)} poster" loading="lazy" />
          <span class="cm-card__badge">${badgeFor(m)}</span>
        </div>
        <div class="cm-card__body">
          <h3 class="cm-card__title">${esc(m.title)}</h3>
          <div class="cm-card__meta">
            <span>${esc(yearOf(m))}</span>
            <span>${esc(m.runtime)}</span>
          </div>
        </div>
      </article>`;
    }

    function revealCards(grid) {
      const cards = $$('.cm-card', grid);
      let i = 0;
      function batch() {
        const end = Math.min(i + 4, cards.length);
        for (; i < end; i++) if (cards[i]) cards[i].classList.add('is-visible');
        if (i < cards.length) requestAnimationFrame(batch);
      }
      requestAnimationFrame(batch);
    }

    function renderComicsGrid() {
      const data = sortList(COMICS, state.comicsSort);
      comicsGrid.innerHTML = data.map(comicCardHTML).join('');
      revealCards(comicsGrid);
    }

    function renderMoviesGrid() {
      const data = sortList(MOVIES, state.moviesSort);
      moviesGrid.innerHTML = data.map(movieCardHTML).join('');
      revealCards(moviesGrid);
    }

    /* ---------- DRAWER ---------- */
    function findItem(id) {
      return COMICS.find(x => String(x.id) === String(id)) ||
             MOVIES.find(x => String(x.id) === String(id));
    }

    function drawerRow(label, value) {
      return `<div class="cm-drawer__row">
        <span class="cm-drawer__row-label">${esc(label)}</span>
        <span class="cm-drawer__row-value">${esc(value)}</span>
      </div>`;
    }

    function openDrawer(id) {
      const m = findItem(id);
      if (!m) return;
      const isMovie = m.type === 'Movie';

      const creatorsHTML = (m.creators || []).map(p =>
        `<div class="cm-drawer__creator">${creatorHTML(p, 'cm-drawer__creator-avatar')}<div class="cm-drawer__creator-name">${esc(p.name)}</div></div>`
      ).join('');

      const genresHTML = (m.genres || []).map(g =>
        `<span class="cm-drawer__tag"><i class="fas fa-tag"></i> ${esc(g)}</span>`
      ).join('');

      const rowsHTML = isMovie
        ? drawerRow('Director', m.director) + drawerRow('Released', m.release) + drawerRow('Runtime', m.runtime) +
          drawerRow('Rating', m.rating + ' / 10') + drawerRow('Based On', m.basedOn) +
          drawerRow('Studio', m.publisher) + drawerRow('Language', m.lang)
        : drawerRow('Writer', m.writer) + drawerRow('Artist', m.artist) + drawerRow('Publisher', m.publisher) +
          drawerRow('Published', m.release) + drawerRow('Issues', m.issues) +
          drawerRow('Rating', m.rating + ' / 10') + drawerRow('Language', m.lang);

      drawerBody.innerHTML = `
        <div class="cm-drawer__hero">
          <img src="${coverFor(m.id)}" alt="${esc(m.title)} backdrop" />
          <div class="cm-drawer__hero-content">
            <h2 class="cm-drawer__title" id="cmDrawerTitle">${esc(m.title)}</h2>
            <div class="cm-drawer__meta">
              <span><i class="fas fa-star" style="color:#fbbf24"></i> ${esc(m.rating)}</span>
              <span><i class="fas fa-calendar"></i> ${esc(yearOf(m))}</span>
              ${isMovie
                ? `<span><i class="fas fa-clock"></i> ${esc(m.runtime)}</span>`
                : `<span><i class="fas fa-book"></i> ${esc(m.issues)} Issues</span>`}
              <span><i class="fas fa-tag"></i> ${esc(m.sub)}</span>
              <span><i class="fas fa-closed-captioning"></i> ${esc(m.lang)}</span>
            </div>
            <div class="cm-drawer__actions">
              <button class="cm-drawer__btn cm-drawer__btn--primary" type="button">
                <i class="fas ${isMovie ? 'fa-play' : 'fa-book-open'}"></i> ${isMovie ? 'Watch Now' : 'Read Now'}
              </button>
              <button class="cm-drawer__btn cm-drawer__btn--ghost" type="button">
                <i class="fas fa-plus"></i> Add to List
              </button>
            </div>
          </div>
        </div>
        <div class="cm-drawer__content">
          <div>
            <h3 class="cm-drawer__section-title">Synopsis</h3>
            <p class="cm-drawer__desc">${esc(m.desc)}</p>
            <h3 class="cm-drawer__section-title">Genres</h3>
            <div class="cm-drawer__tags">${genresHTML}</div>
            <h3 class="cm-drawer__section-title">${isMovie ? 'Cast' : 'Creators'}</h3>
            <div class="cm-drawer__creators hide-scrollbar">${creatorsHTML}</div>
          </div>
          <aside>
            <div class="cm-drawer__info-card">${rowsHTML}</div>
          </aside>
        </div>`;

      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const panel = drawer.querySelector('.cm-drawer__panel');
      if (panel) panel.scrollTop = 0;
    }

    function closeDrawer() {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    /* ---------- BUILD ---------- */
    buildHero();
    renderTopRated();
    renderComicsGrid();
    renderMoviesGrid();
    renderPublishers();

    if (sideCount) sideCount.textContent = (COMICS.length + MOVIES.length) + '+';
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
      const card = t.closest('.cm-card[data-open], .cm-marquee__card[data-open]');
      if (card) { e.preventDefault(); openDrawer(card.dataset.open); }
    });

    if (comicsSort) {
      comicsSort.addEventListener('click', e => {
        const btn = e.target.closest('.cm-sort__btn');
        if (!btn) return;
        $$('.cm-sort__btn', comicsSort).forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        state.comicsSort = btn.dataset.sort || 'popular';
        renderComicsGrid();
      });
    }

    if (moviesSort) {
      moviesSort.addEventListener('click', e => {
        const btn = e.target.closest('.cm-sort__btn');
        if (!btn) return;
        $$('.cm-sort__btn', moviesSort).forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        state.moviesSort = btn.dataset.sort || 'popular';
        renderMoviesGrid();
      });
    }

    /* ---------- REVEAL ---------- */
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
      var category = 'comics';
      if (category === '__PATH__') {
        category = window.location.pathname.indexOf('tv-shows') !== -1 ? 'tv-shows' : 'movies';
      }
      var rows = await window.FHApi.catalog(category === 'all' ? null : category);
      if (Array.isArray(rows) && rows.length) COMICS = rows;
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