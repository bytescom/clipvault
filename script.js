// main.js

const mainContainer = document.querySelector("main");
const toastContainer = document.getElementById("toast-container");

// Function to create link cards
function createLinkCards() {
  links.forEach((link) => {
    const card = document.createElement("div");
    card.className =
      "flex items-center justify-between p-4 rounded-lg border border-gray-700 hover:border-purple-500 transition duration-300 bg-white/5 hover:bg-white/10 backdrop-blur-md";

    card.innerHTML = `
      <a href="${link.url}" target="_blank"
         class="flex-grow mr-3 truncate hover:text-purple-300 transition-colors">
         ${link.text}
      </a>
      <button class="copy-btn flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-700 transition"
              data-text="${link.text}">
        <i class="far fa-copy text-gray-400"></i>
      </button>
    `;

    mainContainer.appendChild(card);
  });
}

// Function to show toast notifications
function showToast(message) {
  const toast = document.createElement("div");
  toast.className =
    "bg-black/80 backdrop-blur-md text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-down";
  toast.innerHTML = `<i class="fas fa-check-circle text-white"></i><span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("opacity-0", "-translate-y-2", "transition");
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// Function to set up copy button behavior
function setupCopyButtons() {
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const textToCopy = this.getAttribute("data-text");

      navigator.clipboard.writeText(textToCopy).then(() => {
        const icon = this.querySelector("i");

        // Change icon: regular -> solid black with opacity + blur
        icon.classList.remove("far", "text-gray-400");
        icon.classList.add("fas", "text-black/80", "drop-shadow-md");

        // Show toast
        showToast(`Copied: ${textToCopy}`);

        // Reset icon after 1.5s
        setTimeout(() => {
          icon.classList.remove("fas", "text-black/80", "drop-shadow-md");
          icon.classList.add("far", "text-gray-400");
        }, 1500);
      });
    });
  });
}

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  createLinkCards();
  setupCopyButtons();
});
