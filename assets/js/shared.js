(function () {
  'use strict';

  document.documentElement.classList.add('js-ready');

  function fhAutoActiveNav() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    var links = document.querySelectorAll('.fh-nav__link, .fh-mobile-menu__link, .fh-dropdown__item');

    links.forEach(function (link) {
      var href = (link.getAttribute('href') || '').split('?')[0].split('#')[0];
      if (!href) return;

      var isMatch = href === path
        || (path === '' && href === 'index.html')
        || (path === 'index.html' && href === 'index.html');

      if (isMatch) {
        link.classList.add('is-active');
      }
    });

    if (typeof window.fhPositionNavPill === 'function') {
      window.fhPositionNavPill();
    } else {
      var pill = document.getElementById('fhNavPill');
      var active = document.querySelector('.fh-nav .fh-nav__link.is-active');
      var nav = document.getElementById('fhNav');
      if (pill && active && nav && nav.offsetWidth > 0) {
        var navRect = nav.getBoundingClientRect();
        var r = active.getBoundingClientRect();
        pill.style.width = r.width + 'px';
        pill.style.transform = 'translateX(' + (r.left - navRect.left) + 'px)';
        pill.style.opacity = '1';
      }
    }
  }

  document.addEventListener('DOMContentLoaded', fhAutoActiveNav);
  window.addEventListener('resize', fhAutoActiveNav);

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('.fh-nav__link--trigger');
    if (trigger) {
      e.preventDefault();
      e.stopImmediatePropagation();
      var dd = trigger.closest('.fh-nav__item--dropdown');
      if (!dd) return;
      var wasOpen = dd.classList.contains('is-open');
      document.querySelectorAll('.fh-nav__item--dropdown').forEach(function (d) {
        d.classList.remove('is-open');
      });
      if (!wasOpen) dd.classList.add('is-open');
      trigger.setAttribute('aria-expanded', String(!wasOpen));
      return;
    }
    if (!e.target.closest('.fh-nav__item--dropdown')) {
      document.querySelectorAll('.fh-nav__item--dropdown').forEach(function (d) {
        d.classList.remove('is-open');
        var t = d.querySelector('.fh-nav__link--trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    }
  }, true);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.fh-nav__item--dropdown').forEach(function (d) {
        d.classList.remove('is-open');
        var t = d.querySelector('.fh-nav__link--trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
      var toggle = document.getElementById('fhMenuToggle');
      var menu = document.getElementById('fhMobileMenu');
      if (toggle) {
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
      if (menu) menu.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  });

  var menuToggle = document.getElementById('fhMenuToggle');
  var mobileMenu = document.getElementById('fhMobileMenu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = mobileMenu.classList.toggle('is-open');
      menuToggle.classList.toggle('is-open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    document.addEventListener('click', function (e) {
      if (!mobileMenu.classList.contains('is-open')) return;
      if (mobileMenu.contains(e.target)) return;
      if (menuToggle.contains(e.target)) return;
      mobileMenu.classList.remove('is-open');
      menuToggle.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('is-open');
        menuToggle.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (window.innerWidth > 880 && mobileMenu.classList.contains('is-open')) {
          mobileMenu.classList.remove('is-open');
          menuToggle.classList.remove('is-open');
          menuToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      }, 150);
    });
  }


  /* ---------- GLOBAL SEARCH ---------- */
  (function initGlobalSearch() {
    var wrap = document.getElementById('fhSearchWrap');
    var input = document.getElementById('fhSearchInput');
    var results = document.getElementById('fhSearchResults');
    if (!wrap || !input || !results) return;

    var timer = null;
    var controller = null;

    function escapeHtml(value) {
      return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function closeSearch() {
      wrap.classList.remove('is-open');
    }

    function render(list, query) {
      if (!list.length) {
        results.innerHTML =
          '<div class="fh-search-results__empty">' +
          '<i class="fas fa-magnifying-glass"></i><br>' +
          'No results for <strong>' + escapeHtml(query) + '</strong>' +
          '</div>';
        wrap.classList.add('is-open');
        return;
      }

      results.innerHTML = list.map(function (item) {
        var image = item.image || '';
        var media = image
          ? '<img src="' + escapeHtml(image) + '" alt="" loading="lazy" onerror="this.style.display=\'none\'">'
          : '<span class="fh-search-results__fallback"><i class="fas fa-film"></i></span>';

        return '<a class="fh-search-results__item" href="' + escapeHtml(item.url || '#') + '">' +
          media +
          '<span class="fh-search-results__info">' +
            '<span class="fh-search-results__title">' + escapeHtml(item.title) + '</span>' +
            '<span class="fh-search-results__meta">' + escapeHtml(item.meta || item.type || 'Fan Hub') + '</span>' +
          '</span>' +
        '</a>';
      }).join('');

      wrap.classList.add('is-open');
    }

    async function runSearch() {
      var query = input.value.trim();

      if (controller) controller.abort();
      if (query.length < 2) {
        results.innerHTML = '';
        closeSearch();
        return;
      }

      if (!window.FHApi) {
        render([], query);
        return;
      }

      controller = new AbortController();

      try {
        var response = await fetch('/frontend/search?q=' + encodeURIComponent(query), {
          credentials: 'same-origin',
          headers: { 'Accept': 'application/json' },
          signal: controller.signal
        });

        if (!response.ok) throw new Error('Search failed');
        var data = await response.json();
        render(Array.isArray(data.results) ? data.results : [], query);
      } catch (error) {
        if (error.name === 'AbortError') return;
        results.innerHTML =
          '<div class="fh-search-results__empty">' +
          '<i class="fas fa-triangle-exclamation"></i><br>Search is temporarily unavailable.' +
          '</div>';
        wrap.classList.add('is-open');
      }
    }

    input.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(runSearch, 220);
    });

    input.addEventListener('focus', function () {
      if (input.value.trim().length >= 2) runSearch();
    });

    input.addEventListener('keydown', function (event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        input.focus();
        input.select();
      }

      if (event.key === 'Escape') {
        input.value = '';
        closeSearch();
        input.blur();
      }
    });

    document.addEventListener('keydown', function (event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        input.focus();
        input.select();
      }
    });

    document.addEventListener('click', function (event) {
      if (!wrap.contains(event.target)) closeSearch();
    });

    results.addEventListener('click', function () {
      closeSearch();
    });
  })();

  var themeToggle = document.getElementById('fhThemeToggle');
  if (themeToggle) {
    var root = document.documentElement;
    function syncThemeUI() {
      var isLight = root.classList.contains('light-mode');
      themeToggle.setAttribute('aria-pressed', String(isLight));
      themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    }
    syncThemeUI();
    themeToggle.addEventListener('click', function () {
      var isLight = root.classList.toggle('light-mode');
      try { localStorage.setItem('fanhub-theme', isLight ? 'light' : 'dark'); } catch (e) {}
      syncThemeUI();
    });
  }

  var progressBar = document.getElementById('fhProgressBar');
  if (progressBar) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    }, { passive: true });
  }

  var navbar = document.getElementById('fhNavbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('is-scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  var footer = document.getElementById('fhFooter');
  if (footer) {
    var footerRevealed = false;
    var footerObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !footerRevealed) {
          footer.classList.add('is-revealed');
          footerRevealed = true;
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -80px 0px' });
    footerObserver.observe(footer);
  }

  var nav = document.getElementById('fhNav');
  var navPill = document.getElementById('fhNavPill');
  if (nav && navPill) {
    var isNavVisible = function () {
      return nav.offsetWidth > 0 && nav.offsetHeight > 0;
    };

    var movePill = function (el) {
      if (!el || !el.offsetWidth || !isNavVisible()) return;
      var navRect = nav.getBoundingClientRect();
      var elRect = el.getBoundingClientRect();
      navPill.style.transform = 'translateX(' + (elRect.left - navRect.left) + 'px)';
      navPill.style.width = elRect.width + 'px';
    };

    var links = nav.querySelectorAll('.fh-nav__link');
    links.forEach(function (link) {
      link.addEventListener('mouseenter', function () { movePill(link); });
    });

    nav.addEventListener('mouseleave', function () {
      var active = nav.querySelector('.fh-nav__link.is-active') || nav.querySelector('.fh-nav__link');
      if (active) movePill(active);
    });

    requestAnimationFrame(function () {
      var active = nav.querySelector('.fh-nav__link.is-active') || nav.querySelector('.fh-nav__link');
      if (active) movePill(active);
    });

    window.addEventListener('resize', function () {
      var active = nav.querySelector('.fh-nav__link.is-active') || nav.querySelector('.fh-nav__link');
      if (active) movePill(active);
    });
  }

  function initReveal() {
    var revealEls = document.querySelectorAll('[data-reveal]');

    function revealOne(el) {
      if (el.classList.contains('is-revealed')) return;
      el.classList.add('is-revealed');
    }

    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(revealOne);
      return;
    }

    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          revealOne(entry.target);
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { revealObs.observe(el); });

    if (window.MutationObserver) {
      var mo = new MutationObserver(function (mutations) {
        mutations.forEach(function (m) {
          m.addedNodes.forEach(function (node) {
            if (node.nodeType !== 1) return;
            if (node.matches && node.matches('[data-reveal]')) {
              revealObs.observe(node);
            }
            if (node.querySelectorAll) {
              node.querySelectorAll('[data-reveal]').forEach(function (el) {
                revealObs.observe(el);
              });
            }
          });
        });
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }

    setTimeout(function () {
      document.querySelectorAll('[data-reveal]:not(.is-revealed)').forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          revealOne(el);
        }
      });
    }, 2500);
  }

  initReveal();

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-drawer-close]')) {
      var drawer = document.getElementById('movieDetailDrawer') || document.getElementById('characterDrawer');
      if (drawer) {
        drawer.classList.remove('is-open');
        drawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    }
  });

})();

