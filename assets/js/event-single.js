(() => {
  'use strict';

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));

  const EVENTS = [
    { id: 1, title: 'Karachi Comic-Con 2026', category: 'anime', categoryLabel: 'Anime Convention',
      city: 'Karachi', venue: 'Expo Centre, Hall 4', address: 'University Rd, Gulshan-e-Iqbal, Karachi',
      lat: 24.9209, lng: 67.0978, startDate: '2026-12-15T10:00:00', endDate: '2026-12-17T22:00:00',
      price: 'PKR 3,500', isFree: false, attendees: 45000,
      img: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?q=80&w=1600',
      desc: 'Pakistan\'s biggest fandom gathering — 3 days of anime, cosplay, gaming, panels, and meet-and-greets with special guests from around the world.',
      highlights: [
        'Special guests from Japan & Korea',
        'Cosplay championship with PKR 500,000 prize pool',
        'Gaming zone — Dota 2, CS2, PUBG tournaments',
        'Artist alley with 150+ illustrators',
        'Exclusive merch & limited edition drops'
      ]
    },
    { id: 2, title: 'Lahore Gaming Fest 2026', category: 'gaming', categoryLabel: 'Gaming Expo',
      city: 'Lahore', venue: 'Expo Centre Lahore', address: 'Johar Town, Lahore',
      lat: 31.4722, lng: 74.2871, startDate: '2026-10-22T10:00:00', endDate: '2026-10-24T20:00:00',
      price: 'PKR 2,500', isFree: false, attendees: 28000,
      img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600',
      desc: '3-day gaming expo featuring esports tournaments, new game reveals, and streamer meetups.',
      highlights: ['Esports finals with PKR 1M prize', 'New game demos from major studios', 'Streamer meet & greets']
    },
    { id: 3, title: 'BTS ARMY Meetup — Islamabad', category: 'kpop', categoryLabel: 'K-Pop Meetup',
      city: 'Islamabad', venue: 'Centaurus Mall', address: 'F-8 Markaz, Islamabad',
      lat: 33.7076, lng: 73.0484, startDate: '2026-11-05T17:00:00', endDate: '2026-11-05T22:00:00',
      price: 'Free', isFree: true, attendees: 800,
      img: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=1600',
      desc: 'Casual meetup for BTS ARMYs — music, dance covers, and community bonding.',
      highlights: ['Dance cover performances', 'Fan merch trading', 'Group photo session']
    },
    { id: 4, title: 'Cosplay Championship Lahore', category: 'cosplay', categoryLabel: 'Cosplay Contest',
      city: 'Lahore', venue: 'Alhamra Arts Council', address: 'Mall Rd, Lahore',
      lat: 31.5572, lng: 74.3287, startDate: '2026-11-20T14:00:00', endDate: '2026-11-20T23:00:00',
      price: 'PKR 1,500', isFree: false, attendees: 5000,
      img: 'https://images.unsplash.com/photo-1542557753-745b88b3bf9b?q=80&w=1600',
      desc: 'Pakistan\'s premier cosplay championship with celebrity judges and cash prizes.',
      highlights: ['Celebrity judges from Japan', 'PKR 200,000 grand prize', 'Photoshoot booths']
    },
    { id: 5, title: 'Comics & Manga Expo 2026', category: 'comics', categoryLabel: 'Comics Expo',
      city: 'Karachi', venue: 'Arts Council Karachi', address: 'M.R. Kiyani Rd, Karachi',
      lat: 24.8505, lng: 67.0264, startDate: '2026-10-08T11:00:00', endDate: '2026-10-10T21:00:00',
      price: 'PKR 2,000', isFree: false, attendees: 15000,
      img: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=1600',
      desc: 'The finest comic publishers, manga imports, artist alleys, and exclusive drops.',
      highlights: ['International publisher booths', 'Manga imports from Japan', 'Artist alley with 100+ creators']
    },
    { id: 6, title: 'Marvel Movie Marathon Night', category: 'movies', categoryLabel: 'Movie Screening',
      city: 'Islamabad', venue: 'Cinepax Cinema', address: 'Safa Gold Mall, F-7, Islamabad',
      lat: 33.7194, lng: 73.0582, startDate: '2026-10-18T18:00:00', endDate: '2026-10-19T04:00:00',
      price: 'PKR 1,200', isFree: false, attendees: 500,
      img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1600',
      desc: 'Back-to-back screening of the entire MCU Infinity Saga in one epic night.',
      highlights: ['All 4 Avengers films', 'Free popcorn & drinks', 'Cosplay welcome']
    },
    { id: 7, title: 'Anime Fest Rawalpindi', category: 'anime', categoryLabel: 'Anime Meetup',
      city: 'Rawalpindi', venue: 'Ayub National Park', address: 'Jhelum Rd, Rawalpindi',
      lat: 33.5921, lng: 73.0669, startDate: '2026-11-12T12:00:00', endDate: '2026-11-12T20:00:00',
      price: 'PKR 800', isFree: false, attendees: 3000,
      img: 'https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1600',
      desc: 'Outdoor anime festival featuring stalls, cosplay, food, and live performances.',
      highlights: ['Outdoor venue', 'Food stalls', 'Live performances']
    },
    { id: 8, title: 'Esports Pakistan Finals', category: 'gaming', categoryLabel: 'Esports Finals',
      city: 'Karachi', venue: 'KDA Auditorium', address: 'Gulshan-e-Iqbal, Karachi',
      lat: 24.9165, lng: 67.0975, startDate: '2026-12-02T16:00:00', endDate: '2026-12-04T23:00:00',
      price: 'PKR 1,800', isFree: false, attendees: 12000,
      img: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1600',
      desc: 'National finals of the biggest esports tournament in Pakistan.',
      highlights: ['Dota 2, CS2, PUBG finals', 'PKR 2M prize pool', 'Streamer meetups']
    },
    { id: 9, title: 'Cosplay Photoshoot Meetup', category: 'cosplay', categoryLabel: 'Cosplay Meetup',
      city: 'Islamabad', venue: 'Lake View Park', address: 'Murree Rd, Islamabad',
      lat: 33.7446, lng: 73.0894, startDate: '2026-10-05T15:00:00', endDate: '2026-10-05T19:00:00',
      price: 'Free', isFree: true, attendees: 150,
      img: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?q=80&w=1600',
      desc: 'Casual photoshoot for cosplayers of all skill levels.',
      highlights: ['Outdoor photoshoot', 'All skill levels welcome']
    },
    { id: 10, title: 'Naruto Marathon Screening', category: 'anime', categoryLabel: 'Anime Screening',
      city: 'Lahore', venue: 'CUE Cinema', address: 'Gulberg III, Lahore',
      lat: 31.5153, lng: 74.3428, startDate: '2026-10-15T14:00:00', endDate: '2026-10-15T23:00:00',
      price: 'PKR 900', isFree: false, attendees: 300,
      img: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1600',
      desc: 'Relive the iconic Naruto moments on the big screen.',
      highlights: ['Best episodes screening', 'Trivia & prizes']
    },
    { id: 11, title: 'Comic Artist Workshop', category: 'comics', categoryLabel: 'Workshop',
      city: 'Faisalabad', venue: 'Lyallpur Art Gallery', address: 'Jaranwala Rd, Faisalabad',
      lat: 31.4180, lng: 73.0790, startDate: '2026-11-08T14:00:00', endDate: '2026-11-08T18:00:00',
      price: 'PKR 1,000', isFree: false, attendees: 200,
      img: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?q=80&w=1600',
      desc: 'Learn comic book illustration from leading Pakistani artists.',
      highlights: ['Hands-on workshop', 'Take home your artwork']
    },
    { id: 12, title: 'Blackpink Concert Watch Party', category: 'kpop', categoryLabel: 'Watch Party',
      city: 'Peshawar', venue: 'Islamic College Auditorium', address: 'University Rd, Peshawar',
      lat: 34.0086, lng: 71.5639, startDate: '2026-10-30T19:00:00', endDate: '2026-10-30T22:00:00',
      price: 'PKR 500', isFree: false, attendees: 400,
      img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1600',
      desc: 'Join fellow BLINKs to watch the Born Pink concert on the big screen.',
      highlights: ['Big screen screening', 'Light sticks provided', 'Photo booth']
    }
  ];

  const CAT_ICONS = {
    anime: 'fa-dragon',
    gaming: 'fa-gamepad',
    kpop: 'fa-music',
    cosplay: 'fa-user-ninja',
    comics: 'fa-book-open',
    movies: 'fa-film'
  };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function formatDateRange(s, e) {
    const sd = new Date(s);
    const ed = new Date(e);
    if (sd.toDateString() === ed.toDateString()) {
      return sd.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }
    return `${sd.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} – ${ed.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  }

  function getEventId() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'), 10) || 1;
  }

  function findEvent(id) {
    return EVENTS.find((e) => e.id === id) || EVENTS[0];
  }

  function render(event) {
    /* Breadcrumb */
    const bc = $('#fhEsBreadcrumb');
    if (bc) bc.textContent = event.title;

    /* Hero */
    const bg = $('#fhEsHeroBg');
    if (bg) bg.style.backgroundImage = `url(${event.img})`;

    const cat = $('#fhEsHeroCat');
    if (cat) {
      cat.innerHTML = `<i class="fas ${CAT_ICONS[event.category] || 'fa-star'}"></i> <span>${esc(event.categoryLabel)}</span>`;
      cat.style.background = 'rgba(139,92,246,0.85)';
      cat.style.borderColor = 'rgba(168,85,247,0.95)';
    }

    const title = $('#fhEsHeroTitle');
    if (title) title.textContent = event.title;

    const meta = $('#fhEsHeroMeta');
    if (meta) {
      meta.innerHTML = `
        <span><i class="fas fa-calendar"></i> ${formatDateRange(event.startDate, event.endDate)}</span>
        <span><i class="fas fa-map-marker-alt"></i> ${esc(event.venue)}, ${esc(event.city)}</span>
        <span><i class="fas fa-users"></i> ${event.attendees.toLocaleString()} attending</span>
      `;
    }

    /* Description */
    const desc = $('#fhEsDesc');
    if (desc) desc.textContent = event.desc;

    /* Highlights */
    const ul = $('#fhEsHighlights');
    if (ul) {
      ul.innerHTML = event.highlights.map((h) => `<li>${esc(h)}</li>`).join('');
    }

    /* Venue */
    const vn = $('#fhEsVenueName');
    if (vn) vn.textContent = event.venue;
    const va = $('#fhEsVenueAddr');
    if (va) va.textContent = event.address;

    const dir = $('#fhEsDirections');
    if (dir) {
      dir.href = `https://www.google.com/maps/dir/?api=1&destination=${event.lat},${event.lng}`;
    }

    /* Price */
    const priceEl = $('#fhEsPrice');
    if (priceEl) priceEl.textContent = event.price;

    /* Quick info */
    const qi = $('#fhEsQuickInfo');
    if (qi) {
      qi.innerHTML = `
        <li><i class="fas fa-calendar"></i><div><strong>Date</strong>${formatDateRange(event.startDate, event.endDate)}</div></li>
        <li><i class="fas fa-map-marker-alt"></i><div><strong>Location</strong>${esc(event.city)}</div></li>
        <li><i class="fas fa-clock"></i><div><strong>Starts at</strong>${new Date(event.startDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</div></li>
        <li><i class="fas fa-users"></i><div><strong>Attendees</strong>${event.attendees.toLocaleString()}</div></li>
      `;
    }

    /* Related */
    const related = EVENTS.filter((e) => e.id !== event.id && e.category === event.category).slice(0, 3);
    const relEl = $('#fhEsRelated');
    if (relEl) {
      if (!related.length) {
        relEl.innerHTML = '<p style="font-size:0.85rem;color:var(--fh-text-muted);margin:0;">No related events</p>';
      } else {
        relEl.innerHTML = related.map((r) => `
          <a href="event-single.html?id=${r.id}" class="fh-es-related-item">
            <img src="${esc(r.img)}" alt="${esc(r.title)}" loading="lazy" />
            <div class="fh-es-related-item-body">
              <div class="fh-es-related-item-title">${esc(r.title)}</div>
              <div class="fh-es-related-item-meta">${new Date(r.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · ${esc(r.city)}</div>
            </div>
          </a>
        `).join('');
      }
    }

    /* Map */
    initMap(event);

    /* Ticket button */
    const tb = $('#fhEsTicketBtn');
    if (tb) {
      tb.addEventListener('click', () => {
        /* In real app: redirect to ticket provider */
        alert(`Ticket link for "${event.title}" would open here.\n\n(Connect to your ticket vendor URL in production)`);
      });
    }

    /* Share */
    const sb = $('#fhEsShareBtn');
    if (sb) {
      sb.addEventListener('click', async () => {
        const data = {
          title: event.title,
          text: `Check out ${event.title} on Fan Hub Plus!`,
          url: window.location.href
        };
        try {
          if (navigator.share) await navigator.share(data);
          else if (navigator.clipboard) {
            await navigator.clipboard.writeText(window.location.href);
            const old = sb.innerHTML;
            sb.innerHTML = '<i class="fas fa-check"></i> Link Copied!';
            setTimeout(() => { sb.innerHTML = old; }, 1800);
          }
        } catch (e) {}
      });
    }

    document.title = `${event.title} | Fan Hub Plus`;
  }

  function initMap(event) {
    const el = $('#fhEsMap');
    if (!el || typeof L === 'undefined') return;

    const map = L.map(el, {
      center: [event.lat, event.lng],
      zoom: 13,
      scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    const icon = L.divIcon({
      className: 'fh-es-marker-wrap',
      html: `<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#ec4899);display:grid;place-items:center;color:#fff;font-size:1rem;border:2px solid #fff;box-shadow:0 6px 16px -4px rgba(0,0,0,0.6);"><i class="fas fa-map-marker-alt"></i></div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 36]
    });

    L.marker([event.lat, event.lng], { icon }).addTo(map)
      .bindPopup(`<strong>${esc(event.title)}</strong><br><small>${esc(event.venue)}</small>`)
      .openPopup();

    setTimeout(() => map.invalidateSize(), 100);
  }

  function init() {
    const id = getEventId();
    const event = findEvent(id);
    render(event);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();