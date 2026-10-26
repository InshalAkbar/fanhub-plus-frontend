(function () {
  'use strict';

  // Avoid double injection
  if (document.getElementById('fhBotWidget')) return;

  // Hide on the chatbot page itself
  var currentPath = (window.location.pathname.split('/').pop() || '').toLowerCase();
  if (currentPath === 'bot.html' || currentPath === 'chatbot.html') return;

  var BOT_URL = 'bot.html';

  function inject() {
    if (document.getElementById('fhBotWidget')) return;

    var widget = document.createElement('div');
    widget.className = 'fh-bot-widget';
    widget.id = 'fhBotWidget';
    widget.setAttribute('role', 'complementary');
    widget.setAttribute('aria-label', 'AI Assistant');

    widget.innerHTML =
      '<span class="fh-bot-widget__label" aria-hidden="true">Ask <strong>Fan Hub AI</strong></span>' +
      '<button type="button" class="fh-bot-widget__btn" id="fhBotWidgetBtn" ' +
              'aria-label="Open Fan Hub AI Assistant" title="Ask Fan Hub AI">' +
        '<i class="fas fa-comment-dots" aria-hidden="true"></i>' +
        '<span class="fh-bot-widget__dot" aria-hidden="true"></span>' +
      '</button>';

    document.body.appendChild(widget);

    var btn = document.getElementById('fhBotWidgetBtn');
    if (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = BOT_URL;
      });

      // Keyboard support
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.location.href = BOT_URL;
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();