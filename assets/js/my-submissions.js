(() => {
  'use strict';

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));

  const FEEDBACK = [
    {
      id: 'FB-1024',
      type: 'bug',
      title: 'Search dropdown not closing on mobile',
      message: 'On my iPhone (Safari), after typing in the navbar search and tapping outside, the results panel stays open. Only pressing the X or navigating away closes it.',
      status: 'in-progress',
      submittedAt: '2026-09-25T11:30:00Z',
      reply: 'Thanks for reporting! We\'ve reproduced this on Safari 17 mobile. A fix is scheduled for the next release.'
    },
    {
      id: 'FB-1023',
      type: 'suggestion',
      title: 'Add dark mode to character detail pages',
      message: 'Love the site! Would be great if character detail pages also respected the dark mode setting — right now they look bright even in dark mode.',
      status: 'open',
      submittedAt: '2026-09-24T16:45:00Z'
    },
    {
      id: 'FB-1022',
      type: 'query',
      title: 'How do I submit fan art?',
      message: 'I couldn\'t find the fan art upload button. Is it under the community section or somewhere else?',
      status: 'resolved',
      submittedAt: '2026-09-22T09:15:00Z',
      reply: 'You can submit fan art from the "Fan Submit" page (link in the footer). It goes to admin review and typically appears within 48 hours.'
    },
    {
      id: 'FB-1021',
      type: 'bug',
      title: 'Bookmark count not updating on dashboard',
      message: 'After removing a bookmark from My Bookmarks, the dashboard stat still shows the old count until I refresh the page.',
      status: 'resolved',
      submittedAt: '2026-09-18T14:20:00Z',
      reply: 'Fixed in v2.4.1 — the counter now updates in real time. Thanks for the detailed report!'
    },
    {
      id: 'FB-1020',
      type: 'suggestion',
      title: 'Add K-Drama as a separate category',
      message: 'K-Dramas are super popular right now. Would love to see them as a separate category instead of being mixed with TV Shows.',
      status: 'open',
      submittedAt: '2026-09-15T20:10:00Z'
    },
    {
      id: 'FB-1019',
      type: 'query',
      title: 'Can I change my username?',
      message: 'I signed up with a random username. Can I change it later from my profile settings?',
      status: 'resolved',
      submittedAt: '2026-09-12T10:00:00Z',
      reply: 'Yes! Go to Profile → Edit Profile → Username field. Changes are saved instantly.'
    }
  ];

  const state = {
    all: FEEDBACK.slice(),
    filter: 'all',
    query: '',
    sort: 'recent'
  };

  function timeAgo(iso) {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function typeInfo(type) {
    if (type === 'bug') return { icon: 'fa-bug', label: 'Bug Report' };
    if (type === 'suggestion') return { icon: 'fa-lightbulb', label: 'Suggestion' };
    return { icon: 'fa-circle-question', label: 'Query' };
  }

  function statusInfo(status) {
    if (status === 'resolved') return { icon: 'fa-circle-check', label: 'Resolved' };
    if (status === 'in-progress') return { icon: 'fa-spinner', label: 'In Progress' };
    return { icon: 'fa-hourglass-half', label: 'Open' };
  }

  function updateCounts() {
    const counts = { all: state.all.length, bug: 0, suggestion: 0, query: 0, open: 0, resolved: 0, inProgress: 0 };
    state.all.forEach((f) => {
      counts[f.type] = (counts[f.type] || 0) + 1;
      if (f.status === 'open') counts.open++;
      else if (f.status === 'resolved') counts.resolved++;
      else if (f.status === 'in-progress') counts.inProgress++;
    });

    $$('.fh-fb__chip-count').forEach((el) => {
      el.textContent = counts[el.dataset.count] || 0;
    });

    const totalEl = $('#fhFbCount');
    if (totalEl) totalEl.textContent = state.all.length;

    const statsTotal = $('[data-count="total"]');
    const statsOpen = $('[data-count="open"]');
    const statsResolved = $('[data-count="resolved"]');
    const statsAvg = $('[data-count="avg"]');

    if (statsTotal) statsTotal.textContent = counts.all;
    if (statsOpen) statsOpen.textContent = counts.open + counts.inProgress;
    if (statsResolved) statsResolved.textContent = counts.resolved;
    if (statsAvg) statsAvg.textContent = counts.all ? '12h' : '—';
  }

  function applyFilters() {
    let list = [...state.all];

    if (state.filter !== 'all') {
      list = list.filter((f) => f.type === state.filter);
    }

    if (state.query) {
      const q = state.query.toLowerCase();
      list = list.filter((f) =>
        f.title.toLowerCase().includes(q) ||
        f.message.toLowerCase().includes(q) ||
        f.id.toLowerCase().includes(q)
      );
    }

    if (state.sort === 'oldest') {
      list.sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));
    } else if (state.sort === 'type') {
      list.sort((a, b) => a.type.localeCompare(b.type));
    } else if (state.sort === 'status') {
      const order = { open: 0, 'in-progress': 1, resolved: 2 };
      list.sort((a, b) => order[a.status] - order[b.status]);
    } else {
      list.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    }

    return list;
  }

  function renderCard(f) {
    const t = typeInfo(f.type);
    const s = statusInfo(f.status);

    const replyHtml = f.reply
      ? `<div class="fh-fb__reply"><i class="fas fa-reply"></i><div><strong>Admin Reply</strong>${f.reply}</div></div>`
      : '';

    return `
      <article class="fh-fb__card" data-id="${f.id}">
        <div class="fh-fb__card-top">
          <span class="fh-fb__type fh-fb__type--${f.type}">
            <i class="fas ${t.icon}"></i> ${t.label}
          </span>
          <span class="fh-fb__status fh-fb__status--${f.status}">
            <i class="fas ${s.icon}"></i> ${s.label}
          </span>
          <span class="fh-fb__id">#${f.id}</span>
        </div>
        <h3 class="fh-fb__card-title">${f.title}</h3>
        <p class="fh-fb__card-msg">${f.message}</p>
        ${replyHtml}
        <div class="fh-fb__card-meta">
          <span><i class="fas fa-clock"></i> ${timeAgo(f.submittedAt)}</span>
          <div class="fh-fb__card-actions">
            ${f.status !== 'resolved' ? `
              <button class="fh-fb__action" data-action="close" data-id="${f.id}" type="button">
                <i class="fas fa-check"></i> Close
              </button>
            ` : ''}
            <button class="fh-fb__action fh-fb__action--danger" data-action="delete" data-id="${f.id}" type="button">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function render() {
    const listEl = $('#fhFbList');
    const emptyEl = $('#fhFbEmpty');
    if (!listEl) return;

    const list = applyFilters();

    if (!list.length) {
      listEl.innerHTML = '';
      listEl.style.display = 'none';
      emptyEl.style.display = 'flex';

      if (!state.all.length) {
        emptyEl.querySelector('h3').textContent = 'No feedback yet';
        emptyEl.querySelector('p').textContent = 'Help us improve Fan Hub Plus — send a bug report, suggestion, or question.';
      } else {
        emptyEl.querySelector('h3').textContent = 'No matches found';
        emptyEl.querySelector('p').textContent = 'Try a different filter or clear your search.';
      }
      return;
    }

    listEl.style.display = 'flex';
    emptyEl.style.display = 'none';
    listEl.innerHTML = list.map(renderCard).join('');

    const cards = $$('.fh-fb__card', listEl);
    cards.forEach((c, i) => {
      setTimeout(() => c.classList.add('is-visible'), i * 60);
    });

    bindActions();
  }

  function bindActions() {
    $$('.fh-fb__action').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const id = btn.dataset.id;

        if (action === 'close') {
          if (confirm('Mark this feedback as resolved?')) {
            state.all = state.all.map((f) =>
              f.id === id ? { ...f, status: 'resolved' } : f
            );
            updateCounts();
            render();
          }
        } else if (action === 'delete') {
          if (confirm('Delete this feedback? This cannot be undone.')) {
            state.all = state.all.filter((f) => f.id !== id);
            updateCounts();
            render();
          }
        }
      });
    });
  }

  function initFilters() {
    $$('.fh-fb__chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        $$('.fh-fb__chip').forEach((c) => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        state.filter = chip.dataset.filter;
        render();
      });
    });
  }

  function initSearch() {
    const input = $('#fhFbSearch');
    if (!input) return;
    let t = 0;
    input.addEventListener('input', (e) => {
      clearTimeout(t);
      const v = e.target.value;
      t = setTimeout(() => {
        state.query = v.trim();
        render();
      }, 150);
    });
  }

  function initSort() {
    const sel = $('#fhFbSort');
    if (!sel) return;
    sel.addEventListener('change', (e) => {
      state.sort = e.target.value;
      render();
    });
  }

  function init() {
    initFilters();
    initSearch();
    initSort();
    updateCounts();
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();