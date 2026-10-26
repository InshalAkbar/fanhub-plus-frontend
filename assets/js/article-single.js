(() => {
  'use strict';

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));

  let ARTICLES = {
    1: {
      id: 1,
      title: 'Attack on Titan: The Final Season Review — A Masterpiece or Betrayal?',
      lead: 'A deep dive into the controversial ending that divided the fandom for years. Was it a worthy conclusion or a betrayal of everything the story built?',
      category: 'Anime',
      catIcon: 'fa-dragon',
      catHref: 'anime.html',
      author: 'Maika Asa',
      authorColor: ['#6366f1', '#a855f7'],
      authorBio: 'Anime critic and lifelong fan. Writes long-form reviews at 2 AM.',
      date: '2026-09-20T10:00:00Z',
      readTime: 12,
      views: 4200,
      likes: 312,
      heroImg: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=1600',
      heroCaption: 'Eren Yeager, the Attack Titan',
      body: [
        { type: 'p', text: 'The final season of <strong>Attack on Titan</strong> is a rare thing. Not a story that ends, but one that <em>refuses to end</em> — because its ending is not really an ending at all. It is a question. And like all great questions, it does not have a comfortable answer.' },
        { type: 'h2', text: 'The Setup', id: 'setup' },
        { type: 'p', text: 'We were promised a war. We got a war — but the war was never between the Survey Corps and Marley. It was between <strong>who we thought Eren was</strong> and who he actually became. From the moment he touched Historia\'s hand and saw the future, every choice he made carried a weight only he could feel.' },
        { type: 'blockquote', text: 'If you win, you live. If you lose, you die. If you don\'t fight, you can\'t win.', author: 'Eren Yeager' },
        { type: 'h2', text: 'The Rumbling — A Necessary Evil?', id: 'rumbling' },
        { type: 'p', text: 'The Rumbling is the series\' moral fulcrum. Millions of lives on one side; the extinction of an entire people on the other. Isayama does not give us a clean answer — he gives us <strong>Eren\'s answer</strong>, and asks whether it is enough.' },
        { type: 'h3', text: 'Key moments', id: 'moments' },
        { type: 'timeline', items: [
          { title: 'The Ocean', desc: '"If we kill all our enemies over there… will we finally be free?" — the moment the story turned.' },
          { title: 'Declaration of War', desc: 'Willy Tybur\'s speech shattered by Eren\'s transformation. The world changes in seconds.' },
          { title: 'The Rumbling Begins', desc: 'Millions of Colossal Titans march. The apocalypse is no longer hypothetical.' },
          { title: 'Final Paths', desc: 'The last conversation between Eren and Armin redefines the entire story.' }
        ]},
        { type: 'h2', text: 'The Ending — Betrayal or Truth?', id: 'ending' },
        { type: 'p', text: 'The ending divided the fandom, but that division is itself evidence of the story\'s ambition. Isayama chose to make us <strong>complicit</strong> — we spent a decade cheering for someone who was already planning a genocide. The final chapter is not a resolution; it is a mirror.' },
        { type: 'img', src: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=1200', caption: 'The Paths — where all of time exists at once.' },
        { type: 'p', text: 'Whether you loved or hated the ending, one thing is certain: <em>no other anime in the last decade has forced us to think this hard about what it means to be free.</em>' }
      ]
    }
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

  function formatViews(n) {
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return String(n);
  }

  function getArticleId() {
    const p = new URLSearchParams(window.location.search);
    return parseInt(p.get('id'), 10) || 1;
  }


  function renderBody(blocks) {
    return blocks.map((b) => {
      switch (b.type) {
        case 'h2':
          return `<h2 id="${esc(b.id || '')}">${b.text}</h2>`;
        case 'h3':
          return `<h3 id="${esc(b.id || '')}">${b.text}</h3>`;
        case 'p':
          return `<p>${b.text}</p>`;
        case 'blockquote':
          return `<blockquote>${b.text}${b.author ? `<footer>— ${esc(b.author)}</footer>` : ''}</blockquote>`;
        case 'img':
          return `<figure style="margin:28px 0;"><img src="${esc(b.src)}" alt="${esc(b.caption)}" loading="lazy" />${b.caption ? `<figcaption style="font-size:0.82rem;color:var(--fh-text-muted);margin-top:10px;text-align:center;">${esc(b.caption)}</figcaption>` : ''}</figure>`;
        case 'timeline':
          return `<ul class="fh-as__timeline">${b.items.map((it) => `<li><strong>${esc(it.title)}</strong><span>${esc(it.desc)}</span></li>`).join('')}</ul>`;
        default:
          return '';
      }
    }).join('');
  }


  function renderArticle(a) {
    document.title = `${a.title} | Fan Hub Plus`;

    const bc = $('#fhAsBreadcrumb');
    if (bc) bc.textContent = a.title;

    const catLink = $('#fhAsCatLink');
    if (catLink) {
      catLink.textContent = a.category;
      catLink.href = a.catHref;
    }

    const cat = $('#fhAsCat');
    if (cat) cat.innerHTML = `<i class="fas ${a.catIcon}"></i> ${esc(a.category)}`;

    const title = $('#fhAsTitle');
    if (title) title.textContent = a.title;

    const lead = $('#fhAsLead');
    if (lead) lead.textContent = a.lead;

    const avatar = $('#fhAsAuthorAvatar');
    if (avatar) {
      avatar.textContent = initials(a.author);
      avatar.style.background = `linear-gradient(135deg, ${a.authorColor[0]}, ${a.authorColor[1]})`;
    }

    const name = $('#fhAsAuthorName');
    if (name) name.textContent = a.author;

    const date = $('#fhAsDate');
    if (date) date.textContent = formatDate(a.date);

    const rt = $('#fhAsReadTime');
    if (rt) rt.textContent = a.readTime;

    const views = $('#fhAsViews');
    if (views) views.textContent = formatViews(a.views);

    const heroImg = $('#fhAsHeroImg');
    if (heroImg) {
      heroImg.src = a.heroImg;
      heroImg.alt = a.title;
    }

    const cap = $('#fhAsHeroCaption');
    if (cap) cap.textContent = a.heroCaption || '';

    const content = $('#fhAsContent');
    if (content) content.innerHTML = renderBody(a.body);

    /* Stats sidebar */
    const vs = $('#fhAsViewsStat');
    if (vs) vs.textContent = formatViews(a.views);
    const ls = $('#fhAsLikesStat');
    if (ls) ls.textContent = formatViews(a.likes);

    /* Author box */
    const boxAv = $('#fhAsBoxAvatar');
    if (boxAv) {
      boxAv.textContent = initials(a.author);
      boxAv.style.background = `linear-gradient(135deg, ${a.authorColor[0]}, ${a.authorColor[1]})`;
    }
    const boxName = $('#fhAsBoxName');
    if (boxName) boxName.textContent = a.author;
    const boxBio = $('#fhAsBoxBio');
    if (boxBio) boxBio.textContent = a.authorBio;

    /* TOC */
    buildTOC(a);

    /* Related */
    buildRelated(a);
  }

  function buildTOC(a) {
    const wrap = $('#fhAsTOC');
    if (!wrap) return;
    const headings = a.body.filter((b) => b.type === 'h2' && b.id);
    if (!headings.length) {
      wrap.closest('.fh-as__toc').style.display = 'none';
      return;
    }

    wrap.innerHTML = headings.map((h) =>
      `<li><a href="#${esc(h.id)}">${esc(h.text)}</a></li>`
    ).join('');

    /* Active state on scroll */
    const links = $$('a', wrap);
    const h2s = headings.map((h) => document.getElementById(h.id)).filter(Boolean);

    function update() {
      const scrollY = window.scrollY + 140;
      let current = null;
      h2s.forEach((el) => {
        if (el.offsetTop <= scrollY) current = el.id;
      });
      links.forEach((l) => {
        l.classList.toggle('is-active', l.getAttribute('href') === '#' + current);
      });
    }

    window.addEventListener('scroll', update, { passive: true });
    update();

    links.forEach((l) => {
      l.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(l.getAttribute('href'));
        if (target) {
          window.scrollTo({ top: target.offsetTop - 100, behavior: 'smooth' });
        }
      });
    });
  }

  function buildRelated(current) {
    const wrap = $('#fhAsRelated');
    const moreWrap = $('#fhAsMoreGrid');
    const others = Object.values(ARTICLES).filter((a) => a.id !== current.id);

    /* If no other articles, show placeholder grid */
    if (!others.length) {
      const placeholders = [
        { id: 2, title: 'Top 10 Manga of 2025', category: 'Manga', img: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=800', readTime: 8 },
        { id: 3, title: 'BTS Concert Recap', category: 'K-Pop', img: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=800', readTime: 6 },
        { id: 4, title: 'Why Elden Ring is a Masterpiece', category: 'Gaming', img: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=800', readTime: 15 }
      ];
      if (wrap) {
        wrap.innerHTML = placeholders.slice(0, 3).map((r) => `
          <a href="article-single.html?id=${r.id}" class="fh-as-related-item">
            <img src="${esc(r.img)}" alt="${esc(r.title)}" loading="lazy" />
            <div class="fh-as-related-item-body">
              <div class="fh-as-related-item-title">${esc(r.title)}</div>
              <div class="fh-as-related-item-meta">${esc(r.category)} · ${r.readTime} min</div>
            </div>
          </a>`).join('');
      }
      if (moreWrap) {
        moreWrap.innerHTML = placeholders.map((r) => `
          <a href="article-single.html?id=${r.id}" class="fh-art-card" style="opacity:1;transform:none;">
            <div class="fh-art-card__img">
              <span class="fh-art-card__cat">${esc(r.category)}</span>
              <img src="${esc(r.img)}" alt="${esc(r.title)}" loading="lazy" />
            </div>
            <div class="fh-art-card__body">
              <h3 class="fh-art-card__title">${esc(r.title)}</h3>
              <div class="fh-art-card__author">
                <div class="fh-art-card__author-avatar" style="--c1:#6366f1;--c2:#a855f7">FH</div>
                <div><div class="fh-art-card__author-name">Fan Hub Plus</div></div>
                <div class="fh-art-card__meta"><span><i class="fas fa-clock"></i> ${r.readTime}m</span></div>
              </div>
            </div>
          </a>`).join('');
      }
      return;
    }

    /* If others exist (future dynamic), render properly */
    if (wrap) {
      wrap.innerHTML = others.slice(0, 4).map((r) => `
        <a href="article-single.html?id=${r.id}" class="fh-as-related-item">
          <img src="${esc(r.heroImg)}" alt="${esc(r.title)}" loading="lazy" />
          <div class="fh-as-related-item-body">
            <div class="fh-as-related-item-title">${esc(r.title)}</div>
            <div class="fh-as-related-item-meta">${esc(r.category)} · ${r.readTime} min</div>
          </div>
        </a>`).join('');
    }
  }

  function initBookmark(a) {
    const btn = $('#fhAsBookmark');
    if (!btn) return;
    const KEY = 'fanhub-bookmark-article-' + a.id;

    function paint() {
      const on = localStorage.getItem(KEY) === '1';
      btn.classList.toggle('is-active', on);
      const icon = btn.querySelector('i');
      if (icon) icon.className = on ? 'fas fa-bookmark' : 'far fa-bookmark';
      const txt = btn.childNodes[btn.childNodes.length - 1];
      if (txt && txt.nodeType === 3) txt.textContent = on ? ' Saved' : ' Save';
    }

    btn.addEventListener('click', () => {
      const wasOn = localStorage.getItem(KEY) === '1';
      try { localStorage.setItem(KEY, wasOn ? '0' : '1'); } catch (e) {}
      paint();
    });

    paint();
  }


  function initShare() {
    const btn = $('#fhAsShare');
    if (!btn) return;

    btn.addEventListener('click', async () => {
      const data = {
        title: document.title,
        text: 'Check out this article on Fan Hub Plus!',
        url: window.location.href
      };

      try {
        if (navigator.share) await navigator.share(data);
        else if (navigator.clipboard) {
          await navigator.clipboard.writeText(window.location.href);
          const old = btn.innerHTML;
          btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
          setTimeout(() => { btn.innerHTML = old; }, 1600);
        }
      } catch (e) {}
    });
  }


  function initReactions(a) {
    const wrap = $('.fh-as__reactions-btns');
    if (!wrap) return;

    const KEY = 'fanhub-reactions-article-' + a.id;
    let active = null;
    try { active = localStorage.getItem(KEY); } catch (e) {}

    function paint() {
      $$('.fh-as__reaction', wrap).forEach((b) => {
        b.classList.toggle('is-active', b.dataset.reaction === active);
      });
    }

    $$('.fh-as__reaction', wrap).forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.reaction;
        active = (active === key) ? null : key;
        try {
          if (active) localStorage.setItem(KEY, active);
          else localStorage.removeItem(KEY);
        } catch (e) {}
        paint();
      });
    });

    paint();
  }


  async function init() {
    const id = getArticleId();
    let a = ARTICLES[id] || ARTICLES[1];
    try {
      if (window.FHApi) {
        const r = await window.FHApi.get('/frontend/articles/' + id);
        if (r && r.article) {
          const x = r.article;
          a = {
            id:x.id,title:x.title,lead:x.excerpt || x.desc,category:x.categoryLabel || x.category || 'Article',
            catIcon:'fa-newspaper',catHref:'articles.html',author:x.author || 'Fan Hub Plus',
            authorColor:['#6366f1','#a855f7'],authorBio:'Fan Hub Plus community writer.',date:x.date,readTime:Math.max(1,Math.round((String(x.body||'').split(/\s+/).length)/200)),views:x.views||0,likes:0,
            heroImg:x.img || '',heroCaption:'',body:[{type:'p',text:x.body || x.desc || ''}]
          };
          ARTICLES = Object.assign({}, ARTICLES, {[id]:a});
        }
      }
    } catch(e) {}
    renderArticle(a);
    initBookmark(a);
    initShare();
    initReactions(a);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();