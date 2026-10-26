(() => {
  'use strict';

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function initials(name) {
    return String(name || '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  const yearOf = m => (m.release || '').slice(0, 4) || '—';
  const badgeFor = m => m.views >= 55000 ? '4K' : m.views >= 38000 ? 'HD' : 'NEW';

  const posterFor       = id => `https://picsum.photos/seed/tv-poster-${id}/500/750`;
  const backdropFor     = id => `https://picsum.photos/seed/tv-back-${id}/1600/900`;
  const castAvatarFor   = seed => `https://picsum.photos/seed/tv-cast-${encodeURIComponent(seed)}/200/200`;
  const episodeThumbFor = (id, s, e) => `https://picsum.photos/seed/tv-ep-${id}-${s}-${e}/320/180`;

  function avatarHTML(person, cls) {
    const seed = encodeURIComponent((person && person.name) || 'x');
    const img  = castAvatarFor(seed);
    const init = esc(initials(person && person.name));
    return `<div class="${cls} ${cls}--photo">
      <img src="${img}" alt="${esc(person.name)}" loading="lazy"
           onerror="this.onerror=null;this.parentNode.classList.remove('${cls}--photo');this.parentNode.innerHTML='${init}';" />
    </div>`;
  }

  let SHOWS = [
    { id: 801, title: 'Breaking Bad', sub: 'Crime Drama',
      genres: ['crime','drama','thriller'], views: 68000, release: '2008-01-20',
      rating: '9.5', runtime: '49m',
      desc: 'A high school chemistry teacher diagnosed with terminal cancer turns to manufacturing methamphetamine to secure his family\'s future — and slowly transforms into the very monster he once feared.',
      creator: 'Vince Gilligan',
      cast: [{name:'Bryan Cranston'},{name:'Aaron Paul'},{name:'Anna Gunn'}],
      lang: 'EN',
      seasons: [
        { number: 1, year: '2008', episodes: [
          { number: 1, title: 'Pilot', runtime: '58m', rating: '8.9', desc: 'A chemistry teacher receives a devastating diagnosis and makes a life-changing decision.' },
          { number: 2, title: "Cat's in the Bag...", runtime: '48m', rating: '8.6', desc: 'Walt and Jesse face the messy consequences of their first cook.' },
          { number: 3, title: "...And the Bag's in the River", runtime: '48m', rating: '8.7', desc: 'Walt struggles with a moral decision while Jesse tries to clean up loose ends.' },
          { number: 4, title: 'Cancer Man', runtime: '48m', rating: '8.2', desc: 'Walt tells his family about his diagnosis as pressure builds on all sides.' },
          { number: 5, title: 'Gray Matter', runtime: '48m', rating: '8.3', desc: 'An old friend offers help, but pride keeps Walt from accepting it.' }
        ]},
        { number: 2, year: '2009', episodes: [
          { number: 1, title: 'Seven Thirty-Seven', runtime: '47m', rating: '8.8', desc: 'Walt and Jesse face the fallout from their latest deal gone wrong.' },
          { number: 2, title: 'Grilled', runtime: '48m', rating: '9.0', desc: 'A tense meeting turns deadly as the pair is forced onto the road.' },
          { number: 3, title: 'Bit by a Dead Bee', runtime: '47m', rating: '8.3', desc: 'Walt and Jesse improvise separate cover stories to explain their absence.' },
          { number: 4, title: 'Down', runtime: '47m', rating: '8.4', desc: 'The strain on Walt\'s marriage deepens as his double life grows heavier.' },
          { number: 5, title: 'Breakage', runtime: '47m', rating: '8.5', desc: 'Jesse takes the lead on distribution while Walt wrestles with boundaries.' }
        ]},
        { number: 3, year: '2010', episodes: [
          { number: 1, title: 'No Más', runtime: '47m', rating: '8.9', desc: 'Walt tries to walk away — but the game has other plans for him.' },
          { number: 2, title: 'Caballo sin Nombre', runtime: '47m', rating: '8.5', desc: 'Walt returns home to a house that no longer feels like his own.' },
          { number: 3, title: 'I.F.T.', runtime: '47m', rating: '8.3', desc: 'A confession explodes into a confrontation that changes everything.' },
          { number: 4, title: 'Green Light', runtime: '47m', rating: '8.4', desc: 'Walt makes a reckless move that draws unwanted attention.' },
          { number: 5, title: 'Más', runtime: '47m', rating: '8.6', desc: 'The operation expands as Walt struggles to keep control.' }
        ]}
      ]},
    { id: 802, title: 'Game of Thrones', sub: 'Epic Fantasy',
      genres: ['fantasy','drama','adventure'], views: 66000, release: '2011-04-17',
      rating: '9.2', runtime: '57m',
      desc: 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.',
      creator: 'David Benioff & D. B. Weiss',
      cast: [{name:'Emilia Clarke'},{name:'Peter Dinklage'},{name:'Kit Harington'}],
      lang: 'EN',
      seasons: [
        { number: 1, year: '2011', episodes: [
          { number: 1, title: 'Winter Is Coming', runtime: '62m', rating: '9.0', desc: 'The Starks receive a royal visit as winter approaches and old oaths are tested.' },
          { number: 2, title: 'The Kingsroad', runtime: '56m', rating: '8.7', desc: 'Journeys begin and loyalties shift as the realm stirs.' },
          { number: 3, title: 'Lord Snow', runtime: '58m', rating: '8.6', desc: 'Ned faces the realities of court while Jon adjusts to life at the Wall.' },
          { number: 4, title: 'Cripples, Bastards, and Broken Things', runtime: '56m', rating: '8.6', desc: 'Secrets surface as the tournament looms and tensions rise.' },
          { number: 5, title: 'The Wolf and the Lion', runtime: '55m', rating: '8.9', desc: 'A confrontation in King\'s Landing changes the balance of power.' }
        ]},
        { number: 2, year: '2012', episodes: [
          { number: 1, title: 'The North Remembers', runtime: '53m', rating: '8.7', desc: 'War spreads as new kings rise and old alliances fray.' },
          { number: 2, title: 'The Night Lands', runtime: '54m', rating: '8.5', desc: 'Arya travels north under a false identity as Tyrion takes stock.' },
          { number: 3, title: 'What Is Dead May Never Die', runtime: '53m', rating: '8.6', desc: 'Alliances form and betrayals simmer across the war-torn realm.' },
          { number: 4, title: 'Garden of Bones', runtime: '51m', rating: '8.7', desc: 'Captives meet new fates as a shadow is born in the east.' },
          { number: 5, title: 'The Ghost of Harrenhal', runtime: '55m', rating: '8.9', desc: 'Plans advance and promises are made in the shadows of a ruined castle.' }
        ]},
        { number: 3, year: '2013', episodes: [
          { number: 1, title: 'Valar Dohaeris', runtime: '55m', rating: '8.7', desc: 'New beginnings and old debts collide as the war grinds on.' },
          { number: 2, title: 'Dark Wings, Dark Words', runtime: '56m', rating: '8.6', desc: 'Oaths are sworn and broken as travelers move through hostile lands.' },
          { number: 3, title: 'Walk of Punishment', runtime: '56m', rating: '8.8', desc: 'Bargains are struck and hands are lost in the pursuit of power.' },
          { number: 4, title: 'And Now His Watch Is Ended', runtime: '53m', rating: '9.1', desc: 'Chains are broken and fire answers steel.' },
          { number: 5, title: 'Kissed by Fire', runtime: '57m', rating: '9.0', desc: 'A trial by combat and a quiet wedding reshape two houses.' }
        ]}
      ]},
    { id: 803, title: 'Stranger Things', sub: 'Sci-Fi Horror',
      genres: ['sci-fi','horror','mystery'], views: 62000, release: '2016-07-15',
      rating: '8.7', runtime: '51m',
      desc: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.',
      creator: 'The Duffer Brothers',
      cast: [{name:'Millie Bobby Brown'},{name:'Finn Wolfhard'},{name:'Winona Ryder'}],
      lang: 'EN',
      seasons: [
        { number: 1, year: '2016', episodes: [
          { number: 1, title: 'The Vanishing of Will Byers', runtime: '47m', rating: '8.6', desc: 'A quiet night in Hawkins ends with a boy gone and a town on edge.' },
          { number: 2, title: 'The Weirdo on Maple Street', runtime: '55m', rating: '8.7', desc: 'The boys meet a girl with powers they cannot explain.' },
          { number: 3, title: 'Holly, Jolly', runtime: '51m', rating: '8.9', desc: 'The search for Will grows darker as Barb vanishes too.' },
          { number: 4, title: 'The Body', runtime: '50m', rating: '8.8', desc: 'Grief grips Hawkins while Hopper begins to see the truth.' },
          { number: 5, title: 'The Flea and the Acrobat', runtime: '52m', rating: '8.7', desc: 'A gate is found and a monster gets a name.' }
        ]},
        { number: 2, year: '2017', episodes: [
          { number: 1, title: 'MADMAX', runtime: '48m', rating: '8.6', desc: 'A year later, a new girl in town hides a secret of her own.' },
          { number: 2, title: 'Trick or Treat, Freak', runtime: '56m', rating: '8.7', desc: 'Halloween night brings unsettling visions and strange visitors.' },
          { number: 3, title: 'The Pollywog', runtime: '51m', rating: '8.8', desc: 'Dustin makes a strange new friend as Will faces the shadow again.' },
          { number: 4, title: 'Dig Dug', runtime: '51m', rating: '8.7', desc: 'The party digs deeper into the tunnels beneath Hawkins.' },
          { number: 5, title: 'Will the Wise', runtime: '46m', rating: '8.6', desc: 'Old secrets surface and new alliances take shape.' }
        ]}
      ]},
    { id: 804, title: 'Chernobyl', sub: 'Historical Drama',
      genres: ['drama','history','thriller'], views: 58000, release: '2019-05-06',
      rating: '9.4', runtime: '65m',
      desc: 'A dramatisation of the 1986 nuclear accident and the sacrifices made to save Europe from an unimaginable disaster.',
      creator: 'Craig Mazin',
      cast: [{name:'Jared Harris'},{name:'Stellan Skarsgård'},{name:'Emily Watson'}],
      lang: 'EN',
      seasons: [
        { number: 1, year: '2019', episodes: [
          { number: 1, title: '1:23:45', runtime: '65m', rating: '9.3', desc: 'The night of the explosion and the first lies told to contain it.' },
          { number: 2, title: 'Please Remain Calm', runtime: '65m', rating: '9.2', desc: 'Scientists rush to stop a second explosion that could devastate Europe.' },
          { number: 3, title: 'Open Wide, O Earth', runtime: '60m', rating: '9.4', desc: 'The cost of heroism is measured in lives as the reactor burns.' },
          { number: 4, title: 'The Happiness of All Mankind', runtime: '64m', rating: '9.5', desc: 'Liquidators face an impossible task while a trial looms.' },
          { number: 5, title: 'Vichnaya Pamyat', runtime: '72m', rating: '9.7', desc: 'The truth is finally told — and it is more horrifying than anyone imagined.' }
        ]}
      ]},
    { id: 805, title: 'The Wire', sub: 'Crime Drama',
      genres: ['crime','drama','thriller'], views: 54000, release: '2002-06-02',
      rating: '9.3', runtime: '59m',
      desc: 'The Baltimore drug scene, as seen through the eyes of drug dealers and law enforcement — a portrait of a city and its institutions.',
      creator: 'David Simon',
      cast: [{name:'Dominic West'},{name:'Idris Elba'},{name:'Michael K. Williams'}],
      lang: 'EN',
      seasons: [
        { number: 1, year: '2002', episodes: [
          { number: 1, title: 'The Target', runtime: '60m', rating: '8.9', desc: 'A homicide detective finds a witness willing to talk, but nothing is simple.' },
          { number: 2, title: 'The Detail', runtime: '58m', rating: '8.6', desc: 'A detail is assembled to bring down a drug crew from the top.' },
          { number: 3, title: 'The Buys', runtime: '56m', rating: '8.7', desc: 'The wire begins to yield secrets as both sides feel the pressure.' },
          { number: 4, title: 'Old Cases', runtime: '59m', rating: '8.5', desc: 'Old cases reopen and new ones get personal.' },
          { number: 5, title: 'The Pager', runtime: '58m', rating: '8.8', desc: 'A wiretap opens doors as the crew senses the walls closing in.' }
        ]},
        { number: 2, year: '2003', episodes: [
          { number: 1, title: 'Ebb Tide', runtime: '58m', rating: '8.4', desc: 'A new case pulls the detail into the dying docks of Baltimore.' },
          { number: 2, title: 'Collateral Damage', runtime: '57m', rating: '8.5', desc: 'The union\'s grip tightens as bodies pile up.' },
          { number: 3, title: 'Hot Shots', runtime: '56m', rating: '8.6', desc: 'Old wounds reopen as the detail follows a thread into the harbor.' },
          { number: 4, title: 'Hard Cases', runtime: '58m', rating: '8.7', desc: 'Loyalties are tested when the truth collides with survival.' },
          { number: 5, title: 'Undertow', runtime: '57m', rating: '8.8', desc: 'The current pulls everyone under as the season\'s end nears.' }
        ]}
      ]},
    { id: 806, title: 'Peaky Blinders', sub: 'Period Crime',
      genres: ['crime','drama','history'], views: 56000, release: '2013-09-12',
      rating: '8.8', runtime: '56m',
      desc: 'A gangster family epic set in 1900s England, centering on a gang who sew razor blades in the peaks of their caps — and their fierce boss Tommy Shelby.',
      creator: 'Steven Knight',
      cast: [{name:'Cillian Murphy'},{name:'Helen McCrory'},{name:'Paul Anderson'}],
      lang: 'EN',
      seasons: [
        { number: 1, year: '2013', episodes: [
          { number: 1, title: 'Episode 1', runtime: '57m', rating: '8.4', desc: 'Tommy Shelby returns from the war to find his family\'s empire under threat.' },
          { number: 2, title: 'Episode 2', runtime: '59m', rating: '8.5', desc: 'A stolen crate puts the Peaky Blinders on a collision course with the law.' },
          { number: 3, title: 'Episode 3', runtime: '55m', rating: '8.7', desc: 'Tommy plays a dangerous game with police and rivals alike.' },
          { number: 4, title: 'Episode 4', runtime: '56m', rating: '8.8', desc: 'Old alliances break as the family closes ranks.' }
        ]},
        { number: 2, year: '2014', episodes: [
          { number: 1, title: 'Episode 1', runtime: '58m', rating: '8.7', desc: 'A new decade begins and the Shelbys eye a bigger prize.' },
          { number: 2, title: 'Episode 2', runtime: '59m', rating: '8.8', desc: 'Tommy\'s plans draw in dangerous new players from London.' },
          { number: 3, title: 'Episode 3', runtime: '57m', rating: '8.7', desc: 'Rivalries intensify as the family prepares for war.' },
          { number: 4, title: 'Episode 4', runtime: '56m', rating: '9.0', desc: 'The line between business and bloodshed is crossed.' }
        ]}
      ]}
  ];

  const CREATORS = [
    { name: 'Vince Gilligan',              shows: 'Breaking Bad · Better Call Saul', tag: 'Crime Drama' },
    { name: 'David Benioff & D. B. Weiss', shows: 'Game of Thrones · 3 Body Problem', tag: 'Epic Fantasy' },
    { name: 'The Duffer Brothers',         shows: 'Stranger Things', tag: 'Sci-Fi Horror' },
    { name: 'Craig Mazin',                 shows: 'Chernobyl · The Last of Us', tag: 'Historical Drama' },
    { name: 'David Simon',                 shows: 'The Wire · The Deuce', tag: 'Crime Drama' },
    { name: 'Steven Knight',               shows: 'Peaky Blinders · See', tag: 'Period Crime' }
  ];

  const state = {
    heroIndex: 0,
    heroTimer: null,
    sort: 'popular',
    activeSeason: {},
    selectedEpisode: {}
  };

  function init() {
    const hero       = $('#tsHero');
    const heroDots   = $('#tsHeroDots');
    const topTrack   = $('#tsTopWatchedTrack');
    const gridEl     = $('#tsGrid');
    const sortWrap   = $('#tsSort');
    const creatorTk  = $('#tsCreatorTrack');
    const drawer     = $('#tsDrawer');
    const drawerBody = $('#tsDrawerBody');
    const sideCount  = $('#tsSideCount');

    if (!hero || !gridEl || !sortWrap) return;

    const heroSlides = SHOWS.slice(0, 6);

    function seasonCountOf(show) {
      return (show && show.seasons) ? show.seasons.length : 0;
    }

    function buildHero() {
      const slidesHTML = heroSlides.map((m, i) => {
        const castHTML = (m.cast || []).map(c =>
          `<div class="ts-hero__cast-member">${avatarHTML(c, 'ts-hero__cast-avatar')}<span class="ts-hero__cast-name">${esc(c.name)}</span></div>`
        ).join('');
        const seasonCount = seasonCountOf(m);
        return `<div class="ts-hero__slide${i === 0 ? ' is-active' : ''}">
          <div class="ts-hero__bg"><img src="${backdropFor(m.id)}" alt="${esc(m.title)}" /></div>
          <div class="ts-hero__content">
            <div class="ts-hero__card">
              <span class="ts-hero__tag">TV Series · Featured</span>
              <h1 class="ts-hero__title">${esc(m.title)}</h1>
              <div class="ts-hero__meta">
                <span class="ts-hero__pill ts-hero__pill--emerald">${esc(m.sub)}</span>
                <span class="ts-hero__pill ts-hero__pill--rating"><i class="fas fa-star"></i> ${esc(m.rating)}</span>
                <span class="ts-hero__pill"><i class="fas fa-calendar"></i> ${esc(yearOf(m))}</span>
                <span class="ts-hero__pill"><i class="fas fa-layer-group"></i> ${seasonCount} Seasons</span>
                <span class="ts-hero__pill ts-hero__pill--hd">${badgeFor(m)}</span>
              </div>
              <p class="ts-hero__desc">${esc(m.desc)}</p>
              <div class="ts-hero__cast hide-scrollbar">${castHTML}</div>
              <div class="ts-hero__actions">
                <button class="ts-hero__btn ts-hero__btn--primary" data-open="${m.id}" type="button">
                  <i class="fas fa-play"></i> Watch Now
                </button>
                <button class="ts-hero__btn ts-hero__btn--ghost" data-open="${m.id}" type="button">
                  <i class="fas fa-circle-info"></i> Details
                </button>
              </div>
            </div>
          </div>
        </div>`;
      }).join('');

      hero.insertAdjacentHTML('beforeend', slidesHTML);

      heroDots.innerHTML = heroSlides.map((m, i) =>
        `<button class="ts-hero__dot${i === 0 ? ' is-active' : ''}" data-hero-dot="${i}" aria-label="${esc(m.title)}" type="button"></button>`
      ).join('');
    }

    function goHero(index) {
      const slides = $$('.ts-hero__slide', hero);
      const dots = $$('.ts-hero__dot', heroDots);
      if (!slides.length) return;
      const next = ((index % slides.length) + slides.length) % slides.length;
      state.heroIndex = next;
      slides.forEach((s, i) => s.classList.toggle('is-active', i === next));
      dots.forEach((d, i) => {
        d.classList.remove('is-active');
        if (i === next) { void d.offsetWidth; d.classList.add('is-active'); }
      });
    }

    function startHeroTimer() {
      if (state.heroTimer) clearInterval(state.heroTimer);
      state.heroTimer = setInterval(() => goHero(state.heroIndex + 1), 6000);
    }

    function renderTopWatched() {
      const list = SHOWS.slice().sort((a, b) => b.views - a.views).slice(0, 6);
      const items = list.map(m => {
        const seasonCount = seasonCountOf(m);
        return `<article class="ts-marquee__card" data-open="${m.id}" tabindex="0" role="button" aria-label="${esc(m.title)}">
          <span class="ts-marquee__rate"><i class="fas fa-star"></i> ${esc(m.rating)}</span>
          <img src="${posterFor(m.id)}" alt="${esc(m.title)} poster" loading="lazy" />
          <div class="ts-marquee__body">
            <h3 class="ts-marquee__title">${esc(m.title)}</h3>
            <div class="ts-marquee__meta">
              <span>${esc(yearOf(m))}</span>
              <span>·</span>
              <span>${seasonCount} Seasons</span>
            </div>
          </div>
        </article>`;
      }).join('');
      topTrack.innerHTML = `<div class="ts-marquee__track">${items}${items}</div>`;
    }

    function renderCreators() {
      const items = CREATORS.map(d =>
        `<article class="ts-creator">
          <div class="ts-creator__avatar">${esc(initials(d.name))}</div>
          <div class="ts-creator__body">
            <h3 class="ts-creator__name">${esc(d.name)}</h3>
            <p class="ts-creator__shows">${esc(d.shows)}</p>
            <span class="ts-creator__tag"><i class="fas fa-clapperboard"></i> ${esc(d.tag)}</span>
          </div>
        </article>`
      ).join('');
      creatorTk.innerHTML = `<div class="ts-marquee__track">${items}${items}</div>`;
    }

    function sortShows(list, mode) {
      const out = list.slice();
      switch (mode) {
        case 'latest': return out.sort((a, b) => (b.release || '').localeCompare(a.release || ''));
        case 'rating': return out.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        case 'az':     return out.sort((a, b) => a.title.localeCompare(b.title));
        default:       return out.sort((a, b) => b.views - a.views);
      }
    }

    function cardHTML(m) {
      const seasonCount = seasonCountOf(m);
      return `<article class="ts-card" data-open="${m.id}" tabindex="0" role="button" aria-label="${esc(m.title)}">
        <div class="ts-card__media">
          <span class="ts-card__sub">${esc(m.sub)}</span>
          <span class="ts-card__rate"><i class="fas fa-star"></i> ${esc(m.rating)}</span>
          <span class="ts-card__seasons"><i class="fas fa-layer-group"></i> ${seasonCount} Seasons</span>
          <img src="${backdropFor(m.id)}" alt="${esc(m.title)} poster" loading="lazy" />
          <span class="ts-card__badge">${badgeFor(m)}</span>
        </div>
        <div class="ts-card__body">
          <h3 class="ts-card__title">${esc(m.title)}</h3>
          <div class="ts-card__meta">
            <span>${esc(yearOf(m))}</span>
            <span>${esc(m.runtime)} / ep</span>
          </div>
        </div>
      </article>`;
    }

    function renderGrid() {
      const data = sortShows(SHOWS, state.sort);
      gridEl.innerHTML = data.map(cardHTML).join('');
      const cards = $$('.ts-card', gridEl);
      let i = 0;
      function revealBatch() {
        const end = Math.min(i + 4, cards.length);
        for (; i < end; i++) if (cards[i]) cards[i].classList.add('is-visible');
        if (i < cards.length) requestAnimationFrame(revealBatch);
      }
      requestAnimationFrame(revealBatch);
    }

    function drawerRow(label, value) {
      return `<div class="ts-drawer__row">
        <span class="ts-drawer__row-label">${esc(label)}</span>
        <span class="ts-drawer__row-value">${esc(value)}</span>
      </div>`;
    }

    function seasonTabsHTML(show, activeNumber) {
      return show.seasons.map(s => {
        const cls = 'ts-season-tab' + (s.number === activeNumber ? ' is-active' : '');
        return `<button class="${cls}" type="button" data-season="${s.number}">
          <span>Season ${s.number}</span>
          <span class="ts-season-tab__year">${esc(s.year)}</span>
        </button>`;
      }).join('');
    }

    function episodeHTML(show, season, ep, isSelected) {
      const cls = 'ts-episode' + (isSelected ? ' is-selected' : '');
      return `<article class="${cls}" data-episode="${ep.number}" tabindex="0" role="button"
                  aria-label="Episode ${ep.number}: ${esc(ep.title)}">
        <div class="ts-episode__thumb">
          <span class="ts-episode__num">EP ${ep.number}</span>
          <img src="${episodeThumbFor(show.id, season.number, ep.number)}"
               alt="Episode ${ep.number} thumbnail" loading="lazy" />
          <span class="ts-episode__play"><i class="fas fa-play"></i></span>
        </div>
        <div class="ts-episode__body">
          <div class="ts-episode__head">
            <h4 class="ts-episode__title">${esc(ep.title)}</h4>
            <span class="ts-episode__rate"><i class="fas fa-star"></i> ${esc(ep.rating)}</span>
          </div>
          <p class="ts-episode__desc">${esc(ep.desc)}</p>
          <div class="ts-episode__foot">
            <span><i class="fas fa-clock"></i> ${esc(ep.runtime)}</span>
          </div>
        </div>
      </article>`;
    }

    function episodesHTML(show, seasonNumber) {
      const season = show.seasons.find(s => s.number === seasonNumber);
      if (!season) return '';
      const selected = state.selectedEpisode[show.id + '-' + seasonNumber] || 0;
      return season.episodes.map(ep => episodeHTML(show, season, ep, ep.number === selected)).join('');
    }

    function seasonsSectionHTML(show) {
      const active = state.activeSeason[show.id] || (show.seasons[0] && show.seasons[0].number);
      state.activeSeason[show.id] = active;
      const activeSeason = show.seasons.find(s => s.number === active);
      const epCount = activeSeason ? activeSeason.episodes.length : 0;
      return `<section class="ts-seasons" data-show-id="${show.id}">
        <div class="ts-seasons__head">
          <h3 class="ts-seasons__title">
            <i class="fas fa-layer-group"></i>
            Seasons & Episodes
            <span class="ts-seasons__count">${epCount} Episodes</span>
          </h3>
        </div>
        <div class="ts-season-tabs hide-scrollbar" id="tsSeasonTabs">
          ${seasonTabsHTML(show, active)}
        </div>
        <div class="ts-episodes" id="tsEpisodes">
          ${episodesHTML(show, active)}
        </div>
      </section>`;
    }

    function openDrawer(id) {
      const m = SHOWS.find(x => String(x.id) === String(id));
      if (!m) return;

      const castHTML = (m.cast || []).map(c =>
        `<div class="ts-drawer__cast-member">${avatarHTML(c, 'ts-drawer__cast-avatar')}<div class="ts-drawer__cast-name">${esc(c.name)}</div></div>`
      ).join('');

      const seasonCount = seasonCountOf(m);
      const epTotal = m.seasons.reduce((sum, s) => sum + s.episodes.length, 0);

      drawerBody.innerHTML = `
        <div class="ts-drawer__hero">
          <img src="${backdropFor(m.id)}" alt="${esc(m.title)} backdrop" />
          <div class="ts-drawer__hero-content">
            <h2 class="ts-drawer__title" id="tsDrawerTitle">${esc(m.title)}</h2>
            <div class="ts-drawer__meta">
              <span><i class="fas fa-star" style="color:#fbbf24"></i> ${esc(m.rating)}</span>
              <span><i class="fas fa-calendar"></i> ${esc(yearOf(m))}</span>
              <span><i class="fas fa-clock"></i> ${esc(m.runtime)} / ep</span>
              <span><i class="fas fa-layer-group"></i> ${seasonCount} Seasons</span>
              <span><i class="fas fa-film"></i> ${epTotal} Episodes</span>
              <span><i class="fas fa-closed-captioning"></i> ${esc(m.lang)}</span>
            </div>
            <div class="ts-drawer__actions">
              <button class="ts-drawer__btn ts-drawer__btn--primary" type="button"><i class="fas fa-play"></i> Watch Now</button>
              <button class="ts-drawer__btn ts-drawer__btn--ghost" type="button"><i class="fas fa-plus"></i> Add to List</button>
            </div>
          </div>
        </div>
        <div class="ts-drawer__content">
          <div>
            <h3 class="ts-drawer__section-title">Synopsis</h3>
            <p class="ts-drawer__desc">${esc(m.desc)}</p>
            <h3 class="ts-drawer__section-title">Cast</h3>
            <div class="ts-drawer__cast hide-scrollbar">${castHTML}</div>
          </div>
          <aside>
            <div class="ts-drawer__info-card">
              ${drawerRow('Creator', m.creator)}
              ${drawerRow('First Aired', m.release)}
              ${drawerRow('Episode', m.runtime)}
              ${drawerRow('Rating', m.rating + ' / 10')}
              ${drawerRow('Views', m.views.toLocaleString())}
              ${drawerRow('Genres', (m.genres || []).join(', '))}
              ${drawerRow('Language', m.lang)}
            </div>
          </aside>
        </div>
        ${seasonsSectionHTML(m)}`;

      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const panel = drawer.querySelector('.ts-drawer__panel');
      if (panel) panel.scrollTop = 0;
    }

    function closeDrawer() {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    function switchSeason(showId, seasonNumber) {
      const m = SHOWS.find(x => String(x.id) === String(showId));
      if (!m) return;
      state.activeSeason[showId] = seasonNumber;

      const tabs = $$('.ts-season-tab', drawerBody);
      tabs.forEach(t => {
        t.classList.toggle('is-active', parseInt(t.dataset.season, 10) === seasonNumber);
      });

      const activeSeason = m.seasons.find(s => s.number === seasonNumber);
      const epCount = activeSeason ? activeSeason.episodes.length : 0;
      const countEl = $('.ts-seasons__count', drawerBody);
      if (countEl) countEl.textContent = epCount + ' Episodes';

      const listEl = $('#tsEpisodes', drawerBody);
      if (listEl) {
        listEl.style.opacity = '0';
        listEl.style.transform = 'translateY(8px)';
        listEl.style.transition = 'opacity .2s ease, transform .2s ease';
        setTimeout(() => {
          listEl.innerHTML = episodesHTML(m, seasonNumber);
          listEl.style.opacity = '1';
          listEl.style.transform = 'translateY(0)';
        }, 140);
      }
    }

    function selectEpisode(showId, seasonNumber, epNumber) {
      state.selectedEpisode[showId + '-' + seasonNumber] = epNumber;
      const eps = $$('.ts-episode', drawerBody);
      eps.forEach(el => {
        el.classList.toggle('is-selected', parseInt(el.dataset.episode, 10) === epNumber);
      });
    }

    buildHero();
    renderTopWatched();
    renderGrid();
    renderCreators();

    if (sideCount) sideCount.textContent = SHOWS.length + '+';
    startHeroTimer();

    heroDots.addEventListener('click', e => {
      const dot = e.target.closest('[data-hero-dot]');
      if (!dot) return;
      goHero(parseInt(dot.dataset.heroDot, 10));
      startHeroTimer();
    });

    document.addEventListener('click', e => {
      const t = e.target;
      if (!t || !t.closest) return;

      const seasonTab = t.closest('.ts-season-tab');
      if (seasonTab) {
        e.preventDefault();
        const seasonSection = seasonTab.closest('.ts-seasons');
        if (seasonSection) {
          const showId = seasonSection.dataset.showId;
          const seasonNumber = parseInt(seasonTab.dataset.season, 10);
          switchSeason(showId, seasonNumber);
        }
        return;
      }

      const episode = t.closest('.ts-episode');
      if (episode) {
        e.preventDefault();
        const epSection = episode.closest('.ts-seasons');
        if (epSection) {
          const sId = epSection.dataset.showId;
          const sNum = state.activeSeason[sId];
          const eNum = parseInt(episode.dataset.episode, 10);
          selectEpisode(sId, sNum, eNum);
        }
        return;
      }

      const trigger = t.closest('[data-open]');
      if (trigger) {
        e.preventDefault();
        openDrawer(trigger.dataset.open);
        return;
      }

      if (t.closest('[data-drawer-close]')) closeDrawer();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { closeDrawer(); return; }
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const t = e.target;
      if (!t || !t.closest) return;
      const card = t.closest('.ts-card[data-open], .ts-marquee__card[data-open]');
      if (card) { e.preventDefault(); openDrawer(card.dataset.open); return; }
      const ep = t.closest('.ts-episode');
      if (ep) { e.preventDefault(); ep.click(); }
    });

    sortWrap.addEventListener('click', e => {
      const btn = e.target.closest('.ts-sort__btn');
      if (!btn) return;
      $$('.ts-sort__btn', sortWrap).forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      state.sort = btn.dataset.sort || 'popular';
      renderGrid();
    });

    const revealTargets = $$('[data-reveal]');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
      revealTargets.forEach(t => io.observe(t));
    } else {
      revealTargets.forEach(t => t.classList.add('is-revealed'));
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (state.heroTimer) clearInterval(state.heroTimer);
        state.heroTimer = null;
      } else {
        startHeroTimer();
      }
    });
  }

  async function loadBackendCatalog() {
    try {
      if (!window.FHApi || !window.FHApi.catalog) return;
      var category = 'tv-shows';
      if (category === '__PATH__') {
        category = window.location.pathname.indexOf('tv-shows') !== -1 ? 'tv-shows' : 'movies';
      }
      var rows = await window.FHApi.catalog(category === 'all' ? null : category);
      if (Array.isArray(rows) && rows.length) SHOWS = rows;
    } catch (e) {
      console.warn('Fan Hub backend catalog fallback:', e);
    }
  }

  async function boot() {
    await loadBackendCatalog();
    init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();