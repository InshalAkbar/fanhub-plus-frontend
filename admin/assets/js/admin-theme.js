// dark / light 
(function () {
  const root = document.documentElement;
  const saved = localStorage.getItem('fh-theme') || 'dark';
  root.setAttribute('data-theme', saved);

  document.addEventListener('click', function (e) {
    const btn = e.target.closest('#themeToggle');
    if (!btn) return;

    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';

    root.setAttribute('data-theme', next);
    localStorage.setItem('fh-theme', next);
    updateIcon(next);
  });

  function updateIcon(theme) {
    const icon = document.querySelector('[data-theme-icon]');
    if (!icon) return;
    icon.className = theme === 'dark'
      ? 'fa-regular fa-moon'
      : 'fa-regular fa-sun';
  }

  updateIcon(saved);
})();