// settings page — tab switching + form
(function () {
  const tabs = document.querySelectorAll('.settings-tab');
  const panels = document.querySelectorAll('.settings-panel');
  const form = document.getElementById('settingsForm');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('is-active'); });
      panels.forEach(function (p) { p.classList.remove('is-active'); });

      this.classList.add('is-active');
      document.querySelector(`[data-panel="${this.dataset.tab}"]`)?.classList.add('is-active');
    });
  });

  form?.addEventListener('submit', function (e) {
    // Laravel form submission
  });
})();