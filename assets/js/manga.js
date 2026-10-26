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
  const badgeFor = m => m.views >= 55000 ? 'TOP' : m.views >= 38000 ? 'HOT' : 'NEW';

  const posterFor = id => `https://picsum.photos/seed/manga-poster-${id}/500/750?grayscale`;
  const coverFor  = id => `https://picsum.photos/seed/manga-cover-${id}/1600/900?grayscale`;
  const avatarFor = seed => `https://picsum.photos/seed/manga-avatar-${encodeURIComponent(seed)}/200/200`;

  function avatarHTML(person, cls) {
    const seed = encodeURIComponent((person && person.name) || 'x');
    const img  = avatarFor(seed);
    const init = esc(initials(person && person.name));
    return `<div class="${cls} ${cls}--photo">
      <img src="${img}" alt="${esc(person.name)}" loading="lazy"
           onerror="this.onerror=null;this.parentNode.classList.remove('${cls}--photo');this.parentNode.innerHTML='${init}';" />
    </div>`;
  }

  let MANGA = [
    { id: 1401, title: 'One Piece', sub: 'Shōnen', type: 'Shōnen',
      genres: ['adventure','fantasy','action'], views: 72000, release: '1997-07-22',
      rating: '9.7', volumes: 107,
      desc: 'Monkey D. Luffy sails the Grand Line with his pirate crew in search of the legendary treasure left behind by the Pirate King. Over two decades and counting, the greatest adventure in manga.',
      author: 'Eiichiro Oda', magazine: 'Weekly Shōnen Jump', publisher: 'Shueisha',
      creators: [{name:'Eiichiro Oda'}], lang: 'JA' },
    { id: 1402, title: 'Berserk', sub: 'Seinen', type: 'Seinen',
      genres: ['dark fantasy','action','drama'], views: 68000, release: '1989-08-25',
      rating: '9.8', volumes: 41,
      desc: 'Guts, the Black Swordsman, wages an unwinnable war against fate, demons, and the man he once called brother. Miura\'s brushwork remains untouched in its detail and despair.',
      author: 'Kentaro Miura', magazine: 'Young Animal', publisher: 'Hakusensha',
      creators: [{name:'Kentaro Miura'}], lang: 'JA' },
    { id: 1403, title: 'Vagabond', sub: 'Seinen', type: 'Seinen',
      genres: ['historical','action','drama'], views: 62000, release: '1998-09-17',
      rating: '9.7', volumes: 37,
      desc: 'A fictional retelling of the life of Miyamoto Musashi — the legendary swordsman who walked the path of the blade in search of enlightenment. Inoue\'s ink washes are pure poetry.',
      author: 'Takehiko Inoue', magazine: 'Morning', publisher: 'Kodansha',
      creators: [{name:'Takehiko Inoue'}], lang: 'JA' },
    { id: 1404, title: 'Monster', sub: 'Seinen', type: 'Seinen',
      genres: ['psychological','thriller','mystery'], views: 60000, release: '1994-12-05',
      rating: '9.6', volumes: 18,
      desc: 'A brilliant surgeon saves the life of a young boy — and unknowingly unleashes a monster on the world. Urasawa\'s edge-of-your-seat thriller remains unmatched.',
      author: 'Naoki Urasawa', magazine: 'Big Comic Original', publisher: 'Shogakukan',
      creators: [{name:'Naoki Urasawa'}], lang: 'JA' },
    { id: 1405, title: 'Death Note', sub: 'Shōnen', type: 'Shōnen',
      genres: ['psychological','thriller','supernatural'], views: 66000, release: '2003-12-01',
      rating: '9.5', volumes: 12,
      desc: 'A high school student finds a notebook that kills anyone whose name is written in it — and a cat-and-mouse game with the world\'s greatest detective begins.',
      author: 'Tsugumi Ohba', magazine: 'Weekly Shōnen Jump', publisher: 'Shueisha',
      creators: [{name:'Tsugumi Ohba'},{name:'Takeshi Obata'}], lang: 'JA' },
    { id: 1406, title: 'Attack on Titan', sub: 'Shōnen', type: 'Shōnen',
      genres: ['dark fantasy','action','drama'], views: 64000, release: '2009-09-09',
      rating: '9.5', volumes: 34,
      desc: 'Humanity\'s last walled city is breached by giant humanoid creatures — and Eren Yeager vows to destroy every last Titan. A story that grew far beyond its premise.',
      author: 'Hajime Isayama', magazine: 'Bessatsu Shōnen Magazine', publisher: 'Kodansha',
      creators: [{name:'Hajime Isayama'}], lang: 'JA' },
    { id: 1407, title: 'Fullmetal Alchemist', sub: 'Shōnen', type: 'Shōnen',
      genres: ['fantasy','action','drama'], views: 62000, release: '2001-07-12',
      rating: '9.6', volumes: 27,
      desc: 'Two brothers break the ultimate taboo of alchemy trying to bring their mother back — and pay a terrible price. Their journey to restore what they lost defines a generation.',
      author: 'Hiromu Arakawa', magazine: 'Monthly Shōnen Gangan', publisher: 'Square Enix',
      creators: [{name:'Hiromu Arakawa'}], lang: 'JA' },
    { id: 1408, title: 'Chainsaw Man', sub: 'Shōnen', type: 'Shōnen',
      genres: ['dark fantasy','action','comedy'], views: 58000, release: '2018-12-03',
      rating: '9.4', volumes: 16,
      desc: 'A young man burdened by crushing debt merges with his chainsaw devil dog and becomes the government\'s most unpredictable devil hunter. Chaos has never been this charming.',
      author: 'Tatsuki Fujimoto', magazine: 'Weekly Shōnen Jump', publisher: 'Shueisha',
      creators: [{name:'Tatsuki Fujimoto'}], lang: 'JA' }
  ];

  const MANGAKA = [
    { name: 'Eiichiro Oda',     works: 'One Piece · Wanted!',                  tag: 'Shōnen Legend' },
    { name: 'Kentaro Miura',    works: 'Berserk · Gigantomakhia',              tag: 'Seinen Master' },
    { name: 'Naoki Urasawa',    works: 'Monster · 20th Century Boys · Pluto', tag: 'Thriller Icon' },
    { name: 'Takehiko Inoue',   works: 'Vagabond · Slam Dunk · Real',         tag: 'Ink Poet' },
    { name: 'Hajime Isayama',   works: 'Attack on Titan',                     tag: 'Modern Epic' },
    { name: 'Tatsuki Fujimoto', works: 'Chainsaw Man · Fire Punch',           tag: 'New Wave' }
  ];

  const state = { heroIndex: 0, heroTimer: null, sort: 'popular' };

  function init() {
    const hero       = $('#mnHero');
    const heroDots   = $('#mnHeroDots');
    const topTrack   = $('#mnTopRatedTrack');
    const gridEl     = $('#mnGrid');
    const sortWrap   = $('#mnSort');
    const mangakaTk  = $('#mnMangakaTrack');
    const drawer     = $('#mnDrawer');
    const drawerBody = $('#mnDrawerBody');
    const sideCount  = $('#mnSideCount');

    if (!hero || !gridEl || !sortWrap) return;

    const heroSlides = MANGA.slice(0, 6);

    function buildHero() {
      const slidesHTML = heroSlides.map((m, i) => {
        const castHTML = (m.creators || []).map(c =>
          `<div class="mn-hero__cast-member">${avatarHTML(c, 'mn-hero__cast-avatar')}<span class="mn-hero__cast-name">${esc(c.name)}</span></div>`
        ).join('');

        return `<div class="mn-hero__slide${i === 0 ? ' is-active' : ''}">
          <div class="mn-hero__bg"><img src="${coverFor(m.id)}" alt="${esc(m.title)}" /></div>
          <div class="mn-hero__content">
            <div class="mn-hero__card">
              <span class="mn-hero__tag">Manga · Featured</span>
              <h1 class="mn-hero__title">${esc(m.title)}</h1>
              <div class="mn-hero__meta">
                <span class="mn-hero__pill mn-hero__pill--red">${esc(m.type)}</span>
                <span class="mn-hero__pill mn-hero__pill--rating"><i class="fas fa-star"></i> ${esc(m.rating)}</span>
                <span class="mn-hero__pill"><i class="fas fa-calendar"></i> ${esc(yearOf(m))}</span>
                <span class="mn-hero__pill"><i class="fas fa-book"></i> ${esc(m.volumes)} Volumes</span>
                <span class="mn-hero__pill mn-hero__pill--paper"><i class="fas fa-scroll"></i> ${esc(m.magazine)}</span>
              </div>
              <p class="mn-hero__desc">${esc(m.desc)}</p>
              <div class="mn-hero__cast hide-scrollbar">${castHTML}</div>
              <div class="mn-hero__actions">
                <button class="mn-hero__btn mn-hero__btn--primary" data-open="${m.id}" type="button">
                  <i class="fas fa-book-open"></i> Read Now
                </button>
                <button class="mn-hero__btn mn-hero__btn--ghost" data-open="${m.id}" type="button">
                  <i class="fas fa-circle-info"></i> Details
                </button>
              </div>
            </div>
          </div>
        </div>`;
      }).join('');

      hero.insertAdjacentHTML('beforeend', slidesHTML);

      heroDots.innerHTML = heroSlides.map((m, i) =>
        `<button class="mn-hero__dot${i === 0 ? ' is-active' : ''}" data-hero-dot="${i}" aria-label="${esc(m.title)}" type="button"></button>`
      ).join('');
    }

    function goHero(index) {
      const slides = $$('.mn-hero__slide', hero);
      const dots = $$('.mn-hero__dot', heroDots);
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

    function renderTopRated() {
      const list = MANGA.slice().sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating)).slice(0, 6);
      const items = list.map(m =>
        `<article class="mn-marquee__card" data-open="${m.id}" tabindex="0" role="button" aria-label="${esc(m.title)}">
          <span class="mn-marquee__rate"><i class="fas fa-star"></i> ${esc(m.rating)}</span>
          <img src="${posterFor(m.id)}" alt="${esc(m.title)}" loading="lazy" />
          <div class="mn-marquee__body">
            <h3 class="mn-marquee__title">${esc(m.title)}</h3>
            <div class="mn-marquee__meta">
              <span>${esc(yearOf(m))}</span>
              <span>·</span>
              <span>${esc(m.type)}</span>
            </div>
          </div>
        </article>`
      ).join('');
      topTrack.innerHTML = `<div class="mn-marquee__track">${items}${items}</div>`;
    }

    function renderMangaka() {
      const items = MANGAKA.map(d =>
        `<article class="mn-mangaka-card">
          <div class="mn-mangaka-card__avatar">${esc(initials(d.name))}</div>
          <div class="mn-mangaka-card__body">
            <h3 class="mn-mangaka-card__name">${esc(d.name)}</h3>
            <p class="mn-mangaka-card__works">${esc(d.works)}</p>
            <span class="mn-mangaka-card__tag"><i class="fas fa-pen-fancy"></i> ${esc(d.tag)}</span>
          </div>
        </article>`
      ).join('');
      mangakaTk.innerHTML = `<div class="mn-marquee__track">${items}${items}</div>`;
    }

    function sortManga(list, mode) {
      const out = list.slice();
      switch (mode) {
        case 'latest': return out.sort((a, b) => (b.release || '').localeCompare(a.release || ''));
        case 'rating': return out.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        case 'az':     return out.sort((a, b) => a.title.localeCompare(b.title));
        default:       return out.sort((a, b) => b.views - a.views);
      }
    }

    function cardHTML(m) {
      return `<article class="mn-card" data-open="${m.id}" tabindex="0" role="button" aria-label="${esc(m.title)}">
        <div class="mn-card__media">
          <span class="mn-card__sub">${esc(m.type)}</span>
          <span class="mn-card__rate"><i class="fas fa-star"></i> ${esc(m.rating)}</span>
          <img src="${posterFor(m.id)}" alt="${esc(m.title)} poster" loading="lazy" />
          <span class="mn-card__badge">${badgeFor(m)}</span>
        </div>
        <div class="mn-card__body">
          <h3 class="mn-card__title">${esc(m.title)}</h3>
          <div class="mn-card__meta">
            <span>${esc(yearOf(m))}</span>
            <span>${esc(m.volumes)} Vol</span>
          </div>
        </div>
      </article>`;
    }

    function renderGrid() {
      const data = sortManga(MANGA, state.sort);
      gridEl.innerHTML = data.map(cardHTML).join('');
      const cards = $$('.mn-card', gridEl);
      let i = 0;
      function batch() {
        const end = Math.min(i + 4, cards.length);
        for (; i < end; i++) if (cards[i]) cards[i].classList.add('is-visible');
        if (i < cards.length) requestAnimationFrame(batch);
      }
      requestAnimationFrame(batch);
    }

    function drawerRow(label, value) {
      return `<div class="mn-drawer__row">
        <span class="mn-drawer__row-label">${esc(label)}</span>
        <span class="mn-drawer__row-value">${esc(value)}</span>
      </div>`;
    }

    function openDrawer(id) {
      const m = MANGA.find(x => String(x.id) === String(id));
      if (!m) return;

      const castHTML = (m.creators || []).map(c =>
        `<div class="mn-drawer__cast-member">${avatarHTML(c, 'mn-drawer__cast-avatar')}<div class="mn-drawer__cast-name">${esc(c.name)}</div></div>`
      ).join('');

      drawerBody.innerHTML = `
        <div class="mn-drawer__hero">
          <img src="${coverFor(m.id)}" alt="${esc(m.title)} backdrop" />
          <div class="mn-drawer__hero-content">
            <h2 class="mn-drawer__title" id="mnDrawerTitle">${esc(m.title)}</h2>
            <div class="mn-drawer__meta">
              <span><i class="fas fa-star" style="color:#fbbf24"></i> ${esc(m.rating)}</span>
              <span><i class="fas fa-calendar"></i> ${esc(yearOf(m))}</span>
              <span><i class="fas fa-book"></i> ${esc(m.volumes)} Volumes</span>
              <span><i class="fas fa-tag"></i> ${esc(m.type)}</span>
              <span><i class="fas fa-closed-captioning"></i> ${esc(m.lang)}</span>
            </div>
            <div class="mn-drawer__actions">
              <button class="mn-drawer__btn mn-drawer__btn--primary" type="button"><i class="fas fa-book-open"></i> Read Now</button>
              <button class="mn-drawer__btn mn-drawer__btn--ghost" type="button"><i class="fas fa-plus"></i> Add to List</button>
            </div>
          </div>
        </div>
        <div class="mn-drawer__content">
          <div>
            <h3 class="mn-drawer__section-title">Synopsis</h3>
            <p class="mn-drawer__desc">${esc(m.desc)}</p>
            <h3 class="mn-drawer__section-title">Mangaka</h3>
            <div class="mn-drawer__cast hide-scrollbar">${castHTML}</div>
          </div>
          <aside>
            <div class="mn-drawer__info-card">
              ${drawerRow('Author', m.author)}
              ${drawerRow('Publisher', m.publisher)}
              ${drawerRow('Magazine', m.magazine)}
              ${drawerRow('Serialised', m.release)}
              ${drawerRow('Volumes', m.volumes)}
              ${drawerRow('Rating', m.rating + ' / 10')}
              ${drawerRow('Language', m.lang)}
            </div>
          </aside>
        </div>`;

      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const panel = drawer.querySelector('.mn-drawer__panel');
      if (panel) panel.scrollTop = 0;
    }

    function closeDrawer() {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    buildHero();
    renderTopRated();
    renderGrid();
    renderMangaka();

    if (sideCount) sideCount.textContent = MANGA.length + '+';
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
      const card = t.closest('.mn-card[data-open], .mn-marquee__card[data-open]');
      if (card) { e.preventDefault(); openDrawer(card.dataset.open); }
    });

    sortWrap.addEventListener('click', e => {
      const btn = e.target.closest('.mn-sort__btn');
      if (!btn) return;
      $$('.mn-sort__btn', sortWrap).forEach(b => b.classList.remove('is-active'));
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
      var category = 'manga';
      if (category === '__PATH__') {
        category = window.location.pathname.indexOf('tv-shows') !== -1 ? 'tv-shows' : 'movies';
      }
      var rows = await window.FHApi.catalog(category === 'all' ? null : category);
      if (Array.isArray(rows) && rows.length) MANGA = rows;
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