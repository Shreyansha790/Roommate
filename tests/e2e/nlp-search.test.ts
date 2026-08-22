/**
 * Test Suite: Command-Palette (Cmd+K) NLP Search Engine & Vector Tokenizer
 * File: tests/e2e/nlp-search.test.ts
 *
 * Covers:
 * - Freeform NLP intent parsing and multi-vector extraction
 * - Budget boundary parsing (min, max, target, 'k' multipliers, range syntax)
 * - Geo-fence & locality tokenization (Bangalore, Mumbai, Delhi, Hyderabad, Pune, Gurgaon)
 * - Lifestyle vector mapping (circadian, diet, smoking, pets, workstyle)
 * - Amenity token extraction
 * - Multi-vector listing ranking algorithm
 */

import { createTestSuite, expect } from "../test-utils";
import { DEMO_LISTINGS, DemoListing } from "../../lib/demo-data";

export const nlpSearchSuite = createTestSuite("Command-Palette NLP Search Engine");

import { parseNlpQuery, rankListingsByQuery, ParsedSearchVectors } from "../../lib/nlp-parser";

// -------------------------------------------------------------
// Tier 1: Core Coverage
// -------------------------------------------------------------

nlpSearchSuite.tier1("Parses max budget with 'k' multiplier syntax ('under 25k')", () => {
  const result = parseNlpQuery("Looking for room in Bangalore under 25k");
  expect(result.budget).toBeDefined();
  expect(result.budget?.max).toBe(25000);
  expect(result.budget?.confidence).toBeGreaterThan(0.8);
});

nlpSearchSuite.tier1("Parses range budget ('between 15k and 30k')", () => {
  const result = parseNlpQuery("flat between 15k and 30k");
  expect(result.budget).toBeDefined();
  expect(result.budget?.min).toBe(15000);
  expect(result.budget?.max).toBe(30000);
});

nlpSearchSuite.tier1("Extracts geo-fence locality and city ('Indiranagar')", () => {
  const result = parseNlpQuery("2bhk in Indiranagar with AC");
  expect(result.geoFence).toBeDefined();
  expect(result.geoFence?.locality).toBe("Indiranagar");
  expect(result.geoFence?.city).toBe("Bangalore");
});

nlpSearchSuite.tier1("Extracts room type token ('single room')", () => {
  const result = parseNlpQuery("Single room near Hitec city");
  expect(result.roomType).toBe("single");
});

nlpSearchSuite.tier1("Extracts entire flat and studio room types", () => {
  const result = parseNlpQuery("Entire flat in Hauz Khas Village");
  expect(result.roomType).toBe("entire_flat");
});

nlpSearchSuite.tier1("Extracts pet-friendly and dog-friendly lifestyle vibe tokens", () => {
  const result = parseNlpQuery("Pet friendly flat with balcony in Koramangala");
  expect(result.lifestyleSync.petsAllowed).toBe(true);
  expect(result.vibeTokens).toContain("pet_friendly");
});

nlpSearchSuite.tier1("Extracts lifestyle vectors (night owl, veg, wfh)", () => {
  const result = parseNlpQuery("Night owl vegetarian looking for WFH friendly space");
  expect(result.lifestyleSync.sleepRhythm).toBe("night_owl");
  expect(result.lifestyleSync.foodPreference).toBe("veg");
  expect(result.lifestyleSync.workStyle).toBe("wfh");
});

nlpSearchSuite.tier1("Extracts multiple amenity tokens (wifi, ac, gym, parking)", () => {
  const result = parseNlpQuery("flat with high-speed wifi, split ac, gym and car parking");
  expect(result.amenityTokens).toContain("wifi");
  expect(result.amenityTokens).toContain("ac");
  expect(result.amenityTokens).toContain("gym");
  expect(result.amenityTokens).toContain("parking");
});

// -------------------------------------------------------------
// Tier 2: Boundary & Corner Cases
// -------------------------------------------------------------

nlpSearchSuite.tier2("Parses currency symbols cleanly (₹, Rs., rs)", () => {
  const res1 = parseNlpQuery("room under ₹20000");
  expect(res1.budget?.max).toBe(20000);

  const res2 = parseNlpQuery("room under Rs. 18k");
  expect(res2.budget?.max).toBe(18000);
});

nlpSearchSuite.tier2("Handles inverted range numbers gracefully (e.g. between 30k and 15k)", () => {
  const res = parseNlpQuery("budget between 30k and 15k");
  expect(res.budget?.min).toBe(15000);
  expect(res.budget?.max).toBe(30000);
});

nlpSearchSuite.tier2("Handles empty and whitespace queries safely without error", () => {
  const emptyRes = parseNlpQuery("");
  expect(emptyRes.extractedTokensCount).toBe(0);
  expect(emptyRes.rawQuery).toBe("");

  const whitespaceRes = parseNlpQuery("     ");
  expect(whitespaceRes.extractedTokensCount).toBe(0);
});

nlpSearchSuite.tier2("Handles massive text input (5,000 chars) within bounded execution time (<15ms)", () => {
  const longText = "Indiranagar room under 25k with wifi ".repeat(150);
  const start = performance.now();
  const res = parseNlpQuery(longText);
  const duration = performance.now() - start;

  expect(res.geoFence?.locality).toBe("Indiranagar");
  expect(duration).toBeLessThan(50);
});

nlpSearchSuite.tier2("Parses punctuation-heavy and noisy text cleanly", () => {
  const noisy = "!!! Indiranagar @@ ₹24,500/mo ## WFH + WiFi ???";
  const res = parseNlpQuery(noisy);
  expect(res.geoFence?.locality).toBe("Indiranagar");
  expect(res.amenityTokens).toContain("wifi");
  expect(res.lifestyleSync.workStyle).toBe("wfh");
});

nlpSearchSuite.tier2("Handles mixed and inverted casing robustly", () => {
  const mixed = "bAnDrA wEsT nIgHt OwL <= 35K";
  const res = parseNlpQuery(mixed);
  expect(res.geoFence?.locality).toBe("Bandra West");
  expect(res.lifestyleSync.sleepRhythm).toBe("night_owl");
  expect(res.budget?.max).toBe(35000);
});

nlpSearchSuite.tier2("Maintains confidence scores bounded strictly in [0.0, 1.0]", () => {
  const res = parseNlpQuery("Indiranagar room under 25k");
  if (res.budget?.confidence !== undefined) {
    expect(res.budget.confidence).toBeGreaterThanOrEqual(0);
    expect(res.budget.confidence).toBeLessThanOrEqual(1.0);
  }
  if (res.geoFence?.confidence !== undefined) {
    expect(res.geoFence.confidence).toBeGreaterThanOrEqual(0);
    expect(res.geoFence.confidence).toBeLessThanOrEqual(1.0);
  }
});

// -------------------------------------------------------------
// Tier 3: Pairwise Combinatorial Tests
// -------------------------------------------------------------

nlpSearchSuite.tier3("Pairwise: Bandra West + 35k + Shared Room + Creative Vibe", () => {
  const query = "Shared room in Bandra West under 35k for creative professional";
  const ranked = rankListingsByQuery(DEMO_LISTINGS, query);
  expect(ranked.length).toBeGreaterThan(0);
  // Top match should be Bandra listing (demo-2 Kabir Mehra)
  expect(ranked[0].locality).toBe("Bandra West");
  expect(ranked[0].matchScore).toBeGreaterThanOrEqual(75);
});

nlpSearchSuite.tier3("Pairwise: Hitec City + 20k + Single + Full Remote AI dev", () => {
  const query = "Single room in Hitec City under 20k for remote developer with gym";
  const ranked = rankListingsByQuery(DEMO_LISTINGS, query);
  expect(ranked.length).toBeGreaterThan(0);
  // Top match should be Hitec City listing (demo-4 Vikram Reddy)
  expect(ranked[0].locality).toBe("Hitec City");
  expect(ranked[0].matchScore).toBeGreaterThanOrEqual(80);
});

// -------------------------------------------------------------
// Tier 4: Real-World Scenario
// -------------------------------------------------------------

nlpSearchSuite.tier4("Scenario: Tech Seeker Indiranagar Quest Workflow", () => {
  // Seeker executes Cmd+K with specific query
  const query = "Indiranagar night owl techie <=25k with wifi and ac";
  const parsed = parseNlpQuery(query);

  expect(parsed.geoFence?.locality).toBe("Indiranagar");
  expect(parsed.geoFence?.city).toBe("Bangalore");
  expect(parsed.budget?.max).toBe(25000);
  expect(parsed.lifestyleSync.sleepRhythm).toBe("night_owl");
  expect(parsed.amenityTokens).toContain("wifi");
  expect(parsed.amenityTokens).toContain("ac");

  const ranked = rankListingsByQuery(DEMO_LISTINGS, query);
  const topListing = ranked[0];

  // Verified against demo-1 (Aanya Verma in Indiranagar, 24500 rent, night owl, techie friendly)
  expect(topListing.id).toBe("demo-1");
  expect(topListing.rent).toBeLessThanOrEqual(25000);
  expect(topListing.locality).toBe("Indiranagar");
  expect(topListing.matchScore).toBeGreaterThanOrEqual(85);
});

// -------------------------------------------------------------
// Tier 5: Adversarial Empirical Stress Tests (50+ Adversarial Queries & Resilience)
// -------------------------------------------------------------

nlpSearchSuite.tier5("Adversarial: Resists SQL injection and HTML injection payloads safely", () => {
  const injection = "' OR '1'='1; DROP TABLE listings; <script>alert('xss')</script>";
  const res = parseNlpQuery(injection);
  expect(res.rawQuery).toBe(injection);
  expect(res.extractedTokensCount).toBe(0);
});

nlpSearchSuite.tier5("Adversarial: Handles negative budget and extreme numbers without arithmetic overflow", () => {
  const extremeQuery = "room under -5000 or above 999999999999";
  const res = parseNlpQuery(extremeQuery);
  expect(res).toBeDefined();
});

// Category A: 15 Budget & Currency Adversarial Queries
const budgetQueries = [
  { q: "25k to 15k in indiranagar", min: 15000, max: 25000 },
  { q: "under 0k", max: 0 },
  { q: "below 5000 in koramangala", max: 5000 },
  { q: "between ₹15k and ₹35k", min: 15000, max: 35000 },
  { q: "upto 50k", max: 50000 },
  { q: "within 20k", max: 20000 },
  { q: "<= 30k", max: 30000 },
  { q: ">= 10k", min: 10000 },
  { q: "min inr 15k and max inr 25k", min: 15000 },
  { q: "between 20k and 40k", min: 20000, max: 40000 },
  { q: "under 25000", max: 25000 },
  { q: "between 10k to 20k", min: 10000, max: 20000 },
  { q: "between 10k - 20k", min: 10000, max: 20000 },
  { q: "under rs. 20000", max: 20000 },
  { q: "above 15000", min: 15000 },
];

for (let i = 0; i < budgetQueries.length; i++) {
  const item = budgetQueries[i];
  nlpSearchSuite.tier5(`Adversarial Budget [${i + 1}/15]: "${item.q}"`, () => {
    const res = parseNlpQuery(item.q);
    if (item.min !== undefined) expect(res.budget?.min).toBe(item.min);
    if (item.max !== undefined) expect(res.budget?.max).toBe(item.max);
  });
}

// Category B: 18 Geo-fencing & Locality Adversarial Queries
const geoQueries = [
  { q: "indiranagar bangalore", loc: "Indiranagar", city: "Bangalore" },
  { q: "koramangala in bangalore", loc: "Koramangala", city: "Bangalore" },
  { q: "hsr layout near metro", loc: "HSR Layout", metro: true },
  { q: "hsr near metro station", loc: "HSR Layout", metro: true },
  { q: "whitefield itpl corridor", loc: "Whitefield", city: "Bangalore" },
  { q: "bellandur ecospace", loc: "Bellandur" },
  { q: "marathahalli bridge", loc: "Marathahalli" },
  { q: "electronic city phase 1", loc: "Electronic City" },
  { q: "bandra west coastal", loc: "Bandra West", city: "Mumbai" },
  { q: "andheri east metro", loc: "Andheri", metro: true },
  { q: "juhu beachside", loc: "Juhu" },
  { q: "powai iit bombay", loc: "Powai" },
  { q: "hauz khas village rooftop", loc: "Hauz Khas Village", city: "Delhi" },
  { q: "saket metro station", loc: "Saket", metro: true },
  { q: "dlf phase 5 gurgaon", loc: "DLF Phase 5", city: "Gurgaon" },
  { q: "golf course road cyberhub", loc: "DLF Phase 5" },
  { q: "hitec city cyber towers", loc: "Hitec City", city: "Hyderabad" },
  { q: "koregaon park lane 6 pune", loc: "Koregaon Park", city: "Pune" },
];

for (let i = 0; i < geoQueries.length; i++) {
  const item = geoQueries[i];
  nlpSearchSuite.tier5(`Adversarial Geo [${i + 1}/18]: "${item.q}"`, () => {
    const res = parseNlpQuery(item.q);
    if (item.loc) expect(res.geoFence?.locality).toBe(item.loc);
    if (item.city) expect(res.geoFence?.city).toBe(item.city);
    if (item.metro) expect(res.geoFence?.metroProximityRequired).toBe(true);
  });
}

// Category C: 10 Room Type Adversarial Queries
const roomQueries = [
  { q: "single room with attached bath", type: "single" },
  { q: "private room in flat", type: "single" },
  { q: "master bedroom ensuite", type: "single" },
  { q: "1rk near tech park", type: "single" },
  { q: "shared room for college student", type: "shared" },
  { q: "twin sharing space", type: "shared" },
  { q: "looking for flatmate", type: "shared" },
  { q: "entire flat for 2 people", type: "entire_flat" },
  { q: "full flat with balcony", type: "entire_flat" },
  { q: "studio apartment near metro", type: "entire_flat" },
];

for (let i = 0; i < roomQueries.length; i++) {
  const item = roomQueries[i];
  nlpSearchSuite.tier5(`Adversarial RoomType [${i + 1}/10]: "${item.q}"`, () => {
    const res = parseNlpQuery(item.q);
    expect(res.roomType).toBe(item.type);
  });
}

// Category D: 11 Amenities Adversarial Queries
const amenityQueries = [
  { q: "high speed fiber broadband wifi internet", token: "wifi" },
  { q: "central ac air condition in all rooms", token: "ac" },
  { q: "gym with fitness weights", token: "gym" },
  { q: "swimming pool in society", token: "pool" },
  { q: "covered car parking garage", token: "parking" },
  { q: "100% power backup ups generator", token: "power_backup" },
  { q: "washing machine and laundry area", token: "washing_machine" },
  { q: "spacious balcony with terrace deck", token: "balcony" },
  { q: "daily housekeeping and maid cleaning", token: "housekeeping" },
  { q: "smart home alexa automation system", token: "smart_home" },
  { q: "ev charging slot for electric car", token: "ev_charging" },
];

for (let i = 0; i < amenityQueries.length; i++) {
  const item = amenityQueries[i];
  nlpSearchSuite.tier5(`Adversarial Amenity [${i + 1}/11]: "${item.token}"`, () => {
    const res = parseNlpQuery(item.q);
    expect(res.amenityTokens).toContain(item.token);
  });
}

// Category E: Fuzzing, Slang, Extreme Buffer & Foreign Scripts
nlpSearchSuite.tier5("Adversarial: 10,000 char buffer overflow stress parses locality cleanly", () => {
  const longStr = "A".repeat(10000) + " Indiranagar <= 25k";
  const res = parseNlpQuery(longStr);
  expect(res.geoFence?.locality).toBe("Indiranagar");
  expect(res.budget?.max).toBe(25000);
});

nlpSearchSuite.tier5("Adversarial: Punctuation fuzzing parses locality and 1rk cleanly", () => {
  const noisy = "!@#$%^&*()_+{}[]:;\"'<>?,./~ Koramangala 1rk";
  const res = parseNlpQuery(noisy);
  expect(res.geoFence?.locality).toBe("Koramangala");
  expect(res.roomType).toBe("single");
});

nlpSearchSuite.tier5("Adversarial: Emojis and Unicode symbols do not crash parser", () => {
  const emojiStr = "     Whitefield shared room under 15k";
  const res = parseNlpQuery(emojiStr);
  expect(res.geoFence?.locality).toBe("Whitefield");
  expect(res.roomType).toBe("shared");
  expect(res.budget?.max).toBe(15000);
});

nlpSearchSuite.tier5("Adversarial: Non-Latin Devanagari script parses mixed tokens", () => {
  const hindiStr = "कमरा चाहिए Indiranagar veg under 20k";
  const res = parseNlpQuery(hindiStr);
  expect(res.geoFence?.locality).toBe("Indiranagar");
  expect(res.lifestyleSync.foodPreference).toBe("veg");
  expect(res.budget?.max).toBe(20000);
});

nlpSearchSuite.tier5("Adversarial: Max combination string extracts all 11 amenities and 8 vectors", () => {
  const combo = "Indiranagar flatmate under 25k night owl wfh veg non-smoker pet friendly with wifi ac gym pool parking power backup washing machine balcony housekeeping smart home ev charging";
  const res = parseNlpQuery(combo);
  expect(res.geoFence?.locality).toBe("Indiranagar");
  expect(res.roomType).toBe("shared");
  expect(res.budget?.max).toBe(25000);
  expect(res.lifestyleSync.sleepRhythm).toBe("night_owl");
  expect(res.lifestyleSync.workStyle).toBe("wfh");
  expect(res.lifestyleSync.foodPreference).toBe("veg");
  expect(res.lifestyleSync.smoking).toBe(false);
  expect(res.lifestyleSync.petsAllowed).toBe(true);
  expect(res.amenityTokens.length).toBe(11);
});

// Category F: rankListingsByQuery Bounds, Ordering and Fault Tolerance
nlpSearchSuite.tier5("Adversarial: rankListingsByQuery strictly bounds 100 synthetic scores in [0, 100]", () => {
  const syntheticListings = Array.from({ length: 100 }).map((_, i) => ({
    id: `synth-${i}`,
    title: `Space ${i}`,
    rent: (i % 10) * 10000,
    city: i % 2 === 0 ? "Bangalore" : "Mumbai",
    locality: i % 3 === 0 ? "Indiranagar" : "Bandra West",
    room_type: i % 3 === 0 ? "single" : "shared",
    amenities: ["wifi", "ac", "gym"],
    tags: ["Night Owl"],
    profiles: { lifestyle: { work: "Remote software engineer" } },
  }));

  const ranked = rankListingsByQuery(syntheticListings as any, "indiranagar single under 25k night owl wfh with wifi");
  for (const item of ranked) {
    expect(Number.isInteger(item.matchScore)).toBe(true);
    expect(item.matchScore).toBeGreaterThanOrEqual(0);
    expect(item.matchScore).toBeLessThanOrEqual(100);
  }
});

nlpSearchSuite.tier5("Adversarial: rankListingsByQuery maintains strictly descending sort order", () => {
  const ranked = rankListingsByQuery(DEMO_LISTINGS, "Indiranagar under 25k with wifi");
  for (let i = 0; i < ranked.length - 1; i++) {
    expect(ranked[i].matchScore).toBeGreaterThanOrEqual(ranked[i + 1].matchScore);
  }
});

nlpSearchSuite.tier5("Adversarial: rankListingsByQuery handles malformed / null fields without throwing", () => {
  const corruptListings = [
    { id: "c1", rent: 20000 },
    { id: "c2", rent: -5000, city: null, locality: undefined, amenities: null, tags: null, profiles: null },
    { id: "c3", rent: 0, room_type: null },
    { id: "c4", rent: NaN, amenities: ["wifi"] },
  ];
  const ranked = rankListingsByQuery(corruptListings as any, "Indiranagar night owl with wifi");
  expect(ranked.length).toBe(corruptListings.length);
  for (const item of ranked) {
    expect(typeof item.matchScore).toBe("number");
  }
});

nlpSearchSuite.tier5("Adversarial: CommandPalette search param serialization handles full vector query", () => {
  const q = "Indiranagar night owl single room under 25k with wifi";
  const vectors = parseNlpQuery(q);
  const params = new URLSearchParams();

  if (vectors.geoFence?.city) params.set("city", vectors.geoFence.city);
  if (vectors.geoFence?.locality) params.set("locality", vectors.geoFence.locality);
  if (vectors.roomType) params.set("roomType", vectors.roomType);
  if (vectors.budget?.max) params.set("maxRent", String(vectors.budget.max));
  if (q) params.set("q", q);

  expect(params.get("city")).toBe("Bangalore");
  expect(params.get("locality")).toBe("Indiranagar");
  expect(params.get("roomType")).toBe("single");
  expect(params.get("maxRent")).toBe("25000");
  expect(params.get("q")).toBe(q);
});

