// character 
(function () {
  const form = document.getElementById('characterForm');
  const imageBox = document.getElementById('imageBox');
  const imageInput = document.getElementById('imageInput');

  if (imageBox && imageInput) {
    imageBox.addEventListener('click', function () {
      imageInput.click();
    });

    imageInput.addEventListener('change', function () {
      const file = this.files[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        alert('File too large. Max 2MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        imageBox.innerHTML = '<img src="' + e.target.result + '" alt="character">';
        imageBox.classList.add('has-image');
      };
      reader.readAsDataURL(file);
    });
  }

  form?.addEventListener('submit', function (e) {
    // Laravel form submission
  });
})();