import './main.css';

const html = document.documentElement;
const sunIcon = document.getElementById("sun-icon");
const moonIcon = document.getElementById("moon-icon");
const systemIcon = document.getElementById("system-icon");
const themeToggle = document.getElementById("theme-toggle");
const prefersDarkMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

let currentTheme: string | null = localStorage.getItem("theme") || null;

function updateTheme(): void {
  switch (currentTheme) {
    case "dark":
      html.classList.add("dark");
      break;
    case "light":
      html.classList.remove("dark");
      break;
    default:
      html.classList.toggle("dark", prefersDarkMediaQuery.matches);
      break;
  }
}

function updateIcon(): void {
  sunIcon?.classList.add("hidden");
  moonIcon?.classList.add("hidden");
  systemIcon?.classList.add("hidden");

  switch (currentTheme) {
    case "light":
      sunIcon?.classList.remove("hidden");
      break;
    case "dark":
      moonIcon?.classList.remove("hidden");
      break;
    default:
      systemIcon?.classList.remove("hidden");
  }
}

updateIcon();

prefersDarkMediaQuery.addEventListener("change", (e: MediaQueryListEvent) => {
  currentTheme = e.matches ? "dark" : "light";
  localStorage.removeItem("theme");
  updateTheme();
  updateIcon();
});

themeToggle?.addEventListener("click", () => {
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
  updateTheme();
  updateIcon();
});