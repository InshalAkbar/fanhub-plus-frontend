(() => {
  'use strict';

  const root = document.documentElement;
  const progressBar = document.getElementById('fhProgressBar');
  const nav = document.getElementById('fhNav');
  const navPill = document.getElementById('fhNavPill');
  const navLinks = [...nav.querySelectorAll('.fh-nav__link')];
  const heroSection = document.getElementById('fanHubHero');
  const heroDots = document.getElementById('fhHeroDots');
  const trendingTrack = document.getElementById('fhTrendingTrack');
  const statsStrip = document.getElementById('fhStatsStrip');
  const genreShowcase = document.getElementById('fhGenreShowcase');
  const categorySections = document.getElementById('fhCategorySections');
  const orbitStage = document.getElementById('fhOrbitStage');
  const orbitRing = document.getElementById('fhOrbitRing');
  const orbitShuffle = document.getElementById('fhOrbitShuffle');
  const orbitHint = document.getElementById('fhOrbitHint');
  const moodChips = document.getElementById('fhMoodChips');
  const moodInput = document.getElementById('fhMoodInput');
  const moodGo = document.getElementById('fhMoodGo');
  const moodResults = document.getElementById('fhMoodResults');
  const cinematic = document.getElementById('fhCinematic');
  const magazine = document.getElementById('fhCinematicMagazine');
  const drawer = document.getElementById('movieDetailDrawer');
  const drawerBody = document.getElementById('fhDrawerBody');

  const isLowPower = (() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cores = navigator.hardwareConcurrency || 4;
    const mem = navigator.deviceMemory || 4;
    const small = window.innerWidth < 760;
    const low = reduce || cores <= 2 || mem <= 2 || small;
    if (low) root.classList.add('fh-low-power');
    return low;
  })();

  function thumb(url, width) {
    if (!url) return url;
    return url.replace(/([?&]w=)\d+/, `$1${width}`);
  }

  const state = {
    currentHero: 0,
    heroTimer: null,
    orbitRot: 0,
    orbitTarget: 0,
    orbitSpinning: false,
    orbitDragging: false,
    orbitHoverPaused: false,
    orbitDragStartX: 0,
    orbitDragStartRot: 0,
    orbitDragMoved: 0,
    orbitPicked: 0,
    moodSelected: null,
    drawerOpen: false,
    receiptDocked: false
  };

  let MOVIES = [
    { id: 1, title: "Dune: Part Two", type: "movie", genres: ["sci-fi", "action"], views: 25000, release: "2024-03-01", rating: "8.8", runtime: "2h 46m", img: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1000", desc: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.", director: "Denis Villeneuve", cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"], language: "EN", moodTags: ["adventurous","mind-bending","exciting"] },
    { id: 2, title: "Oppenheimer", type: "movie", genres: ["drama", "suspense"], views: 18000, release: "2023-07-21", rating: "8.5", runtime: "3h 0m", img: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1000", desc: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.", director: "Christopher Nolan", cast: ["Cillian Murphy", "Emily Blunt", "Robert Downey Jr."], language: "EN", moodTags: ["mind-bending","emotional"] },
    { id: 3, title: "The Batman", type: "movie", genres: ["action", "crime", "suspense"], views: 22000, release: "2022-03-04", rating: "7.8", runtime: "2h 56m", img: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=1000", desc: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption.", director: "Matt Reeves", cast: ["Robert Pattinson", "Zoë Kravitz", "Paul Dano"], language: "EN", moodTags: ["mysterious","exciting"] },
    { id: 4, title: "Interstellar", type: "movie", genres: ["sci-fi", "drama"], views: 30000, release: "2014-11-07", rating: "8.7", runtime: "2h 49m", img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000", desc: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.", director: "Christopher Nolan", cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"], language: "EN", moodTags: ["emotional","mind-bending","inspirational"] },
    { id: 5, title: "John Wick 4", type: "movie", genres: ["action", "crime"], views: 15000, release: "2023-03-24", rating: "7.7", runtime: "2h 49m", img: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=1000", desc: "John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy.", director: "Chad Stahelski", cast: ["Keanu Reeves", "Donnie Yen", "Bill Skarsgård"], language: "EN", moodTags: ["exciting"] },
    { id: 6, title: "Spirited Away", type: "movie", genres: ["anime", "fictional"], views: 28000, release: "2001-07-20", rating: "8.6", runtime: "2h 5m", img: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000", desc: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits.", director: "Hayao Miyazaki", cast: ["Rumi Hiiragi", "Miyu Irino", "Mari Natsuki"], language: "JP", moodTags: ["relaxing","adventurous","emotional"] },
    { id: 7, title: "Stranger Things", type: "tv-series", genres: ["sci-fi", "suspense"], views: 35000, release: "2016-07-15", rating: "8.7", runtime: "55m / Ep", img: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1000", desc: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.", director: "The Duffer Brothers", cast: ["Millie Bobby Brown", "Finn Wolfhard", "Winona Ryder"], language: "EN", moodTags: ["mysterious","scary"] },
    { id: 8, title: "The Witcher", type: "tv-series", genres: ["fictional", "action"], views: 20000, release: "2019-12-20", rating: "7.5", runtime: "60m / Ep", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000", desc: "Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.", director: "Lauren Schmidt Hissrich", cast: ["Henry Cavill", "Anya Chalotra", "Freya Allan"], language: "EN", moodTags: ["adventurous","exciting"] },
    { id: 9, title: "Breaking Bad", type: "tv-series", genres: ["crime", "drama"], views: 40000, release: "2008-01-20", rating: "9.5", runtime: "49m / Ep", img: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=1000", desc: "A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine to secure his family's future.", director: "Vince Gilligan", cast: ["Bryan Cranston", "Aaron Paul", "Anna Gunn"], language: "EN", moodTags: ["mind-bending","exciting"] },
    { id: 10, title: "The Last of Us", type: "tv-series", genres: ["sci-fi", "drama", "action"], views: 28000, release: "2023-01-15", rating: "8.8", runtime: "55m / Ep", img: "https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?q=80&w=1000", desc: "After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl who may be humanity's last hope.", director: "Craig Mazin", cast: ["Pedro Pascal", "Bella Ramsey", "Anna Torv"], language: "EN", moodTags: ["emotional","adventurous"] },
    { id: 11, title: "Attack on Titan", type: "tv-series", genres: ["anime", "action", "fictional"], views: 45000, release: "2013-04-07", rating: "9.0", runtime: "24m / Ep", img: "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1000", desc: "After his hometown is destroyed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.", director: "Tetsurō Araki", cast: ["Yuki Kaji", "Yui Ishikawa", "Marina Inoue"], language: "JP", moodTags: ["exciting","emotional","mind-bending"] },
    { id: 12, title: "Jujutsu Kaisen", type: "tv-series", genres: ["anime", "action", "fictional"], views: 38000, release: "2020-10-03", rating: "8.9", runtime: "24m / Ep", img: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000", desc: "A boy swallows a cursed talisman and becomes possessed by a powerful curse, leading him to join a secret organization of Jujutsu Sorcerers.", director: "Sunghoo Park", cast: ["Junya Enoki", "Yuma Uchida", "Yuichi Nakamura"], language: "JP", moodTags: ["exciting"] },
    { id: 13, title: "Demon Slayer", type: "tv-series", genres: ["anime", "fictional"], views: 32000, release: "2019-04-06", rating: "8.7", runtime: "24m / Ep", img: "https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=1000", desc: "A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon slowly.", director: "Haruo Sotozaki", cast: ["Natsuki Hanae", "Akari Kito", "Hiro Shimono"], language: "JP", moodTags: ["emotional","adventurous"] },
    { id: 14, title: "One Piece", type: "tv-series", genres: ["anime", "action", "fictional"], views: 50000, release: "1999-10-20", rating: "8.9", runtime: "24m / Ep", img: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=1000", desc: "Follows the adventures of Monkey D. Luffy and his pirate crew in order to find the greatest treasure ever left by the legendary Pirate, Gold Roger.", director: "Konosuke Uda", cast: ["Mayumi Tanaka", "Kazuya Nakai", "Akemi Okamura"], language: "JP", moodTags: ["adventurous","relaxing"] },
    { id: 15, title: "Death Note", type: "tv-series", genres: ["anime", "suspense", "crime"], views: 42000, release: "2006-10-04", rating: "8.9", runtime: "22m / Ep", img: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=1000", desc: "An intelligent high school student goes on a secret crusade to eliminate criminals from the world after discovering a notebook capable of killing anyone whose name is written into it.", director: "Tetsurō Araki", cast: ["Mamoru Miyano", "Kappei Yamaguchi", "Aya Hirano"], language: "JP", moodTags: ["mind-bending","mysterious"] },
    { id: 16, title: "Squid Game", type: "tv-series", genres: ["kdrama", "suspense", "action"], views: 48000, release: "2021-09-17", rating: "8.1", runtime: "55m / Ep", img: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=1000", desc: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games for a tempting prize, but the stakes are deadly.", director: "Hwang Dong-hyuk", cast: ["Lee Jung-jae", "Park Hae-soo", "Wi Ha-joon"], language: "KR", moodTags: ["exciting","mind-bending"] },
    { id: 17, title: "Crash Landing on You", type: "tv-series", genres: ["kdrama", "drama"], views: 25000, release: "2019-12-14", rating: "8.8", runtime: "70m / Ep", img: "https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?q=80&w=1000", desc: "A paragliding mishap drops a South Korean heiress in North Korea - and into the life of an army officer, who decides he will help her hide.", director: "Lee Jeong-hyo", cast: ["Hyun Bin", "Son Ye-jin", "Seo Ji-hye"], language: "KR", moodTags: ["romantic","emotional"] },
    { id: 18, title: "Vincenzo", type: "tv-series", genres: ["kdrama", "crime", "drama"], views: 18000, release: "2021-02-20", rating: "8.4", runtime: "80m / Ep", img: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1000", desc: "During a visit to his motherland, a Korean-Italian mafia lawyer gives an unrivaled conglomerate a taste of its own medicine with a side of justice.", director: "Kim Hee-won", cast: ["Song Joong-ki", "Jeon Yeo-been", "Ok Taec-yeon"], language: "KR", moodTags: ["exciting","funny"] },
    { id: 19, title: "The Glory", type: "tv-series", genres: ["kdrama", "suspense", "drama"], views: 22000, release: "2022-12-30", rating: "8.1", runtime: "50m / Ep", img: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=1000", desc: "A woman lives for absolute revenge against her childhood bullies who destroyed her life.", director: "Ahn Gil-ho", cast: ["Song Hye-kyo", "Lee Do-hyun", "Lim Ji-yeon"], language: "KR", moodTags: ["emotional","mysterious"] },
    { id: 20, title: "Mindhunter", type: "tv-series", genres: ["crime", "suspense", "drama"], views: 15000, release: "2017-10-13", rating: "8.6", runtime: "55m / Ep", img: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=1000", desc: "Set in the late 1970s, two FBI agents expand criminal science by delving into the psychology of murder and getting uneasily close to all-too-real monsters.", director: "David Fincher", cast: ["Jonathan Groff", "Holt McCallany", "Anna Torv"], language: "EN", moodTags: ["mysterious","mind-bending"] },
    { id: 21, title: "Peaky Blinders", type: "tv-series", genres: ["crime", "drama"], views: 26000, release: "2013-09-12", rating: "8.8", runtime: "60m / Ep", img: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1000", desc: "A gangster family epic set in 1900s England, centering on a gang who sew razor blades in the peaks of their caps, and their fierce boss Tommy Shelby.", director: "Otto Bathurst", cast: ["Cillian Murphy", "Paul Anderson", "Sophie Rundle"], language: "EN", moodTags: ["exciting","mysterious"] },
    { id: 22, title: "True Detective", type: "tv-series", genres: ["crime", "suspense"], views: 14000, release: "2014-01-12", rating: "8.9", runtime: "55m / Ep", img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000", desc: "Anthology series in which police investigations unearth the personal and professional secrets of those involved, both within and outside the law.", director: "Cary Joji Fukunaga", cast: ["Matthew McConaughey", "Woody Harrelson", "Michelle Monaghan"], language: "EN", moodTags: ["mysterious","mind-bending"] },
    { id: 23, title: "You", type: "tv-series", genres: ["crime", "suspense", "drama"], views: 17000, release: "2018-09-09", rating: "7.7", runtime: "45m / Ep", img: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1000", desc: "A dangerously charming, intensely obsessive young man goes to extreme measures to insert himself into the lives of those he is transfixed by.", director: "Greg Berlanti", cast: ["Penn Badgley", "Victoria Pedretti", "Elizabeth Lail"], language: "EN", moodTags: ["mysterious"] },
    { id: 24, title: "Money Heist", type: "tv-series", genres: ["crime", "suspense", "action"], views: 31000, release: "2017-05-02", rating: "8.2", runtime: "50m / Ep", img: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=1000", desc: "An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain.", director: "Álex Pina", cast: ["Úrsula Corberó", "Álvaro Morte", "Itziar Ituño"], language: "ES", moodTags: ["exciting"] },
    { id: 25, title: "The Mandalorian", type: "tv-series", genres: ["sci-fi", "action", "fictional"], views: 29000, release: "2019-11-12", rating: "8.7", runtime: "45m / Ep", img: "https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?q=80&w=1000", desc: "The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.", director: "Jon Favreau", cast: ["Pedro Pascal", "Giancarlo Esposito", "Carl Weathers"], language: "EN", moodTags: ["adventurous","exciting"] },
    { id: 26, title: "Westworld", type: "tv-series", genres: ["sci-fi", "drama", "suspense"], views: 16000, release: "2016-10-02", rating: "8.5", runtime: "62m / Ep", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000", desc: "At the intersection of the near future and the reimagined past, waits a world in which every human appetite can be indulged without consequence.", director: "Jonathan Nolan", cast: ["Evan Rachel Wood", "Thandiwe Newton", "Jeffrey Wright"], language: "EN", moodTags: ["mind-bending","mysterious"] },
    { id: 27, title: "Black Mirror", type: "tv-series", genres: ["sci-fi", "suspense", "drama"], views: 24000, release: "2011-12-04", rating: "8.7", runtime: "60m / Ep", img: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000", desc: "An anthology series exploring a twisted, high-tech multiverse where humanity's greatest innovations and darkest instincts collide.", director: "Charlie Brooker", cast: ["Various Actors", "Bryce Dallas Howard", "Jon Hamm"], language: "EN", moodTags: ["mind-bending","mysterious"] },
    { id: 28, title: "Deadpool & Wolverine", type: "movie", genres: ["action", "sci-fi"], views: 5000, release: "2024-07-26", rating: "N/A", runtime: "2h 7m", img: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=1000", desc: "Wolverine is recovering from his injuries when he crosses paths with the loudmouth, Deadpool. They team up to defeat a common enemy.", director: "Shawn Levy", cast: ["Ryan Reynolds", "Hugh Jackman", "Emma Corrin"], language: "EN", moodTags: ["funny","exciting"] },
    { id: 29, title: "Joker: Folie à Deux", type: "movie", genres: ["crime", "drama"], views: 3000, release: "2024-10-04", rating: "N/A", runtime: "2h 18m", img: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1000", desc: "Sequel to the 2019 film 'Joker'. Arthur Fleck is institutionalized at Arkham awaiting trial for his crimes as Joker.", director: "Todd Phillips", cast: ["Joaquin Phoenix", "Lady Gaga", "Zazie Beetz"], language: "EN", moodTags: ["emotional","mind-bending"] },
    { id: 30, title: "Gladiator II", type: "movie", genres: ["action", "drama"], views: 2000, release: "2024-11-22", rating: "N/A", runtime: "2h 28m", img: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=1000", desc: "After his home is conquered by the tyrannical emperors who now lead Rome, Lucius is forced to enter the Colosseum.", director: "Ridley Scott", cast: ["Paul Mescal", "Denzel Washington", "Pedro Pascal"], language: "EN", moodTags: ["exciting","adventurous"] }
  ];

  const HERO_MOVIES = MOVIES.filter(m => [1, 11, 16, 2, 25, 4].includes(m.id));

  const GENRES = [
    { key: "fictional",     name: "Fictional",     icon: "fa-hat-wizard",        bg: "linear-gradient(135deg,#a855f7,#6366f1)",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80" },
    { key: "non-fictional", name: "Non-Fictional", icon: "fa-book",              bg: "linear-gradient(135deg,#22d3ee,#6366f1)",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80" },
    { key: "crime",         name: "Crime",         icon: "fa-magnifying-glass",  bg: "linear-gradient(135deg,#4f46e5,#c026d3)",
      image: "https://images.unsplash.com/photo-1595590424283-b8f17842773f?auto=format&fit=crop&w=800&q=80" },
    { key: "suspense",      name: "Thriller",      icon: "fa-mask",              bg: "linear-gradient(135deg,#7c3aed,#a855f7)",
      image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=800&q=80" },
    { key: "sci-fi",        name: "Sci-Fi",        icon: "fa-satellite",         bg: "linear-gradient(135deg,#6366f1,#22d3ee)",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80" },
    { key: "action",        name: "Action",        icon: "fa-hand-fist",         bg: "linear-gradient(135deg,#ec4899,#6366f1)",
      image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=800&q=80" },
    { key: "adventure",     name: "Adventure",     icon: "fa-compass",           bg: "linear-gradient(135deg,#f59e0b,#ec4899)",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80" },
    { key: "comedy",        name: "Comedy",        icon: "fa-face-laugh",        bg: "linear-gradient(135deg,#facc15,#f97316)",
      image: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=800&q=80" },
    { key: "horror",        name: "Horror",        icon: "fa-ghost",             bg: "linear-gradient(135deg,#7f1d1d,#a855f7)",
      image: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?auto=format&fit=crop&w=800&q=80" },
    { key: "drama",         name: "Drama",         icon: "fa-masks-theater",     bg: "linear-gradient(135deg,#a855f7,#8b5cf6)",
      image: "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=800&q=80" },
    { key: "romance",       name: "Romance",       icon: "fa-heart",             bg: "linear-gradient(135deg,#ec4899,#d946ef)",
      image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80" },
    { key: "mystery",       name: "Mystery",       icon: "fa-eye",               bg: "linear-gradient(135deg,#4f46e5,#7c3aed)",
      image: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=800&q=80" }
  ];

  const MOODS = ["exciting","relaxing","funny","emotional","mysterious","scary","mind-bending","adventurous","romantic","inspirational"];

  function initNavPill() {
    if (!nav || !navPill) return;
    navLinks.forEach(link => {
      link.addEventListener('mouseenter', () => moveNavPill(link));
    });
    nav.addEventListener('mouseleave', resetNavPill);
    requestAnimationFrame(() => resetNavPill());
    window.addEventListener('resize', () => resetNavPill());
  }

  function moveNavPill(el) {
    if (!el || !el.offsetWidth || !navPill) return;
    const navRect = nav.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    navPill.style.transform = `translateX(${elRect.left - navRect.left}px)`;
    navPill.style.width = elRect.width + 'px';
  }
  function resetNavPill() {
    const active = nav.querySelector('.fh-nav__link.is-active') || nav.querySelector('.fh-nav__link');
    if (active) moveNavPill(active);
  }

  function initHero() {
    HERO_MOVIES.forEach((m, i) => {
      const slide = document.createElement('div');
      slide.className = 'fh-hero__slide' + (i === 0 ? ' is-active' : '');
      slide.innerHTML = `
        <div class="fh-hero__slide-bg"><img src="${m.img}" alt="${m.title}"></div>
        <div class="fh-hero__content">
          <div class="fh-hero__card">
            <span class="fh-hero__tag">${i === 0 ? 'Now Streaming' : 'Featured'}</span>
            <h1 class="fh-hero__title">${m.title}</h1>
            <div class="fh-hero__meta">
              <span class="fh-hero__pill fh-hero__pill--rating"><i class="fas fa-star"></i> ${m.rating}</span>
              <span class="fh-hero__pill"><i class="fas fa-calendar"></i> ${m.release.slice(0,4)}</span>
              <span class="fh-hero__pill"><i class="fas fa-clock"></i> ${m.runtime}</span>
              <span class="fh-hero__pill">${m.genres[0].toUpperCase()}</span>
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
              <button class="fh-hero__btn fh-hero__btn--primary" data-hero-open="${m.id}"><i class="fas fa-play"></i> Watch Now</button>
              <button class="fh-hero__btn fh-hero__btn--ghost" data-hero-open="${m.id}"><i class="fas fa-circle-info"></i> More Info</button>
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
      const btn = e.target.closest('[data-hero-open]');
      if (btn) openMovieDetails(Number(btn.dataset.heroOpen));
    });

    updateHeroStats(0);
    state.heroTimer = setInterval(() => showHeroSlide((state.currentHero + 1) % HERO_MOVIES.length), 6000);
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
    updateHeroStats(index);
  }

  function updateHeroStats(index) {
    const m = HERO_MOVIES[index];
    document.getElementById('fhSideTrending').textContent = '#1 This Week';
    document.getElementById('fhSideViews').textContent = (m.views/10000).toFixed(1) + 'M+';
    document.getElementById('fhSideRating').textContent = m.rating + ' / 10';
  }

  function renderMovieCard(movie) {
    return `
      <div class="fh-card" data-movie-open="${movie.id}">
        <div class="fh-card__media">
          <img src="${thumb(movie.img, 400)}" alt="${movie.title}" loading="lazy" decoding="async">
          <span class="fh-card__rating"><i class="fas fa-star"></i> ${movie.rating}</span>
          <div class="fh-card__body">
            <h3 class="fh-card__title">${movie.title}</h3>
            <div class="fh-card__meta">
              <span>${movie.genres[0].toUpperCase()}</span>
              <span>${movie.release.slice(0,4)}</span>
            </div>
          </div>
        </div>
      </div>`;
  }

  function attachMovieCardHandlers(container) {
    container.querySelectorAll('[data-movie-open]').forEach(el => {
      el.addEventListener('click', () => openMovieDetails(Number(el.dataset.movieOpen)));
    });
  }

  function openMovieDetails(movieId) {
    const m = MOVIES.find(x => x.id === movieId);
    if (!m) return;

    const related = MOVIES.filter(x => x.id !== m.id && x.genres.some(g => m.genres.includes(g))).slice(0, 5);

    drawerBody.innerHTML = `
      <div class="fh-drawer__hero">
        <img src="${m.img}" alt="${m.title}">
        <div class="fh-drawer__hero-content">
          <h1 class="fh-drawer__title" id="fhDrawerTitle">${m.title}</h1>
          <div class="fh-drawer__meta">
            <span><i class="fas fa-star" style="color:#fbbf24"></i> ${m.rating}</span>
            <span><i class="fas fa-calendar"></i> ${m.release}</span>
            <span><i class="fas fa-clock"></i> ${m.runtime}</span>
            <span><i class="fas fa-globe"></i> ${m.language}</span>
            <span>${m.genres.join(', ').toUpperCase()}</span>
          </div>
          <div class="fh-drawer__actions">
            <button class="fh-drawer__btn fh-drawer__btn--primary"><i class="fas fa-play"></i> Watch Now</button>
            <button class="fh-drawer__btn fh-drawer__btn--ghost"><i class="fas fa-film"></i> Trailer</button>
            <button class="fh-drawer__btn fh-drawer__btn--ghost"><i class="fas fa-plus"></i></button>
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
          <div class="fh-drawer__info-row"><span class="fh-drawer__info-label">Type</span><span class="fh-drawer__info-value">${m.type.replace('-', ' ')}</span></div>
          <div class="fh-drawer__info-row"><span class="fh-drawer__info-label">Language</span><span class="fh-drawer__info-value">${m.language}</span></div>
          <div class="fh-drawer__info-row"><span class="fh-drawer__info-label">Views</span><span class="fh-drawer__info-value">${m.views.toLocaleString()}</span></div>
        </div>
      </div>
      <div class="fh-drawer__content" style="grid-template-columns:1fr;padding-top:0">
        <div>
          <h3 class="fh-drawer__section-title">More Like This</h3>
          <div class="fh-row hide-scrollbar" id="fhDrawerRelated"></div>
        </div>
      </div>`;

    const relatedRow = drawerBody.querySelector('#fhDrawerRelated');
    relatedRow.innerHTML = related.map(renderMovieCard).join('');
    attachMovieCardHandlers(relatedRow);

    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    state.drawerOpen = true;
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    state.drawerOpen = false;
  }

  function initDrawer() {
    if (!drawer) return;
    drawer.querySelectorAll('[data-drawer-close]').forEach(el => el.addEventListener('click', closeDrawer));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && state.drawerOpen) closeDrawer();
    });
  }

  function initTrending() {
    if (!trendingTrack) return;
    const items = [...MOVIES].sort((a,b) => b.views - a.views).slice(0, 16);
    const html = items.map(m => `
      <div class="fh-marquee__card" data-movie-open="${m.id}">
        <img src="${thumb(m.img, 400)}" alt="${m.title}" loading="lazy" decoding="async">
        <span class="fh-marquee__rate"><i class="fas fa-star"></i> ${m.rating}</span>
        <div class="fh-marquee__body">
          <h3 class="fh-marquee__title">${m.title}</h3>
          <div class="fh-marquee__meta">
            <span>${m.type === 'movie' ? 'Movie' : 'Series'}</span>
            <span>·</span>
            <span>${m.genres[0]}</span>
          </div>
        </div>
      </div>`).join('');
    trendingTrack.className = 'fh-marquee__track';
    trendingTrack.innerHTML = html + html;
    attachMovieCardHandlers(trendingTrack);

    const marqueeWrap = trendingTrack.closest('.fh-marquee');
    if (marqueeWrap) {
      let inView = false;
      const setPaused = paused => marqueeWrap.classList.toggle('fh-marquee--paused', paused);
      new IntersectionObserver(entries => {
        inView = entries[0].isIntersecting;
        setPaused(!inView || document.hidden);
      }, { threshold: 0.01 }).observe(marqueeWrap);
      document.addEventListener('visibilitychange', () => setPaused(document.hidden || !inView));
    }
  }

  function initStats() {
    if (!statsStrip) return;
    const values = statsStrip.querySelectorAll('[data-counter]');
    const easeOut = t => 1 - Math.pow(1 - t, 3);

    const animate = el => {
      const target = parseFloat(el.dataset.counter);
      const suffix = el.dataset.suffix || '';
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const duration = 1600;
      const start = performance.now();
      function tick(now) {
        const t = Math.min(1, (now - start) / duration);
        const eased = easeOut(t);
        const val = target * eased;
        let display;
        if (decimals > 0) display = val.toFixed(decimals);
        else if (target >= 1000) display = Math.floor(val).toLocaleString();
        else display = Math.floor(val).toString();
        el.textContent = display + suffix;
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    };

    new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) values.forEach(animate);
      });
    }, { threshold: 0.3 }).observe(statsStrip);
  }

  function initGenres() {
    if (!genreShowcase) return;
    const GENRE_PAGES = {
      fictional:       'fictional.html',
      'non-fictional': 'non-fictional.html',
      crime:           'crime.html',
      suspense:        'thriller.html',
      'sci-fi':        'sci-fi.html',
      action:          'action.html',
      adventure:       'adventure.html',
      comedy:          'comedy.html',
      horror:          'horror.html',
      drama:           'drama.html',
      romance:         'romance.html',
      mystery:         'mystery.html'
    };

    genreShowcase.innerHTML = GENRES.slice(0, 8).map(g =>
      `<div class="fh-genre-card" data-genre="${g.key}" data-href="${GENRE_PAGES[g.key] || ''}" style="--fh-genre-bg:${g.bg}">
        <span class="fh-genre-card__bg" style="background-image:url('${g.image}')" aria-hidden="true"></span>
        <span class="fh-genre-card__overlay" aria-hidden="true"></span>
        <div class="fh-genre-card__icon"><i class="fas ${g.icon}"></i></div>
        <div class="fh-genre-card__bottom">
          <div class="fh-genre-card__name">${g.name}</div>
          <div class="fh-genre-card__count">${countGenre(g.key)} Titles</div>
        </div>
      </div>`
    ).join('');

    genreShowcase.querySelectorAll('[data-genre]').forEach(el => {
      el.addEventListener('click', () => {
        const href = el.dataset.href;
        if (href) window.location.href = href;
      });
    });
  }

  function countGenre(key) {
    return MOVIES.filter(m => m.genres.includes(key)).length;
  }

  function initCategories() {
    if (!categorySections) return;
    const categories = [
      { title: "Most Watched",     filter: m => true, sort: (a,b) => b.views - a.views, limit: 12 },
      { title: "Trending Now",     filter: m => true, sort: (a,b) => (b.views / (2025 - parseInt(b.release.slice(0,4)))) - (a.views / (2025 - parseInt(a.release.slice(0,4)))), limit: 12 },
      { title: "Latest Releases",  filter: m => true, sort: (a,b) => new Date(b.release) - new Date(a.release), limit: 12 },
      { title: "Popular Action",   filter: m => m.genres.includes('action'), limit: 12 },
      { title: "Crime & Thriller", filter: m => m.genres.includes('crime') || m.genres.includes('suspense'), limit: 12 },
      { title: "Sci-Fi Universe",  filter: m => m.genres.includes('sci-fi'), limit: 12 },
      { title: "Fan Favorites",    filter: m => parseFloat(m.rating) >= 8.5, limit: 12 }
    ];

    categorySections.innerHTML = categories.map(cat => {
      let list = MOVIES.filter(cat.filter);
      if (cat.sort) list.sort(cat.sort);
      list = list.slice(0, cat.limit);
      return `
        <section class="fh-section" data-reveal>
          <div class="fh-section__head">
            <h2 class="fh-section__title">${cat.title}</h2>
            <a href="#" class="fh-section__link">View All <i class="fas fa-chevron-right"></i></a>
          </div>
          <div class="fh-row hide-scrollbar">${list.map(renderMovieCard).join('')}</div>
        </section>`;
    }).join('');
    attachMovieCardHandlers(categorySections);
  }

  function initOrbit() {
    if (!orbitStage || !orbitRing) return;

    const STEP = 18;
    const COUNT = 20;
    const orbitItems = [...MOVIES].sort((a,b) => b.views - a.views).slice(0, COUNT);

    orbitRing.innerHTML = orbitItems.map((m, i) => `
      <div class="fh-orbit-card" style="--i:${i}" data-orbit-id="${m.id}" role="button" tabindex="0" aria-label="${m.title}">
        <div class="fh-orbit-card__inner">
          <img src="${thumb(m.img, 260)}" alt="${m.title}" loading="lazy" draggable="false" decoding="async">
          <span class="fh-orbit-card__rate"><i class="fas fa-star"></i> ${m.rating}</span>
          <span class="fh-orbit-card__label">${m.title}</span>
        </div>
      </div>
    `).join('');

    const cards = [...orbitRing.querySelectorAll('.fh-orbit-card')];
    const AUTO_SPEED = isLowPower ? 0 : 4.2;
    let lastTime = performance.now();
    let orbitInView = false;
    let rafId = null;

    function frame(now) {
      const dt = Math.min(64, now - lastTime) / 1000;
      lastTime = now;
      if (state.orbitSpinning) {
        state.orbitRot += (state.orbitTarget - state.orbitRot) * Math.min(1, dt * 3.4);
        if (Math.abs(state.orbitTarget - state.orbitRot) < 0.25) {
          state.orbitRot = state.orbitTarget;
          state.orbitSpinning = false;
          onSpinEnd();
        }
      } else if (!state.orbitDragging && !state.orbitHoverPaused) {
        state.orbitRot -= AUTO_SPEED * dt;
      }
      orbitRing.style.transform = `rotateY(${state.orbitRot}deg)`;
      rafId = requestAnimationFrame(frame);
    }
    function startLoop() {
      if (rafId !== null) return;
      lastTime = performance.now();
      rafId = requestAnimationFrame(frame);
    }
    function stopLoop() {
      if (rafId === null) return;
      cancelAnimationFrame(rafId);
      rafId = null;
    }

    new IntersectionObserver(entries => {
      orbitInView = entries[0].isIntersecting;
      if (orbitInView && !document.hidden) startLoop();
      else stopLoop();
    }, { threshold: 0.01 }).observe(orbitStage);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopLoop();
      else if (orbitInView) startLoop();
    });

    orbitStage.addEventListener('pointerenter', () => state.orbitHoverPaused = true);
    orbitStage.addEventListener('pointerleave', () => state.orbitHoverPaused = false);

    orbitStage.addEventListener('pointerdown', e => {
      if (state.orbitSpinning || e.button !== 0) return;
      state.orbitDragging = true;
      state.orbitDragMoved = 0;
      state.orbitDragStartX = e.clientX;
      state.orbitDragStartRot = state.orbitRot;
    });
    window.addEventListener('pointermove', e => {
      if (!state.orbitDragging) return;
      const dx = e.clientX - state.orbitDragStartX;
      state.orbitDragMoved = Math.max(state.orbitDragMoved, Math.abs(dx));
      state.orbitRot = state.orbitDragStartRot + dx * 0.3;
    });
    window.addEventListener('pointerup', () => state.orbitDragging = false);
    window.addEventListener('pointercancel', () => state.orbitDragging = false);

    cards.forEach(card => {
      card.addEventListener('click', () => {
        if (state.orbitDragMoved > 6) return;
        openMovieDetails(Number(card.dataset.orbitId));
      });
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openMovieDetails(Number(card.dataset.orbitId));
        }
      });
    });

    function onSpinEnd() {
      orbitShuffle.classList.remove('is-spinning');
      const card = cards[state.orbitPicked];
      const item = orbitItems[state.orbitPicked];
      if (!card || !item) return;
      card.classList.add('is-chosen');
      orbitHint.textContent = `✦ ${item.title} ✦`;
      setTimeout(() => {
        card.classList.remove('is-chosen');
        openMovieDetails(item.id);
      }, 850);
    }

    orbitShuffle.addEventListener('click', () => {
      if (state.orbitSpinning) return;
      const idx = Math.floor(Math.random() * cards.length);
      const desired = -idx * STEP;
      const delta = ((state.orbitRot - desired) % 360 + 360) % 360;
      state.orbitPicked = idx;
      state.orbitTarget = state.orbitRot - delta - 720;
      state.orbitSpinning = true;
      cards.forEach(c => c.classList.remove('is-chosen'));
      orbitShuffle.classList.add('is-spinning');
      orbitHint.textContent = 'Shuffling the multiverse…';
    });
  }

  function initMood() {
    if (!moodChips || !moodGo) return;
    moodChips.innerHTML = MOODS.map(m =>
      `<button class="fh-mood__chip" data-mood="${m}">${m.charAt(0).toUpperCase() + m.slice(1)}</button>`
    ).join('');
    moodChips.querySelectorAll('[data-mood]').forEach(chip => {
      chip.addEventListener('click', () => {
        moodChips.querySelectorAll('.fh-mood__chip').forEach(c => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        state.moodSelected = chip.dataset.mood;
        renderMoodResults(state.moodSelected);
      });
    });
    moodGo.addEventListener('click', () => {
      const custom = moodInput.value.trim();
      if (custom) {
        state.moodSelected = 'custom';
        renderMoodResults(custom);
      }
    });
    renderMoodResults('exciting');
  }

  function renderMoodResults(mood) {
    const keywords = (mood || '').toLowerCase().split(/\s+/).filter(Boolean);
    const scored = MOVIES.map(m => {
      let score = 0;
      const haystack = (m.title + ' ' + m.desc + ' ' + m.genres.join(' ') + ' ' + (m.moodTags || []).join(' ')).toLowerCase();
      if (m.moodTags && m.moodTags.includes(mood)) score += 10;
      keywords.forEach(k => { if (haystack.includes(k)) score += 2; });
      score += parseFloat(m.rating) || 0;
      return { m, score };
    }).sort((a,b) => b.score - a.score).slice(0, 6).map(x => x.m);

    moodResults.innerHTML = scored.map(renderMovieCard).join('');
    attachMovieCardHandlers(moodResults);
  }

  function initCinematic() {
    if (!cinematic || !magazine) return;

    const receipt = document.getElementById('fhCinematicReceipt');
    const receiptList = document.getElementById('fhReceiptList');
    const receiptGenre = document.getElementById('fhReceiptGenre');
    const receiptCount = document.getElementById('fhReceiptCount');
    const receiptTime = document.getElementById('fhReceiptTime');

    if (receiptList) {
      const topWatched = [...MOVIES].sort((a, b) => b.views - a.views).slice(0, 4);
      const times = ['20:15', '21:30', '22:45', '23:50'];
      receiptList.innerHTML = topWatched.map((m, i) =>
        `<li><span>${m.title}</span><span>${times[i] || '23:59'}</span></li>`
      ).join('');
      if (receiptCount) receiptCount.textContent = topWatched.length;

      const genreCounts = {};
      topWatched.forEach(m => m.genres.forEach(g => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      }));
      const topGenres = Object.entries(genreCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([k]) => k.toUpperCase());
      if (receiptGenre) receiptGenre.textContent = topGenres.join(' · ');
    }

    if (receiptTime) {
      const now = new Date();
      const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
      const stamp = `${String(now.getDate()).padStart(2, '0')} ${months[now.getMonth()]} ${now.getFullYear()} · ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      receiptTime.textContent = stamp;
    }

    let ticking = false;

    function update() {
      ticking = false;

      const rect = cinematic.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const scrolled = vh - rect.top;

      let magProgress = Math.max(0, Math.min(1, scrolled / (total * 0.7)));
      magProgress = magProgress * magProgress * (3 - 2 * magProgress);
      magazine.style.setProperty('--fh-mag-progress', magProgress.toFixed(3));

      let receiptProgress = Math.max(0, Math.min(1, (magProgress - 0.55) / 0.45));
      receiptProgress = receiptProgress * receiptProgress * (3 - 2 * receiptProgress);

      if (receipt && !state.receiptDocked) {
        receipt.style.setProperty('--fh-receipt-progress', receiptProgress.toFixed(3));
        receipt.style.opacity = Math.min(1, receiptProgress * 3).toFixed(3);
      }

      const scrollBottom = window.scrollY + vh;
      const docHeight = document.documentElement.scrollHeight;
      const nearBottom = scrollBottom >= docHeight - 120;

      if (nearBottom && receipt && !state.receiptDocked) {
        document.body.appendChild(receipt);
        receipt.classList.add('fh-receipt--docked');
        receipt.style.opacity = '1';
        state.receiptDocked = true;
      }
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });

    window.addEventListener('resize', update);
    update();
  }

  function applyGlobalFilter(criteria) {
    let title = 'Explore All Content';
    let list = [...MOVIES];
    if (criteria === 'latest') { list.sort((a,b) => new Date(b.release) - new Date(a.release)); title = 'Latest Releases'; }
    else if (criteria === 'upcoming') { list = list.filter(m => new Date(m.release) >= new Date('2024-01-01')); title = 'Upcoming Content'; }
    else if (criteria === 'most-viewed') { list.sort((a,b) => b.views - a.views); title = 'Most Watched'; }
    else if (criteria === 'tv-series') { list = list.filter(m => m.type === 'tv-series'); title = 'TV Series'; }
    else if (criteria === 'movie') { list = list.filter(m => m.type === 'movie'); title = 'Movies'; }
    else { list = list.filter(m => m.genres.includes(criteria)); title = criteria.charAt(0).toUpperCase() + criteria.slice(1) + ' Picks'; }

    let target = document.getElementById('fhFilteredResults');
    if (!target) {
      const sec = document.createElement('section');
      sec.className = 'fh-section';
      sec.id = 'fhFilteredResults';
      sec.innerHTML = `
        <div class="fh-section__head">
          <h2 class="fh-section__title" id="fhFilteredTitle"></h2>
          <button class="fh-section__link" id="fhFilteredClose">Clear <i class="fas fa-times"></i></button>
        </div>
        <div class="fh-row hide-scrollbar" id="fhFilteredRow"></div>`;
      categorySections.parentNode.insertBefore(sec, categorySections);
      target = sec;
      document.getElementById('fhFilteredClose').addEventListener('click', () => {
        sec.remove();
        document.querySelectorAll('.fh-nav__link').forEach(l => l.classList.remove('is-active'));
        const home = document.querySelector('.fh-nav__link');
        if (home) { home.classList.add('is-active'); moveNavPill(home); }
      });
    }
    document.getElementById('fhFilteredTitle').textContent = title;
    const row = document.getElementById('fhFilteredRow');
    row.innerHTML = list.slice(0, 20).map(renderMovieCard).join('');
    attachMovieCardHandlers(row);
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function init() {
    initNavPill();
    initHero();
    initDrawer();
    initTrending();
    initStats();
    initGenres();
    initCategories();
    initOrbit();
    initMood();
    initCinematic();
  }

  async function loadBackendCatalog() {
    try {
      if (!window.FHApi || !window.FHApi.catalog) return;
      var category = 'all';
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