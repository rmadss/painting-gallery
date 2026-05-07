/**
 * timeline.js — Powers the Timeline archive page.
 *
 * Responsibilities:
 *  1. Render the horizontal era-grid (time → X, eras → Y) as primary view
 *  2. Render era sections with painting cards as the alternate (card) view
 *  3. Populate tag pills and medium dropdown from the data
 *  4. Client-side filtering: search query + active tag + medium
 *  5. Preserve filter state in the URL (?q=&tag=&medium=) for shareability
 *
 * Depends on: data/paintings.js (must be loaded first)
 */

// ─── State ────────────────────────────────────────────────────────────────────
const state = {
  query: "",
  activeTag: "",
  activeMedium: "",
  view: "grid", // "grid" | "cards"
};

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const timelineBody  = document.getElementById("timelineBody");
const searchInput   = document.getElementById("searchInput");
const mediumSelect  = document.getElementById("mediumSelect");
const tagFiltersEl  = document.getElementById("tagFilters");
const noResults     = document.getElementById("noResults");
const totalCountEl  = document.getElementById("total-count");
const eraCountEl    = document.getElementById("era-count");

// ─── Init ─────────────────────────────────────────────────────────────────────
function init() {
  const params = new URLSearchParams(window.location.search);
  state.query        = params.get("q")      || "";
  state.activeTag    = params.get("tag")    || "";
  state.activeMedium = params.get("medium") || "";

  totalCountEl.textContent = getAllPaintings().length;
  eraCountEl.textContent   = getEras().length;

  buildMediumDropdown();
  buildTagPills();
  buildTimeline();

  searchInput.value  = state.query;
  mediumSelect.value = state.activeMedium;

  searchInput.addEventListener("input", debounce(onSearchChange, 200));
  mediumSelect.addEventListener("change", onMediumChange);

  // View toggle: grid ↔ cards
  const viewToggle = document.getElementById("viewToggle");
  const iconGrid   = document.getElementById("iconGrid");
  const iconList   = document.getElementById("iconList");
  viewToggle.addEventListener("click", () => {
    state.view = state.view === "grid" ? "cards" : "grid";
    const isCards = state.view === "cards";
    timelineBody.classList.toggle("view-cards", isCards);
    timelineBody.classList.toggle("view-grid",  !isCards);
    // iconList = grid/card icon (visible in timeline mode → click goes to cards)
    // iconGrid = timeline icon (visible in card mode → click goes back to timeline)
    iconList.style.display = isCards ? "none" : "";
    iconGrid.style.display = isCards ? ""     : "none";
    viewToggle.setAttribute("title",      isCards ? "Switch to timeline view" : "Switch to card view");
    viewToggle.setAttribute("aria-label", isCards ? "Switch to timeline view" : "Switch to card view");
    filterPaintings();
  });
}

// ─── Build medium dropdown ────────────────────────────────────────────────────
function buildMediumDropdown() {
  const mediums = getAllMediums();
  mediums.forEach((medium) => {
    const opt = document.createElement("option");
    opt.value = medium;
    opt.textContent = medium;
    if (medium === state.activeMedium) opt.selected = true;
    mediumSelect.appendChild(opt);
  });
}

// ─── Build tag pills ──────────────────────────────────────────────────────────
function buildTagPills() {
  tagFiltersEl.innerHTML = "";
  const allPill = createTagPill("All", state.activeTag === "");
  allPill.addEventListener("click", () => {
    state.activeTag = "";
    updateTagPills();
    updateURL();
    filterPaintings();
  });
  tagFiltersEl.appendChild(allPill);

  getAllTags().forEach((tag) => {
    const pill = createTagPill(tag, tag === state.activeTag);
    pill.addEventListener("click", () => {
      state.activeTag = tag;
      updateTagPills();
      updateURL();
      filterPaintings();
    });
    tagFiltersEl.appendChild(pill);
  });
}

function createTagPill(label, isActive) {
  const btn = document.createElement("button");
  btn.className = "tag-pill" + (isActive ? " active" : "");
  btn.textContent = label;
  btn.setAttribute("type", "button");
  return btn;
}

function updateTagPills() {
  const pills = tagFiltersEl.querySelectorAll(".tag-pill");
  pills.forEach((pill) => {
    const label = pill.textContent;
    const isActive =
      label === "All" ? state.activeTag === "" : label === state.activeTag;
    pill.classList.toggle("active", isActive);
  });
}

// ─── Build timeline ───────────────────────────────────────────────────────────
function buildTimeline() {
  timelineBody.innerHTML = "";
  timelineBody.classList.add("view-grid");

  // ── 1. Horizontal era-grid ────────────────────────────────
  const eras = getEras();

  // Global date bounds (use painting dates, fall back to era start/end)
  const allDates = getAllPaintings()
    .map((p) => p.date)
    .filter(Boolean)
    .map((d) => d.slice(0, 7)); // "YYYY-MM"
  const eraStartDates = eras.map((e) => e.startDate).filter(Boolean);
  const eraEndDates   = eras.map((e) => e.endDate).filter(Boolean);
  const allBounds     = [...allDates, ...eraStartDates, ...eraEndDates].sort();

  const PADDING_MONTHS = 6; // breathing room before first and after last painting
  const globalStart = toMonthNum(allBounds[0]) - PADDING_MONTHS;
  const globalEnd   = toMonthNum(allBounds[allBounds.length - 1]) + PADDING_MONTHS;
  const totalMonths = Math.max(globalEnd - globalStart, 1);

  // Build the ruler (year ticks)
  const startYear = parseInt(allBounds[0]);
  const endYear   = parseInt(allBounds[allBounds.length - 1]);
  let rulerHTML = "";
  for (let y = startYear; y <= endYear + 1; y++) {
    const pct = ((toMonthNum(`${y}-01`) - globalStart) / totalMonths) * 100;
    if (pct < 0 || pct > 102) continue;
    rulerHTML += `<span class="tl-ruler-tick" style="left:${pct.toFixed(2)}%">${y}</span>`;
  }

  const grid = document.createElement("div");
  grid.className = "tl-grid";
  grid.innerHTML = `<div class="tl-ruler">${rulerHTML}</div>`;

  eras.forEach((era) => {
    const row = document.createElement("div");
    row.className = "tl-era-row";
    row.dataset.eraId = era.id;

    // Era bar span
    const barStart = era.startDate ? ((toMonthNum(era.startDate) - globalStart) / totalMonths) * 100 : 0;
    const barEnd   = era.endDate   ? ((toMonthNum(era.endDate)   - globalStart) / totalMonths) * 100 : 100;
    const barWidth = Math.max(barEnd - barStart, 1);

    // Painting dots
    const sorted = getPaintingsByEra(era.id).sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    const dotsHTML = sorted.map((p) => {
      const pct = p.date
        ? ((toMonthNum(p.date.slice(0, 7)) - globalStart) / totalMonths) * 100
        : barStart;
      const thumb = p.thumbnail
        ? getImageUrl(p.thumbnail)
        : "";
      return `
        <a href="painting.html?id=${p.id}"
           class="tl-dot"
           style="left:${pct.toFixed(2)}%"
           data-painting-id="${p.id}"
           data-title="${p.title.toLowerCase()}"
           data-medium="${p.medium.toLowerCase()}"
           data-medium-base="${p.medium.split(" on ")[0].trim()}"
           data-tags="${p.tags.join(",").toLowerCase()}"
           data-description="${(p.description || "").toLowerCase()}"
           data-era-title="${era.title.toLowerCase()}"
           aria-label="${p.title}">
          <span class="tl-dot-inner"></span>
          <span class="tl-tooltip">
            ${thumb ? `<img src="${thumb}" alt="" class="tl-tooltip-thumb" loading="lazy" />` : ""}
            <span class="tl-tooltip-title">${p.title}</span>
            <span class="tl-tooltip-meta">${formatShortDate(p.date)}</span>
          </span>
        </a>`;
    }).join("");

    row.innerHTML = `
      <div class="tl-era-label">
        <span class="tl-era-name">${era.title}</span>
        <span class="tl-era-dates">${formatEraDateRange(era.startDate, era.endDate)}</span>
      </div>
      <div class="tl-era-track">
        <div class="tl-era-bar" style="left:${barStart.toFixed(2)}%;width:${barWidth.toFixed(2)}%"></div>
        ${dotsHTML}
      </div>
    `;
    grid.appendChild(row);
  });

  const gridScroll = document.createElement("div");
  gridScroll.className = "tl-grid-scroll";
  gridScroll.appendChild(grid);
  timelineBody.appendChild(gridScroll);

  // ── 2. Card sections (alternate view) ─────────────────────
  const cardSections = document.createElement("div");
  cardSections.className = "tl-card-sections";
  timelineBody.appendChild(cardSections);

  eras.forEach((era) => {
    const section = document.createElement("section");
    section.className = "era-section";
    section.dataset.eraId = era.id;

    const dateRange     = formatEraDateRange(era.startDate, era.endDate);
    const paintingCount = getPaintingsByEra(era.id).length;

    section.innerHTML = `
      <header class="era-header">
        <button class="era-toggle" aria-expanded="true" aria-controls="era-paintings-${era.id}">
          <div class="era-toggle-main">
            <p class="era-date-range">${dateRange}</p>
            <h2 class="era-title">${era.title}</h2>
          </div>
          <div class="era-toggle-aside">
            <span class="era-painting-count">${paintingCount} painting${paintingCount !== 1 ? "s" : ""}</span>
            <svg class="era-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </button>
        <p class="era-description">${era.description}</p>
        <span class="era-painting-count era-painting-count--collapsed">${paintingCount} painting${paintingCount !== 1 ? "s" : ""}</span>
      </header>
      <div class="era-paintings" id="era-paintings-${era.id}"></div>
    `;

    const toggleBtn = section.querySelector(".era-toggle");
    toggleBtn.addEventListener("click", () => {
      const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
      toggleBtn.setAttribute("aria-expanded", String(!isExpanded));
      section.classList.toggle("era-collapsed", isExpanded);
    });

    cardSections.appendChild(section);

    const grid2 = section.querySelector(`#era-paintings-${era.id}`);
    const sorted = getPaintingsByEra(era.id).sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    sorted.forEach((painting) => {
      grid2.appendChild(buildPaintingCard(painting, era));
    });
  });
}

// ─── Date helpers ─────────────────────────────────────────────────────────────
/** Convert "YYYY-MM" to a monotonic integer (months since year 0). */
function toMonthNum(dateStr) {
  if (!dateStr) return 0;
  const [y, m] = dateStr.split("-").map(Number);
  return y * 12 + (m || 1) - 1;
}

/**
 * Creates a painting card element.
 */
function buildPaintingCard(painting, era) {
  const card = document.createElement("a");
  card.className = "painting-card";
  card.href = `painting.html?id=${painting.id}`;
  card.dataset.paintingId = painting.id;
  card.dataset.title       = painting.title.toLowerCase();
  card.dataset.medium      = painting.medium.toLowerCase();
  card.dataset.description = (painting.description || "").toLowerCase();
  card.dataset.tags        = painting.tags.join(",").toLowerCase();
  card.dataset.eraTitle    = era.title.toLowerCase();
  card.dataset.mediumBase  = painting.medium.split(" on ")[0].trim();

  const thumbSrc = painting.thumbnail
    ? getImageUrl(painting.thumbnail)
    : `https://placehold.co/400x500/2c2820/6e6358?text=${encodeURIComponent(painting.title)}`;

  const formattedDate = formatShortDate(painting.date);

  card.innerHTML = `
    <div class="painting-card-image">
      <img
        src="${thumbSrc}"
        alt="${painting.title} — ${painting.medium}, ${formattedDate}"
        loading="lazy"
        onerror="this.parentElement.innerHTML='<div class=\\'painting-card-placeholder\\'>${encodeURIComponent(painting.title)}</div>'"
      />
    </div>
    <div class="painting-card-info">
      <p class="painting-card-title">${painting.title}</p>
      <p class="painting-card-meta">${painting.medium} · ${formattedDate}</p>
    </div>
  `;
  return card;
}

// ─── Filtering ────────────────────────────────────────────────────────────────
function filterPaintings() {
  const q      = state.query.toLowerCase().trim();
  const tag    = state.activeTag.toLowerCase();
  const medium = state.activeMedium.toLowerCase();

  function matches(dataset) {
    const matchesQuery =
      !q ||
      dataset.title.includes(q) ||
      dataset.medium.includes(q) ||
      (dataset.description || "").includes(q) ||
      dataset.tags.includes(q) ||
      dataset.eraTitle.includes(q);
    const matchesTag    = !tag    || dataset.tags.split(",").some((t) => t.trim() === tag);
    const matchesMedium = !medium || (dataset.mediumBase || "").toLowerCase() === medium;
    return matchesQuery && matchesTag && matchesMedium;
  }

  // ── Grid dots ──
  let visibleDots = 0;
  document.querySelectorAll(".tl-dot").forEach((dot) => {
    const visible = matches(dot.dataset);
    dot.classList.toggle("tl-dot--hidden", !visible);
    if (visible) visibleDots++;
  });

  // Dim era rows where all dots are hidden
  document.querySelectorAll(".tl-era-row").forEach((row) => {
    const anyVisible = [...row.querySelectorAll(".tl-dot")].some(
      (d) => !d.classList.contains("tl-dot--hidden")
    );
    row.classList.toggle("tl-era-row--dimmed", !anyVisible);
  });

  // ── Card sections ──
  let visibleCards = 0;
  document.querySelectorAll(".era-section").forEach((section) => {
    const cards = section.querySelectorAll(".painting-card");
    let visibleInEra = 0;
    cards.forEach((card) => {
      const visible = matches(card.dataset);
      card.classList.toggle("hidden", !visible);
      if (visible) visibleInEra++;
    });
    visibleCards += visibleInEra;
    section.classList.toggle("all-hidden", visibleInEra === 0);
  });

  const total = state.view === "grid" ? visibleDots : visibleCards;
  noResults.classList.toggle("visible", total === 0);
}

// ─── Event handlers ───────────────────────────────────────────────────────────
function onSearchChange() {
  state.query = searchInput.value;
  updateURL();
  filterPaintings();
}

function onMediumChange() {
  state.activeMedium = mediumSelect.value;
  updateURL();
  filterPaintings();
}

// ─── URL state sync ───────────────────────────────────────────────────────────
function updateURL() {
  const params = new URLSearchParams();
  if (state.query)        params.set("q",      state.query);
  if (state.activeTag)    params.set("tag",    state.activeTag);
  if (state.activeMedium) params.set("medium", state.activeMedium);
  const newURL =
    window.location.pathname +
    (params.toString() ? "?" + params.toString() : "");
  history.replaceState(null, "", newURL);
}

// ─── Date formatting ──────────────────────────────────────────────────────────
function formatShortDate(dateStr) {
  if (!dateStr) return "";
  const [year, month] = dateStr.split("-");
  if (!month) return year;
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function formatEraDateRange(startDate, endDate) {
  const start = formatShortDate(startDate);
  const end   = endDate ? formatShortDate(endDate) : "Present";
  return `${start} — ${end}`;
}

// ─── Utility: debounce ────────────────────────────────────────────────────────
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ─── Run ──────────────────────────────────────────────────────────────────────
init();

