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
const isMobile = window.innerWidth < 640;
const state = {
  query: "",
  activeTag: "",
  activeMedium: "",
  view: isMobile ? "cards" : "grid", // default to cards on mobile
};

// ─── Zoom / Pan state ─────────────────────────────────────────────────────────
// Painting dots use left:X% so widening the track repositions them automatically.
// We only control the pixel width of the track area.
const TL_LABEL_W   = 180;   // must match .tl-era-label width in CSS
const TL_TRACK_MIN = 600;
const TL_TRACK_MAX = 14000;
const TL_TRACK_DEF = 1800;
let   tlTrackPx    = TL_TRACK_DEF;

// Filled by buildTimeline; used by rebuildRuler
const tlBounds = { globalStart: 0, globalEnd: 0, totalMonths: 1 };

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

  // Jump-to buttons (only visible in grid view)
  const btnFirst  = document.getElementById("jumpFirst");
  const btnLatest = document.getElementById("jumpLatest");
  if (btnFirst)  btnFirst.addEventListener("click",  jumpToFirst);
  if (btnLatest) btnLatest.addEventListener("click", jumpToLatest);

  // View toggle: grid ↔ cards
  const viewToggle = document.getElementById("viewToggle");
  const iconGrid   = document.getElementById("iconGrid");
  const iconList   = document.getElementById("iconList");

  // Apply the initial view state (respects mobile default)
  function applyViewState() {
    const isCards = state.view === "cards";
    timelineBody.classList.toggle("view-cards", isCards);
    timelineBody.classList.toggle("view-grid",  !isCards);
    iconList.style.display = isCards ? "none" : "";
    iconGrid.style.display = isCards ? ""     : "none";
    viewToggle.setAttribute("title",      isCards ? "Switch to timeline view" : "Switch to card view");
    viewToggle.setAttribute("aria-label", isCards ? "Switch to timeline view" : "Switch to card view");
    // Show jump controls only in grid view
    const jumpControls = document.getElementById("jumpControls");
    if (jumpControls) jumpControls.style.display = isCards ? "none" : "";
  }
  applyViewState();

  viewToggle.addEventListener("click", () => {
    state.view = state.view === "grid" ? "cards" : "grid";
    applyViewState();
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

  // Store for dynamic ruler (rebuildRuler uses these)
  tlBounds.globalStart = globalStart;
  tlBounds.globalEnd   = globalEnd;
  tlBounds.totalMonths = totalMonths;

  const grid = document.createElement("div");
  grid.className = "tl-grid";
  grid.innerHTML = `<div class="tl-ruler"></div>`; // populated by rebuildRuler()

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

    // Group paintings by month so same-date dots can be staggered vertically
    const dateGroups = {};
    sorted.forEach((p) => {
      const key = p.date ? p.date.slice(0, 7) : "__unknown__";
      if (!dateGroups[key]) dateGroups[key] = [];
      dateGroups[key].push(p);
    });

    const STACK_STEP = 14; // px between stacked dots within the same month

    const dotsHTML = sorted.map((p) => {
      const pct = p.date
        ? ((toMonthNum(p.date.slice(0, 7)) - globalStart) / totalMonths) * 100
        : barStart;
      const thumb = p.thumbnail
        ? getImageUrl(p.thumbnail)
        : "";

      // Vertical stagger for same-date collisions
      const dateKey   = p.date ? p.date.slice(0, 7) : "__unknown__";
      const group     = dateGroups[dateKey];
      const idx       = group.indexOf(p);
      const groupSize = group.length;
      const vOffset   = (idx - (groupSize - 1) / 2) * STACK_STEP; // px from row center
      const topStyle  = vOffset === 0 ? "50%" : `calc(50% + ${vOffset}px)`;

      return `
        <a href="painting.html?id=${p.id}"
           class="tl-dot"
           style="left:${pct.toFixed(2)}%;top:${topStyle}"
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

  applyGridWidth();           // sets initial px width + builds ruler
  attachZoomPanHandlers(gridScroll);  // zoom + drag-to-pan + touch pinch

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

// ─── Zoom / Pan functions ─────────────────────────────────────────────────────

/**
 * Applies the current tlTrackPx width to the DOM grid and rebuilds ruler ticks.
 */
function applyGridWidth() {
  const grid = document.querySelector(".tl-grid");
  if (!grid) return;
  grid.style.width = (TL_LABEL_W + tlTrackPx) + "px";
  rebuildRuler();
}

/**
 * Rebuilds the ruler tick marks with density appropriate for the current zoom.
 * At low zoom: yearly ticks. At high zoom: monthly ticks.
 */
function rebuildRuler() {
  const ruler = document.querySelector(".tl-ruler");
  if (!ruler) return;
  ruler.style.minWidth = tlTrackPx + "px";

  const pxPerMonth = tlTrackPx / tlBounds.totalMonths;
  let tickInterval; // months between ticks
  if      (pxPerMonth >= 60) tickInterval = 1;
  else if (pxPerMonth >= 25) tickInterval = 3;
  else if (pxPerMonth >= 12) tickInterval = 6;
  else if (pxPerMonth >= 5)  tickInterval = 12;
  else if (pxPerMonth >= 2)  tickInterval = 24;
  else                        tickInterval = 60;

  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun",
                  "Jul","Aug","Sep","Oct","Nov","Dec"];

  // Align first tick to a calendar boundary
  const firstTick = Math.ceil(tlBounds.globalStart / tickInterval) * tickInterval;
  let html = "";

  for (let m = firstTick; m <= tlBounds.globalEnd + tickInterval; m += tickInterval) {
    const pct = ((m - tlBounds.globalStart) / tlBounds.totalMonths) * 100;
    if (pct < -1 || pct > 103) continue;
    const year  = Math.floor(m / 12);
    const month = m % 12; // 0 = Jan
    let label;
    if      (tickInterval >= 12) label = String(year);
    else if (tickInterval >= 3)  label = `${MONTHS[month]} ${year}`;
    else label = month === 0 ? `Jan ${year}` : MONTHS[month];
    html += `<span class="tl-ruler-tick" style="left:${pct.toFixed(2)}%">${label}</span>`;
  }
  ruler.innerHTML = html;
}

/**
 * Attaches zoom (Ctrl+wheel), drag-to-pan, and touch-pinch-zoom to the
 * horizontal scroll container.
 */
function attachZoomPanHandlers(container) {
  // ── Ctrl / Cmd + wheel  →  zoom ───────────────────────────
  let rafPending = false;
  container.addEventListener("wheel", (e) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      const rect      = container.getBoundingClientRect();
      const cursorX   = e.clientX - rect.left;
      // Fraction of the track that is to the left of the cursor
      const scrollFrac = Math.max(0, Math.min(1,
        (container.scrollLeft + cursorX - TL_LABEL_W) / tlTrackPx
      ));
      const factor   = e.deltaY > 0 ? 1.14 : 1 / 1.14;
      const newTrack = Math.max(TL_TRACK_MIN, Math.min(TL_TRACK_MAX, tlTrackPx * factor));
      if (newTrack === tlTrackPx) return;
      const delta = newTrack - tlTrackPx;
      tlTrackPx   = newTrack;
      applyGridWidth();
      container.scrollLeft += delta * scrollFrac;
    });
  }, { passive: false });

  // ── Drag to pan ────────────────────────────────────────────
  let isDragging     = false;
  let dragStartX     = 0;
  let dragScrollStart = 0;

  container.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    // Don't hijack clicks on dots or tooltips
    if (e.target.closest(".tl-dot, .tl-tooltip")) return;
    isDragging      = true;
    dragStartX      = e.clientX;
    dragScrollStart = container.scrollLeft;
    container.classList.add("panning");
    e.preventDefault();
  });
  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    container.scrollLeft = dragScrollStart - (e.clientX - dragStartX);
  });
  document.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    container.classList.remove("panning");
  });

  // ── Touch pinch zoom ───────────────────────────────────────
  let pinchDist0      = null;
  let pinchScrollFrac = 0;

  container.addEventListener("touchstart", (e) => {
    if (e.touches.length !== 2) return;
    pinchDist0 = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
    const rect  = container.getBoundingClientRect();
    pinchScrollFrac = Math.max(0, Math.min(1,
      (container.scrollLeft + midX - rect.left - TL_LABEL_W) / tlTrackPx
    ));
  }, { passive: true });

  container.addEventListener("touchmove", (e) => {
    if (e.touches.length !== 2 || pinchDist0 === null) return;
    e.preventDefault();
    const dist  = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    const factor   = dist / pinchDist0;
    pinchDist0     = dist;
    const newTrack = Math.max(TL_TRACK_MIN, Math.min(TL_TRACK_MAX, tlTrackPx * factor));
    const delta    = newTrack - tlTrackPx;
    tlTrackPx      = newTrack;
    applyGridWidth();
    container.scrollLeft += delta * pinchScrollFrac;
  }, { passive: false });

  container.addEventListener("touchend",    () => { pinchDist0 = null; });
  container.addEventListener("touchcancel", () => { pinchDist0 = null; });
}

/** Scroll the grid to the start (first painting). */
function jumpToFirst() {
  const gs = document.querySelector(".tl-grid-scroll");
  if (gs) gs.scrollTo({ left: 0, behavior: "smooth" });
}

/** Scroll the grid to the end (latest painting). */
function jumpToLatest() {
  const gs = document.querySelector(".tl-grid-scroll");
  if (gs) gs.scrollTo({ left: gs.scrollWidth, behavior: "smooth" });
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

