/**
 * paintings.js — Central data source for all paintings and eras.
 *
 * HOW TO ADD A PAINTING:
 *  1. Add your image files to /public/images/<era-slug>/
 *     - full size:  e.g. public/images/my-painting.JPEG
 *     - thumbnail:  e.g. public/images/thumbs/my-painting.JPEG
 *  2. Copy an existing painting object below and fill in the fields.
 *  3. Set the `era` field to the matching era id from the ERAS array.
 *
 * ERA IDs:
 *   "faces-and-foundations"
 *   "sound-in-color"
 *   "patterned-infinity"
 *   "reprise-the-return"
 *
 * DATE FORMAT: "YYYY-MM"
 * IMAGE PATHS: root-relative (e.g. "public/images/...").
 */

// ─── Era metadata ─────────────────────────────────────────────────────────────
const ERAS = [
  {
    id: "faces-and-foundations",
    title: "Faces & Foundations",
    startDate: "2017-01",
    endDate: "2020-01",
    description:
      "Where it all began — portraits of musicians, icons, and personal figures that shaped the practice. Learning to read a face, trust a likeness, and find the feeling beneath the features.",
  },
  {
    id: "sound-in-color",
    title: "Sound in Color",
    startDate: "2019-03",
    endDate: "2023-06",
    description:
      "Album covers, abstraction, and the visual language of music. An experiment in translating sound into colour and form — less about likeness, more about feeling.",
  },
  {
    id: "patterned-infinity",
    title: "Patterned Infinity",
    startDate: "2023-07",
    endDate: "2024-06",
    description:
      "Repetition, rhythm, and the strange comfort of pattern. An exploration of structure as both constraint and freedom.",
  },
  {
    id: "places-and-presence",
    title: "Places & Presence",
    startDate: "2024-07",
    endDate: null,
    description:
      "Exploring the relationship between space and identity. Capturing the essence of places and the presence they hold.",
  },
];

// ─── Paintings ────────────────────────────────────────────────────────────────
const PAINTINGS = [

  // ── Era: Faces & Foundations ──────────────────────────────────────────────

  {
    id: "john-lennon",
    era: "faces-and-foundations",
    title: "John Lennon",
    image: "public/images/john-lennon.JPEG",
    thumbnail: "public/images/thumbs/john-lennon.JPEG",
    date: "2017-01",
    medium: "Acrylic on canvas",
    dimensions: "24 x 36 inches",
    tags: ["portrait", "musician", "the beatles"],
    description: "",
    process: [
      "public/images/process/john-lennon-wip-1.JPEG",
      "public/images/process/john-lennon-wip-2.JPEG",
      "public/images/process/john-lennon-wip-3.JPEG",
    ],
  },
  {
    id: "paul-mccartney",
    era: "faces-and-foundations",
    title: "Paul McCartney",
    image: "public/images/paul-mccartney.JPEG",
    thumbnail: "public/images/thumbs/paul-mccartney.JPEG",
    date: "2017-01",
    medium: "Acrylic on canvas",
    dimensions: "24 x 36 inches",
    tags: ["portrait", "musician", "the beatles"],
    description: "",
  },
  {
    id: "george-harrison",
    era: "faces-and-foundations",
    title: "George Harrison",
    image: "public/images/george-harrison.JPEG",
    thumbnail: "public/images/thumbs/george-harrison.JPEG",
    date: "2017-01",
    medium: "Acrylic on canvas",
    dimensions: "24 x 36 inches",
    tags: ["portrait", "musician", "the beatles"],
    description: "",
  },
  {
    id: "ringo-starr",
    era: "faces-and-foundations",
    title: "Ringo Starr",
    image: "public/images/ringo-starr.JPEG",
    thumbnail: "public/images/thumbs/ringo-starr.JPEG",
    date: "2017-02",
    medium: "Acrylic on canvas",
    dimensions: "24 x 36 inches",
    tags: ["portrait", "musician", "the beatles"],
    description: "",
  },
  {
    id: "john-mayer",
    era: "faces-and-foundations",
    title: "John Mayer",
    image: "public/images/john-mayer.JPEG",
    thumbnail: "public/images/thumbs/john-mayer.JPEG",
    date: "2017-02",
    medium: "Acrylic on canvas",
    dimensions: "24 x 36 inches",
    tags: ["portrait", "musician"],
    description: "",
  },
  {
    id: "jimi-hendrix",
    era: "faces-and-foundations",
    title: "Jimi Hendrix",
    image: "public/images/jimi-hendrix.JPEG",
    thumbnail: "public/images/thumbs/jimi-hendrix.JPEG",
    date: "2017-03",
    medium: "Acrylic on canvas",
    dimensions: "24 x 36 inches",
    tags: ["portrait", "musician"],
    description: "",
  },
  {
    id: "elvis-presley",
    era: "faces-and-foundations",
    title: "Elvis Presley",
    image: "public/images/elvis-presley.JPEG",
    thumbnail: "public/images/thumbs/elvis-presley.JPEG",
    date: "2017-03",
    medium: "Acrylic on canvas",
    dimensions: "24 x 36 inches",
    tags: ["portrait", "musician"],
    description: "",
  },
  {
    id: "jim-morrison",
    era: "faces-and-foundations",
    title: "Jim Morrison",
    image: "public/images/jim-morrison.JPEG",
    thumbnail: "public/images/thumbs/jim-morrison.JPEG",
    date: "2017-05",
    medium: "Acrylic on canvas",
    dimensions: "36 x 24 inches",
    tags: ["portrait", "musician"],
    description: "",
  },
  {
    id: "mac-demarco",
    era: "faces-and-foundations",
    title: "Mac DeMarco",
    image: "public/images/mac-demarco.JPEG",
    thumbnail: "public/images/thumbs/mac-demarco.JPEG",
    date: "2017-05",
    medium: "Acrylic on canvas",
    dimensions: "24 x 36 inches",
    tags: ["portrait", "musician"],
    description: "",
  },
  {
    id: "bob-marley",
    era: "faces-and-foundations",
    title: "Bob Marley",
    image: "public/images/bob-marley.JPEG",
    thumbnail: "public/images/thumbs/bob-marley.JPEG",
    date: "2017-06",
    medium: "Acrylic on canvas",
    dimensions: "36 x 24 inches",
    tags: ["portrait", "musician"],
    description: "",
  },
  {
    id: "john-denver",
    era: "faces-and-foundations",
    title: "John Denver",
    image: "public/images/john-denver.JPEG",
    thumbnail: "public/images/thumbs/john-denver.JPEG",
    date: "2017-06",
    medium: "Acrylic on canvas",
    dimensions: "24 x 36 inches",
    tags: ["portrait", "musician"],
    description: "",
  },
  {
    id: "mac-demarco-2",
    era: "faces-and-foundations",
    title: "Mac DeMarco",
    image: "public/images/mac-demarco-2.JPEG",
    thumbnail: "public/images/thumbs/mac-demarco-2.JPEG",
    date: "2017-08",
    medium: "Acrylic on canvas",
    dimensions: "36 x 24 inches",
    tags: ["portrait", "musician"],
    description: "",
  },
  {
    id: "johnny-cash",
    era: "faces-and-foundations",
    title: "Johnny Cash",
    image: "public/images/johnny-cash.JPEG",
    thumbnail: "public/images/thumbs/johnny-cash.JPEG",
    date: "2017-08",
    medium: "Acrylic on canvas",
    dimensions: "24 x 36 inches",
    tags: ["portrait", "musician"],
    description: "",
  },
  {
    id: "the-dark-knight",
    era: "faces-and-foundations",
    title: "The Dark Knight",
    image: "public/images/the-dark-knight.JPEG",
    thumbnail: "public/images/thumbs/the-dark-knight.JPEG",
    date: "2017-08",
    medium: "Acrylic on drywall",
    dimensions: "8 feet x 10 feet",
    tags: ["portrait", "film", "character"],
    description: "",
  },
  {
    id: "john-lennon-2",
    era: "faces-and-foundations",
    title: "John Lennon",
    image: "public/images/john-lennon-2.JPEG",
    thumbnail: "public/images/thumbs/john-lennon-2.JPEG",
    date: "2017-10",
    medium: "Acrylic on canvas",
    dimensions: "24 x 36 inches",
    tags: ["portrait", "musician", "the beatles"],
    description: "",
  },
  {
    id: "jon-hamm",
    era: "faces-and-foundations",
    title: "Jon Hamm",
    image: "public/images/jon-hamm.JPEG",
    thumbnail: "public/images/thumbs/jon-hamm.JPEG",
    date: "2018-02",
    medium: "Acrylic on canvas",
    dimensions: "24 x 36 inches",
    tags: ["portrait", "film"],
    description: "",
  },
  {
    id: "self-portrait-2",
    era: "faces-and-foundations",
    title: "Self Portrait #2",
    image: "public/images/self-portrait-2.JPEG",
    thumbnail: "public/images/thumbs/self-portrait-2.JPEG",
    date: "2018-06",
    medium: "Acrylic on canvas",
    dimensions: "3 feet x 6 feet",
    tags: ["portrait", "self portrait"],
    description: "",
  },
  {
    id: "father-john-misty",
    era: "faces-and-foundations",
    title: "Father John Misty",
    image: "public/images/father-john-misty.JPEG",
    thumbnail: "public/images/thumbs/father-john-misty.JPEG",
    date: "2018-06",
    medium: "Acrylic on canvas",
    dimensions: "24 x 36 inches",
    tags: ["portrait", "musician"],
    description: "",
  },
  {
    id: "childish-gambino",
    era: "faces-and-foundations",
    title: "Childish Gambino",
    image: "public/images/childish-gambino.JPEG",
    thumbnail: "public/images/thumbs/childish-gambino.JPEG",
    date: "2018-07",
    medium: "Acrylic on canvas",
    dimensions: "24 x 24 inches",
    tags: ["album cover", "musician"],
    description: "",
  },
  {
    id: "jim-croce-life-and-times",
    era: "faces-and-foundations",
    title: "Jim Croce: Life and Times",
    image: "public/images/jim-croce-life-and-times.JPEG",
    thumbnail: "public/images/thumbs/jim-croce-life-and-times.JPEG",
    date: "2018-07",
    medium: "Acrylic on canvas",
    dimensions: "24 x 24 inches",
    tags: ["album cover", "musician"],
    description: "",
  },
  {
    id: "willy-wonka",
    era: "faces-and-foundations",
    title: "Willy Wonka",
    image: "public/images/willy-wonka.JPEG",
    thumbnail: "public/images/thumbs/willy-wonka.JPEG",
    date: "2018-07",
    medium: "Acrylic on canvas",
    dimensions: "24 x 24 inches",
    tags: ["film", "character"],
    description: "",
  },
  {
    id: "gloria",
    era: "faces-and-foundations",
    title: "Gloria",
    image: "public/images/gloria.JPEG",
    thumbnail: "public/images/thumbs/gloria.JPEG",
    date: "2018-09",
    medium: "Oil on canvas",
    dimensions: "9 x 12 inches",
    tags: ["abstract", "self portrait"],
    description: "",
  },
  {
    id: "lil-pump",
    era: "faces-and-foundations",
    title: "Lil Pump",
    image: "public/images/lil-pump.JPEG",
    thumbnail: "public/images/thumbs/lil-pump.JPEG",
    date: "2018-04",
    medium: "Acrylic on canvas",
    dimensions: "24 x 36 inches",
    tags: ["portrait", "musician"],
    description: "",
  },
  {
    id: "michael-jackson",
    era: "faces-and-foundations",
    title: "Michael Jackson",
    image: "public/images/michael-jackson.JPEG",
    thumbnail: "public/images/thumbs/michael-jackson.JPEG",
    date: "2018-05",
    medium: "Acrylic on canvas",
    dimensions: "24 x 36 inches",
    tags: ["portrait", "musician", "legend"],
    description: "",
  },
  {
    id: "heres-johnny",
    era: "faces-and-foundations",
    title: "Here's Johnny (The Shining)",
    image: "public/images/heres-johnny.JPEG",
    thumbnail: "public/images/thumbs/heres-johnny.JPEG",
    date: "2018-06",
    medium: "Acrylic on canvas",
    dimensions: "24 x 36 inches",
    tags: ["portrait", "film", "character", "horror"],
    description: "",
  },
  {
    id: "captain-jack-sparrow",
    era: "faces-and-foundations",
    title: "Captain Jack Sparrow",
    image: "public/images/captain-jack-sparrow.JPEG",
    thumbnail: "public/images/thumbs/captain-jack-sparrow.JPEG",
    date: "2018-07",
    medium: "Acrylic on canvas",
    dimensions: "24 x 36 inches",
    tags: ["portrait", "film", "character"],
    description: "",
  },
  {
    id: "self-portrait-1",
    era: "faces-and-foundations",
    title: "Self Portrait #1",
    image: "public/images/self-portrait-1.JPEG",
    thumbnail: "public/images/thumbs/self-portrait-1.JPEG",
    date: "2018-08",
    medium: "Acrylic on canvas",
    dimensions: "24 x 36 inches",
    tags: ["portrait", "self portrait"],
    description: "",
  },
  {
    id: "ezekiel-25-17",
    era: "faces-and-foundations",
    title: "Ezekiel 25:17",
    image: "public/images/ezekiel-25-17.JPEG",
    thumbnail: "public/images/thumbs/ezekiel-25-17.JPEG",
    date: "2021-08",
    medium: "Oil on canvas",
    dimensions: "24 x 24 inches",
    tags: ["film", "character"],
    description: "",
  },
  {
    id: "pennywise",
    era: "faces-and-foundations",
    title: "Pennywise",
    image: "public/images/pennywise.JPEG",
    thumbnail: "public/images/thumbs/pennywise.JPEG",
    date: "2018-09",
    medium: "Acrylic on canvas",
    dimensions: "24 x 36 inches",
    tags: ["portrait", "film", "character", "horror"],
    description: "",
  },
  {
    id: "the-doors",
    era: "faces-and-foundations",
    title: "The Doors",
    image: "public/images/the-doors.JPEG",
    thumbnail: "public/images/thumbs/the-doors.JPEG",
    date: "2018-10",
    medium: "",
    dimensions: "",
    tags: ["portrait", "musician", "band", "legend"],
    description: "",
  },
  {
    id: "american-psycho",
    era: "faces-and-foundations",
    title: "Christian Bale: American Psycho",
    image: "public/images/american-psycho.JPEG",
    thumbnail: "public/images/thumbs/american-psycho.JPEG",
    date: "2018-11",
    medium: "",
    dimensions: "",
    tags: ["portrait", "film", "character"],
    description: "",
  },
  {
    id: "self-portrait-10",
    era: "faces-and-foundations",
    title: "Self Portrait #10",
    image: "public/images/self-portrait-10.JPEG",
    thumbnail: "public/images/thumbs/self-portrait-10.JPEG",
    date: "2021-01",
    medium: "Oil on canvas",
    dimensions: "24 x 24 inches",
    tags: ["abstract", "pattern"],
    description: "",
  },

  // ── Era: Sound in Color ───────────────────────────────────────────────────

  {
    id: "stuck-on-mt-pleasant",
    era: "sound-in-color",
    title: "Stuck on Mt. Pleasant",
    image: "public/images/stuck-on-mt-pleasant.JPEG",
    thumbnail: "public/images/thumbs/stuck-on-mt-pleasant.JPEG",
    date: "2018-10",
    medium: "Oil on canvas",
    dimensions: "24 x 24 inches",
    tags: ["abstract"],
    description: "",
  },
  {
    id: "house-on-the-prairie",
    era: "sound-in-color",
    title: "House on the Prairie",
    image: "public/images/house-on-the-prairie.JPEG",
    thumbnail: "public/images/thumbs/house-on-the-prairie.JPEG",
    date: "2018-11",
    medium: "Oil on canvas",
    dimensions: "24 x 24 inches",
    tags: ["abstract"],
    description: "",
  },
  {
    id: "currents",
    era: "sound-in-color",
    title: "Currents",
    image: "public/images/currents.JPEG",
    thumbnail: "public/images/thumbs/currents.JPEG",
    date: "2018-11",
    medium: "Oil on canvas",
    dimensions: "24 x 24 inches",
    tags: ["abstract"],
    description: "",
  },
  {
    id: "self-portrait-3",
    era: "sound-in-color",
    title: "Self Portrait #3",
    image: "public/images/self-portrait-3.JPEG",
    thumbnail: "public/images/thumbs/self-portrait-3.JPEG",
    date: "2018-11",
    medium: "Oil on canvas",
    dimensions: "24 x 24 inches",
    tags: ["abstract", "self portrait"],
    description: "",
  },
  {
    id: "under-pressure",
    era: "sound-in-color",
    title: "Under Pressure",
    image: "public/images/under-pressure.JPEG",
    thumbnail: "public/images/thumbs/under-pressure.JPEG",
    date: "2019-07",
    medium: "Oil on canvas",
    dimensions: "24 x 24 inches",
    tags: ["album cover"],
    description: "",
  },
  {
    id: "man-on-the-moon",
    era: "sound-in-color",
    title: "Man on the Moon",
    image: "public/images/man-on-the-moon.JPEG",
    thumbnail: "public/images/thumbs/man-on-the-moon.JPEG",
    date: "2020-10",
    medium: "Oil on canvas",
    dimensions: "24 x 24 inches",
    tags: ["abstract", "pattern"],
    description: "",
  },
  {
    id: "spiraliing-out",
    era: "patterned-infinity",
    title: "Spiraling Out",
    image: "public/images/spiraling-out.JPEG",
    thumbnail: "public/images/thumbs/spiraling-out.JPEG",
    date: "2021-01",
    medium: "Oil on canvas",
    dimensions: "24 x 24 inches",
    tags: ["abstract", "pattern"],
    description: "",
  },
  {
    id: "self-portrait-9",
    era: "patterned-infinity",
    title: "Self Portrait #9",
    image: "public/images/self-portrait-9.JPEG",
    thumbnail: "public/images/thumbs/self-portrait-9.JPEG",
    date: "2021-01",
    medium: "Oil on canvas",
    dimensions: "24 x 24 inches",
    tags: ["abstract", "pattern"],
    description: "",
  },
  {
    id: "abigail",
    era: "faces-and-foundations",
    title: "Abigail",
    image: "public/images/abigail.JPEG",
    thumbnail: "public/images/thumbs/abigail.JPEG",
    date: "2025-07",
    medium: "Oil on canvas",
    dimensions: "18 x 24 inches",
    tags: ["abstract", "pattern"],
    description: "",
  },
  {
    id: "flowers-in-vase-1",
    era: "patterned-infinity",
    title: "Flowers in Vase 1",
    image: "public/images/flowers-in-vase-1.JPEG",
    thumbnail: "public/images/thumbs/flowers-in-vase-1.JPEG",
    date: "2025-03",
    medium: "Oil on canvas",
    dimensions: "18 x 24 inches",
    tags: ["abstract", "pattern"],
    description: "",
  },
  {
    id: "ohio-stadium",
    era: "places-and-presence",
    title: "Ohio Stadium",
    image: "public/images/ohio-stadium.JPEG",
    thumbnail: "public/images/thumbs/ohio-stadium.JPEG",
    date: "2025-03",
    medium: "Oil on canvas",
    dimensions: "18 x 24 inches",
    tags: ["abstract", "pattern"],
    description: "",
  },
  {
    id: "davy-jones",
    era: "faces-and-foundations",
    title: "Davy Jones",
    image: "public/images/davy-jones.JPEG",
    thumbnail: "public/images/thumbs/davy-jones.JPEG",
    date: "2025-03",
    medium: "Oil on canvas",
    dimensions: "12 x 36 inches",
    tags: ["abstract", "pattern"],
    description: "",
  },
  {
    id: "van-gogh-self-portrait-with-grey-felt-hat",
    era: "faces-and-foundations",
    title: "Van Gogh: Self Portrait with Grey Felt Hat",
    image: "public/images/van-gogh-self-portrait-with-grey-felt-hat.JPEG",
    thumbnail: "public/images/thumbs/van-gogh-self-portrait-with-grey-felt-hat.JPEG",
    date: "2021-08",
    medium: "Oil on canvas",
    dimensions: "24 x 24 inches",
    tags: ["abstract", "pattern"],
    description: "",
  },
  {
    id: "patterns-2",
    era: "patterned-infinity",
    title: "Patterns #2",
    image: "public/images/patterns-2.JPEG",
    thumbnail: "public/images/thumbs/patterns-2.JPEG",
    date: "2020-09",
    medium: "Oil on canvas",
    dimensions: "8.5 x 11 inches",
    tags: ["abstract"],
    description: "",
  },
  {
    id: "patterns-1",
    era: "patterned-infinity",
    title: "Patterns #1",
    image: "public/images/patterns-1.JPEG",
    thumbnail: "public/images/thumbs/patterns-1.JPEG",
    date: "2020-09",
    medium: "Oil on canvas",
    dimensions: "8.5 x 11 inches",
    tags: ["abstract"],
    description: "",
  },
  {
    id: "patterns-3",
    era: "patterned-infinity",
    title: "Patterns #3",
    image: "public/images/patterns-3.JPEG",
    thumbnail: "public/images/thumbs/patterns-3.JPEG",
    date: "2020-09",
    medium: "Oil on canvas",
    dimensions: "8.5 x 11 inches",
    tags: ["abstract"],
    description: "",
  },
  {
    id: "seashells",
    era: "patterned-infinity",
    title: "Seashells",
    image: "public/images/seashells.JPEG",
    thumbnail: "public/images/thumbs/seashells.JPEG",
    date: "2020-09",
    medium: "Oil on canvas",
    dimensions: "8.5 x 11 inches",
    tags: ["abstract"],
    description: "",
  },
];

// ─── Utility helpers ──────────────────────────────────────────────────────────

/** Returns all eras in order. */
function getEras() {
  return ERAS;
}

/** Returns a single era by its id slug, or undefined if not found. */
function getEra(eraId) {
  return ERAS.find((e) => e.id === eraId);
}

/**
 * Returns a single painting by its id.
 * Attaches eraId and eraTitle for convenience.
 */
function getPainting(paintingId) {
  const painting = PAINTINGS.find((p) => p.id === paintingId);
  if (!painting) return null;
  const era = getEra(painting.era);
  return { ...painting, eraId: painting.era, eraTitle: era ? era.title : "" };
}

/**
 * Returns all paintings sorted chronologically, each with eraId and eraTitle attached.
 */
function getAllPaintings() {
  return PAINTINGS
    .map((p) => {
      const era = getEra(p.era);
      return { ...p, eraId: p.era, eraTitle: era ? era.title : "" };
    })
    .sort((a, b) => (a.date || "").localeCompare(b.date || ""));
}

/** Returns all paintings belonging to a specific era, sorted chronologically. */
function getPaintingsByEra(eraId) {
  return getAllPaintings().filter((p) => p.era === eraId);
}

/** Returns a sorted, deduplicated array of all tags used across all paintings. */
function getAllTags() {
  const tags = PAINTINGS.flatMap((p) => p.tags);
  return [...new Set(tags)].sort();
}

/** Returns a sorted, deduplicated array of all mediums used. */
function getAllMediums() {
  const mediums = PAINTINGS.filter((p) => p.medium).map((p) => p.medium.split(" on ")[0].trim());
  return [...new Set(mediums)].sort();
}

/** Returns related paintings (same era or shared tags), excluding the given painting. */
function getRelatedPaintings(paintingId, limit = 4) {
  const painting = getPainting(paintingId);
  if (!painting) return [];
  return getAllPaintings()
    .filter((p) => p.id !== paintingId)
    .map((p) => ({
      ...p,
      score:
        (p.era === painting.era ? 2 : 0) +
        p.tags.filter((t) => painting.tags.includes(t)).length,
    }))
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/** Returns aggregate stats about the collection. */
function getStats() {
  const all = getAllPaintings();
  return {
    total: all.length,
    eras: ERAS.length,
    tags: getAllTags().length,
    mediums: getAllMediums().length,
    earliest: all[0]?.date || null,
    latest: all[all.length - 1]?.date || null,
  };
}

/**
 * Builds the correct image URL for local dev and GitHub Pages.
 */
const BASE_PATH = location.hostname === "localhost" || location.hostname === "127.0.0.1" ? "" : "/painting-gallery";
function getImageUrl(path) {
  return BASE_PATH + "/" + path;
}

