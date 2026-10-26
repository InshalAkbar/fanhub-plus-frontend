(() => {
  'use strict';

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));

  let EVENTS = [
    {
      id: 1,
      title: 'Karachi Comic-Con 2026',
      category: 'anime',
      categoryLabel: 'Anime Convention',
      city: 'Karachi',
      venue: 'Expo Centre, Hall 4',
      address: 'University Rd, Gulshan-e-Iqbal, Karachi',
      lat: 24.9209,
      lng: 67.0978,
      startDate: '2026-12-15T10:00:00',
      endDate: '2026-12-17T22:00:00',
      price: 'PKR 3,500',
      isFree: false,
      attendees: 45000,
      popularity: 98,
      img: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?q=80&w=800',
      desc: 'Pakistan\'s biggest fandom gathering with anime, cosplay, gaming, panels, and special guests.'
    },
    {
      id: 2,
      title: 'Lahore Gaming Fest 2026',
      category: 'gaming',
      categoryLabel: 'Gaming Expo',
      city: 'Lahore',
      venue: 'Expo Centre Lahore',
      address: 'Johar Town, Lahore',
      lat: 31.4722,
      lng: 74.2871,
      startDate: '2026-10-22T10:00:00',
      endDate: '2026-10-24T20:00:00',
      price: 'PKR 2,500',
      isFree: false,
      attendees: 28000,
      popularity: 92,
      img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800',
      desc: '3-day gaming expo featuring esports tournaments, new game reveals, and streamer meetups.'
    },
    {
      id: 3,
      title: 'BTS ARMY Meetup — Islamabad',
      category: 'kpop',
      categoryLabel: 'K-Pop Meetup',
      city: 'Islamabad',
      venue: 'Centaurus Mall',
      address: 'F-8 Markaz, Islamabad',
      lat: 33.7076,
      lng: 73.0484,
      startDate: '2026-11-05T17:00:00',
      endDate: '2026-11-05T22:00:00',
      price: 'Free',
      isFree: true,
      attendees: 800,
      popularity: 78,
      img: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=800',
      desc: 'Casual meetup for BTS ARMYs — music, dance covers, and community bonding.'
    },
    {
      id: 4,
      title: 'Cosplay Championship Lahore',
      category: 'cosplay',
      categoryLabel: 'Cosplay Contest',
      city: 'Lahore',
      venue: 'Alhamra Arts Council',
      address: 'Mall Rd, Lahore',
      lat: 31.5572,
      lng: 74.3287,
      startDate: '2026-11-20T14:00:00',
      endDate: '2026-11-20T23:00:00',
      price: 'PKR 1,500',
      isFree: false,
      attendees: 5000,
      popularity: 85,
      img: 'https://images.unsplash.com/photo-1542557753-745b88b3bf9b?q=80&w=800',
      desc: 'Pakistan\'s premier cosplay championship with celebrity judges and cash prizes.'
    },
    {
      id: 5,
      title: 'Comics & Manga Expo 2026',
      category: 'comics',
      categoryLabel: 'Comics Expo',
      city: 'Karachi',
      venue: 'Arts Council Karachi',
      address: 'M.R. Kiyani Rd, Karachi',
      lat: 24.8505,
      lng: 67.0264,
      startDate: '2026-10-08T11:00:00',
      endDate: '2026-10-10T21:00:00',
      price: 'PKR 2,000',
      isFree: false,
      attendees: 15000,
      popularity: 88,
      img: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=800',
      desc: 'India\'s finest comic publishers, manga imports, artist alleys, and exclusive drops.'
    },
    {
      id: 6,
      title: 'Marvel Movie Marathon Night',
      category: 'movies',
      categoryLabel: 'Movie Screening',
      city: 'Islamabad',
      venue: 'Cinepax Cinema',
      address: 'Safa Gold Mall, F-7, Islamabad',
      lat: 33.7194,
      lng: 73.0582,
      startDate: '2026-10-18T18:00:00',
      endDate: '2026-10-19T04:00:00',
      price: 'PKR 1,200',
      isFree: false,
      attendees: 500,
      popularity: 72,
      img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800',
      desc: 'Back-to-back screening of the entire MCU Infinity Saga in one epic night.'
    },
    {
      id: 7,
      title: 'Anime Fest Rawalpindi',
      category: 'anime',
      categoryLabel: 'Anime Meetup',
      city: 'Rawalpindi',
      venue: 'Ayub National Park',
      address: 'Jhelum Rd, Rawalpindi',
      lat: 33.5921,
      lng: 73.0669,
      startDate: '2026-11-12T12:00:00',
      endDate: '2026-11-12T20:00:00',
      price: 'PKR 800',
      isFree: false,
      attendees: 3000,
      popularity: 68,
      img: 'https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=800',
      desc: 'Outdoor anime festival featuring stalls, cosplay, food, and live performances.'
    },
    {
      id: 8,
      title: 'Esports Pakistan Finals',
      category: 'gaming',
      categoryLabel: 'Esports Finals',
      city: 'Karachi',
      venue: 'KDA Auditorium',
      address: 'Gulshan-e-Iqbal, Karachi',
      lat: 24.9165,
      lng: 67.0975,
      startDate: '2026-12-02T16:00:00',
      endDate: '2026-12-04T23:00:00',
      price: 'PKR 1,800',
      isFree: false,
      attendees: 12000,
      popularity: 94,
      img: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=800',
      desc: 'National finals of the biggest esports tournament in Pakistan — Dota 2, CS2, and PUBG.'
    },
    {
      id: 9,
      title: 'Cosplay Photoshoot Meetup',
      category: 'cosplay',
      categoryLabel: 'Cosplay Meetup',
      city: 'Islamabad',
      venue: 'Lake View Park',
      address: 'Murree Rd, Islamabad',
      lat: 33.7446,
      lng: 73.0894,
      startDate: '2026-10-05T15:00:00',
      endDate: '2026-10-05T19:00:00',
      price: 'Free',
      isFree: true,
      attendees: 150,
      popularity: 60,
      img: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?q=80&w=800',
      desc: 'Casual photoshoot for cosplayers of all skill levels. Bring your best outfits!'
    },
    {
      id: 10,
      title: 'Naruto Marathon Screening',
      category: 'anime',
      categoryLabel: 'Anime Screening',
      city: 'Lahore',
      venue: 'CUE Cinema',
      address: 'Gulberg III, Lahore',
      lat: 31.5153,
      lng: 74.3428,
      startDate: '2026-10-15T14:00:00',
      endDate: '2026-10-15T23:00:00',
      price: 'PKR 900',
      isFree: false,
      attendees: 300,
      popularity: 65,
      img: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800',
      desc: 'Relive the iconic Naruto moments on the big screen with fellow fans.'
    },
    {
      id: 11,
      title: 'Comic Artist Workshop',
      category: 'comics',
      categoryLabel: 'Workshop',
      city: 'Faisalabad',
      venue: 'Lyallpur Art Gallery',
      address: 'Jaranwala Rd, Faisalabad',
      lat: 31.4180,
      lng: 73.0790,
      startDate: '2026-11-08T14:00:00',
      endDate: '2026-11-08T18:00:00',
      price: 'PKR 1,000',
      isFree: false,
      attendees: 200,
      popularity: 55,
      img: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?q=80&w=800',
      desc: 'Learn comic book illustration from leading Pakistani artists.'
    },
    {
      id: 12,
      title: 'Blackpink Concert Watch Party',
      category: 'kpop',
      categoryLabel: 'Watch Party',
      city: 'Peshawar',
      venue: 'Islamic College Auditorium',
      address: 'University Rd, Peshawar',
      lat: 34.0086,
      lng: 71.5639,
      startDate: '2026-10-30T19:00:00',
      endDate: '2026-10-30T22:00:00',
      price: 'PKR 500',
      isFree: false,
      attendees: 400,
      popularity: 70,
      img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=800',
      desc: 'Join fellow BLINKs to watch the Born Pink concert on the big screen.'
    }
  ];

  const state = {
    all: EVENTS.slice(),
    filtered: EVENTS.slice(),
    city: 'all',
    category: 'all',
    date: 'all',
    query: '',
    sort: 'date',
    view: 'grid',
    userLocation: null,
    calMonth: new Date().getMonth(),
    calYear: new Date().getFullYear(),
    mapInited: false,
    map: null,
    markers: []
  };

  /* ============================================================
     HELPERS
     ============================================================ */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function formatDateRange(start, end) {
    const s = new Date(start);
    const e = new Date(end);
    if (s.toDateString() === e.toDateString()) {
      return s.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    return `${s.getDate()}–${e.getDate()} ${s.toLocaleDateString('en-US', { month: 'short' })} ${s.getFullYear()}`;
  }

  function getMonthShort(iso) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  }

  function getDayNum(iso) {
    return new Date(iso).getDate();
  }

  function isThisWeek(iso) {
    const d = new Date(iso);
    const now = new Date();
    const diff = (d - now) / 86400000;
    return diff >= 0 && diff <= 7;
  }

  function isThisMonth(iso) {
    const d = new Date(iso);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }

  function isNext3Months(iso) {
    const d = new Date(iso);
    const now = new Date();
    const diff = (d - now) / 86400000;
    return diff >= 0 && diff <= 90;
  }

  function isThisYear(iso) {
    return new Date(iso).getFullYear() === new Date().getFullYear();
  }

  function haversine(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) ** 2
            + Math.cos(lat1 * Math.PI / 180)
            * Math.cos(lat2 * Math.PI / 180)
            * Math.sin(dLng/2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }


  function applyFilters() {
    let list = state.all.slice();

    if (state.city !== 'all') {
      list = list.filter((e) => e.city === state.city);
    }

    if (state.category !== 'all') {
      list = list.filter((e) => e.category === state.category);
    }

    if (state.date !== 'all') {
      const check = {
        week: isThisWeek,
        month: isThisMonth,
        '3months': isNext3Months,
        year: isThisYear
      }[state.date];
      if (check) list = list.filter((e) => check(e.startDate));
    }

    if (state.query) {
      const q = state.query.toLowerCase();
      list = list.filter((e) =>
        e.title.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q) ||
        e.desc.toLowerCase().includes(q)
      );
    }

    /* Sort */
    if (state.sort === 'date') {
      list.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    } else if (state.sort === 'popular') {
      list.sort((a, b) => b.popularity - a.popularity);
    } else if (state.sort === 'price') {
      list.sort((a, b) => {
        const pa = a.isFree ? 0 : parseInt(a.price.replace(/[^\d]/g, '')) || 0;
        const pb = b.isFree ? 0 : parseInt(b.price.replace(/[^\d]/g, '')) || 0;
        return pa - pb;
      });
    }

    /* If user location set, sort by distance */
    if (state.userLocation) {
      list.forEach((e) => {
        e._distance = haversine(state.userLocation.lat, state.userLocation.lng, e.lat, e.lng);
      });
      list.sort((a, b) => a._distance - b._distance);
    }

    state.filtered = list;
    return list;
  }

  function renderCard(e) {
    const catIcons = {
      anime: 'fa-dragon',
      gaming: 'fa-gamepad',
      kpop: 'fa-music',
      cosplay: 'fa-user-ninja',
      comics: 'fa-book-open',
      movies: 'fa-film'
    };
    const icon = catIcons[e.category] || 'fa-star';
    const dist = e._distance
      ? `<span><i class="fas fa-route"></i> ${e._distance.toFixed(1)} km away</span>`
      : '';

    return `
      <article class="fh-ev-card" data-id="${e.id}" tabindex="0" role="button">
        <div class="fh-ev-card__media">
          <img src="${esc(e.img)}" alt="${esc(e.title)}" loading="lazy" />
          <span class="fh-ev-card__cat fh-ev-card__cat--${e.category}">
            <i class="fas ${icon}"></i> ${esc(e.categoryLabel)}
          </span>
          <div class="fh-ev-card__date-badge">
            <span class="fh-ev-card__date-month">${getMonthShort(e.startDate)}</span>
            <span class="fh-ev-card__date-day">${getDayNum(e.startDate)}</span>
          </div>
        </div>
        <div class="fh-ev-card__body">
          <h3 class="fh-ev-card__title">${esc(e.title)}</h3>
          <div class="fh-ev-card__meta">
            <span><i class="fas fa-calendar"></i> ${formatDateRange(e.startDate, e.endDate)}</span>
            <span><i class="fas fa-map-marker-alt"></i> ${esc(e.venue)}, ${esc(e.city)}</span>
            <span><i class="fas fa-users"></i> ${e.attendees.toLocaleString()} attending</span>
            ${dist}
          </div>
          <div class="fh-ev-card__foot">
            <span class="fh-ev-card__price ${e.isFree ? 'fh-ev-card__price--free' : ''}">
              <i class="fas fa-${e.isFree ? 'gift' : 'tag'}"></i> ${esc(e.price)}
            </span>
            <a href="event-single.html?id=${e.id}" class="fh-ev-card__ticket" data-ticket="${e.id}">
              <i class="fas fa-ticket"></i> Get Tickets
            </a>
          </div>
        </div>
      </article>
    `;
  }

  function renderGrid(list) {
    const gridEl = $('#fhEvGrid');
    if (!gridEl) return;

    if (!list.length) {
      gridEl.innerHTML = '';
      return;
    }

    gridEl.innerHTML = list.map(renderCard).join('');

    $$('.fh-ev-card', gridEl).forEach((card, i) => {
      setTimeout(() => card.classList.add('is-visible'), i * 40);
    });

    $$('.fh-ev-card', gridEl).forEach((card) => {
      card.addEventListener('click', (ev) => {
        if (ev.target.closest('.fh-ev-card__ticket')) return;
        window.location.href = `event-single.html?id=${card.dataset.id}`;
      });
      card.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          window.location.href = `event-single.html?id=${card.dataset.id}`;
        }
      });
    });

    $$('.fh-ev-card__ticket', gridEl).forEach((btn) => {
      btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        window.location.href = `event-single.html?id=${btn.dataset.ticket}`;
      });
    });
  }

  const MONTHS = ['January','February','March','April','May','June',
    'July','August','September','October','November','December'];

  function renderCalendar() {
    const titleEl = $('#fhEvCalTitle');
    const gridEl = $('#fhEvCalGrid');
    if (!titleEl || !gridEl) return;

    const year = state.calYear;
    const month = state.calMonth;
    titleEl.textContent = `${MONTHS[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

    let html = '';

    /* Empty leading cells */
    for (let i = 0; i < firstDay; i++) {
      html += '<div class="fh-ev-cal__cell is-empty"></div>';
    }

    /* Days */
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvents = state.filtered.filter((e) => e.startDate.slice(0, 10) === dateStr);
      const isToday = isCurrentMonth && today.getDate() === d;

      const eventsHtml = dayEvents.slice(0, 3).map((e) =>
        `<span class="fh-ev-cal__event fh-ev-cal__event--${e.category}" title="${esc(e.title)}">${esc(e.title)}</span>`
      ).join('');

      html += `
        <div class="fh-ev-cal__cell${dayEvents.length ? ' has-events' : ''}${isToday ? ' is-today' : ''}"
             data-date="${dateStr}"
             ${dayEvents.length ? `data-events="${dayEvents.map(e => e.id).join(',')}"` : ''}>
          <div class="fh-ev-cal__day">${d}</div>
          <div class="fh-ev-cal__events">${eventsHtml}</div>
        </div>
      `;
    }

    gridEl.innerHTML = html;

    $$('.fh-ev-cal__cell.has-events', gridEl).forEach((cell) => {
      cell.addEventListener('click', () => {
        const ids = (cell.dataset.events || '').split(',').map(Number);
        if (ids.length === 1) {
          window.location.href = `event-single.html?id=${ids[0]}`;
        } else if (ids.length) {
          /* Switch to grid view with date filter */
          const date = cell.dataset.date;
          switchView('grid');
          const dateInput = $('#fhEvDate');
          if (dateInput) {
            dateInput.value = 'all';
            state.date = 'all';
          }
          /* Show only events for this date */
          renderGrid(state.filtered.filter(e => e.startDate.slice(0, 10) === date));
          updateResultCount(state.filtered.filter(e => e.startDate.slice(0, 10) === date).length);
        }
      });
    });
  }

  function initMap() {
    if (state.mapInited) return;
    const el = $('#fhEvLeaflet');
    if (!el || typeof L === 'undefined') return;

    state.map = L.map(el, {
      center: [30.3753, 69.3451], // Pakistan center
      zoom: 6,
      zoomControl: true,
      scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(state.map);

    state.mapInited = true;
    renderMapMarkers();
  }

  function renderMapMarkers() {
    if (!state.map) return;

    /* Clear old markers */
    state.markers.forEach((m) => state.map.removeLayer(m));
    state.markers = [];

    state.filtered.forEach((e) => {
      const catIcons = {
        anime: 'fa-dragon',
        gaming: 'fa-gamepad',
        kpop: 'fa-music',
        cosplay: 'fa-user-ninja',
        comics: 'fa-book-open',
        movies: 'fa-film'
      };
      const icon = catIcons[e.category] || 'fa-star';

      const markerIcon = L.divIcon({
        className: 'fh-ev-marker-wrap',
        html: `<div class="fh-ev-marker fh-ev-marker--${e.category}"><i class="fas ${icon}"></i></div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -34]
      });

      const marker = L.marker([e.lat, e.lng], { icon: markerIcon }).addTo(state.map);

      marker.bindPopup(`
        <div style="font-family: Outfit, sans-serif; min-width: 200px;">
          <strong style="font-size: 0.95rem; color: #1a1f36; display: block; margin-bottom: 4px;">${esc(e.title)}</strong>
          <span style="font-size: 0.78rem; color: #6b7290; display: block; margin-bottom: 8px;">
            ${formatDate(e.startDate)} · ${esc(e.city)}
          </span>
          <a href="event-single.html?id=${e.id}"
             style="display: inline-block; padding: 6px 14px; background: linear-gradient(135deg,#6366f1,#ec4899); color: #fff; border-radius: 99px; font-size: 0.78rem; font-weight: 700; text-decoration: none;">
            View Details
          </a>
        </div>
      `);

      marker.on('click', () => {
        showMapSideCard(e);
      });

      state.markers.push(marker);
    });

    if (state.filtered.length && state.map) {
      const group = L.featureGroup(state.markers);
      state.map.fitBounds(group.getBounds().pad(0.15));
    }
  }

  function showMapSideCard(e) {
    const side = $('#fhEvMapSide');
    if (!side) return;

    const catIcons = {
      anime: 'fa-dragon',
      gaming: 'fa-gamepad',
      kpop: 'fa-music',
      cosplay: 'fa-user-ninja',
      comics: 'fa-book-open',
      movies: 'fa-film'
    };
    const icon = catIcons[e.category] || 'fa-star';

    side.innerHTML = `
      <div class="fh-ev-map-side-card">
        <img class="fh-ev-map-side-card__img" src="${esc(e.img)}" alt="${esc(e.title)}" />
        <span class="fh-ev-map-side-card__cat" style="background: linear-gradient(135deg, rgba(139,92,246,0.9), rgba(236,72,153,0.9));">
          <i class="fas ${icon}"></i> ${esc(e.categoryLabel)}
        </span>
        <h3 class="fh-ev-map-side-card__title">${esc(e.title)}</h3>
        <div class="fh-ev-map-side-card__meta">
          <span><i class="fas fa-calendar"></i> ${formatDateRange(e.startDate, e.endDate)}</span>
          <span><i class="fas fa-map-marker-alt"></i> ${esc(e.venue)}</span>
          <span><i class="fas fa-city"></i> ${esc(e.city)}</span>
          <span><i class="fas fa-users"></i> ${e.attendees.toLocaleString()} attending</span>
          <span><i class="fas fa-tag"></i> ${esc(e.price)}</span>
        </div>
        <div class="fh-ev-map-side-card__actions">
          <a href="event-single.html?id=${e.id}" class="fh-ev-map-side-card__btn">
            <i class="fas fa-ticket"></i> Tickets
          </a>
          <button class="fh-ev-map-side-card__btn fh-ev-map-side-card__btn--ghost" id="fhEvMapClose" type="button">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    `;

    const closeBtn = $('#fhEvMapClose');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        side.innerHTML = `
          <div class="fh-ev-map__side-empty">
            <i class="fas fa-hand-pointer"></i>
            <p>Click a pin to view event</p>
          </div>
        `;
      });
    }
  }

  function switchView(view) {
    state.view = view;

    $$('.fh-ev__view-btn').forEach((b) => {
      b.classList.toggle('is-active', b.dataset.view === view);
    });

    const gridEl = $('#fhEvGrid');
    const calEl = $('#fhEvCalendar');
    const mapEl = $('#fhEvMap');

    gridEl.style.display = view === 'grid' ? 'grid' : 'none';
    calEl.style.display = view === 'calendar' ? 'block' : 'none';
    mapEl.style.display = view === 'map' ? 'block' : 'none';

    if (view === 'calendar') renderCalendar();
    if (view === 'map') {
      initMap();
      renderMapMarkers();
      if (state.map) {
        setTimeout(() => state.map.invalidateSize(), 100);
      }
    }
  }


  function updateResultCount(n) {
    const el = $('#fhEvResultCount');
    if (el) el.textContent = `${n} event${n === 1 ? '' : 's'} found`;
  }

  function updateActiveChips() {
    const wrap = $('#fhEvActiveChips');
    if (!wrap) return;

    const chips = [];
    if (state.city !== 'all') chips.push({ label: state.city, key: 'city' });
    if (state.category !== 'all') chips.push({ label: state.category, key: 'category' });
    if (state.date !== 'all') {
      const labels = { week: 'This Week', month: 'This Month', '3months': 'Next 3 Months', year: 'This Year' };
      chips.push({ label: labels[state.date], key: 'date' });
    }
    if (state.query) chips.push({ label: `"${state.query}"`, key: 'query' });

    if (!chips.length) {
      wrap.innerHTML = '';
      return;
    }

    wrap.innerHTML = chips.map((c) =>
      `<span class="fh-ev__active-chip">
        ${esc(c.label)}
        <button data-clear="${c.key}" aria-label="Remove filter" type="button">
          <i class="fas fa-times"></i>
        </button>
      </span>`
    ).join('');

    $$('[data-clear]', wrap).forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.clear;
        if (key === 'city') { state.city = 'all'; $('#fhEvCity').value = 'all'; }
        else if (key === 'category') { state.category = 'all'; $('#fhEvCategory').value = 'all'; }
        else if (key === 'date') { state.date = 'all'; $('#fhEvDate').value = 'all'; }
        else if (key === 'query') { state.query = ''; $('#fhEvSearch').value = ''; }
        refresh();
      });
    });
  }

  function refresh() {
    const list = applyFilters();

    updateResultCount(list.length);
    updateActiveChips();

    const emptyEl = $('#fhEvEmpty');
    const gridEl = $('#fhEvGrid');
    const calEl = $('#fhEvCalendar');
    const mapEl = $('#fhEvMap');

    if (!list.length) {
      gridEl.style.display = 'none';
      calEl.style.display = 'none';
      mapEl.style.display = 'none';
      emptyEl.style.display = 'flex';
      return;
    }

    emptyEl.style.display = 'none';

    if (state.view === 'grid') {
      gridEl.style.display = 'grid';
      renderGrid(list);
    } else if (state.view === 'calendar') {
      calEl.style.display = 'block';
      renderCalendar();
    } else if (state.view === 'map') {
      mapEl.style.display = 'block';
      initMap();
      renderMapMarkers();
    }
  }

  
  function initCountdown() {
    const target = new Date('2026-12-15T10:00:00').getTime();

    function tick() {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        const cd = $('#fhEvCountdown');
        if (cd) cd.innerHTML = '<div class="fh-ev-hero__cd-title">Event Has Started!</div>';
        return;
      }

      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      const dEl = $('[data-cd="days"]');
      const hEl = $('[data-cd="hours"]');
      const mEl = $('[data-cd="minutes"]');
      const sEl = $('[data-cd="seconds"]');

      if (dEl) dEl.textContent = String(days).padStart(2, '0');
      if (hEl) hEl.textContent = String(hours).padStart(2, '0');
      if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
      if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
    }

    tick();
    setInterval(tick, 1000);
  }

 
  function initLocate() {
    const btn = $('#fhEvLocate');
    if (!btn) return;

    btn.addEventListener('click', () => {
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser.');
        return;
      }

      btn.classList.add('is-active');
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Locating...';

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          state.userLocation = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          btn.innerHTML = '<i class="fas fa-location-crosshairs"></i> Location Active';
          refresh();
        },
        (err) => {
          btn.classList.remove('is-active');
          btn.innerHTML = '<i class="fas fa-location-crosshairs"></i> Use My Location';
          alert('Could not get your location. Please allow location access.');
        },
        { timeout: 10000 }
      );
    });
  }


  function initFilters() {
    const citySel = $('#fhEvCity');
    const catSel = $('#fhEvCategory');
    const dateSel = $('#fhEvDate');
    const searchInput = $('#fhEvSearch');
    const sortSel = $('#fhEvSort');
    const resetBtn = $('#fhEvReset');
    const emptyReset = $('#fhEvEmptyReset');

    citySel && citySel.addEventListener('change', (e) => {
      state.city = e.target.value;
      refresh();
    });

    catSel && catSel.addEventListener('change', (e) => {
      state.category = e.target.value;
      refresh();
    });

    dateSel && dateSel.addEventListener('change', (e) => {
      state.date = e.target.value;
      refresh();
    });

    if (searchInput) {
      let t = 0;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(t);
        const v = e.target.value;
        t = setTimeout(() => {
          state.query = v.trim();
          refresh();
        }, 200);
      });
    }

    sortSel && sortSel.addEventListener('change', (e) => {
      state.sort = e.target.value;
      refresh();
    });

    const doReset = () => {
      state.city = 'all';
      state.category = 'all';
      state.date = 'all';
      state.query = '';
      state.sort = 'date';
      state.userLocation = null;
      if (citySel) citySel.value = 'all';
      if (catSel) catSel.value = 'all';
      if (dateSel) dateSel.value = 'all';
      if (searchInput) searchInput.value = '';
      if (sortSel) sortSel.value = 'date';
      const locateBtn = $('#fhEvLocate');
      if (locateBtn) {
        locateBtn.classList.remove('is-active');
        locateBtn.innerHTML = '<i class="fas fa-location-crosshairs"></i> Use My Location';
      }
      refresh();
    };

    resetBtn && resetBtn.addEventListener('click', doReset);
    emptyReset && emptyReset.addEventListener('click', doReset);
  }

  function initViewToggle() {
    $$('.fh-ev__view-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        switchView(btn.dataset.view);
      });
    });
  }

  function initCalendarNav() {
    const prev = $('#fhEvCalPrev');
    const next = $('#fhEvCalNext');

    prev && prev.addEventListener('click', () => {
      state.calMonth--;
      if (state.calMonth < 0) { state.calMonth = 11; state.calYear--; }
      renderCalendar();
    });

    next && next.addEventListener('click', () => {
      state.calMonth++;
      if (state.calMonth > 11) { state.calMonth = 0; state.calYear++; }
      renderCalendar();
    });
  }

  async function init() {
    try {
      if (window.FHApi) {
        const res = await window.FHApi.get('/frontend/events');
        if (res && Array.isArray(res.events) && res.events.length) {
          EVENTS = res.events.map(function(e){ return Object.assign({categoryLabel:e.category || '', desc:e.description || '', price:'', isFree:true, attendees:0, popularity:0, img:''}, e); });
          state.all = EVENTS.slice();
          state.filtered = EVENTS.slice();
        }
      }
    } catch (e) {}
    initCountdown();
    initFilters();
    initViewToggle();
    initCalendarNav();
    initLocate();
    refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();