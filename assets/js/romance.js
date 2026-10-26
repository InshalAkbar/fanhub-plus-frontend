(() => {
  'use strict';

  const heroSection = document.getElementById('fhRomHero');
  const heroDots = document.getElementById('fhRomHeroDots');
  const topWatchedTrack = document.getElementById('fhRomTopWatchedTrack');
  const gridEl = document.getElementById('fhRomGrid');
  const sortWrap = document.getElementById('fhRomSort');
  const directorTrack = document.getElementById('fhRomDirectorTrack');
  const drawer = document.getElementById('movieDetailDrawer');
  const drawerBody = document.getElementById('fhDrawerBody');
  const sideCountEl = document.getElementById('fhSideCount');

  const state = { currentHero: 0, heroTimer: null, activeSort: 'popular' };

  const BLANK = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

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

  function avatarHTML(person, cls) {
    const img = (person && person.img) ? person.img : '';
    const init = esc(initialsOf(person && person.name));
    if (img) {
      return '<div class="' + cls + ' ' + cls + '--photo"><img src="' + esc(img) + '" alt="' + esc(person.name) + '" loading="lazy" onerror="this.onerror=null;this.style.display=\'none\';this.parentNode.classList.remove(\'' + cls + '--photo\');this.parentNode.innerHTML=\'' + init + '\';" /></div>';
    }
    return '<div class="' + cls + '">' + init + '</div>';
  }

  let MOVIES = [
    { id: 401, title: 'The Notebook', sub: 'Romantic Drama', genres: ['romance','drama'], views: 61000, release: '2004-06-25', rating: '7.8', runtime: '2h 3m',
      img: 'https://image.tmdb.org/t/p/w500/rNzQyW4f8B8cQeg7Dgj3n6eT5k9.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/qomYr4B7HcXyGrpM4CzZ8TshU4H.jpg',
      desc: 'An elderly man reads a love story to a woman in a nursing home — the tale of a young couple torn apart by class and war, and the letters that kept them tethered.',
      director: 'Nick Cassavetes',
      cast: [{name:'Ryan Gosling',img:''},{name:'Rachel McAdams',img:''},{name:'James Garner',img:''}], lang: 'EN' },
    { id: 402, title: 'Pride & Prejudice', sub: 'Period Romance', genres: ['romance','drama'], views: 57000, release: '2005-09-16', rating: '7.8', runtime: '2h 9m',
      img: 'https://image.tmdb.org/t/p/w500/sZ6HkfZQfWmZ1PfBcAtBpiLMBTb.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/6bN4U3tIsPcbV4dMFq5nGybPmKf.jpg',
      desc: 'Elizabeth Bennet navigates family pressure, social expectations, and her own pride as she slowly realises the aloof Mr Darcy may be the only man worth having.',
      director: 'Joe Wright',
      cast: [{name:'Keira Knightley',img:''},{name:'Matthew Macfadyen',img:''},{name:'Brenda Blethyn',img:''}], lang: 'EN' },
    { id: 403, title: 'Titanic', sub: 'Epic Romance', genres: ['romance','drama','history'], views: 66000, release: '1997-12-19', rating: '7.9', runtime: '3h 14m',
      img: 'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/sCzcq8pWZzpMhIvRw8dSkL3Rg9H.jpg',
      desc: 'A penniless artist and a restless aristocrat fall in love aboard the doomed RMS Titanic, discovering in three days a lifetime they will never get to live.',
      director: 'James Cameron',
      cast: [{name:'Leonardo DiCaprio',img:''},{name:'Kate Winslet',img:''},{name:'Billy Zane',img:''}], lang: 'EN' },
    { id: 404, title: 'La La Land', sub: 'Musical Romance', genres: ['romance','musical','drama'], views: 59000, release: '2016-12-09', rating: '8.0', runtime: '2h 8m',
      img: 'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/9YwUuWnYvKkHhZbSp8r5fI5oVYD.jpg',
      desc: 'A jazz pianist and an aspiring actress chase their dreams through a Los Angeles painted in primary colours — and learn that sometimes love means letting go.',
      director: 'Damien Chazelle',
      cast: [{name:'Ryan Gosling',img:''},{name:'Emma Stone',img:''},{name:'John Legend',img:''}], lang: 'EN' },
    { id: 405, title: 'Before Sunrise', sub: 'Indie Romance', genres: ['romance','drama'], views: 52000, release: '1995-01-27', rating: '8.1', runtime: '1h 41m',
      img: 'https://image.tmdb.org/t/p/w500/k2Vg5J7Kj7Xq3f9t2hRj8zYQwV8.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/5B8YkRzQVQcm9g5kYkQyJ1XqPbC.jpg',
      desc: 'Two strangers meet on a train and decide to spend one night walking through Vienna — talking, laughing, and quietly falling in love before sunrise takes them apart.',
      director: 'Richard Linklater',
      cast: [{name:'Ethan Hawke',img:''},{name:'Julie Delpy',img:''},{name:'Andrea Eckert',img:''}], lang: 'EN' },
    { id: 406, title: 'Eternal Sunshine of the Spotless Mind', sub: 'Sci-Fi Romance', genres: ['romance','sci-fi','drama'], views: 55000, release: '2004-03-19', rating: '8.3', runtime: '1h 48m',
      img: 'https://image.tmdb.org/t/p/w500/5MwkWH9tYHv3mV9OdYTMR5qreIz.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/8RwS8gBQa4b5cYh0J5t2VfG6BQz.jpg',
      desc: 'After a painful breakup, Joel discovers his ex has erased him from her memory — and decides to do the same. But saying goodbye to Clementine is harder than memory itself.',
      director: 'Michel Gondry',
      cast: [{name:'Jim Carrey',img:''},{name:'Kate Winslet',img:''},{name:'Kirsten Dunst',img:''}], lang: 'EN' },
    { id: 407, title: 'Casablanca', sub: 'Classic Romance', genres: ['romance','drama','war'], views: 48000, release: '1942-11-26', rating: '8.5', runtime: '1h 42m',
      img: 'https://image.tmdb.org/t/p/w500/5K7cOHoay2mZusSLezBOY0Qxh8a.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/6HFywcT3mZWGeUqVPvJkPfnGqVN.jpg',
      desc: 'In unoccupied Africa during WWII, a cynical nightclub owner must choose between the woman he loves and helping her Resistance-hero husband escape the Nazis.',
      director: 'Michael Curtiz',
      cast: [{name:'Humphrey Bogart',img:''},{name:'Ingrid Bergman',img:''},{name:'Paul Henreid',img:''}], lang: 'EN' },
    { id: 408, title: 'Gone with the Wind', sub: 'Epic Romance', genres: ['romance','drama','history'], views: 45000, release: '1939-12-15', rating: '8.2', runtime: '3h 58m',
      img: 'https://image.tmdb.org/t/p/w500/lNz2Ow0wGCAvzckW7EOjE03KcYv.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/4H8Z0aQz2mQ1s3X0hT8cR5eFgXy.jpg',
      desc: 'Scarlett O\u2019Hara loves a man she cannot have and clings to a South that is slipping away, as the Civil War reshapes everything she once called home.',
      director: 'Victor Fleming',
      cast: [{name:'Vivien Leigh',img:''},{name:'Clark Gable',img:''},{name:'Olivia de Havilland',img:''}], lang: 'EN' },
    { id: 409, title: 'When Harry Met Sally', sub: 'Romantic Comedy', genres: ['romance','comedy'], views: 49000, release: '1989-07-21', rating: '7.7', runtime: '1h 36m',
      img: 'https://image.tmdb.org/t/p/w500/rWlTZVjWlWmCm8bHmZf8XkXkXvX.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/8X8YkRzQVQcm9g5kYkQyJ1XqPbC.jpg',
      desc: 'Can men and women ever really be just friends? Over twelve years and countless New York autumns, Harry and Sally find out the hard way.',
      director: 'Rob Reiner',
      cast: [{name:'Billy Crystal',img:''},{name:'Meg Ryan',img:''},{name:'Carrie Fisher',img:''}], lang: 'EN' },
    { id: 410, title: 'Notting Hill', sub: 'Romantic Comedy', genres: ['romance','comedy'], views: 44000, release: '1999-05-21', rating: '7.2', runtime: '2h 4m',
      img: 'https://image.tmdb.org/t/p/w500/hFj5BmXvx3X3Yw3c5Yh6hG7kY8.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/9Y8YkRzQVQcm9g5kYkQyJ1XqPbC.jpg',
      desc: 'A humble London bookseller\u2019s life is turned upside down when the most famous actress in the world walks into his shop — and then, impossibly, into his life.',
      director: 'Roger Michell',
      cast: [{name:'Julia Roberts',img:''},{name:'Hugh Grant',img:''},{name:'Rhys Ifans',img:''}], lang: 'EN' },
    { id: 411, title: 'Brokeback Mountain', sub: 'Tragic Romance', genres: ['romance','drama','western'], views: 40000, release: '2005-12-09', rating: '7.7', runtime: '2h 14m',
      img: 'https://image.tmdb.org/t/p/w500/a3IEvQp2Kq2hN5rY6P4kG3hKk2d.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/1Y8YkRzQVQcm9g5kYkQyJ1XqPbC.jpg',
      desc: 'Two cowboys form an unlikely bond herding sheep one Wyoming summer — a love they spend the next twenty years unable to name, unable to leave, unable to keep.',
      director: 'Ang Lee',
      cast: [{name:'Heath Ledger',img:''},{name:'Jake Gyllenhaal',img:''},{name:'Michelle Williams',img:''}], lang: 'EN' },
    { id: 412, title: 'Atonement', sub: 'Period Romance', genres: ['romance','drama','war'], views: 41000, release: '2007-09-07', rating: '7.8', runtime: '2h 3m',
      img: 'https://image.tmdb.org/t/p/w500/hMRIyBjPzxaQrOVpKVJY0k5VqD5.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/2Y8YkRzQVQcm9g5kYkQyJ1XqPbC.jpg',
      desc: 'A single childish lie shatters the lives of two young lovers and haunts the girl who told it, across decades and a war that swallows everything it touches.',
      director: 'Joe Wright',
      cast: [{name:'Keira Knightley',img:''},{name:'James McAvoy',img:''},{name:'Saoirse Ronan',img:''}], lang: 'EN' },
    { id: 413, title: 'Call Me by Your Name', sub: 'Coming of Age', genres: ['romance','drama'], views: 39000, release: '2017-11-24', rating: '7.8', runtime: '2h 12m',
      img: 'https://image.tmdb.org/t/p/w500/mZ4gBdfkhP9tvLH1DO4mvL2BbfR.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/3Y8YkRzQVQcm9g5kYkQyJ1XqPbC.jpg',
      desc: 'One sun-drenched Italian summer, a seventeen-year-old boy falls for the older student boarding with his family — and learns, softly, what it means to want.',
      director: 'Luca Guadagnino',
      cast: [{name:'Timoth\u00e9e Chalamet',img:''},{name:'Armie Hammer',img:''},{name:'Michael Stuhlbarg',img:''}], lang: 'EN' },
    { id: 414, title: 'Silver Linings Playbook', sub: 'Romantic Comedy', genres: ['romance','comedy','drama'], views: 42000, release: '2012-11-16', rating: '7.7', runtime: '2h 2m',
      img: 'https://image.tmdb.org/t/p/w500/y7iOVneBv09T4u6hqQ2LwBSP45T.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/4Y8YkRzQVQcm9g5kYkQyJ1XqPbC.jpg',
      desc: 'A man out of a psychiatric hospital and a young widow with her own wounds form an unlikely alliance that slowly becomes something neither of them expected.',
      director: 'David O. Russell',
      cast: [{name:'Bradley Cooper',img:''},{name:'Jennifer Lawrence',img:''},{name:'Robert De Niro',img:''}], lang: 'EN' },
    { id: 415, title: 'Love Actually', sub: 'Holiday Romance', genres: ['romance','comedy'], views: 43000, release: '2003-11-14', rating: '7.6', runtime: '2h 15m',
      img: 'https://image.tmdb.org/t/p/w500/7QPeVsr9rcFU9Gl90yg0gTOTpVv.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/5Y8YkRzQVQcm9g5kYkQyJ1XqPbC.jpg',
      desc: 'Eight loosely connected love stories unfold in the five weeks before Christmas — every one of them convinced that love, actually, is all around.',
      director: 'Richard Curtis',
      cast: [{name:'Hugh Grant',img:''},{name:'Emma Thompson',img:''},{name:'Liam Neeson',img:''}], lang: 'EN' },
    { id: 416, title: 'The Fault in Our Stars', sub: 'Teen Romance', genres: ['romance','drama'], views: 38000, release: '2014-06-06', rating: '7.7', runtime: '2h 6m',
      img: 'https://image.tmdb.org/t/p/w500/dCw2ff6W6rY4nVQdTz7M8Cqy7zK.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/6Y8YkRzQVQcm9g5kYkQyJ1XqPbC.jpg',
      desc: 'Two teenagers who meet at a cancer support group fall in love over shared books, a trip to Amsterdam, and the terrifying truth that time is not on their side.',
      director: 'Josh Boone',
      cast: [{name:'Shailene Woodley',img:''},{name:'Ansel Elgort',img:''},{name:'Nat Wolff',img:''}], lang: 'EN' },
    { id: 417, title: '500 Days of Summer', sub: 'Romantic Comedy', genres: ['romance','comedy','drama'], views: 41000, release: '2009-07-17', rating: '7.7', runtime: '1h 35m',
      img: 'https://image.tmdb.org/t/p/w500/f9mbvQcQ4Jh4K5b6pVg7Xj8zYq1.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/7Y8YkRzQVQcm9g5kYkQyJ1XqPbC.jpg',
      desc: 'A greeting-card writer reflects on the 500 days he spent falling in and out of love with a woman who never quite believed in love at all.',
      director: 'Marc Webb',
      cast: [{name:'Joseph Gordon-Levitt',img:''},{name:'Zooey Deschanel',img:''},{name:'Geoffrey Arend',img:''}], lang: 'EN' },
    { id: 418, title: 'Sense and Sensibility', sub: 'Period Romance', genres: ['romance','drama'], views: 37000, release: '1995-12-13', rating: '7.7', runtime: '2h 16m',
      img: 'https://image.tmdb.org/t/p/w500/g7FyRzg7FxQKv7qT5n3hRz6bVt4.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/8Y8YkRzQVQcm9g5kYkQyJ1XqPbC.jpg',
      desc: 'Two sisters — one governed by sense, the other by sensibility — navigate love, loss, and the small cruelties of a society that prizes fortune over feeling.',
      director: 'Ang Lee',
      cast: [{name:'Emma Thompson',img:''},{name:'Kate Winslet',img:''},{name:'Hugh Grant',img:''}], lang: 'EN' },
    { id: 419, title: 'Brooklyn', sub: 'Period Romance', genres: ['romance','drama'], views: 35000, release: '2015-11-06', rating: '7.5', runtime: '1h 57m',
      img: 'https://image.tmdb.org/t/p/w500/7Y8YkRzQVQcm9g5kYkQyJ1XqPbC.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/9Y8YkRzQVQcm9g5kYkQyJ1XqPbC.jpg',
      desc: 'A young Irish woman emigrates to 1950s Brooklyn, where she builds a new life and falls in love — until a trip home forces her to choose between two futures.',
      director: 'John Crowley',
      cast: [{name:'Saoirse Ronan',img:''},{name:'Emory Cohen',img:''},{name:'Domhnall Gleeson',img:''}], lang: 'EN' },
    { id: 420, title: 'Portrait of a Lady on Fire', sub: 'Period Romance', genres: ['romance','drama','history'], views: 36000, release: '2019-09-18', rating: '8.1', runtime: '2h 2m',
      img: 'https://image.tmdb.org/t/p/w500/2LqaLgk4Z226KkgPJuiOQ58wvrm.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/0Y8YkRzQVQcm9g5kYkQyJ1XqPbC.jpg',
      desc: 'On a windswept Breton island, a painter is hired to secretly paint a reluctant bride-to-be. Between stolen glances, they fall hopelessly in love.',
      director: 'C\u00e9line Sciamma',
      cast: [{name:'No\u00e9mie Merlant',img:''},{name:'Ad\u00e8le Haenel',img:''},{name:'Lu\u00e0na Bajrami',img:''}], lang: 'FR' },
    { id: 421, title: 'Moonlight', sub: 'Coming of Age', genres: ['romance','drama'], views: 34000, release: '2016-10-21', rating: '7.4', runtime: '1h 51m',
      img: 'https://image.tmdb.org/t/p/w500/qAwFbszz0kRyTuXmMeKQZCX3Q2O.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/1Y8YkRzQVQcm9g5kYkQyJ1XqPbC.jpg',
      desc: 'Three chapters in the life of a young Black man in Miami — as he grows from boy to teenager to man, chasing an identity and a love he can barely name.',
      director: 'Barry Jenkins',
      cast: [{name:'Trevante Rhodes',img:''},{name:'Mahershala Ali',img:''},{name:'Naomie Harris',img:''}], lang: 'EN' },
    { id: 422, title: 'Am\u00e9lie', sub: 'Indie Romance', genres: ['romance','comedy'], views: 39000, release: '2001-04-25', rating: '8.3', runtime: '2h 2m',
      img: 'https://image.tmdb.org/t/p/w500/fQq7zN8rGk6zXwYxR0QK8kOq6jX.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/2Y8YkRzQVQcm9g5kYkQyJ1XqPbC.jpg',
      desc: 'A shy Montmartre waitress decides to secretly arrange happiness for everyone around her — until she meets a man who might finally let her choose her own.',
      director: 'Jean-Pierre Jeunet',
      cast: [{name:'Audrey Tautou',img:''},{name:'Mathieu Kassovitz',img:''},{name:'Rufus',img:''}], lang: 'FR' },
    { id: 423, title: 'Moulin Rouge!', sub: 'Musical Romance', genres: ['romance','musical','drama'], views: 38000, release: '2001-05-24', rating: '7.6', runtime: '2h 7m',
      img: 'https://image.tmdb.org/t/p/w500/2PzU4IB8Dr6mxVbq78oL3tAHh0y.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/3Y8YkRzQVQcm9g5kYkQyJ1XqPbC.jpg',
      desc: 'A penniless poet falls for the star courtesan of the Moulin Rouge — in a Bohemian Paris where every love song is a promise and every promise is doomed.',
      director: 'Baz Luhrmann',
      cast: [{name:'Nicole Kidman',img:''},{name:'Ewan McGregor',img:''},{name:'Jim Broadbent',img:''}], lang: 'EN' },
    { id: 424, title: 'Sleepless in Seattle', sub: 'Romantic Comedy', genres: ['romance','comedy'], views: 33000, release: '1993-06-25', rating: '6.8', runtime: '1h 45m',
      img: 'https://image.tmdb.org/t/p/w500/iLmQJm8wR0V3hKw7mH1NfF1yKcQ.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/4Y8YkRzQVQcm9g5kYkQyJ1XqPbC.jpg',
      desc: 'A widower\u2019s young son calls a radio show to find his dad a new wife. On the other side of the country, a reporter in Baltimore starts to wonder.',
      director: 'Nora Ephron',
      cast: [{name:'Tom Hanks',img:''},{name:'Meg Ryan',img:''},{name:'Bill Pullman',img:''}], lang: 'EN' }
  ];

  const HERO_MOVIES = MOVIES.slice(0, 6);

  const DIRECTORS = [
    { name: 'Richard Linklater', films: 'Before Sunrise · Before Sunset', tag: 'Indie Romance' },
    { name: 'Joe Wright',        films: 'Pride & Prejudice · Atonement', tag: 'Period Romance' },
    { name: 'Ang Lee',           films: 'Brokeback Mountain · Sense', tag: 'Tragic Romance' },
    { name: 'Nora Ephron',       films: 'Sleepless in Seattle · You\u2019ve Got Mail', tag: 'Rom-Com' },
    { name: 'James Cameron',     films: 'Titanic · Avatar', tag: 'Epic Romance' },
    { name: 'Damien Chazelle',   films: 'La La Land · Whiplash', tag: 'Musical Romance' },
    { name: 'Michel Gondry',     films: 'Eternal Sunshine · Science of Sleep', tag: 'Sci-Fi Romance' },
    { name: 'Luca Guadagnino',   films: 'Call Me by Your Name · Bones and All', tag: 'Coming of Age' },
    { name: 'C\u00e9line Sciamma', films: 'Portrait of a Lady on Fire · Tomboy', tag: 'Period Romance' },
    { name: 'Barry Jenkins',     films: 'Moonlight · If Beale Street Could Talk', tag: 'Coming of Age' },
    { name: 'Baz Luhrmann',      films: 'Moulin Rouge! · Romeo + Juliet', tag: 'Musical Romance' },
    { name: 'Rob Reiner',        films: 'When Harry Met Sally · The Princess Bride', tag: 'Rom-Com' }
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
          <img src="${esc(m.backdrop || BLANK)}" alt="${esc(m.title)}" onerror="this.onerror=null;this.src='${BLANK}';">
        </div>
        <div class="fh-hero__content">
          <div class="fh-hero__card">
            <span class="fh-hero__tag">Romance · Featured</span>
            <h1 class="fh-hero__title">${esc(m.title)}</h1>
            <div class="fh-hero__meta">
              <span class="fh-hero__pill fh-hero__pill--rose">${esc(m.sub)}</span>
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
        <img src="${esc(m.img)}" alt="${esc(m.title)}" loading="lazy" onerror="this.onerror=null;this.src='${BLANK}';">
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
        const btn = e.target.closest('.fh-rom-sort__btn');
        if (!btn) return;
        sortWrap.querySelectorAll('.fh-rom-sort__btn').forEach(b => b.classList.remove('is-active'));
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

    const cards = gridEl.querySelectorAll('.fh-rom-card');
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
      <article class="fh-rom-card" data-open="${m.id}" tabindex="0" role="button" aria-label="${esc(m.title)}">
        <span class="fh-rom-card__subgenre">${esc(m.sub)}</span>
        <span class="fh-rom-card__badge">${badgeFor(m)}</span>
        <div class="fh-rom-card__media">
          <img src="${esc(m.img)}" alt="${esc(m.title)}" loading="lazy" onerror="this.onerror=null;this.src='${BLANK}';">
          <span class="fh-rom-card__rate"><i class="fas fa-star"></i> ${esc(m.rating)}</span>
        </div>
        <div class="fh-rom-card__body">
          <h3 class="fh-rom-card__title">${esc(m.title)}</h3>
          <div class="fh-rom-card__meta">
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
      <div class="fh-rom-director-card">
        <div class="fh-rom-director-card__avatar">${esc(initialsOf(d.name))}</div>
        <div class="fh-rom-director-card__body">
          <div class="fh-rom-director-card__name">${esc(d.name)}</div>
          <div class="fh-rom-director-card__films">${esc(d.films)}</div>
          <span class="fh-rom-director-card__tag"><i class="fas fa-heart"></i> ${esc(d.tag)}</span>
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
        <img src="${esc(m.backdrop || m.img)}" alt="${esc(m.title)}" onerror="this.onerror=null;this.src='${BLANK}';">
        <div class="fh-drawer__hero-content">
          <h1 class="fh-drawer__title" id="fhDrawerTitle">${esc(m.title)}</h1>
          <div class="fh-drawer__meta">
            <span><i class="fas fa-star" style="color:#fbbf24"></i> ${esc(m.rating)}</span>
            <span><i class="fas fa-calendar"></i> ${esc(yearOf(m))}</span>
            <span><i class="fas fa-clock"></i> ${esc(m.runtime)}</span>
            <span><i class="fas fa-globe"></i> ${esc(m.lang)}</span>
            <span><i class="fas fa-heart"></i> ${esc(m.sub)}</span>
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
          <div class="fh-marquee__track" id="fhRomDrawerRelated" style="animation:none;gap:16px;overflow-x:auto"></div>
        </div>
      </div>`;

    const rel = drawerBody.querySelector('#fhRomDrawerRelated');
    rel.innerHTML = related.map(r => `
      <div class="fh-marquee__card" data-open="${r.id}" style="flex:0 0 auto">
        <img src="${esc(r.img)}" alt="${esc(r.title)}" loading="lazy" onerror="this.onerror=null;this.src='${BLANK}';">
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
          <img src="${esc(m.img)}" alt="${esc(m.title)}" onerror="this.onerror=null;this.src='${BLANK}';">
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