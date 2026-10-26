(() => {
  'use strict';

  const heroSection = document.getElementById('fhAdvHero');
  const heroDots = document.getElementById('fhAdvHeroDots');
  const topWatchedTrack = document.getElementById('fhAdvTopWatchedTrack');
  const gridEl = document.getElementById('fhAdvGrid');
  const sortWrap = document.getElementById('fhAdvSort');
  const directorTrack = document.getElementById('fhAdvDirectorTrack');
  const drawer = document.getElementById('movieDetailDrawer');
  const drawerBody = document.getElementById('fhDrawerBody');
  const sideCount = document.getElementById('fhSideCount');

  const state = {
    currentHero: 0,
    heroTimer: null,
    activeSort: 'popular'
  };

  let ADVENTURE_MOVIES = [
    { id: 301, title: "Raiders of the Lost Ark", subgenre: "Classic Adventure", genres: ["adventure","action"], views: 52000, release: "1981-06-12", rating: "8.4", runtime: "1h 55m", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000", desc: "Archaeologist Indiana Jones races to find the Ark of the Covenant before the Nazis can harness its power.", director: "Steven Spielberg", cast: ["Harrison Ford","Karen Allen","Paul Freeman"], language: "EN" },
    { id: 302, title: "Indiana Jones and the Last Crusade", subgenre: "Classic Adventure", genres: ["adventure","action"], views: 48000, release: "1989-05-24", rating: "8.2", runtime: "2h 7m", img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000", desc: "Indiana Jones sets out to rescue his father and find the Holy Grail before the Nazis.", director: "Steven Spielberg", cast: ["Harrison Ford","Sean Connery","Alison Doody"], language: "EN" },
    { id: 303, title: "Jurassic Park", subgenre: "Sci-Fi Adventure", genres: ["adventure","sci-fi","action"], views: 50000, release: "1993-06-11", rating: "8.2", runtime: "2h 7m", img: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=2000", desc: "Scientists clone dinosaurs for a theme park, but the creatures escape and terrorize their creators.", director: "Steven Spielberg", cast: ["Sam Neill","Laura Dern","Jeff Goldblum"], language: "EN" },
    { id: 304, title: "Jumanji: Welcome to the Jungle", subgenre: "Fantasy Adventure", genres: ["adventure","comedy","action"], views: 42000, release: "2017-12-20", rating: "6.9", runtime: "1h 59m", img: "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=2000", desc: "Four teenagers are sucked into a magical video game and must complete the game to escape.", director: "Jake Kasdan", cast: ["Dwayne Johnson","Kevin Hart","Jack Black"], language: "EN" },
    { id: 305, title: "The Goonies", subgenre: "Family Adventure", genres: ["adventure","comedy"], views: 38000, release: "1985-06-07", rating: "7.7", runtime: "1h 54m", img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000", desc: "A group of kids uncover a treasure map and embark on an adventure to save their homes.", director: "Richard Donner", cast: ["Sean Astin","Josh Brolin","Corey Feldman"], language: "EN" },
    { id: 306, title: "Pirates of the Caribbean: The Curse of the Black Pearl", subgenre: "Swashbuckler", genres: ["adventure","fantasy","action"], views: 47000, release: "2003-07-09", rating: "8.1", runtime: "2h 23m", img: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000", desc: "Eccentric pirate Jack Sparrow teams up with a blacksmith to rescue a governor's daughter from cursed pirates.", director: "Gore Verbinski", cast: ["Johnny Depp","Keira Knightley","Orlando Bloom"], language: "EN" },
    { id: 307, title: "The Mummy", subgenre: "Action Adventure", genres: ["adventure","action","fantasy"], views: 40000, release: "1999-05-07", rating: "7.1", runtime: "2h 4m", img: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000", desc: "An American adventurer and an Egyptologist accidentally awaken an ancient cursed mummy.", director: "Stephen Sommers", cast: ["Brendan Fraser","Rachel Weisz","John Hannah"], language: "EN" },
    { id: 308, title: "National Treasure", subgenre: "Treasure Hunt", genres: ["adventure","mystery","action"], views: 39000, release: "2004-11-19", rating: "6.9", runtime: "2h 11m", img: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=2000", desc: "A historian must steal the Declaration of Independence to protect a hidden treasure map.", director: "Jon Turteltaub", cast: ["Nicolas Cage","Diane Kruger","Justin Bartha"], language: "EN" },
    { id: 309, title: "Uncharted", subgenre: "Treasure Hunt", genres: ["adventure","action"], views: 35000, release: "2022-02-18", rating: "6.3", runtime: "1h 56m", img: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000", desc: "Nathan Drake and Sully race to find the greatest treasure never found, while also tracking clues to Nathan's missing brother.", director: "Ruben Fleischer", cast: ["Tom Holland","Mark Wahlberg","Antonio Banderas"], language: "EN" },
    { id: 310, title: "The Revenant", subgenre: "Survival", genres: ["adventure","drama","action"], views: 37000, release: "2015-12-25", rating: "8.0", runtime: "2h 36m", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000", desc: "A frontiersman survives a brutal bear attack and seeks revenge on the men who left him for dead.", director: "Alejandro G. Iñárritu", cast: ["Leonardo DiCaprio","Tom Hardy","Domhnall Gleeson"], language: "EN" },
    { id: 311, title: "Life of Pi", subgenre: "Survival", genres: ["adventure","drama","fantasy"], views: 33000, release: "2012-11-21", rating: "7.9", runtime: "2h 7m", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=2000", desc: "A young man survives a shipwreck and shares a lifeboat with a Bengal tiger across the Pacific.", director: "Ang Lee", cast: ["Suraj Sharma","Irrfan Khan","Adil Hussain"], language: "EN" },
    { id: 312, title: "Cast Away", subgenre: "Survival", genres: ["adventure","drama"], views: 34000, release: "2000-12-22", rating: "7.8", runtime: "2h 23m", img: "https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000", desc: "A FedEx executive is stranded on a deserted island after a plane crash and must survive alone.", director: "Robert Zemeckis", cast: ["Tom Hanks","Helen Hunt","Paul Sanchez"], language: "EN" },
    { id: 313, title: "Interstellar", subgenre: "Space Adventure", genres: ["adventure","sci-fi","drama"], views: 46000, release: "2014-11-07", rating: "8.7", runtime: "2h 49m", img: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000", desc: "A team of explorers travel through a wormhole in search of a new home for humanity.", director: "Christopher Nolan", cast: ["Matthew McConaughey","Anne Hathaway","Jessica Chastain"], language: "EN" },
    { id: 314, title: "The Martian", subgenre: "Space Adventure", genres: ["adventure","sci-fi","drama"], views: 40000, release: "2015-10-02", rating: "8.0", runtime: "2h 24m", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2000", desc: "An astronaut stranded on Mars must find a way to signal Earth that he is alive.", director: "Ridley Scott", cast: ["Matt Damon","Jessica Chastain","Kristen Wiig"], language: "EN" },
    { id: 315, title: "Mad Max: Fury Road", subgenre: "Post-Apocalyptic", genres: ["adventure","action","sci-fi"], views: 41000, release: "2015-05-15", rating: "8.1", runtime: "2h 0m", img: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000", desc: "A drifter and a rebel warrior flee a tyrant across a post-apocalyptic wasteland.", director: "George Miller", cast: ["Tom Hardy","Charlize Theron","Nicholas Hoult"], language: "EN" },
    { id: 316, title: "Avatar", subgenre: "Sci-Fi Adventure", genres: ["adventure","sci-fi","action"], views: 49000, release: "2009-12-18", rating: "7.9", runtime: "2h 42m", img: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000", desc: "A marine on Pandora falls in love with the alien world and fights to protect it from human exploitation.", director: "James Cameron", cast: ["Sam Worthington","Zoe Saldaña","Sigourney Weaver"], language: "EN" },
    { id: 317, title: "The Lord of the Rings: The Fellowship of the Ring", subgenre: "Epic Adventure", genres: ["adventure","fantasy"], views: 53000, release: "2001-12-19", rating: "8.9", runtime: "2h 58m", img: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000", desc: "A young hobbit is entrusted with an ancient ring that must be destroyed in the fires of Mount Doom.", director: "Peter Jackson", cast: ["Elijah Wood","Ian McKellen","Viggo Mortensen"], language: "EN" },
    { id: 318, title: "The Hobbit: An Unexpected Journey", subgenre: "Fantasy Adventure", genres: ["adventure","fantasy"], views: 39000, release: "2012-12-14", rating: "7.8", runtime: "2h 49m", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=2000", desc: "Bilbo Baggins is swept into a quest to reclaim the lost dwarf kingdom of Erebor from the dragon Smaug.", director: "Peter Jackson", cast: ["Martin Freeman","Ian McKellen","Richard Armitage"], language: "EN" },
    { id: 319, title: "Journey to the Center of the Earth", subgenre: "Sci-Fi Adventure", genres: ["adventure","sci-fi","family"], views: 28000, release: "2008-07-11", rating: "5.8", runtime: "1h 33m", img: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000", desc: "A scientist and his nephew descend into an Icelandic volcano and discover a lost world at Earth's core.", director: "Eric Brevig", cast: ["Brendan Fraser","Josh Hutcherson","Anita Briem"], language: "EN" },
    { id: 320, title: "The Jungle Book", subgenre: "Family Adventure", genres: ["adventure","family","fantasy"], views: 36000, release: "2016-04-15", rating: "7.4", runtime: "1h 46m", img: "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=2000", desc: "A young boy raised by wolves must leave the jungle when a tiger threatens his life.", director: "Jon Favreau", cast: ["Neel Sethi","Bill Murray","Ben Kingsley"], language: "EN" },
    { id: 321, title: "Moana", subgenre: "Animated Adventure", genres: ["adventure","animation","family"], views: 43000, release: "2016-11-23", rating: "7.6", runtime: "1h 47m", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=2000", desc: "A spirited teenager sails across the Pacific to save her island and discover her identity.", director: "Ron Clements & John Musker", cast: ["Auli'i Cravalho","Dwayne Johnson","Rachel House"], language: "EN" },
    { id: 322, title: "Up", subgenre: "Animated Adventure", genres: ["adventure","animation","family"], views: 41000, release: "2009-05-29", rating: "8.3", runtime: "1h 36m", img: "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=2000", desc: "An elderly widower flies his house to South America with a young stowaway scout.", director: "Pete Docter", cast: ["Ed Asner","Jordan Nagai","Christopher Plummer"], language: "EN" },
    { id: 323, title: "Dora and the Lost City of Gold", subgenre: "Family Adventure", genres: ["adventure","family","comedy"], views: 24000, release: "2019-08-09", rating: "6.1", runtime: "1h 42m", img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000", desc: "Dora leads her friends on an adventure to save her parents and uncover a lost Incan city.", director: "James Bobin", cast: ["Isabela Merced","Eugenio Derbez","Michael Peña"], language: "EN" },
    { id: 324, title: "Tomb Raider", subgenre: "Action Adventure", genres: ["adventure","action"], views: 31000, release: "2018-03-16", rating: "6.3", runtime: "1h 59m", img: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000", desc: "Lara Croft embarks on her first adventure to solve the mystery of her father's disappearance.", director: "Roar Uthaug", cast: ["Alicia Vikander","Dominic West","Walton Goggins"], language: "EN" },
    { id: 325, title: "The Lost City", subgenre: "Romantic Adventure", genres: ["adventure","comedy","action"], views: 29000, release: "2022-03-25", rating: "6.1", runtime: "1h 52m", img: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=2000", desc: "A romance novelist is kidnapped by a treasure hunter who believes she knows the location of a lost city.", director: "Adam & Aaron Nee", cast: ["Sandra Bullock","Channing Tatum","Daniel Radcliffe"], language: "EN" },
    { id: 326, title: "Jungle Cruise", subgenre: "Fantasy Adventure", genres: ["adventure","fantasy","comedy"], views: 30000, release: "2021-07-30", rating: "6.6", runtime: "2h 7m", img: "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000", desc: "A riverboat captain guides a scientist and her brother down the Amazon in search of a mythical tree.", director: "Jaume Collet-Serra", cast: ["Dwayne Johnson","Emily Blunt","Edgar Ramírez"], language: "EN" },
    { id: 327, title: "Everest", subgenre: "Survival", genres: ["adventure","drama","thriller"], views: 25000, release: "2015-09-18", rating: "7.1", runtime: "2h 1m", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000", desc: "Two expedition groups attempt to summit Mount Everest and are caught in a catastrophic storm.", director: "Baltasar Kormákur", cast: ["Jason Clarke","Josh Brolin","Jake Gyllenhaal"], language: "EN" },
    { id: 328, title: "Into the Wild", subgenre: "Survival", genres: ["adventure","biography","drama"], views: 32000, release: "2007-09-21", rating: "8.1", runtime: "2h 28m", img: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000", desc: "A young man abandons his possessions and hitchhikes to Alaska to live in the wilderness.", director: "Sean Penn", cast: ["Emile Hirsch","Marcia Gay Harden","William Hurt"], language: "EN" },
    { id: 329, title: "127 Hours", subgenre: "Survival", genres: ["adventure","biography","drama"], views: 26000, release: "2010-11-05", rating: "7.5", runtime: "1h 34m", img: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000", desc: "A mountain climber is trapped under a boulder in a remote Utah canyon and must free himself.", director: "Danny Boyle", cast: ["James Franco","Kate Mara","Amber Tamblyn"], language: "EN" },
    { id: 330, title: "The Adventures of Tintin", subgenre: "Animated Adventure", genres: ["adventure","animation","mystery"], views: 29000, release: "2011-12-21", rating: "7.3", runtime: "1h 47m", img: "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000", desc: "Young reporter Tintin and Captain Haddock hunt for a legendary shipwreck and hidden treasure.", director: "Steven Spielberg", cast: ["Jamie Bell","Andy Serkis","Daniel Craig"], language: "EN" }
  ];

  const HERO_IDS = [301, 303, 317, 306, 316, 315];
  const HERO_MOVIES = HERO_IDS.map(id => ADVENTURE_MOVIES.find(m => m.id === id)).filter(Boolean);

  const DIRECTORS = [
    { name: "Steven Spielberg",     films: "Raiders of the Lost Ark · Jurassic Park · Tintin", tag: "King of Adventure" },
    { name: "Peter Jackson",        films: "The Lord of the Rings · The Hobbit",              tag: "Epic World-Builder" },
    { name: "James Cameron",        films: "Avatar",                                          tag: "Pioneer of Worlds" },
    { name: "Gore Verbinski",       films: "Pirates of the Caribbean",                        tag: "Swashbuckler" },
    { name: "George Miller",        films: "Mad Max: Fury Road",                              tag: "Wasteland Auteur" },
    { name: "Ridley Scott",         films: "The Martian",                                     tag: "Space Survival" },
    { name: "Christopher Nolan",    films: "Interstellar",                                    tag: "Cosmic Voyager" },
    { name: "Alejandro G. Iñárritu",films: "The Revenant",                                    tag: "Raw Frontier" },
    { name: "Ang Lee",              films: "Life of Pi",                                      tag: "Visual Poet" },
    { name: "Jon Favreau",          films: "The Jungle Book",                                 tag: "Family Adventure" }
  ];

  function initHero() {
    HERO_MOVIES.forEach((m, i) => {
      const slide = document.createElement('div');
      slide.className = 'fh-hero__slide' + (i === 0 ? ' is-active' : '');
      slide.innerHTML = `
        <div class="fh-hero__slide-bg"><img src="${m.backdrop}" alt="${m.title}"></div>
        <div class="fh-hero__content">
          <div class="fh-hero__card">
            <span class="fh-hero__tag">${i === 0 ? 'Adventure Spotlight' : 'Featured Adventure'}</span>
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
    const items = [...ADVENTURE_MOVIES].sort((a,b) => b.views - a.views).slice(0, 14);
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
        const btn = e.target.closest('.fh-adv-sort__btn');
        if (!btn) return;
        sortWrap.querySelectorAll('.fh-adv-sort__btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        state.activeSort = btn.dataset.sort;
        renderGrid(state.activeSort);
      });
    }
  }

  function renderGrid(sortKey) {
    let list = [...ADVENTURE_MOVIES];
    if (sortKey === 'popular') list.sort((a,b) => b.views - a.views);
    else if (sortKey === 'latest') list.sort((a,b) => new Date(b.release) - new Date(a.release));
    else if (sortKey === 'rating') list.sort((a,b) => parseFloat(b.rating) - parseFloat(a.rating));
    else if (sortKey === 'az') list.sort((a,b) => a.title.localeCompare(b.title));

    gridEl.innerHTML = list.map(renderCard).join('');
    attachHandlers(gridEl);

    const cards = gridEl.querySelectorAll('.fh-adv-card');
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
      <article class="fh-adv-card" data-open="${m.id}" tabindex="0" role="button" aria-label="${m.title}">
        <span class="fh-adv-card__subgenre">${m.subgenre}</span>
        <div class="fh-adv-card__media">
          <img src="${m.img}" alt="${m.title}" loading="lazy">
          <span class="fh-adv-card__rate"><i class="fas fa-star"></i> ${m.rating}</span>
        </div>
        <div class="fh-adv-card__body">
          <h3 class="fh-adv-card__title">${m.title}</h3>
          <div class="fh-adv-card__meta">
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
        <div class="fh-adv-director-card">
          <div class="fh-adv-director-card__avatar">${initials}</div>
          <div class="fh-adv-director-card__body">
            <div class="fh-adv-director-card__name">${d.name}</div>
            <div class="fh-adv-director-card__films">${d.films}</div>
            <span class="fh-adv-director-card__tag"><i class="fas fa-compass"></i> ${d.tag}</span>
          </div>
        </div>`;
    }).join('');
    directorTrack.className = 'fh-marquee__track';
    directorTrack.innerHTML = html + html;
    directorTrack.style.animationDuration = '80s';
  }

  function openMovieDetails(movieId) {
    const m = ADVENTURE_MOVIES.find(x => x.id === movieId);
    if (!m) return;

    const related = ADVENTURE_MOVIES
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
            <span><i class="fas fa-compass"></i> ${m.subgenre}</span>
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
          <div class="fh-marquee__track" id="fhAdvDrawerRelated" style="animation:none;gap:16px;overflow-x:auto"></div>
        </div>
      </div>`;

    const rel = drawerBody.querySelector('#fhAdvDrawerRelated');
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
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function initDrawer() {
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
      return ADVENTURE_MOVIES.filter(m =>
        m.title.toLowerCase().includes(s) ||
        m.genres.some(g => g.includes(s)) ||
        m.director.toLowerCase().includes(s)
      ).slice(0, 12);
    }

    searchInput.addEventListener('focus', () => {
      openResults();
      const q = searchInput.value.trim();
      if (!q) render(ADVENTURE_MOVIES.slice(0, 6), 'popular');
      else render(query(q), q);
    });
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim();
      if (!q) { render(ADVENTURE_MOVIES.slice(0, 6), 'popular'); return; }
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
    if (sideCount) sideCount.textContent = ADVENTURE_MOVIES.length + '+';
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
      if (Array.isArray(rows) && rows.length) ADVENTURE_MOVIES = rows;
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