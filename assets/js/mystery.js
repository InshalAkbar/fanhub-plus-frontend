(() => {
  'use strict';

  const heroSection = document.getElementById('fhMysHero');
  const heroDots = document.getElementById('fhMysHeroDots');
  const topWatchedTrack = document.getElementById('fhMysTopWatchedTrack');
  const gridEl = document.getElementById('fhMysGrid');
  const sortWrap = document.getElementById('fhMysSort');
  const directorTrack = document.getElementById('fhMysDirectorTrack');
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
  function posterFor(id) { return 'https://picsum.photos/seed/mystery-poster-' + id + '/500/750'; }
  function backdropFor(id) { return 'https://picsum.photos/seed/mystery-back-' + id + '/1600/900'; }
  function castAvatarFor(seed) { return 'https://picsum.photos/seed/mystery-cast-' + seed + '/200/200'; }

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
    { id: 601, title: 'Se7en', sub: 'Serial Killer', genres: ['mystery','crime','thriller'], views: 62000, release: '1995-09-22', rating: '8.6', runtime: '2h 7m',
      desc: 'Two detectives — a rookie and a veteran — hunt a serial killer who uses the seven deadly sins as his motives.',
      director: 'David Fincher',
      cast: [{name:'Brad Pitt'},{name:'Morgan Freeman'},{name:'Kevin Spacey'}], lang: 'EN' },
    { id: 602, title: 'Zodiac', sub: 'Serial Killer', genres: ['mystery','crime','thriller'], views: 54000, release: '2007-03-02', rating: '7.7', runtime: '2h 37m',
      desc: 'Between 1968 and 1983, a San Francisco cartoonist becomes an amateur detective obsessed with tracking down the Zodiac Killer.',
      director: 'David Fincher',
      cast: [{name:'Jake Gyllenhaal'},{name:'Mark Ruffalo'},{name:'Robert Downey Jr.'}], lang: 'EN' },
    { id: 603, title: 'Gone Girl', sub: 'Psychological', genres: ['mystery','thriller','drama'], views: 58000, release: '2014-10-03', rating: '8.1', runtime: '2h 29m',
      desc: 'With his wife\u2019s disappearance having become the focus of an intense media circus, a man sees the spotlight turned on him when it\u2019s suspected that he may not be innocent.',
      director: 'David Fincher',
      cast: [{name:'Ben Affleck'},{name:'Rosamund Pike'},{name:'Neil Patrick Harris'}], lang: 'EN' },
    { id: 604, title: 'Shutter Island', sub: 'Psychological', genres: ['mystery','thriller','drama'], views: 60000, release: '2010-02-19', rating: '8.2', runtime: '2h 18m',
      desc: 'In 1954, a U.S. Marshal investigates the disappearance of a murderer who escaped from a hospital for the criminally insane.',
      director: 'Martin Scorsese',
      cast: [{name:'Leonardo DiCaprio'},{name:'Mark Ruffalo'},{name:'Ben Kingsley'}], lang: 'EN' },
    { id: 605, title: 'Memento', sub: 'Puzzle', genres: ['mystery','thriller'], views: 57000, release: '2000-10-11', rating: '8.4', runtime: '1h 53m',
      desc: 'A man with short-term memory loss attempts to track down his wife\u2019s murderer using notes, photographs, and tattoos.',
      director: 'Christopher Nolan',
      cast: [{name:'Guy Pearce'},{name:'Carrie-Anne Moss'},{name:'Joe Pantoliano'}], lang: 'EN' },
    { id: 606, title: 'Prisoners', sub: 'Missing Person', genres: ['mystery','thriller','crime'], views: 55000, release: '2013-09-20', rating: '8.1', runtime: '2h 33m',
      desc: 'When his daughter and her friend go missing, a desperate father takes matters into his own hands as the police pursue multiple leads.',
      director: 'Denis Villeneuve',
      cast: [{name:'Hugh Jackman'},{name:'Jake Gyllenhaal'},{name:'Viola Davis'}], lang: 'EN' },
    { id: 607, title: 'The Girl with the Dragon Tattoo', sub: 'Nordic Noir', genres: ['mystery','thriller','crime'], views: 52000, release: '2011-12-20', rating: '7.8', runtime: '2h 38m',
      desc: 'Journalist Mikael Blomkvist and hacker Lisbeth Salander investigate the disappearance of a woman from a wealthy family forty years ago.',
      director: 'David Fincher',
      cast: [{name:'Daniel Craig'},{name:'Rooney Mara'},{name:'Christopher Plummer'}], lang: 'EN' },
    { id: 608, title: 'Oldboy', sub: 'Revenge', genres: ['mystery','thriller','action'], views: 53000, release: '2003-11-21', rating: '8.3', runtime: '2h 0m',
      desc: 'After being kidnapped and imprisoned for fifteen years, Oh Dae-su is released, only to find that he must find his captor in five days.',
      director: 'Park Chan-wook',
      cast: [{name:'Choi Min-sik'},{name:'Yoo Ji-tae'},{name:'Kang Hye-jung'}], lang: 'KO' },
    { id: 609, title: 'The Prestige', sub: 'Puzzle', genres: ['mystery','drama','thriller'], views: 56000, release: '2006-10-20', rating: '8.5', runtime: '2h 10m',
      desc: 'After a tragic accident, two stage magicians in 1890s London engage in a battle to create the ultimate illusion while sacrificing everything they have to outwit each other.',
      director: 'Christopher Nolan',
      cast: [{name:'Hugh Jackman'},{name:'Christian Bale'},{name:'Scarlett Johansson'}], lang: 'EN' },
    { id: 610, title: 'The Silence of the Lambs', sub: 'Serial Killer', genres: ['mystery','thriller','crime'], views: 59000, release: '1991-02-14', rating: '8.6', runtime: '1h 58m',
      desc: 'A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer, a madman who skins his victims.',
      director: 'Jonathan Demme',
      cast: [{name:'Jodie Foster'},{name:'Anthony Hopkins'},{name:'Scott Glenn'}], lang: 'EN' },
    { id: 611, title: 'The Usual Suspects', sub: 'Heist', genres: ['mystery','crime','thriller'], views: 51000, release: '1995-08-16', rating: '8.5', runtime: '1h 46m',
      desc: 'A sole survivor tells of the twisty events leading up to a horrific gun battle on a boat, which began when five criminals met at a seemingly random police lineup.',
      director: 'Bryan Singer',
      cast: [{name:'Kevin Spacey'},{name:'Gabriel Byrne'},{name:'Benicio del Toro'}], lang: 'EN' },
    { id: 612, title: 'Rear Window', sub: 'Classic Mystery', genres: ['mystery','thriller'], views: 45000, release: '1954-09-01', rating: '8.5', runtime: '1h 52m',
      desc: 'A wheelchair-bound photographer spies on his neighbors from his apartment window and becomes convinced one of them has committed murder.',
      director: 'Alfred Hitchcock',
      cast: [{name:'James Stewart'},{name:'Grace Kelly'},{name:'Thelma Ritter'}], lang: 'EN' },
    { id: 613, title: 'Vertigo', sub: 'Classic Mystery', genres: ['mystery','thriller','romance'], views: 46000, release: '1958-05-09', rating: '8.3', runtime: '2h 8m',
      desc: 'A former San Francisco police detective is hired to follow a mysterious woman — and falls into a spiral of obsession, deception, and unbearable vertigo.',
      director: 'Alfred Hitchcock',
      cast: [{name:'James Stewart'},{name:'Kim Novak'},{name:'Barbara Bel Geddes'}], lang: 'EN' },
    { id: 614, title: 'Chinatown', sub: 'Neo-Noir', genres: ['mystery','thriller','crime'], views: 48000, release: '1974-06-20', rating: '8.2', runtime: '2h 10m',
      desc: 'A private detective hired to expose an adulterer finds himself caught up in a web of deceit, corruption, and murder in 1937 Los Angeles.',
      director: 'Roman Polanski',
      cast: [{name:'Jack Nicholson'},{name:'Faye Dunaway'},{name:'John Huston'}], lang: 'EN' },
    { id: 615, title: 'The Sixth Sense', sub: 'Supernatural', genres: ['mystery','thriller','drama'], views: 50000, release: '1999-08-06', rating: '8.2', runtime: '1h 47m',
      desc: 'A child psychologist starts treating a young boy who claims he sees dead people — and discovers a truth about himself he was never ready to face.',
      director: 'M. Night Shyamalan',
      cast: [{name:'Bruce Willis'},{name:'Haley Joel Osment'},{name:'Toni Collette'}], lang: 'EN' },
    { id: 616, title: 'Knives Out', sub: 'Whodunit', genres: ['mystery','comedy','crime'], views: 54000, release: '2019-11-27', rating: '7.9', runtime: '2h 10m',
      desc: 'A detective investigates the death of the patriarch of an eccentric, combative family — and finds that every single one of them had a reason to want him dead.',
      director: 'Rian Johnson',
      cast: [{name:'Daniel Craig'},{name:'Chris Evans'},{name:'Ana de Armas'}], lang: 'EN' },
    { id: 617, title: 'Gone Baby Gone', sub: 'Missing Person', genres: ['mystery','crime','drama'], views: 42000, release: '2007-10-19', rating: '7.6', runtime: '1h 54m',
      desc: 'Two Boston private investigators take on the case of a missing four-year-old girl, uncovering a web of corruption and moral ambiguity.',
      director: 'Ben Affleck',
      cast: [{name:'Casey Affleck'},{name:'Michelle Monaghan'},{name:'Morgan Freeman'}], lang: 'EN' },
    { id: 618, title: 'Memories of Murder', sub: 'Serial Killer', genres: ['mystery','crime','drama'], views: 47000, release: '2003-05-02', rating: '8.1', runtime: '2h 12m',
      desc: 'In 1986, a small Korean province is terrorized by a series of rapes and murders. Three detectives with different methods race to catch the killer.',
      director: 'Bong Joon-ho',
      cast: [{name:'Song Kang-ho'},{name:'Kim Sang-kyung'},{name:'Park Hae-il'}], lang: 'KO' },
    { id: 619, title: 'The Maltese Falcon', sub: 'Classic Mystery', genres: ['mystery','crime','film-noir'], views: 40000, release: '1941-10-18', rating: '8.0', runtime: '1h 40m',
      desc: 'A private detective takes on a case that involves him with three eccentric criminals, a gorgeous liar, and their quest for a priceless statuette.',
      director: 'John Huston',
      cast: [{name:'Humphrey Bogart'},{name:'Mary Astor'},{name:'Peter Lorre'}], lang: 'EN' },
    { id: 620, title: 'The Big Sleep', sub: 'Classic Mystery', genres: ['mystery','crime','film-noir'], views: 39000, release: '1946-08-31', rating: '7.9', runtime: '1h 54m',
      desc: 'Private detective Philip Marlowe is hired by a wealthy family — but the case quickly spirals into a maze of blackmail, murder, and hidden motives.',
      director: 'Howard Hawks',
      cast: [{name:'Humphrey Bogart'},{name:'Lauren Bacall'},{name:'John Ridgely'}], lang: 'EN' },
    { id: 621, title: 'The Girl on the Train', sub: 'Psychological', genres: ['mystery','thriller','drama'], views: 38000, release: '2016-10-07', rating: '6.5', runtime: '1h 52m',
      desc: 'A divorcee becomes entangled in a missing-persons investigation that promises to send shockwaves throughout her life.',
      director: 'Tate Taylor',
      cast: [{name:'Emily Blunt'},{name:'Haley Bennett'},{name:'Rebecca Ferguson'}], lang: 'EN' },
    { id: 622, title: 'Mystic River', sub: 'Psychological', genres: ['mystery','crime','drama'], views: 43000, release: '2003-10-15', rating: '7.9', runtime: '2h 18m',
      desc: 'Three childhood friends are reunited by a tragedy that dredges up old wounds and buried secrets from their shared past.',
      director: 'Clint Eastwood',
      cast: [{name:'Sean Penn'},{name:'Tim Robbins'},{name:'Kevin Bacon'}], lang: 'EN' },
    { id: 623, title: 'The Others', sub: 'Supernatural', genres: ['mystery','horror','thriller'], views: 41000, release: '2001-08-10', rating: '7.6', runtime: '1h 44m',
      desc: 'In 1945, a devoutly religious woman waits for her husband to come home from the war, living in a darkened mansion with her two light-sensitive children — and something else.',
      director: 'Alejandro Amenábar',
      cast: [{name:'Nicole Kidman'},{name:'Fionnula Flanagan'},{name:'Christopher Eccleston'}], lang: 'EN' },
    { id: 624, title: 'L.A. Confidential', sub: 'Neo-Noir', genres: ['mystery','crime','thriller'], views: 44000, release: '1997-09-19', rating: '8.2', runtime: '2h 18m',
      desc: 'As corruption grows in 1950s Los Angeles, three policemen — with drastically different methods — investigate a series of murders.',
      director: 'Curtis Hanson',
      cast: [{name:'Russell Crowe'},{name:'Guy Pearce'},{name:'Kevin Spacey'}], lang: 'EN' }
  ];

  const HERO_MOVIES = MOVIES.slice(0, 6);

  const DIRECTORS = [
    { name: 'David Fincher',     films: 'Se7en · Zodiac · Gone Girl', tag: 'Serial Killer' },
    { name: 'Christopher Nolan', films: 'Memento · The Prestige', tag: 'Puzzle' },
    { name: 'Alfred Hitchcock',  films: 'Rear Window · Vertigo', tag: 'Classic Mystery' },
    { name: 'Denis Villeneuve',  films: 'Prisoners · Enemy', tag: 'Missing Person' },
    { name: 'Bong Joon-ho',      films: 'Memories of Murder · Parasite', tag: 'Serial Killer' },
    { name: 'Park Chan-wook',    films: 'Oldboy · The Handmaiden', tag: 'Revenge' },
    { name: 'Martin Scorsese',   films: 'Shutter Island · The Departed', tag: 'Psychological' },
    { name: 'Rian Johnson',      films: 'Knives Out · Glass Onion', tag: 'Whodunit' },
    { name: 'Roman Polanski',    films: 'Chinatown · Rosemary\u2019s Baby', tag: 'Neo-Noir' },
    { name: 'Jonathan Demme',    films: 'Silence of the Lambs · Philadelphia', tag: 'Serial Killer' },
    { name: 'M. Night Shyamalan',films: 'The Sixth Sense · Split', tag: 'Supernatural' },
    { name: 'Ben Affleck',       films: 'Gone Baby Gone · The Town', tag: 'Missing Person' }
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
            <span class="fh-hero__tag">Mystery · Featured</span>
            <h1 class="fh-hero__title">${esc(m.title)}</h1>
            <div class="fh-hero__meta">
              <span class="fh-hero__pill fh-hero__pill--clue">${esc(m.sub)}</span>
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
        const btn = e.target.closest('.fh-mys-sort__btn');
        if (!btn) return;
        sortWrap.querySelectorAll('.fh-mys-sort__btn').forEach(b => b.classList.remove('is-active'));
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

    const cards = gridEl.querySelectorAll('.fh-mys-card');
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
      <article class="fh-mys-card" data-open="${m.id}" tabindex="0" role="button" aria-label="${esc(m.title)}">
        <span class="fh-mys-card__subgenre">${esc(m.sub)}</span>
        <span class="fh-mys-card__badge">${badgeFor(m)}</span>
        <div class="fh-mys-card__media">
          <img src="${posterFor(m.id)}" alt="${esc(m.title)}" loading="lazy">
          <span class="fh-mys-card__rate"><i class="fas fa-star"></i> ${esc(m.rating)}</span>
        </div>
        <div class="fh-mys-card__body">
          <h3 class="fh-mys-card__title">${esc(m.title)}</h3>
          <div class="fh-mys-card__meta">
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
      <div class="fh-mys-director-card">
        <div class="fh-mys-director-card__avatar">${esc(initialsOf(d.name))}</div>
        <div class="fh-mys-director-card__body">
          <div class="fh-mys-director-card__name">${esc(d.name)}</div>
          <div class="fh-mys-director-card__films">${esc(d.films)}</div>
          <span class="fh-mys-director-card__tag"><i class="fas fa-magnifying-glass"></i> ${esc(d.tag)}</span>
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
            <span><i class="fas fa-magnifying-glass"></i> ${esc(m.sub)}</span>
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
          <div class="fh-marquee__track" id="fhMysDrawerRelated" style="animation:none;gap:16px;overflow-x:auto"></div>
        </div>
      </div>`;

    const rel = drawerBody.querySelector('#fhMysDrawerRelated');
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