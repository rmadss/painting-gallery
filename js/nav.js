/**
 * nav.js — Injects the shared navigation bar into every page.
 *
 * Each HTML page has a <div id="navbar"></div> placeholder.
 * This script fills it and marks the current page's link as active.
 * It also handles the dark/light mode toggle, persisting the
 * user's preference in localStorage.
 *
 * HOW TO ADD A NEW PAGE TO THE NAV:
 *   Add a new { href, label } object to the NAV_LINKS array below.
 */

const NAV_LINKS = [
  { href: "index.html",    label: "Home" },
  { href: "about.html",   label: "About" },
  { href: "gallery.html",  label: "Gallery" },
  { href: "timeline.html", label: "Timeline" },
];

// ─── Theme ────────────────────────────────────────────────
// Apply saved theme immediately (before paint) to avoid flash
// Default is light; dark is only applied if explicitly saved.
(function applyStoredTheme() {
  if (localStorage.getItem("theme") !== "dark") {
    document.documentElement.classList.add("light");
  }
})();

function isDarkMode() {
  return !document.documentElement.classList.contains("light");
}

function setTheme(light) {
  document.documentElement.classList.toggle("light", light);
  localStorage.setItem("theme", light ? "light" : "dark");
  // Update all toggle button icons on the page
  document.querySelectorAll(".theme-toggle").forEach(updateToggleIcon);
}

function updateToggleIcon(btn) {
  const light = !isDarkMode();
  // Sun icon = currently dark → click to go light
  // Moon icon = currently light → click to go dark
  btn.setAttribute("aria-label", isDarkMode() ? "Switch to light mode" : "Switch to dark mode");
  btn.innerHTML = isDarkMode()
    ? /* sun icon */`<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="4"/>
        <line x1="12" y1="2"  x2="12" y2="5"/>
        <line x1="12" y1="19" x2="12" y2="22"/>
        <line x1="4.22" y1="4.22"  x2="6.34" y2="6.34"/>
        <line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
        <line x1="2"  y1="12" x2="5"  y2="12"/>
        <line x1="19" y1="12" x2="22" y2="12"/>
        <line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/>
        <line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/>
      </svg>`
    : /* moon icon */`<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>`;
}

// ─── Nav injection ────────────────────────────────────────
(function initNav() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  const linksHTML = NAV_LINKS.map(({ href, label }) => {
    const isActive = currentPage === href ? ' class="active"' : "";
    return `<li><a href="${href}"${isActive}>${label}</a></li>`;
  }).join("\n");

  navbar.innerHTML = `
    <nav class="nav-inner">
      <a href="index.html" class="nav-logo">The rmadss Gallery</a>

      <div style="display:flex; align-items:center; gap:0.75rem;">
        <!-- Theme toggle -->
        <button class="theme-toggle nav-icon-btn" type="button" title="Toggle light/dark mode"></button>

        <!-- Mobile menu toggle -->
        <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
            <line x1="3" y1="6"  x2="21" y2="6"  />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      <ul class="nav-links" id="navLinks">
        ${linksHTML}
      </ul>
    </nav>
  `;

  // Set correct icon on load
  navbar.querySelectorAll(".theme-toggle").forEach(updateToggleIcon);

  // Theme toggle click
  navbar.querySelector(".theme-toggle").addEventListener("click", () => {
    setTheme(isDarkMode()); // if currently dark → go light, and vice versa
  });

  // Mobile toggle
  document.getElementById("navToggle").addEventListener("click", () => {
    document.getElementById("navLinks").classList.toggle("open");
  });

  // Close nav when a link is clicked on mobile
  navbar.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      document.getElementById("navLinks").classList.remove("open");
    });
  });
})();
