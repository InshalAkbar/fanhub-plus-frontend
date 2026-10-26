// event form
(function () {
  const form = document.getElementById('eventForm');
  const coverBox = document.getElementById('coverBox');
  const coverInput = document.getElementById('coverInput');

  if (coverBox && coverInput) {
    coverBox.addEventListener('click', function () {
      coverInput.click();
    });

    coverInput.addEventListener('change', function () {
      const file = this.files[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        alert('File too large. Max 2MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        coverBox.innerHTML = '<img src="' + e.target.result + '" alt="cover">';
        coverBox.classList.add('has-image');
      };
      reader.readAsDataURL(file);
    });
  }

  form?.addEventListener('submit', function (e) {
    // Laravel form 
  });
})();