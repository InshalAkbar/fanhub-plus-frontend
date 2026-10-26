(() => {
  'use strict';

  const $  = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));

  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const DATA_URL = 'assets/data/dashboard.json';

  const FALLBACK = {
    user: {
      name: 'Yusha',
      avatar: '',
      memberSince: 'Sep 2026',
      lastLogin: '2 hours ago'
    },
    stats: {
      bookmarks: 24,
      submissions: 5,
      feedback: 3,
      fandoms: 6
    },
    notifications: 3,
    fandoms: [
      { key: 'anime',   label: 'Anime',   icon: 'fa-dragon',        color: 'linear-gradient(135deg,#6366f1,#a855f7)' },
      { key: 'gaming',  label: 'Gaming',  icon: 'fa-gamepad',       color: 'linear-gradient(135deg,#22d3ee,#6366f1)' },
      { key: 'kpop',    label: 'K-Pop',   icon: 'fa-music',         color: 'linear-gradient(135deg,#ec4899,#a855f7)' },
      { key: 'movies',  label: 'Movies',  icon: 'fa-film',          color: 'linear-gradient(135deg,#f59e0b,#ec4899)' },
      { key: 'manga',   label: 'Manga',   icon: 'fa-scroll',        color: 'linear-gradient(135deg,#10b981,#22d3ee)' },
      { key: 'cosplay', label: 'Cosplay', icon: 'fa-user-ninja',    color: 'linear-gradient(135deg,#a855f7,#ec4899)' }
    ],
    bookmarks: [
      { id: 1, title: 'Attack on Titan S4',       type: 'Anime',     year: '2023', img: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400' },
      { id: 2, title: 'Elden Ring Guide',          type: 'Gaming',    year: '2024', img: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=400' },
      { id: 3, title: 'BTS Concert Recap',         type: 'K-Pop',     year: '2025', img: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=400' },
      { id: 4, title: 'Arcane Season 2',           type: 'TV Series', year: '2024', img: 'https://images.unsplash.com/photo-1618945524163-32451704cbb8?q=80&w=400' },
      { id: 5, title: 'Spider-Verse Poster Set',   type: 'Merch',     year: '2024', img: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=400' },
      { id: 6, title: 'One Piece Manga Vol. 108',  type: 'Manga',     year: '2023', img: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=400' }
    ],
    activity: [
      { type: 'bookmark',   text: 'You bookmarked <strong>Attack on Titan S4</strong>',       time: '2 hours ago' },
      { type: 'rating',     text: 'You rated <strong>Elden Ring</strong> 5 stars',            time: '1 day ago' },
      { type: 'submission', text: 'You submitted <strong>Cosplay Photos</strong> for review', time: '3 days ago' },
      { type: 'comment',    text: 'You commented on <strong>BTS Recap</strong>',              time: '1 week ago' },
      { type: 'login',      text: 'You logged in from <strong>Karachi, PK</strong>',          time: '2 hours ago' }
    ],
    quickLinks: [
      { title: 'My Bookmarks',   desc: 'View all saved content',     icon: 'fa-bookmark',       href: 'my-bookmarks.html' },
      { title: 'My Submissions', desc: 'Track fan-submitted items',  icon: 'fa-cloud-arrow-up', href: 'my-submissions.html' },
      { title: 'My Feedback',    desc: 'Bugs, suggestions & queries',icon: 'fa-comment-dots',   href: 'my-feedback.html' },
      { title: 'Notifications',  desc: 'Recent alerts & updates',    icon: 'fa-bell',           href: 'notifications.html' }
    ]
  };

  const ACTIVITY_ICON = {
    bookmark:   { icon: 'fa-bookmark',    cls: 'fh-dash__activity-icon--bookmark' },
    rating:     { icon: 'fa-star',        cls: 'fh-dash__activity-icon--rating' },
    submission: { icon: 'fa-cloud-arrow-up', cls: 'fh-dash__activity-icon--submission' },
    comment:    { icon: 'fa-comment',     cls: 'fh-dash__activity-icon--comment' },
    login:      { icon: 'fa-right-to-bracket', cls: 'fh-dash__activity-icon--login' }
  };

  function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    if (h < 21) return 'Good evening';
    return 'Good night';
  }

  function renderWelcome(user, notifications) {
    const nameEl = $('#fhDashName');
    const avatarEl = $('#fhDashAvatar');
    const greetingEl = $('#fhGreetingTime');
    const memberEl = $('#fhMemberSince');
    const lastLoginEl = $('#fhLastLogin');
    const notifEl = $('#fhNotifCount');

    if (nameEl) nameEl.textContent = user.name || 'User';
    if (avatarEl) {
      avatarEl.textContent = (user.name || 'U').charAt(0).toUpperCase();
      if (user.avatar) {
        avatarEl.style.backgroundImage = `url(${user.avatar})`;
        avatarEl.style.backgroundSize = 'cover';
        avatarEl.style.backgroundPosition = 'center';
        avatarEl.textContent = '';
      }
    }
    if (greetingEl) greetingEl.textContent = getGreeting();
    if (memberEl) memberEl.textContent = user.memberSince || '—';
    if (lastLoginEl) lastLoginEl.textContent = user.lastLogin || '—';
    if (notifEl) {
      if (notifications > 0) notifEl.textContent = String(notifications);
      else notifEl.style.display = 'none';
    }
  }

  function animateCounter(el, target, duration = 1200) {
    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased).toLocaleString();
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(tick);
  }

  function renderStats(stats) {
    const map = {
      bookmarks:   stats.bookmarks   || 0,
      submissions: stats.submissions || 0,
      feedback:    stats.feedback    || 0,
      fandoms:     stats.fandoms     || 0
    };

    const els = $$('.fh-dash__stat-value[data-count]');
    if (!els.length) return;

    const values = [map.bookmarks, map.submissions, map.feedback, map.fandoms];

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const idx = els.indexOf(el);
          const target = values[idx] || 0;
          el.dataset.count = String(target);
          animateCounter(el, target);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.4 });

    els.forEach((el) => io.observe(el));
  }

  function renderFandoms(list) {
    const wrap = $('#fhFandomsList');
    if (!wrap) return;

    if (!list || !list.length) {
      wrap.innerHTML = `
        <div class="fh-dash__empty">
          <i class="fas fa-heart"></i>
          <p>No favorite fandoms yet.</p>
          <a href="profile-edit.html">Add some in your profile</a>
        </div>`;
      return;
    }

    wrap.innerHTML = list.map((f) => `
      <a href="${esc(f.key)}.html" class="fh-dash__fandom">
        <span class="fh-dash__fandom-icon" style="background:${esc(f.color)}">
          <i class="fas ${esc(f.icon)}"></i>
        </span>
        <span>${esc(f.label)}</span>
      </a>
    `).join('');
  }

  function renderBookmarks(list) {
    const wrap = $('#fhBookmarksGrid');
    if (!wrap) return;

    if (!list || !list.length) {
      wrap.innerHTML = `
        <div class="fh-dash__empty">
          <i class="fas fa-bookmark"></i>
          <p>No bookmarks yet. Start saving your favorites!</p>
          <a href="browse.html">Browse content</a>
        </div>`;
      return;
    }

    wrap.innerHTML = list.slice(0, 8).map((b) => `
      <article class="fh-dash__bookmark" data-bookmark-id="${b.id}" tabindex="0" role="button">
        <button class="fh-dash__bookmark-remove" data-remove="${b.id}" aria-label="Remove bookmark" type="button">
          <i class="fas fa-times"></i>
        </button>
        <span class="fh-dash__bookmark-type">${esc(b.type)}</span>
        <div class="fh-dash__bookmark-media">
          <img src="${esc(b.img)}" alt="${esc(b.title)}" loading="lazy" />
        </div>
        <div class="fh-dash__bookmark-body">
          <h3 class="fh-dash__bookmark-title">${esc(b.title)}</h3>
          <div class="fh-dash__bookmark-meta">
            <span>${esc(b.type)}</span>
            <span>${esc(b.year)}</span>
          </div>
        </div>
      </article>
    `).join('');

    $$('.fh-dash__bookmark-remove', wrap).forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.remove;
        const card = wrap.querySelector(`[data-bookmark-id="${id}"]`);
        if (card) {
          card.style.transition = 'opacity 0.3s, transform 0.3s';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => card.remove(), 300);
        }
      });
    });

    $$('.fh-dash__bookmark', wrap).forEach((card) => {
      card.addEventListener('click', () => {
        const id = card.dataset.bookmarkId;
        window.location.href = `content-detail.html?id=${id}`;
      });
    });
  }

  function renderActivity(list) {
    const wrap = $('#fhActivityList');
    if (!wrap) return;

    if (!list || !list.length) {
      wrap.innerHTML = `
        <div class="fh-dash__empty">
          <i class="fas fa-clock-rotate-left"></i>
          <p>No recent activity yet.</p>
        </div>`;
      return;
    }

    wrap.innerHTML = list.map((a) => {
      const ic = ACTIVITY_ICON[a.type] || ACTIVITY_ICON.bookmark;
      return `
        <div class="fh-dash__activity-item">
          <div class="fh-dash__activity-icon ${ic.cls}">
            <i class="fas ${ic.icon}"></i>
          </div>
          <div class="fh-dash__activity-body">
            <p class="fh-dash__activity-text">${a.text}</p>
            <span class="fh-dash__activity-time">${esc(a.time)}</span>
          </div>
        </div>`;
    }).join('');
  }

  function renderQuickLinks(list) {
    const wrap = $('#fhQuickLinks');
    if (!wrap) return;

    wrap.innerHTML = list.map((q) => `
      <a href="${esc(q.href)}" class="fh-dash__quick-card">
        <div class="fh-dash__quick-icon"><i class="fas ${esc(q.icon)}"></i></div>
        <h3 class="fh-dash__quick-title">${esc(q.title)}</h3>
        <p class="fh-dash__quick-desc">${esc(q.desc)}</p>
      </a>
    `).join('');
  }


  function chartTheme() {
    var styles = getComputedStyle(document.documentElement);
    return {
      text: styles.getPropertyValue('--fh-text-secondary').trim() || '#a8aec7',
      line: styles.getPropertyValue('--fh-line').trim() || 'rgba(255,255,255,.12)',
      accent1: styles.getPropertyValue('--fh-accent-1').trim() || '#6366f1',
      accent2: styles.getPropertyValue('--fh-accent-2').trim() || '#a855f7',
      accent3: styles.getPropertyValue('--fh-accent-3').trim() || '#ec4899'
    };
  }

  function renderCharts(analytics) {
    if (!window.Chart) return;

    var activityCanvas = document.getElementById('fhActivityChart');
    var bookmarkCanvas = document.getElementById('fhBookmarkChart');
    if (!activityCanvas || !bookmarkCanvas) return;

    if (window.fhActivityChartInstance) window.fhActivityChartInstance.destroy();
    if (window.fhBookmarkChartInstance) window.fhBookmarkChartInstance.destroy();

    var theme = chartTheme();
    var activity = Array.isArray(analytics && analytics.activity) ? analytics.activity : [];
    var mix = Array.isArray(analytics && analytics.bookmarkMix) ? analytics.bookmarkMix : [];

    window.fhActivityChartInstance = new Chart(activityCanvas, {
      type: 'line',
      data: {
        labels: activity.map(function (item) { return item.label; }),
        datasets: [
          {
            label: 'Bookmarks',
            data: activity.map(function (item) { return Number(item.bookmarks || 0); }),
            borderColor: theme.accent1,
            backgroundColor: 'rgba(99,102,241,.12)',
            borderWidth: 2.5,
            pointRadius: 3,
            pointHoverRadius: 6,
            tension: .38,
            fill: true
          },
          {
            label: 'Ratings',
            data: activity.map(function (item) { return Number(item.ratings || 0); }),
            borderColor: theme.accent2,
            backgroundColor: 'transparent',
            borderWidth: 2.5,
            pointRadius: 3,
            pointHoverRadius: 6,
            tension: .38
          },
          {
            label: 'Submissions',
            data: activity.map(function (item) { return Number(item.submissions || 0); }),
            borderColor: theme.accent3,
            backgroundColor: 'transparent',
            borderWidth: 2.5,
            pointRadius: 3,
            pointHoverRadius: 6,
            tension: .38
          }
,
          {
            label: 'Feedback',
            data: activity.map(function (item) { return Number(item.feedback || 0); }),
            borderColor: '#22d3ee',
            backgroundColor: 'transparent',
            borderWidth: 2.5,
            pointRadius: 3,
            pointHoverRadius: 6,
            tension: .38
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'top',
            labels: { color: theme.text, usePointStyle: true, boxWidth: 8, padding: 18 }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: theme.text }
          },
          y: {
            beginAtZero: true,
            ticks: { color: theme.text, precision: 0 },
            grid: { color: theme.line }
          }
        }
      }
    });

    window.fhBookmarkChartInstance = new Chart(bookmarkCanvas, {
      type: 'doughnut',
      data: {
        labels: mix.map(function (item) { return item.label; }),
        datasets: [{
          data: mix.map(function (item) { return Number(item.value || 0); }),
          backgroundColor: [
            theme.accent1,
            theme.accent2,
            theme.accent3,
            '#22d3ee',
            '#f59e0b'
          ],
          borderColor: 'rgba(7,9,20,.8)',
          borderWidth: 3,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '64%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: theme.text, usePointStyle: true, boxWidth: 8, padding: 14 }
          }
        }
      }
    });

    var status = document.getElementById('fhChartStatus');
    if (status) status.textContent = 'Live data';
  }

  function renderAll(data) {
    renderWelcome(data.user, data.notifications);
    renderStats(data.stats);
    renderFandoms(data.fandoms);
    renderBookmarks(data.bookmarks);
    renderActivity(data.activity);
    renderQuickLinks(data.quickLinks);
  }

  async function loadData() {
    try {
      if (window.FHApi) {
        const d = await window.FHApi.dashboard();
        return {
          user: Object.assign({memberSince:'',lastLogin:'Recently'}, d.user || {}),
          stats: {bookmarks:d.bookmarks||0, submissions:d.submissions||0, feedback:d.feedback||0, fandoms:0},
          notifications: 0,
          fandoms: [],
          bookmarks: (d.recentBookmarks||[]).map(function(b){return {id:b.id,title:b.item||'Saved item',type:(b.type||'').split('\\').pop(),year:'',img:''};}),
          activity: [],
          quickLinks: FALLBACK.quickLinks
        };
      }
      const res = await fetch(DATA_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error('fetch failed');
      return await res.json();
    } catch (err) { return FALLBACK; }
  }

  function initUserMenu() {
    const trigger = $('.fh-user-menu__trigger');
    const item = trigger && trigger.closest('.fh-nav__item--dropdown');
    if (!trigger || !item) return;

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const willOpen = !item.classList.contains('is-open');

      $$('.fh-nav__item--dropdown').forEach((d) => d.classList.remove('is-open'));

      if (willOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      } else {
        trigger.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.fh-user-menu')) {
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  async function init() {
    initUserMenu();

    const data = await loadData();
    renderAll(data);

    var analytics = { activity: [], bookmarkMix: [] };
    try {
      if (window.FHApi) {
        analytics = await window.FHApi.dashboardAnalytics();
      }
    } catch (error) {
      var status = document.getElementById('fhChartStatus');
      if (status) status.textContent = 'No activity yet';
    }

    renderCharts(analytics);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();