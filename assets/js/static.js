/* Shared behavior for static info pages: About, Contact, Help, Media, Privacy, Terms */
document.addEventListener('DOMContentLoaded', function () {

  // FAQ accordion (Help Center)
  document.querySelectorAll('.fh-static__faq-item').forEach(function (item) {
    var q = item.querySelector('.fh-static__faq-q');
    if (!q) return;
    q.addEventListener('click', function () {
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.fh-static__faq-item.open').forEach(function (other) {
        if (other !== item) other.classList.remove('open');
      });
      item.classList.toggle('open', !wasOpen);
    });
  });

  // Contact form (client-side only — no backend wired up)
  var contactForm = document.getElementById('fhContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = document.getElementById('fhContactNote');
      if (note) {
        note.classList.add('show');
        note.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      contactForm.reset();
    });
  }
});
