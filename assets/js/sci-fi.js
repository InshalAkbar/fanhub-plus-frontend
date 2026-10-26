(() => {
  'use strict';

  const root = document.documentElement;

  (() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cores = navigator.hardwareConcurrency || 4;
    const mem = navigator.deviceMemory || 4;
    const small = window.innerWidth < 760;
    if (reduce || cores <= 2 || mem <= 2 || small) root.classList.add('fh-low-power');
  })();

  const heroSection = document.getElementById('fhScifiHero');
  const heroDots = document.getElementById('fhScifiHeroDots');
  const topWatchedTrack = document.getElementById('fhScifiTopWatchedTrack');
  const gridEl = document.getElementById('fhScifiGrid');
  const sortWrap = document.getElementById('fhScifiSort');
  const directorTrack = document.getElementById('fhScifiDirectorTrack');
  const drawer = document.getElementById('movieDetailDrawer');
  const drawerBody = document.getElementById('fhDrawerBody');
  const sideCountEl = document.getElementById('fhSideCount');

  const state = {
    currentHero: 0,
    heroTimer: null,
    activeSort: 'popular'
  };

  let SCIFI_MOVIES = [
    { id: 501, title: "Blade Runner 2049", subgenre: "Cyberpunk", genres: ["sci-fi","drama","mystery"], views: 48000, release: "2017-10-06", rating: "8.0", runtime: "2h 44m", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000", desc: "A blade runner discovers a long-buried secret that has the potential to plunge what's left of society into chaos.", director: "Denis Villeneuve", cast: ["Ryan Gosling","Harrison Ford","Ana de Armas"], language: "EN" },
    { id: 502, title: "Interstellar", subgenre: "Space Epic", genres: ["sci-fi","drama","adventure"], views: 52000, release: "2014-11-07", rating: "8.7", runtime: "2h 49m", img: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000", desc: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.", director: "Christopher Nolan", cast: ["Matthew McConaughey","Anne Hathaway","Jessica Chastain"], language: "EN" },
    { id: 503, title: "Inception", subgenre: "Mind-Bending", genres: ["sci-fi","action","suspense"], views: 50000, release: "2010-07-16", rating: "8.8", runtime: "2h 28m", img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000", desc: "A skilled thief who steals secrets from within dreams is hired to plant an idea in a CEO's mind.", director: "Christopher Nolan", cast: ["Leonardo DiCaprio","Joseph Gordon-Levitt","Elliot Page"], language: "EN" },
    { id: 504, title: "The Matrix", subgenre: "Cyberpunk", genres: ["sci-fi","action"], views: 49000, release: "1999-03-31", rating: "8.7", runtime: "2h 16m", img: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000", desc: "A hacker learns the truth about his reality and his role in the war against its controllers.", director: "The Wachowskis", cast: ["Keanu Reeves","Laurence Fishburne","Carrie-Anne Moss"], language: "EN" },
    { id: 505, title: "Dune", subgenre: "Space Epic", genres: ["sci-fi","adventure","drama"], views: 45000, release: "2021-10-22", rating: "8.0", runtime: "2h 35m", img: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?q=80&w=2000", desc: "A noble family becomes embroiled in a war for control of the galaxy's most valuable asset.", director: "Denis Villeneuve", cast: ["Timothée Chalamet","Rebecca Ferguson","Oscar Isaac"], language: "EN" },
    { id: 506, title: "Dune: Part Two", subgenre: "Space Epic", genres: ["sci-fi","action","adventure"], views: 47000, release: "2024-03-01", rating: "8.8", runtime: "2h 46m", img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2000", desc: "Paul Atreides unites with the Fremen and seeks revenge against those who destroyed his family.", director: "Denis Villeneuve", cast: ["Timothée Chalamet","Zendaya","Rebecca Ferguson"], language: "EN" },
    { id: 507, title: "Arrival", subgenre: "First Contact", genres: ["sci-fi","drama","mystery"], views: 38000, release: "2016-11-11", rating: "7.9", runtime: "1h 56m", img: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000", desc: "A linguist is recruited to communicate with alien visitors and uncovers a mystery that could reshape humanity.", director: "Denis Villeneuve", cast: ["Amy Adams","Jeremy Renner","Forest Whitaker"], language: "EN" },
    { id: 508, title: "Arrival of Dune 2", subgenre: "Space Epic", genres: ["sci-fi","drama"], views: 20000, release: "2024-01-10", rating: "7.8", runtime: "2h 20m", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000", desc: "A deeper continuation of the Dune saga exploring the hidden lore of the Fremen and the Spice trade.", director: "Denis Villeneuve", cast: ["Timothée Chalamet","Zendaya","Josh Brolin"], language: "EN" },
    { id: 509, title: "Gravity", subgenre: "Space Survival", genres: ["sci-fi","drama","thriller"], views: 39000, release: "2013-10-04", rating: "7.7", runtime: "1h 31m", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2000", desc: "Two astronauts work together to survive after an accident leaves them adrift in orbit.", director: "Alfonso Cuarón", cast: ["Sandra Bullock","George Clooney","Ed Harris"], language: "EN" },
    { id: 510, title: "The Martian", subgenre: "Space Survival", genres: ["sci-fi","adventure","drama"], views: 42000, release: "2015-10-02", rating: "8.0", runtime: "2h 24m", img: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000", desc: "An astronaut stranded on Mars must find a way to signal Earth that he is alive.", director: "Ridley Scott", cast: ["Matt Damon","Jessica Chastain","Kristen Wiig"], language: "EN" },
    { id: 511, title: "Alien", subgenre: "Space Horror", genres: ["sci-fi","horror"], views: 44000, release: "1979-05-25", rating: "8.5", runtime: "1h 57m", img: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000", desc: "The crew of a commercial spacecraft encounters a deadly alien life form after investigating a distress signal.", director: "Ridley Scott", cast: ["Sigourney Weaver","Tom Skerritt","John Hurt"], language: "EN" },
    { id: 512, title: "Aliens", subgenre: "Space Horror", genres: ["sci-fi","horror","action"], views: 41000, release: "1986-07-18", rating: "8.4", runtime: "2h 17m", img: "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000", desc: "Ellen Ripley returns to the planet where her crew first encountered the Alien, now with a colony to save.", director: "James Cameron", cast: ["Sigourney Weaver","Carrie Henn","Michael Biehn"], language: "EN" },
    { id: 513, title: "2001: A Space Odyssey", subgenre: "Classic Sci-Fi", genres: ["sci-fi","adventure","mystery"], views: 40000, release: "1968-04-02", rating: "8.3", runtime: "2h 29m", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2000", desc: "Humanity finds a mysterious black monolith that drives the course of human evolution.", director: "Stanley Kubrick", cast: ["Keir Dullea","Gary Lockwood","William Sylvester"], language: "EN" },
    { id: 514, title: "Ex Machina", subgenre: "AI Thriller", genres: ["sci-fi","thriller","drama"], views: 37000, release: "2015-04-10", rating: "7.7", runtime: "1h 48m", img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000", desc: "A programmer is invited to administer the Turing test to a humanoid AI, only to find the experiment twisting.", director: "Alex Garland", cast: ["Domhnall Gleeson","Alicia Vikander","Oscar Isaac"], language: "EN" },
    { id: 515, title: "Annihilation", subgenre: "Sci-Fi Horror", genres: ["sci-fi","horror","mystery"], views: 34000, release: "2018-02-23", rating: "6.8", runtime: "1h 55m", img: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000", desc: "A biologist joins a team of soldiers exploring a mysterious quarantined zone with mutating properties.", director: "Alex Garland", cast: ["Natalie Portman","Jennifer Jason Leigh","Tessa Thompson"], language: "EN" },
    { id: 516, title: "Her", subgenre: "AI Romance", genres: ["sci-fi","drama","romance"], views: 36000, release: "2013-12-18", rating: "8.0", runtime: "2h 6m", img: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=2000", desc: "A lonely writer develops an unlikely relationship with an artificial intelligence operating system.", director: "Spike Jonze", cast: ["Joaquin Phoenix","Scarlett Johansson","Amy Adams"], language: "EN" },
    { id: 517, title: "Minority Report", subgenre: "Future Crime", genres: ["sci-fi","action","crime"], views: 38000, release: "2002-06-21", rating: "7.6", runtime: "2h 25m", img: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000", desc: "A police officer in a future where crimes are predicted must prove his innocence when he is accused of a future murder.", director: "Steven Spielberg", cast: ["Tom Cruise","Colin Farrell","Samantha Morton"], language: "EN" },
    { id: 518, title: "Ready Player One", subgenre: "Virtual Reality", genres: ["sci-fi","adventure","action"], views: 39000, release: "2018-03-29", rating: "7.4", runtime: "2h 20m", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2000", desc: "A young gamer competes in a virtual contest for control of a massive online universe.", director: "Steven Spielberg", cast: ["Tye Sheridan","Olivia Cooke","Ben Mendelsohn"], language: "EN" },
    { id: 519, title: "E.T. the Extra-Terrestrial", subgenre: "Classic Sci-Fi", genres: ["sci-fi","family","adventure"], views: 36000, release: "1982-06-11", rating: "7.9", runtime: "1h 55m", img: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000", desc: "A young boy befriends a stranded alien and helps him find a way home.", director: "Steven Spielberg", cast: ["Henry Thomas","Drew Barrymore","Peter Coyote"], language: "EN" },
    { id: 520, title: "Close Encounters of the Third Kind", subgenre: "Classic Sci-Fi", genres: ["sci-fi","drama","adventure"], views: 32000, release: "1977-11-16", rating: "7.6", runtime: "2h 18m", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2000", desc: "A man's life is changed forever after he witnesses a close encounter with a UFO.", director: "Steven Spielberg", cast: ["Richard Dreyfuss","François Truffaut","Teri Garr"], language: "EN" },
    { id: 521, title: "Snowpiercer", subgenre: "Dystopian", genres: ["sci-fi","action","drama"], views: 35000, release: "2013-08-01", rating: "7.1", runtime: "2h 6m", img: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000", desc: "In a post-apocalyptic ice age, survivors live on a train where a class system has taken violent hold.", director: "Bong Joon-ho", cast: ["Chris Evans","Tilda Swinton","Song Kang-ho"], language: "EN" },
    { id: 522, title: "Children of Men", subgenre: "Dystopian", genres: ["sci-fi","thriller","drama"], views: 34000, release: "2006-09-22", rating: "7.9", runtime: "1h 49m", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=2000", desc: "In a future where women are infertile, a man must protect the only pregnant woman on Earth.", director: "Alfonso Cuarón", cast: ["Clive Owen","Julianne Moore","Chiwetel Ejiofor"], language: "EN" },
    { id: 523, title: "Edge of Tomorrow", subgenre: "Time Loop", genres: ["sci-fi","action","adventure"], views: 40000, release: "2014-06-06", rating: "7.9", runtime: "1h 53m", img: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000", desc: "A soldier fighting aliens relives the same day repeatedly and grows stronger with each attempt.", director: "Doug Liman", cast: ["Tom Cruise","Emily Blunt","Bill Paxton"], language: "EN" },
    { id: 524, title: "Looper", subgenre: "Time Loop", genres: ["sci-fi","action","thriller"], views: 33000, release: "2012-09-28", rating: "7.4", runtime: "1h 59m", img: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000", desc: "A hitman in a future where time travel is possible must kill his own older self.", director: "Rian Johnson", cast: ["Joseph Gordon-Levitt","Bruce Willis","Emily Blunt"], language: "EN" },
    { id: 525, title: "Predestination", subgenre: "Time Loop", genres: ["sci-fi","mystery","drama"], views: 30000, release: "2014-08-28", rating: "7.4", runtime: "1h 37m", img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?q=80&w=2000", desc: "A temporal agent must catch a criminal across time in a story that folds back on itself.", director: "The Spierig Brothers", cast: ["Ethan Hawke","Sarah Snook","Noah Taylor"], language: "EN" },
    { id: 526, title: "Under the Skin", subgenre: "Experimental Sci-Fi", genres: ["sci-fi","horror","drama"], views: 25000, release: "2014-03-14", rating: "6.3", runtime: "1h 48m", img: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=2000", desc: "A mysterious alien roams Scotland preying on lonely men, while slowly discovering her own humanity.", director: "Jonathan Glazer", cast: ["Scarlett Johansson","Jeremy McWilliams","Lynsey Taylor Mackay"], language: "EN" },
    { id: 527, title: "Moon", subgenre: "Isolation Sci-Fi", genres: ["sci-fi","drama","mystery"], views: 28000, release: "2009-07-17", rating: "7.8", runtime: "1h 37m", img: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000", desc: "An astronaut mining helium-3 on the far side of the Moon begins to question his own identity.", director: "Duncan Jones", cast: ["Sam Rockwell","Kevin Spacey","Dominique McElligott"], language: "EN" },
    { id: 528, title: "Sunshine", subgenre: "Space Survival", genres: ["sci-fi","thriller","adventure"], views: 29000, release: "2007-04-05", rating: "7.2", runtime: "1h 47m", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000", desc: "A team of astronauts embarks on a mission to reignite the dying Sun with a stellar bomb.", director: "Danny Boyle", cast: ["Cillian Murphy","Chris Evans","Michelle Yeoh"], language: "EN" },
    { id: 529, title: "Total Recall", subgenre: "Cyberpunk", genres: ["sci-fi","action","adventure"], views: 31000, release: "1990-06-01", rating: "7.5", runtime: "1h 53m", img: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000", desc: "A construction worker has a memory implant installed and finds himself tangled in a Martian conspiracy.", director: "Paul Verhoeven", cast: ["Arnold Schwarzenegger","Rachel Ticotin","Sharon Stone"], language: "EN" },
    { id: 530, title: "Tenet", subgenre: "Time Manipulation", genres: ["sci-fi","action","thriller"], views: 41000, release: "2020-09-03", rating: "7.3", runtime: "2h 30m", img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000", desc: "Armed with only one word, a protagonist journeys through a twilight world of international espionage on a mission that unfolds beyond real time.", director: "Christopher Nolan", cast: ["John David Washington","Robert Pattinson","Elizabeth Debicki"], language: "EN" }
  ];

  const HERO_IDS = [502, 503, 506, 505, 504, 513];
  const HERO_MOVIES = HERO_IDS.map(id => SCIFI_MOVIES.find(m => m.id === id)).filter(Boolean);

  const DIRECTORS = [
    { name: "Denis Villeneuve",   films: "Blade Runner 2049 · Dune · Arrival",        tag: "Modern Sci-Fi Auteur" },
    { name: "Christopher Nolan",  films: "Interstellar · Inception · Tenet",          tag: "Time & Space" },
    { name: "Ridley Scott",       films: "Alien · The Martian",                       tag: "Alien Worlds" },
    { name: "Steven Spielberg",   films: "Minority Report · E.T. · Ready Player One", tag: "Future Visions" },
    { name: "Stanley Kubrick",    films: "2001: A Space Odyssey",                     tag: "Visionary" },
    { name: "James Cameron",      films: "Aliens",                                    tag: "Action Sci-Fi" },
    { name: "Alex Garland",       films: "Ex Machina · Annihilation",                 tag: "AI & Dread" },
    { name: "Alfonso Cuarón",     films: "Gravity · Children of Men",                 tag: "Survival Sci-Fi" },
    { name: "Bong Joon-ho",       films: "Snowpiercer",                               tag: "Dystopian" },
    { name: "The Wachowskis",     films: "The Matrix",                                tag: "Cyberpunk Pioneers" }
  ];

  function initHero() {
    HERO_MOVIES.forEach((m, i) => {
      const slide = document.createElement('div');
      slide.className = 'fh-hero__slide' + (i === 0 ? ' is-active' : '');
      slide.innerHTML = `
        <div class="fh-hero__slide-bg"><img src="${m.backdrop}" alt="${m.title}"></div>
        <div class="fh-hero__content">
          <div class="fh-hero__card">
            <span class="fh-hero__tag">${i === 0 ? 'Sci-Fi Spotlight' : 'Featured Sci-Fi'}</span>
            <h1 class="fh-hero__title">${m.title}</h1>
            <div class="fh-hero__meta">
              <span class="fh-hero__pill fh-hero__pill--rating"><i class="fas fa-star"></i> ${m.rating}</span>
              <span class="fh-hero__pill"><i class="fas fa-calendar"></i> ${m.release.slice(0,4)}</span>
              <span class="fh-hero__pill"><i class="fas fa-clock"></i> ${m.runtime}</span>
              <span class="fh-hero__pill">${m.subgenre}</span>
              <span class="fh-hero__pill fh-hero__pill--hd">HD</span>
            </div>
            <p class="fh-hero__desc">${m.desc}</p>
            <div class="fh-hero__director">
              <div class="fh-hero__director-avatar">${m.director.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
              <div>
                <div class="fh-hero__director-label">Directed By</div>
                <div class="fh-hero__director-name">${m.director}</div>
              </div>
            </div>
            <div class="fh-hero__actions">
              <button class="fh-hero__btn fh-hero__btn--primary" data-open="${m.id}"><i class="fas fa-play"></i> Watch Now</button>
              <button class="fh-hero__btn fh-hero__btn--ghost" data-open="${m.id}"><i class="fas fa-circle-info"></i> More Info</button>
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
    const items = [...SCIFI_MOVIES].sort((a,b) => b.views - a.views).slice(0, 14);
    const html = items.map(m => `
      <div class="fh-marquee__card" data-open="${m.id}">
        <img src="${m.img}" alt="${m.title}" loading="lazy">
        <span class="fh-marquee__rate"><i class="fas fa-star"></i> ${m.rating}</span>
        <div class="fh-marquee__body">
          <h3 class="fh-marquee__title">${m.title}</h3>
          <div class="fh-marquee__meta">
            <span>${m.release.slice(0,4)}</span>
            <span>·</span>
            <span>${m.subgenre}</span>
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
        const btn = e.target.closest('.fh-scifi-sort__btn');
        if (!btn) return;
        sortWrap.querySelectorAll('.fh-scifi-sort__btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        state.activeSort = btn.dataset.sort;
        renderGrid(state.activeSort);
      });
    }
  }

  function renderGrid(sortKey) {
    let list = [...SCIFI_MOVIES];
    if (sortKey === 'popular') list.sort((a,b) => b.views - a.views);
    else if (sortKey === 'latest') list.sort((a,b) => new Date(b.release) - new Date(a.release));
    else if (sortKey === 'rating') list.sort((a,b) => parseFloat(b.rating) - parseFloat(a.rating));
    else if (sortKey === 'az') list.sort((a,b) => a.title.localeCompare(b.title));

    gridEl.innerHTML = list.map(renderCard).join('');
    attachHandlers(gridEl);

    const cards = gridEl.querySelectorAll('.fh-scifi-card');
    const obs = new IntersectionObserver((entries) => {
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
      <article class="fh-scifi-card" data-open="${m.id}" tabindex="0" role="button" aria-label="${m.title}">
        <span class="fh-scifi-card__subgenre">${m.subgenre}</span>
        <div class="fh-scifi-card__media">
          <img src="${m.img}" alt="${m.title}" loading="lazy">
          <span class="fh-scifi-card__rate"><i class="fas fa-star"></i> ${m.rating}</span>
        </div>
        <div class="fh-scifi-card__body">
          <h3 class="fh-scifi-card__title">${m.title}</h3>
          <div class="fh-scifi-card__meta">
            <span>${m.release.slice(0,4)}</span>
            <span>${m.genres[0].toUpperCase()}</span>
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
    const html = DIRECTORS.map(d => {
      const initials = d.name.split(' ').map(w => w[0]).slice(0,2).join('');
      return `
        <div class="fh-scifi-director-card">
          <div class="fh-scifi-director-card__avatar">${initials}</div>
          <div class="fh-scifi-director-card__body">
            <div class="fh-scifi-director-card__name">${d.name}</div>
            <div class="fh-scifi-director-card__films">${d.films}</div>
            <span class="fh-scifi-director-card__tag"><i class="fas fa-satellite"></i> ${d.tag}</span>
          </div>
        </div>`;
    }).join('');
    directorTrack.className = 'fh-marquee__track';
    directorTrack.innerHTML = html + html;
    directorTrack.style.animationDuration = '80s';
  }

  function openMovieDetails(movieId) {
    const m = SCIFI_MOVIES.find(x => x.id === movieId);
    if (!m) return;

    const related = SCIFI_MOVIES
      .filter(x => x.id !== m.id && x.genres.some(g => m.genres.includes(g)))
      .slice(0, 6);

    drawerBody.innerHTML = `
      <div class="fh-drawer__hero">
        <img src="${m.backdrop}" alt="${m.title}">
        <div class="fh-drawer__hero-content">
          <h1 class="fh-drawer__title" id="fhDrawerTitle">${m.title}</h1>
          <div class="fh-drawer__meta">
            <span><i class="fas fa-star" style="color:#fbbf24"></i> ${m.rating}</span>
            <span><i class="fas fa-calendar"></i> ${m.release}</span>
            <span><i class="fas fa-clock"></i> ${m.runtime}</span>
            <span><i class="fas fa-globe"></i> ${m.language}</span>
            <span><i class="fas fa-satellite"></i> ${m.subgenre}</span>
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
          <p class="fh-drawer__desc">${m.desc}</p>
          <h3 class="fh-drawer__section-title">Top Cast</h3>
          <div class="fh-drawer__cast hide-scrollbar">
            ${m.cast.map(c => `
              <div class="fh-drawer__cast-member">
                <div class="fh-drawer__cast-avatar"><i class="fas fa-user"></i></div>
                <div class="fh-drawer__cast-name">${c}</div>
              </div>`).join('')}
          </div>
        </div>
        <div class="fh-drawer__info-card">
          <h3 class="fh-drawer__section-title">Details</h3>
          <div class="fh-drawer__info-row"><span class="fh-drawer__info-label">Director</span><span class="fh-drawer__info-value">${m.director}</span></div>
          <div class="fh-drawer__info-row"><span class="fh-drawer__info-label">Release</span><span class="fh-drawer__info-value">${m.release}</span></div>
          <div class="fh-drawer__info-row"><span class="fh-drawer__info-label">Genres</span><span class="fh-drawer__info-value">${m.genres.join(', ')}</span></div>
          <div class="fh-drawer__info-row"><span class="fh-drawer__info-label">Language</span><span class="fh-drawer__info-value">${m.language}</span></div>
          <div class="fh-drawer__info-row"><span class="fh-drawer__info-label">Views</span><span class="fh-drawer__info-value">${m.views.toLocaleString()}</span></div>
        </div>
      </div>
      <div class="fh-drawer__content" style="grid-template-columns:1fr;padding-top:0">
        <div>
          <h3 class="fh-drawer__section-title">More Like This</h3>
          <div class="fh-marquee__track" id="fhScifiDrawerRelated" style="animation:none;gap:16px;overflow-x:auto"></div>
        </div>
      </div>`;

    const rel = drawerBody.querySelector('#fhScifiDrawerRelated');
    rel.innerHTML = related.map(r => `
      <div class="fh-marquee__card" data-open="${r.id}" style="flex:0 0 auto">
        <img src="${r.img}" alt="${r.title}" loading="lazy">
        <span class="fh-marquee__rate"><i class="fas fa-star"></i> ${r.rating}</span>
        <div class="fh-marquee__body">
          <h3 class="fh-marquee__title">${r.title}</h3>
          <div class="fh-marquee__meta"><span>${r.release.slice(0,4)}</span></div>
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
        searchResults.innerHTML = `<div class="fh-search-results__empty">No results for "${q}"</div>`;
        return;
      }
      searchResults.innerHTML = list.map(m => `
        <div class="fh-search-results__item" data-open="${m.id}">
          <img src="${m.img}" alt="${m.title}">
          <div class="fh-search-results__info">
            <div class="fh-search-results__title">${m.title}</div>
            <div class="fh-search-results__meta">${m.release.slice(0,4)} · ${m.subgenre}</div>
            <div class="fh-search-results__meta">★ ${m.rating}</div>
          </div>
        </div>`).join('');
      attachHandlers(searchResults);
      searchResults.querySelectorAll('[data-open]').forEach(el => {
        el.addEventListener('click', () => { closeResults(); searchInput.blur(); });
      });
    }

    function query(q) {
      const s = q.toLowerCase();
      return SCIFI_MOVIES.filter(m =>
        m.title.toLowerCase().includes(s) ||
        m.genres.some(g => g.includes(s)) ||
        m.director.toLowerCase().includes(s)
      ).slice(0, 12);
    }

    searchInput.addEventListener('focus', () => {
      openResults();
      const q = searchInput.value.trim();
      if (!q) render(SCIFI_MOVIES.slice(0, 6), 'popular');
      else render(query(q), q);
    });
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim();
      if (!q) { render(SCIFI_MOVIES.slice(0, 6), 'popular'); return; }
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
    if (sideCountEl) sideCountEl.textContent = SCIFI_MOVIES.length + '+';
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
      if (Array.isArray(rows) && rows.length) SCIFI_MOVIES = rows;
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