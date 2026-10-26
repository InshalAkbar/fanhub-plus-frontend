(() => {
  'use strict';

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));

  const NOTIFICATIONS = [
    {
      id: 'N-1001',
      type: 'submission',
      icon: 'fa-circle-check',
      name: 'Submission Approved',
      badge: 'Approved',
      text: 'Your article <strong>Attack on Titan S4 — Detailed Review</strong> has been approved and published.',
      time: '2026-09-26T10:30:00Z',
      unread: true
    },
    {
      id: 'N-1002',
      type: 'mention',
      icon: 'fa-at',
      name: 'You were mentioned',
      badge: 'Mention',
      text: '<strong>OtakuSensei</strong> mentioned you in a discussion about <strong>Top 10 Manga of 2025</strong>.',
      time: '2026-09-26T08:15:00Z',
      unread: true
    },
    {
      id: 'N-1003',
      type: 'event',
      icon: 'fa-calendar-star',
      name: 'Upcoming Event',
      badge: 'Event',
      text: '<strong>Karachi Comic-Con 2026</strong> starts in 3 days. Get your tickets before they sell out!',
      time: '2026-09-25T18:00:00Z',
      unread: true
    },
    {
      id: 'N-1004',
      type: 'bookmark',
      icon: 'fa-bookmark',
      name: 'Bookmark Reminder',
      badge: 'Reminder',
      text: 'You bookmarked <strong>Elden Ring Boss Guide</strong> a week ago. Have you tried Malenia yet?',
      time: '2026-09-24T14:20:00Z',
      unread: false
    },
    {
      id: 'N-1005',
      type: 'system',
      icon: 'fa-shield-halved',
      name: 'Security Update',
      badge: 'System',
      text: 'We\'ve upgraded our account security. Your password is safe — no action needed.',
      time: '2026-09-23T09:00:00Z',
      unread: false
    },
    {
      id: 'N-1006',
      type: 'submission',
      icon: 'fa-circle-xmark',
      name: 'Submission Needs Changes',
      badge: 'Rejected',
      text: 'Your submission <strong>BTS Concert Recap 2025</strong> needs some changes before it can be published.',
      time: '2026-09-22T16:45:00Z',
      unread: false
    },
    {
      id: 'N-1007',
      type: 'mention',
      icon: 'fa-at',
      name: 'You were mentioned',
      badge: 'Mention',
      text: '<strong>GamerQueen</strong> replied to your comment on <strong>Why Elden Ring is a Masterpiece</strong>.',
      time: '2026-09-21T11:30:00Z',
      unread: false
    },
    {
      id: 'N-1008',
      type: 'event',
      icon: 'fa-calendar-star',
      name: 'New Event Announced',
      badge: 'Event',
      text: 'A new <strong>Anime Movie Marathon</strong> has been added for Karachi. Check the details!',
      time: '2026-09-20T13:00:00Z',
      unread: false
    },
    {
      id: 'N-1009',
      type: 'bookmark',
      icon: 'fa-bookmark',
      name: 'New Chapter Alert',
      badge: 'Update',
      text: '<strong>One Piece Manga Vol. 109</strong> just dropped. Continue reading where you left off.',
      time: '2026-09-19T10:00:00Z',
      unread: false
    },
    {
      id: 'N-1010',
      type: 'system',
      icon: 'fa-gift',
      name: 'Welcome Bonus',
      badge: 'System',
      text: 'Thanks for joining Fan Hub Plus! Explore your dashboard to get started.',
      time: '2026-09-15T09:00:00Z',
      unread: false
    }
  ];

  const state = {
    all: NOTIFICATIONS.slice(),
    filter: 'all'
  };

  function timeAgo(iso) {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function groupKey(iso) {
    const d = new Date(iso);
    const now = new Date();
    const diffDays = Math.floor((now - d) / 86400000);
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return 'This Week';
    return 'Earlier';
  }

  function updateCounts() {
    const counts = {
      all: state.all.length,
      unread: 0,
      bookmark: 0,
      submission: 0,
      mention: 0,
      event: 0,
      system: 0
    };
    state.all.forEach((n) => {
      counts[n.type] = (counts[n.type] || 0) + 1;
      if (n.unread) counts.unread++;
    });

    $$('.fh-notif__chip-count').forEach((el) => {
      el.textContent = counts[el.dataset.count] || 0;
    });

    const unreadEl = $('#fhNotifUnread');
    const totalEl = $('#fhNotifTotal');
    if (unreadEl) unreadEl.textContent = counts.unread;
    if (totalEl) totalEl.textContent = counts.all;

    const statsUnread = $('[data-count="unread"]');
    const statsRead = $('[data-count="read"]');
    const statsMentions = $('[data-count="mentions"]');
    const statsEvents = $('[data-count="events"]');

    if (statsUnread) statsUnread.textContent = counts.unread;
    if (statsRead) statsRead.textContent = counts.all - counts.unread;
    if (statsMentions) statsMentions.textContent = counts.mention;
    if (statsEvents) statsEvents.textContent = counts.event;

    updateNavDot(counts.unread);
  }

  function updateNavDot(count) {
    const dot = $('.fh-user-menu__dot');
    if (!dot) return;
    if (count > 0) {
      dot.style.display = '';
    } else {
      dot.style.display = 'none';
    }
  }

  function applyFilter() {
    let list = [...state.all];
    if (state.filter === 'unread') {
      list = list.filter((n) => n.unread);
    } else if (state.filter !== 'all') {
      list = list.filter((n) => n.type === state.filter);
    }
    list.sort((a, b) => new Date(b.time) - new Date(a.time));
    return list;
  }

  function renderItem(n) {
    return `
      <article class="fh-notif__item${n.unread ? ' is-unread' : ''}" data-id="${n.id}">
        <div class="fh-notif__icon fh-notif__icon--${n.type}">
          <i class="fas ${n.icon}"></i>
        </div>
        <div class="fh-notif__body">
          <div class="fh-notif__head">
            <h3 class="fh-notif__name">${n.name}</h3>
            ${n.unread ? '<span class="fh-notif__badge">New</span>' : ''}
          </div>
          <p class="fh-notif__text">${n.text}</p>
          <span class="fh-notif__time">
            <i class="fas fa-clock"></i> ${timeAgo(n.time)}
          </span>
        </div>
        <div class="fh-notif__actions">
          ${n.unread ? `
            <button class="fh-notif__action" data-action="read" data-id="${n.id}" title="Mark as read" type="button">
              <i class="fas fa-check"></i>
            </button>
          ` : ''}
          <button class="fh-notif__action fh-notif__action--danger" data-action="delete" data-id="${n.id}" title="Delete" type="button">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </article>
    `;
  }

  function render() {
    const listEl = $('#fhNotifList');
    const emptyEl = $('#fhNotifEmpty');
    if (!listEl) return;

    const list = applyFilter();

    if (!list.length) {
      listEl.innerHTML = '';
      listEl.style.display = 'none';
      emptyEl.style.display = 'flex';
      if (!state.all.length) {
        emptyEl.querySelector('h3').textContent = 'No notifications';
        emptyEl.querySelector('p').textContent = 'You\'re all caught up. New alerts will appear here.';
      } else {
        emptyEl.querySelector('h3').textContent = 'All caught up!';
        emptyEl.querySelector('p').textContent = 'You have no notifications in this view.';
      }
      return;
    }

    listEl.style.display = 'flex';
    emptyEl.style.display = 'none';

    const groups = {};
    list.forEach((n) => {
      const key = groupKey(n.time);
      if (!groups[key]) groups[key] = [];
      groups[key].push(n);
    });

    const order = ['Today', 'Yesterday', 'This Week', 'Earlier'];
    let html = '';
    order.forEach((key) => {
      if (!groups[key]) return;
      html += `<div class="fh-notif__group-label">${key}</div>`;
      html += groups[key].map(renderItem).join('');
    });

    listEl.innerHTML = html;

    const items = $$('.fh-notif__item', listEl);
    items.forEach((item, i) => {
      setTimeout(() => item.classList.add('is-visible'), i * 40);
    });

    bindActions();
  }

  function bindActions() {
    $$('.fh-notif__action').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const id = btn.dataset.id;

        if (action === 'read') {
          state.all = state.all.map((n) => n.id === id ? { ...n, unread: false } : n);
          updateCounts();
          render();
        } else if (action === 'delete') {
          state.all = state.all.filter((n) => n.id !== id);
          updateCounts();
          render();
        }
      });
    });

    $$('.fh-notif__item').forEach((item) => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('.fh-notif__action')) return;
        const id = item.dataset.id;
        state.all = state.all.map((n) => n.id === id ? { ...n, unread: false } : n);
        updateCounts();
        render();
      });
    });
  }

  function initFilters() {
    $$('.fh-notif__chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        $$('.fh-notif__chip').forEach((c) => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        state.filter = chip.dataset.filter;
        render();
      });
    });
  }

  function initMarkAll() {
    const btn = $('#fhNotifMarkAll');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const hasUnread = state.all.some((n) => n.unread);
      if (!hasUnread) return;
      state.all = state.all.map((n) => ({ ...n, unread: false }));
      updateCounts();
      render();
    });
  }

  function initClear() {
    const btn = $('#fhNotifClear');
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (!state.all.length) return;
      if (!confirm('Clear all notifications? This cannot be undone.')) return;
      state.all = [];
      updateCounts();
      render();
    });
  }

  function init() {
    initFilters();
    initMarkAll();
    initClear();
    updateCounts();
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();