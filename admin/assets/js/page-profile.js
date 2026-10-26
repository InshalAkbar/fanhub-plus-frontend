// profile page 
(function () {
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('is-active'); });
      panels.forEach(function (p) { p.classList.remove('is-active'); });

      this.classList.add('is-active');
      document.querySelector(`[data-panel="${this.dataset.tab}"]`)?.classList.add('is-active');
    });
  });

  document.getElementById('infoForm')?.addEventListener('submit', function (e) {

  });

  document.getElementById('passwordForm')?.addEventListener('submit', function (e) {
    const newPass = document.getElementById('newpass').value;
    const confirm = document.getElementById('confirm').value;

    if (newPass !== confirm) {
      alert('Passwords do not match.');
      return;
    }

    if (newPass.length < 8) {
      alert('Password must be at least 8 characters.');
      return;
    }


  });

  document.getElementById('changeAvatar')?.addEventListener('click', function () {
    // backend handoff: file picker + upload
    console.log('change avatar');
  });
})();