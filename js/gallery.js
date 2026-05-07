/**
 * gallery.js — Powers the Gallery browse page.
 *
 * Features:
 *  - Card grid view (default) and table view — toggle between them
 *  - Search by title, medium, description, tags, era
 *  - Filter by medium, era, and tag pills
 *  - Sortable columns in table view (title, date, medium)
 *  - Filter state synced to URL (?q=&tag=&medium=&era=&view=)
 *  - Painting count updates live as filters change
 *
 * Depends on: data/paintings.js (must be loaded first)
 */

// ─── State ────────────────────────────────────────────────
const state = {
  query:        "",
  activeTag:    "",
  activeMedium: "",
  activeEra:    "",
  view:         "card",      // "card" | "table"
  sortCol:      "date",      // column key for table sort
  sortDir:      "asc",       // "asc" | "desc"
};

// ─── DOM refs ─────────────────────────────────────────────
const cardGrid     = document.getElementById("cardGrid");
const tableView    = document.getElementById("tableView");
const tableBody    = document.getElementById("tableBody");
const searchInput  = document.getElementById("searchInput");
const mediumSelect = document.getElementById("mediumSelect");
const eraSelect    = document.getElementById("eraSelect");
const tagFiltersEl = document.getElementById("tagFilters");
const noResults    = document.getElementById("noResults");
const totalCountEl = document.getElementById("total-count");
const visibleCountEl = document.getElementById("visible-count");
const btnCard      = document.getElementById("btnCard");
const btnTable     = document.getElementById("btnTable");

// ─── All paintings (flat, with eraId + eraTitle) ──────────
const ALL_PAINTINGS = getAllPaintings();

// ─── Init ─────────────────────────────────────────────────
function init() {
  const params = new URLSearchParams(window.location.search);
  state.query        = params.get("q")      || "";
  state.activeTag    = params.get("tag")    || "";
  state.activeMedium = params.get("medium") || "";
  state.activeEra    = params.get("era")    || "";
  state.view         = params.get("view") === "table" ? "table" : "card";

  totalCountEl.textContent = ALL_PAINTINGS.length;

  buildMediumDropdown();
  buildEraDropdown();
  buildTagPills();

  // Restore input values
  searchInput.value    = state.query;
  mediumSelect.value   = state.activeMedium;
  eraSelect.value      = state.activeEra;

  // Set initial view
  applyViewToggle(state.view, false);

  // Render everything
  renderAll();

  // Event listeners
  searchInput.addEventListener("input", debounce(onFilterChange, 200));
  mediumSelect.addEventListener("change", onFilterChange);
  eraSelect.addEventListener("change", onEraChange);
  btnCard.addEventListener("click",  () => applyViewToggle("card"));
  btnTable.addEventListener("click", () => applyViewToggle("table"));

  // Sortable column headers
  document.querySelectorAll(".sortable").forEach((th) => {
    th.addEventListener("click", () => onSortClick(th.dataset.col));
  });
}

// ─── Dropdowns ────────────────────────────────────────────
function buildMediumDropdown() {
  getAllMediums().forEach((m) => {
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = m;
    mediumSelect.appendChild(opt);
  });
}

function buildEraDropdown() {
  getEras().forEach((era) => {
    const opt = document.createElement("option");
    opt.value = era.id;
    opt.textContent = era.title;
    eraSelect.appendChild(opt);
  });
}

// ─── Tag pills ────────────────────────────────────────────
function buildTagPills() {
  tagFiltersEl.innerHTML = "";

  const allPill = createTagPill("All", state.activeTag === "");
  allPill.addEventListener("click", () => setTag(""));
  tagFiltersEl.appendChild(allPill);

  getAllTags().forEach((tag) => {
    const pill = createTagPill(tag, tag === state.activeTag);
    pill.addEventListener("click", () => setTag(state.activeTag === tag ? "" : tag));
    tagFiltersEl.appendChild(pill);
  });
}

function createTagPill(label, isActive) {
  const btn = document.createElement("button");
  btn.className = "tag-pill" + (isActive ? " active" : "");
  btn.textContent = label;
  btn.type = "button";
  return btn;
}

function setTag(tag) {
  state.activeTag = tag;
  tagFiltersEl.querySelectorAll(".tag-pill").forEach((pill) => {
    const isActive = pill.textContent === "All" ? tag === "" : pill.textContent === tag;
    pill.classList.toggle("active", isActive);
  });
  updateURL();
  renderAll();
}

// ─── Event handlers ───────────────────────────────────────
function onFilterChange() {
  state.query        = searchInput.value;
  state.activeMedium = mediumSelect.value;
  updateURL();
  renderAll();
}

function onEraChange() {
  state.activeEra = eraSelect.value;
  updateURL();
  renderAll();
}

// ─── Filtering logic ──────────────────────────────────────
function getFilteredPaintings() {
  const q      = state.query.toLowerCase().trim();
  const tag    = state.activeTag.toLowerCase();
  const medium = state.activeMedium.toLowerCase();
  const era    = state.activeEra;

  return ALL_PAINTINGS.filter((p) => {
    const matchesQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.medium.toLowerCase().includes(q) ||
      (p.description || "").toLowerCase().includes(q) ||
      p.tags.join(",").toLowerCase().includes(q) ||
      p.eraTitle.toLowerCase().includes(q);

    const matchesTag    = !tag    || p.tags.map(t => t.toLowerCase()).includes(tag);
    const matchesMedium = !medium || p.medium.split(" on ")[0].trim().toLowerCase() === medium;
    const matchesEra    = !era    || p.eraId === era;

    return matchesQuery && matchesTag && matchesMedium && matchesEra;
  });
}

// ─── Render dispatcher ────────────────────────────────────
function renderAll() {
  const filtered = getFilteredPaintings();
  visibleCountEl.textContent = filtered.length;
  noResults.classList.toggle("visible", filtered.length === 0);

  if (state.view === "card") {
    renderCards(filtered);
    tableView.style.display = "none";
    cardGrid.style.display  = "";
  } else {
    renderTable(filtered);
    cardGrid.style.display  = "none";
    tableView.style.display = "";
  }
}

// ─── Card view ────────────────────────────────────────────
function renderCards(paintings) {
  cardGrid.innerHTML = "";
  paintings.forEach((p) => {
    const thumbSrc = p.thumbnail
      ? getImageUrl(p.thumbnail)
      : `https://placehold.co/400x500/2c2820/6e6358?text=${encodeURIComponent(p.title)}`;

    const card = document.createElement("a");
    card.className = "painting-card fade-up";
    card.href = `painting.html?id=${p.id}`;
    card.innerHTML = `
      <div class="painting-card-image">
        <img
          src="${thumbSrc}"
          alt="${p.title}"
          loading="lazy"
          onerror="this.parentElement.innerHTML='<div class=\\'painting-card-placeholder\\'>${encodeURIComponent(p.title)}</div>'"
        />
      </div>
      <div class="painting-card-info">
        <p class="painting-card-title">${p.title}</p>
        <p class="painting-card-meta">${p.medium} · ${formatShortDate(p.date)}</p>
        <p class="painting-card-meta" style="margin-top:2px; color: var(--accent); opacity:0.7;">${p.eraTitle}</p>
      </div>
    `;
    cardGrid.appendChild(card);
  });
}

// ─── Table view ───────────────────────────────────────────
function renderTable(paintings) {
  // Sort
  const sorted = [...paintings].sort((a, b) => {
    let valA, valB;
    if (state.sortCol === "title")  { valA = a.title;  valB = b.title; }
    if (state.sortCol === "date")   { valA = a.date;   valB = b.date; }
    if (state.sortCol === "medium") { valA = a.medium; valB = b.medium; }

    if (valA < valB) return state.sortDir === "asc" ? -1 : 1;
    if (valA > valB) return state.sortDir === "asc" ?  1 : -1;
    return 0;
  });

  // Update sort indicators
  document.querySelectorAll(".sortable").forEach((th) => {
    const icon = th.querySelector(".sort-icon");
    if (th.dataset.col === state.sortCol) {
      icon.textContent = state.sortDir === "asc" ? "↑" : "↓";
      th.classList.add("sorted");
    } else {
      icon.textContent = "↕";
      th.classList.remove("sorted");
    }
  });

  tableBody.innerHTML = "";
  sorted.forEach((p) => {
    const thumbSrc = p.thumbnail
      ? getImageUrl(p.thumbnail)
      : `https://placehold.co/80x100/2c2820/6e6358?text=—`;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="col-thumb">
        <a href="painting.html?id=${p.id}" class="table-thumb-link">
          <img
            src="${thumbSrc}"
            alt="${p.title}"
            loading="lazy"
            onerror="this.style.display='none'"
          />
        </a>
      </td>
      <td>
        <a href="painting.html?id=${p.id}" class="table-title-link">
          ${p.title}
        </a>
        <div class="table-tags">
          ${p.tags.slice(0, 3).map(t => `<span class="painting-tag">${t}</span>`).join("")}
        </div>
      </td>
      <td class="table-date">${formatShortDate(p.date)}</td>
      <td class="col-medium table-meta">${p.medium}</td>
      <td class="col-dims table-meta">${p.dimensions || "—"}</td>
      <td class="col-era">
        <a href="timeline.html" class="table-era-link">${p.eraTitle}</a>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

// ─── Sort ────────────────────────────────────────────────
function onSortClick(col) {
  if (state.sortCol === col) {
    state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
  } else {
    state.sortCol = col;
    state.sortDir = "asc";
  }
  renderAll();
}

// ─── View toggle ─────────────────────────────────────────
function applyViewToggle(view, doRender = true) {
  state.view = view;
  btnCard.classList.toggle("active",  view === "card");
  btnTable.classList.toggle("active", view === "table");
  btnCard.setAttribute("aria-pressed",  String(view === "card"));
  btnTable.setAttribute("aria-pressed", String(view === "table"));
  updateURL();
  if (doRender) renderAll();
}

// ─── URL state sync ───────────────────────────────────────
function updateURL() {
  const params = new URLSearchParams();
  if (state.query)        params.set("q",      state.query);
  if (state.activeTag)    params.set("tag",    state.activeTag);
  if (state.activeMedium) params.set("medium", state.activeMedium);
  if (state.activeEra)    params.set("era",    state.activeEra);
  if (state.view !== "card") params.set("view", state.view);

  history.replaceState(
    null, "",
    window.location.pathname + (params.toString() ? "?" + params.toString() : "")
  );
}

// ─── Date formatting ─────────────────────────────────────
function formatShortDate(dateStr) {
  if (!dateStr) return "—";
  const [year, month] = dateStr.split("-");
  if (!month) return year;
  const d = new Date(parseInt(year), parseInt(month) - 1, 1);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

// ─── Utility: debounce ───────────────────────────────────
function debounce(fn, delay) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ─── Run ────────────────────────────────────────────────
init();
