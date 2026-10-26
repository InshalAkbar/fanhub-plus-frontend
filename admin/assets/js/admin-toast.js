window.fhToast = function (message, type = "info") {
  let container = document.querySelector(".fh-toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "fh-toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `fh-toast fh-toast--${type}`;
  toast.setAttribute("role", "alert");
  toast.innerHTML = `
    <div class="fh-toast__content">${message}</div>
    <button class="fh-toast__close" aria-label="Dismiss">&times;</button>
  `;

  container.appendChild(toast);

  const dismiss = () => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 200);
  };

  toast.querySelector(".fh-toast__close").addEventListener("click", dismiss);
  setTimeout(dismiss, 4000);
};