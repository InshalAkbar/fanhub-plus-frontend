(() => {
  'use strict';

  const heroSection = document.getElementById('fhFicHero');
  const heroDots = document.getElementById('fhFicHeroDots');
  const topWatchedTrack = document.getElementById('fhFicTopWatchedTrack');
  const gridEl = document.getElementById('fhFicGrid');
  const gridSection = document.getElementById('fhFicGridSection');
  const artifact = document.getElementById('fhArtifact');
  const sortWrap = document.getElementById('fhFicSort');
  const directorTrack = document.getElementById('fhFicDirectorTrack');
  const footer = document.getElementById('fhFooter');
  const drawer = document.getElementById('movieDetailDrawer');
  const drawerBody = document.getElementById('fhDrawerBody');
  const sideCountEl = document.getElementById('fhSideCount');

  const state = {
    currentHero: 0,
    heroTimer: null,
    activeSort: 'popular',
    artifactDocked: false,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  };

  let FICTIONAL_MOVIES = [
    { id: 101, title: "Harry Potter and the Philosopher's Stone", subgenre: "Fantasy", genres: ["fictional","adventure","fantasy"], views: 48000, release: "2001-11-16", rating: "7.7", runtime: "2h 32m", img: "https://images.unsplash.com/photo-1618945524163-32451704cbb8?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1547754980-3df97fed72a8?q=80&w=2000", desc: "An orphaned boy discovers he is a wizard and begins his first year at Hogwarts School of Witchcraft and Wizardry.", director: "Chris Columbus", cast: ["Daniel Radcliffe","Rupert Grint","Emma Watson"], language: "EN" },
    { id: 102, title: "Harry Potter and the Prisoner of Azkaban", subgenre: "Magical", genres: ["fictional","fantasy","mystery"], views: 46000, release: "2004-06-04", rating: "7.9", runtime: "2h 22m", img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=2000", desc: "Harry learns that a dangerous prisoner has escaped Azkaban, and dark secrets from his parents' past come to light.", director: "Alfonso Cuarón", cast: ["Daniel Radcliffe","Rupert Grint","Emma Watson"], language: "EN" },
    { id: 103, title: "The Lord of the Rings: The Fellowship of the Ring", subgenre: "Epic Fantasy", genres: ["fictional","adventure","fantasy"], views: 52000, release: "2001-12-19", rating: "8.9", runtime: "2h 58m", img: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000", desc: "A young hobbit is entrusted with an ancient ring that must be destroyed in the fires of Mount Doom.", director: "Peter Jackson", cast: ["Elijah Wood","Ian McKellen","Viggo Mortensen"], language: "EN" },
    { id: 104, title: "The Lord of the Rings: The Return of the King", subgenre: "Epic Fantasy", genres: ["fictional","adventure","fantasy"], views: 54000, release: "2003-12-17", rating: "9.0", runtime: "3h 21m", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000", desc: "The final confrontation between the forces of Middle-earth and the dark lord Sauron.", director: "Peter Jackson", cast: ["Elijah Wood","Viggo Mortensen","Ian McKellen"], language: "EN" },
    { id: 105, title: "The Hobbit: An Unexpected Journey", subgenre: "Adventure Fiction", genres: ["fictional","adventure","fantasy"], views: 38000, release: "2012-12-14", rating: "7.8", runtime: "2h 49m", img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=2000", desc: "Bilbo Baggins is swept into an epic quest to reclaim the lost dwarf kingdom of Erebor from the dragon Smaug.", director: "Peter Jackson", cast: ["Martin Freeman","Ian McKellen","Richard Armitage"], language: "EN" },
    { id: 106, title: "Inception", subgenre: "Sci-Fi Fiction", genres: ["fictional","sci-fi","suspense"], views: 49000, release: "2010-07-16", rating: "8.8", runtime: "2h 28m", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000", desc: "A skilled thief who steals secrets from within dreams is hired to plant an idea in a CEO's mind.", director: "Christopher Nolan", cast: ["Leonardo DiCaprio","Joseph Gordon-Levitt","Elliot Page"], language: "EN" },
    { id: 107, title: "Interstellar", subgenre: "Sci-Fi Fiction", genres: ["fictional","sci-fi","drama"], views: 47000, release: "2014-11-07", rating: "8.7", runtime: "2h 49m", img: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000", desc: "A team of explorers travel through a wormhole in search of a new home for humanity.", director: "Christopher Nolan", cast: ["Matthew McConaughey","Anne Hathaway","Jessica Chastain"], language: "EN" },
    { id: 108, title: "The Dark Knight", subgenre: "Superhero Fiction", genres: ["fictional","action","crime"], views: 55000, release: "2008-07-18", rating: "9.0", runtime: "2h 32m", img: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=2000", desc: "Batman faces the Joker, a criminal mastermind determined to plunge Gotham into chaos.", director: "Christopher Nolan", cast: ["Christian Bale","Heath Ledger","Aaron Eckhart"], language: "EN" },
    { id: 109, title: "Avatar", subgenre: "Sci-Fi Fiction", genres: ["fictional","sci-fi","adventure"], views: 50000, release: "2009-12-18", rating: "7.9", runtime: "2h 42m", img: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?q=80&w=2000", desc: "A marine on an alien planet becomes torn between following orders and protecting the world he feels is his home.", director: "James Cameron", cast: ["Sam Worthington","Zoe Saldaña","Sigourney Weaver"], language: "EN" },
    { id: 110, title: "Avatar: The Way of Water", subgenre: "Sci-Fi Fiction", genres: ["fictional","sci-fi","adventure"], views: 42000, release: "2022-12-16", rating: "7.6", runtime: "3h 12m", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000", desc: "The Sully family explores the oceans of Pandora and faces a returning threat.", director: "James Cameron", cast: ["Sam Worthington","Zoe Saldaña","Sigourney Weaver"], language: "EN" },
    { id: 111, title: "Dune", subgenre: "Sci-Fi Fiction", genres: ["fictional","sci-fi","adventure"], views: 40000, release: "2021-10-22", rating: "8.0", runtime: "2h 35m", img: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?q=80&w=2000", desc: "A noble family becomes embroiled in a war for control of the galaxy's most valuable asset.", director: "Denis Villeneuve", cast: ["Timothée Chalamet","Rebecca Ferguson","Oscar Isaac"], language: "EN" },
    { id: 112, title: "Dune: Part Two", subgenre: "Sci-Fi Fiction", genres: ["fictional","sci-fi","action"], views: 44000, release: "2024-03-01", rating: "8.8", runtime: "2h 46m", img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2000", desc: "Paul Atreides unites with the Fremen and seeks revenge against those who destroyed his family.", director: "Denis Villeneuve", cast: ["Timothée Chalamet","Zendaya","Rebecca Ferguson"], language: "EN" },
    { id: 113, title: "Blade Runner 2049", subgenre: "Dystopian", genres: ["fictional","sci-fi","mystery"], views: 32000, release: "2017-10-06", rating: "8.0", runtime: "2h 44m", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000", desc: "A blade runner discovers a long-buried secret that has the potential to plunge what's left of society into chaos.", director: "Denis Villeneuve", cast: ["Ryan Gosling","Harrison Ford","Ana de Armas"], language: "EN" },
    { id: 114, title: "Arrival", subgenre: "Sci-Fi Fiction", genres: ["fictional","sci-fi","drama"], views: 30000, release: "2016-11-11", rating: "7.9", runtime: "1h 56m", img: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000", desc: "A linguist is recruited to communicate with alien visitors and uncovers a mystery that could reshape humanity.", director: "Denis Villeneuve", cast: ["Amy Adams","Jeremy Renner","Forest Whitaker"], language: "EN" },
    { id: 115, title: "Star Wars: A New Hope", subgenre: "Space Fiction", genres: ["fictional","sci-fi","adventure"], views: 48000, release: "1977-05-25", rating: "8.6", runtime: "2h 1m", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2000", desc: "A young farm boy joins a rebellion against an oppressive galactic empire.", director: "George Lucas", cast: ["Mark Hamill","Harrison Ford","Carrie Fisher"], language: "EN" },
    { id: 116, title: "Star Wars: The Empire Strikes Back", subgenre: "Space Fiction", genres: ["fictional","sci-fi","adventure"], views: 47000, release: "1980-05-21", rating: "8.7", runtime: "2h 4m", img: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000", desc: "Luke Skywalker trains with Yoda while the Empire pursues the Rebel Alliance across the galaxy.", director: "Irvin Kershner", cast: ["Mark Hamill","Harrison Ford","Carrie Fisher"], language: "EN" },
    { id: 117, title: "The Matrix", subgenre: "Dystopian", genres: ["fictional","sci-fi","action"], views: 43000, release: "1999-03-31", rating: "8.7", runtime: "2h 16m", img: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000", desc: "A hacker learns the truth about his reality and his role in the war against its controllers.", director: "The Wachowskis", cast: ["Keanu Reeves","Laurence Fishburne","Carrie-Anne Moss"], language: "EN" },
    { id: 118, title: "Pan's Labyrinth", subgenre: "Dark Fantasy", genres: ["fictional","fantasy","drama"], views: 26000, release: "2006-10-11", rating: "8.2", runtime: "1h 58m", img: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=2000", desc: "A young girl in post-war Spain escapes into a fantastical world to complete three tasks.", director: "Guillermo del Toro", cast: ["Ivana Baquero","Sergi López","Maribel Verdú"], language: "ES" },
    { id: 119, title: "The Shape of Water", subgenre: "Romantic Fantasy", genres: ["fictional","fantasy","romance"], views: 24000, release: "2017-12-01", rating: "7.3", runtime: "2h 3m", img: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?q=80&w=2000", desc: "A mute woman forms a bond with an amphibious creature held captive in a secret government lab.", director: "Guillermo del Toro", cast: ["Sally Hawkins","Michael Shannon","Octavia Spencer"], language: "EN" },
    { id: 120, title: "Spirited Away", subgenre: "Animated Fantasy", genres: ["fictional","anime","fantasy"], views: 45000, release: "2001-07-20", rating: "8.6", runtime: "2h 5m", img: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=2000", desc: "A young girl wanders into a world ruled by gods, witches, and spirits, and must work to free her parents.", director: "Hayao Miyazaki", cast: ["Rumi Hiiragi","Miyu Irino","Mari Natsuki"], language: "JP" },
    { id: 121, title: "Princess Mononoke", subgenre: "Animated Fantasy", genres: ["fictional","anime","fantasy"], views: 40000, release: "1997-07-12", rating: "8.4", runtime: "2h 14m", img: "https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=2000", desc: "A prince becomes embroiled in a struggle between the gods of a forest and the humans who consume its resources.", director: "Hayao Miyazaki", cast: ["Billy Crudup","Claire Danes","Minnie Driver"], language: "JP" },
    { id: 122, title: "Howl's Moving Castle", subgenre: "Animated Fantasy", genres: ["fictional","anime","fantasy"], views: 39000, release: "2004-11-20", rating: "8.2", runtime: "1h 59m", img: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=2000", desc: "A young woman is cursed by a witch and finds refuge in the walking castle of a mysterious wizard.", director: "Hayao Miyazaki", cast: ["Chieko Baisho","Takuya Kimura","Akihiro Miwa"], language: "JP" },
    { id: 123, title: "Edward Scissorhands", subgenre: "Modern Fantasy", genres: ["fictional","fantasy","romance"], views: 22000, release: "1990-12-14", rating: "7.9", runtime: "1h 45m", img: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=2000", desc: "An unfinished artificial man is taken in by a suburban family and falls in love with their daughter.", director: "Tim Burton", cast: ["Johnny Depp","Winona Ryder","Dianne Wiest"], language: "EN" },
    { id: 124, title: "Alice in Wonderland", subgenre: "Dark Fantasy", genres: ["fictional","fantasy","adventure"], views: 25000, release: "2010-03-05", rating: "6.4", runtime: "1h 48m", img: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=2000", desc: "Alice returns to Wonderland to overthrow the Red Queen and restore the White Queen to the throne.", director: "Tim Burton", cast: ["Mia Wasikowska","Johnny Depp","Helena Bonham Carter"], language: "EN" },
    { id: 125, title: "E.T. the Extra-Terrestrial", subgenre: "Sci-Fi Fiction", genres: ["fictional","sci-fi","adventure"], views: 30000, release: "1982-06-11", rating: "7.9", runtime: "1h 55m", img: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000", desc: "A young boy befriends a stranded alien and helps him find a way home.", director: "Steven Spielberg", cast: ["Henry Thomas","Drew Barrymore","Peter Coyote"], language: "EN" },
    { id: 126, title: "Jurassic Park", subgenre: "Adventure Fiction", genres: ["fictional","sci-fi","adventure"], views: 44000, release: "1993-06-11", rating: "8.2", runtime: "2h 7m", img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000", desc: "Scientists clone dinosaurs for a theme park, but the creatures escape and terrorize the visitors.", director: "Steven Spielberg", cast: ["Sam Neill","Laura Dern","Jeff Goldblum"], language: "EN" },
    { id: 127, title: "Ready Player One", subgenre: "Sci-Fi Fiction", genres: ["fictional","sci-fi","adventure"], views: 27000, release: "2018-03-29", rating: "7.4", runtime: "2h 20m", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2000", desc: "A young gamer competes in a virtual contest for control of a massive online universe.", director: "Steven Spielberg", cast: ["Tye Sheridan","Olivia Cooke","Ben Mendelsohn"], language: "EN" },
    { id: 128, title: "The Chronicles of Narnia: The Lion, the Witch and the Wardrobe", subgenre: "Fantasy", genres: ["fictional","fantasy","adventure"], views: 34000, release: "2005-12-09", rating: "6.9", runtime: "2h 23m", img: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000", desc: "Four siblings step through a wardrobe into the magical land of Narnia.", director: "Andrew Adamson", cast: ["Tilda Swinton","Georgie Henley","Skandar Keynes"], language: "EN" },
    { id: 129, title: "Fantastic Beasts and Where to Find Them", subgenre: "Magical", genres: ["fictional","fantasy","adventure"], views: 31000, release: "2016-11-18", rating: "7.2", runtime: "2h 13m", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=2000", desc: "A magizoologist arrives in 1920s New York with a case full of magical creatures—some of which escape.", director: "David Yates", cast: ["Eddie Redmayne","Katherine Waterston","Dan Fogler"], language: "EN" },
    { id: 130, title: "Mad Max: Fury Road", subgenre: "Dystopian", genres: ["fictional","action","sci-fi"], views: 36000, release: "2015-05-15", rating: "8.1", runtime: "2h 0m", img: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000", desc: "A woman rebels against a tyrannical ruler in search of her homeland, aided by a drifter named Max.", director: "George Miller", cast: ["Tom Hardy","Charlize Theron","Nicholas Hoult"], language: "EN" }
  ];

  const HERO_IDS = [106, 103, 112, 115, 101, 107];
  const HERO_MOVIES = HERO_IDS.map(id => FICTIONAL_MOVIES.find(m => m.id === id)).filter(Boolean);

  const DIRECTORS = [
    { name: "Christopher Nolan", films: "Inception · Interstellar · The Dark Knight", tag: "Sci-Fi Visionary" },
    { name: "Peter Jackson",     films: "The Lord of the Rings · The Hobbit",         tag: "Epic Fantasy" },
    { name: "Denis Villeneuve",  films: "Dune · Blade Runner 2049 · Arrival",         tag: "Sci-Fi Master" },
    { name: "Hayao Miyazaki",    films: "Spirited Away · Princess Mononoke",          tag: "Animated Fantasy" },
    { name: "Guillermo del Toro",films: "Pan's Labyrinth · The Shape of Water",       tag: "Dark Fantasy" },
    { name: "James Cameron",     films: "Avatar · Avatar: The Way of Water",          tag: "World-Builder" },
    { name: "Steven Spielberg",  films: "E.T. · Jurassic Park · Ready Player One",    tag: "Adventure" },
    { name: "Tim Burton",        films: "Edward Scissorhands · Alice in Wonderland",  tag: "Gothic Fantasy" },
    { name: "George Lucas",      films: "Star Wars: A New Hope",                      tag: "Space Opera" },
    { name: "The Wachowskis",    films: "The Matrix",                                 tag: "Cyber Fiction" }
  ];

  function initHero() {
    HERO_MOVIES.forEach((m, i) => {
      const slide = document.createElement('div');
      slide.className = 'fh-hero__slide' + (i === 0 ? ' is-active' : '');
      slide.innerHTML = `
        <div class="fh-hero__slide-bg"><img src="${m.backdrop}" alt="${m.title}"></div>
        <div class="fh-hero__content">
          <div class="fh-hero__card">
            <span class="fh-hero__tag">${i === 0 ? 'Fictional Spotlight' : 'Featured Fiction'}</span>
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
    const items = [...FICTIONAL_MOVIES].sort((a,b) => b.views - a.views).slice(0, 14);
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
        const btn = e.target.closest('.fh-fic-sort__btn');
        if (!btn) return;
        sortWrap.querySelectorAll('.fh-fic-sort__btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        state.activeSort = btn.dataset.sort;
        renderGrid(state.activeSort);
      });
    }
  }

  function renderGrid(sortKey) {
    let list = [...FICTIONAL_MOVIES];
    if (sortKey === 'popular') list.sort((a,b) => b.views - a.views);
    else if (sortKey === 'latest') list.sort((a,b) => new Date(b.release) - new Date(a.release));
    else if (sortKey === 'rating') list.sort((a,b) => parseFloat(b.rating) - parseFloat(a.rating));
    else if (sortKey === 'az') list.sort((a,b) => a.title.localeCompare(b.title));

    gridEl.innerHTML = list.map(renderCard).join('');
    attachHandlers(gridEl);

    const cards = gridEl.querySelectorAll('.fh-fic-card');
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
      <article class="fh-fic-card" data-open="${m.id}" tabindex="0" role="button" aria-label="${m.title}">
        <span class="fh-fic-card__subgenre">${m.subgenre}</span>
        <div class="fh-fic-card__media">
          <img src="${m.img}" alt="${m.title}" loading="lazy">
          <span class="fh-fic-card__rate"><i class="fas fa-star"></i> ${m.rating}</span>
        </div>
        <div class="fh-fic-card__body">
          <h3 class="fh-fic-card__title">${m.title}</h3>
          <div class="fh-fic-card__meta">
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

  function initScrollArtifact() {
    if (!artifact || !gridSection) return;
    if (state.reducedMotion) {
      artifact.style.setProperty('--fh-artifact-opacity', '0.35');
      artifact.style.setProperty('--fh-artifact-blur', '4px');
      return;
    }

    let ticking = false;

    function update() {
      ticking = false;

      const gridRect = gridSection.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = gridRect.height + vh * 0.6;
      const scrolled = vh - gridRect.top;
      let progress = Math.max(0, Math.min(1, scrolled / total));

      const travelPx = gridRect.height - 220;
      const y = progress * travelPx;

      artifact.style.transform = `translate3d(-50%, ${y}px, 0)`;

      const visibility = 0.12 + progress * 0.88;
      artifact.style.setProperty('--fh-artifact-opacity', visibility.toFixed(3));
      const blur = 6 * (1 - progress) + 0.5;
      artifact.style.setProperty('--fh-artifact-blur', blur.toFixed(2));

      if (progress > 0.75) artifact.classList.add('is-emerged');
      else artifact.classList.remove('is-emerged');

      const nearGridEnd = gridRect.bottom <= vh * 0.55;
      const footerRect = footer.getBoundingClientRect();
      const nearFooter = footerRect.top <= vh + 200;

      if (nearGridEnd && !state.artifactDocked) {
        const footerCenterX = window.innerWidth / 2;
        const footerTopY = Math.max(80, Math.min(vh - 240, footerRect.top - 100));
        artifact.classList.add('is-docked');
        artifact.style.transform = 'translate3d(0,0,0)';
        artifact.style.left = footerCenterX + 'px';
        artifact.style.top = footerTopY + 'px';
        artifact.style.setProperty('--fh-artifact-opacity', '1');
        artifact.style.setProperty('--fh-artifact-blur', '0');
        state.artifactDocked = true;
      }

      if (state.artifactDocked) {
        const followY = Math.max(80, Math.min(vh - 240, footerRect.top - 100));
        const followX = window.innerWidth / 2;
        artifact.style.left = followX + 'px';
        artifact.style.top = followY + 'px';
      }

      if (nearFooter && !footer.classList.contains('is-revealed')) {
        footer.classList.add('is-revealed');
      }
    }

    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });

    window.addEventListener('resize', () => {
      if (state.artifactDocked) {
        artifact.classList.remove('is-docked');
        artifact.style.left = '';
        artifact.style.top = '';
        state.artifactDocked = false;
      }
      update();
    });

    update();
  }

  function initDirectors() {
    const html = DIRECTORS.map(d => {
      const initials = d.name.split(' ').map(w => w[0]).slice(0,2).join('');
      return `
        <div class="fh-fic-director-card">
          <div class="fh-fic-director-card__avatar">${initials}</div>
          <div class="fh-fic-director-card__body">
            <div class="fh-fic-director-card__name">${d.name}</div>
            <div class="fh-fic-director-card__films">${d.films}</div>
            <span class="fh-fic-director-card__tag"><i class="fas fa-wand-magic-sparkles"></i> ${d.tag}</span>
          </div>
        </div>`;
    }).join('');
    directorTrack.className = 'fh-marquee__track';
    directorTrack.innerHTML = html + html;
    directorTrack.style.animationDuration = '80s';
  }

  function openMovieDetails(movieId) {
    const m = FICTIONAL_MOVIES.find(x => x.id === movieId);
    if (!m) return;

    const related = FICTIONAL_MOVIES
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
            <span><i class="fas fa-dragon"></i> ${m.subgenre}</span>
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
          <div class="fh-marquee__track" id="fhFicDrawerRelated" style="animation:none;gap:16px;overflow-x:auto"></div>
        </div>
      </div>`;

    const rel = drawerBody.querySelector('#fhFicDrawerRelated');
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
      return FICTIONAL_MOVIES.filter(m =>
        m.title.toLowerCase().includes(s) ||
        m.genres.some(g => g.includes(s)) ||
        m.director.toLowerCase().includes(s)
      ).slice(0, 12);
    }

    searchInput.addEventListener('focus', () => {
      openResults();
      const q = searchInput.value.trim();
      if (!q) render(FICTIONAL_MOVIES.slice(0, 6), 'popular');
      else render(query(q), q);
    });
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim();
      if (!q) { render(FICTIONAL_MOVIES.slice(0, 6), 'popular'); return; }
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
    if (sideCountEl) sideCountEl.textContent = FICTIONAL_MOVIES.length + '+';
  }

  function init() {
    initHero();
    initTopWatched();
    initGrid();
    initScrollArtifact();
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
      if (Array.isArray(rows) && rows.length) FICTIONAL_MOVIES = rows;
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