import './style.css';

(() => {
  const html = document.documentElement;
  const prefersDarkMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const prefersDark = prefersDarkMediaQuery.matches;

  let currentTheme = localStorage.getItem("theme") || null;

  function applyTheme(theme) {
    switch (theme) {
      case "dark":
        html.classList.add("dark");
        break;
      case "light":
        html.classList.remove("dark");
        break;
      default:
        html.classList.toggle("dark", prefersDark);
        break;
    }
  }

  applyTheme(currentTheme);

  document.addEventListener("DOMContentLoaded", () => {
    // Email obfuscation - decode and set email link
    (() => {
      const emailLink = document.getElementById("email-link");

      if (emailLink) {
        emailLink.textContent = atob(emailLink.dataset.email);
        emailLink.href = `mailto:${emailLink.textContent}`;
      }
    })();

    // Theme toggle - cycle through light, dark, auto
    (() => {
      const sunIcon = document.getElementById("sun-icon");
      const moonIcon = document.getElementById("moon-icon");
      const systemIcon = document.getElementById("system-icon");
      const themeToggle = document.getElementById("theme-toggle");

      function updateIcon() {
        sunIcon.classList.add("hidden");
        moonIcon.classList.add("hidden");
        systemIcon.classList.add("hidden");

        switch (currentTheme) {
          case "light":
            sunIcon.classList.remove("hidden");
            break;
          case "dark":
            moonIcon.classList.remove("hidden");
            break;
          default:
            systemIcon.classList.remove("hidden");
        }
      }

      updateIcon();

      prefersDarkMediaQuery.addEventListener("change", (e) => {
        currentTheme = e.matches ? "dark" : "light";
        localStorage.removeItem("theme");
        applyTheme(currentTheme);
        updateIcon();
      });

      themeToggle.addEventListener("click", () => {
        // Cycle: light -> dark -> auto -> light
        switch (currentTheme) {
          case "light":
            currentTheme = "dark";
            break;
          case "dark":
            currentTheme = null;
            break;
          default:
            currentTheme = "light";
            break;
        }

        currentTheme ? localStorage.setItem("theme", currentTheme) : localStorage.removeItem("theme");
        applyTheme(currentTheme);
        updateIcon();
      });
    })();
  });
})();
