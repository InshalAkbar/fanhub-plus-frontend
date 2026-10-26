(() => {
  'use strict';

  const heroSection = document.getElementById('fhCrimeHero');
  const heroDots = document.getElementById('fhCrimeHeroDots');
  const topWatchedTrack = document.getElementById('fhCrimeTopWatchedTrack');
  const gridEl = document.getElementById('fhCrimeGrid');
  const sortWrap = document.getElementById('fhCrimeSort');
  const directorTrack = document.getElementById('fhCrimeDirectorTrack');
  const drawer = document.getElementById('movieDetailDrawer');
  const drawerBody = document.getElementById('fhDrawerBody');
  const sideCountEl = document.getElementById('fhSideCount');

  const state = { currentHero: 0, heroTimer: null, activeSort: 'popular' };

  const BLANK_IMG = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  const FALLBACK_POSTER = BLANK_IMG;
  const FALLBACK_BACKDROP = BLANK_IMG;

  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const initials = (name) => String(name || '?')
    .trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();

  const yearOf = (m) => (m.release || '').slice(0, 4) || '—';
  const badgeFor = (m) => (m.views >= 55000 ? '4K' : m.views >= 38000 ? 'HD' : 'NEW');

  const avatarHTML = (person, cls) => {
    const img = person && person.img ? person.img : '';
    const init = esc(initials(person && person.name));
    if (img) {
      return `<div class="${cls} ${cls}--photo"><img src="${esc(img)}" alt="${esc(person.name)}" loading="lazy"
        onerror="this.onerror=null;this.parentNode.classList.remove('${cls}--photo');this.parentNode.innerHTML='${init}';" /></div>`;
    }
    return `<div class="${cls}">${init}</div>`;
  };

  let CRIME_MOVIES = [
    { id: 801, title: "The Godfather", subgenre: "Mob Epic", genres: ["crime","drama"], views: 62000, release: "1972-03-24", rating: "9.2", runtime: "2h 55m",
      img: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
      desc: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
      director: "Francis Ford Coppola",
      cast: [
        { name: "Marlon Brando", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Marlon_Brando_%281961%29.jpg/440px-Marlon_Brando_%281961%29.jpg" },
        { name: "Al Pacino", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Al_Pacino_2016_%28cropped%29.jpg/440px-Al_Pacino_2016_%28cropped%29.jpg" },
        { name: "James Caan", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/James_Caan_2011.jpg/440px-James_Caan_2011.jpg" }
      ],
      language: "EN" },
    { id: 802, title: "The Godfather Part II", subgenre: "Mob Epic", genres: ["crime","drama"], views: 58000, release: "1974-12-18", rating: "9.0", runtime: "3h 22m",
      img: "https://image.tmdb.org/t/p/w500/hebD2QyM3g4cNLDGDkY5rp6eLRo.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/kGzF6BBtW8hN6pVv8rXbPmkQ4vQ.jpg",
      desc: "The early life and career of Vito Corleone in 1920s New York City is portrayed, while his son Michael expands and tightens his grip on the family crime syndicate.",
      director: "Francis Ford Coppola",
      cast: [
        { name: "Al Pacino", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Al_Pacino_2016_%28cropped%29.jpg/440px-Al_Pacino_2016_%28cropped%29.jpg" },
        { name: "Robert De Niro", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Robert_De_Niro_Cannes_2016.jpg/440px-Robert_De_Niro_Cannes_2016.jpg" },
        { name: "Robert Duvall", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Robert_Duvall_2014_%28cropped%29.jpg/440px-Robert_Duvall_2014_%28cropped%29.jpg" }
      ],
      language: "EN" },
    { id: 803, title: "Pulp Fiction", subgenre: "Neo-Noir", genres: ["crime","drama","suspense"], views: 60000, release: "1994-09-10", rating: "8.9", runtime: "2h 34m",
      img: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
      desc: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
      director: "Quentin Tarantino",
      cast: [
        { name: "John Travolta", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/John_Travolta_%28cropped%29.jpg/440px-John_Travolta_%28cropped%29.jpg" },
        { name: "Samuel L. Jackson", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Samuel_L._Jackson_2019_%28cropped%29.jpg/440px-Samuel_L._Jackson_2019_%28cropped%29.jpg" },
        { name: "Uma Thurman", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Uma_Thurman_Cannes_2017_%28cropped%29.jpg/440px-Uma_Thurman_Cannes_2017_%28cropped%29.jpg" }
      ],
      language: "EN" },
    { id: 804, title: "Goodfellas", subgenre: "Mob Drama", genres: ["crime","drama"], views: 56000, release: "1990-09-19", rating: "8.7", runtime: "2h 25m",
      img: "https://image.tmdb.org/t/p/w500/aKuTxEA3X8vOsWVrezqoFOn4Rps.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/sw7mordbZxgITU877yTpZCud90M.jpg",
      desc: "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito.",
      director: "Martin Scorsese",
      cast: [
        { name: "Robert De Niro", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Robert_De_Niro_Cannes_2016.jpg/440px-Robert_De_Niro_Cannes_2016.jpg" },
        { name: "Ray Liotta", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Ray_Liotta_2014_%28cropped%29.jpg/440px-Ray_Liotta_2014_%28cropped%29.jpg" },
        { name: "Joe Pesci", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Joe_Pesci_2019_%28cropped%29.jpg/440px-Joe_Pesci_2019_%28cropped%29.jpg" }
      ],
      language: "EN" },
    { id: 805, title: "The Dark Knight", subgenre: "Crime Thriller", genres: ["crime","action","drama"], views: 64000, release: "2008-07-18", rating: "9.0", runtime: "2h 32m",
      img: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
      desc: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      director: "Christopher Nolan",
      cast: [
        { name: "Christian Bale", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Christian_Bale_2019_%28cropped%29.jpg/440px-Christian_Bale_2019_%28cropped%29.jpg" },
        { name: "Heath Ledger", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Heath_Ledger_%28cropped%29.jpg/440px-Heath_Ledger_%28cropped%29.jpg" },
        { name: "Aaron Eckhart", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Aaron_Eckhart_2019_%28cropped%29.jpg/440px-Aaron_Eckhart_2019_%28cropped%29.jpg" }
      ],
      language: "EN" },
    { id: 806, title: "Scarface", subgenre: "Mob Epic", genres: ["crime","drama"], views: 52000, release: "1983-12-09", rating: "8.3", runtime: "2h 50m",
      img: "https://image.tmdb.org/t/p/w500/aRuE2vaj6UxrHmLtqvr9WtBFhWt.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/4RAH1aOSF1RD4MbtAjN9wQpZ9vQ.jpg",
      desc: "In 1980 Miami, a determined Cuban immigrant takes over a drug cartel and succumbs to greed.",
      director: "Brian De Palma",
      cast: [
        { name: "Al Pacino", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Al_Pacino_2016_%28cropped%29.jpg/440px-Al_Pacino_2016_%28cropped%29.jpg" },
        { name: "Michelle Pfeiffer", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Michelle_Pfeiffer_2018_%28cropped%29.jpg/440px-Michelle_Pfeiffer_2018_%28cropped%29.jpg" },
        { name: "Steven Bauer", img: "" }
      ],
      language: "EN" },
    { id: 807, title: "The Departed", subgenre: "Crime Thriller", genres: ["crime","suspense","drama"], views: 50000, release: "2006-10-06", rating: "8.5", runtime: "2h 31m",
      img: "https://image.tmdb.org/t/p/w500/nT97ifVT2J1yMQmeq20Qblg61T.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/6WRrGYalXXveItfpnipYdayFkQB.jpg",
      desc: "An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston.",
      director: "Martin Scorsese",
      cast: [
        { name: "Leonardo DiCaprio", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Leonardo_DiCaprio_2014_%28cropped%29.jpg/440px-Leonardo_DiCaprio_2014_%28cropped%29.jpg" },
        { name: "Matt Damon", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Matt_Damon_2019_%28cropped%29.jpg/440px-Matt_Damon_2019_%28cropped%29.jpg" },
        { name: "Jack Nicholson", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Jack_Nicholson_2001_%28cropped%29.jpg/440px-Jack_Nicholson_2001_%28cropped%29.jpg" }
      ],
      language: "EN" },
    { id: 808, title: "The Silence of the Lambs", subgenre: "Psychological Crime", genres: ["crime","suspense","horror"], views: 48000, release: "1991-02-14", rating: "8.6", runtime: "1h 58m",
      img: "https://image.tmdb.org/t/p/w500/uS9mAkztAwPnsUlHDEbzLTGPJRg.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/6t7Am4FvOfzFtsRzS5ZLo3Q9eoT.jpg",
      desc: "A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer, a madman who skins his victims.",
      director: "Jonathan Demme",
      cast: [
        { name: "Jodie Foster", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Jodie_Foster_2011_%28cropped%29.jpg/440px-Jodie_Foster_2011_%28cropped%29.jpg" },
        { name: "Anthony Hopkins", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Anthony_Hopkins_2019_%28cropped%29.jpg/440px-Anthony_Hopkins_2019_%28cropped%29.jpg" },
        { name: "Scott Glenn", img: "" }
      ],
      language: "EN" },
    { id: 809, title: "Heat", subgenre: "Neo-Noir", genres: ["crime","suspense","action"], views: 46000, release: "1995-12-15", rating: "8.3", runtime: "2h 50m",
      img: "https://image.tmdb.org/t/p/w500/umSVjVHbGViOopWncg9s6RZppnF.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/iB64vpL3dIObOtMZgX3RqdVdQDc.jpg",
      desc: "A group of high-end professional thieves start to feel the heat from the LAPD when they unknowingly leave a clue at their latest heist.",
      director: "Michael Mann",
      cast: [
        { name: "Al Pacino", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Al_Pacino_2016_%28cropped%29.jpg/440px-Al_Pacino_2016_%28cropped%29.jpg" },
        { name: "Robert De Niro", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Robert_De_Niro_Cannes_2016.jpg/440px-Robert_De_Niro_Cannes_2016.jpg" },
        { name: "Val Kilmer", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Val_Kilmer_2005_%28cropped%29.jpg/440px-Val_Kilmer_2005_%28cropped%29.jpg" }
      ],
      language: "EN" },
    { id: 810, title: "Se7en", subgenre: "Serial Killer", genres: ["crime","suspense","mystery"], views: 47000, release: "1995-09-22", rating: "8.6", runtime: "2h 7m",
      img: "https://image.tmdb.org/t/p/w500/6yoghtyTpznpBik8EngEmJskVUO.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/ba4uz7wPUVK4Nw4YXqB7wUDbdHf.jpg",
      desc: "Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his motives.",
      director: "David Fincher",
      cast: [
        { name: "Brad Pitt", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Brad_Pitt_2019_by_Glenn_Francis.jpg/440px-Brad_Pitt_2019_by_Glenn_Francis.jpg" },
        { name: "Morgan Freeman", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Morgan_Freeman_Deauville_2018_%28cropped%29.jpg/440px-Morgan_Freeman_Deauville_2018_%28cropped%29.jpg" },
        { name: "Kevin Spacey", img: "" }
      ],
      language: "EN" },
    { id: 811, title: "Léon: The Professional", subgenre: "Hitman Drama", genres: ["crime","action","drama"], views: 45000, release: "1994-11-18", rating: "8.5", runtime: "1h 50m",
      img: "https://image.tmdb.org/t/p/w500/yI6X2cCM5YPJtxMhUd3dPGqDAhw.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/jRJrQ72VLyEnVsvwfep8Xjlvu8c.jpg",
      desc: "12-year-old Mathilda is reluctantly taken in by Léon, a professional assassin, after her family is murdered. An unusual relationship forms as she becomes his protégée and learns the assassin's trade.",
      director: "Luc Besson",
      cast: [
        { name: "Jean Reno", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Jean_Reno_2012_%28cropped%29.jpg/440px-Jean_Reno_2012_%28cropped%29.jpg" },
        { name: "Natalie Portman", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Natalie_Portman_2019_%28cropped%29.jpg/440px-Natalie_Portman_2019_%28cropped%29.jpg" },
        { name: "Gary Oldman", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Gary_Oldman_2014_%28cropped%29.jpg/440px-Gary_Oldman_2014_%28cropped%29.jpg" }
      ],
      language: "EN" },
    { id: 812, title: "Reservoir Dogs", subgenre: "Heist", genres: ["crime","suspense"], views: 42000, release: "1992-10-23", rating: "8.3", runtime: "1h 39m",
      img: "https://image.tmdb.org/t/p/w500/xi8Iu6qyTfyZVDaNL0CUqJw7mbc.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/jk68cPcLFvP8fHlZ0tV8rKRPqUv.jpg",
      desc: "When a simple jewelry heist goes horribly wrong, the surviving criminals begin to suspect that one of them is a police informant.",
      director: "Quentin Tarantino",
      cast: [
        { name: "Harvey Keitel", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Harvey_Keitel_2015_%28cropped%29.jpg/440px-Harvey_Keitel_2015_%28cropped%29.jpg" },
        { name: "Tim Roth", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Tim_Roth_2019_%28cropped%29.jpg/440px-Tim_Roth_2019_%28cropped%29.jpg" },
        { name: "Steve Buscemi", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Steve_Buscemi_2018_%28cropped%29.jpg/440px-Steve_Buscemi_2018_%28cropped%29.jpg" }
      ],
      language: "EN" },
    { id: 813, title: "Fargo", subgenre: "Coen Crime", genres: ["crime","suspense","drama"], views: 43000, release: "1996-04-05", rating: "8.1", runtime: "1h 38m",
      img: "https://image.tmdb.org/t/p/w500/rtGfep5sSXYtSlXdqEwRIAcBKmS.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/eBpxIhxVt9lMDvSzmCPDfkXFc9s.jpg",
      desc: "Jerry Lundegaard's inept crime falls apart due to his and his henchmen's bungling and the persistent police work of the quite pregnant Marge Gunderson.",
      director: "Joel & Ethan Coen",
      cast: [
        { name: "Frances McDormand", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Frances_McDormand_2015_%28cropped%29.jpg/440px-Frances_McDormand_2015_%28cropped%29.jpg" },
        { name: "William H. Macy", img: "" },
        { name: "Steve Buscemi", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Steve_Buscemi_2018_%28cropped%29.jpg/440px-Steve_Buscemi_2018_%28cropped%29.jpg" }
      ],
      language: "EN" },
    { id: 814, title: "No Country for Old Men", subgenre: "Neo-Western", genres: ["crime","suspense","drama"], views: 44000, release: "2007-11-21", rating: "8.2", runtime: "2h 2m",
      img: "https://image.tmdb.org/t/p/w500/bj1v4QCyvPKZ5U0eqdw6RdD9NRb.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/6wPjxvh6EOyB4rL9dUmZQ1bT3Ka.jpg",
      desc: "Violence and mayhem ensue after a hunter stumbles upon a drug deal gone wrong and more than two million dollars in cash near the Rio Grande.",
      director: "Joel & Ethan Coen",
      cast: [
        { name: "Tommy Lee Jones", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Tommy_Lee_Jones_2017_%28cropped%29.jpg/440px-Tommy_Lee_Jones_2017_%28cropped%29.jpg" },
        { name: "Javier Bardem", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Javier_Bardem_2018_%28cropped%29.jpg/440px-Javier_Bardem_2018_%28cropped%29.jpg" },
        { name: "Josh Brolin", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Josh_Brolin_2014_%28cropped%29.jpg/440px-Josh_Brolin_2014_%28cropped%29.jpg" }
      ],
      language: "EN" },
    { id: 815, title: "Sicario", subgenre: "Cartel Thriller", genres: ["crime","action","suspense"], views: 41000, release: "2015-09-18", rating: "7.6", runtime: "2h 1m",
      img: "https://image.tmdb.org/t/p/w500/lz8vNyXeidqqOdJW9ZjnbW5SV07.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/oJ4Vv7XKZ0pZ5nVK3X3dHnH8p7K.jpg",
      desc: "An idealistic FBI agent is enlisted by a government task force to aid in the escalating war against drugs at the border area between the U.S. and Mexico.",
      director: "Denis Villeneuve",
      cast: [
        { name: "Emily Blunt", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Emily_Blunt_2018_%28cropped%29.jpg/440px-Emily_Blunt_2018_%28cropped%29.jpg" },
        { name: "Benicio del Toro", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Benicio_del_Toro_2014_%28cropped%29.jpg/440px-Benicio_del_Toro_2014_%28cropped%29.jpg" },
        { name: "Josh Brolin", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Josh_Brolin_2014_%28cropped%29.jpg/440px-Josh_Brolin_2014_%28cropped%29.jpg" }
      ],
      language: "EN" },
    { id: 816, title: "The Usual Suspects", subgenre: "Mystery Crime", genres: ["crime","mystery","suspense"], views: 43000, release: "1995-08-16", rating: "8.5", runtime: "1h 46m",
      img: "https://image.tmdb.org/t/p/w500/bUPtFg5T75EzQcptsKAew8rigjc.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/gFZriCkpJYsApPZEF3jhxL4yLzG.jpg",
      desc: "A sole survivor tells of the twisty events leading up to a horrific gun battle on a boat, which began when five criminals met at a seemingly random police lineup.",
      director: "Bryan Singer",
      cast: [
        { name: "Kevin Spacey", img: "" },
        { name: "Gabriel Byrne", img: "" },
        { name: "Benicio del Toro", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Benicio_del_Toro_2014_%28cropped%29.jpg/440px-Benicio_del_Toro_2014_%28cropped%29.jpg" }
      ],
      language: "EN" },
    { id: 817, title: "Casino", subgenre: "Mob Drama", genres: ["crime","drama"], views: 40000, release: "1995-11-22", rating: "8.2", runtime: "2h 58m",
      img: "https://image.tmdb.org/t/p/w500/gO8yRhOHmRjJXqYUYQ2cBU7kYoz.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/3Y1m0P5x8Wh0nK2c9t2rI8Xw3yV.jpg",
      desc: "A tale of greed, deception, money, power, and murder occur between two best friends: a mafia enforcer and a casino executive compete against each other over a gambling empire and a fast-living socialite.",
      director: "Martin Scorsese",
      cast: [
        { name: "Robert De Niro", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Robert_De_Niro_Cannes_2016.jpg/440px-Robert_De_Niro_Cannes_2016.jpg" },
        { name: "Sharon Stone", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Sharon_Stone_2019_%28cropped%29.jpg/440px-Sharon_Stone_2019_%28cropped%29.jpg" },
        { name: "Joe Pesci", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Joe_Pesci_2019_%28cropped%29.jpg/440px-Joe_Pesci_2019_%28cropped%29.jpg" }
      ],
      language: "EN" },
    { id: 818, title: "The Irishman", subgenre: "Mob Epic", genres: ["crime","drama"], views: 39000, release: "2019-11-27", rating: "7.8", runtime: "3h 29m",
      img: "https://image.tmdb.org/t/p/w500/mbm8k3GFhXS0ROd9AD1gqYbIFbM.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/1R6cvRtZgsYCkh8UFuWFN33xBP4.jpg",
      desc: "An aging hitman recalls his time with the mob and the disappearance of his friend Jimmy Hoffa.",
      director: "Martin Scorsese",
      cast: [
        { name: "Robert De Niro", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Robert_De_Niro_Cannes_2016.jpg/440px-Robert_De_Niro_Cannes_2016.jpg" },
        { name: "Al Pacino", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Al_Pacino_2016_%28cropped%29.jpg/440px-Al_Pacino_2016_%28cropped%29.jpg" },
        { name: "Joe Pesci", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Joe_Pesci_2019_%28cropped%29.jpg/440px-Joe_Pesci_2019_%28cropped%29.jpg" }
      ],
      language: "EN" },
    { id: 819, title: "Ocean's Eleven", subgenre: "Heist", genres: ["crime","comedy","action"], views: 38000, release: "2001-12-07", rating: "7.7", runtime: "1h 56m",
      img: "https://image.tmdb.org/t/p/w500/o0hOIUZmbJDLguK0F7WnOEB6k4T.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/hn1xWSiUvHYFvQ0x5TqfIhJ7Rxf.jpg",
      desc: "Danny Ocean and his eleven accomplices plan to rob three Las Vegas casinos simultaneously on the same night.",
      director: "Steven Soderbergh",
      cast: [
        { name: "George Clooney", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/George_Clooney_2016.jpg/440px-George_Clooney_2016.jpg" },
        { name: "Brad Pitt", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Brad_Pitt_2019_by_Glenn_Francis.jpg/440px-Brad_Pitt_2019_by_Glenn_Francis.jpg" },
        { name: "Julia Roberts", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Julia_Roberts_2011_%28cropped%29.jpg/440px-Julia_Roberts_2011_%28cropped%29.jpg" }
      ],
      language: "EN" },
    { id: 820, title: "Nightcrawler", subgenre: "Neo-Noir", genres: ["crime","suspense","drama"], views: 36000, release: "2014-10-31", rating: "7.8", runtime: "1h 57m",
      img: "https://image.tmdb.org/t/p/w500/j9HrX8fBo4kxjQ0AhGYsVGmYrQv.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/6RotjD3XsxqQF1gUbUx1T5qJZQE.jpg",
      desc: "A petty thief desperate for work muscles into the world of L.A. crime journalism, blurring the line between observer and participant.",
      director: "Dan Gilroy",
      cast: [
        { name: "Jake Gyllenhaal", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Jake_Gyllenhaal_2019_%28cropped%29.jpg/440px-Jake_Gyllenhaal_2019_%28cropped%29.jpg" },
        { name: "Rene Russo", img: "" },
        { name: "Riz Ahmed", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Riz_Ahmed_2019_%28cropped%29.jpg/440px-Riz_Ahmed_2019_%28cropped%29.jpg" }
      ],
      language: "EN" },
    { id: 821, title: "Gone Girl", subgenre: "Psychological Crime", genres: ["crime","mystery","suspense"], views: 37000, release: "2014-10-03", rating: "8.1", runtime: "2h 29m",
      img: "https://image.tmdb.org/t/p/w500/fSRb7vyIP8rQpL0I47P3qUsEKX3.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/xW2P4pNlq4N9c1pMFqLdZRZ0cRt.jpg",
      desc: "With his wife's disappearance having become the focus of an intense media circus, a man sees the spotlight turned on him when it's suspected that he may not be innocent.",
      director: "David Fincher",
      cast: [
        { name: "Ben Affleck", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Ben_Affleck_2019_%28cropped%29.jpg/440px-Ben_Affleck_2019_%28cropped%29.jpg" },
        { name: "Rosamund Pike", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Rosamund_Pike_2018_%28cropped%29.jpg/440px-Rosamund_Pike_2018_%28cropped%29.jpg" },
        { name: "Neil Patrick Harris", img: "" }
      ],
      language: "EN" },
    { id: 822, title: "Zodiac", subgenre: "Serial Killer", genres: ["crime","mystery","suspense"], views: 34000, release: "2007-03-02", rating: "7.7", runtime: "2h 37m",
      img: "https://image.tmdb.org/t/p/w500/6YmeO4pB7XTh8P8F960O1uA14JO.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/zXhk3x3O4r9pKqM0nH8V0t6vL2Y.jpg",
      desc: "Between 1968 and 1983, a San Francisco cartoonist becomes an amateur detective obsessed with tracking down the Zodiac Killer.",
      director: "David Fincher",
      cast: [
        { name: "Jake Gyllenhaal", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Jake_Gyllenhaal_2019_%28cropped%29.jpg/440px-Jake_Gyllenhaal_2019_%28cropped%29.jpg" },
        { name: "Mark Ruffalo", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Mark_Ruffalo_2019_%28cropped%29.jpg/440px-Mark_Ruffalo_2019_%28cropped%29.jpg" },
        { name: "Robert Downey Jr.", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg/440px-Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg" }
      ],
      language: "EN" },
    { id: 823, title: "Prisoners", subgenre: "Psychological Crime", genres: ["crime","mystery","suspense"], views: 35000, release: "2013-09-20", rating: "8.1", runtime: "2h 33m",
      img: "https://image.tmdb.org/t/p/w500/uhdQmNMj9GnM3JwtfC1Gm8q9kxj.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/uH8Z0aQz2mQ1s3X0hT8cR5eFgXy.jpg",
      desc: "When his daughter and her friend go missing, a desperate father takes matters into his own hands as the police pursue multiple leads.",
      director: "Denis Villeneuve",
      cast: [
        { name: "Hugh Jackman", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Hugh_Jackman_2017_%28cropped%29.jpg/440px-Hugh_Jackman_2017_%28cropped%29.jpg" },
        { name: "Jake Gyllenhaal", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Jake_Gyllenhaal_2019_%28cropped%29.jpg/440px-Jake_Gyllenhaal_2019_%28cropped%29.jpg" },
        { name: "Viola Davis", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Viola_Davis_2016_%28cropped%29.jpg/440px-Viola_Davis_2016_%28cropped%29.jpg" }
      ],
      language: "EN" },
    { id: 824, title: "L.A. Confidential", subgenre: "Neo-Noir", genres: ["crime","drama","mystery"], views: 33000, release: "1997-09-19", rating: "8.2", runtime: "2h 18m",
      img: "https://image.tmdb.org/t/p/w500/lWCgf5sT4BqJ8Gk9LmNpOqRsTuV.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/vH8Z0aQz2mQ1s3X0hT8cR5eFgXy.jpg",
      desc: "As corruption grows in 1950s Los Angeles, three policemen — with drastically different methods — investigate a series of murders.",
      director: "Curtis Hanson",
      cast: [
        { name: "Russell Crowe", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Russell_Crowe_2017_%28cropped%29.jpg/440px-Russell_Crowe_2017_%28cropped%29.jpg" },
        { name: "Guy Pearce", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Guy_Pearce_2018_%28cropped%29.jpg/440px-Guy_Pearce_2018_%28cropped%29.jpg" },
        { name: "Kevin Spacey", img: "" }
      ],
      language: "EN" },
    { id: 825, title: "The Untouchables", subgenre: "Gangster Epic", genres: ["crime","drama","suspense"], views: 31000, release: "1987-06-03", rating: "7.9", runtime: "1h 59m",
      img: "https://image.tmdb.org/t/p/w500/tPqG8gKjtg8p9hBBtUZlXl8pJkY.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/wH8Z0aQz2mQ1s3X0hT8cR5eFgXy.jpg",
      desc: "During Prohibition, Treasury agent Eliot Ness assembles a small, hand-picked team to bring down Al Capone and his criminal empire.",
      director: "Brian De Palma",
      cast: [
        { name: "Kevin Costner", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Kevin_Costner_2016_%28cropped%29.jpg/440px-Kevin_Costner_2016_%28cropped%29.jpg" },
        { name: "Sean Connery", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Sean_Connery_2008_%28cropped%29.jpg/440px-Sean_Connery_2008_%28cropped%29.jpg" },
        { name: "Robert De Niro", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Robert_De_Niro_Cannes_2016.jpg/440px-Robert_De_Niro_Cannes_2016.jpg" }
      ],
      language: "EN" },
    { id: 826, title: "American Gangster", subgenre: "Gangster Epic", genres: ["crime","drama"], views: 32000, release: "2007-11-02", rating: "7.8", runtime: "2h 37m",
      img: "https://image.tmdb.org/t/p/w500/sX9idXDqRUxE5M43Q4o8rNCY5ga.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/xH8Z0aQz2mQ1s3X0hT8cR5eFgXy.jpg",
      desc: "An outcast New York City cop is charged with bringing down Harlem drug lord Frank Lucas, whose real life inspired this tale.",
      director: "Ridley Scott",
      cast: [
        { name: "Denzel Washington", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Denzel_Washington_2018_%28cropped%29.jpg/440px-Denzel_Washington_2018_%28cropped%29.jpg" },
        { name: "Russell Crowe", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Russell_Crowe_2017_%28cropped%29.jpg/440px-Russell_Crowe_2017_%28cropped%29.jpg" },
        { name: "Chiwetel Ejiofor", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Chiwetel_Ejiofor_2015_%28cropped%29.jpg/440px-Chiwetel_Ejiofor_2015_%28cropped%29.jpg" }
      ],
      language: "EN" },
    { id: 827, title: "Training Day", subgenre: "Corrupt Cop", genres: ["crime","action","drama"], views: 31000, release: "2001-10-05", rating: "7.7", runtime: "2h 2m",
      img: "https://image.tmdb.org/t/p/w500/bUeC2zwLqEBprDcNSLTDoJlNRTu.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/yH8Z0aQz2mQ1s3X0hT8cR5eFgXy.jpg",
      desc: "A rookie cop spends his first day as a Los Angeles narcotics officer with a rogue detective who isn't what he appears to be.",
      director: "Antoine Fuqua",
      cast: [
        { name: "Denzel Washington", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Denzel_Washington_2018_%28cropped%29.jpg/440px-Denzel_Washington_2018_%28cropped%29.jpg" },
        { name: "Ethan Hawke", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Ethan_Hawke_2018_%28cropped%29.jpg/440px-Ethan_Hawke_2018_%28cropped%29.jpg" },
        { name: "Scott Glenn", img: "" }
      ],
      language: "EN" },
    { id: 828, title: "True Romance", subgenre: "Crime Romance", genres: ["crime","action","suspense"], views: 26000, release: "1993-09-10", rating: "7.9", runtime: "1h 59m",
      img: "https://image.tmdb.org/t/p/w500/5YqN3mT8LxK9vR2wE7Bp4GcZ6Xj.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/zH8Z0aQz2mQ1s3X0hT8cR5eFgXy.jpg",
      desc: "In Detroit, a pop-culture-obsessed loner murders a pimp, steals a suitcase of cocaine, and hits the road with a call girl.",
      director: "Tony Scott",
      cast: [
        { name: "Christian Slater", img: "" },
        { name: "Patricia Arquette", img: "" },
        { name: "Gary Oldman", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Gary_Oldman_2014_%28cropped%29.jpg/440px-Gary_Oldman_2014_%28cropped%29.jpg" }
      ],
      language: "EN" },
    { id: 829, title: "Miller's Crossing", subgenre: "Gangster Noir", genres: ["crime","drama","suspense"], views: 24000, release: "1990-09-21", rating: "7.7", runtime: "1h 55m",
      img: "https://image.tmdb.org/t/p/w500/8bU8X9T1gR5KQx4v7NqEmWg9wZk.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/0H8Z0aQz2mQ1s3X0hT8cR5eFgXy.jpg",
      desc: "Tom Reagan, an advisor to a Prohibition-era crime boss, tries to keep the peace between warring mobs but gets caught in a love triangle.",
      director: "Joel & Ethan Coen",
      cast: [
        { name: "Gabriel Byrne", img: "" },
        { name: "Albert Finney", img: "" },
        { name: "John Turturro", img: "" }
      ],
      language: "EN" },
    { id: 830, title: "Mystic River", subgenre: "Psychological Crime", genres: ["crime","drama","mystery"], views: 25000, release: "2003-10-15", rating: "7.9", runtime: "2h 18m",
      img: "https://image.tmdb.org/t/p/w500/hJgFhWQr4RzxUnLLgTtlxeHVYoN.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/1H8Z0aQz2mQ1s3X0hT8cR5eFgXy.jpg",
      desc: "Three childhood friends are reunited by a tragedy that dredges up old wounds and buried secrets from their shared past.",
      director: "Clint Eastwood",
      cast: [
        { name: "Sean Penn", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Sean_Penn_2018_%28cropped%29.jpg/440px-Sean_Penn_2018_%28cropped%29.jpg" },
        { name: "Tim Robbins", img: "" },
        { name: "Kevin Bacon", img: "" }
      ],
      language: "EN" },
    { id: 831, title: "The French Connection", subgenre: "Narcotics", genres: ["crime","action","suspense"], views: 29000, release: "1971-10-09", rating: "7.7", runtime: "1h 44m",
      img: "https://image.tmdb.org/t/p/w500/xw4rQaHNIy3YWWgY8XLMVUFrsDr.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/2H8Z0aQz2mQ1s3X0hT8cR5eFgXy.jpg",
      desc: "A pair of NYC cops in the Narcotics Bureau stumble onto a drug smuggling job with a French connection.",
      director: "William Friedkin",
      cast: [
        { name: "Gene Hackman", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Gene_Hackman_1972_%28cropped%29.jpg/440px-Gene_Hackman_1972_%28cropped%29.jpg" },
        { name: "Roy Scheider", img: "" },
        { name: "Fernando Rey", img: "" }
      ],
      language: "EN" },
    { id: 832, title: "Dog Day Afternoon", subgenre: "True Crime", genres: ["crime","drama"], views: 28000, release: "1975-09-21", rating: "8.0", runtime: "2h 5m",
      img: "https://image.tmdb.org/t/p/w500/m1x6f2k3X9y2wQ0c8p3vQm2nRf.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/3H8Z0aQz2mQ1s3X0hT8cR5eFgXy.jpg",
      desc: "A man robs a Brooklyn bank to pay for his lover's gender reassignment surgery — and it turns into a hostage standoff.",
      director: "Sidney Lumet",
      cast: [
        { name: "Al Pacino", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Al_Pacino_2016_%28cropped%29.jpg/440px-Al_Pacino_2016_%28cropped%29.jpg" },
        { name: "John Cazale", img: "" },
        { name: "Charles Durning", img: "" }
      ],
      language: "EN" },
    { id: 833, title: "Once Upon a Time in America", subgenre: "Mob Epic", genres: ["crime","drama"], views: 27000, release: "1984-06-01", rating: "8.3", runtime: "3h 49m",
      img: "https://image.tmdb.org/t/p/w500/n1x6f2k3X9y2wQ0c8p3vQm2nRf.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/4H8Z0aQz2mQ1s3X0hT8cR5eFgXy.jpg",
      desc: "A former Prohibition-era Jewish gangster returns to Brooklyn over thirty years later, where he must confront the ghosts of his past.",
      director: "Sergio Leone",
      cast: [
        { name: "Robert De Niro", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Robert_De_Niro_Cannes_2016.jpg/440px-Robert_De_Niro_Cannes_2016.jpg" },
        { name: "James Woods", img: "" },
        { name: "Elizabeth McGovern", img: "" }
      ],
      language: "EN" },
    { id: 834, title: "The Town", subgenre: "Heist", genres: ["crime","action","drama"], views: 30000, release: "2010-09-17", rating: "7.5", runtime: "2h 5m",
      img: "https://image.tmdb.org/t/p/w500/5E8GMhIsLBUpPYCkuYPFioErf5D.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/5H8Z0aQz2mQ1s3X0hT8cR5eFgXy.jpg",
      desc: "A proficient group of thieves rob a bank and hold the manager hostage — but the leader falls for a woman caught in the fallout.",
      director: "Ben Affleck",
      cast: [
        { name: "Ben Affleck", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Ben_Affleck_2019_%28cropped%29.jpg/440px-Ben_Affleck_2019_%28cropped%29.jpg" },
        { name: "Jeremy Renner", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Jeremy_Renner_2014_%28cropped%29.jpg/440px-Jeremy_Renner_2014_%28cropped%29.jpg" },
        { name: "Rebecca Hall", img: "" }
      ],
      language: "EN" },
    { id: 835, title: "Gone Baby Gone", subgenre: "Mystery Crime", genres: ["crime","mystery","drama"], views: 23000, release: "2007-10-19", rating: "7.6", runtime: "1h 54m",
      img: "https://image.tmdb.org/t/p/w500/hqUcQoqGdNwjMpN4P4kLToLxhLa.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/6H8Z0aQz2mQ1s3X0hT8cR5eFgXy.jpg",
      desc: "Two Boston private investigators take on the case of a missing four-year-old girl, uncovering a web of corruption and moral ambiguity.",
      director: "Ben Affleck",
      cast: [
        { name: "Casey Affleck", img: "" },
        { name: "Michelle Monaghan", img: "" },
        { name: "Morgan Freeman", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Morgan_Freeman_Deauville_2018_%28cropped%29.jpg/440px-Morgan_Freeman_Deauville_2018_%28cropped%29.jpg" }
      ],
      language: "EN" },
    { id: 836, title: "Blood Simple", subgenre: "Neo-Noir", genres: ["crime","suspense","drama"], views: 22000, release: "1984-01-18", rating: "7.6", runtime: "1h 39m",
      img: "https://image.tmdb.org/t/p/w500/3Zt1gL9Y7XKqR4w8N5mE2vQp9Wk.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/7H8Z0aQz2mQ1s3X0hT8cR5eFgXy.jpg",
      desc: "A rich but jealous man hires a private investigator to kill his cheating wife and her lover — but nothing goes as planned.",
      director: "Joel & Ethan Coen",
      cast: [
        { name: "John Getz", img: "" },
        { name: "Frances McDormand", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Frances_McDormand_2015_%28cropped%29.jpg/440px-Frances_McDormand_2015_%28cropped%29.jpg" },
        { name: "Dan Hedaya", img: "" }
      ],
      language: "EN" },
    { id: 837, title: "Oldboy", subgenre: "Revenge Thriller", genres: ["crime","suspense","mystery"], views: 33000, release: "2003-11-21", rating: "8.3", runtime: "2h 0m",
      img: "https://image.tmdb.org/t/p/w500/pWDtjs568ZfOTMbURQBYuT4Qxka.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/8H8Z0aQz2mQ1s3X0hT8cR5eFgXy.jpg",
      desc: "After being kidnapped and imprisoned for fifteen years, Oh Dae-su is released, only to find that he must find his captor in five days.",
      director: "Park Chan-wook",
      cast: [
        { name: "Choi Min-sik", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Choi_Min-sik_2019_%28cropped%29.jpg/440px-Choi_Min-sik_2019_%28cropped%29.jpg" },
        { name: "Yoo Ji-tae", img: "" },
        { name: "Kang Hye-jung", img: "" }
      ],
      language: "KO" },
    { id: 838, title: "Memories of Murder", subgenre: "Serial Killer", genres: ["crime","drama","mystery"], views: 31000, release: "2003-05-02", rating: "8.1", runtime: "2h 12m",
      img: "https://image.tmdb.org/t/p/w500/jcg1rw6ee0k3c1rS0NnXJ0Xr1qY.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/9H8Z0aQz2mQ1s3X0hT8cR5eFgXy.jpg",
      desc: "In 1986, a small Korean province is terrorized by a series of rapes and murders. Three detectives with different methods race to catch the killer.",
      director: "Bong Joon-ho",
      cast: [
        { name: "Song Kang-ho", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Song_Kang-ho_2019_%28cropped%29.jpg/440px-Song_Kang-ho_2019_%28cropped%29.jpg" },
        { name: "Kim Sang-kyung", img: "" },
        { name: "Park Hae-il", img: "" }
      ],
      language: "KO" },
    { id: 839, title: "Infernal Affairs", subgenre: "Undercover", genres: ["crime","suspense","drama"], views: 30000, release: "2002-12-12", rating: "8.0", runtime: "1h 41m",
      img: "https://image.tmdb.org/t/p/w500/g6l5g2l1Xk9y2wQ0c8p3vQm2nRf.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/0I8Z0aQz2mQ1s3X0hT8cR5eFgXy.jpg",
      desc: "A mole in the police force and an undercover cop in a triad play a deadly cat-and-mouse game to expose each other's identity.",
      director: "Andrew Lau & Alan Mak",
      cast: [
        { name: "Andy Lau", img: "" },
        { name: "Tony Leung", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Tony_Leung_Chiu-wai_2019_%28cropped%29.jpg/440px-Tony_Leung_Chiu-wai_2019_%28cropped%29.jpg" },
        { name: "Anthony Wong", img: "" }
      ],
      language: "ZH" },
    { id: 840, title: "City of God", subgenre: "Gangster Epic", genres: ["crime","drama"], views: 32000, release: "2002-08-30", rating: "8.6", runtime: "2h 10m",
      img: "https://image.tmdb.org/t/p/w500/k7eYIiL5vM3m5T9zX2nO1b8R4cQ.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/1I8Z0aQz2mQ1s3X0hT8cR5eFgXy.jpg",
      desc: "In the slums of Rio, two kids' paths diverge as one struggles to become a photographer and the other a kingpin.",
      director: "Fernando Meirelles",
      cast: [
        { name: "Alexandre Rodrigues", img: "" },
        { name: "Leandro Firmino", img: "" },
        { name: "Matheus Nachtergaele", img: "" }
      ],
      language: "PT" }
  ];

  const HERO_MOVIES = CRIME_MOVIES.slice(0, 6);

  const DIRECTORS = [
    { name: "Martin Scorsese", films: "Goodfellas · Casino · The Departed", tag: "Mob Drama" },
    { name: "Francis Ford Coppola", films: "The Godfather · Part II · The Conversation", tag: "Mob Epic" },
    { name: "Quentin Tarantino", films: "Pulp Fiction · Reservoir Dogs", tag: "Neo-Noir" },
    { name: "David Fincher", films: "Se7en · Zodiac · Gone Girl", tag: "Serial Killer" },
    { name: "Joel & Ethan Coen", films: "Fargo · No Country · Miller's Crossing", tag: "Coen Crime" },
    { name: "Christopher Nolan", films: "The Dark Knight · Insomnia", tag: "Crime Thriller" },
    { name: "Michael Mann", films: "Heat · Collateral · Thief", tag: "Neo-Noir" },
    { name: "Denis Villeneuve", films: "Sicario · Prisoners", tag: "Cartel Thriller" },
    { name: "Brian De Palma", films: "Scarface · The Untouchables", tag: "Mob Epic" },
    { name: "Sidney Lumet", films: "Dog Day Afternoon · Serpico", tag: "True Crime" },
    { name: "Bong Joon-ho", films: "Memories of Murder · Parasite", tag: "Serial Killer" },
    { name: "Park Chan-wook", films: "Oldboy · Sympathy for Mr. Vengeance", tag: "Revenge" }
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
          <img src="${esc(m.backdrop || FALLBACK_BACKDROP)}" alt="${esc(m.title)}"
               onerror="this.onerror=null;this.src='${FALLBACK_BACKDROP}';">
        </div>
        <div class="fh-hero__content">
          <div class="fh-hero__card">
            <span class="fh-hero__tag">Crime · Featured</span>
            <h1 class="fh-hero__title">${esc(m.title)}</h1>
            <div class="fh-hero__meta">
              <span class="fh-hero__pill fh-hero__pill--crime">${esc(m.subgenre)}</span>
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
    const items = [...CRIME_MOVIES].sort((a, b) => b.views - a.views).slice(0, 14);
    const html = items.map(m => `
      <div class="fh-marquee__card" data-open="${m.id}">
        <img src="${esc(m.img)}" alt="${esc(m.title)}" loading="lazy"
             onerror="this.onerror=null;this.src='${FALLBACK_POSTER}';">
        <span class="fh-marquee__rate"><i class="fas fa-star"></i> ${esc(m.rating)}</span>
        <div class="fh-marquee__body">
          <h3 class="fh-marquee__title">${esc(m.title)}</h3>
          <div class="fh-marquee__meta">
            <span>${esc(yearOf(m))}</span>
            <span>·</span>
            <span>${esc(m.subgenre)}</span>
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
        const btn = e.target.closest('.fh-crime-sort__btn');
        if (!btn) return;
        sortWrap.querySelectorAll('.fh-crime-sort__btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        state.activeSort = btn.dataset.sort;
        renderGrid(state.activeSort);
      });
    }
  }

  function renderGrid(sortKey) {
    let list = [...CRIME_MOVIES];
    if (sortKey === 'popular') list.sort((a, b) => b.views - a.views);
    else if (sortKey === 'latest') list.sort((a, b) => new Date(b.release) - new Date(a.release));
    else if (sortKey === 'rating') list.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    else if (sortKey === 'az') list.sort((a, b) => a.title.localeCompare(b.title));

    gridEl.innerHTML = list.map(renderCard).join('');
    attachHandlers(gridEl);

    const cards = gridEl.querySelectorAll('.fh-crime-card');
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
      <article class="fh-crime-card" data-open="${m.id}" tabindex="0" role="button" aria-label="${esc(m.title)}">
        <span class="fh-crime-card__subgenre">${esc(m.subgenre)}</span>
        <span class="fh-crime-card__badge">${badgeFor(m)}</span>
        <div class="fh-crime-card__media">
          <img src="${esc(m.img)}" alt="${esc(m.title)}" loading="lazy"
               onerror="this.onerror=null;this.src='${FALLBACK_POSTER}';">
          <span class="fh-crime-card__rate"><i class="fas fa-star"></i> ${esc(m.rating)}</span>
        </div>
        <div class="fh-crime-card__body">
          <h3 class="fh-crime-card__title">${esc(m.title)}</h3>
          <div class="fh-crime-card__meta">
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
      <div class="fh-crime-director-card">
        <div class="fh-crime-director-card__avatar">${esc(initials(d.name))}</div>
        <div class="fh-crime-director-card__body">
          <div class="fh-crime-director-card__name">${esc(d.name)}</div>
          <div class="fh-crime-director-card__films">${esc(d.films)}</div>
          <span class="fh-crime-director-card__tag"><i class="fas fa-clapperboard"></i> ${esc(d.tag)}</span>
        </div>
      </div>`).join('');
    directorTrack.className = 'fh-marquee__track';
    directorTrack.innerHTML = html + html;
    directorTrack.style.animationDuration = '80s';
  }

  function openMovieDetails(movieId) {
    const m = CRIME_MOVIES.find(x => x.id === movieId);
    if (!m || !drawer || !drawerBody) return;

    const related = CRIME_MOVIES
      .filter(x => x.id !== m.id && x.genres.some(g => m.genres.includes(g)))
      .slice(0, 6);

    drawerBody.innerHTML = `
      <div class="fh-drawer__hero">
        <img src="${esc(m.backdrop || m.img)}" alt="${esc(m.title)}"
             onerror="this.onerror=null;this.src='${FALLBACK_BACKDROP}';">
        <div class="fh-drawer__hero-content">
          <h1 class="fh-drawer__title" id="fhDrawerTitle">${esc(m.title)}</h1>
          <div class="fh-drawer__meta">
            <span><i class="fas fa-star" style="color:#fbbf24"></i> ${esc(m.rating)}</span>
            <span><i class="fas fa-calendar"></i> ${esc(yearOf(m))}</span>
            <span><i class="fas fa-clock"></i> ${esc(m.runtime)}</span>
            <span><i class="fas fa-globe"></i> ${esc(m.language)}</span>
            <span><i class="fas fa-magnifying-glass"></i> ${esc(m.subgenre)}</span>
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
          <div class="fh-drawer__info-row"><span class="fh-drawer__info-label">Language</span><span class="fh-drawer__info-value">${esc(m.language)}</span></div>
          <div class="fh-drawer__info-row"><span class="fh-drawer__info-label">Views</span><span class="fh-drawer__info-value">${m.views.toLocaleString()}</span></div>
        </div>
      </div>
      <div class="fh-drawer__content" style="grid-template-columns:1fr;padding-top:0">
        <div>
          <h3 class="fh-drawer__section-title">More Like This</h3>
          <div class="fh-marquee__track" id="fhCrimeDrawerRelated" style="animation:none;gap:16px;overflow-x:auto"></div>
        </div>
      </div>`;

    const rel = drawerBody.querySelector('#fhCrimeDrawerRelated');
    rel.innerHTML = related.map(r => `
      <div class="fh-marquee__card" data-open="${r.id}" style="flex:0 0 auto">
        <img src="${esc(r.img)}" alt="${esc(r.title)}" loading="lazy"
             onerror="this.onerror=null;this.src='${FALLBACK_POSTER}';">
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
          <img src="${esc(m.img)}" alt="${esc(m.title)}" onerror="this.onerror=null;this.src='${FALLBACK_POSTER}';">
          <div class="fh-search-results__info">
            <div class="fh-search-results__title">${esc(m.title)}</div>
            <div class="fh-search-results__meta">${esc(yearOf(m))} · ${esc(m.subgenre)}</div>
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
      return CRIME_MOVIES.filter(m =>
        m.title.toLowerCase().includes(s) ||
        m.director.toLowerCase().includes(s) ||
        m.subgenre.toLowerCase().includes(s) ||
        m.genres.some(g => g.includes(s)) ||
        (m.cast || []).some(c => c.name.toLowerCase().includes(s))
      ).slice(0, 12);
    }

    searchInput.addEventListener('focus', () => {
      openResults();
      const q = searchInput.value.trim();
      if (!q) render(CRIME_MOVIES.slice(0, 6), 'popular');
      else render(query(q), q);
    });
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim();
      if (!q) { render(CRIME_MOVIES.slice(0, 6), 'popular'); return; }
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
    if (sideCountEl) sideCountEl.textContent = CRIME_MOVIES.length + '+';
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
      if (Array.isArray(rows) && rows.length) CRIME_MOVIES = rows;
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