(() => {
  'use strict';

  const gridEl = document.getElementById('fhCharsGrid');
  const emptyEl = document.getElementById('fhCharsEmpty');
  const searchInput = document.getElementById('charsSearch');
  const categorySelect = document.getElementById('charsCategory');
  const roleSelect = document.getElementById('charsRole');
  const sortWrap = document.getElementById('charsSort');
  const drawer = document.getElementById('characterDrawer');
  const drawerBody = document.getElementById('fhDrawerBody');
  const sideCount = document.getElementById('fhSideCount');

  const state = {
    sort: 'popular',
    category: 'all',
    role: 'all',
    query: ''
  };

  let CHARACTERS = [
    // ANIME
    { id: 1, name: "Naruto Uzumaki", category: "anime", fandom: "Naruto", role: "protagonist", views: 52000, rating: "9.2",
      img: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600",
      backdrop: "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1600",
      bio: "A young ninja from the Hidden Leaf Village who dreams of becoming Hokage and earning the respect of everyone.",
      abilities: ["Shadow Clone", "Rasengan", "Sage Mode", "Nine-Tails Chakra"],
      affiliations: "Team 7 · Hidden Leaf Village",
      firstAppearance: "Naruto Chapter 1 (1999)" },
    { id: 2, name: "Eren Yeager", category: "anime", fandom: "Attack on Titan", role: "protagonist", views: 48000, rating: "9.0",
      img: "https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=600",
      backdrop: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=1600",
      bio: "A young soldier who vows to exterminate all Titans after his hometown is destroyed.",
      abilities: ["Titan Shifting", "Attack Titan", "Founding Titan"],
      affiliations: "Survey Corps · Eldia",
      firstAppearance: "Attack on Titan Chapter 1 (2009)" },
    { id: 3, name: "Levi Ackerman", category: "anime", fandom: "Attack on Titan", role: "supporting", views: 45000, rating: "9.4",
      img: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=600",
      backdrop: "https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=1600",
      bio: "Humanity's strongest soldier, known for his exceptional combat skills and cold demeanor.",
      abilities: ["ODM Gear Mastery", "Ackerman Awakening"],
      affiliations: "Survey Corps · Special Operations Squad",
      firstAppearance: "Attack on Titan Chapter 3 (2009)" },
    { id: 4, name: "Tanjiro Kamado", category: "anime", fandom: "Demon Slayer", role: "protagonist", views: 42000, rating: "8.9",
      img: "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=600",
      backdrop: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1600",
      bio: "A kind-hearted demon slayer searching for a cure for his sister Nezuko.",
      abilities: ["Water Breathing", "Sun Breathing", "Demon Slayer Mark"],
      affiliations: "Demon Slayer Corps",
      firstAppearance: "Demon Slayer Chapter 1 (2016)" },
    { id: 5, name: "Monkey D. Luffy", category: "anime", fandom: "One Piece", role: "protagonist", views: 50000, rating: "9.3",
      img: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=600",
      backdrop: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1600",
      bio: "A rubber-bodied pirate captain searching for the legendary One Piece treasure.",
      abilities: ["Gum-Gum Fruit", "Haki", "Gear Fifth"],
      affiliations: "Straw Hat Pirates",
      firstAppearance: "One Piece Chapter 1 (1997)" },
    { id: 6, name: "Gojo Satoru", category: "anime", fandom: "Jujutsu Kaisen", role: "supporting", views: 44000, rating: "9.5",
      img: "https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=600",
      backdrop: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=1600",
      bio: "The strongest jujutsu sorcerer, wielding both Limitless and Six Eyes.",
      abilities: ["Limitless", "Six Eyes", "Domain Expansion: Infinite Void"],
      affiliations: "Tokyo Jujutsu High",
      firstAppearance: "Jujutsu Kaisen Chapter 0 (2017)" },
    { id: 7, name: "Light Yagami", category: "anime", fandom: "Death Note", role: "protagonist", views: 40000, rating: "9.1",
      img: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=600",
      backdrop: "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1600",
      bio: "A genius student who finds a notebook that kills anyone whose name is written in it.",
      abilities: ["Genius Intellect", "Death Note", "Master Manipulation"],
      affiliations: "Kira",
      firstAppearance: "Death Note Chapter 1 (2003)" },
    { id: 8, name: "Vegeta", category: "anime", fandom: "Dragon Ball", role: "supporting", views: 38000, rating: "8.8",
      img: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600",
      backdrop: "https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=1600",
      bio: "The Prince of all Saiyans, who starts as an enemy but becomes Goku's rival and ally.",
      abilities: ["Super Saiyan Blue", "Final Flash", "Ultra Ego"],
      affiliations: "Z-Fighters",
      firstAppearance: "Dragon Ball Chapter 204 (1988)" },

    // GAMING
    { id: 9, name: "Geralt of Rivia", category: "gaming", fandom: "The Witcher", role: "protagonist", views: 47000, rating: "9.6",
      img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600",
      backdrop: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=1600",
      bio: "A monster hunter for hire, one of the last witchers, seeking his adopted daughter Ciri.",
      abilities: ["Signs", "Swordsmanship", "Alchemy", "Witcher Senses"],
      affiliations: "School of the Wolf",
      firstAppearance: "The Witcher (2007)" },
    { id: 10, name: "Kratos", category: "gaming", fandom: "God of War", role: "protagonist", views: 45000, rating: "9.5",
      img: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=600",
      backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600",
      bio: "The Ghost of Sparta, a former Greek god of war who now lives in Norse lands with his son Atreus.",
      abilities: ["Blades of Chaos", "Leviathan Axe", "Spartan Rage"],
      affiliations: "Sparta · Nine Realms",
      firstAppearance: "God of War (2005)" },
    { id: 11, name: "Arthur Morgan", category: "gaming", fandom: "Red Dead Redemption 2", role: "protagonist", views: 44000, rating: "9.7",
      img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600",
      backdrop: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=1600",
      bio: "A senior member of the Van der Linde gang, struggling between loyalty and morality.",
      abilities: ["Dead Eye", "Gunslinging", "Horsemanship"],
      affiliations: "Van der Linde Gang",
      firstAppearance: "Red Dead Redemption 2 (2018)" },
    { id: 12, name: "Master Chief", category: "gaming", fandom: "Halo", role: "protagonist", views: 40000, rating: "9.0",
      img: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=600",
      backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600",
      bio: "Spartan-117, humanity's greatest soldier, defender of Earth against the Covenant.",
      abilities: ["Marksmanship", "Spartan Augmentations", "MJOLNIR Armor"],
      affiliations: "UNSC · Spartan-II",
      firstAppearance: "Halo: Combat Evolved (2001)" },
    { id: 13, name: "Aloy", category: "gaming", fandom: "Horizon Zero Dawn", role: "protagonist", views: 38000, rating: "8.9",
      img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600",
      backdrop: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=1600",
      bio: "A skilled hunter in a post-apocalyptic world where machines rule the earth.",
      abilities: ["Archery", "Machine Override", "Focus Device"],
      affiliations: "Nora Tribe",
      firstAppearance: "Horizon Zero Dawn (2017)" },

    // MOVIES
    { id: 14, name: "Tony Stark / Iron Man", category: "movies", fandom: "Marvel", role: "protagonist", views: 50000, rating: "9.3",
      img: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=600",
      backdrop: "https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=1600",
      bio: "Genius billionaire playboy philanthropist who becomes the armored hero Iron Man.",
      abilities: ["Powered Armor", "Genius Intellect", "Nanotech"],
      affiliations: "Avengers · Stark Industries",
      firstAppearance: "Iron Man (2008)" },
    { id: 15, name: "Batman / Bruce Wayne", category: "movies", fandom: "DC", role: "protagonist", views: 48000, rating: "9.2",
      img: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=600",
      backdrop: "https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=1600",
      bio: "The Dark Knight of Gotham City, using fear as a weapon against crime.",
      abilities: ["Martial Arts", "Detective Skills", "Gadgets"],
      affiliations: "Justice League · Bat-Family",
      firstAppearance: "Detective Comics #27 (1939)" },
    { id: 16, name: "Wolverine", category: "movies", fandom: "Marvel", role: "protagonist", views: 45000, rating: "9.0",
      img: "https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=600",
      backdrop: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=1600",
      bio: "A mutant with regenerative healing, retractable claws, and an adamantium skeleton.",
      abilities: ["Healing Factor", "Adamantium Claws", "Enhanced Senses"],
      affiliations: "X-Men · Weapon X",
      firstAppearance: "The Incredible Hulk #180 (1974)" },
    { id: 17, name: "Indiana Jones", category: "movies", fandom: "Indiana Jones", role: "protagonist", views: 42000, rating: "8.9",
      img: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=600",
      backdrop: "https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=1600",
      bio: "A globetrotting archaeologist and professor who recovers ancient artifacts.",
      abilities: ["Whip Mastery", "Archaeology", "Improvisation"],
      affiliations: "Marshall College",
      firstAppearance: "Raiders of the Lost Ark (1981)" },

    // TV SHOWS
    { id: 18, name: "Walter White / Heisenberg", category: "tv-shows", fandom: "Breaking Bad", role: "protagonist", views: 50000, rating: "9.6",
      img: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=600",
      backdrop: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=1600",
      bio: "A chemistry teacher who becomes a drug kingpin after a terminal cancer diagnosis.",
      abilities: ["Chemistry Genius", "Strategic Mind", "Manipulation"],
      affiliations: "Heisenberg's Empire",
      firstAppearance: "Breaking Bad S1E1 (2008)" },
    { id: 19, name: "Jon Snow", category: "tv-shows", fandom: "Game of Thrones", role: "protagonist", views: 48000, rating: "9.1",
      img: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=600",
      backdrop: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=1600",
      bio: "The bastard son of Ned Stark who joins the Night's Watch and rises to Lord Commander.",
      abilities: ["Swordsmanship", "Leadership", "Warg (subtle)"],
      affiliations: "Night's Watch · House Stark",
      firstAppearance: "Game of Thrones S1E1 (2011)" },
    { id: 20, name: "Eleven", category: "tv-shows", fandom: "Stranger Things", role: "protagonist", views: 46000, rating: "9.0",
      img: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=600",
      backdrop: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=1600",
      bio: "A young girl with powerful telekinetic abilities who escapes from Hawkins Lab.",
      abilities: ["Telekinesis", "Psychic Tracking", "Remote Viewing"],
      affiliations: "Hawkins Lab · Party",
      firstAppearance: "Stranger Things S1E1 (2016)" },

    // K-POP
    { id: 21, name: "Jungkook", category: "kpop", fandom: "BTS", role: "supporting", views: 52000, rating: "9.5",
      img: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=600",
      backdrop: "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1600",
      bio: "The golden maknae of BTS, known for his vocals, dance, and versatility.",
      abilities: ["Vocals", "Dance", "Songwriting", "Production"],
      affiliations: "BTS · HYBE Labels",
      firstAppearance: "BTS Debut (2013)" },
    { id: 22, name: "Lisa", category: "kpop", fandom: "BLACKPINK", role: "supporting", views: 50000, rating: "9.4",
      img: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=600",
      backdrop: "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1600",
      bio: "Thai rapper, dancer, and singer of BLACKPINK, known for her stage presence.",
      abilities: ["Dance", "Rap", "Vocals"],
      affiliations: "BLACKPINK · YG Entertainment",
      firstAppearance: "BLACKPINK Debut (2016)" },
    { id: 23, name: "IU", category: "kpop", fandom: "Soloist", role: "protagonist", views: 45000, rating: "9.3",
      img: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=600",
      backdrop: "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1600",
      bio: "A legendary soloist, actress, and songwriter known as the Nation's Little Sister.",
      abilities: ["Vocals", "Songwriting", "Acting", "Production"],
      affiliations: "EDAM Entertainment",
      firstAppearance: "Lost and Found (2008)" },
    { id: 24, name: "Felix", category: "kpop", fandom: "Stray Kids", role: "supporting", views: 42000, rating: "9.2",
      img: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=600",
      backdrop: "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1600",
      bio: "Australian-Korean dancer and rapper with one of the deepest voices in K-Pop.",
      abilities: ["Dance", "Rap", "Vocals"],
      affiliations: "Stray Kids · JYP Entertainment",
      firstAppearance: "Stray Kids Debut (2018)" },

    // COMICS
    { id: 25, name: "Spider-Man / Peter Parker", category: "comics", fandom: "Marvel", role: "protagonist", views: 48000, rating: "9.3",
      img: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=600",
      backdrop: "https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=1600",
      bio: "A teenager with spider-like powers who learns that with great power comes great responsibility.",
      abilities: ["Web-Slinging", "Spider-Sense", "Wall-Crawling"],
      affiliations: "Avengers · Spider-Verse",
      firstAppearance: "Amazing Fantasy #15 (1962)" },
    { id: 26, name: "Superman / Clark Kent", category: "comics", fandom: "DC", role: "protagonist", views: 46000, rating: "9.1",
      img: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=600",
      backdrop: "https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=1600",
      bio: "The Last Son of Krypton, Earth's greatest hero, defender of truth and justice.",
      abilities: ["Flight", "Super Strength", "Heat Vision", "Ice Breath"],
      affiliations: "Justice League · Daily Planet",
      firstAppearance: "Action Comics #1 (1938)" },
    { id: 27, name: "Joker", category: "comics", fandom: "DC", role: "antagonist", views: 45000, rating: "9.2",
      img: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=600",
      backdrop: "https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=1600",
      bio: "Batman's greatest nemesis, an agent of chaos who finds comedy in destruction.",
      abilities: ["Genius Intellect", "Chemicals", "Master Manipulation"],
      affiliations: "Injustice League",
      firstAppearance: "Batman #1 (1940)" }
  ];

  function renderCharacters() {
    let list = [...CHARACTERS];

    if (state.query) {
      const q = state.query.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.fandom.toLowerCase().includes(q)
      );
    }
    if (state.category !== 'all') list = list.filter(c => c.category === state.category);
    if (state.role !== 'all') list = list.filter(c => c.role === state.role);

    if (state.sort === 'popular') list.sort((a, b) => b.views - a.views);
    else if (state.sort === 'az') list.sort((a, b) => a.name.localeCompare(b.name));

    if (!list.length) {
      gridEl.innerHTML = '';
      emptyEl.style.display = 'flex';
      return;
    }
    emptyEl.style.display = 'none';

    gridEl.innerHTML = list.map(c => `
      <article class="fh-char-card" data-open="${c.id}" tabindex="0" role="button" aria-label="${c.name}">
        <span class="fh-char-card__role fh-char-card__role--${c.role}">${c.role}</span>
        <div class="fh-char-card__media">
          <img src="${c.img}" alt="${c.name}" loading="lazy" onerror="this.style.display='none'">
          <span class="fh-char-card__rate"><i class="fas fa-star"></i> ${c.rating}</span>
        </div>
        <div class="fh-char-card__body">
          <h3 class="fh-char-card__name">${c.name}</h3>
          <div class="fh-char-card__meta">
            <span><i class="fas fa-bookmark"></i> ${c.fandom}</span>
          </div>
          <div class="fh-char-card__cat">
            <span class="fh-char-card__badge">${c.category}</span>
          </div>
        </div>
      </article>
    `).join('');

    attachHandlers(gridEl);
    sideCount.textContent = CHARACTERS.length + '+';
  }

  function attachHandlers(container) {
    container.querySelectorAll('[data-open]').forEach(el => {
      el.addEventListener('click', () => openCharacter(Number(el.dataset.open)));
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openCharacter(Number(el.dataset.open));
        }
      });
    });
  }

  function openCharacter(id) {
    const c = CHARACTERS.find(x => x.id === id);
    if (!c) return;

    const related = CHARACTERS
      .filter(x => x.id !== c.id && (x.fandom === c.fandom || x.category === c.category))
      .slice(0, 6);

    drawerBody.innerHTML = `
      <div class="fh-drawer__hero">
        <img src="${c.backdrop}" alt="${c.name}">
        <div class="fh-drawer__hero-content">
          <h1 class="fh-drawer__title" id="fhDrawerTitle">${c.name}</h1>
          <div class="fh-drawer__meta">
            <span><i class="fas fa-star" style="color:#fbbf24"></i> ${c.rating}</span>
            <span><i class="fas fa-bookmark"></i> ${c.fandom}</span>
            <span><i class="fas fa-tag"></i> ${c.category}</span>
            <span class="fh-role-badge fh-role-badge--${c.role}">${c.role}</span>
          </div>
          <div class="fh-drawer__actions">
            <button class="fh-drawer__btn fh-drawer__btn--primary" id="bookmarkCharBtn">
              <i class="far fa-bookmark"></i> Bookmark
            </button>
            <button class="fh-drawer__btn fh-drawer__btn--ghost" id="shareCharBtn">
              <i class="fas fa-share-nodes"></i> Share
            </button>
            <button class="fh-drawer__btn fh-drawer__btn--ghost" id="rateCharBtn">
              <i class="fas fa-star"></i> Rate
            </button>
          </div>
        </div>
      </div>
      <div class="fh-drawer__content">
        <div>
          <h3 class="fh-drawer__section-title">Biography</h3>
          <p class="fh-drawer__desc">${c.bio}</p>

          <h3 class="fh-drawer__section-title">Abilities</h3>
          <div class="fh-drawer__tags">
            ${c.abilities.map(a => `<span class="fh-drawer__tag">${a}</span>`).join('')}
          </div>

          <h3 class="fh-drawer__section-title" style="margin-top:26px;">Related Characters</h3>
          <div class="fh-drawer__related" id="fhRelatedChars"></div>
        </div>
        <div class="fh-drawer__info-card">
          <h3 class="fh-drawer__section-title">Details</h3>
          <div class="fh-drawer__info-row"><span class="fh-drawer__info-label">Fandom</span><span class="fh-drawer__info-value">${c.fandom}</span></div>
          <div class="fh-drawer__info-row"><span class="fh-drawer__info-label">Category</span><span class="fh-drawer__info-value">${c.category}</span></div>
          <div class="fh-drawer__info-row"><span class="fh-drawer__info-label">Role</span><span class="fh-drawer__info-value">${c.role}</span></div>
          <div class="fh-drawer__info-row"><span class="fh-drawer__info-label">Affiliation</span><span class="fh-drawer__info-value">${c.affiliations}</span></div>
          <div class="fh-drawer__info-row"><span class="fh-drawer__info-label">First Appearance</span><span class="fh-drawer__info-value">${c.firstAppearance}</span></div>
          <div class="fh-drawer__info-row"><span class="fh-drawer__info-label">Views</span><span class="fh-drawer__info-value">${c.views.toLocaleString()}</span></div>
        </div>
      </div>
    `;

    const relatedEl = drawerBody.querySelector('#fhRelatedChars');
    relatedEl.innerHTML = related.map(r => `
      <div class="fh-related-card" data-open="${r.id}">
        <img src="${r.img}" alt="${r.name}" loading="lazy" onerror="this.style.display='none'">
        <div class="fh-related-card__name">${r.name}</div>
      </div>
    `).join('');
    relatedEl.querySelectorAll('[data-open]').forEach(el => {
      el.addEventListener('click', () => openCharacter(Number(el.dataset.open)));
    });

    const bookmarkBtn = drawerBody.querySelector('#bookmarkCharBtn');
    bookmarkBtn.addEventListener('click', () => {
      const icon = bookmarkBtn.querySelector('i');
      const active = icon.classList.contains('fas');
      icon.className = active ? 'far fa-bookmark' : 'fas fa-bookmark';
      bookmarkBtn.style.background = active ? '' : 'var(--fh-accent-2)';
    });

    const shareBtn = drawerBody.querySelector('#shareCharBtn');
    shareBtn.addEventListener('click', () => {
      const url = `${window.location.origin}/character-single.html?id=${c.id}`;
      if (navigator.share) {
        navigator.share({ title: c.name, url }).catch(() => {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(url);
        shareBtn.querySelector('i').className = 'fas fa-check';
        setTimeout(() => shareBtn.querySelector('i').className = 'fas fa-share-nodes', 1500);
      }
    });

    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function initDrawer() {
    if (!drawer) return;
    drawer.querySelectorAll('[data-drawer-close]').forEach(el => el.addEventListener('click', closeDrawer));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
    });
  }

  function initFilters() {
    if (searchInput) searchInput.addEventListener('input', e => {
      state.query = e.target.value.trim();
      renderCharacters();
    });

    if (categorySelect) categorySelect.addEventListener('change', e => {
      state.category = e.target.value;
      renderCharacters();
    });

    if (roleSelect) roleSelect.addEventListener('change', e => {
      state.role = e.target.value;
      renderCharacters();
    });

    if (sortWrap) sortWrap.addEventListener('click', e => {
      const btn = e.target.closest('.fh-chars-sort__btn');
      if (!btn) return;
      sortWrap.querySelectorAll('.fh-chars-sort__btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      state.sort = btn.dataset.sort;
      renderCharacters();
    });
  }

  function initSearch() {
    const searchWrap = document.getElementById('fhSearchWrap');
    const searchInputNav = document.getElementById('fhSearchInput');
    const searchResults = document.getElementById('fhSearchResults');
    if (!searchWrap || !searchInputNav) return;

    const openResults = () => searchWrap.classList.add('is-open');
    const closeResults = () => searchWrap.classList.remove('is-open');

    function renderNavResults(list) {
      if (!list.length) {
        searchResults.innerHTML = `<div class="fh-search-results__empty">No results found</div>`;
        return;
      }
      searchResults.innerHTML = list.slice(0, 8).map(c => `
        <div class="fh-search-results__item" data-open="${c.id}">
          <img src="${c.img}" alt="${c.name}" onerror="this.style.display='none'">
          <div class="fh-search-results__info">
            <div class="fh-search-results__title">${c.name}</div>
            <div class="fh-search-results__meta">${c.fandom} · ${c.category}</div>
          </div>
        </div>
      `).join('');
      searchResults.querySelectorAll('[data-open]').forEach(el => {
        el.addEventListener('click', () => {
          openCharacter(Number(el.dataset.open));
          closeResults();
          searchInputNav.blur();
        });
      });
    }

    searchInputNav.addEventListener('focus', () => {
      openResults();
      const q = searchInputNav.value.trim();
      const list = q ? CHARACTERS.filter(c => c.name.toLowerCase().includes(q.toLowerCase())) : CHARACTERS.slice(0, 6);
      renderNavResults(list);
    });

    searchInputNav.addEventListener('input', () => {
      const q = searchInputNav.value.trim();
      const list = q ? CHARACTERS.filter(c => c.name.toLowerCase().includes(q.toLowerCase())) : CHARACTERS.slice(0, 6);
      renderNavResults(list);
    });

    document.addEventListener('click', e => {
      if (!searchWrap.contains(e.target)) closeResults();
    });

    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputNav.focus();
        searchInputNav.select();
      }
    });
  }

  function init() {
    initFilters();
    initSearch();
    initDrawer();
    renderCharacters();
  }

  async function loadBackendData() {
    try {
      if (window.FHApi) {
        var res = await window.FHApi.characters();
        if (res && Array.isArray(res.characters) && res.characters.length) CHARACTERS = res;
      }
    } catch (e) {
      console.warn('Fan Hub backend data fallback:', e);
    }
  }

  async function boot() {
    await loadBackendData();
    init();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();