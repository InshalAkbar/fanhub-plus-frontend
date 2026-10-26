(() => {
  'use strict';

  const $ = (s) => document.querySelector(s);
  const REDIRECT_URL = 'login.html';
  const DURATION = 3;

  const countdownEl = $('#fhLogoutCountdown');
  const barEl = $('#fhLogoutBar');
  let remaining = DURATION;
  let timer = null;
  let loggedOut = false;

  // Remove old client-side profile data immediately.
  try {
    localStorage.removeItem('fanhub-user');
    localStorage.removeItem('fanhub-profile');
    localStorage.removeItem('fanhub-avatar');
  } catch (e) {}

  async function performLogout() {
    try {
      if (window.FHApi && typeof window.FHApi.post === 'function') {
        await window.FHApi.post('/frontend/logout', {});
      } else {
        const csrfResponse = await fetch('/frontend/csrf', {
          credentials: 'same-origin',
          headers: { 'Accept': 'application/json' }
        });
        const csrfData = await csrfResponse.json();

        await fetch('/frontend/logout', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfData.token
          },
          body: '{}'
        });
      }
      loggedOut = true;
    } catch (error) {
      // Even if the network request fails, never pretend the user is authenticated.
      // The protected Laravel routes will still require a valid session.
      loggedOut = false;
    }
  }

  function redirectToLogin() {
    window.location.replace(REDIRECT_URL);
  }

  performLogout();

  if (barEl) {
    requestAnimationFrame(() => {
      barEl.style.width = '100%';
    });
  }

  function tick() {
    remaining -= 1;
    if (countdownEl) countdownEl.textContent = Math.max(0, remaining);

    if (remaining <= 0) {
      clearInterval(timer);
      redirectToLogin();
    }
  }

  timer = setInterval(tick, 1000);

  // Clicking Sign In Again should stop the automatic redirect.
  document.querySelectorAll('.fh-logout__btn').forEach((btn) => {
    btn.addEventListener('click', () => clearInterval(timer));
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(timer);
    } else if (remaining > 0) {
      clearInterval(timer);
      timer = setInterval(tick, 1000);
    }
  });
})();
