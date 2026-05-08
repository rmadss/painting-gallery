/**
 * painting.js — Powers the individual painting detail page.
 *
 * Reads ?id=<painting-id> from the URL, looks up the painting
 * in PAINTINGS_DATA, and renders the full detail view.
 *
 * Also updates <title> and meta description for better shareability.
 *
 * Depends on: data/paintings.js (must be loaded first)
 */

(function initPaintingDetail() {
  const container = document.getElementById("paintingDetail");

  // ── Get painting ID from URL ─────────────────────────────
  const params     = new URLSearchParams(window.location.search);
  const paintingId = params.get("id");

  if (!paintingId) {
    renderError("No painting specified.", container);
    return;
  }

  // ── Look up painting ─────────────────────────────────────
  const painting = getPainting(paintingId);

  if (!painting) {
    renderError(`Painting "${paintingId}" not found.`, container);
    return;
  }

  // ── Update page <title> and meta ─────────────────────────
  document.title = `${painting.title} — The rmadss Gallery`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute(
      "content",
      `${painting.title}, ${painting.medium}, ${painting.date}. ${painting.description || ""}`
    );
  }

  // ── Render ───────────────────────────────────────────────
  const formattedDate = formatDate(painting.date);

  // Full image: use placeholder if no real image yet
  const imageSrc = painting.image
    ? getImageUrl(painting.image)
    : `https://placehold.co/900x1100/242019/a89880?text=${encodeURIComponent(painting.title)}`;

  // Build tags HTML
  const tagsHTML = painting.tags
    .map((tag) => `<span class="painting-tag">${tag}</span>`)
    .join("");

  // "Back to era" link preserves tag/search context in the timeline
  const backHref = `timeline.html`;

  container.innerHTML = `
    <a href="${backHref}" class="back-link fade-up">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      Back to timeline
    </a>

    <div class="painting-detail-layout fade-up fade-up-delay-1">

      <!-- Image -->
      <div>
        <img
          class="painting-detail-image"
          src="${imageSrc}"
          alt="${painting.title} — ${painting.medium}, ${formattedDate}"
          loading="eager"
          onerror="this.src='https://placehold.co/900x1100/242019/6e6358?text=Image+not+found'"
        />
      </div>

      <!-- Metadata sidebar -->
      <aside class="painting-detail-meta">
        <a href="timeline.html" class="painting-era-link">
          ${painting.eraTitle}
        </a>

        <h1 class="painting-detail-title">${painting.title}</h1>

        <table class="painting-meta-table">
          <tr>
            <td>Date</td>
            <td>${formattedDate}</td>
          </tr>
          <tr>
            <td>Medium</td>
            <td>${painting.medium}</td>
          </tr>
          ${painting.dimensions ? `
          <tr>
            <td>Size</td>
            <td>${painting.dimensions}</td>
          </tr>` : ""}
        </table>

        ${painting.description ? `
        <p class="painting-description">${painting.description}</p>
        ` : ""}

        ${tagsHTML ? `
        <div class="painting-tags">
          ${tagsHTML}
        </div>
        ` : ""}

      </aside>
    </div>
  `;

  // ── Append bottom sections ────────────────────────────────
  renderPrevNext(painting);
  renderProcessStrip(painting);
  renderRelated(painting);
})();

// ─── Prev / Next (across full collection) ────────────────────────────────────
function renderPrevNext(currentPainting) {
  const all = getAllPaintings(); // flat, chronological order
  const idx  = all.findIndex((p) => p.id === currentPainting.id);
  const prev = all[idx - 1] || null;
  const next = all[idx + 1] || null;
  if (!prev && !next) return;

  const bar = document.createElement("div");
  bar.className = "painting-prevnext";

  bar.innerHTML = `
    <div class="prevnext-inner">
      <div class="prevnext-slot prevnext-prev">
        ${prev ? `
          <a href="painting.html?id=${prev.id}" class="prevnext-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span class="prevnext-label">Previous</span>
            <span class="prevnext-title">${prev.title}</span>
          </a>
        ` : ""}
      </div>
      <div class="prevnext-divider"></div>
      <div class="prevnext-slot prevnext-next">
        ${next ? `
          <a href="painting.html?id=${next.id}" class="prevnext-link prevnext-link--right">
            <span class="prevnext-label">Next</span>
            <span class="prevnext-title">${next.title}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        ` : ""}
      </div>
    </div>
  `;

  document.getElementById("paintingDetail").appendChild(bar);
}

// ─── Process / WIP strip ──────────────────────────────────────────────────────
function renderProcessStrip(painting) {
  if (!painting.process || painting.process.length === 0) return;

  const section = document.createElement("div");
  section.className = "process-strip-section";

  const imagesHTML = painting.process
    .map((path, i) => `
      <div class="process-thumb" data-index="${i}" role="button" tabindex="0"
           aria-label="View work-in-progress photo ${i + 1}">
        <img src="${getImageUrl(path)}"
             alt="Work in progress ${i + 1} — ${painting.title}"
             loading="lazy"
             onerror="this.parentElement.style.display='none'" />
      </div>
    `)
    .join("");

  section.innerHTML = `
    <h3 class="section-label">Process</h3>
    <div class="process-strip">${imagesHTML}</div>
  `;

  document.getElementById("paintingDetail").appendChild(section);

  // Build lightbox overlay (once)
  const overlay = document.createElement("div");
  overlay.className = "lightbox-overlay";
  overlay.innerHTML = `
    <button class="lightbox-close" aria-label="Close">&times;</button>
    <img src="" alt="Work in progress — ${painting.title}" />
  `;
  document.body.appendChild(overlay);

  const lightboxImg = overlay.querySelector("img");
  const urls = painting.process.map((p) => getImageUrl(p));

  function openLightbox(index) {
    lightboxImg.src = urls[index];
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  // Click on thumb
  section.querySelectorAll(".process-thumb").forEach((thumb) => {
    thumb.addEventListener("click", () => openLightbox(Number(thumb.dataset.index)));
    thumb.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") openLightbox(Number(thumb.dataset.index));
    });
  });

  // Close on overlay background or close button
  overlay.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeLightbox(); });

  // Close on Escape
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });
}

// ─── Related paintings ────────────────────────────────────────────────────────
function renderRelated(painting) {
  const related = getRelatedPaintings(painting, 3);
  if (related.length === 0) return;

  const section = document.createElement("div");
  section.className = "related-section";

  const cardsHTML = related
    .map((p) => {
      const thumbSrc = p.thumbnail
        ? getImageUrl(p.thumbnail)
        : `https://placehold.co/400x500/2c2820/6e6358?text=${encodeURIComponent(p.title)}`;
      const formattedDate = formatDate(p.date);
      return `
        <a href="painting.html?id=${p.id}" class="painting-card related-card">
          <div class="painting-card-image">
            <img src="${thumbSrc}"
                 alt="${p.title}"
                 loading="lazy"
                 onerror="this.parentElement.innerHTML='<div class=\\'painting-card-placeholder\\'>${encodeURIComponent(p.title)}</div>'" />
          </div>
          <div class="painting-card-info">
            <p class="painting-card-title">${p.title}</p>
            <p class="painting-card-meta">${p.medium} · ${formattedDate}</p>
          </div>
        </a>
      `;
    })
    .join("");

  section.innerHTML = `
    <h3 class="section-label">Related works</h3>
    <div class="related-grid">${cardsHTML}</div>
  `;

  document.getElementById("paintingDetail").appendChild(section);
}

// ─── Error state ──────────────────────────────────────────────────────────────
function renderError(message, container) {
  container.innerHTML = `
    <div class="error-state">
      <h2>${message}</h2>
      <a href="timeline.html" class="btn btn-outline" style="margin-top: 1.5rem;">
        ← Back to timeline
      </a>
    </div>
  `;
}

// ─── Date formatting ──────────────────────────────────────────────────────────
/**
 * Formats a date string for the detail page.
 * "2022-03"    → "March 2022"
 * "2022-03-15" → "15 March 2022"
 */
function formatDate(dateStr) {
  if (!dateStr) return "Date unknown";
  const parts = dateStr.split("-");
  if (parts.length === 1) return parts[0]; // just year

  const year  = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1;
  const day   = parts[2] ? parseInt(parts[2]) : null;

  const date = new Date(year, month, day || 1);

  if (day) {
    return date.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
  }
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}
