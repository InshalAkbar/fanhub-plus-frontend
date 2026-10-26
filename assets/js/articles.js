(() => {
  'use strict';

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));

  let ARTICLES = [
    {
      id: 1,
      title: 'Attack on Titan: The Final Season Review — A Masterpiece or Betrayal?',
      desc: 'A deep dive into the controversial ending that divided the fandom for years.',
      category: 'anime',
      categoryLabel: 'Anime',
      author: 'Maika Asa',
      authorColor: ['#6366f1', '#a855f7'],
      date: '2026-09-20T10:00:00Z',
      readTime: 12,
      views: 4200,
      likes: 312,
      featured: true,
      img: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=1200'
    },
    {
      id: 2,
      title: 'Top 10 Manga of 2025 You Need to Read',
      desc: 'From underground gems to breakout hits — these are the mangas that defined the year.',
      category: 'manga',
      categoryLabel: 'Manga',
      author: 'Otaku Sensei',
      authorColor: ['#22d3ee', '#6366f1'],
      date: '2026-09-18T10:00:00Z',
      readTime: 8,
      views: 5100,
      likes: 487,
      featured: true,
      img: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=1200'
    },
    {
      id: 3,
      title: 'BTS Concert Recap — Seoul Night 3',
      desc: 'The lights, the screams, the tears. An ARMY\'s dream come true.',
      category: 'kpop',
      categoryLabel: 'K-Pop',
      author: 'ARMY Forever',
      authorColor: ['#ec4899', '#a855f7'],
      date: '2026-09-15T18:00:00Z',
      readTime: 6,
      views: 2900,
      likes: 604,
      featured: true,
      img: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=1200'
    },
    {
      id: 4,
      title: 'Why Elden Ring is a Masterpiece of Open-World Design',
      desc: 'FromSoftware reinvented exploration — here\'s how they did it.',
      category: 'gaming',
      categoryLabel: 'Gaming',
      author: 'Nova Star',
      authorColor: ['#10b981', '#22d3ee'],
      date: '2026-09-12T12:00:00Z',
      readTime: 15,
      views: 3800,
      likes: 289,
      img: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1200'
    },
    {
      id: 5,
      title: 'Dune: Part Two — The Sci-Fi Epic We Deserved',
      desc: 'Villeneuve delivers a sprawling sequel that redefines the genre.',
      category: 'movies',
      categoryLabel: 'Movies',
      author: 'Cinema Zain',
      authorColor: ['#f59e0b', '#ec4899'],
      date: '2026-09-10T16:00:00Z',
      readTime: 10,
      views: 3200,
      likes: 245,
      img: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1200'
    },
    {
      id: 6,
      title: 'The Last of Us Season 2 — What We Know So Far',
      desc: 'Everything confirmed about the next chapter of the acclaimed series.',
      category: 'tv',
      categoryLabel: 'TV Series',
      author: 'Series Rana',
      authorColor: ['#a855f7', '#ec4899'],
      date: '2026-09-08T10:00:00Z',
      readTime: 9,
      views: 2600,
      likes: 178,
      img: 'https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?q=80&w=1200'
    },
    {
      id: 7,
      title: 'Reading Comics in 2026 — The Best Publisher Drops',
      desc: 'Marvel, DC, Image — the standout releases this year.',
      category: 'comics',
      categoryLabel: 'Comics',
      author: 'Ink Master',
      authorColor: ['#ef4444', '#ec4899'],
      date: '2026-09-05T14:00:00Z',
      readTime: 7,
      views: 1900,
      likes: 132,
      img: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=1200'
    },
    {
      id: 8,
      title: 'Spirited Away — Why It Still Moves Us 25 Years Later',
      desc: 'A nostalgic look back at Miyazaki\'s enduring classic.',
      category: 'anime',
      categoryLabel: 'Anime',
      author: 'Maika Asa',
      authorColor: ['#6366f1', '#a855f7'],
      date: '2026-09-02T12:00:00Z',
      readTime: 11,
      views: 4100,
      likes: 356,
      img: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200'
    },
    {
      id: 9,
      title: 'Starfield vs No Man\'s Sky — Which Should You Play?',
      desc: 'A comparison of two massive space games.',
      category: 'gaming',
      categoryLabel: 'Gaming',
      author: 'Nova Star',
      authorColor: ['#10b981', '#22d3ee'],
      date: '2026-08-30T10:00:00Z',
      readTime: 8,
      views: 2400,
      likes: 156,
      img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200'
    },
    {
      id: 10,
      title: 'The Batman 2 — Everything We Know About the Sequel',
      desc: 'Casting rumors, plot leaks, and confirmed details.',
      category: 'movies',
      categoryLabel: 'Movies',
      author: 'Cinema Zain',
      authorColor: ['#f59e0b', '#ec4899'],
      date: '2026-08-28T16:00:00Z',
      readTime: 6,
      views: 3100,
      likes: 198,
      img: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=1200'
    },
    {
      id: 11,
      title: 'One Piece Live Action Season 2 — First Look',
      desc: 'The Straw Hats are back — here\'s what we saw.',
      category: 'tv',
      categoryLabel: 'TV Series',
      author: 'Series Rana',
      authorColor: ['#a855f7', '#ec4899'],
      date: '2026-08-25T12:00:00Z',
      readTime: 5,
      views: 2200,
      likes: 164,
      img: 'https://images.unsplash.com/photo-1618945524163-32451704cbb8?q=80&w=1200'
    },
    {
      id: 12,
      title: 'Chainsaw Man Part 2 — Every Chapter Ranked',
      desc: 'From best to worst, an honest ranking of Part 2.',
      category: 'manga',
      categoryLabel: 'Manga',
      author: 'Otaku Sensei',
      authorColor: ['#22d3ee', '#6366f1'],
      date: '2026-08-22T10:00:00Z',
      readTime: 13,
      views: 3600,
      likes: 274,
      img: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200'
    }
  ];


  const state = {
    all: ARTICLES.slice(),
    filtered: ARTICLES.slice(),
    category: 'all',
    query: '',
    sort: 'recent',
    page: 1,
    perPage: 6
  };


  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function initials(name) {
    return String(name || '?').trim().split(/\s+/).slice(0, 2)
      .map(w => w[0]).join('').toUpperCase();
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function timeAgo(iso) {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
    return formatDate(iso);
  }

  function formatViews(n) {
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return String(n);
  }

  function applyFilters() {
    let list = state.all.slice();

    if (state.category !== 'all') {
      list = list.filter((a) => a.category === state.category);
    }

    if (state.query) {
      const q = state.query.toLowerCase();
      list = list.filter((a) =>
        a.title.toLowerCase().includes(q) ||
        a.desc.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q)
      );
    }

    if (state.sort === 'popular') list.sort((a, b) => b.views - a.views);
    else if (state.sort === 'likes') list.sort((a, b) => b.likes - a.likes);
    else if (state.sort === 'title') list.sort((a, b) => a.title.localeCompare(b.title));
    else list.sort((a, b) => new Date(b.date) - new Date(a.date));

    state.filtered = list;
    return list;
  }


  function renderFeatured() {
    const featured = state.all.filter((a) => a.featured).slice(0, 3);
    if (!featured.length) return;

    const main = featured[0];
    const side = featured.slice(1, 3);

    const mainHtml = `
      <a href="article-single.html?id=${main.id}" class="fh-art-feat-main">
        <div class="fh-art-feat-main__bg" style="background-image:url('${esc(main.img)}')"></div>
        <div class="fh-art-feat-main__body">
          <span class="fh-art-feat-main__cat">
            <i class="fas fa-star"></i> Featured · ${esc(main.categoryLabel)}
          </span>
          <h2 class="fh-art-feat-main__title">${esc(main.title)}</h2>
          <p class="fh-art-feat-main__desc">${esc(main.desc)}</p>
          <div class="fh-art-feat-main__meta">
            <img src="https://i.pravatar.cc/64?u=${encodeURIComponent(main.author)}" alt="${esc(main.author)}"
                 onerror="this.style.display='none'">
            <span>${esc(main.author)}</span>
            <span><i class="fas fa-clock"></i> ${main.readTime} min read</span>
            <span><i class="fas fa-eye"></i> ${formatViews(main.views)}</span>
          </div>
        </div>
      </a>
    `;

    const sideHtml = side.map((a) => `
      <a href="article-single.html?id=${a.id}" class="fh-art-feat-side">
        <img class="fh-art-feat-side__img" src="${esc(a.img)}" alt="${esc(a.title)}" loading="lazy" />
        <div class="fh-art-feat-side__body">
          <span class="fh-art-feat-side__cat">${esc(a.categoryLabel)}</span>
          <h3 class="fh-art-feat-side__title">${esc(a.title)}</h3>
          <div class="fh-art-feat-side__meta">
            <span><i class="fas fa-user"></i> ${esc(a.author)}</span>
            <span><i class="fas fa-clock"></i> ${a.readTime} min</span>
          </div>
        </div>
      </a>
    `).join('');

    $('#fhArtFeatured').innerHTML = mainHtml + `<div class="fh-art__featured-side">${sideHtml}</div>`;
  }


  function renderCard(a) {
    return `
      <a href="article-single.html?id=${a.id}" class="fh-art-card">
        <div class="fh-art-card__img">
          <span class="fh-art-card__cat">${esc(a.categoryLabel)}</span>
          <button class="fh-art-card__bookmark" data-bookmark="${a.id}" type="button" aria-label="Bookmark">
            <i class="far fa-bookmark"></i>
          </button>
          <img src="${esc(a.img)}" alt="${esc(a.title)}" loading="lazy" />
        </div>
        <div class="fh-art-card__body">
          <h3 class="fh-art-card__title">${esc(a.title)}</h3>
          <p class="fh-art-card__desc">${esc(a.desc)}</p>
          <div class="fh-art-card__author">
            <div class="fh-art-card__author-avatar" style="--c1:${a.authorColor[0]};--c2:${a.authorColor[1]}">
              ${initials(a.author)}
            </div>
            <div>
              <div class="fh-art-card__author-name">${esc(a.author)}</div>
            </div>
            <div class="fh-art-card__meta">
              <span><i class="fas fa-clock"></i> ${a.readTime}m</span>
              <span><i class="fas fa-heart"></i> ${formatViews(a.likes)}</span>
            </div>
          </div>
        </div>
      </a>
    `;
  }

  function renderGrid(reset) {
    const grid = $('#fhArtGrid');
    const empty = $('#fhArtEmpty');
    const loadWrap = $('#fhArtLoadWrap');
    if (!grid) return;

    const list = state.filtered;
    const showCount = state.page * state.perPage;
    const visible = list.slice(0, showCount);

    if (!list.length) {
      grid.innerHTML = '';
      grid.style.display = 'none';
      empty.style.display = 'flex';
      loadWrap.style.display = 'none';
      updateCount(0);
      return;
    }

    grid.style.display = 'grid';
    empty.style.display = 'none';

    grid.innerHTML = visible.map(renderCard).join('');

    const offset = reset ? 0 : (showCount - visible.length);
    const cards = $$('.fh-art-card', grid);
    cards.forEach((c, i) => {
      if (i >= visible.length - (state.perPage)) {
        setTimeout(() => c.classList.add('is-visible'), (i - (visible.length - state.perPage)) * 50);
      } else {
        c.classList.add('is-visible');
      }
    });

    if (visible.length >= list.length) {
      loadWrap.style.display = 'none';
    } else {
      loadWrap.style.display = 'flex';
    }

    updateCount(list.length);
    bindCardActions();
  }

  function updateCount(n) {
    const el = $('#fhArtCount');
    if (el) el.textContent = n;
  }

  function bindCardActions() {
    $$('.fh-art-card__bookmark').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.dataset.bookmark;
        const active = btn.classList.toggle('is-active');
        const icon = btn.querySelector('i');
        if (icon) icon.className = active ? 'fas fa-bookmark' : 'far fa-bookmark';
        try {
          const key = 'fanhub-bookmark-article-' + id;
          localStorage.setItem(key, active ? '1' : '0');
        } catch (err) {}
      });

      /* load initial state */
      const id = btn.dataset.bookmark;
      try {
        if (localStorage.getItem('fanhub-bookmark-article-' + id) === '1') {
          btn.classList.add('is-active');
          const icon = btn.querySelector('i');
          if (icon) icon.className = 'fas fa-bookmark';
        }
      } catch (err) {}
    });
  }


  function refresh() {
    applyFilters();
    state.page = 1;
    renderGrid(true);
  }

  function initFilters() {
    $$('.fh-art__chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        $$('.fh-art__chip').forEach((c) => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        state.category = chip.dataset.cat;
        refresh();
      });
    });

    const search = $('#fhArtSearch');
    if (search) {
      let t = 0;
      search.addEventListener('input', (e) => {
        clearTimeout(t);
        const v = e.target.value;
        t = setTimeout(() => {
          state.query = v.trim();
          refresh();
        }, 200);
      });
    }

    const sort = $('#fhArtSort');
    if (sort) {
      sort.addEventListener('change', (e) => {
        state.sort = e.target.value;
        refresh();
      });
    }

    const loadMore = $('#fhArtLoadMore');
    if (loadMore) {
      loadMore.addEventListener('click', () => {
        state.page++;
        renderGrid(false);
      });
    }
  }

  async function init() {
    try {
      if (window.FHApi) {
        const res = await window.FHApi.get('/frontend/articles');
        if (res && Array.isArray(res.articles) && res.articles.length) ARTICLES = res.articles;
      }
    } catch (e) {}
    renderFeatured();
    initFilters();
    refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();