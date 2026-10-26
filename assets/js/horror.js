(() => {
  'use strict';

  const heroSection = document.getElementById('fhHorHero');
  const heroDots = document.getElementById('fhHorHeroDots');
  const topWatchedTrack = document.getElementById('fhHorTopWatchedTrack');
  const gridEl = document.getElementById('fhHorGrid');
  const sortWrap = document.getElementById('fhHorSort');
  const directorTrack = document.getElementById('fhHorDirectorTrack');
  const drawer = document.getElementById('movieDetailDrawer');
  const drawerBody = document.getElementById('fhDrawerBody');
  const sideCountEl = document.getElementById('fhSideCount');

  const state = { currentHero: 0, heroTimer: null, activeSort: 'popular' };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function initialsOf(name) {
    if (!name) return '?';
    return String(name).trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }
  function yearOf(m) { return (m.release || '').slice(0, 4) || '—'; }
  function badgeFor(m) { return m.views >= 55000 ? '4K' : m.views >= 38000 ? 'HD' : 'NEW'; }
  function posterFor(id) { return 'https://picsum.photos/seed/horror-poster-' + id + '/500/750?grayscale'; }
  function backdropFor(id) { return 'https://picsum.photos/seed/horror-back-' + id + '/1600/900?grayscale'; }
  function castAvatarFor(seed) { return 'https://picsum.photos/seed/horror-cast-' + seed + '/200/200'; }

  function avatarHTML(person, cls) {
    const seed = encodeURIComponent((person && person.name) || 'x');
    const img = castAvatarFor(seed);
    const init = esc(initialsOf(person && person.name));
    return '<div class="' + cls + ' ' + cls + '--photo">' +
             '<img src="' + img + '" alt="' + esc(person.name) + '" loading="lazy" ' +
                  'onerror="this.onerror=null;this.parentNode.classList.remove(\'' + cls + '--photo\');this.parentNode.innerHTML=\'' + init + '\';" />' +
           '</div>';
  }

  let MOVIES = [
    { id: 501, title: 'The Shining', sub: 'Psychological', genres: ['horror','thriller'], views: 64000, release: '1980-05-23', rating: '8.4', runtime: '2h 26m',
      desc: 'A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence, while his psychic son sees horrific forebodings.',
      director: 'Stanley Kubrick',
      cast: [{name:'Jack Nicholson'},{name:'Shelley Duvall'},{name:'Danny Lloyd'}], lang: 'EN' },
    { id: 502, title: 'The Exorcist', sub: 'Possession', genres: ['horror','drama'], views: 58000, release: '1973-12-26', rating: '8.1', runtime: '2h 2m',
      desc: 'When a young girl is possessed by a mysterious entity, her mother seeks the help of two Catholic priests to save her life.',
      director: 'William Friedkin',
      cast: [{name:'Ellen Burstyn'},{name:'Max von Sydow'},{name:'Linda Blair'}], lang: 'EN' },
    { id: 503, title: 'Hereditary', sub: 'Folk Horror', genres: ['horror','drama','mystery'], views: 57000, release: '2018-06-08', rating: '7.3', runtime: '2h 7m',
      desc: 'A grieving family is haunted by tragic and disturbing occurrences after the death of their secretive grandmother.',
      director: 'Ari Aster',
      cast: [{name:'Toni Collette'},{name:'Alex Wolff'},{name:'Milly Shapiro'}], lang: 'EN' },
    { id: 504, title: 'Get Out', sub: 'Psychological', genres: ['horror','thriller','mystery'], views: 61000, release: '2017-02-24', rating: '7.8', runtime: '1h 44m',
      desc: 'A young African-American visits his white girlfriend\u2019s parents for the weekend, where his simmering uneasiness about their reception eventually reaches a boiling point.',
      director: 'Jordan Peele',
      cast: [{name:'Daniel Kaluuya'},{name:'Allison Williams'},{name:'Bradley Whitford'}], lang: 'EN' },
    { id: 505, title: 'A Quiet Place', sub: 'Creature Feature', genres: ['horror','sci-fi','thriller'], views: 56000, release: '2018-04-06', rating: '7.5', runtime: '1h 30m',
      desc: 'In a post-apocalyptic world, a family is forced to live in silence while hiding from monsters with ultra-sensitive hearing.',
      director: 'John Krasinski',
      cast: [{name:'Emily Blunt'},{name:'John Krasinski'},{name:'Millicent Simmonds'}], lang: 'EN' },
    { id: 506, title: 'The Conjuring', sub: 'Supernatural', genres: ['horror','mystery','thriller'], views: 55000, release: '2013-07-19', rating: '7.5', runtime: '1h 52m',
      desc: 'Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse.',
      director: 'James Wan',
      cast: [{name:'Vera Farmiga'},{name:'Patrick Wilson'},{name:'Lili Taylor'}], lang: 'EN' },
    { id: 507, title: 'It Follows', sub: 'Supernatural', genres: ['horror','mystery','thriller'], views: 48000, release: '2015-03-27', rating: '6.8', runtime: '1h 40m',
      desc: 'A young woman is followed by an unknown supernatural force after a sexual encounter.',
      director: 'David Robert Mitchell',
      cast: [{name:'Maika Monroe'},{name:'Keir Gilchrist'},{name:'Olivia Luccardi'}], lang: 'EN' },
    { id: 508, title: 'The Witch', sub: 'Folk Horror', genres: ['horror','drama','mystery'], views: 47000, release: '2016-02-19', rating: '7.0', runtime: '1h 32m',
      desc: 'A family in 1630s New England is torn apart by the forces of witchcraft, black magic, and possession.',
      director: 'Robert Eggers',
      cast: [{name:'Anya Taylor-Joy'},{name:'Ralph Ineson'},{name:'Kate Dickie'}], lang: 'EN' },
    { id: 509, title: 'Sinister', sub: 'Supernatural', genres: ['horror','mystery','thriller'], views: 46000, release: '2012-10-12', rating: '6.8', runtime: '1h 50m',
      desc: 'A true-crime writer finds a cache of 8mm home movies that suggest the murder he is currently researching is the work of a serial killer whose career dates back to the 1960s.',
      director: 'Scott Derrickson',
      cast: [{name:'Ethan Hawke'},{name:'Juliet Rylance'},{name:'Fred Thompson'}], lang: 'EN' },
    { id: 510, title: 'Psycho', sub: 'Classic Horror', genres: ['horror','thriller','mystery'], views: 52000, release: '1960-06-22', rating: '8.5', runtime: '1h 49m',
      desc: 'A Phoenix secretary embezzles money from her employer and checks into a remote motel run by a young man under the domination of his mother.',
      director: 'Alfred Hitchcock',
      cast: [{name:'Anthony Perkins'},{name:'Janet Leigh'},{name:'Vera Miles'}], lang: 'EN' },
    { id: 511, title: 'Halloween', sub: 'Slasher', genres: ['horror','thriller'], views: 54000, release: '1978-10-25', rating: '7.7', runtime: '1h 31m',
      desc: 'Fifteen years after murdering his sister on Halloween night 1963, Michael Myers escapes from a mental hospital and returns to his hometown.',
      director: 'John Carpenter',
      cast: [{name:'Jamie Lee Curtis'},{name:'Donald Pleasence'},{name:'P.J. Soles'}], lang: 'EN' },
    { id: 512, title: 'The Texas Chain Saw Massacre', sub: 'Slasher', genres: ['horror','thriller'], views: 42000, release: '1974-10-01', rating: '7.4', runtime: '1h 23m',
      desc: 'Two siblings and three of their friends en route to visit their grandfather\u2019s grave in Texas end up falling victim to a family of cannibals.',
      director: 'Tobe Hooper',
      cast: [{name:'Marilyn Burns'},{name:'Edwin Neal'},{name:'Gunnar Hansen'}], lang: 'EN' },
    { id: 513, title: 'A Nightmare on Elm Street', sub: 'Slasher', genres: ['horror','thriller','fantasy'], views: 45000, release: '1984-11-16', rating: '7.4', runtime: '1h 31m',
      desc: 'The monstrous spirit of a slain child murderer seeks revenge by invading the dreams of teenagers whose parents were responsible for his untimely death.',
      director: 'Wes Craven',
      cast: [{name:'Heather Langenkamp'},{name:'Robert Englund'},{name:'Johnny Depp'}], lang: 'EN' },
    { id: 514, title: 'The Ring', sub: 'Supernatural', genres: ['horror','mystery','thriller'], views: 44000, release: '2002-10-18', rating: '7.1', runtime: '1h 55m',
      desc: 'A journalist must investigate a mysterious videotape which seems to cause the death of anyone one week after viewing it.',
      director: 'Gore Verbinski',
      cast: [{name:'Naomi Watts'},{name:'Martin Henderson'},{name:'Brian Cox'}], lang: 'EN' },
    { id: 515, title: 'The Descent', sub: 'Creature Feature', genres: ['horror','adventure','thriller'], views: 40000, release: '2005-07-08', rating: '7.2', runtime: '1h 39m',
      desc: 'A caving expedition goes horribly wrong, as the explorers become trapped and ultimately pursued by a strange breed of predators.',
      director: 'Neil Marshall',
      cast: [{name:'Shauna Macdonald'},{name:'Natalie Mendoza'},{name:'Alex Reid'}], lang: 'EN' },
    { id: 516, title: '28 Days Later', sub: 'Infection', genres: ['horror','sci-fi','thriller'], views: 43000, release: '2002-11-01', rating: '7.5', runtime: '1h 53m',
      desc: 'Four weeks after a mysterious, incurable virus spreads throughout the UK, a handful of survivors try to find sanctuary.',
      director: 'Danny Boyle',
      cast: [{name:'Cillian Murphy'},{name:'Naomie Harris'},{name:'Christopher Eccleston'}], lang: 'EN' },
    { id: 517, title: 'Alien', sub: 'Sci-Fi Horror', genres: ['horror','sci-fi','thriller'], views: 59000, release: '1979-05-25', rating: '8.5', runtime: '1h 57m',
      desc: 'The crew of a commercial spacecraft encounters a deadly lifeform after investigating an unknown transmission.',
      director: 'Ridley Scott',
      cast: [{name:'Sigourney Weaver'},{name:'Tom Skerritt'},{name:'John Hurt'}], lang: 'EN' },
    { id: 518, title: 'The Thing', sub: 'Creature Feature', genres: ['horror','sci-fi','mystery'], views: 49000, release: '1982-06-25', rating: '8.2', runtime: '1h 49m',
      desc: 'A research team in Antarctica is hunted by a shape-shifting alien that assumes the appearance of its victims.',
      director: 'John Carpenter',
      cast: [{name:'Kurt Russell'},{name:'Wilford Brimley'},{name:'Keith David'}], lang: 'EN' },
    { id: 519, title: 'Suspiria', sub: 'Supernatural', genres: ['horror','fantasy','mystery'], views: 38000, release: '1977-02-01', rating: '7.3', runtime: '1h 32m',
      desc: 'An American newcomer to a prestigious German ballet academy comes to realise that the school is a front for something sinister.',
      director: 'Dario Argento',
      cast: [{name:'Jessica Harper'},{name:'Stefania Casini'},{name:'Flavio Bucci'}], lang: 'IT' },
    { id: 520, title: 'Midsommar', sub: 'Folk Horror', genres: ['horror','drama','mystery'], views: 50000, release: '2019-07-03', rating: '7.1', runtime: '2h 28m',
      desc: 'A couple travels to Northern Europe to visit a rural hometown\u2019s fabled Swedish mid-summer festival, which devolves into an increasingly violent pagan ritual.',
      director: 'Ari Aster',
      cast: [{name:'Florence Pugh'},{name:'Jack Reynor'},{name:'Vilhelm Blomgren'}], lang: 'EN' },
    { id: 521, title: 'Insidious', sub: 'Supernatural', genres: ['horror','mystery','thriller'], views: 41000, release: '2011-04-01', rating: '6.8', runtime: '1h 43m',
      desc: 'A family looks to prevent evil spirits from trapping their comatose child in a realm called The Further.',
      director: 'James Wan',
      cast: [{name:'Patrick Wilson'},{name:'Rose Byrne'},{name:'Ty Simpkins'}], lang: 'EN' },
    { id: 522, title: 'The Babadook', sub: 'Psychological', genres: ['horror','drama','mystery'], views: 39000, release: '2014-05-22', rating: '6.8', runtime: '1h 34m',
      desc: 'A single mother, plagued by the violent death of her husband, battles with her son\u2019s fear of a monster lurking in the house.',
      director: 'Jennifer Kent',
      cast: [{name:'Essie Davis'},{name:'Noah Wiseman'},{name:'Daniel Henshall'}], lang: 'EN' },
    { id: 523, title: 'Train to Busan', sub: 'Infection', genres: ['horror','action','thriller'], views: 51000, release: '2016-07-20', rating: '7.6', runtime: '1h 58m',
      desc: 'While a zombie virus breaks out in South Korea, passengers struggle to survive on the train from Seoul to Busan.',
      director: 'Yeon Sang-ho',
      cast: [{name:'Gong Yoo'},{name:'Jung Yu-mi'},{name:'Ma Dong-seok'}], lang: 'KO' },
    { id: 524, title: 'The Autopsy of Jane Doe', sub: 'Supernatural', genres: ['horror','mystery','thriller'], views: 37000, release: '2016-12-21', rating: '6.8', runtime: '1h 26m',
      desc: 'A father and son, both coroners, are pulled into a complex mystery while attempting to identify the body of a young woman.',
      director: 'André Øvredal',
      cast: [{name:'Emile Hirsch'},{name:'Brian Cox'},{name:'Olwen Catherine Kelly'}], lang: 'EN' }
  ];

  const HERO_MOVIES = MOVIES.slice(0, 6);

  const DIRECTORS = [
    { name: 'Stanley Kubrick',   films: 'The Shining · Eyes Wide Shut', tag: 'Psychological' },
    { name: 'William Friedkin',  films: 'The Exorcist · Sorcerer', tag: 'Possession' },
    { name: 'Ari Aster',         films: 'Hereditary · Midsommar', tag: 'Folk Horror' },
    { name: 'Jordan Peele',      films: 'Get Out · Us · Nope', tag: 'Psychological' },
    { name: 'John Carpenter',    films: 'Halloween · The Thing', tag: 'Slasher' },
    { name: 'Alfred Hitchcock',  films: 'Psycho · The Birds', tag: 'Classic Horror' },
    { name: 'Wes Craven',        films: 'A Nightmare on Elm Street · Scream', tag: 'Slasher' },
    { name: 'James Wan',         films: 'The Conjuring · Insidious', tag: 'Supernatural' },
    { name: 'Robert Eggers',     films: 'The Witch · The Lighthouse', tag: 'Folk Horror' },
    { name: 'Ridley Scott',      films: 'Alien · Prometheus', tag: 'Sci-Fi Horror' },
    { name: 'Tobe Hooper',       films: 'The Texas Chain Saw Massacre · Poltergeist', tag: 'Slasher' },
    { name: 'Dario Argento',     films: 'Suspiria · Deep Red', tag: 'Giallo' }
  ];

  function initHero() {
    if (!heroSection || !heroDots) return;
    HERO_MOVIES.forEach((m, i) => {
      const castHTML = (m.cast || []).map(c => `
        <div class="fh-hero__cast-member">
          ${avatarHTML(c, 'fh-hero__cast-avatar')}
          <span class="fh-hero__cast-name">${esc(c.name)}</span>
        </div>`).join('');

      const slide = document.createElement('div');
      slide.className = 'fh-hero__slide' + (i === 0 ? ' is-active' : '');
      slide.innerHTML = `
        <div class="fh-hero__slide-bg">
          <img src="${backdropFor(m.id)}" alt="${esc(m.title)}">
        </div>
        <div class="fh-hero__content">
          <div class="fh-hero__card">
            <span class="fh-hero__tag">Horror · Featured</span>
            <h1 class="fh-hero__title">${esc(m.title)}</h1>
            <div class="fh-hero__meta">
              <span class="fh-hero__pill fh-hero__pill--blood">${esc(m.sub)}</span>
              <span class="fh-hero__pill fh-hero__pill--rating"><i class="fas fa-star"></i> ${esc(m.rating)}</span>
              <span class="fh-hero__pill"><i class="fas fa-calendar"></i> ${esc(yearOf(m))}</span>
              <span class="fh-hero__pill"><i class="fas fa-clock"></i> ${esc(m.runtime)}</span>
              <span class="fh-hero__pill fh-hero__pill--hd">${badgeFor(m)}</span>
            </div>
            <p class="fh-hero__desc">${esc(m.desc)}</p>
            <div class="fh-hero__cast hide-scrollbar">${castHTML}</div>
            <div class="fh-hero__actions">
              <button class="fh-hero__btn fh-hero__btn--primary" data-open="${m.id}">
                <i class="fas fa-play"></i> Watch Now
              </button>
              <button class="fh-hero__btn fh-hero__btn--ghost" data-open="${m.id}">
                <i class="fas fa-circle-info"></i> More Info
              </button>
            </div>
          </div>
        </div>`;
      heroSection.appendChild(slide);

      const dot = document.createElement('div');
      dot.className = 'fh-hero__dot' + (i === 0 ? ' is-active' : '');
      dot.addEventListener('click', () => showHeroSlide(i));
      heroDots.appendChild(dot);
    });

    heroSection.addEventListener('click', e => {
      const btn = e.target.closest('[data-open]');
      if (btn) openMovieDetails(Number(btn.dataset.open));
    });

    state.heroTimer = setInterval(() => showHeroSlide((state.currentHero + 1) % HERO_MOVIES.length), 6500);
  }

  function showHeroSlide(index) {
    const slides = heroSection.querySelectorAll('.fh-hero__slide');
    const dots = heroDots.querySelectorAll('.fh-hero__dot');
    slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
    dots.forEach((d, i) => {
      d.classList.remove('is-active');
      if (i === index) { void d.offsetWidth; d.classList.add('is-active'); }
    });
    state.currentHero = index;
  }

  function initTopWatched() {
    if (!topWatchedTrack) return;
    const items = [...MOVIES].sort((a, b) => b.views - a.views).slice(0, 14);
    const html = items.map(m => `
      <div class="fh-marquee__card" data-open="${m.id}">
        <img src="${posterFor(m.id)}" alt="${esc(m.title)}" loading="lazy">
        <span class="fh-marquee__rate"><i class="fas fa-star"></i> ${esc(m.rating)}</span>
        <div class="fh-marquee__body">
          <h3 class="fh-marquee__title">${esc(m.title)}</h3>
          <div class="fh-marquee__meta">
            <span>${esc(yearOf(m))}</span>
            <span>·</span>
            <span>${esc(m.sub)}</span>
          </div>
        </div>
      </div>`).join('');
    topWatchedTrack.className = 'fh-marquee__track';
    topWatchedTrack.innerHTML = html + html;
    attachHandlers(topWatchedTrack);
  }

  function initGrid() {
    renderGrid(state.activeSort);
    if (sortWrap) {
      sortWrap.addEventListener('click', e => {
        const btn = e.target.closest('.fh-hor-sort__btn');
        if (!btn) return;
        sortWrap.querySelectorAll('.fh-hor-sort__btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        state.activeSort = btn.dataset.sort;
        renderGrid(state.activeSort);
      });
    }
  }

  function renderGrid(sortKey) {
    let list = [...MOVIES];
    if (sortKey === 'popular') list.sort((a, b) => b.views - a.views);
    else if (sortKey === 'latest') list.sort((a, b) => new Date(b.release) - new Date(a.release));
    else if (sortKey === 'rating') list.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    else if (sortKey === 'az') list.sort((a, b) => a.title.localeCompare(b.title));

    gridEl.innerHTML = list.map(renderCard).join('');
    attachHandlers(gridEl);

    const cards = gridEl.querySelectorAll('.fh-hor-card');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.delay || '0', 10);
          setTimeout(() => el.classList.add('is-visible'), delay);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    cards.forEach((c, i) => { c.dataset.delay = String((i % 5) * 60); obs.observe(c); });
  }

  function renderCard(m) {
    return `
      <article class="fh-hor-card" data-open="${m.id}" tabindex="0" role="button" aria-label="${esc(m.title)}">
        <span class="fh-hor-card__subgenre">${esc(m.sub)}</span>
        <span class="fh-hor-card__badge">${badgeFor(m)}</span>
        <div class="fh-hor-card__media">
          <img src="${posterFor(m.id)}" alt="${esc(m.title)}" loading="lazy">
          <span class="fh-hor-card__rate"><i class="fas fa-star"></i> ${esc(m.rating)}</span>
        </div>
        <div class="fh-hor-card__body">
          <h3 class="fh-hor-card__title">${esc(m.title)}</h3>
          <div class="fh-hor-card__meta">
            <span>${esc(yearOf(m))}</span>
            <span>${esc(m.runtime)}</span>
          </div>
        </div>
      </article>`;
  }

  function attachHandlers(container) {
    container.querySelectorAll('[data-open]').forEach(el => {
      el.addEventListener('click', () => openMovieDetails(Number(el.dataset.open)));
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openMovieDetails(Number(el.dataset.open));
        }
      });
    });
  }

  function initDirectors() {
    if (!directorTrack) return;
    const html = DIRECTORS.map(d => `
      <div class="fh-hor-director-card">
        <div class="fh-hor-director-card__avatar">${esc(initialsOf(d.name))}</div>
        <div class="fh-hor-director-card__body">
          <div class="fh-hor-director-card__name">${esc(d.name)}</div>
          <div class="fh-hor-director-card__films">${esc(d.films)}</div>
          <span class="fh-hor-director-card__tag"><i class="fas fa-ghost"></i> ${esc(d.tag)}</span>
        </div>
      </div>`).join('');
    directorTrack.className = 'fh-marquee__track';
    directorTrack.innerHTML = html + html;
    directorTrack.style.animationDuration = '80s';
  }

  function openMovieDetails(movieId) {
    const m = MOVIES.find(x => x.id === movieId);
    if (!m || !drawer || !drawerBody) return;

    const related = MOVIES
      .filter(x => x.id !== m.id && x.genres.some(g => m.genres.includes(g)))
      .slice(0, 6);

    drawerBody.innerHTML = `
      <div class="fh-drawer__hero">
        <img src="${backdropFor(m.id)}" alt="${esc(m.title)}">
        <div class="fh-drawer__hero-content">
          <h1 class="fh-drawer__title" id="fhDrawerTitle">${esc(m.title)}</h1>
          <div class="fh-drawer__meta">
            <span><i class="fas fa-star" style="color:#fbbf24"></i> ${esc(m.rating)}</span>
            <span><i class="fas fa-calendar"></i> ${esc(yearOf(m))}</span>
            <span><i class="fas fa-clock"></i> ${esc(m.runtime)}</span>
            <span><i class="fas fa-globe"></i> ${esc(m.lang)}</span>
            <span><i class="fas fa-ghost"></i> ${esc(m.sub)}</span>
          </div>
          <div class="fh-drawer__actions">
            <button class="fh-drawer__btn fh-drawer__btn--primary"><i class="fas fa-play"></i> Watch Now</button>
            <button class="fh-drawer__btn fh-drawer__btn--ghost"><i class="fas fa-film"></i> Trailer</button>
            <button class="fh-drawer__btn fh-drawer__btn--ghost" aria-label="Add to list"><i class="fas fa-plus"></i></button>
          </div>
        </div>
      </div>
      <div class="fh-drawer__content">
        <div>
          <h3 class="fh-drawer__section-title">Overview</h3>
          <p class="fh-drawer__desc">${esc(m.desc)}</p>
          <h3 class="fh-drawer__section-title">Top Cast</h3>
          <div class="fh-drawer__cast hide-scrollbar">
            ${(m.cast || []).map(c => `
              <div class="fh-drawer__cast-member">
                ${avatarHTML(c, 'fh-drawer__cast-avatar')}
                <div class="fh-drawer__cast-name">${esc(c.name)}</div>
              </div>`).join('')}
          </div>
        </div>
        <div class="fh-drawer__info-card">
          <h3 class="fh-drawer__section-title">Details</h3>
          <div class="fh-drawer__info-row"><span class="fh-drawer__info-label">Director</span><span class="fh-drawer__info-value">${esc(m.director)}</span></div>
          <div class="fh-drawer__info-row"><span class="fh-drawer__info-label">Release</span><span class="fh-drawer__info-value">${esc(m.release)}</span></div>
          <div class="fh-drawer__info-row"><span class="fh-drawer__info-label">Genres</span><span class="fh-drawer__info-value">${esc(m.genres.join(', '))}</span></div>
          <div class="fh-drawer__info-row"><span class="fh-drawer__info-label">Language</span><span class="fh-drawer__info-value">${esc(m.lang)}</span></div>
          <div class="fh-drawer__info-row"><span class="fh-drawer__info-label">Views</span><span class="fh-drawer__info-value">${m.views.toLocaleString()}</span></div>
        </div>
      </div>
      <div class="fh-drawer__content" style="grid-template-columns:1fr;padding-top:0">
        <div>
          <h3 class="fh-drawer__section-title">More Like This</h3>
          <div class="fh-marquee__track" id="fhHorDrawerRelated" style="animation:none;gap:16px;overflow-x:auto"></div>
        </div>
      </div>`;

    const rel = drawerBody.querySelector('#fhHorDrawerRelated');
    rel.innerHTML = related.map(r => `
      <div class="fh-marquee__card" data-open="${r.id}" style="flex:0 0 auto">
        <img src="${posterFor(r.id)}" alt="${esc(r.title)}" loading="lazy">
        <span class="fh-marquee__rate"><i class="fas fa-star"></i> ${esc(r.rating)}</span>
        <div class="fh-marquee__body">
          <h3 class="fh-marquee__title">${esc(r.title)}</h3>
          <div class="fh-marquee__meta"><span>${esc(yearOf(r))}</span></div>
        </div>
      </div>`).join('');
    attachHandlers(rel);

    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function initDrawer() {
    if (!drawer) return;
    drawer.querySelectorAll('[data-drawer-close]').forEach(el => el.addEventListener('click', closeDrawer));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
    });
  }

  function initSearch() {
    const searchWrap = document.getElementById('fhSearchWrap');
    const searchInput = document.getElementById('fhSearchInput');
    const searchResults = document.getElementById('fhSearchResults');
    if (!searchWrap || !searchInput) return;

    const openResults = () => searchWrap.classList.add('is-open');
    const closeResults = () => searchWrap.classList.remove('is-open');

    function render(list, q) {
      if (!list.length) {
        searchResults.innerHTML = `<div class="fh-search-results__empty">No results for "${esc(q)}"</div>`;
        return;
      }
      searchResults.innerHTML = list.map(m => `
        <div class="fh-search-results__item" data-open="${m.id}">
          <img src="${posterFor(m.id)}" alt="${esc(m.title)}">
          <div class="fh-search-results__info">
            <div class="fh-search-results__title">${esc(m.title)}</div>
            <div class="fh-search-results__meta">${esc(yearOf(m))} · ${esc(m.sub)}</div>
            <div class="fh-search-results__meta">★ ${esc(m.rating)}</div>
          </div>
        </div>`).join('');
      attachHandlers(searchResults);
      searchResults.querySelectorAll('[data-open]').forEach(el => {
        el.addEventListener('click', () => { closeResults(); searchInput.blur(); });
      });
    }

    function query(q) {
      const s = q.toLowerCase();
      return MOVIES.filter(m =>
        m.title.toLowerCase().includes(s) ||
        m.director.toLowerCase().includes(s) ||
        m.sub.toLowerCase().includes(s) ||
        m.genres.some(g => g.includes(s)) ||
        (m.cast || []).some(c => c.name.toLowerCase().includes(s))
      ).slice(0, 12);
    }

    searchInput.addEventListener('focus', () => {
      openResults();
      const q = searchInput.value.trim();
      if (!q) render(MOVIES.slice(0, 6), 'popular');
      else render(query(q), q);
    });
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim();
      if (!q) { render(MOVIES.slice(0, 6), 'popular'); return; }
      render(query(q), q);
    });

    document.addEventListener('click', e => { if (!searchWrap.contains(e.target)) closeResults(); });
    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault(); searchInput.focus(); searchInput.select();
      }
      if (e.key === 'Escape' && document.activeElement === searchInput) {
        searchInput.blur(); closeResults();
      }
    });
  }

  function initSideCount() {
    if (sideCountEl) sideCountEl.textContent = MOVIES.length + '+';
  }

  function init() {
    initHero();
    initTopWatched();
    initGrid();
    initDirectors();
    initDrawer();
    initSearch();
    initSideCount();
  }

  async function loadBackendCatalog() {
    try {
      if (!window.FHApi || !window.FHApi.catalog) return;
      var category = 'movies';
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

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();