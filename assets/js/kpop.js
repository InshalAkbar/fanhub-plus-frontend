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

  const yearOf = m => (m.debut || '').slice(0, 4) || '—';

  const coverFor       = id => `https://picsum.photos/seed/kpop-cover-${id}/700/700`;
  const heroFor        = id => `https://picsum.photos/seed/kpop-hero-${id}/1600/900`;
  const memberAvatarFor = seed => `https://picsum.photos/seed/kpop-member-${encodeURIComponent(seed)}/200/200`;

  function memberHTML(person, cls) {
    const seed = encodeURIComponent((person && person.name) || 'x');
    const img  = memberAvatarFor(seed);
    const init = esc(initials(person && person.name));
    return `<div class="${cls} ${cls}--photo">
      <img src="${img}" alt="${esc(person.name)}" loading="lazy"
           onerror="this.onerror=null;this.parentNode.classList.remove('${cls}--photo');this.parentNode.innerHTML='${init}';" />
    </div>`;
  }

  let ARTISTS = [
    { id: 1001, title: 'BTS', sub: 'Boy Group', type: 'Boy Group',
      genres: ['k-pop','hip-hop','pop'], views: 72000, debut: '2013-06-13',
      rating: '9.8', fandom: 'ARMY', members: 7,
      desc: 'The global phenomenon that broke every K-Pop record. From underground hip-hop roots in Seoul to sold-out stadiums worldwide, BTS redefined what a boy group could be — and how far Korean music could travel.',
      label: 'BIGHIT MUSIC (HYBE)',
      lineup: [{name:'RM'},{name:'Jin'},{name:'Suga'},{name:'J-Hope'},{name:'Jimin'},{name:'V'},{name:'Jungkook'}],
      lang: 'KO',
      hits: [
        { title: 'Dynamite', year: '2020' },
        { title: 'Butter', year: '2021' },
        { title: 'Spring Day', year: '2017' },
        { title: 'Fake Love', year: '2018' }
      ]},
    { id: 1002, title: 'BLACKPINK', sub: 'Girl Group', type: 'Girl Group',
      genres: ['k-pop','pop','hip-hop'], views: 69000, debut: '2016-08-08',
      rating: '9.6', fandom: 'BLINK', members: 4,
      desc: 'Four distinct voices — Jisoo, Jennie, Rosé and Lisa — came together to become the biggest girl group in the world. Bold, polished and impossible to ignore.',
      label: 'YG Entertainment',
      lineup: [{name:'Jisoo'},{name:'Jennie'},{name:'Rosé'},{name:'Lisa'}],
      lang: 'KO',
      hits: [
        { title: 'DDU-DU DDU-DU', year: '2018' },
        { title: 'How You Like That', year: '2020' },
        { title: 'Kill This Love', year: '2019' },
        { title: 'Pink Venom', year: '2022' }
      ]},
    { id: 1003, title: 'TWICE', sub: 'Girl Group', type: 'Girl Group',
      genres: ['k-pop','pop','dance'], views: 62000, debut: '2015-10-20',
      rating: '9.3', fandom: 'ONCE', members: 9,
      desc: 'Nine members, endless charm, and a discography that reshaped the sound of modern JYP. TWICE turned bright pop hooks into a global language and grew up in front of their fans.',
      label: 'JYP Entertainment',
      lineup: [{name:'Nayeon'},{name:'Jeongyeon'},{name:'Momo'},{name:'Sana'},{name:'Jihyo'},{name:'Mina'},{name:'Dahyun'},{name:'Chaeyoung'},{name:'Tzuyu'}],
      lang: 'KO',
      hits: [
        { title: 'TT', year: '2016' },
        { title: 'Fancy', year: '2019' },
        { title: 'Feel Special', year: '2019' },
        { title: 'The Feels', year: '2021' }
      ]},
    { id: 1004, title: 'EXO', sub: 'Boy Group', type: 'Boy Group',
      genres: ['k-pop','r&b','pop'], views: 56000, debut: '2012-04-08',
      rating: '9.1', fandom: 'EXO-L', members: 9,
      desc: 'One of the most influential boy groups of the 2010s. EXO fused intricate choreography, powerful vocals and sci-fi mythology into an era-defining K-Pop run.',
      label: 'SM Entertainment',
      lineup: [{name:'Xiumin'},{name:'Suho'},{name:'Lay'},{name:'Baekhyun'},{name:'Chen'},{name:'Chanyeol'},{name:'D.O.'},{name:'Kai'},{name:'Sehun'}],
      lang: 'KO',
      hits: [
        { title: 'Growl', year: '2013' },
        { title: 'Monster', year: '2016' },
        { title: 'Love Shot', year: '2018' },
        { title: 'Ko Ko Bop', year: '2017' }
      ]},
    { id: 1005, title: 'Stray Kids', sub: 'Boy Group', type: 'Boy Group',
      genres: ['k-pop','hip-hop','edm'], views: 58000, debut: '2018-03-25',
      rating: '9.4', fandom: 'STAY', members: 8,
      desc: 'Self-producing powerhouse. Every Stray Kids album is written, composed and arranged largely in-house — a rare thing in K-Pop, and the reason their sound is impossible to copy.',
      label: 'JYP Entertainment',
      lineup: [{name:'Bang Chan'},{name:'Lee Know'},{name:'Changbin'},{name:'Hyunjin'},{name:'Han'},{name:'Felix'},{name:'Seungmin'},{name:'I.N'}],
      lang: 'KO',
      hits: [
        { title: 'God\u2019s Menu', year: '2020' },
        { title: 'Thunderous', year: '2021' },
        { title: 'MANIAC', year: '2022' },
        { title: 'S-Class', year: '2023' }
      ]},
    { id: 1006, title: 'NewJeans', sub: 'Girl Group', type: 'Girl Group',
      genres: ['k-pop','pop','r&b'], views: 54000, debut: '2022-07-22',
      rating: '9.2', fandom: 'BUNNIES', members: 5,
      desc: 'A breath of fresh air in modern K-Pop. NewJeans stripped the formula back to clean production, easy grooves and a Y2K-tinged aesthetic that felt instantly familiar and totally new.',
      label: 'ADOR (HYBE)',
      lineup: [{name:'Minji'},{name:'Hanni'},{name:'Danielle'},{name:'Haerin'},{name:'Hyein'}],
      lang: 'KO',
      hits: [
        { title: 'Attention', year: '2022' },
        { title: 'Hype Boy', year: '2022' },
        { title: 'Ditto', year: '2022' },
        { title: 'Super Shy', year: '2023' }
      ]}
  ];

  const LABELS = [
    { name: 'HYBE Corporation',  artists: 'BTS · NewJeans · TXT · Enhypen', tag: 'Global Powerhouse' },
    { name: 'SM Entertainment',  artists: 'EXO · NCT · aespa · Red Velvet', tag: 'Legacy Label' },
    { name: 'YG Entertainment',  artists: 'BLACKPINK · TREASURE · BABYMONSTER', tag: 'Hip-Hop Roots' },
    { name: 'JYP Entertainment', artists: 'TWICE · Stray Kids · ITZY', tag: 'Pop Innovators' },
    { name: 'Starship',          artists: 'IVE · MONSTA X · CRAVITY', tag: 'Rising Power' },
    { name: 'Cube Entertainment', artists: '(G)I-DLE · PENTAGON · Lightsum', tag: 'Independent Spirit' }
  ];

  const state = { heroIndex: 0, heroTimer: null, sort: 'popular' };

  function init() {
    const hero       = $('#kpHero');
    const heroDots   = $('#kpHeroDots');
    const topTrack   = $('#kpTopPlayedTrack');
    const gridEl     = $('#kpGrid');
    const sortWrap   = $('#kpSort');
    const labelTk    = $('#kpLabelTrack');
    const drawer     = $('#kpDrawer');
    const drawerBody = $('#kpDrawerBody');
    const sideCount  = $('#kpSideCount');

    if (!hero || !gridEl || !sortWrap) return;

    const heroSlides = ARTISTS.slice(0, 6);

    function buildHero() {
      const slidesHTML = heroSlides.map((m, i) => {
        const lineupHTML = (m.lineup || []).map(p =>
          `<div class="kp-hero__member">${memberHTML(p, 'kp-hero__member-avatar')}<span class="kp-hero__member-name">${esc(p.name)}</span></div>`
        ).join('');

        return `<div class="kp-hero__slide${i === 0 ? ' is-active' : ''}">
          <div class="kp-hero__bg"><img src="${heroFor(m.id)}" alt="${esc(m.title)}" /></div>
          <div class="kp-hero__content">
            <div class="kp-hero__card">
              <span class="kp-hero__tag">K-Pop · Featured</span>
              <h1 class="kp-hero__title">${esc(m.title)}</h1>
              <div class="kp-hero__meta">
                <span class="kp-hero__pill kp-hero__pill--pink">${esc(m.type)}</span>
                <span class="kp-hero__pill kp-hero__pill--rating"><i class="fas fa-star"></i> ${esc(m.rating)}</span>
                <span class="kp-hero__pill"><i class="fas fa-calendar"></i> Debut ${esc(yearOf(m))}</span>
                <span class="kp-hero__pill"><i class="fas fa-users"></i> ${esc(m.members)} Members</span>
                <span class="kp-hero__pill kp-hero__pill--blue"><i class="fas fa-heart"></i> ${esc(m.fandom)}</span>
              </div>
              <p class="kp-hero__desc">${esc(m.desc)}</p>
              <div class="kp-hero__members hide-scrollbar">${lineupHTML}</div>
              <div class="kp-hero__actions">
                <button class="kp-hero__btn kp-hero__btn--primary" data-open="${m.id}" type="button">
                  <i class="fas fa-play"></i> Listen Now
                </button>
                <button class="kp-hero__btn kp-hero__btn--ghost" data-open="${m.id}" type="button">
                  <i class="fas fa-circle-info"></i> Details
                </button>
              </div>
            </div>
          </div>
        </div>`;
      }).join('');

      hero.insertAdjacentHTML('beforeend', slidesHTML);

      heroDots.innerHTML = heroSlides.map((m, i) =>
        `<button class="kp-hero__dot${i === 0 ? ' is-active' : ''}" data-hero-dot="${i}" aria-label="${esc(m.title)}" type="button"></button>`
      ).join('');
    }

    function goHero(index) {
      const slides = $$('.kp-hero__slide', hero);
      const dots = $$('.kp-hero__dot', heroDots);
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

    function renderTopPlayed() {
      const list = ARTISTS.slice().sort((a, b) => b.views - a.views).slice(0, 6);
      const items = list.map(m =>
        `<article class="kp-marquee__card" data-open="${m.id}" tabindex="0" role="button" aria-label="${esc(m.title)}">
          <span class="kp-marquee__rate"><i class="fas fa-star"></i> ${esc(m.rating)}</span>
          <img src="${coverFor(m.id)}" alt="${esc(m.title)} cover" loading="lazy" />
          <div class="kp-marquee__body">
            <h3 class="kp-marquee__title">${esc(m.title)}</h3>
            <div class="kp-marquee__meta">
              <span>${esc(yearOf(m))}</span>
              <span>·</span>
              <span>${esc(m.type)}</span>
            </div>
          </div>
        </article>`
      ).join('');
      topTrack.innerHTML = `<div class="kp-marquee__track">${items}${items}</div>`;
    }

    function renderLabels() {
      const items = LABELS.map(l =>
        `<article class="kp-label">
          <div class="kp-label__avatar">${esc(initials(l.name))}</div>
          <div class="kp-label__body">
            <h3 class="kp-label__name">${esc(l.name)}</h3>
            <p class="kp-label__artists">${esc(l.artists)}</p>
            <span class="kp-label__tag"><i class="fas fa-building"></i> ${esc(l.tag)}</span>
          </div>
        </article>`
      ).join('');
      labelTk.innerHTML = `<div class="kp-marquee__track">${items}${items}</div>`;
    }

    function sortArtists(list, mode) {
      const out = list.slice();
      switch (mode) {
        case 'latest': return out.sort((a, b) => (b.debut || '').localeCompare(a.debut || ''));
        case 'rating': return out.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        case 'az':     return out.sort((a, b) => a.title.localeCompare(b.title));
        default:       return out.sort((a, b) => b.views - a.views);
      }
    }

    function cardHTML(m) {
      return `<article class="kp-card" data-open="${m.id}" tabindex="0" role="button" aria-label="${esc(m.title)}">
        <div class="kp-card__media">
          <span class="kp-card__sub">${esc(m.type)}</span>
          <span class="kp-card__rate"><i class="fas fa-star"></i> ${esc(m.rating)}</span>
          <img src="${coverFor(m.id)}" alt="${esc(m.title)} cover" loading="lazy" />
          <span class="kp-card__debut">${esc(yearOf(m))}</span>
        </div>
        <div class="kp-card__body">
          <h3 class="kp-card__title">${esc(m.title)}</h3>
          <div class="kp-card__meta">
            <span>${esc(m.members)} Members</span>
            <span>${esc(m.fandom)}</span>
          </div>
        </div>
      </article>`;
    }

    function renderGrid() {
      const data = sortArtists(ARTISTS, state.sort);
      gridEl.innerHTML = data.map(cardHTML).join('');
      const cards = $$('.kp-card', gridEl);
      let i = 0;
      function revealBatch() {
        const end = Math.min(i + 4, cards.length);
        for (; i < end; i++) if (cards[i]) cards[i].classList.add('is-visible');
        if (i < cards.length) requestAnimationFrame(revealBatch);
      }
      requestAnimationFrame(revealBatch);
    }

    function drawerRow(label, value) {
      return `<div class="kp-drawer__row">
        <span class="kp-drawer__row-label">${esc(label)}</span>
        <span class="kp-drawer__row-value">${esc(value)}</span>
      </div>`;
    }

    function openDrawer(id) {
      const m = ARTISTS.find(x => String(x.id) === String(id));
      if (!m) return;

      const lineupHTML = (m.lineup || []).map(p =>
        `<div class="kp-drawer__member">${memberHTML(p, 'kp-drawer__member-avatar')}<div class="kp-drawer__member-name">${esc(p.name)}</div></div>`
      ).join('');

      const genresHTML = (m.genres || []).map(g =>
        `<span class="kp-drawer__tag"><i class="fas fa-tag"></i> ${esc(g)}</span>`
      ).join('');

      const hitsHTML = (m.hits || []).map(h =>
        `<div class="kp-drawer__hit">
          <div class="kp-drawer__hit-title"><i class="fas fa-music" style="opacity:.6;margin-right:6px"></i>${esc(h.title)}</div>
          <div class="kp-drawer__hit-year">${esc(h.year)}</div>
        </div>`
      ).join('');

      drawerBody.innerHTML = `
        <div class="kp-drawer__hero">
          <img src="${heroFor(m.id)}" alt="${esc(m.title)} backdrop" />
          <div class="kp-drawer__hero-content">
            <h2 class="kp-drawer__title" id="kpDrawerTitle">${esc(m.title)}</h2>
            <div class="kp-drawer__meta">
              <span><i class="fas fa-star" style="color:#fbbf24"></i> ${esc(m.rating)}</span>
              <span><i class="fas fa-calendar"></i> Debut ${esc(yearOf(m))}</span>
              <span><i class="fas fa-users"></i> ${esc(m.members)} Members</span>
              <span><i class="fas fa-heart" style="color:#ff2d92"></i> ${esc(m.fandom)}</span>
              <span><i class="fas fa-closed-captioning"></i> ${esc(m.lang)}</span>
            </div>
            <div class="kp-drawer__actions">
              <button class="kp-drawer__btn kp-drawer__btn--primary" type="button"><i class="fas fa-play"></i> Listen Now</button>
              <button class="kp-drawer__btn kp-drawer__btn--ghost" type="button"><i class="fas fa-plus"></i> Add to Favorites</button>
            </div>
          </div>
        </div>
        <div class="kp-drawer__content">
          <div>
            <h3 class="kp-drawer__section-title">About</h3>
            <p class="kp-drawer__desc">${esc(m.desc)}</p>
            <h3 class="kp-drawer__section-title">Genres</h3>
            <div class="kp-drawer__tags">${genresHTML}</div>
            <h3 class="kp-drawer__section-title">Signature Hits</h3>
            <div class="kp-drawer__hits">${hitsHTML}</div>
            <h3 class="kp-drawer__section-title">Lineup</h3>
            <div class="kp-drawer__members hide-scrollbar">${lineupHTML}</div>
          </div>
          <aside>
            <div class="kp-drawer__info-card">
              ${drawerRow('Label', m.label)}
              ${drawerRow('Type', m.type)}
              ${drawerRow('Debut', m.debut)}
              ${drawerRow('Rating', m.rating + ' / 10')}
              ${drawerRow('Followers', m.views.toLocaleString())}
              ${drawerRow('Fandom', m.fandom)}
              ${drawerRow('Language', m.lang)}
            </div>
          </aside>
        </div>`;

      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const panel = drawer.querySelector('.kp-drawer__panel');
      if (panel) panel.scrollTop = 0;
    }

    function closeDrawer() {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    buildHero();
    renderTopPlayed();
    renderGrid();
    renderLabels();

    if (sideCount) sideCount.textContent = ARTISTS.length + '+';
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
      const card = t.closest('.kp-card[data-open], .kp-marquee__card[data-open]');
      if (card) { e.preventDefault(); openDrawer(card.dataset.open); }
    });

    sortWrap.addEventListener('click', e => {
      const btn = e.target.closest('.kp-sort__btn');
      if (!btn) return;
      $$('.kp-sort__btn', sortWrap).forEach(b => b.classList.remove('is-active'));
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
      var category = 'kpop';
      if (category === '__PATH__') {
        category = window.location.pathname.indexOf('tv-shows') !== -1 ? 'tv-shows' : 'movies';
      }
      var rows = await window.FHApi.catalog(category === 'all' ? null : category);
      if (Array.isArray(rows) && rows.length) ARTISTS = rows;
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