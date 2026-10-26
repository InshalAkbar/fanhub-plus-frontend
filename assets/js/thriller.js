(() => {
  'use strict';

  const heroSection = document.getElementById('fhThrHero');
  const heroDots = document.getElementById('fhThrHeroDots');
  const topWatchedTrack = document.getElementById('fhThrTopWatchedTrack');
  const gridEl = document.getElementById('fhThrGrid');
  const sortWrap = document.getElementById('fhThrSort');
  const directorTrack = document.getElementById('fhThrDirectorTrack');
  const drawer = document.getElementById('movieDetailDrawer');
  const drawerBody = document.getElementById('fhDrawerBody');
  const sideCountEl = document.getElementById('fhSideCount');

  const state = {
    currentHero: 0,
    heroTimer: null,
    activeSort: 'popular'
  };

  let THRILLER_MOVIES = [
    { id: 201, title: "Se7en", subgenre: "Crime Thriller", genres: ["thriller","crime","mystery"], views: 48000, release: "1995-09-22", rating: "8.6", runtime: "2h 7m", img: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=2000", desc: "Two detectives hunt a serial killer who uses the seven deadly sins as his twisted MO.", director: "David Fincher", cast: ["Brad Pitt","Morgan Freeman","Kevin Spacey"], language: "EN" },
    { id: 202, title: "The Silence of the Lambs", subgenre: "Psychological", genres: ["thriller","crime","horror"], views: 46000, release: "1991-02-14", rating: "8.6", runtime: "1h 58m", img: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?q=80&w=2000", desc: "A young FBI cadet must gain the trust of an imprisoned cannibal to catch another serial killer.", director: "Jonathan Demme", cast: ["Jodie Foster","Anthony Hopkins","Scott Glenn"], language: "EN" },
    { id: 203, title: "Gone Girl", subgenre: "Mystery Thriller", genres: ["thriller","mystery","drama"], views: 44000, release: "2014-10-03", rating: "8.1", runtime: "2h 29m", img: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000", desc: "A man becomes the prime suspect when his wife mysteriously disappears on their anniversary.", director: "David Fincher", cast: ["Ben Affleck","Rosamund Pike","Neil Patrick Harris"], language: "EN" },
    { id: 204, title: "Zodiac", subgenre: "Crime Thriller", genres: ["thriller","crime","mystery"], views: 40000, release: "2007-03-02", rating: "7.7", runtime: "2h 37m", img: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000", desc: "A cartoonist becomes obsessed with hunting down the Zodiac Killer terrorizing San Francisco.", director: "David Fincher", cast: ["Jake Gyllenhaal","Mark Ruffalo","Robert Downey Jr."], language: "EN" },
    { id: 205, title: "Prisoners", subgenre: "Crime Thriller", genres: ["thriller","crime","drama"], views: 38000, release: "2013-09-20", rating: "8.1", runtime: "2h 33m", img: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=2000", desc: "A desperate father takes the law into his own hands when his daughter goes missing.", director: "Denis Villeneuve", cast: ["Hugh Jackman","Jake Gyllenhaal","Viola Davis"], language: "EN" },
    { id: 206, title: "Sicario", subgenre: "Crime Thriller", genres: ["thriller","crime","action"], views: 36000, release: "2015-09-18", rating: "7.6", runtime: "2h 1m", img: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000", desc: "An FBI agent joins a government task force to escalate the war against drugs on the US-Mexico border.", director: "Denis Villeneuve", cast: ["Emily Blunt","Benicio del Toro","Josh Brolin"], language: "EN" },
    { id: 207, title: "Memento", subgenre: "Psychological", genres: ["thriller","mystery","suspense"], views: 42000, release: "2000-09-05", rating: "8.4", runtime: "1h 53m", img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000", desc: "A man with short-term memory loss hunts his wife's killer using tattoos and notes to track his progress.", director: "Christopher Nolan", cast: ["Guy Pearce","Carrie-Anne Moss","Joe Pantoliano"], language: "EN" },
    { id: 208, title: "The Prestige", subgenre: "Mystery Thriller", genres: ["thriller","mystery","drama"], views: 43000, release: "2006-10-20", rating: "8.5", runtime: "2h 10m", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=2000", desc: "Two rival magicians in Victorian London engage in a deadly battle to create the ultimate illusion.", director: "Christopher Nolan", cast: ["Hugh Jackman","Christian Bale","Scarlett Johansson"], language: "EN" },
    { id: 209, title: "Shutter Island", subgenre: "Psychological", genres: ["thriller","mystery","suspense"], views: 41000, release: "2010-02-19", rating: "8.2", runtime: "2h 18m", img: "https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?q=80&w=2000", desc: "A US Marshal investigates the disappearance of a patient from a remote hospital for the criminally insane.", director: "Martin Scorsese", cast: ["Leonardo DiCaprio","Mark Ruffalo","Ben Kingsley"], language: "EN" },
    { id: 210, title: "The Departed", subgenre: "Crime Thriller", genres: ["thriller","crime","drama"], views: 44000, release: "2006-10-06", rating: "8.5", runtime: "2h 31m", img: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000", desc: "An undercover cop and a mole in the police force try to identify each other in Boston's criminal underworld.", director: "Martin Scorsese", cast: ["Leonardo DiCaprio","Matt Damon","Jack Nicholson"], language: "EN" },
    { id: 211, title: "No Country for Old Men", subgenre: "Crime Thriller", genres: ["thriller","crime","drama"], views: 39000, release: "2007-11-21", rating: "8.2", runtime: "2h 2m", img: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000", desc: "A hunter stumbles on a drug deal gone wrong and finds himself hunted by a relentless killer.", director: "Joel & Ethan Coen", cast: ["Tommy Lee Jones","Javier Bardem","Josh Brolin"], language: "EN" },
    { id: 212, title: "Fargo", subgenre: "Crime Thriller", genres: ["thriller","crime","drama"], views: 35000, release: "1996-04-05", rating: "8.1", runtime: "1h 38m", img: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=2000", desc: "A pregnant police chief investigates a series of homicides in a snowy Minnesota town.", director: "Joel & Ethan Coen", cast: ["Frances McDormand","William H. Macy","Steve Buscemi"], language: "EN" },
    { id: 213, title: "Oldboy", subgenre: "Psychological", genres: ["thriller","mystery","action"], views: 38000, release: "2003-11-21", rating: "8.3", runtime: "2h 0m", img: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?q=80&w=2000", desc: "After being mysteriously imprisoned for 15 years, a man has five days to find his captor.", director: "Park Chan-wook", cast: ["Choi Min-sik","Yoo Ji-tae","Kang Hye-jung"], language: "KR" },
    { id: 214, title: "Parasite", subgenre: "Dark Thriller", genres: ["thriller","drama","crime"], views: 47000, release: "2019-05-30", rating: "8.5", runtime: "2h 12m", img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=2000", desc: "A poor family schemes to infiltrate the household of a wealthy family with unexpected consequences.", director: "Bong Joon-ho", cast: ["Song Kang-ho","Lee Sun-kyun","Cho Yeo-jeong"], language: "KR" },
    { id: 215, title: "Memories of Murder", subgenre: "Crime Thriller", genres: ["thriller","crime","drama"], views: 34000, release: "2003-05-02", rating: "8.1", runtime: "2h 12m", img: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000", desc: "Two detectives hunt Korea's first serial killer in a rural province in the late 1980s.", director: "Bong Joon-ho", cast: ["Song Kang-ho","Kim Sang-kyung","Park Hae-il"], language: "KR" },
    { id: 216, title: "Mulholland Drive", subgenre: "Psychological", genres: ["thriller","mystery","drama"], views: 30000, release: "2001-10-19", rating: "8.0", runtime: "2h 27m", img: "https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?q=80&w=2000", desc: "An amnesiac woman and an aspiring actress search for clues to her identity in Hollywood.", director: "David Lynch", cast: ["Naomi Watts","Laura Harring","Justin Theroux"], language: "EN" },
    { id: 217, title: "Blue Velvet", subgenre: "Neo-Noir", genres: ["thriller","mystery","crime"], views: 28000, release: "1986-09-19", rating: "7.7", runtime: "2h 0m", img: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000", desc: "A college student returns home and discovers a severed ear that leads him into a dark underworld.", director: "David Lynch", cast: ["Kyle MacLachlan","Isabella Rossellini","Dennis Hopper"], language: "EN" },
    { id: 218, title: "Psycho", subgenre: "Classic Thriller", genres: ["thriller","horror","mystery"], views: 37000, release: "1960-06-22", rating: "8.5", runtime: "1h 49m", img: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?q=80&w=2000", desc: "A secretary on the run checks into a remote motel run by a young man and his domineering mother.", director: "Alfred Hitchcock", cast: ["Anthony Perkins","Janet Leigh","Vera Miles"], language: "EN" },
    { id: 219, title: "Rear Window", subgenre: "Classic Thriller", genres: ["thriller","mystery","suspense"], views: 33000, release: "1954-09-01", rating: "8.5", runtime: "1h 52m", img: "https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000", desc: "A wheelchair-bound photographer spies on his neighbors and becomes convinced one has committed murder.", director: "Alfred Hitchcock", cast: ["James Stewart","Grace Kelly","Thelma Ritter"], language: "EN" },
    { id: 220, title: "Vertigo", subgenre: "Psychological", genres: ["thriller","mystery","romance"], views: 32000, release: "1958-05-09", rating: "8.3", runtime: "2h 8m", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=2000", desc: "A former detective with a fear of heights is hired to follow a mysterious woman.", director: "Alfred Hitchcock", cast: ["James Stewart","Kim Novak","Barbara Bel Geddes"], language: "EN" },
    { id: 221, title: "Nightcrawler", subgenre: "Neo-Noir", genres: ["thriller","crime","drama"], views: 35000, release: "2014-10-31", rating: "7.8", runtime: "1h 57m", img: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000", desc: "A driven freelancer enters the world of LA crime journalism, blurring the line between observer and participant.", director: "Dan Gilroy", cast: ["Jake Gyllenhaal","Rene Russo","Riz Ahmed"], language: "EN" },
    { id: 222, title: "The Usual Suspects", subgenre: "Crime Thriller", genres: ["thriller","crime","mystery"], views: 40000, release: "1995-08-16", rating: "8.5", runtime: "1h 46m", img: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000", desc: "The sole survivor of a shipyard massacre tells the twisted tale of the mysterious crime lord Keyser Söze.", director: "Bryan Singer", cast: ["Kevin Spacey","Gabriel Byrne","Chazz Palminteri"], language: "EN" },
    { id: 223, title: "Fight Club", subgenre: "Psychological", genres: ["thriller","drama","suspense"], views: 45000, release: "1999-10-15", rating: "8.8", runtime: "2h 19m", img: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000", desc: "An insomniac office worker and a soap salesman form an underground fight club that spirals out of control.", director: "David Fincher", cast: ["Brad Pitt","Edward Norton","Helena Bonham Carter"], language: "EN" },
    { id: 224, title: "Get Out", subgenre: "Horror Thriller", genres: ["thriller","horror","mystery"], views: 42000, release: "2017-02-24", rating: "7.7", runtime: "1h 44m", img: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=2000", desc: "A young man visits his girlfriend's family estate and uncovers a disturbing secret.", director: "Jordan Peele", cast: ["Daniel Kaluuya","Allison Williams","Bradley Whitford"], language: "EN" },
    { id: 225, title: "Black Swan", subgenre: "Psychological", genres: ["thriller","drama","horror"], views: 36000, release: "2010-12-03", rating: "8.0", runtime: "1h 48m", img: "https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?q=80&w=2000", desc: "A ballerina descends into madness while preparing for the lead role in Swan Lake.", director: "Darren Aronofsky", cast: ["Natalie Portman","Mila Kunis","Vincent Cassel"], language: "EN" },
    { id: 226, title: "Cape Fear", subgenre: "Psychological", genres: ["thriller","crime","drama"], views: 26000, release: "1991-11-15", rating: "7.3", runtime: "2h 8m", img: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000", desc: "A convicted rapist seeks revenge on the lawyer who defended him years earlier.", director: "Martin Scorsese", cast: ["Robert De Niro","Nick Nolte","Jessica Lange"], language: "EN" },
    { id: 227, title: "The Sixth Sense", subgenre: "Supernatural", genres: ["thriller","mystery","drama"], views: 39000, release: "1999-08-06", rating: "8.2", runtime: "1h 47m", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=2000", desc: "A child psychologist treats a young boy who can see and communicate with the dead.", director: "M. Night Shyamalan", cast: ["Bruce Willis","Haley Joel Osment","Toni Collette"], language: "EN" },
    { id: 228, title: "The Game", subgenre: "Mystery Thriller", genres: ["thriller","mystery","drama"], views: 30000, release: "1997-09-12", rating: "7.7", runtime: "2h 9m", img: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000", desc: "A wealthy banker is drawn into a mysterious live-action game that consumes his life.", director: "David Fincher", cast: ["Michael Douglas","Sean Penn","Deborah Kara Unger"], language: "EN" },
    { id: 229, title: "Identity", subgenre: "Mystery Thriller", genres: ["thriller","mystery","suspense"], views: 27000, release: "2003-04-25", rating: "7.3", runtime: "1h 30m", img: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000", desc: "Stranded travelers at a remote motel are murdered one by one, linked by a dark secret.", director: "James Mangold", cast: ["John Cusack","Ray Liotta","Amanda Peet"], language: "EN" },
    { id: 230, title: "Collateral", subgenre: "Crime Thriller", genres: ["thriller","crime","action"], views: 34000, release: "2004-08-06", rating: "7.5", runtime: "2h 0m", img: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?q=80&w=2000", desc: "A cab driver is taken hostage by a hitman who forces him to drive to each of his targets.", director: "Michael Mann", cast: ["Tom Cruise","Jamie Foxx","Jada Pinkett Smith"], language: "EN" }
  ];

  const HERO_IDS = [201, 202, 203, 205, 213, 217];
  const HERO_MOVIES = HERO_IDS.map(id => THRILLER_MOVIES.find(m => m.id === id)).filter(Boolean);

  const DIRECTORS = [
    { name: "David Fincher",     films: "Se7en · Gone Girl · Zodiac · Fight Club",  tag: "Neo-Noir Master" },
    { name: "Alfred Hitchcock",  films: "Psycho · Rear Window · Vertigo",           tag: "Master of Suspense" },
    { name: "Christopher Nolan", films: "Memento · The Prestige",                   tag: "Mind-Bending" },
    { name: "Martin Scorsese",   films: "Shutter Island · The Departed · Cape Fear",tag: "Crime Auteur" },
    { name: "Bong Joon-ho",      films: "Parasite · Memories of Murder",            tag: "Korean New Wave" },
    { name: "Denis Villeneuve",  films: "Prisoners · Sicario",                      tag: "Slow-Burn" },
    { name: "Park Chan-wook",    films: "Oldboy",                                   tag: "Revenge Cinema" },
    { name: "David Lynch",       films: "Mulholland Drive · Blue Velvet",           tag: "Surrealist" },
    { name: "Joel & Ethan Coen", films: "No Country · Fargo",                       tag: "Dark Wit" },
    { name: "Jonathan Demme",    films: "The Silence of the Lambs",                 tag: "Psychological" }
  ];

  function initHero() {
    HERO_MOVIES.forEach((m, i) => {
      const slide = document.createElement('div');
      slide.className = 'fh-hero__slide' + (i === 0 ? ' is-active' : '');
      slide.innerHTML = `
        <div class="fh-hero__slide-bg"><img src="${m.backdrop}" alt="${m.title}"></div>
        <div class="fh-hero__content">
          <div class="fh-hero__card">
            <span class="fh-hero__tag">${i === 0 ? 'Thriller Spotlight' : 'Featured Thriller'}</span>
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
    const items = [...THRILLER_MOVIES].sort((a,b) => b.views - a.views).slice(0, 14);
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
        const btn = e.target.closest('.fh-thr-sort__btn');
        if (!btn) return;
        sortWrap.querySelectorAll('.fh-thr-sort__btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        state.activeSort = btn.dataset.sort;
        renderGrid(state.activeSort);
      });
    }
  }

  function renderGrid(sortKey) {
    let list = [...THRILLER_MOVIES];
    if (sortKey === 'popular') list.sort((a,b) => b.views - a.views);
    else if (sortKey === 'latest') list.sort((a,b) => new Date(b.release) - new Date(a.release));
    else if (sortKey === 'rating') list.sort((a,b) => parseFloat(b.rating) - parseFloat(a.rating));
    else if (sortKey === 'az') list.sort((a,b) => a.title.localeCompare(b.title));

    gridEl.innerHTML = list.map(renderCard).join('');
    attachHandlers(gridEl);

    const cards = gridEl.querySelectorAll('.fh-thr-card');
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
      <article class="fh-thr-card" data-open="${m.id}" tabindex="0" role="button" aria-label="${m.title}">
        <span class="fh-thr-card__subgenre">${m.subgenre}</span>
        <div class="fh-thr-card__media">
          <img src="${m.img}" alt="${m.title}" loading="lazy">
          <span class="fh-thr-card__rate"><i class="fas fa-star"></i> ${m.rating}</span>
        </div>
        <div class="fh-thr-card__body">
          <h3 class="fh-thr-card__title">${m.title}</h3>
          <div class="fh-thr-card__meta">
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
        <div class="fh-thr-director-card">
          <div class="fh-thr-director-card__avatar">${initials}</div>
          <div class="fh-thr-director-card__body">
            <div class="fh-thr-director-card__name">${d.name}</div>
            <div class="fh-thr-director-card__films">${d.films}</div>
            <span class="fh-thr-director-card__tag"><i class="fas fa-mask"></i> ${d.tag}</span>
          </div>
        </div>`;
    }).join('');
    directorTrack.className = 'fh-marquee__track';
    directorTrack.innerHTML = html + html;
    directorTrack.style.animationDuration = '80s';
  }

  function openMovieDetails(movieId) {
    const m = THRILLER_MOVIES.find(x => x.id === movieId);
    if (!m) return;

    const related = THRILLER_MOVIES
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
            <span><i class="fas fa-mask"></i> ${m.subgenre}</span>
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
          <div class="fh-marquee__track" id="fhThrDrawerRelated" style="animation:none;gap:16px;overflow-x:auto"></div>
        </div>
      </div>`;

    const rel = drawerBody.querySelector('#fhThrDrawerRelated');
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
      return THRILLER_MOVIES.filter(m =>
        m.title.toLowerCase().includes(s) ||
        m.genres.some(g => g.includes(s)) ||
        m.director.toLowerCase().includes(s)
      ).slice(0, 12);
    }

    searchInput.addEventListener('focus', () => {
      openResults();
      const q = searchInput.value.trim();
      if (!q) render(THRILLER_MOVIES.slice(0, 6), 'popular');
      else render(query(q), q);
    });
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim();
      if (!q) { render(THRILLER_MOVIES.slice(0, 6), 'popular'); return; }
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
    if (sideCountEl) sideCountEl.textContent = THRILLER_MOVIES.length + '+';
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
      if (Array.isArray(rows) && rows.length) THRILLER_MOVIES = rows;
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