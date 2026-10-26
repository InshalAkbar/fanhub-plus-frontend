(function () {
  'use strict';

  var $  = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  var K_API    = 'fanhub-groq-key';
  var K_MODEL  = 'fanhub-groq-model';
  var K_HIST   = 'fanhub-chat-history';
  var K_OFF    = 'fanhub-chat-offline';

  var GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

  /* ============================================================
     ⚠️ API KEY REMOVED — Ab user Settings se apni key daalega
     Purani key GitHub par expose ho gayi thi, isliye hata di.
     User Settings icon (sliders) se apni key daal sakta hai.
     ============================================================ */
  var DEFAULT_API_KEY = '';

  var DEFAULT_MODEL = 'openai/gpt-oss-120b';
  var MAX_CHARS = 2000;

  var SYSTEM_PROMPT = [
    'You are "Fan Hub Assistant" — the official AI guide for Fan Hub Plus, a Fandom Universe web app.',
    '',
    'Fan Hub Plus covers 8 categories:',
    '1. Anime (Spirited Away, Your Name, Akira, Princess Mononoke, Perfect Blue, etc.)',
    '2. Manga (One Piece, Berserk, Vagabond, Monster, Death Note, Chainsaw Man, etc.)',
    '3. Movies — Latest, Upcoming, Most Watched, Comic Book Movies',
    '4. TV Series (Breaking Bad, Game of Thrones, Stranger Things, Chernobyl, The Wire, etc.)',
    '5. K-Pop (BTS, BLACKPINK, TWICE, EXO, Stray Kids, NewJeans, etc.)',
    '6. Gaming (Elden Ring, The Witcher 3, Red Dead Redemption 2, God of War, Cyberpunk 2077, etc.)',
    '7. Comics (Watchmen, The Sandman, Saga, Invincible, Maus, etc.)',
    '8. Cosplay (Zero Two, Jinx, Geralt, Spider-Gwen, Wednesday, etc.)',
    '',
    'YOUR PERSONALITY:',
    '- Warm, friendly, enthusiastic about fandom culture.',
    '- Uses emojis occasionally but not excessively (1-2 per reply).',
    '- Never says "I don\'t know" — always gives a helpful answer, a smart guess, or asks a clarifying question to keep the conversation moving.',
    '- Gives concise answers (2-5 sentences) by default. Go deeper only when the user asks for more.',
    '- Matches the user\'s language style: English, Hindi, Urdu, or Roman Urdu. If the user writes in Roman Urdu, reply in Roman Urdu.',
    '',
    'YOUR RULES:',
    '- When asked about a specific title: mention year, genre, brief plot, rating, and where to find it on Fan Hub Plus.',
    '- When asked for recommendations: give 3-5 specific titles with a one-line reason each.',
    '- When asked about navigation: explain which section of the site has what.',
    '- When asked something outside fandom: gently steer back to fandom topics while still being helpful.',
    '- NEVER mention OpenAI, ChatGPT, GPT, Llama, Groq, or that you are a language model.',
    '- NEVER apologize excessively or say "as an AI".',
    '- Always end with a small engaging touch — a question, a suggestion, or an emoji.',
    '',
    'FORMAT:',
    '- Use plain text. You may use short bullet points with "-" for lists.',
    '- Keep paragraphs short (2-3 sentences max per paragraph).',
    '- Bold key titles using **title** notation.'
  ].join('\n');

  /* ---------- Offline knowledge base ---------- */
  var KB = [
    { keys: ['hello', 'hi ', 'hey', 'salam', 'assalam', 'namaste'],
      reply: 'Hey there! 👋 I\'m **Fan Hub Assistant** — your guide to anime, movies, games, K-Pop, comics, and more. What would you like to explore today?' },
    { keys: ['who are you', 'what are you', 'your name', 'tum kon', 'kaun ho'],
      reply: 'I\'m **Fan Hub Assistant** — a friendly AI that helps you discover and discuss everything on Fan Hub Plus: anime, manga, movies, TV series, K-Pop, gaming, comics, and cosplay. Ask me anything!' },
    { keys: ['what is fan hub', 'about fan hub', 'fan hub kya'],
      reply: '**Fan Hub Plus** is a Fandom Universe platform that brings together 8 fandoms under one roof: Anime, Manga, Movies, TV Series, K-Pop, Gaming, Comics, and Cosplay. Browse curated content, watch trailers, read character profiles, and book upcoming events. ✨' },
    { keys: ['categories', 'sections', 'what do you have', 'kya kya hai'],
      reply: 'Fan Hub Plus has 8 categories:\n- **Anime** & **Manga**\n- **Movies** (Latest, Upcoming, Most Watched)\n- **TV Series**\n- **K-Pop**\n- **Gaming**\n- **Comics**\n- **Cosplay**\n\nWhich one would you like to explore? 🎬' },
    { keys: ['recommend anime', 'best anime', 'anime suggest', 'anime recommend'],
      reply: 'Top anime picks:\n- **Spirited Away** (2001) — Ghibli\'s dreamlike masterpiece\n- **Your Name** (2016) — beautiful body-swap romance\n- **Attack on Titan** — dark, epic, unforgettable\n- **Fullmetal Alchemist: Brotherhood** — perfect story and heart\n- **Perfect Blue** — psychological thriller by Satoshi Kon\n\nWant more in a specific genre? 🎌' },
    { keys: ['recommend movie', 'best movie', 'movie suggest', 'movie recommend'],
      reply: 'Depends on the mood! Try:\n- **Inception** — mind-bending heist\n- **The Dark Knight** — superhero perfection\n- **Parasite** — Oscar-winning thriller\n- **Dune: Part Two** — sci-fi epic\n- **Everything Everywhere All at Once** — emotional chaos\n\nWhat genre are you in the mood for? 🎬' },
    { keys: ['recommend game', 'best game', 'game suggest', 'game recommend'],
      reply: 'Top game picks:\n- **Elden Ring** — brutal, beautiful open world\n- **The Witcher 3** — gold standard of RPGs\n- **Red Dead Redemption 2** — cinematic western\n- **God of War: Ragnarök** — Norse saga\n- **Cyberpunk 2077** — especially after 2.0 update\n\nWhat platform are you on? 🎮' },
    { keys: ['breaking bad'],
      reply: '**Breaking Bad** (2008–2013) — Crime Drama by Vince Gilligan. A chemistry teacher with terminal cancer becomes a meth kingpin. Rating: **9.5/10**. 5 seasons, 62 episodes. Find it in the **TV Series** section. 🧪' },
    { keys: ['game of thrones'],
      reply: '**Game of Thrones** (2011–2019) — Epic Fantasy. Nine noble families fight for the Iron Throne. Rating: **9.2/10**. 8 seasons. Find it in the **TV Series** section. 🐉' },
    { keys: ['one piece'],
      reply: '**One Piece** by Eiichiro Oda — the greatest adventure in manga. Luffy sails the Grand Line chasing legendary treasure. Rating: **9.7/10**, 107+ volumes. Find it in the **Manga** section. 🏴‍☠️' },
    { keys: ['elden ring'],
      reply: '**Elden Ring** (2022) — Action RPG by FromSoftware. Open-world soulslike with George R.R. Martin lore. Rating: **9.6/10**. Available on PC, PS5, Xbox Series. Find it in the **Gaming** section. ⚔️' },
    { keys: ['bts'],
      reply: '**BTS** — the global K-Pop phenomenon. Debut: 2013, Label: BIGHIT MUSIC, Fandom: **ARMY**. Hits: Dynamite, Butter, Spring Day. Find them in the **K-Pop** section. 💜' },
    { keys: ['watchmen'],
      reply: '**Watchmen** (1986) by Alan Moore & Dave Gibbons — a murder investigation pulls retired vigilantes back into a broken world. Rating: **9.8/10**. Find it in the **Comics** section. ⏱️' },
    { keys: ['cosplay'],
      reply: '**Cosplay** on Fan Hub Plus features iconic looks like Zero Two, Jinx, Geralt, Spider-Gwen, Wednesday Addams, and more — with cosplayer profiles, shot locations, and full galleries. Head to the **Cosplay** section! 🎭' },
    { keys: ['api', 'groq', 'key', 'connect'],
      reply: 'To connect your Groq API, click the **Settings** icon (the sliders icon in the header) and paste your API key. You can get a fresh free key at **console.groq.com**. 🔑' },
    { keys: ['help', 'how to use', 'guide'],
      reply: 'Just type anything! You can ask me for:\n- Recommendations (movies, anime, games…)\n- Info about a specific title\n- Navigation help on Fan Hub Plus\n- Fandom trivia\n\nTry: "Recommend me a sci-fi movie" or "Tell me about Breaking Bad". ✨' },
    { keys: ['thanks', 'thank you', 'shukriya', 'jazak'],
      reply: 'You\'re welcome! 😊 Anything else you\'d like to explore?' },
    { keys: ['bye', 'goodbye', 'khuda hafiz'],
      reply: 'See you soon! Come back anytime — I\'m here 24/7. 👋' }
  ];

  function kbSearch(query) {
    var q = ' ' + query.toLowerCase() + ' ';
    var best = null;
    var bestScore = 0;
    for (var i = 0; i < KB.length; i++) {
      var item = KB[i];
      var score = 0;
      for (var j = 0; j < item.keys.length; j++) {
        if (q.indexOf(item.keys[j]) !== -1) {
          score += item.keys[j].length;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        best = item;
      }
    }
    return best ? best.reply : null;
  }

  function kbFallback() {
    return 'I\'m not fully connected right now, but I can still help with the basics of Fan Hub Plus! ' +
           'Ask me about **anime**, **movies**, **games**, **K-Pop**, **comics**, or **cosplay** — or just say "recommend me something". 🔑\n\n' +
           'To connect your Groq API key, open **Settings** (sliders icon in the header).';
  }

  /* ============================================================
     STATE
     ============================================================ */
  var state = {
    apiKey: '',
    model: DEFAULT_MODEL,
    offline: true,
    messages: [],
    busy: false
  };

  var el = {};

  /* ============================================================
     HELPERS
     ============================================================ */
  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderText(text) {
    var safe = esc(text);
    safe = safe.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    safe = safe.replace(/`(.+?)`/g, '<code>$1</code>');
    safe = safe.replace(/(https?:\/\/[^\s<]+)/g, function (m) {
      return '<a href="' + m + '" target="_blank" rel="noopener">' + m + '</a>';
    });
    return safe;
  }

  function scrollBottom(smooth) {
    if (!el.messages) return;
    var t = el.messages.scrollHeight;
    if (smooth) {
      el.messages.scrollTo({ top: t, behavior: 'smooth' });
    } else {
      el.messages.scrollTop = t;
    }
  }

  function nowTime() {
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    var ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12; if (h === 0) h = 12;
    return h + ':' + (m < 10 ? '0' + m : m) + ' ' + ampm;
  }

  /* ============================================================
     STORAGE
     ============================================================ */
  function loadState() {
    try {
      var storedKey = localStorage.getItem(K_API);
      state.apiKey = storedKey ? storedKey : DEFAULT_API_KEY;

      state.model  = localStorage.getItem(K_MODEL) || DEFAULT_MODEL;

      var off = localStorage.getItem(K_OFF);
      state.offline = off === null ? true : off === '1';
    } catch (e) {
      state.apiKey = DEFAULT_API_KEY;
    }
    try {
      var raw = localStorage.getItem(K_HIST);
      if (raw) {
        var arr = JSON.parse(raw);
        if (Array.isArray(arr)) state.messages = arr.slice(-40);
      }
    } catch (e) {}
  }

  function saveState() {
    try {
      if (state.apiKey && state.apiKey !== DEFAULT_API_KEY) {
        localStorage.setItem(K_API, state.apiKey);
      } else {
        localStorage.removeItem(K_API);
      }
      localStorage.setItem(K_MODEL, state.model);
      localStorage.setItem(K_OFF, state.offline ? '1' : '0');
    } catch (e) {}
  }

  function saveHistory() {
    try {
      localStorage.setItem(K_HIST, JSON.stringify(state.messages.slice(-40)));
    } catch (e) {}
  }

  /* ============================================================
     STATUS
     ============================================================ */
  function updateStatus() {
    if (!el.statusCard || !el.statusText) return;
    el.statusCard.classList.remove('is-online', 'is-offline');
    if (state.apiKey) {
      el.statusCard.classList.add('is-online');
      var modelShort = state.model.split('/').pop();
      el.statusText.textContent = 'Groq · ' + modelShort;
      if (el.titleSub) el.titleSub.textContent = 'Connected · ' + modelShort;
    } else {
      el.statusCard.classList.add('is-offline');
      el.statusText.textContent = state.offline ? 'Offline mode' : 'Not connected';
      if (el.titleSub) el.titleSub.textContent = 'Offline · Knowledge base';
    }
  }

  /* ============================================================
     SIDEBAR PROMPTS
     ============================================================ */
  var QUICK_PROMPTS = [
    { icon: 'fa-star',        label: 'Recommend a sci-fi movie' },
    { icon: 'fa-dragon',      label: 'Best anime of all time?' },
    { icon: 'fa-gamepad',     label: 'Top 3 games I should play' },
    { icon: 'fa-music',       label: 'Tell me about BTS' },
    { icon: 'fa-book-open',   label: 'Explain Watchmen quickly' },
    { icon: 'fa-mask',        label: 'What is cosplay?' }
  ];

  var EMPTY_SUGGESTIONS = [
    { icon: 'fa-fire',           text: 'Recommend me a crime thriller movie' },
    { icon: 'fa-dragon',         text: 'Give me the top 5 anime of all time' },
    { icon: 'fa-gamepad',        text: 'Which game should I play next?' },
    { icon: 'fa-heart',          text: 'Suggest a romantic series to binge' }
  ];

  function renderSidebarPrompts() {
    if (!el.prompts) return;
    el.prompts.innerHTML = QUICK_PROMPTS.map(function (p) {
      return '<button type="button" class="ai-prompt" data-suggest="' + esc(p.label) + '">' +
               '<span class="ai-prompt__icon"><i class="fas ' + p.icon + '"></i></span>' +
               '<span>' + esc(p.label) + '</span>' +
             '</button>';
    }).join('');
  }

  /* ============================================================
     EMPTY STATE
     ============================================================ */
  function emptyStateHTML() {
    return '' +
      '<div class="ai-empty" id="aiEmpty">' +
        '<div class="ai-empty__orb"><i class="fas fa-comment-dots"></i></div>' +
        '<h2 class="ai-empty__title">How can I help you today?</h2>' +
        '<p class="ai-empty__desc">Ask anything about anime, movies, games, K-Pop, comics or cosplay — or pick a suggestion below.</p>' +
        '<div class="ai-empty__grid" id="aiEmptyGrid">' +
          EMPTY_SUGGESTIONS.map(function (s) {
            return '<button type="button" class="ai-suggest" data-suggest="' + esc(s.text) + '">' +
                     '<i class="fas ' + s.icon + '"></i>' +
                     '<span>' + esc(s.text) + '</span>' +
                   '</button>';
          }).join('') +
        '</div>' +
      '</div>';
  }

  function showEmpty() {
    if (!el.messages) return;
    el.messages.innerHTML = emptyStateHTML();
  }

  function hideEmpty() {
    var e = $('#aiEmpty');
    if (e && e.parentNode) e.parentNode.removeChild(e);
  }

  /* ============================================================
     MESSAGE RENDER
     ============================================================ */
  function appendMessage(role, content) {
    if (!el.messages) return;
    hideEmpty();
    var isUser = role === 'user';
    var row = document.createElement('div');
    row.className = 'ai-msg ai-msg--' + (isUser ? 'user' : 'bot');

    var avatarHTML = isUser
      ? '<div class="ai-msg__avatar">YOU</div>'
      : '<div class="ai-msg__avatar"><i class="fas fa-wand-magic-sparkles"></i></div>';

    var bubbleHTML = isUser ? esc(content) : renderText(content);

    var copyBtn = isUser ? '' :
      '<button type="button" class="ai-msg__copy" data-copy>' +
        '<i class="fas fa-copy"></i> Copy' +
      '</button>';

    row.innerHTML =
      avatarHTML +
      '<div class="ai-msg__body">' +
        '<div class="ai-msg__bubble">' + bubbleHTML + '</div>' +
        '<div class="ai-msg__meta">' +
          '<span>' + nowTime() + '</span>' +
          copyBtn +
        '</div>' +
      '</div>';

    el.messages.appendChild(row);
    scrollBottom(true);
  }

  function appendTyping() {
    if (!el.messages) return;
    hideEmpty();
    var t = document.createElement('div');
    t.className = 'ai-typing';
    t.id = 'aiTyping';
    t.innerHTML =
      '<div class="ai-msg__avatar" style="background:linear-gradient(135deg,var(--p1),var(--p2))">' +
        '<i class="fas fa-wand-magic-sparkles"></i>' +
      '</div>' +
      '<div class="ai-typing__bubble">' +
        '<span class="ai-typing__dot"></span>' +
        '<span class="ai-typing__dot"></span>' +
        '<span class="ai-typing__dot"></span>' +
      '</div>';
    el.messages.appendChild(t);
    scrollBottom(true);
  }

  function removeTyping() {
    var t = $('#aiTyping');
    if (t && t.parentNode) t.parentNode.removeChild(t);
  }

  function renderAll() {
    if (!el.messages) return;
    el.messages.innerHTML = '';
    if (!state.messages.length) {
      showEmpty();
      return;
    }
    for (var i = 0; i < state.messages.length; i++) {
      appendMessage(state.messages[i].role, state.messages[i].content);
    }
    scrollBottom(false);
  }

  /* ============================================================
     INPUT
     ============================================================ */
  function autoResize() {
    if (!el.input) return;
    el.input.style.height = 'auto';
    var h = Math.min(el.input.scrollHeight, 180);
    el.input.style.height = h + 'px';

    var len = el.input.value.length;
    if (el.charCount) el.charCount.textContent = len + ' / ' + MAX_CHARS;
    if (el.send) el.send.disabled = !el.input.value.trim() || state.busy;
  }

  function setBusy(on) {
    state.busy = on;
    if (el.send) el.send.disabled = on || !(el.input && el.input.value.trim());
  }

  /* ============================================================
     GROQ API CALL
     ============================================================ */
  function buildApiMessages(extraUserText) {
    var arr = [{ role: 'system', content: SYSTEM_PROMPT }];
    var slice = state.messages.slice(-20);
    for (var i = 0; i < slice.length; i++) {
      var m = slice[i];
      if (m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string') {
        arr.push({ role: m.role, content: m.content });
      }
    }
    if (extraUserText) arr.push({ role: 'user', content: extraUserText });
    return arr;
  }

  function callGroq(userText) {
    return new Promise(function (resolve, reject) {
      if (!state.apiKey) return reject(new Error('no-key'));

      var body = {
        model: state.model || DEFAULT_MODEL,
        messages: buildApiMessages(userText),
        temperature: 0.85,
        max_tokens: 500,
        stream: false
      };

      var ctrl = new AbortController();
      var timeout = setTimeout(function () { ctrl.abort(); }, 45000);

      fetch(GROQ_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + state.apiKey
        },
        body: JSON.stringify(body),
        signal: ctrl.signal
      })
      .then(function (res) {
        clearTimeout(timeout);
        if (!res.ok) {
          return res.json().catch(function () { return {}; }).then(function (err) {
            var msg = (err && err.error && err.error.message) || ('HTTP ' + res.status);
            reject(new Error(msg));
          });
        }
        return res.json();
      })
      .then(function (data) {
        if (!data) return;
        var reply = data.choices &&
                    data.choices[0] &&
                    data.choices[0].message &&
                    data.choices[0].message.content;
        if (!reply) return reject(new Error('empty-reply'));
        resolve(reply.trim());
      })
      .catch(function (err) {
        clearTimeout(timeout);
        reject(err);
      });
    });
  }

  /* ============================================================
     SEND
     ============================================================ */
  function send(text) {
    if (state.busy) return;
    var msg = (text != null ? text : (el.input ? el.input.value : '')).trim();
    if (!msg) return;
    if (msg.length > MAX_CHARS) msg = msg.slice(0, MAX_CHARS);

    state.messages.push({ role: 'user', content: msg });
    appendMessage('user', msg);
    saveHistory();

    if (el.input) {
      el.input.value = '';
      autoResize();
    }

    setBusy(true);
    appendTyping();

    var chain;
    if (state.apiKey) {
      chain = callGroq(msg).catch(function (err) {
        console.warn('[AI] Groq call failed:', err && err.message);
        if (state.offline) {
          return kbSearch(msg) || kbFallback();
        }
        throw err;
      });
    } else {
      chain = new Promise(function (resolve) {
        setTimeout(function () {
          resolve(kbSearch(msg) || kbFallback());
        }, 450);
      });
    }

    chain.then(function (reply) {
      removeTyping();
      state.messages.push({ role: 'assistant', content: reply });
      appendMessage('assistant', reply);
      saveHistory();
      setBusy(false);
      autoResize();
    }).catch(function (err) {
      removeTyping();
      var errMsg = 'Sorry, something went wrong. ' +
        (err && err.message ? '(' + err.message + ') ' : '') +
        'Check the Groq API key in Settings or try again.';
      state.messages.push({ role: 'assistant', content: errMsg });
      appendMessage('assistant', errMsg);
      saveHistory();
      setBusy(false);
      autoResize();
    });
  }

  /* ============================================================
     MODAL
     ============================================================ */
  function openModal() {
    if (!el.settingsModal) return;
    if (el.apiKeyInput) el.apiKeyInput.value = state.apiKey || '';
    if (el.modelSelect) el.modelSelect.value = state.model || DEFAULT_MODEL;
    if (el.offlineToggle) el.offlineToggle.checked = !!state.offline;
    el.settingsModal.classList.add('is-open');
    el.settingsModal.setAttribute('aria-hidden', 'false');
    setTimeout(function () {
      try { el.apiKeyInput && el.apiKeyInput.focus(); } catch (e) {}
    }, 200);
  }

  function closeModal() {
    if (!el.settingsModal) return;
    el.settingsModal.classList.remove('is-open');
    el.settingsModal.setAttribute('aria-hidden', 'true');
  }

  function saveSettings() {
    state.apiKey = (el.apiKeyInput && el.apiKeyInput.value || '').trim();
    state.model  = (el.modelSelect && el.modelSelect.value) || DEFAULT_MODEL;
    state.offline = !!(el.offlineToggle && el.offlineToggle.checked);
    saveState();
    updateStatus();
    closeModal();

    if (state.apiKey) {
      var modelShort = state.model.split('/').pop();
      var m = 'Connected to **Groq** using **' + modelShort + '**. Ask me anything! ⚡';
      state.messages.push({ role: 'assistant', content: m });
      appendMessage('assistant', m);
      saveHistory();
    }
  }

  function removeKey() {
    state.apiKey = '';
    saveState();
    updateStatus();
    if (el.apiKeyInput) el.apiKeyInput.value = '';
    closeModal();
  }

  /* ============================================================
     SIDEBAR TOGGLE (mobile)
     ============================================================ */
  function openSide() {
    if (!el.side) return;
    el.side.classList.add('is-open');
    if (el.overlay) el.overlay.classList.add('is-open');
  }

  function closeSide() {
    if (!el.side) return;
    el.side.classList.remove('is-open');
    if (el.overlay) el.overlay.classList.remove('is-open');
  }

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    try {
      var doc = document.documentElement;

      el.header       = $('#aiHeader');
      el.progress     = $('#aiProgress');
      el.side         = $('#aiSide');
      el.sideClose    = $('#aiSideClose');
      el.sideToggle   = $('#aiSideToggle');
      el.overlay      = $('#aiOverlay');
      el.messages     = $('#aiMessages');
      el.input        = $('#aiInput');
      el.send         = $('#aiSendBtn');
      el.charCount    = $('#aiCharCount');
      el.titleSub     = $('#aiTitleSub');
      el.newChatBtn   = $('#aiNewChatBtn');
      el.clearChatBtn = $('#aiClearChatBtn');
      el.clearMini    = $('#aiClearMini');
      el.exportBtn    = $('#aiExportBtn');
      el.prompts      = $('#aiPrompts');
      el.settingsBtn  = $('#aiSettingsBtn');
      el.themeBtn     = $('#aiThemeBtn');
      el.statusCard   = $('#aiStatusCard');
      el.statusText   = $('#aiStatusText');
      el.settingsModal = $('#aiSettingsModal');
      el.apiKeyInput  = $('#aiApiKeyInput');
      el.modelSelect  = $('#aiModelSelect');
      el.saveKeyBtn   = $('#aiSaveKeyBtn');
      el.removeKeyBtn = $('#aiRemoveKeyBtn');
      el.keyToggle    = $('#aiKeyToggle');
      el.offlineToggle = $('#aiOfflineToggle');

      if (!el.messages || !el.input || !el.send) return;

      loadState();
      updateStatus();
      renderSidebarPrompts();
      renderAll();
      autoResize();

      if (el.sideToggle) el.sideToggle.addEventListener('click', openSide);
      if (el.sideClose)  el.sideClose.addEventListener('click', closeSide);
      if (el.overlay)    el.overlay.addEventListener('click', closeSide);

      if (el.themeBtn) {
        el.themeBtn.addEventListener('click', function () {
          var isLight = doc.classList.toggle('light-mode');
          el.themeBtn.setAttribute('aria-pressed', String(isLight));
          try { localStorage.setItem('fanhub-theme', isLight ? 'light' : 'dark'); } catch (e) {}
        });
        el.themeBtn.setAttribute('aria-pressed', String(doc.classList.contains('light-mode')));
      }

      if (el.settingsBtn) el.settingsBtn.addEventListener('click', openModal);
      if (el.settingsModal) {
        el.settingsModal.addEventListener('click', function (e) {
          if (e.target.closest('[data-modal-close]')) closeModal();
        });
      }
      if (el.keyToggle) {
        el.keyToggle.addEventListener('click', function () {
          var pwd = el.apiKeyInput.type === 'password';
          el.apiKeyInput.type = pwd ? 'text' : 'password';
          el.keyToggle.innerHTML = pwd
            ? '<i class="fas fa-eye-slash"></i>'
            : '<i class="fas fa-eye"></i>';
        });
      }
      if (el.saveKeyBtn)   el.saveKeyBtn.addEventListener('click', saveSettings);
      if (el.removeKeyBtn) el.removeKeyBtn.addEventListener('click', removeKey);

      el.input.addEventListener('input', autoResize);
      el.input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          send();
        }
      });
      el.send.addEventListener('click', function () { send(); });

      document.addEventListener('click', function (e) {
        var sug = e.target.closest('[data-suggest]');
        if (sug) {
          e.preventDefault();
          var text = sug.getAttribute('data-suggest');
          if (text) send(text);
          if (window.innerWidth <= 860) closeSide();
          return;
        }

        var copyBtn = e.target.closest('[data-copy]');
        if (copyBtn) {
          e.preventDefault();
          var rowEl = copyBtn.closest('.ai-msg');
          var bubble = rowEl && rowEl.querySelector('.ai-msg__bubble');
          if (bubble) {
            var txt = bubble.innerText || bubble.textContent || '';
            try {
              navigator.clipboard.writeText(txt);
              copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied';
              setTimeout(function () {
                copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
              }, 1400);
            } catch (err) {}
          }
        }
      });

      function resetChat() {
        if (state.busy) return;
        state.messages = [];
        saveHistory();
        renderAll();
        if (window.innerWidth <= 860) closeSide();
      }
      if (el.newChatBtn)   el.newChatBtn.addEventListener('click', resetChat);
      if (el.clearChatBtn) el.clearChatBtn.addEventListener('click', resetChat);
      if (el.clearMini)    el.clearMini.addEventListener('click', resetChat);

      if (el.exportBtn) {
        el.exportBtn.addEventListener('click', function () {
          var lines = state.messages.map(function (m) {
            return (m.role === 'user' ? 'You' : 'Assistant') + ': ' + m.content;
          }).join('\n\n');
          var blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = 'fanhub-chat-' + Date.now() + '.txt';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(function () { URL.revokeObjectURL(url); }, 500);
        });
      }

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          closeModal();
          closeSide();
        }
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          el.input.focus();
        }
      });

      var ticking = false;
      function onScroll() {
        var y = window.scrollY || window.pageYOffset || 0;
        if (el.header) el.header.classList.toggle('is-scrolled', y > 20);
        var docH = document.documentElement.scrollHeight - window.innerHeight;
        var pct = docH > 0 ? (y / docH) * 100 : 0;
        if (el.progress) el.progress.style.width = pct + '%';
        ticking = false;
      }
      window.addEventListener('scroll', function () {
        if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
      }, { passive: true });
      onScroll();

      if (!state.messages.length) {
        setTimeout(function () {
          var welcome =
            'Hi! 👋 I\'m **Fan Hub Assistant** — your guide to everything on Fan Hub Plus.\n\n' +
            'Ask me for recommendations, info about any title, or just say hi!\n\n' +
            'Try: "Recommend me a sci-fi movie" or "Tell me about Breaking Bad".\n\n' +
            '⚡ To enable full AI, open **Settings** (sliders icon) and add your Groq API key.';
          state.messages.push({ role: 'assistant', content: welcome });
          appendMessage('assistant', welcome);
          saveHistory();
        }, 350);
      }

    } catch (err) {
      console.error('[AIChatbot] init failed:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();