// sidebar
(function () {
  const body = document.body;
  const toggleBtn = document.getElementById('sidebarToggle');
  const overlay = document.getElementById('sidebarOverlay');

  function openDrawer() { body.classList.add('sidebar-open'); }
  function closeDrawer() { body.classList.remove('sidebar-open'); }

  toggleBtn?.addEventListener('click', function () {
    if (body.classList.contains('sidebar-open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  overlay?.addEventListener('click', closeDrawer);

  document.querySelectorAll('.nav-item').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 1024) closeDrawer();
    });
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 1024) closeDrawer();
  });
})();