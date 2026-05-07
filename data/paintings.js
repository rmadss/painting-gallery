/**
 * paintings.js — Central data source for all paintings and eras.
 *
 * HOW TO ADD A PAINTING:
 *  1. Add your image files to /public/images/<era-slug>/
 *     - full size:  e.g. public/images/early-explorations/still-life-with-pears.JPEG
 *     - thumbnail:  e.g. public/images/early-explorations/thumbs/still-life-with-pears.JPEG
 *  2. Copy an existing painting object and fill in the fields.
 *  3. Paste it into the correct era's `paintings` array.
 *
 * MIGRATING TO A DATABASE LATER:
 *  This structure maps 1:1 to a relational DB:
 *    - eras       → `eras` table
 *    - paintings  → `paintings` table  (foreign key: eraId)
 *    - tags       → `tags` + `painting_tags` join table
 *
 * DATE FORMAT: ISO 8601 — "YYYY-MM" for month precision, "YYYY-MM-DD" for day precision.
 * IMAGE PATHS: root-relative from the project folder (e.g. "public/images/...").
 *              When deploying to GitHub Pages with a repo subdirectory, a getImageUrl()
 *              utility in js/utils.js handles the base path prefix automatically.
 */

const PAINTINGS_DATA = {
  eras: [
    // ─────────────────────────────────────────────────────────
    // ERA 1: Faces & Foundations
    // ─────────────────────────────────────────────────────────
    {
      id: "faces-and-foundations",
      title: "Faces & Foundations",
      startDate: "2017-01",
      endDate: "2020-01",
      description:
        "Where it all began — portraits of musicians, icons, and personal figures that shaped the practice. Learning to read a face, trust a likeness, and find the feeling beneath the features.",
      paintings: [
        // ── The Beatles ──────────────────────────────────────
        {
          id: "john-lennon",
          title: "John Lennon",
          image: "public/images/faces-and-foundations/john-lennon.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/john-lennon.JPEG",
          date: "2017-01",
          medium: "Acrylic on canvas",
          dimensions: "24 x 36 inches",
          tags: ["portrait", "musician", "the beatles"],
          description: "",
          process: [
            "public/images/faces-and-foundations/process/john-lennon-wip-1.JPEG",
            "public/images/faces-and-foundations/process/john-lennon-wip-2.JPEG",
            "public/images/faces-and-foundations/process/john-lennon-wip-3.JPEG",
          ],
        },
        {
          id: "paul-mccartney",
          title: "Paul McCartney",
          image: "public/images/faces-and-foundations/paul-mccartney.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/paul-mccartney.JPEG",
          date: "2017-01",
          medium: "Acrylic on canvas",
          dimensions: "24 x 36 inches",
          tags: ["portrait", "musician", "the beatles"],
          description: "",
        },
        {
          id: "george-harrison",
          title: "George Harrison",
          image: "public/images/faces-and-foundations/george-harrison.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/george-harrison.JPEG",
          date: "2017-01",
          medium: "Acrylic on canvas",
          dimensions: "24 x 36 inches",
          tags: ["portrait", "musician", "the beatles"],
          description: "",
        },
        {
          id: "ringo-starr",
          title: "Ringo Starr",
          image: "public/images/faces-and-foundations/ringo-starr.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/ringo-starr.JPEG",
          date: "2017-02",
          medium: "Acrylic on canvas",
          dimensions: "24 x 36 inches",
          tags: ["portrait", "musician", "the beatles"],
          description: "",
        },
        // ── Musicians ────────────────────────────────────────
        {
          id: "john-mayer",
          title: "John Mayer",
          image: "public/images/faces-and-foundations/john-mayer.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/john-mayer.JPEG",
          date: "2017-02",
          medium: "Acrylic on canvas",
          dimensions: "24 x 36 inches",
          tags: ["portrait", "musician"],
          description: "",
        },
        {
          id: "jimi-hendrix",
          title: "Jimi Hendrix",
          image: "public/images/faces-and-foundations/jimi-hendrix.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/jimi-hendrix.JPEG",
          date: "2017-03",
          medium: "Acrylic on canvas",
          dimensions: "24 x 36 inches",
          tags: ["portrait", "musician"],
          description: "",
        },
        {
          id: "elvis-presley",
          title: "Elvis Presley",
          image: "public/images/faces-and-foundations/elvis-presley.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/elvis-presley.JPEG",
          date: "2017-03",
          medium: "Acrylic on canvas",
          dimensions: "24 x 36 inches",
          tags: ["portrait", "musician"],
          description: "",
        },
        {
          id: "jim-morrison",
          title: "Jim Morrison",
          image: "public/images/faces-and-foundations/jim-morrison.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/jim-morrison.JPEG",
          date: "2017-05",
          medium: "Acrylic on canvas",
          dimensions: "36 x 24 inches",
          tags: ["portrait", "musician"],
          description: "",
        },
        {
          id: "mac-demarco",
          title: "Mac DeMarco",
          image: "public/images/faces-and-foundations/mac-demarco.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/mac-demarco.JPEG",
          date: "2017-05",
          medium: "Acrylic on canvas",
          dimensions: "24 x 36 inches",
          tags: ["portrait", "musician"],
          description: "",
        },
        {
          id: "bob-marley",
          title: "Bob Marley",
          image: "public/images/faces-and-foundations/bob-marley.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/bob-marley.JPEG",
          date: "2017-06",
          medium: "Acrylic on canvas",
          dimensions: "36 x 24 inches",
          tags: ["portrait", "musician"],
          description: "",
        },
        {
          id: "john-denver",
          title: "John Denver",
          image: "public/images/faces-and-foundations/john-denver.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/john-denver.JPEG",
          date: "2017-06",
          medium: "Acrylic on canvas",
          dimensions: "24 x 36 inches",
          tags: ["portrait", "musician"],
          description: "",
        },
        {
          id: "mac-demarco-2",
          title: "Mac DeMarco",
          image: "public/images/faces-and-foundations/mac-demarco-2.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/mac-demarco-2.JPEG",
          date: "2017-08",
          medium: "Acrylic on canvas",
          dimensions: "36 x 24 inches",
          tags: ["portrait", "musician"],
          description: "",
        },
        {
          id: "johnny-cash",
          title: "Johnny Cash",
          image: "public/images/faces-and-foundations/johnny-cash.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/johnny-cash.JPEG",
          date: "2017-08",
          medium: "Acrylic on canvas",
          dimensions: "24 x 36 inches",
          tags: ["portrait", "musician"],
          description: "",
        },
        // ── Film & Culture ───────────────────────────────────
        {
          id: "the-dark-knight",
          title: "The Dark Knight",
          image: "public/images/faces-and-foundations/the-dark-knight.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/the-dark-knight.JPEG",
          date: "2017-08",
          medium: "Acrylic on drywall",
          dimensions: "8 feet x 10 feet",
          tags: ["portrait", "film", "character"],
          description: "",
        },
        {
          id: "john-lennon-2",
          title: "John Lennon",
          image: "public/images/faces-and-foundations/john-lennon-2.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/john-lennon-2.JPEG",
          date: "2017-10",
          medium: "Acrylic on canvas",
          dimensions: "24 x 36 inches",
          tags: ["portrait", "musician", "the beatles"],
          description: "",
        },
        {
          id: "lil-pump",
          title: "Lil Pump",
          image: "public/images/faces-and-foundations/lil-pump.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/lil-pump.JPEG",
          date: "2021-04",
          medium: "Acrylic on canvas",
          dimensions: "24 x 36 inches",
          tags: ["portrait", "musician"],
          description: "",
        },
        {
          id: "michael-jackson",
          title: "Michael Jackson",
          image: "public/images/faces-and-foundations/michael-jackson.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/michael-jackson.JPEG",
          date: "2021-05",
          medium: "Acrylic on canvas",
          dimensions: "24 x 36 inches",
          tags: ["portrait", "musician", "legend"],
          description: "",
        },
        {
          id: "heres-johnny",
          title: "Here's Johnny (The Shining)",
          image: "public/images/faces-and-foundations/heres-johnny.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/heres-johnny.JPEG",
          date: "2021-06",
          medium: "Acrylic on canvas",
          dimensions: "24 x 36 inches",
          tags: ["portrait", "film", "character", "horror"],
          description: "",
        },
        {
          id: "captain-jack-sparrow",
          title: "Captain Jack Sparrow",
          image: "public/images/faces-and-foundations/captain-jack-sparrow.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/captain-jack-sparrow.JPEG",
          date: "2021-07",
          medium: "Acrylic on canvas",
          dimensions: "24 x 36 inches",
          tags: ["portrait", "film", "character"],
          description: "",
        },
        {
          id: "self-portrait-1",
          title: "Self Portrait #1",
          image: "public/images/faces-and-foundations/self-portrait-1.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/self-portrait-1.JPEG",
          date: "2021-08",
          medium: "Acrylic on canvas",
          dimensions: "24 x 36 inches",
          tags: ["portrait", "self portrait"],
          description: "",
        },
        {
          id: "pennywise",
          title: "Pennywise",
          image: "public/images/faces-and-foundations/pennywise.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/pennywise.JPEG",
          date: "2021-09",
          medium: "Acrylic on canvas",
          dimensions: "24 x 36 inches",
          tags: ["portrait", "film", "character", "horror"],
          description: "",
        },
        {
          id: "the-doors",
          title: "The Doors",
          image: "public/images/faces-and-foundations/the-doors.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/the-doors.JPEG",
          date: "2021-10",
          medium: "",
          dimensions: "",
          tags: ["portrait", "musician", "band", "legend"],
          description: "",
        },
        {
          id: "american-psycho",
          title: "Christian Bale: American Psycho",
          image: "public/images/faces-and-foundations/american-psycho.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/american-psycho.JPEG",
          date: "2021-11",
          medium: "",
          dimensions: "",
          tags: ["portrait", "film", "character"],
          description: "",
        },
        {
          id: "jon-hamm",
          title: "Jon Hamm",
          image: "public/images/faces-and-foundations/jon-hamm.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/jon-hamm.JPEG",
          date: "2018-02",
          medium: "Acrylic on canvas",
          dimensions: "24 x 36 inches",
          tags: ["portrait", "film"],
          description: "",
        },
        {
          id: "self-portrait-2",
          title: "Self Portrait #2",
          image: "public/images/faces-and-foundations/self-portrait-2.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/self-portrait-2.JPEG",
          date: "2018-06",
          medium: "Acrylic on canvas",
          dimensions: "3 feet x 6 feet",
          tags: ["portrait", "self portrait"],
          description: "",
        },
        {
          id: "gloria",
          title: "Gloria",
          image: "public/images/faces-and-foundations/gloria.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/gloria.JPEG",
          date: "2018-09",
          medium: "Oil on canvas",
          dimensions: "9 x 12 inches",
          tags: ["abstract", "self portrait"],
          description: "",
        },
        {
          id: "father-john-misty",
          title: "Father John Misty",
          image: "public/images/faces-and-foundations/father-john-misty.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/father-john-misty.JPEG",
          date: "2018-06",
          medium: "Acrylic on canvas",
          dimensions: "24 x 36 inches",
          tags: ["abstract", "self portrait"],
          description: "",
        },
        {
          id: "childish-gambino",
          title: "Childish Gambino",
          image: "public/images/faces-and-foundations/childish-gambino.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/childish-gambino.JPEG",
          date: "2018-07",
          medium: "Acrylic on canvas",
          dimensions: "24 x 24 inches",
          tags: ["album cover", "musician"],
          description: "",
        },
        {
          id: "jim-croce-life-and-times",
          title: "Jim Croce: Life and Times",
          image: "public/images/faces-and-foundations/jim-croce-life-and-times.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/jim-croce-life-and-times.JPEG",
          date: "2018-07",
          medium: "Acrylic on canvas",
          dimensions: "24 x 24 inches",
          tags: ["album cover", "musician"],
          description: "",
        },
        {
          id: "willy-wonka",
          title: "Willy Wonka",
          image: "public/images/faces-and-foundations/willy-wonka.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/willy-wonka.JPEG",
          date: "2018-07",
          medium: "Acrylic on canvas",
          dimensions: "24 x 24 inches",
          tags: ["album cover", "musician"],
          description: "",
        },
        {
          id: "ezekiel-25-17",
          title: "Ezekiel 25:17",
          image: "public/images/faces-and-foundations/ezekiel-25-17.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/ezekiel-25-17.JPEG",
          date: "2021-08",
          medium: "Oil on canvas",
          dimensions: "24 x 24 inches",
          tags: ["film", "character"],
          description: "",
        },
      ],
    },

    // ─────────────────────────────────────────────────────────
    // ERA 2: Sound in Color
    // ─────────────────────────────────────────────────────────
    {
      id: "sound-in-color",
      title: "Sound in Color",
      startDate: "2019-03",
      endDate: "2023-06",
      description:
        "Album covers, abstraction, and the visual language of music. An experiment in translating sound into colour and form — less about likeness, more about feeling.",
      paintings: [
        {
          id: "stuck-on-mt-pleasant",
          title: "Stuck on Mt. Pleasant",
          image: "public/images/faces-and-foundations/stuck-on-mt-pleasant.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/stuck-on-mt-pleasant.JPEG",
          date: "2018-10",
          medium: "Oil on canvas",
          dimensions: "24 x 24 inches",
          tags: ["abstract"],
          description: "",
        },
        {
          id: "house-on-the-prairie",
          title: "House on the Prairie",
          image: "public/images/faces-and-foundations/house-on-the-prairie.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/house-on-the-prairie.JPEG",
          date: "2018-11",
          medium: "Oil on canvas",
          dimensions: "24 x 24 inches",
          tags: ["abstract"],
          description: "",
        },
        {
          id: "currents",
          title: "Currents",
          image: "public/images/faces-and-foundations/currents.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/currents.JPEG",
          date: "2018-11",
          medium: "Oil on canvas",
          dimensions: "24 x 24 inches",
          tags: ["abstract"],
          description: "",
        },
        {
          id: "man-on-the-moon",
          title: "Man on the Moon",
          image: "public/images/faces-and-foundations/man-on-the-moon.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/man-on-the-moon.JPEG",
          date: "2020-10",
          medium: "Oil on canvas",
          dimensions: "24 x 24 inches",
          tags: ["abstract", "pattern"],
          description: "",
        },
        {
          id: "under-pressure",
          title: "Under Pressure",
          image: "public/images/faces-and-foundations/under-pressure.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/under-pressure.JPEG",
          date: "2019-07",
          medium: "Oil on canvas",
          dimensions: "24 x 24 inches",
          tags: ["album cover"],
          description: "",
        },
        {
          id: "self-portrait-3",
          title: "Self Portrait #3",
          image: "public/images/faces-and-foundations/self-portrait-3.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/self-portrait-3.JPEG",
          date: "2018-11",
          medium: "Oil on canvas",
          dimensions: "24 x 24 inches",
          tags: ["abstract", "self portrait"],
          description: "",
        },
    
    
       ],
        
    },

    // ─────────────────────────────────────────────────────────
    // ERA 3: Patterned Infinity
    // ─────────────────────────────────────────────────────────
    {
      id: "patterned-infinity",
      title: "Patterned Infinity",
      startDate: "2023-07",
      endDate: "2024-06",
      description:
        "Repetition, rhythm, and the strange comfort of pattern. An exploration of structure as both constraint and freedom.",
      paintings: [
        {
          id: "spiraliing-out",
          title: "Spiraling Out",
          image: "public/images/faces-and-foundations/spiraling-out.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/spiraling-out.JPEG",
          date: "2021-01",
          medium: "Oil on canvas",
          dimensions: "24 x 24 inches",
          tags: ["abstract", "pattern"],
          description: "",
        },
        {
          id: "self-portrait-9",
          title: "Self Portrait #9",
          image: "public/images/faces-and-foundations/self-portrait-9.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/self-portrait-9.JPEG",
          date: "2021-01",
          medium: "Oil on canvas",
          dimensions: "24 x 24 inches",
          tags: ["abstract", "pattern"],
          description: "",
        },
        {
          id: "self-portrait-10",
          title: "Self Portrait #10",
          image: "public/images/faces-and-foundations/self-portrait-10.JPEG",
          thumbnail: "public/images/faces-and-foundations/thumbs/self-portrait-10.JPEG",
          date: "2021-01",
          medium: "Oil on canvas",
          dimensions: "24 x 24 inches",
          tags: ["abstract", "pattern"],
          description: "",
        },
    
        ],
    },
  ],
};

// ─── Utility helpers ──────────────────────────────────────────────────────────

/**
 * Returns all eras in chronological order.
 */
function getEras() {
  return PAINTINGS_DATA.eras;
}

/**
 * Returns a single era by its id slug, or undefined if not found.
 * @param {string} eraId
 */
function getEra(eraId) {
  return PAINTINGS_DATA.eras.find((e) => e.id === eraId);
}

/**
 * Returns a single painting by its id, searching across all eras.
 * Also attaches `eraId` and `eraTitle` to the returned object for convenience.
 * @param {string} paintingId
 */
function getPainting(paintingId) {
  for (const era of PAINTINGS_DATA.eras) {
    const painting = era.paintings.find((p) => p.id === paintingId);
    if (painting) {
      return { ...painting, eraId: era.id, eraTitle: era.title };
    }
  }
  return null;
}

/**
 * Returns a flat array of all paintings across all eras, each with
 * eraId and eraTitle attached.
 */
function getAllPaintings() {
  return PAINTINGS_DATA.eras
    .flatMap((era) =>
      era.paintings.map((p) => ({ ...p, eraId: era.id, eraTitle: era.title }))
    )
    .sort((a, b) => (a.date || "").localeCompare(b.date || ""));
}

/**
 * Returns a sorted, deduplicated array of all tags used across all paintings.
 */
function getAllTags() {
  const tags = getAllPaintings().flatMap((p) => p.tags);
  return [...new Set(tags)].sort();
}

/**
 * Returns a sorted, deduplicated array of all mediums used.
 */
function getAllMediums() {
  const mediums = getAllPaintings().map((p) => p.medium.split(" on ")[0].trim());
  return [...new Set(mediums)].sort();
}

/**
 * Builds the correct image URL regardless of whether the site is served
 * from the root or a GitHub Pages subdirectory (e.g. /painting-website/).
 *
 * Set BASE_PATH to your repo name if deploying to GitHub Pages with a custom
 * subdirectory. Leave as "" for root deployments or local file:// access.
 *
 * @param {string} path — root-relative path from paintings.js (e.g. "public/images/...")
 */
const BASE_PATH = "/painting-gallery"; // e.g. "/painting-website" for GitHub Pages subdirectory deployments
function getImageUrl(path) {
  return BASE_PATH + "/" + path;
}
