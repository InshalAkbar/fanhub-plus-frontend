// article form 
(function () {
  const titleInput = document.getElementById('title');
  const slugInput = document.getElementById('slug');
  const form = document.getElementById('articleForm');
  const coverBox = document.getElementById('coverBox');
  const coverInput = document.getElementById('coverInput');


  if (titleInput && slugInput) {
    titleInput.addEventListener('input', function () {
      if (!slugInput.dataset.touched) {
        slugInput.value = this.value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
      }
    });

    slugInput.addEventListener('input', function () {
      this.dataset.touched = '1';
    });
  }

  // cover upload
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