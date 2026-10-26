(() => {
  'use strict';

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));


  const CHARACTERS = {
    1: {
      id: 1,
      name: 'Eren Yeager',
      jpName: 'エレン・イェーガー',
      fandom: 'Attack on Titan',
      fandomHref: 'anime.html',
      category: 'Anime',
      categoryHref: 'anime.html',
      role: 'Protagonist',
      subtitle: 'The Attack Titan · Survey Corps',
      desc: 'A young soldier who vows to exterminate all Titans after his hometown is destroyed.',
      bg: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=1600',
      portrait: '',
      rating: '9.0',
      views: '12.4K',
      favorites: '892',
      episodes: '87'
    }
  };


  function initTabs() {
    $$('.fh-cs__tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        const key = tab.dataset.tab;
        $$('.fh-cs__tab').forEach((t) => t.classList.remove('is-active'));
        $$('.fh-cs__panel').forEach((p) => {
          p.classList.toggle('is-active', p.dataset.panel === key);
        });
        tab.classList.add('is-active');
      });
    });
  }


  function initStars() {
    const wrap = $('#fhCsStars');
    const hint = $('#fhCsRatingHint');
    if (!wrap) return;

    const buttons = $$('button', wrap);
    const KEY = 'fanhub-rating-char-' + (getCharacterId());

    /* Load saved rating */
    let saved = 0;
    try { saved = parseInt(localStorage.getItem(KEY), 10) || 0; } catch (e) {}

    function paint(n, hover) {
      buttons.forEach((b, i) => {
        const val = i + 1;
        b.classList.toggle('is-active', !hover && val <= saved);
        b.classList.toggle('is-hover', !!hover && val <= n);
        const icon = b.querySelector('i');
        if (icon) {
          const isFilled = (hover ? val <= n : val <= saved);
          icon.className = isFilled ? 'fas fa-star' : 'far fa-star';
        }
      });
    }

    function updateHint() {
      if (!hint) return;
      const labels = ['Tap to rate', 'Terrible', 'Meh', 'Good', 'Great', 'Masterpiece'];
      hint.textContent = saved ? `${labels[saved]} · ${saved}/5` : labels[0];
    }

    buttons.forEach((b, i) => {
      b.addEventListener('mouseenter', () => paint(i + 1, true));
      b.addEventListener('mouseleave', () => paint(0, false));
      b.addEventListener('click', () => {
        saved = i + 1;
        try { localStorage.setItem(KEY, String(saved)); } catch (e) {}
        paint(0, false);
        updateHint();
      });
    });

    paint(0, false);
    updateHint();
  }

  function initBookmark() {
    const btn = $('#fhCsBookmarkBtn');
    if (!btn) return;

    const KEY = 'fanhub-bookmark-char-' + getCharacterId();
    let active = false;
    try { active = localStorage.getItem(KEY) === '1'; } catch (e) {}

    function paint() {
      const icon = btn.querySelector('i');
      const label = btn.querySelector('span');
      if (active) {
        btn.classList.add('is-active');
        if (icon) icon.className = 'fas fa-bookmark';
        if (label) label.textContent = 'Bookmarked';
      } else {
        btn.classList.remove('is-active');
        if (icon) icon.className = 'far fa-bookmark';
        if (label) label.textContent = 'Bookmark';
      }
    }

    btn.addEventListener('click', () => {
      active = !active;
      try { localStorage.setItem(KEY, active ? '1' : '0'); } catch (e) {}
      paint();
    });

    paint();
  }


  function initShare() {
    const btn = $('#fhCsShareBtn');
    if (!btn) return;

    btn.addEventListener('click', async () => {
      const data = {
        title: document.title,
        text: 'Check out this character on Fan Hub Plus!',
        url: window.location.href
      };

      try {
        if (navigator.share) {
          await navigator.share(data);
        } else if (navigator.clipboard) {
          await navigator.clipboard.writeText(window.location.href);
          const old = btn.innerHTML;
          btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
          setTimeout(() => { btn.innerHTML = old; }, 1600);
        }
      } catch (e) {}
    });
  }

  function getCharacterId() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'), 10) || 1;
  }

  function getCharacter(id) {
    return CHARACTERS[id] || CHARACTERS[1];
  }


  function renderHero(c) {
    const name = $('#fhCsName');
    if (name) name.textContent = c.name;

    const sub = $('#fhCsSubtitle');
    if (sub) sub.textContent = c.subtitle;

    const desc = $('#fhCsDesc');
    if (desc) desc.textContent = c.desc;

    const fandom = $('#fhCsFandom');
    if (fandom) fandom.innerHTML = `<i class="fas fa-dragon"></i> ${c.fandom}`;

    const fandomLink = $('#fhCsFandomLink');
    if (fandomLink) {
      fandomLink.textContent = c.fandom;
      fandomLink.href = c.fandomHref;
    }

    const role = $('#fhCsRole');
    if (role) role.textContent = c.role;

    const cat = $('#fhCsCategory');
    if (cat) cat.innerHTML = `<i class="fas fa-tag"></i> ${c.category}`;

    const bc = $('#fhCsBreadcrumb');
    if (bc) bc.textContent = c.name;

    const bg = $('#fhCsHeroBg');
    if (bg && c.bg) bg.style.backgroundImage = `url(${c.bg})`;

    const portrait = $('#fhCsPortrait');
    if (portrait && c.portrait) {
      portrait.style.backgroundImage = `url(${c.portrait})`;
      const init = $('#fhCsPortraitInitial');
      if (init) init.style.display = 'none';
    } else {
      const init = $('#fhCsPortraitInitial');
      if (init) init.textContent = c.name.charAt(0).toUpperCase();
    }

    document.title = `${c.name} | Fan Hub Plus`;
  }


  function init() {
    const id = getCharacterId();
    const c = getCharacter(id);

    renderHero(c);
    initTabs();
    initStars();
    initBookmark();
    initShare();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();