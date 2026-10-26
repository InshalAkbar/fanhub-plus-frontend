(() => {
  'use strict';

  const heroSection = document.getElementById('fhActHero');
  const heroDots = document.getElementById('fhActHeroDots');
  const topWatchedTrack = document.getElementById('fhActTopWatchedTrack');
  const gridEl = document.getElementById('fhActGrid');
  const sortWrap = document.getElementById('fhActSort');
  const directorTrack = document.getElementById('fhActDirectorTrack');
  const drawer = document.getElementById('movieDetailDrawer');
  const drawerBody = document.getElementById('fhDrawerBody');
  const sideCountEl = document.getElementById('fhSideCount');

  const state = { currentHero: 0, heroTimer: null, activeSort: 'popular' };

  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const initials = (name) => String(name || '?')
    .trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();

  const yearOf = (m) => (m.release || '').slice(0, 4) || '—';
  const badgeFor = (m) => (m.views >= 60000 ? '4K' : m.views >= 45000 ? 'HD' : 'NEW');

  const avatarHTML = (person, cls) => {
    const img = person && person.img ? person.img : '';
    const init = esc(initials(person && person.name));
    if (img) {
      return `<div class="${cls} ${cls}--photo"><img src="${esc(img)}" alt="${esc(person.name)}" loading="lazy"
        onerror="this.onerror=null;this.parentNode.classList.remove('${cls}--photo');this.parentNode.innerHTML='${init}';" /></div>`;
    }
    return `<div class="${cls}">${init}</div>`;
  };

  let ACT_MOVIES = [
    { id: 901, title: 'The Dark Knight', subgenre: 'Superhero', genres: ['action','crime','drama'], views: 64000, release: '2008-07-18', rating: '9.0', runtime: '2h 32m',
      img: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
      desc: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
      director: 'Christopher Nolan',
      cast: [
        { name: 'Christian Bale', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Christian_Bale_2019_%28cropped%29.jpg/440px-Christian_Bale_2019_%28cropped%29.jpg' },
        { name: 'Heath Ledger',   img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Heath_Ledger_%28cropped%29.jpg/440px-Heath_Ledger_%28cropped%29.jpg' },
        { name: 'Aaron Eckhart',  img: '' }
      ],
      language: 'EN' },
    { id: 902, title: 'Inception', subgenre: 'Sci-Fi Heist', genres: ['action','sci-fi','thriller'], views: 62000, release: '2010-07-16', rating: '8.8', runtime: '2h 28m',
      img: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
      desc: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
      director: 'Christopher Nolan',
      cast: [
        { name: 'Leonardo DiCaprio', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Leonardo_DiCaprio_2014_%28cropped%29.jpg/440px-Leonardo_DiCaprio_2014_%28cropped%29.jpg' },
        { name: 'Joseph Gordon-Levitt', img: '' },
        { name: 'Tom Hardy', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tom_Hardy_2015_%28cropped%29.jpg/440px-Tom_Hardy_2015_%28cropped%29.jpg' }
      ],
      language: 'EN' },
    { id: 903, title: 'Mad Max: Fury Road', subgenre: 'Post-Apocalyptic', genres: ['action','adventure','sci-fi'], views: 68000, release: '2015-05-15', rating: '8.1', runtime: '2h 0m',
      img: 'https://image.tmdb.org/t/p/w500/hA2YVWonOb5jJk5tno0mC1yKt1M.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/hA2YVWonOb5jJk5tno0mC1yKt1M.jpg',
      desc: 'In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners, a psychotic worshipper, and a drifter named Max.',
      director: 'George Miller',
      cast: [
        { name: 'Tom Hardy', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tom_Hardy_2015_%28cropped%29.jpg/440px-Tom_Hardy_2015_%28cropped%29.jpg' },
        { name: 'Charlize Theron', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Charlize_Theron_2019_%28cropped%29.jpg/440px-Charlize_Theron_2019_%28cropped%29.jpg' },
        { name: 'Nicholas Hoult', img: '' }
      ],
      language: 'EN' },
    { id: 904, title: 'The Matrix', subgenre: 'Cyberpunk', genres: ['action','sci-fi'], views: 61000, release: '1999-03-31', rating: '8.7', runtime: '2h 16m',
      img: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/icmmSD4vTTDKOq2vvdulafOGw93.jpg',
      desc: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
      director: 'The Wachowskis',
      cast: [
        { name: 'Keanu Reeves', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Keanu_Reeves_2019_%28cropped%29.jpg/440px-Keanu_Reeves_2019_%28cropped%29.jpg' },
        { name: 'Laurence Fishburne', img: '' },
        { name: 'Carrie-Anne Moss', img: '' }
      ],
      language: 'EN' },
    { id: 905, title: 'Gladiator', subgenre: 'Historical Epic', genres: ['action','adventure','drama'], views: 59000, release: '2000-05-05', rating: '8.5', runtime: '2h 35m',
      img: 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg',
      desc: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.',
      director: 'Ridley Scott',
      cast: [
        { name: 'Russell Crowe', img: '' },
        { name: 'Joaquin Phoenix', img: '' },
        { name: 'Connie Nielsen', img: '' }
      ],
      language: 'EN' },
    { id: 906, title: 'Top Gun: Maverick', subgenre: 'Aerial Action', genres: ['action','drama'], views: 66000, release: '2022-05-27', rating: '8.4', runtime: '2h 11m',
      img: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
      desc: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN\'s elite graduates on a mission that demands the ultimate sacrifice.',
      director: 'Joseph Kosinski',
      cast: [
        { name: 'Tom Cruise', img: '' },
        { name: 'Miles Teller', img: '' },
        { name: 'Jennifer Connelly', img: '' }
      ],
      language: 'EN' },
    { id: 907, title: 'Spider-Man: No Way Home', subgenre: 'Superhero', genres: ['action','adventure','sci-fi'], views: 65000, release: '2021-12-17', rating: '8.2', runtime: '2h 28m',
      img: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/iQFcwSGbZXMkeyKrxbPnwnRo5fl.jpg',
      desc: 'With Spider-Man\'s identity revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.',
      director: 'Jon Watts',
      cast: [
        { name: 'Tom Holland', img: '' },
        { name: 'Zendaya', img: '' },
        { name: 'Benedict Cumberbatch', img: '' }
      ],
      language: 'EN' },
    { id: 908, title: 'Avengers: Endgame', subgenre: 'Superhero', genres: ['action','adventure','sci-fi'], views: 67000, release: '2019-04-26', rating: '8.4', runtime: '3h 1m',
      img: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
      desc: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos\' actions.',
      director: 'Anthony & Joe Russo',
      cast: [
        { name: 'Robert Downey Jr.', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg/440px-Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg' },
        { name: 'Chris Evans', img: '' },
        { name: 'Scarlett Johansson', img: '' }
      ],
      language: 'EN' },
    { id: 909, title: 'John Wick', subgenre: 'Gun-Fu', genres: ['action','thriller'], views: 64000, release: '2014-10-24', rating: '7.4', runtime: '1h 41m',
      img: 'https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg',
      desc: 'An ex-hitman comes out of retirement to track down the gangsters who killed his dog and stole his car.',
      director: 'Chad Stahelski',
      cast: [
        { name: 'Keanu Reeves', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Keanu_Reeves_2019_%28cropped%29.jpg/440px-Keanu_Reeves_2019_%28cropped%29.jpg' },
        { name: 'Michael Nyqvist', img: '' },
        { name: 'Willem Dafoe', img: '' }
      ],
      language: 'EN' },
    { id: 910, title: 'John Wick: Chapter 4', subgenre: 'Gun-Fu', genres: ['action','crime','thriller'], views: 58000, release: '2023-03-24', rating: '7.7', runtime: '2h 49m',
      img: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/7I6VUdPj6tQECNHdviJkUHD2u89.jpg',
      desc: 'John Wick uncovers a path to defeating the High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe.',
      director: 'Chad Stahelski',
      cast: [
        { name: 'Keanu Reeves', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Keanu_Reeves_2019_%28cropped%29.jpg/440px-Keanu_Reeves_2019_%28cropped%29.jpg' },
        { name: 'Donnie Yen', img: '' },
        { name: 'Bill Skarsgård', img: '' }
      ],
      language: 'EN' },
    { id: 911, title: 'Logan', subgenre: 'Superhero', genres: ['action','drama','sci-fi'], views: 51000, release: '2017-03-03', rating: '8.1', runtime: '2h 17m',
      img: 'https://image.tmdb.org/t/p/w500/fnbjcRDYn6YviCcePDnGdyAkYsB.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/fnbjcRDYn6YviCcePDnGdyAkYsB.jpg',
      desc: 'In a future where mutants are nearly extinct, an elderly and weary Logan leads a quiet life — but his attempts to hide from the world are upended when a young mutant arrives.',
      director: 'James Mangold',
      cast: [
        { name: 'Hugh Jackman', img: '' },
        { name: 'Patrick Stewart', img: '' },
        { name: 'Dafne Keen', img: '' }
      ],
      language: 'EN' },
    { id: 912, title: 'Deadpool', subgenre: 'Superhero', genres: ['action','comedy','adventure'], views: 55000, release: '2016-02-12', rating: '8.0', runtime: '1h 48m',
      img: 'https://image.tmdb.org/t/p/w500/inVq3FRqcYIRl2la8iZikYYxFCO.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/inVq3FRqcYIRl2la8iZikYYxFCO.jpg',
      desc: 'A wisecracking mercenary gets experimented on and becomes immortal but ugly, and sets out to track down the man who ruined his looks.',
      director: 'Tim Miller',
      cast: [
        { name: 'Ryan Reynolds', img: '' },
        { name: 'Morena Baccarin', img: '' },
        { name: 'T.J. Miller', img: '' }
      ],
      language: 'EN' },
    { id: 913, title: 'Guardians of the Galaxy', subgenre: 'Superhero', genres: ['action','adventure','comedy'], views: 53000, release: '2014-08-01', rating: '8.0', runtime: '2h 1m',
      img: 'https://image.tmdb.org/t/p/w500/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg',
      desc: 'A group of intergalactic criminals must pull together to stop a fanatical warrior with plans to purge the universe.',
      director: 'James Gunn',
      cast: [
        { name: 'Chris Pratt', img: '' },
        { name: 'Zoe Saldana', img: '' },
        { name: 'Dave Bautista', img: '' }
      ],
      language: 'EN' },
    { id: 914, title: 'Iron Man', subgenre: 'Superhero', genres: ['action','adventure','sci-fi'], views: 54000, release: '2008-05-02', rating: '7.9', runtime: '2h 6m',
      img: 'https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/78lPtwv72eTNqFW9COBYI0dWDJa.jpg',
      desc: 'After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.',
      director: 'Jon Favreau',
      cast: [
        { name: 'Robert Downey Jr.', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg/440px-Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg' },
        { name: 'Gwyneth Paltrow', img: '' },
        { name: 'Jeff Bridges', img: '' }
      ],
      language: 'EN' },
    { id: 915, title: 'Captain America: Civil War', subgenre: 'Superhero', genres: ['action','adventure','sci-fi'], views: 52000, release: '2016-05-06', rating: '7.8', runtime: '2h 27m',
      img: 'https://image.tmdb.org/t/p/w500/rAGiXaUfPId77WjEqelGxQxHAPs.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/rAGiXaUfPId77WjEqelGxQxHAPs.jpg',
      desc: 'Political involvement in the Avengers\' affairs causes a rift between Captain America and Iron Man.',
      director: 'Anthony & Joe Russo',
      cast: [
        { name: 'Chris Evans', img: '' },
        { name: 'Robert Downey Jr.', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg/440px-Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg' },
        { name: 'Scarlett Johansson', img: '' }
      ],
      language: 'EN' },
    { id: 916, title: 'Thor: Ragnarok', subgenre: 'Superhero', genres: ['action','adventure','comedy'], views: 50000, release: '2017-11-03', rating: '7.9', runtime: '2h 10m',
      img: 'https://image.tmdb.org/t/p/w500/rzRwTcFvttcN1ZpX2xv4j3tSdJu.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/rzRwTcFvttcN1ZpX2xv4j3tSdJu.jpg',
      desc: 'Imprisoned on the planet Sakaar, Thor must race against time to return to Asgard and stop Ragnarök, the destruction of his world.',
      director: 'Taika Waititi',
      cast: [
        { name: 'Chris Hemsworth', img: '' },
        { name: 'Tom Hiddleston', img: '' },
        { name: 'Cate Blanchett', img: '' }
      ],
      language: 'EN' },
    { id: 917, title: 'The Avengers', subgenre: 'Superhero', genres: ['action','adventure','sci-fi'], views: 53000, release: '2012-05-04', rating: '8.0', runtime: '2h 23m',
      img: 'https://image.tmdb.org/t/p/w500/RYMUaGG1rAsFYmB8bGF0TnqxrQ.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/RYMUaGG1rAsFYmB8bGF0TnqxrQ.jpg',
      desc: 'Earth\'s mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.',
      director: 'Joss Whedon',
      cast: [
        { name: 'Robert Downey Jr.', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg/440px-Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg' },
        { name: 'Chris Evans', img: '' },
        { name: 'Scarlett Johansson', img: '' }
      ],
      language: 'EN' },
    { id: 918, title: 'Extraction', subgenre: 'Rescue Mission', genres: ['action','thriller'], views: 42000, release: '2020-04-24', rating: '6.8', runtime: '1h 56m',
      img: 'https://image.tmdb.org/t/p/w500/wlfDaiDtRev4yQ9RoHIgzWQ9JGu.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/wlfDaiDtRev4yQ9RoHIgzWQ9JGu.jpg',
      desc: 'Tyler Rake, a fearless black market mercenary, embarks on the most deadly extraction of his career when he\'s enlisted to rescue the kidnapped son of an imprisoned crime lord.',
      director: 'Sam Hargrave',
      cast: [
        { name: 'Chris Hemsworth', img: '' },
        { name: 'Randeep Hooda', img: '' },
        { name: 'Rudhraksh Jaiswal', img: '' }
      ],
      language: 'EN' },
    { id: 919, title: 'Predator', subgenre: 'Sci-Fi Action', genres: ['action','sci-fi','thriller'], views: 37000, release: '1987-06-12', rating: '7.8', runtime: '1h 47m',
      img: 'https://image.tmdb.org/t/p/w500/k3mW4qfJo6SKgj5IslPidT8oqe.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/k3mW4qfJo6SKgj5IslPidT8oqe.jpg',
      desc: 'A team of commandos on a mission in a Central American jungle find themselves hunted by an extraterrestrial warrior.',
      director: 'John McTiernan',
      cast: [
        { name: 'Arnold Schwarzenegger', img: '' },
        { name: 'Carl Weathers', img: '' },
        { name: 'Bill Duke', img: '' }
      ],
      language: 'EN' },
    { id: 920, title: 'Léon: The Professional', subgenre: 'Hitman', genres: ['action','crime','drama'], views: 45000, release: '1994-11-18', rating: '8.5', runtime: '1h 50m',
      img: 'https://image.tmdb.org/t/p/w500/yI6X2cCM5YPJtxMhUd3dPGqDAhw.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/jRJrQ72VLyEnVsvwfep8Xjlvu8c.jpg',
      desc: '12-year-old Mathilda is reluctantly taken in by Léon, a professional assassin, after her family is murdered. An unusual relationship forms.',
      director: 'Luc Besson',
      cast: [
        { name: 'Jean Reno', img: '' },
        { name: 'Natalie Portman', img: '' },
        { name: 'Gary Oldman', img: '' }
      ],
      language: 'EN' },
    { id: 921, title: 'Casino Royale', subgenre: 'Spy Action', genres: ['action','adventure','thriller'], views: 52000, release: '2006-11-17', rating: '8.0', runtime: '2h 24m',
      img: 'https://image.tmdb.org/t/p/w500/39eejyll0kA1UzRJMQwFbCsIqO2.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/39eejyll0kA1UzRJMQwFbCsIqO2.jpg',
      desc: 'After earning 00 status and a licence to kill, James Bond sets out on his first mission as 007 and must defeat a private banker to terrorists in a high-stakes poker game.',
      director: 'Martin Campbell',
      cast: [
        { name: 'Daniel Craig', img: '' },
        { name: 'Eva Green', img: '' },
        { name: 'Mads Mikkelsen', img: '' }
      ],
      language: 'EN' },
    { id: 922, title: 'Skyfall', subgenre: 'Spy Action', genres: ['action','adventure','thriller'], views: 51000, release: '2012-11-09', rating: '7.8', runtime: '2h 23m',
      img: 'https://image.tmdb.org/t/p/w500/u6h2Hm2yBnRDIzJfTa6qUwqf2DU.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/u6h2Hm2yBnRDIzJfTa6qUwqf2DU.jpg',
      desc: 'James Bond\'s loyalty to M is tested when her past comes back to haunt her. When MI6 comes under attack, 007 must track down and destroy the threat.',
      director: 'Sam Mendes',
      cast: [
        { name: 'Daniel Craig', img: '' },
        { name: 'Javier Bardem', img: '' },
        { name: 'Judi Dench', img: '' }
      ],
      language: 'EN' },
    { id: 923, title: 'Mission: Impossible – Fallout', subgenre: 'Spy Action', genres: ['action','adventure','thriller'], views: 54000, release: '2018-07-27', rating: '7.7', runtime: '2h 27m',
      img: 'https://image.tmdb.org/t/p/w500/AkJQpZp9WoNdj7pLYSj1L0RcMMN.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/AkJQpZp9WoNdj7pLYSj1L0RcMMN.jpg',
      desc: 'Ethan Hunt and his IMF team, along with some familiar allies, race against time after a mission gone wrong.',
      director: 'Christopher McQuarrie',
      cast: [
        { name: 'Tom Cruise', img: '' },
        { name: 'Henry Cavill', img: '' },
        { name: 'Rebecca Ferguson', img: '' }
      ],
      language: 'EN' },
    { id: 924, title: 'Kill Bill: Vol. 1', subgenre: 'Revenge', genres: ['action','crime','thriller'], views: 48000, release: '2003-10-10', rating: '8.2', runtime: '1h 51m',
      img: 'https://image.tmdb.org/t/p/w500/v7TaX8kXMXs5yFFGR41guUDNcnB.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/v7TaX8kXMXs5yFFGR41guUDNcnB.jpg',
      desc: 'After awakening from a four-year coma, a former assassin wreaks vengeance on the team of assassins who betrayed her.',
      director: 'Quentin Tarantino',
      cast: [
        { name: 'Uma Thurman', img: '' },
        { name: 'Lucy Liu', img: '' },
        { name: 'Vivica A. Fox', img: '' }
      ],
      language: 'EN' },
    { id: 925, title: 'The Bourne Identity', subgenre: 'Spy Action', genres: ['action','mystery','thriller'], views: 47000, release: '2002-06-14', rating: '7.9', runtime: '1h 59m',
      img: 'https://image.tmdb.org/t/p/w500/aP8swke3gmowbkfZ6lmRuQ2ZGWF.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/aP8swke3gmowbkfZ6lmRuQ2ZGWF.jpg',
      desc: 'A man is picked up by a fishing boat, bullet-riddled and suffering from amnesia, before racing to elude assassins and attempting to regain his memory.',
      director: 'Doug Liman',
      cast: [
        { name: 'Matt Damon', img: '' },
        { name: 'Franka Potente', img: '' },
        { name: 'Chris Cooper', img: '' }
      ],
      language: 'EN' },
    { id: 926, title: 'Raiders of the Lost Ark', subgenre: 'Adventure', genres: ['action','adventure'], views: 49000, release: '1981-06-12', rating: '8.4', runtime: '1h 55m',
      img: 'https://image.tmdb.org/t/p/w500/ceG9VzoRAVGwivFU403Wc3AHRys.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/ceG9VzoRAVGwivFU403Wc3AHRys.jpg',
      desc: 'In 1936, archaeologist and adventurer Indiana Jones is hired by the U.S. government to find the Ark of the Covenant before Adolf Hitler\'s Nazis can obtain its awesome powers.',
      director: 'Steven Spielberg',
      cast: [
        { name: 'Harrison Ford', img: '' },
        { name: 'Karen Allen', img: '' },
        { name: 'Paul Freeman', img: '' }
      ],
      language: 'EN' },
    { id: 927, title: 'Saving Private Ryan', subgenre: 'War', genres: ['action','drama','war'], views: 50000, release: '1998-07-24', rating: '8.6', runtime: '2h 49m',
      img: 'https://image.tmdb.org/t/p/w500/uqx37cS8cpHg8U35f9U5IBlrCV3.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/uqx37cS8cpHg8U35f9U5IBlrCV3.jpg',
      desc: 'Following the Normandy Landings, a group of U.S. soldiers go behind enemy lines to retrieve a paratrooper whose brothers have been killed in action.',
      director: 'Steven Spielberg',
      cast: [
        { name: 'Tom Hanks', img: '' },
        { name: 'Matt Damon', img: '' },
        { name: 'Tom Sizemore', img: '' }
      ],
      language: 'EN' },
    { id: 928, title: 'Aliens', subgenre: 'Sci-Fi Action', genres: ['action','sci-fi','horror'], views: 46000, release: '1986-07-18', rating: '8.4', runtime: '2h 17m',
      img: 'https://image.tmdb.org/t/p/w500/r1x5JGpyqZU8YmcBaZOLC4g9Zmm.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/r1x5JGpyqZU8YmcBaZOLC4g9Zmm.jpg',
      desc: 'Fifty-seven years after surviving an apocalyptic attack aboard her space vessel by merciless space creatures, Officer Ripley awakens from hyper-sleep and returns to the planet.',
      director: 'James Cameron',
      cast: [
        { name: 'Sigourney Weaver', img: '' },
        { name: 'Michael Biehn', img: '' },
        { name: 'Carrie Henn', img: '' }
      ],
      language: 'EN' },
    { id: 929, title: 'Terminator 2: Judgment Day', subgenre: 'Sci-Fi Action', genres: ['action','sci-fi'], views: 57000, release: '1991-07-03', rating: '8.6', runtime: '2h 17m',
      img: 'https://image.tmdb.org/t/p/w500/2y4q7wWmqrHk0TL8gFSmXBMVHKz.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/2y4q7wWmqrHk0TL8gFSmXBMVHKz.jpg',
      desc: 'A cyborg, identical to the one who failed to kill Sarah Connor, must now protect her ten-year-old son John from a more advanced and powerful cyborg.',
      director: 'James Cameron',
      cast: [
        { name: 'Arnold Schwarzenegger', img: '' },
        { name: 'Linda Hamilton', img: '' },
        { name: 'Edward Furlong', img: '' }
      ],
      language: 'EN' },
    { id: 930, title: 'Die Hard', subgenre: 'One-Man Army', genres: ['action','thriller'], views: 55000, release: '1988-07-15', rating: '8.2', runtime: '2h 12m',
      img: 'https://image.tmdb.org/t/p/w500/1n5p3L5FdxQIDVzVKRcRDoKMhKz.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/1n5p3L5FdxQIDVzVKRcRDoKMhKz.jpg',
      desc: 'An NYPD officer tries to save his wife and several others taken hostage by German terrorists during a Christmas party at the Nakatomi Plaza in Los Angeles.',
      director: 'John McTiernan',
      cast: [
        { name: 'Bruce Willis', img: '' },
        { name: 'Alan Rickman', img: '' },
        { name: 'Bonnie Bedelia', img: '' }
      ],
      language: 'EN' }
  ];

  const HERO_MOVIES = ACT_MOVIES.slice(0, 6);

  const DIRECTORS = [
    { name: 'Christopher Nolan',    films: 'The Dark Knight · Inception · Tenet',  tag: 'Practical Epics' },
    { name: 'James Cameron',        films: 'Terminator 2 · Aliens · Avatar',       tag: 'Sci-Fi Action' },
    { name: 'George Miller',        films: 'Mad Max · Fury Road · Furiosa',        tag: 'Post-Apocalyptic' },
    { name: 'John McTiernan',       films: 'Die Hard · Predator',                  tag: 'One-Man Army' },
    { name: 'Chad Stahelski',       films: 'John Wick 1-4',                        tag: 'Gun-Fu' },
    { name: 'Steven Spielberg',     films: 'Raiders · Saving Private Ryan',        tag: 'Adventure' },
    { name: 'Ridley Scott',         films: 'Gladiator · Black Hawk Down',          tag: 'Historical Epic' },
    { name: 'Quentin Tarantino',    films: 'Kill Bill · Inglourious Basterds',     tag: 'Revenge' },
    { name: 'The Wachowskis',       films: 'The Matrix · Speed Racer',             tag: 'Cyberpunk' },
    { name: 'Sam Mendes',           films: 'Skyfall · 1917',                       tag: 'Spy Action' },
    { name: 'David Leitch',         films: 'Atomic Blonde · Bullet Train',         tag: 'Stylized Action' },
    { name: 'Gareth Evans',         films: 'The Raid · The Raid 2',                tag: 'Martial Arts' }
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
          <img src="${esc(m.backdrop || m.img)}" alt="${esc(m.title)}">
        </div>
        <div class="fh-hero__content">
          <div class="fh-hero__card">
            <span class="fh-hero__tag">Action · Featured</span>
            <h1 class="fh-hero__title">${esc(m.title)}</h1>
            <div class="fh-hero__meta">
              <span class="fh-hero__pill fh-hero__pill--rating"><i class="fas fa-star"></i> ${esc(m.rating)}</span>
              <span class="fh-hero__pill"><i class="fas fa-calendar"></i> ${esc(yearOf(m))}</span>
              <span class="fh-hero__pill"><i class="fas fa-clock"></i> ${esc(m.runtime)}</span>
              <span class="fh-hero__pill">${esc(m.subgenre)}</span>
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
    const items = [...ACT_MOVIES].sort((a, b) => b.views - a.views).slice(0, 14);
    const html = items.map(m => `
      <div class="fh-marquee__card" data-open="${m.id}">
        <img src="${esc(m.img)}" alt="${esc(m.title)}" loading="lazy">
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
        const btn = e.target.closest('.fh-act-sort__btn');
        if (!btn) return;
        sortWrap.querySelectorAll('.fh-act-sort__btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        state.activeSort = btn.dataset.sort;
        renderGrid(state.activeSort);
      });
    }
  }

  function renderGrid(sortKey) {
    let list = [...ACT_MOVIES];
    if (sortKey === 'popular') list.sort((a, b) => b.views - a.views);
    else if (sortKey === 'latest') list.sort((a, b) => new Date(b.release) - new Date(a.release));
    else if (sortKey === 'rating') list.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    else if (sortKey === 'az') list.sort((a, b) => a.title.localeCompare(b.title));

    gridEl.innerHTML = list.map(renderCard).join('');
    attachHandlers(gridEl);

    const cards = gridEl.querySelectorAll('.fh-act-card');
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
      <article class="fh-act-card" data-open="${m.id}" tabindex="0" role="button" aria-label="${esc(m.title)}">
        <span class="fh-act-card__subgenre">${esc(m.subgenre)}</span>
        <span class="fh-act-card__badge">${badgeFor(m)}</span>
        <div class="fh-act-card__media">
          <img src="${esc(m.img)}" alt="${esc(m.title)}" loading="lazy">
          <span class="fh-act-card__rate"><i class="fas fa-star"></i> ${esc(m.rating)}</span>
        </div>
        <div class="fh-act-card__body">
          <h3 class="fh-act-card__title">${esc(m.title)}</h3>
          <div class="fh-act-card__meta">
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
      <div class="fh-act-director-card">
        <div class="fh-act-director-card__avatar">${esc(initials(d.name))}</div>
        <div class="fh-act-director-card__body">
          <div class="fh-act-director-card__name">${esc(d.name)}</div>
          <div class="fh-act-director-card__films">${esc(d.films)}</div>
          <span class="fh-act-director-card__tag"><i class="fas fa-clapperboard"></i> ${esc(d.tag)}</span>
        </div>
      </div>`).join('');
    directorTrack.className = 'fh-marquee__track';
    directorTrack.innerHTML = html + html;
    directorTrack.style.animationDuration = '80s';
  }

  function openMovieDetails(movieId) {
    const m = ACT_MOVIES.find(x => x.id === movieId);
    if (!m || !drawer || !drawerBody) return;

    const related = ACT_MOVIES
      .filter(x => x.id !== m.id && x.genres.some(g => m.genres.includes(g)))
      .slice(0, 6);

    drawerBody.innerHTML = `
      <div class="fh-drawer__hero">
        <img src="${esc(m.backdrop || m.img)}" alt="${esc(m.title)}">
        <div class="fh-drawer__hero-content">
          <h1 class="fh-drawer__title" id="fhDrawerTitle">${esc(m.title)}</h1>
          <div class="fh-drawer__meta">
            <span><i class="fas fa-star" style="color:#fbbf24"></i> ${esc(m.rating)}</span>
            <span><i class="fas fa-calendar"></i> ${esc(yearOf(m))}</span>
            <span><i class="fas fa-clock"></i> ${esc(m.runtime)}</span>
            <span><i class="fas fa-globe"></i> ${esc(m.language)}</span>
            <span><i class="fas fa-film"></i> ${esc(m.subgenre)}</span>
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
          <div class="fh-marquee__track" id="fhActDrawerRelated" style="animation:none;gap:16px;overflow-x:auto"></div>
        </div>
      </div>`;

    const rel = drawerBody.querySelector('#fhActDrawerRelated');
    rel.innerHTML = related.map(r => `
      <div class="fh-marquee__card" data-open="${r.id}" style="flex:0 0 auto">
        <img src="${esc(r.img)}" alt="${esc(r.title)}" loading="lazy">
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
          <img src="${esc(m.img)}" alt="${esc(m.title)}">
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
      return ACT_MOVIES.filter(m =>
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
      if (!q) render(ACT_MOVIES.slice(0, 6), 'popular');
      else render(query(q), q);
    });
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim();
      if (!q) { render(ACT_MOVIES.slice(0, 6), 'popular'); return; }
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
    if (sideCountEl) sideCountEl.textContent = ACT_MOVIES.length + '+';
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
      if (Array.isArray(rows) && rows.length) ACT_MOVIES = rows;
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