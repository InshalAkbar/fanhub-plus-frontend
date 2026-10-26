(() => {
  'use strict';

  const heroSection = document.getElementById('fhNfHero');
  const heroDots = document.getElementById('fhNfHeroDots');
  const topWatchedTrack = document.getElementById('fhNfTopWatchedTrack');
  const gridEl = document.getElementById('fhNfGrid');
  const sortWrap = document.getElementById('fhNfSort');
  const directorTrack = document.getElementById('fhNfDirectorTrack');
  const drawer = document.getElementById('movieDetailDrawer');
  const drawerBody = document.getElementById('fhDrawerBody');
  const sideCountEl = document.getElementById('fhSideCount');

  const state = {
    currentHero: 0,
    heroTimer: null,
    activeSort: 'popular'
  };

  let NF_MOVIES = [
    { id: 401, title: "Oppenheimer", subgenre: "Biopic", genres: ["non-fictional","drama","history"], views: 52000, release: "2023-07-21", rating: "8.5", runtime: "3h 0m", img: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000", desc: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.", director: "Christopher Nolan", cast: ["Cillian Murphy","Emily Blunt","Robert Downey Jr."], language: "EN" },
    { id: 402, title: "Schindler's List", subgenre: "Historical Drama", genres: ["non-fictional","drama","history","war"], views: 50000, release: "1993-12-15", rating: "9.0", runtime: "3h 15m", img: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?q=80&w=2000", desc: "In German-occupied Poland, Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution.", director: "Steven Spielberg", cast: ["Liam Neeson","Ben Kingsley","Ralph Fiennes"], language: "EN" },
    { id: 403, title: "The Social Network", subgenre: "Biopic", genres: ["non-fictional","drama","biography"], views: 47000, release: "2010-10-01", rating: "7.8", runtime: "2h 0m", img: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000", desc: "The origin story of Facebook and the legal battles that followed its creation at Harvard.", director: "David Fincher", cast: ["Jesse Eisenberg","Andrew Garfield","Justin Timberlake"], language: "EN" },
    { id: 404, title: "12 Years a Slave", subgenre: "Historical Drama", genres: ["non-fictional","drama","history","biography"], views: 44000, release: "2013-10-18", rating: "8.1", runtime: "2h 14m", img: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=2000", desc: "The true story of Solomon Northup, a free Black man kidnapped and sold into slavery in 1841.", director: "Steve McQueen", cast: ["Chiwetel Ejiofor","Michael Fassbender","Lupita Nyong'o"], language: "EN" },
    { id: 405, title: "The Wolf of Wall Street", subgenre: "Biopic", genres: ["non-fictional","biography","crime","comedy"], views: 46000, release: "2013-12-25", rating: "8.2", runtime: "3h 0m", img: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000", desc: "The rise and fall of stockbroker Jordan Belfort, whose fraudulent firm made millions in the 1990s.", director: "Martin Scorsese", cast: ["Leonardo DiCaprio","Jonah Hill","Margot Robbie"], language: "EN" },
    { id: 406, title: "Bohemian Rhapsody", subgenre: "Music Biopic", genres: ["non-fictional","biography","music","drama"], views: 43000, release: "2018-11-02", rating: "7.9", runtime: "2h 14m", img: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=2000", desc: "The story of Freddie Mercury and Queen's meteoric rise, leading to their legendary Live Aid performance.", director: "Bryan Singer", cast: ["Rami Malek","Lucy Boynton","Gwilym Lee"], language: "EN" },
    { id: 407, title: "A Beautiful Mind", subgenre: "Biopic", genres: ["non-fictional","biography","drama"], views: 41000, release: "2001-12-21", rating: "8.2", runtime: "2h 15m", img: "https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?q=80&w=2000", desc: "The story of mathematician John Nash, whose brilliant mind struggled with paranoid schizophrenia.", director: "Ron Howard", cast: ["Russell Crowe","Jennifer Connelly","Ed Harris"], language: "EN" },
    { id: 408, title: "The Imitation Game", subgenre: "Biopic", genres: ["non-fictional","biography","history","drama"], views: 45000, release: "2014-11-14", rating: "8.0", runtime: "1h 54m", img: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000", desc: "The story of Alan Turing, the mathematician who cracked the Enigma code during World War II.", director: "Morten Tyldum", cast: ["Benedict Cumberbatch","Keira Knightley","Matthew Goode"], language: "EN" },
    { id: 409, title: "Lincoln", subgenre: "Historical Drama", genres: ["non-fictional","biography","history","drama"], views: 38000, release: "2012-11-16", rating: "7.3", runtime: "2h 30m", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000", desc: "As the Civil War nears its end, President Abraham Lincoln fights for the passage of the 13th Amendment.", director: "Steven Spielberg", cast: ["Daniel Day-Lewis","Sally Field","Tommy Lee Jones"], language: "EN" },
    { id: 410, title: "Gandhi", subgenre: "Historical Epic", genres: ["non-fictional","biography","history","drama"], views: 36000, release: "1982-12-08", rating: "8.0", runtime: "3h 11m", img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=2000", desc: "The life of Mahatma Gandhi and his nonviolent struggle to free India from British rule.", director: "Richard Attenborough", cast: ["Ben Kingsley","Candice Bergen","Edward Fox"], language: "EN" },
    { id: 411, title: "The King's Speech", subgenre: "Historical Drama", genres: ["non-fictional","biography","history","drama"], views: 39000, release: "2010-11-26", rating: "8.0", runtime: "1h 58m", img: "https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?q=80&w=2000", desc: "King George VI works with an unconventional speech therapist to overcome his stammer.", director: "Tom Hooper", cast: ["Colin Firth","Geoffrey Rush","Helena Bonham Carter"], language: "EN" },
    { id: 412, title: "Spotlight", subgenre: "Journalism Drama", genres: ["non-fictional","drama","biography","crime"], views: 40000, release: "2015-11-06", rating: "8.1", runtime: "2h 9m", img: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=2000", desc: "The Boston Globe's Spotlight team investigates a systemic cover-up of child abuse within the Catholic Church.", director: "Tom McCarthy", cast: ["Mark Ruffalo","Michael Keaton","Rachel McAdams"], language: "EN" },
    { id: 413, title: "The Big Short", subgenre: "Financial Drama", genres: ["non-fictional","drama","comedy","biography"], views: 41000, release: "2015-12-11", rating: "7.8", runtime: "2h 10m", img: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000", desc: "A group of investors predict the 2008 financial crisis and bet against the housing market.", director: "Adam McKay", cast: ["Christian Bale","Steve Carell","Ryan Gosling"], language: "EN" },
    { id: 414, title: "Darkest Hour", subgenre: "Historical Drama", genres: ["non-fictional","biography","history","drama"], views: 32000, release: "2017-11-22", rating: "7.4", runtime: "2h 5m", img: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?q=80&w=2000", desc: "Winston Churchill faces a critical decision at the start of WWII: negotiate with Hitler or fight.", director: "Joe Wright", cast: ["Gary Oldman","Kristin Scott Thomas","Lily James"], language: "EN" },
    { id: 415, title: "Hidden Figures", subgenre: "Biopic", genres: ["non-fictional","biography","drama","history"], views: 38000, release: "2016-12-25", rating: "7.8", runtime: "2h 7m", img: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2000", desc: "Three African-American mathematicians at NASA help launch John Glenn into orbit during the space race.", director: "Theodore Melfi", cast: ["Taraji P. Henson","Octavia Spencer","Janelle Monáe"], language: "EN" },
    { id: 416, title: "1917", subgenre: "War Drama", genres: ["non-fictional","war","drama","history"], views: 42000, release: "2019-12-25", rating: "8.2", runtime: "1h 59m", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000", desc: "Two British soldiers race across enemy territory during WWI to deliver a message that could save 1,600 lives.", director: "Sam Mendes", cast: ["George MacKay","Dean-Charles Chapman","Mark Strong"], language: "EN" },
    { id: 417, title: "Dunkirk", subgenre: "War Drama", genres: ["non-fictional","war","history","action"], views: 43000, release: "2017-07-21", rating: "7.8", runtime: "1h 46m", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000", desc: "Allied soldiers are surrounded by the German army and evacuated from the beaches of Dunkirk.", director: "Christopher Nolan", cast: ["Fionn Whitehead","Tom Hardy","Mark Rylance"], language: "EN" },
    { id: 418, title: "Saving Private Ryan", subgenre: "War Drama", genres: ["non-fictional","war","drama","action"], views: 48000, release: "1998-07-24", rating: "8.6", runtime: "2h 49m", img: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?q=80&w=2000", desc: "A squad of US soldiers goes behind enemy lines during WWII to retrieve a paratrooper whose brothers have been killed.", director: "Steven Spielberg", cast: ["Tom Hanks","Matt Damon","Tom Sizemore"], language: "EN" },
    { id: 419, title: "American Sniper", subgenre: "War Biopic", genres: ["non-fictional","war","biography","action"], views: 37000, release: "2014-12-25", rating: "7.3", runtime: "2h 13m", img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000", desc: "The story of Navy SEAL Chris Kyle, the deadliest marksman in US military history.", director: "Clint Eastwood", cast: ["Bradley Cooper","Sienna Miller","Kyle Gallner"], language: "EN" },
    { id: 420, title: "Hotel Rwanda", subgenre: "Historical Drama", genres: ["non-fictional","history","drama","war"], views: 34000, release: "2004-12-22", rating: "8.1", runtime: "2h 1m", img: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=2000", desc: "A hotel manager shelters over a thousand refugees during the Rwandan genocide.", director: "Terry George", cast: ["Don Cheadle","Sophie Okonedo","Joaquin Phoenix"], language: "EN" },
    { id: 421, title: "The Pianist", subgenre: "Historical Drama", genres: ["non-fictional","biography","history","war"], views: 39000, release: "2002-09-25", rating: "8.5", runtime: "2h 30m", img: "https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=2000", desc: "A Polish-Jewish pianist struggles to survive the destruction of the Warsaw ghetto during WWII.", director: "Roman Polanski", cast: ["Adrien Brody","Emilia Fox","Thomas Kretschmann"], language: "EN" },
    { id: 422, title: "Milk", subgenre: "Biopic", genres: ["non-fictional","biography","drama","history"], views: 28000, release: "2008-11-26", rating: "7.5", runtime: "2h 8m", img: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000", desc: "The story of Harvey Milk, the first openly gay elected official in California, and his assassination.", director: "Gus Van Sant", cast: ["Sean Penn","Emile Hirsch","Josh Brolin"], language: "EN" },
    { id: 423, title: "Selma", subgenre: "Historical Drama", genres: ["non-fictional","history","biography","drama"], views: 30000, release: "2014-12-25", rating: "7.5", runtime: "2h 8m", img: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000", desc: "Dr. Martin Luther King Jr. leads the 1965 voting rights marches from Selma to Montgomery.", director: "Ava DuVernay", cast: ["David Oyelowo","Tom Wilkinson","Carmen Ejogo"], language: "EN" },
    { id: 424, title: "12th Fail", subgenre: "Biopic", genres: ["non-fictional","biography","drama"], views: 35000, release: "2023-10-27", rating: "8.8", runtime: "2h 27m", img: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=2000", desc: "The real story of Manoj Kumar Sharma, who rose from poverty to become an IPS officer.", director: "Vidhu Vinod Chopra", cast: ["Vikrant Massey","Medha Shankr","Anant V Joshi"], language: "HI" },
    { id: 425, title: "Apollo 13", subgenre: "Space Drama", genres: ["non-fictional","history","drama","adventure"], views: 40000, release: "1995-06-30", rating: "7.7", runtime: "2h 20m", img: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000", desc: "NASA races to bring the crew of Apollo 13 home after an explosion cripples their spacecraft.", director: "Ron Howard", cast: ["Tom Hanks","Bill Paxton","Kevin Bacon"], language: "EN" },
    { id: 426, title: "The Founder", subgenre: "Biopic", genres: ["non-fictional","biography","drama"], views: 29000, release: "2016-12-16", rating: "7.2", runtime: "1h 55m", img: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000", desc: "The story of Ray Kroc, the salesman who turned McDonald's into a global fast-food empire.", director: "John Lee Hancock", cast: ["Michael Keaton","Nick Offerman","John Carroll Lynch"], language: "EN" },
    { id: 427, title: "Ford v Ferrari", subgenre: "Sports Drama", genres: ["non-fictional","biography","drama","action"], views: 42000, release: "2019-11-15", rating: "8.1", runtime: "2h 32m", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000", desc: "American car designer Carroll Shelby and driver Ken Miles battle Ferrari at the 1966 Le Mans.", director: "James Mangold", cast: ["Matt Damon","Christian Bale","Jon Bernthal"], language: "EN" },
    { id: 428, title: "Rocketman", subgenre: "Music Biopic", genres: ["non-fictional","biography","music","drama"], views: 33000, release: "2019-05-31", rating: "7.6", runtime: "2h 1m", img: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=2000", desc: "The fantastical journey of Elton John from shy piano prodigy to international superstar.", director: "Dexter Fletcher", cast: ["Taron Egerton","Jamie Bell","Richard Madden"], language: "EN" },
    { id: 429, title: "Straight Outta Compton", subgenre: "Music Biopic", genres: ["non-fictional","biography","music","drama"], views: 37000, release: "2015-08-14", rating: "7.8", runtime: "2h 27m", img: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?q=80&w=2000", desc: "The rise and fall of the Compton rap group N.W.A., whose music sparked a cultural revolution.", director: "F. Gary Gray", cast: ["O'Shea Jackson Jr.","Corey Hawkins","Jason Mitchell"], language: "EN" },
    { id: 430, title: "The Theory of Everything", subgenre: "Biopic", genres: ["non-fictional","biography","drama","romance"], views: 31000, release: "2014-11-07", rating: "7.7", runtime: "2h 3m", img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=900", backdrop: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2000", desc: "The story of physicist Stephen Hawking's life, love, and his battle with ALS.", director: "James Marsh", cast: ["Eddie Redmayne","Felicity Jones","Charlie Cox"], language: "EN" }
  ];

  const HERO_IDS = [401, 402, 403, 404, 408, 417];
  const HERO_MOVIES = HERO_IDS.map(id => NF_MOVIES.find(m => m.id === id)).filter(Boolean);

  const DIRECTORS = [
    { name: "Steven Spielberg",     films: "Schindler's List · Lincoln · Saving Private Ryan", tag: "Historical Epic" },
    { name: "Christopher Nolan",    films: "Oppenheimer · Dunkirk",                            tag: "Precision Storyteller" },
    { name: "Martin Scorsese",      films: "The Wolf of Wall Street",                          tag: "True-Crime Chronicler" },
    { name: "Ron Howard",           films: "A Beautiful Mind · Apollo 13",                     tag: "Real-Life Dramatist" },
    { name: "Clint Eastwood",       films: "American Sniper",                                  tag: "American Stories" },
    { name: "Tom Hooper",           films: "The King's Speech",                                tag: "British Historical" },
    { name: "Adam McKay",           films: "The Big Short",                                    tag: "Financial Exposé" },
    { name: "Ava DuVernay",         films: "Selma",                                            tag: "Civil Rights Voice" },
    { name: "Morten Tyldum",        films: "The Imitation Game",                               tag: "Code-Breaking Drama" },
    { name: "Steve McQueen",        films: "12 Years a Slave",                                 tag: "Portrait of Resilience" }
  ];

  function initHero() {
    HERO_MOVIES.forEach((m, i) => {
      const slide = document.createElement('div');
      slide.className = 'fh-hero__slide' + (i === 0 ? ' is-active' : '');
      slide.innerHTML = `
        <div class="fh-hero__slide-bg"><img src="${m.backdrop}" alt="${m.title}"></div>
        <div class="fh-hero__content">
          <div class="fh-hero__card">
            <span class="fh-hero__tag">${i === 0 ? 'True Story Spotlight' : 'Featured True Story'}</span>
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
    const items = [...NF_MOVIES].sort((a,b) => b.views - a.views).slice(0, 14);
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
        const btn = e.target.closest('.fh-nf-sort__btn');
        if (!btn) return;
        sortWrap.querySelectorAll('.fh-nf-sort__btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        state.activeSort = btn.dataset.sort;
        renderGrid(state.activeSort);
      });
    }
  }

  function renderGrid(sortKey) {
    let list = [...NF_MOVIES];
    if (sortKey === 'popular') list.sort((a,b) => b.views - a.views);
    else if (sortKey === 'latest') list.sort((a,b) => new Date(b.release) - new Date(a.release));
    else if (sortKey === 'rating') list.sort((a,b) => parseFloat(b.rating) - parseFloat(a.rating));
    else if (sortKey === 'az') list.sort((a,b) => a.title.localeCompare(b.title));

    gridEl.innerHTML = list.map(renderCard).join('');
    attachHandlers(gridEl);

    const cards = gridEl.querySelectorAll('.fh-nf-card');
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
      <article class="fh-nf-card" data-open="${m.id}" tabindex="0" role="button" aria-label="${m.title}">
        <span class="fh-nf-card__subgenre">${m.subgenre}</span>
        <div class="fh-nf-card__media">
          <img src="${m.img}" alt="${m.title}" loading="lazy">
          <span class="fh-nf-card__rate"><i class="fas fa-star"></i> ${m.rating}</span>
        </div>
        <div class="fh-nf-card__body">
          <h3 class="fh-nf-card__title">${m.title}</h3>
          <div class="fh-nf-card__meta">
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
        <div class="fh-nf-director-card">
          <div class="fh-nf-director-card__avatar">${initials}</div>
          <div class="fh-nf-director-card__body">
            <div class="fh-nf-director-card__name">${d.name}</div>
            <div class="fh-nf-director-card__films">${d.films}</div>
            <span class="fh-nf-director-card__tag"><i class="fas fa-book"></i> ${d.tag}</span>
          </div>
        </div>`;
    }).join('');
    directorTrack.className = 'fh-marquee__track';
    directorTrack.innerHTML = html + html;
    directorTrack.style.animationDuration = '80s';
  }

  function openMovieDetails(movieId) {
    const m = NF_MOVIES.find(x => x.id === movieId);
    if (!m) return;

    const related = NF_MOVIES
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
            <span><i class="fas fa-book"></i> ${m.subgenre}</span>
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
          <div class="fh-marquee__track" id="fhNfDrawerRelated" style="animation:none;gap:16px;overflow-x:auto"></div>
        </div>
      </div>`;

    const rel = drawerBody.querySelector('#fhNfDrawerRelated');
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
      return NF_MOVIES.filter(m =>
        m.title.toLowerCase().includes(s) ||
        m.genres.some(g => g.includes(s)) ||
        m.director.toLowerCase().includes(s)
      ).slice(0, 12);
    }

    searchInput.addEventListener('focus', () => {
      openResults();
      const q = searchInput.value.trim();
      if (!q) render(NF_MOVIES.slice(0, 6), 'popular');
      else render(query(q), q);
    });
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim();
      if (!q) { render(NF_MOVIES.slice(0, 6), 'popular'); return; }
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
    if (sideCountEl) sideCountEl.textContent = NF_MOVIES.length + '+';
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
      if (Array.isArray(rows) && rows.length) NF_MOVIES = rows;
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