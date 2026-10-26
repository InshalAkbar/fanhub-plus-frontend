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

  const heroSection = document.getElementById('fhDramaHero');
  const heroDots = document.getElementById('fhDramaHeroDots');
  const topWatchedTrack = document.getElementById('fhDramaTopWatchedTrack');
  const gridEl = document.getElementById('fhDramaGrid');
  const sortWrap = document.getElementById('fhDramaSort');
  const directorTrack = document.getElementById('fhDramaDirectorTrack');
  const drawer = document.getElementById('movieDetailDrawer');
  const drawerBody = document.getElementById('fhDrawerBody');
  const sideCountEl = document.getElementById('fhSideCount');

  const state = {
    currentHero: 0,
    heroTimer: null,
    activeSort: 'popular'
  };

  const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=900';
  const FALLBACK_BACKDROP = 'https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=2000';

  const buildEpisodes = (count, titles) => {
    const arr = [];
    for (let i = 1; i <= count; i++) {
      arr.push({
        num: i,
        title: titles[i - 1] || `Episode ${i}`,
        desc: `The story deepens as our characters face new challenges and secrets begin to surface in episode ${i}.`,
        dur: `${45 + (i % 15)}m`
      });
    }
    return arr;
  };

  let DRAMA_MOVIES = [
    { id: 601, title: "Breaking Bad", type: "series", subgenre: "Crime Drama", kdrama: false,
      genres: ["drama","crime"], views: 52000, release: "2008-01-20", rating: "9.5", runtime: "49m / Ep",
      img: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
      desc: "A chemistry teacher diagnosed with terminal cancer turns to manufacturing methamphetamine to secure his family's future.",
      director: "Vince Gilligan",
      cast: [{ name: "Bryan Cranston", img: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Bryan_Cranston_Peabody_2014.jpg" },
             { name: "Aaron Paul", img: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Aaron_Paul_by_Gage_Skidmore_3.jpg" },
             { name: "Anna Gunn", img: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Anna_Gunn_by_Gage_Skidmore_3.jpg" }],
      language: "EN",
      seasons: [
        { num: 1, episodes: buildEpisodes(7, ["Pilot","Cat's in the Bag...","...And the Bag's in the River","Cancer Man","Gray Matter","Crazy Handful of Nothin'","A No-Rough-Stuff-Type Deal"]) },
        { num: 2, episodes: buildEpisodes(13, []) },
        { num: 3, episodes: buildEpisodes(13, []) },
        { num: 4, episodes: buildEpisodes(13, []) },
        { num: 5, episodes: buildEpisodes(16, []) }
      ]
    },
    { id: 602, title: "Squid Game", type: "series", subgenre: "Survival Drama", kdrama: true,
      genres: ["drama","kdrama","thriller"], views: 48000, release: "2021-09-17", rating: "8.1", runtime: "55m / Ep",
      img: "https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/oaGvjB0DvdhXhIDcu4DdzYrlC4r.jpg",
      desc: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games with deadly stakes.",
      director: "Hwang Dong-hyuk",
      cast: [{ name: "Lee Jung-jae", img: "https://upload.wikimedia.org/wikipedia/commons/4/44/Lee_Jung-Jae.jpg" },
             { name: "Park Hae-soo", img: "" },
             { name: "Wi Ha-joon", img: "" }],
      language: "KR",
      seasons: [
        { num: 1, episodes: buildEpisodes(9, ["Red Light, Green Light","Hell","The Man with the Umbrella","Stick to the Team","A Fair World","Gganbu","VIPS","Front Man","One Lucky Day"]) },
        { num: 2, episodes: buildEpisodes(7, []) }
      ]
    },
    { id: 603, title: "The Last of Us", type: "series", subgenre: "Post-Apocalyptic", kdrama: false,
      genres: ["drama","sci-fi","action"], views: 47000, release: "2023-01-15", rating: "8.8", runtime: "55m / Ep",
      img: "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/9cQB9O1F7M8o0uwKXWKLoITVv7T.jpg",
      desc: "Twenty years after a fungal pandemic destroys civilization, a hardened survivor is hired to smuggle a teenage girl out of a quarantine zone.",
      director: "Craig Mazin",
      cast: [{ name: "Pedro Pascal", img: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Pedro_Pascal_at_SXSW_2025_01_%28cropped%29.jpg" },
             { name: "Bella Ramsey", img: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Bella_Ramsey%2C_actor%2C_at_SXSW_2025_03_%28cropped%29.jpg" },
             { name: "Anna Torv", img: "" }],
      language: "EN",
      seasons: [
        { num: 1, episodes: buildEpisodes(9, ["When You're Lost in the Darkness","Infected","Long, Long Time","Kin","Endure and Survive","Kin","Left Behind","When We Are in Need","Look for the Light"]) },
        { num: 2, episodes: buildEpisodes(7, []) }
      ]
    },
    { id: 604, title: "Crash Landing on You", type: "series", subgenre: "Romance Drama", kdrama: true,
      genres: ["drama","kdrama","romance"], views: 46000, release: "2019-12-14", rating: "8.8", runtime: "70m / Ep",
      img: "https://image.tmdb.org/t/p/w500/8UJjqZKkKtWfjPoHYrXjJUWBKtL.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/8UJjqZKkKtWfjPoHYrXjJUWBKtL.jpg",
      desc: "A paragliding accident drops a South Korean heiress in North Korea and into the life of an army officer.",
      director: "Lee Jeong-hyo",
      cast: [{ name: "Hyun Bin", img: "https://upload.wikimedia.org/wikipedia/commons/f/f2/20240620_Hyun_Bin_%28%ED%98%84%EB%B9%88%29_03.jpg" },
             { name: "Son Ye-jin", img: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Son_Ye-jin_%EC%86%90%EC%98%88%EC%A7%84_2024_02.jpg" },
             { name: "Seo Ji-hye", img: "" }],
      language: "KR",
      seasons: [{ num: 1, episodes: buildEpisodes(16, []) }]
    },
    { id: 605, title: "The Sopranos", type: "series", subgenre: "Mob Drama", kdrama: false,
      genres: ["drama","crime"], views: 42000, release: "1999-01-10", rating: "9.2", runtime: "55m / Ep",
      img: "https://image.tmdb.org/t/p/w500/57okJJUBK0AaijxLh3RjNUxBFiu.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/57okJJUBK0AaijxLh3RjNUxBFiu.jpg",
      desc: "New Jersey mob boss Tony Soprano deals with personal and professional issues in his home and criminal life.",
      director: "David Chase",
      cast: [{ name: "James Gandolfini", img: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Gandolfinigfdl.PNG" },
             { name: "Edie Falco", img: "https://upload.wikimedia.org/wikipedia/commons/8/85/Edie_Falco_2010.jpg" },
             { name: "Michael Imperioli", img: "" }],
      language: "EN",
      seasons: [
        { num: 1, episodes: buildEpisodes(13, []) }, { num: 2, episodes: buildEpisodes(13, []) },
        { num: 3, episodes: buildEpisodes(13, []) }, { num: 4, episodes: buildEpisodes(13, []) },
        { num: 5, episodes: buildEpisodes(13, []) }, { num: 6, episodes: buildEpisodes(21, []) }
      ]
    },
    { id: 606, title: "Game of Thrones", type: "series", subgenre: "Fantasy Drama", kdrama: false,
      genres: ["drama","fantasy","adventure"], views: 55000, release: "2011-04-17", rating: "9.2", runtime: "57m / Ep",
      img: "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/suopoADq0k8YZr4dQXcU6pToj6s.jpg",
      desc: "Nine noble families fight for control over the lands of Westeros while an ancient enemy returns after being dormant for millennia.",
      director: "David Benioff & D.B. Weiss",
      cast: [{ name: "Emilia Clarke", img: "https://upload.wikimedia.org/wikipedia/commons/1/15/Emilia_Clarke_%289350878198%29.jpg" },
             { name: "Peter Dinklage", img: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Peter_Dinklage%2C_2023.jpg" },
             { name: "Kit Harington", img: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Kit_Harington_SDCC_2013_%28cropped%29.jpg" }],
      language: "EN",
      seasons: [
        { num: 1, episodes: buildEpisodes(10, []) }, { num: 2, episodes: buildEpisodes(10, []) },
        { num: 3, episodes: buildEpisodes(10, []) }, { num: 4, episodes: buildEpisodes(10, []) },
        { num: 5, episodes: buildEpisodes(10, []) }, { num: 6, episodes: buildEpisodes(10, []) },
        { num: 7, episodes: buildEpisodes(7, []) }, { num: 8, episodes: buildEpisodes(6, []) }
      ]
    },
    { id: 607, title: "Goblin", type: "series", subgenre: "Fantasy Romance", kdrama: true,
      genres: ["drama","kdrama","fantasy","romance"], views: 45000, release: "2016-12-02", rating: "8.6", runtime: "75m / Ep",
      img: "https://image.tmdb.org/t/p/w500/9hFddkQPjWpszL2vYbqPnrKGqdA.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/9hFddkQPjWpszL2vYbqPnrKGqdA.jpg",
      desc: "A cursed immortal goblin seeks his human bride to end his eternal life while uncovering centuries-old secrets.",
      director: "Lee Eung-bok",
      cast: ["Gong Yoo", "Kim Go-eun", "Lee Dong-wook"],
      language: "KR",
      seasons: [{ num: 1, episodes: buildEpisodes(16, []) }]
    },
    { id: 608, title: "Vincenzo", type: "series", subgenre: "Crime Drama", kdrama: true,
      genres: ["drama","kdrama","crime"], views: 42000, release: "2021-02-20", rating: "8.4", runtime: "80m / Ep",
      img: "https://image.tmdb.org/t/p/w500/6QGm5xk0nz2hXwYfLmZXBhWtXvP.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/6QGm5xk0nz2hXwYfLmZXBhWtXvP.jpg",
      desc: "A Korean-Italian mafia lawyer returns to Seoul and uses his ruthless methods to bring down an evil pharmaceutical empire.",
      director: "Kim Hee-won",
      cast: ["Song Joong-ki", "Jeon Yeo-been", "Ok Taec-yeon"],
      language: "KR",
      seasons: [{ num: 1, episodes: buildEpisodes(20, []) }]
    },
    { id: 609, title: "The Crown", type: "series", subgenre: "Historical Drama", kdrama: false,
      genres: ["drama","history","biography"], views: 44000, release: "2016-11-04", rating: "8.6", runtime: "58m / Ep",
      img: "https://image.tmdb.org/t/p/w500/1M876KPjulVwppEpldhdc8V4o68.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/1M876KPjulVwppEpldhdc8V4o68.jpg",
      desc: "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the twentieth century.",
      director: "Peter Morgan",
      cast: ["Claire Foy", "Olivia Colman", "Imelda Staunton"],
      language: "EN",
      seasons: [
        { num: 1, episodes: buildEpisodes(10, []) }, { num: 2, episodes: buildEpisodes(10, []) },
        { num: 3, episodes: buildEpisodes(10, []) }, { num: 4, episodes: buildEpisodes(10, []) },
        { num: 5, episodes: buildEpisodes(10, []) }, { num: 6, episodes: buildEpisodes(10, []) }
      ]
    },
    { id: 610, title: "Succession", type: "series", subgenre: "Family Drama", kdrama: false,
      genres: ["drama","comedy"], views: 43000, release: "2018-06-03", rating: "8.9", runtime: "60m / Ep",
      img: "https://image.tmdb.org/t/p/w500/7HW47XbkNQ5fiwQFYGWdw9gs144.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/7HW47XbkNQ5fiwQFYGWdw9gs144.jpg",
      desc: "A media empire's aging patriarch fights for control of his company while his children jockey for power.",
      director: "Jesse Armstrong",
      cast: ["Brian Cox", "Jeremy Strong", "Sarah Snook"],
      language: "EN",
      seasons: [
        { num: 1, episodes: buildEpisodes(10, []) }, { num: 2, episodes: buildEpisodes(10, []) },
        { num: 3, episodes: buildEpisodes(9, []) }, { num: 4, episodes: buildEpisodes(10, []) }
      ]
    },
    { id: 611, title: "The Glory", type: "series", subgenre: "Revenge Drama", kdrama: true,
      genres: ["drama","kdrama","thriller"], views: 40000, release: "2022-12-30", rating: "8.1", runtime: "50m / Ep",
      img: "https://image.tmdb.org/t/p/w500/8a2f5C1n8XzW5oVtZ1KGv8cVpJ4.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/8a2f5C1n8XzW5oVtZ1KGv8cVpJ4.jpg",
      desc: "A woman devastated by childhood bullying dedicates her life to revenge against her former tormentors.",
      director: "Ahn Gil-ho",
      cast: ["Song Hye-kyo", "Lee Do-hyun", "Lim Ji-yeon"],
      language: "KR",
      seasons: [{ num: 1, episodes: buildEpisodes(16, []) }]
    },
    { id: 612, title: "Mad Men", type: "series", subgenre: "Period Drama", kdrama: false,
      genres: ["drama","history"], views: 38000, release: "2007-07-19", rating: "8.7", runtime: "47m / Ep",
      img: "https://image.tmdb.org/t/p/w500/7HW47XbkNQ5fiwQFYGWdw9gs144.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/7HW47XbkNQ5fiwQFYGWdw9gs144.jpg",
      desc: "A drama about one of New York's most prestigious ad agencies and the mysterious but brilliant ad man Don Draper.",
      director: "Matthew Weiner",
      cast: ["Jon Hamm", "Elisabeth Moss", "Vincent Kartheiser"],
      language: "EN",
      seasons: [
        { num: 1, episodes: buildEpisodes(13, []) }, { num: 2, episodes: buildEpisodes(13, []) },
        { num: 3, episodes: buildEpisodes(13, []) }, { num: 4, episodes: buildEpisodes(13, []) },
        { num: 5, episodes: buildEpisodes(13, []) }, { num: 6, episodes: buildEpisodes(13, []) },
        { num: 7, episodes: buildEpisodes(14, []) }
      ]
    },
    { id: 613, title: "Itaewon Class", type: "series", subgenre: "Business Drama", kdrama: true,
      genres: ["drama","kdrama"], views: 39000, release: "2020-01-31", rating: "8.2", runtime: "70m / Ep",
      img: "https://image.tmdb.org/t/p/w500/6QGm5xk0nz2hXwYfLmZXBhWtXvP.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/6QGm5xk0nz2hXwYfLmZXBhWtXvP.jpg",
      desc: "An ex-con opens a bar in Itaewon and takes on a powerful food conglomerate that destroyed his family.",
      director: "Kim Sung-yoon",
      cast: ["Park Seo-joon", "Kim Da-mi", "Yoo Jae-myung"],
      language: "KR",
      seasons: [{ num: 1, episodes: buildEpisodes(16, []) }]
    },
    { id: 614, title: "Hospital Playlist", type: "series", subgenre: "Medical Drama", kdrama: true,
      genres: ["drama","kdrama"], views: 36000, release: "2020-03-12", rating: "8.9", runtime: "90m / Ep",
      img: "https://image.tmdb.org/t/p/w500/9hFddkQPjWpszL2vYbqPnrKGqdA.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/9hFddkQPjWpszL2vYbqPnrKGqdA.jpg",
      desc: "Five doctors who have been friends since medical school navigate love, loss, and life in a busy Seoul hospital.",
      director: "Shin Won-ho",
      cast: ["Cho Jung-seok", "Yoo Yeon-seok", "Jung Kyung-ho"],
      language: "KR",
      seasons: [{ num: 1, episodes: buildEpisodes(12, []) }, { num: 2, episodes: buildEpisodes(12, []) }]
    },
    { id: 615, title: "True Detective", type: "series", subgenre: "Anthology Crime", kdrama: false,
      genres: ["drama","crime","mystery"], views: 35000, release: "2014-01-12", rating: "8.9", runtime: "55m / Ep",
      img: "https://image.tmdb.org/t/p/w500/57okJJUBK0AaijxLh3RjNUxBFiu.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/57okJJUBK0AaijxLh3RjNUxBFiu.jpg",
      desc: "Anthology series where police investigations unearth the personal and professional secrets of those involved.",
      director: "Cary Joji Fukunaga",
      cast: ["Matthew McConaughey", "Woody Harrelson", "Michelle Monaghan"],
      language: "EN",
      seasons: [
        { num: 1, episodes: buildEpisodes(8, []) }, { num: 2, episodes: buildEpisodes(8, []) },
        { num: 3, episodes: buildEpisodes(8, []) }, { num: 4, episodes: buildEpisodes(6, []) }
      ]
    },
    { id: 616, title: "Reply 1988", type: "series", subgenre: "Slice of Life", kdrama: true,
      genres: ["drama","kdrama","comedy"], views: 37000, release: "2015-11-06", rating: "9.1", runtime: "90m / Ep",
      img: "https://image.tmdb.org/t/p/w500/9hFddkQPjWpszL2vYbqPnrKGqdA.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/9hFddkQPjWpszL2vYbqPnrKGqdA.jpg",
      desc: "Five families living in the same neighborhood in 1988 Seoul share laughter, love, and life's quietest moments.",
      director: "Shin Won-ho",
      cast: ["Hyeri", "Park Bo-gum", "Ryu Jun-yeol"],
      language: "KR",
      seasons: [{ num: 1, episodes: buildEpisodes(20, []) }]
    },
    { id: 617, title: "Peaky Blinders", type: "series", subgenre: "Period Crime", kdrama: false,
      genres: ["drama","crime"], views: 41000, release: "2013-09-12", rating: "8.8", runtime: "60m / Ep",
      img: "https://image.tmdb.org/t/p/w500/57okJJUBK0AaijxLh3RjNUxBFiu.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/57okJJUBK0AaijxLh3RjNUxBFiu.jpg",
      desc: "A gangster family epic set in 1919 Birmingham, centered on a gang who sew razor blades in the peaks of their caps.",
      director: "Otto Bathurst",
      cast: ["Cillian Murphy", "Paul Anderson", "Sophie Rundle"],
      language: "EN",
      seasons: [
        { num: 1, episodes: buildEpisodes(6, []) }, { num: 2, episodes: buildEpisodes(6, []) },
        { num: 3, episodes: buildEpisodes(6, []) }, { num: 4, episodes: buildEpisodes(6, []) },
        { num: 5, episodes: buildEpisodes(6, []) }, { num: 6, episodes: buildEpisodes(6, []) }
      ]
    },
    { id: 618, title: "Sky Castle", type: "series", subgenre: "Satirical Drama", kdrama: true,
      genres: ["drama","kdrama","thriller"], views: 33000, release: "2018-11-23", rating: "8.7", runtime: "80m / Ep",
      img: "https://image.tmdb.org/t/p/w500/9hFddkQPjWpszL2vYbqPnrKGqdA.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/9hFddkQPjWpszL2vYbqPnrKGqdA.jpg",
      desc: "Families in an exclusive Korean neighborhood push their children toward elite universities at any cost.",
      director: "Jo Hyun-tak",
      cast: ["Yum Jung-ah", "Lee Tae-ran", "Yoon Se-ah"],
      language: "KR",
      seasons: [{ num: 1, episodes: buildEpisodes(20, []) }]
    },
    { id: 619, title: "Chernobyl", type: "series", subgenre: "Historical Drama", kdrama: false,
      genres: ["drama","history","thriller"], views: 40000, release: "2019-05-06", rating: "9.4", runtime: "65m / Ep",
      img: "https://image.tmdb.org/t/p/w500/7HW47XbkNQ5fiwQFYGWdw9gs144.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/7HW47XbkNQ5fiwQFYGWdw9gs144.jpg",
      desc: "A dramatization of the 1986 nuclear accident and the sacrifices made to save Europe from an unimaginable disaster.",
      director: "Johan Renck",
      cast: ["Jared Harris", "Stellan Skarsgård", "Emily Watson"],
      language: "EN",
      seasons: [{ num: 1, episodes: buildEpisodes(5, ["1:23:45","Please Remain Calm","Open Wide, O Earth","The Happiness of All Mankind","Vichnaya Pamyat"]) }]
    },
    { id: 620, title: "Descendants of the Sun", type: "series", subgenre: "Romance Drama", kdrama: true,
      genres: ["drama","kdrama","romance","action"], views: 34000, release: "2016-02-24", rating: "8.2", runtime: "60m / Ep",
      img: "https://image.tmdb.org/t/p/w500/8UJjqZKkKtWfjPoHYrXjJUWBKtL.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/8UJjqZKkKtWfjPoHYrXjJUWBKtL.jpg",
      desc: "A soldier and a doctor fall in love while serving in a war-torn foreign country.",
      director: "Lee Eung-bok",
      cast: ["Song Joong-ki", "Song Hye-kyo", "Jin Goo"],
      language: "KR",
      seasons: [{ num: 1, episodes: buildEpisodes(16, []) }]
    },
    { id: 621, title: "My Mister", type: "series", subgenre: "Character Drama", kdrama: true,
      genres: ["drama","kdrama"], views: 30000, release: "2018-03-21", rating: "9.1", runtime: "75m / Ep",
      img: "https://image.tmdb.org/t/p/w500/9hFddkQPjWpszL2vYbqPnrKGqdA.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/9hFddkQPjWpszL2vYbqPnrKGqdA.jpg",
      desc: "A weary middle-aged man and a young woman crushed by life form an unlikely bond that helps them heal.",
      director: "Kim Won-seok",
      cast: ["Lee Sun-kyun", "IU", "Park Ho-san"],
      language: "KR",
      seasons: [{ num: 1, episodes: buildEpisodes(16, []) }]
    },
    { id: 622, title: "Fleabag", type: "series", subgenre: "Dark Comedy Drama", kdrama: false,
      genres: ["drama","comedy"], views: 31000, release: "2016-07-21", rating: "8.7", runtime: "27m / Ep",
      img: "https://image.tmdb.org/t/p/w500/7HW47XbkNQ5fiwQFYGWdw9gs144.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/7HW47XbkNQ5fiwQFYGWdw9gs144.jpg",
      desc: "A dry-witted woman navigates modern London while struggling with grief, family, and her own worst instincts.",
      director: "Phoebe Waller-Bridge",
      cast: ["Phoebe Waller-Bridge", "Sian Clifford", "Olivia Colman"],
      language: "EN",
      seasons: [{ num: 1, episodes: buildEpisodes(6, []) }, { num: 2, episodes: buildEpisodes(6, []) }]
    },
    { id: 623, title: "Signal", type: "series", subgenre: "Crime Thriller", kdrama: true,
      genres: ["drama","kdrama","crime","thriller"], views: 32000, release: "2016-01-22", rating: "8.7", runtime: "60m / Ep",
      img: "https://image.tmdb.org/t/p/w500/6QGm5xk0nz2hXwYfLmZXBhWtXvP.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/6QGm5xk0nz2hXwYfLmZXBhWtXvP.jpg",
      desc: "A walkie-talkie bridges two detectives across time, allowing them to solve cold cases together.",
      director: "Kim Won-seok",
      cast: ["Lee Je-hoon", "Kim Hye-soo", "Cho Jin-woong"],
      language: "KR",
      seasons: [{ num: 1, episodes: buildEpisodes(16, []) }]
    },
    { id: 624, title: "Better Call Saul", type: "series", subgenre: "Legal Drama", kdrama: false,
      genres: ["drama","crime"], views: 40000, release: "2015-02-08", rating: "9.0", runtime: "47m / Ep",
      img: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
      desc: "The trials and tribulations of criminal lawyer Jimmy McGill in the years leading up to his fateful run-in with Walter White.",
      director: "Vince Gilligan",
      cast: ["Bob Odenkirk", "Jonathan Banks", "Rhea Seehorn"],
      language: "EN",
      seasons: [
        { num: 1, episodes: buildEpisodes(10, []) }, { num: 2, episodes: buildEpisodes(10, []) },
        { num: 3, episodes: buildEpisodes(10, []) }, { num: 4, episodes: buildEpisodes(10, []) },
        { num: 5, episodes: buildEpisodes(10, []) }, { num: 6, episodes: buildEpisodes(13, []) }
      ]
    },
    { id: 625, title: "Business Proposal", type: "series", subgenre: "Romantic Comedy", kdrama: true,
      genres: ["drama","kdrama","romance","comedy"], views: 35000, release: "2022-02-28", rating: "8.0", runtime: "60m / Ep",
      img: "https://image.tmdb.org/t/p/w500/8UJjqZKkKtWfjPoHYrXjJUWBKtL.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/8UJjqZKkKtWfjPoHYrXjJUWBKtL.jpg",
      desc: "A woman goes on a blind date in place of her friend and ends up entangled with her company's CEO.",
      director: "Park Sun-ho",
      cast: ["Ahn Hyo-seop", "Kim Se-jeong", "Kim Min-kyu"],
      language: "KR",
      seasons: [{ num: 1, episodes: buildEpisodes(12, []) }]
    },
    { id: 626, title: "Sherlock", type: "series", subgenre: "Modern Mystery", kdrama: false,
      genres: ["drama","crime","mystery"], views: 39000, release: "2010-07-25", rating: "9.1", runtime: "88m / Ep",
      img: "https://image.tmdb.org/t/p/w500/7HW47XbkNQ5fiwQFYGWdw9gs144.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/7HW47XbkNQ5fiwQFYGWdw9gs144.jpg",
      desc: "A modern update finds the famous detective Sherlock Holmes and Doctor Watson solving crimes in 21st-century London.",
      director: "Mark Gatiss & Steven Moffat",
      cast: ["Benedict Cumberbatch", "Martin Freeman", "Una Stubbs"],
      language: "EN",
      seasons: [
        { num: 1, episodes: buildEpisodes(3, []) }, { num: 2, episodes: buildEpisodes(3, []) },
        { num: 3, episodes: buildEpisodes(3, []) }, { num: 4, episodes: buildEpisodes(3, []) }
      ]
    },
    { id: 627, title: "Twenty-Five Twenty-One", type: "series", subgenre: "Coming-of-Age", kdrama: true,
      genres: ["drama","kdrama","romance"], views: 33000, release: "2022-02-12", rating: "8.6", runtime: "75m / Ep",
      img: "https://image.tmdb.org/t/p/w500/8UJjqZKkKtWfjPoHYrXjJUWBKtL.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/8UJjqZKkKtWfjPoHYrXjJUWBKtL.jpg",
      desc: "Two young people meet during the 1998 financial crisis and grow together through the highs and lows of youth.",
      director: "Jung Ji-hyun",
      cast: ["Kim Tae-ri", "Nam Joo-hyuk", "Bona"],
      language: "KR",
      seasons: [{ num: 1, episodes: buildEpisodes(16, []) }]
    },
    { id: 628, title: "The Bear", type: "series", subgenre: "Kitchen Drama", kdrama: false,
      genres: ["drama","comedy"], views: 34000, release: "2022-06-23", rating: "8.6", runtime: "30m / Ep",
      img: "https://image.tmdb.org/t/p/w500/7HW47XbkNQ5fiwQFYGWdw9gs144.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/7HW47XbkNQ5fiwQFYGWdw9gs144.jpg",
      desc: "A fine-dining chef returns to Chicago to run his late brother's chaotic sandwich shop.",
      director: "Christopher Storer",
      cast: ["Jeremy Allen White", "Ayo Edebiri", "Ebon Moss-Bachrach"],
      language: "EN",
      seasons: [
        { num: 1, episodes: buildEpisodes(8, []) }, { num: 2, episodes: buildEpisodes(10, []) },
        { num: 3, episodes: buildEpisodes(10, []) }
      ]
    },
    { id: 629, title: "Alchemy of Souls", type: "series", subgenre: "Fantasy Romance", kdrama: true,
      genres: ["drama","kdrama","fantasy","romance"], views: 29000, release: "2022-06-18", rating: "8.3", runtime: "70m / Ep",
      img: "https://image.tmdb.org/t/p/w500/9hFddkQPjWpszL2vYbqPnrKGqdA.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/9hFddkQPjWpszL2vYbqPnrKGqdA.jpg",
      desc: "A powerful assassin's soul is trapped in a blind woman's body, and a young nobleman needs her to change his fate.",
      director: "Park Joon-hwa",
      cast: ["Lee Jae-wook", "Jung So-min", "Hwang Min-hyun"],
      language: "KR",
      seasons: [{ num: 1, episodes: buildEpisodes(20, []) }, { num: 2, episodes: buildEpisodes(10, []) }]
    },
    { id: 630, title: "This Is Us", type: "series", subgenre: "Family Drama", kdrama: false,
      genres: ["drama","romance"], views: 31000, release: "2016-09-20", rating: "8.7", runtime: "45m / Ep",
      img: "https://image.tmdb.org/t/p/w500/7HW47XbkNQ5fiwQFYGWdw9gs144.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/7HW47XkNQ5fiwQFYGWdw9gs144.jpg",
      desc: "Follows the lives and families of three adults who share the same birthday and whose stories intertwine.",
      director: "Dan Fogelman",
      cast: ["Milo Ventimiglia", "Mandy Moore", "Sterling K. Brown"],
      language: "EN",
      seasons: [
        { num: 1, episodes: buildEpisodes(18, []) }, { num: 2, episodes: buildEpisodes(18, []) },
        { num: 3, episodes: buildEpisodes(18, []) }, { num: 4, episodes: buildEpisodes(18, []) },
        { num: 5, episodes: buildEpisodes(16, []) }, { num: 6, episodes: buildEpisodes(18, []) }
      ]
    }
  ];

  const HERO_IDS = [602, 601, 603, 604, 605, 606];
  const HERO_MOVIES = HERO_IDS.map(id => DRAMA_MOVIES.find(m => m.id === id)).filter(Boolean);

  const DIRECTORS = [
    { name: "Vince Gilligan",     films: "Breaking Bad · Better Call Saul",       tag: "Character Master" },
    { name: "Hwang Dong-hyuk",    films: "Squid Game",                            tag: "Korean Visionary" },
    { name: "David Chase",        films: "The Sopranos",                          tag: "Mob Drama" },
    { name: "Shin Won-ho",        films: "Hospital Playlist · Reply 1988",        tag: "Slice of Life" },
    { name: "Lee Eung-bok",       films: "Goblin · Descendants of the Sun",       tag: "K-Romance" },
    { name: "Peter Morgan",       films: "The Crown",                             tag: "Royal History" },
    { name: "Craig Mazin",        films: "The Last of Us · Chernobyl",            tag: "Adaptation Auteur" },
    { name: "David Benioff",      films: "Game of Thrones",                       tag: "Epic Fantasy" },
    { name: "Matthew Weiner",     films: "Mad Men",                               tag: "Period Drama" },
    { name: "Jesse Armstrong",    films: "Succession",                            tag: "Satirical Drama" }
  ];

  function initialsOf(name) {
    return String(name).split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
  }
  function castName(c) { return typeof c === 'string' ? c : c.name; }
  function castImg(c) { return typeof c === 'object' && c.img ? c.img : ''; }

  function castAvatarHTML(c, size) {
    const cls = size === 'large' ? 'fh-hero__cast-avatar' : 'fh-drawer__cast-avatar';
    const name = castName(c);
    const img = castImg(c);
    if (img) {
      const safe = initialsOf(name);
      return `<div class="${cls} ${cls}--photo"><img src="${img}" alt="${name}" loading="lazy" draggable="false" onerror="this.style.display='none'; this.parentElement.textContent='${safe}'; this.parentElement.classList.remove('${cls}--photo');"></div>`;
    }
    return `<div class="${cls}">${initialsOf(name)}</div>`;
  }

  function posterImg(m) {
    return `<img src="${m.img}" alt="${m.title}" loading="lazy" onerror="this.onerror=null; this.src='${FALLBACK_POSTER}';">`;
  }
  function backdropImg(m) {
    return `<img src="${m.backdrop}" alt="${m.title}" onerror="this.onerror=null; this.src='${FALLBACK_BACKDROP}';">`;
  }

  function initHero() {
    HERO_MOVIES.forEach((m, i) => {
      const totalSeasons = m.seasons ? m.seasons.length : 1;
      const firstSeasonEpisodes = m.seasons ? m.seasons[0].episodes.length : 10;

      const seasonOptions = Array.from({ length: totalSeasons }, (_, k) =>
        `<option value="${k + 1}">Season ${k + 1}</option>`
      ).join('');

      const episodeOptions = Array.from({ length: firstSeasonEpisodes }, (_, k) =>
        `<option value="${k + 1}">Episode ${k + 1}</option>`
      ).join('');

      const castHTML = m.cast.map(c => `
        <div class="fh-hero__cast-member">
          ${castAvatarHTML(c, 'large')}
          <div class="fh-hero__cast-name">${castName(c)}</div>
        </div>`).join('');

      const slide = document.createElement('div');
      slide.className = 'fh-hero__slide' + (i === 0 ? ' is-active' : '');
      slide.innerHTML = `
        <div class="fh-hero__slide-bg">${backdropImg(m)}</div>
        <div class="fh-hero__content">
          <div class="fh-hero__card" data-hero-id="${m.id}">
            <span class="fh-hero__tag">${i === 0 ? 'Drama Spotlight' : 'Featured Drama'}</span>
            <h1 class="fh-hero__title">${m.title}</h1>
            <div class="fh-hero__meta">
              <span class="fh-hero__pill fh-hero__pill--rating"><i class="fas fa-star"></i> ${m.rating}</span>
              <span class="fh-hero__pill"><i class="fas fa-calendar"></i> ${m.release.slice(0,4)}</span>
              <span class="fh-hero__pill"><i class="fas fa-clock"></i> ${m.runtime}</span>
              <span class="fh-hero__pill">${m.subgenre}</span>
              ${m.kdrama ? '<span class="fh-hero__pill fh-hero__pill--k"><i class="fas fa-heart"></i> K-DRAMA</span>' : ''}
              <span class="fh-hero__pill fh-hero__pill--hd">HD</span>
            </div>
            <p class="fh-hero__desc">${m.desc}</p>
            <div class="fh-hero__cast hide-scrollbar">${castHTML}</div>
            <div class="fh-hero__seasons" data-hero-seasons="${m.id}">
              <div class="fh-hero__select">
                <label>Season</label>
                <select data-season-select="${m.id}">${seasonOptions}</select>
              </div>
              <div class="fh-hero__select">
                <label>Episode</label>
                <select data-episode-select="${m.id}">${episodeOptions}</select>
              </div>
            </div>
            <div class="fh-hero__actions">
              <button class="fh-hero__btn fh-hero__btn--primary" data-open="${m.id}" data-play>
                <i class="fas fa-play"></i> Watch S1 E1
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

    heroSection.addEventListener('change', e => {
      const seasonSelect = e.target.closest('[data-season-select]');
      const episodeSelect = e.target.closest('[data-episode-select]');

      if (seasonSelect) {
        const id = Number(seasonSelect.dataset.seasonSelect);
        const movie = DRAMA_MOVIES.find(x => x.id === id);
        if (!movie) return;
        const seasonNum = Number(seasonSelect.value);
        const season = movie.seasons.find(s => s.num === seasonNum);
        if (!season) return;
        const epWrap = heroSection.querySelector(`[data-hero-seasons="${id}"]`);
        const epSelectEl = epWrap.querySelector(`[data-episode-select="${id}"]`);
        epSelectEl.innerHTML = season.episodes.map(ep =>
          `<option value="${ep.num}">Episode ${ep.num}</option>`
        ).join('');
        updateHeroPlayButton(id);
      }

      if (episodeSelect) {
        const id = Number(episodeSelect.dataset.episodeSelect);
        updateHeroPlayButton(id);
      }
    });

    heroSection.querySelectorAll('[data-season-select]').forEach(sel => {
      updateHeroPlayButton(Number(sel.dataset.seasonSelect));
    });

    state.heroTimer = setInterval(() => showHeroSlide((state.currentHero + 1) % HERO_MOVIES.length), 6500);
  }

  function updateHeroPlayButton(id) {
    const card = heroSection.querySelector(`.fh-hero__card[data-hero-id="${id}"]`);
    if (!card) return;
    const seasonSel = card.querySelector(`[data-season-select="${id}"]`);
    const episodeSel = card.querySelector(`[data-episode-select="${id}"]`);
    const playBtn = card.querySelector('[data-play]');
    if (!seasonSel || !episodeSel || !playBtn) return;
    playBtn.innerHTML = `<i class="fas fa-play"></i> Watch S${seasonSel.value} E${episodeSel.value}`;
    playBtn.dataset.season = seasonSel.value;
    playBtn.dataset.episode = episodeSel.value;
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
    const items = [...DRAMA_MOVIES].sort((a,b) => b.views - a.views).slice(0, 14);
    const html = items.map(m => `
      <div class="fh-marquee__card" data-open="${m.id}">
        ${posterImg(m)}
        <span class="fh-marquee__rate"><i class="fas fa-star"></i> ${m.rating}</span>
        ${m.kdrama ? '<span class="fh-drama-card__kpill">K-DRAMA</span>' : ''}
        <div class="fh-marquee__body">
          <h3 class="fh-marquee__title">${m.title}</h3>
          <div class="fh-marquee__meta">
            <span>${m.release.slice(0,4)}</span>
            <span>·</span>
            <span>${m.seasons.length} Season${m.seasons.length > 1 ? 's' : ''}</span>
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
        const btn = e.target.closest('.fh-drama-sort__btn');
        if (!btn) return;
        sortWrap.querySelectorAll('.fh-drama-sort__btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        state.activeSort = btn.dataset.sort;
        renderGrid(state.activeSort);
      });
    }
  }

  function renderGrid(sortKey) {
    let list = [...DRAMA_MOVIES];
    if (sortKey === 'popular') list.sort((a,b) => b.views - a.views);
    else if (sortKey === 'latest') list.sort((a,b) => new Date(b.release) - new Date(a.release));
    else if (sortKey === 'rating') list.sort((a,b) => parseFloat(b.rating) - parseFloat(a.rating));
    else if (sortKey === 'az') list.sort((a,b) => a.title.localeCompare(b.title));

    gridEl.innerHTML = list.map(renderCard).join('');
    attachHandlers(gridEl);

    const cards = gridEl.querySelectorAll('.fh-drama-card');
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
    const totalEpisodes = m.seasons.reduce((sum, s) => sum + s.episodes.length, 0);
    return `
      <article class="fh-drama-card" data-open="${m.id}" tabindex="0" role="button" aria-label="${m.title}">
        <span class="fh-drama-card__subgenre">${m.subgenre}</span>
        ${m.kdrama ? '<span class="fh-drama-card__kpill">K-DRAMA</span>' : ''}
        <div class="fh-drama-card__media">
          ${posterImg(m)}
          <span class="fh-drama-card__rate"><i class="fas fa-star"></i> ${m.rating}</span>
        </div>
        <div class="fh-drama-card__body">
          <h3 class="fh-drama-card__title">${m.title}</h3>
          <div class="fh-drama-card__meta">
            <span>${m.seasons.length} S · ${totalEpisodes} Ep</span>
            <span>${m.release.slice(0,4)}</span>
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
      const initials = initialsOf(d.name);
      return `
        <div class="fh-drama-director-card">
          <div class="fh-drama-director-card__avatar">${initials}</div>
          <div class="fh-drama-director-card__body">
            <div class="fh-drama-director-card__name">${d.name}</div>
            <div class="fh-drama-director-card__films">${d.films}</div>
            <span class="fh-drama-director-card__tag"><i class="fas fa-masks-theater"></i> ${d.tag}</span>
          </div>
        </div>`;
    }).join('');
    directorTrack.className = 'fh-marquee__track';
    directorTrack.innerHTML = html + html;
    directorTrack.style.animationDuration = '80s';
  }

  function openMovieDetails(movieId) {
    const m = DRAMA_MOVIES.find(x => x.id === movieId);
    if (!m) return;

    const related = DRAMA_MOVIES
      .filter(x => x.id !== m.id && x.genres.some(g => m.genres.includes(g)))
      .slice(0, 6);

    const totalEpisodes = m.seasons.reduce((sum, s) => sum + s.episodes.length, 0);
    const seasonOptions = m.seasons.map(s =>
      `<option value="${s.num}">Season ${s.num}</option>`
    ).join('');

    const firstSeason = m.seasons[0];
    const firstEpisodesHTML = firstSeason.episodes.map(ep => `
      <div class="fh-drawer__episode${ep.num === 1 ? ' is-active' : ''}" data-ep-num="${ep.num}" data-season="${firstSeason.num}">
        <div class="fh-drawer__episode-num">${ep.num}</div>
        <div class="fh-drawer__episode-info">
          <div class="fh-drawer__episode-title">${ep.title}</div>
          <div class="fh-drawer__episode-desc">${ep.desc}</div>
        </div>
        <div class="fh-drawer__episode-dur">${ep.dur}</div>
      </div>
    `).join('');

    drawerBody.innerHTML = `
      <div class="fh-drawer__hero">
        ${backdropImg(m)}
        <div class="fh-drawer__hero-content">
          <h1 class="fh-drawer__title" id="fhDrawerTitle">${m.title}</h1>
          <div class="fh-drawer__meta">
            <span><i class="fas fa-star" style="color:#fbbf24"></i> ${m.rating}</span>
            <span><i class="fas fa-calendar"></i> ${m.release}</span>
            <span><i class="fas fa-list"></i> ${m.seasons.length} Season${m.seasons.length > 1 ? 's' : ''} · ${totalEpisodes} Ep</span>
            <span><i class="fas fa-globe"></i> ${m.language}</span>
            <span>${m.subgenre}${m.kdrama ? ' · K-DRAMA' : ''}</span>
          </div>
          <div class="fh-drawer__actions">
            <button class="fh-drawer__btn fh-drawer__btn--primary" id="fhDrawerPlayBtn"><i class="fas fa-play"></i> Play S1 E1</button>
            <button class="fh-drawer__btn fh-drawer__btn--ghost"><i class="fas fa-film"></i> Trailer</button>
            <button class="fh-drawer__btn fh-drawer__btn--ghost" aria-label="Add to list"><i class="fas fa-plus"></i></button>
          </div>
        </div>
      </div>
      <div class="fh-drawer__content">
        <div>
          <h3 class="fh-drawer__section-title">Overview</h3>
          <p class="fh-drawer__desc">${m.desc}</p>
          <h3 class="fh-drawer__section-title">Episodes</h3>
          <div class="fh-drawer__episode-picker">
            <div class="fh-hero__select">
              <label>Season</label>
              <select id="fhDrawerSeasonSelect">${seasonOptions}</select>
            </div>
            <div class="fh-hero__select">
              <label>Episode</label>
              <select id="fhDrawerEpisodeSelect"></select>
            </div>
          </div>
          <div class="fh-drawer__episodes" id="fhDrawerEpisodes">${firstEpisodesHTML}</div>
          <h3 class="fh-drawer__section-title" style="margin-top:26px">Top Cast</h3>
          <div class="fh-drawer__cast hide-scrollbar">
            ${m.cast.map(c => `
              <div class="fh-drawer__cast-member">
                ${castAvatarHTML(c)}
                <div class="fh-drawer__cast-name">${castName(c)}</div>
              </div>`).join('')}
          </div>
        </div>
        <div class="fh-drawer__info-card">
          <h3 class="fh-drawer__section-title">Details</h3>
          <div class="fh-drawer__info-row"><span class="fh-drawer__info-label">Director</span><span class="fh-drawer__info-value">${m.director}</span></div>
          <div class="fh-drawer__info-row"><span class="fh-drawer__info-label">First Aired</span><span class="fh-drawer__info-value">${m.release}</span></div>
          <div class="fh-drawer__info-row"><span class="fh-drawer__info-label">Genres</span><span class="fh-drawer__info-value">${m.genres.join(', ')}</span></div>
          <div class="fh-drawer__info-row"><span class="fh-drawer__info-label">Language</span><span class="fh-drawer__info-value">${m.language}</span></div>
          <div class="fh-drawer__info-row"><span class="fh-drawer__info-label">Seasons</span><span class="fh-drawer__info-value">${m.seasons.length}</span></div>
          <div class="fh-drawer__info-row"><span class="fh-drawer__info-label">Episodes</span><span class="fh-drawer__info-value">${totalEpisodes}</span></div>
          <div class="fh-drawer__info-row"><span class="fh-drawer__info-label">Views</span><span class="fh-drawer__info-value">${m.views.toLocaleString()}</span></div>
        </div>
      </div>
      <div class="fh-drawer__content" style="grid-template-columns:1fr;padding-top:0">
        <div>
          <h3 class="fh-drawer__section-title">More Like This</h3>
          <div class="fh-marquee__track" id="fhDramaDrawerRelated" style="animation:none;gap:16px;overflow-x:auto"></div>
        </div>
      </div>`;

    const rel = drawerBody.querySelector('#fhDramaDrawerRelated');
    rel.innerHTML = related.map(r => `
      <div class="fh-marquee__card" data-open="${r.id}" style="flex:0 0 auto">
        ${posterImg(r)}
        <span class="fh-marquee__rate"><i class="fas fa-star"></i> ${r.rating}</span>
        <div class="fh-marquee__body">
          <h3 class="fh-marquee__title">${r.title}</h3>
          <div class="fh-marquee__meta"><span>${r.seasons.length} S</span></div>
        </div>
      </div>`).join('');
    attachHandlers(rel);

    initDrawerSeasonEpisode(m);

    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function initDrawerSeasonEpisode(movie) {
    const seasonSelect = drawerBody.querySelector('#fhDrawerSeasonSelect');
    const episodeSelect = drawerBody.querySelector('#fhDrawerEpisodeSelect');
    const episodesList = drawerBody.querySelector('#fhDrawerEpisodes');
    const playBtn = drawerBody.querySelector('#fhDrawerPlayBtn');
    if (!seasonSelect || !episodeSelect || !episodesList || !playBtn) return;

    const renderSeason = (seasonNum) => {
      const season = movie.seasons.find(s => s.num === seasonNum);
      if (!season) return;

      episodeSelect.innerHTML = season.episodes.map(ep =>
        `<option value="${ep.num}">Episode ${ep.num}</option>`
      ).join('');

      episodesList.innerHTML = season.episodes.map(ep => `
        <div class="fh-drawer__episode${ep.num === 1 ? ' is-active' : ''}" data-ep-num="${ep.num}" data-season="${season.num}">
          <div class="fh-drawer__episode-num">${ep.num}</div>
          <div class="fh-drawer__episode-info">
            <div class="fh-drawer__episode-title">${ep.title}</div>
            <div class="fh-drawer__episode-desc">${ep.desc}</div>
          </div>
          <div class="fh-drawer__episode-dur">${ep.dur}</div>
        </div>
      `).join('');

      playBtn.innerHTML = `<i class="fas fa-play"></i> Play S${season.num} E1`;

      episodesList.querySelectorAll('.fh-drawer__episode').forEach(el => {
        el.addEventListener('click', () => {
          episodesList.querySelectorAll('.fh-drawer__episode').forEach(x => x.classList.remove('is-active'));
          el.classList.add('is-active');
          const epNum = Number(el.dataset.epNum);
          episodeSelect.value = String(epNum);
          playBtn.innerHTML = `<i class="fas fa-play"></i> Play S${season.num} E${epNum}`;
        });
      });

      episodeSelect.onchange = () => {
        const epNum = Number(episodeSelect.value);
        episodesList.querySelectorAll('.fh-drawer__episode').forEach(x => {
          x.classList.toggle('is-active', Number(x.dataset.epNum) === epNum);
        });
        playBtn.innerHTML = `<i class="fas fa-play"></i> Play S${season.num} E${epNum}`;
        const target = episodesList.querySelector(`[data-ep-num="${epNum}"][data-season="${season.num}"]`);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      };
    };

    renderSeason(movie.seasons[0].num);

    seasonSelect.addEventListener('change', () => {
      renderSeason(Number(seasonSelect.value));
    });
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

  function initSideCount() {
    if (sideCountEl) sideCountEl.textContent = DRAMA_MOVIES.length + '+';
  }

  function init() {
    initHero();
    initTopWatched();
    initGrid();
    initDirectors();
    initDrawer();
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
      if (Array.isArray(rows) && rows.length) DRAMA_MOVIES = rows;
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