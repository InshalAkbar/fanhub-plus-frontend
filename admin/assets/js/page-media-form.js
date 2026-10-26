// media form — thumbnail preview + submit
(function () {
  const form = document.getElementById('mediaForm');
  const thumbBox = document.getElementById('thumbBox');
  const thumbInput = document.getElementById('thumbInput');

  if (thumbBox && thumbInput) {
    thumbBox.addEventListener('click', function () {
      thumbInput.click();
    });

    thumbInput.addEventListener('change', function () {
      const file = this.files[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        alert('File too large. Max 2MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        thumbBox.innerHTML = '<img src="' + e.target.result + '" alt="thumbnail">';
        thumbBox.classList.add('has-image');
      };
      reader.readAsDataURL(file);
    });
  }

  form?.addEventListener('submit', function (e) {
    // Laravel form submission
  });
})();