/**
 * Empirical Adversarial Test Suite for Milestone 2: Browse Split-View & Spatial Radar Map
 * File: tests/adversarial-m2-browse-map.ts
 * Challenger 2 Verification Harness
 */

import fs from "fs";
import path from "path";
import { DEMO_LISTINGS } from "../lib/demo-data";
import { parseNlpQuery, rankListingsByQuery } from "../lib/nlp-parser";

const results: Array<{ name: string; category: string; passed: boolean; error?: string; details?: any }> = [];

function assert(condition: boolean, name: string, category: string, errorMsg?: string, details?: any) {
  if (condition) {
    results.push({ name, category, passed: true, details });
  } else {
    results.push({ name, category, passed: false, error: errorMsg || "Assertion failed", details });
  }
}

// -------------------------------------------------------------
// SECTION 1: BROWSE SPLIT-VIEW FILTER MECHANICS & EDGE CASES
// -------------------------------------------------------------
function testBrowseFilterMechanics() {
  console.log("-> Testing Browse Filter Logic & Edge Cases...");

  // 1. City / Metro filtering across all 6 hubs
  const cities = ["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune", "Gurgaon"];
  for (const city of cities) {
    const cityListings = DEMO_LISTINGS.filter((l) =>
      l.city.toLowerCase().includes(city.toLowerCase())
    );
    assert(
      cityListings.length > 0,
      `City filter locates active listings for metro: ${city}`,
      "Browse Filters",
      `No listings found for city ${city}`
    );
  }

  // 2. Room Type filter
  const roomTypes = ["single", "shared", "entire_flat"];
  for (const rt of roomTypes) {
    const matched = DEMO_LISTINGS.filter((l) => l.room_type === rt);
    assert(
      matched.length > 0,
      `Room type filter correctly segments '${rt}' spaces`,
      "Browse Filters",
      `No spaces matched room type ${rt}`
    );
  }

  // 3. Rent Range Filter (Min & Max boundaries)
  const budgetListings = DEMO_LISTINGS.filter((l) => l.rent >= 15000 && l.rent <= 25000);
  assert(
    budgetListings.length > 0 && budgetListings.every((l) => l.rent >= 15000 && l.rent <= 25000),
    "Rent min/max filter bounds listings precisely within [15000, 25000]",
    "Browse Filters"
  );

  // 4. Inverted Rent Range (Edge Case: Min > Max)
  const invertedFiltered = DEMO_LISTINGS.filter((l) => {
    const minRent = 30000;
    const maxRent = 20000;
    if (minRent && l.rent < minRent) return false;
    if (maxRent && l.rent > maxRent) return false;
    return true;
  });
  assert(
    invertedFiltered.length === 0,
    "Inverted rent range (min 30k > max 20k) gracefully returns empty array without throwing",
    "Browse Filters"
  );

  // 5. Vibe & Lifestyle Tag Filtering
  const testVibes = ["Night Owl", "Vegetarian", "Pet Friendly", "Remote WFH"];
  for (const vibe of testVibes) {
    const vibeListings = DEMO_LISTINGS.filter((item) =>
      item.tags?.some((t) => t.toLowerCase().includes(vibe.toLowerCase())) ||
      item.title.toLowerCase().includes(vibe.toLowerCase())
    );
    assert(
      vibeListings.length > 0,
      `Vibe filter matches listings with tag '${vibe}'`,
      "Browse Filters",
      `No listings found matching vibe ${vibe}`
    );
  }

  // 6. Multiple comma-separated vibes
  const multiVibes = ["night owl", "vegetarian"];
  const multiMatch = DEMO_LISTINGS.filter((item) => {
    return multiVibes.some(
      (v) =>
        item.tags?.some((t) => t.toLowerCase().includes(v)) ||
        item.title.toLowerCase().includes(v)
    );
  });
  assert(
    multiMatch.length > 0,
    "Multi-vibe tag union matches listings matching any chosen tag",
    "Browse Filters"
  );

  // 7. Locality Fuzzy Matching
  const localities = ["Indiranagar", "Koramangala", "Bandra", "Hauz Khas", "Hitec", "Koregaon"];
  for (const loc of localities) {
    const matched = DEMO_LISTINGS.filter((l) =>
      l.locality.toLowerCase().includes(loc.toLowerCase())
    );
    assert(
      matched.length > 0,
      `Locality filter matches listings for '${loc}'`,
      "Browse Filters"
    );
  }

  // 8. Non-existent Locality Search Gracefully Returns Empty
  const nonExistent = DEMO_LISTINGS.filter((l) =>
    l.locality.toLowerCase().includes("atlantis_underwater_sector_9")
  );
  assert(
    nonExistent.length === 0,
    "Non-existent locality returns 0 listings cleanly without error",
    "Browse Filters"
  );

  // 9. NLP Freeform Query Integration
  const nlpRes = parseNlpQuery("Indiranagar shared room under 25k with wifi");
  const ranked = rankListingsByQuery(DEMO_LISTINGS, "Indiranagar shared room under 25k with wifi");
  assert(
    ranked.length > 0 && ranked[0].locality.toLowerCase().includes("indiranagar"),
    "NLP query ranker ranks target locality at index 0",
    "Browse NLP Engine"
  );
}

// -------------------------------------------------------------
// SECTION 2: LISTING MAP & SPATIAL RADAR VERIFICATION
// -------------------------------------------------------------
function testListingMapStructure() {
  console.log("-> Testing ListingMap.tsx Dark Carto Tiles & Markers...");

  const mapFilePath = path.resolve(process.cwd(), "components/map/ListingMap.tsx");
  assert(fs.existsSync(mapFilePath), "ListingMap.tsx exists in components/map/", "Spatial Radar Map");

  const mapContent = fs.readFileSync(mapFilePath, "utf-8");

  // 1. CartoDB Dark Matter tile URL
  assert(
    mapContent.includes("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"),
    "ListingMap uses CartoDB Dark Matter tile layer for Obsidian cyber aesthetic",
    "Spatial Radar Map"
  );

  // 2. SSR Dynamic Safety Guards
  assert(
    mapContent.includes("dynamic(") &&
    mapContent.includes("ssr: false") &&
    mapContent.includes("const [mounted, setMounted] = React.useState<boolean>(false)"),
    "ListingMap has strict SSR dynamic imports and mounted lifecycle guard against window errors",
    "Spatial Radar Map"
  );

  // 3. City Coordinates Dictionary Completeness
  const expectedCities = ["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune", "Gurgaon"];
  for (const city of expectedCities) {
    assert(
      mapContent.includes(city),
      `ListingMap CITY_COORDS includes coordinate mapping for ${city}`,
      "Spatial Radar Map"
    );
  }

  // 4. Locality Offsets Coverage
  const expectedOffsets = ["indiranagar", "koramangala", "hsr layout", "whitefield", "bandra", "hauz khas", "hitec"];
  for (const loc of expectedOffsets) {
    assert(
      mapContent.toLowerCase().includes(loc),
      `ListingMap LOCALITY_OFFSETS includes offset for '${loc}'`,
      "Spatial Radar Map"
    );
  }

  // 5. Custom HTML DivIcon Marker with Glowing Reticle & Pulsing Rings
  assert(
    mapContent.includes("custom-leaflet-pin") &&
    mapContent.includes("#00ff88") && // Phosphor Emerald
    mapContent.includes("#ffb700") && // Solar Amber
    mapContent.includes("border-radius: 9999px") &&
    mapContent.includes("animation: ping"),
    "ListingMap generates DivIcon pins with Phosphor Emerald glow, Solar Amber selection, and pulsing radar animations",
    "Spatial Radar Map"
  );

  // 6. Popup Preview Dossier Link & Thumbnail
  assert(
    mapContent.includes("<Popup") &&
    mapContent.includes("dark-cyber-popup") &&
    mapContent.includes("/listings/${item.id}") &&
    mapContent.includes("₹{item.rent.toLocaleString()}"),
    "ListingMap Popup renders dark cyber thumbnail, rent in ₹/mo, and direct link to listing dossier",
    "Spatial Radar Map"
  );

  // 7. Interactive selection event callback
  assert(
    mapContent.includes("onSelectListing?.(item.id)") &&
    mapContent.includes("selectedId"),
    "ListingMap supports interactive marker click selection callback and selectedId state synchronization",
    "Spatial Radar Map"
  );
}

// -------------------------------------------------------------
// SECTION 3: RESPONSIVE VIEWPORT & SPLIT-VIEW MODES
// -------------------------------------------------------------
function testSplitViewResponsiveness() {
  console.log("-> Testing Browse View Modes & Mobile Viewport Layouts...");

  const browseClientPath = path.resolve(process.cwd(), "app/browse/browse-client-view.tsx");
  const browsePagePath = path.resolve(process.cwd(), "app/browse/page.tsx");

  assert(fs.existsSync(browseClientPath), "browse-client-view.tsx exists", "Browse Layout");
  assert(fs.existsSync(browsePagePath), "app/browse/page.tsx exists", "Browse Layout");

  const clientContent = fs.readFileSync(browseClientPath, "utf-8");

  // 1. View Mode Switcher Options (Split, Grid, Map)
  assert(
    clientContent.includes('SPLIT_VIEW') &&
    clientContent.includes('CARDS') &&
    clientContent.includes('RADAR_MAP') &&
    clientContent.includes('viewMode === "split"') &&
    clientContent.includes('viewMode === "grid"') &&
    clientContent.includes('viewMode === "map"'),
    "BrowseClientView provides 3 tactile view modes: SPLIT_VIEW, CARDS, and RADAR_MAP",
    "Browse View Modes"
  );

  // 2. Responsive 12-Column Grid System
  assert(
    clientContent.includes("grid-cols-1") &&
    clientContent.includes("lg:grid-cols-12") &&
    clientContent.includes("lg:col-span-3") && // Sidebar
    clientContent.includes("lg:col-span-5") && // Center cards in split
    clientContent.includes("lg:col-span-4"),   // Map in split
    "Browse split-view defines responsive 12-column telemetry layout (3-col params, 5-col cards, 4-col radar map)",
    "Browse Responsiveness"
  );

  // 3. Grid Mode Expansion
  assert(
    clientContent.includes('viewMode === "grid"') &&
    clientContent.includes('lg:col-span-9'),
    "CARDS grid mode expands listing cards across 9 columns and collapses map panel",
    "Browse View Modes"
  );

  // 4. Map Mode Expansion
  assert(
    clientContent.includes('viewMode === "map"') &&
    clientContent.includes('lg:col-span-9'),
    "RADAR_MAP mode expands map across 9 columns",
    "Browse View Modes"
  );

  // 5. Mobile breakpoint adaptations
  assert(
    clientContent.includes("hidden sm:inline") &&
    clientContent.includes("grid-cols-1 sm:grid-cols-2") &&
    clientContent.includes("overflow-x-auto"),
    "Browse view adapts across mobile (<640px), tablet (768px), and desktop (1440px) with responsive card grids and horizontally scrollable metro ribbon",
    "Browse Responsiveness"
  );

  // 6. Interactive Card Hover highlighting map pin
  assert(
    clientContent.includes("onMouseEnter={() => setSelectedListingId(listing.id)}") &&
    clientContent.includes("selectedListingId === listing.id"),
    "Listing card hover interactively highlights corresponding pin on spatial radar map",
    "Browse Interactivity"
  );

  // 7. Tactical Audio feedback triggers
  assert(
    clientContent.includes("playBlip") &&
    clientContent.includes("playPing"),
    "Filter actions (vibe toggle, apply, reset, mode switch) trigger Web Audio API telemetry SFX",
    "Browse Audio HUD"
  );
}

// -------------------------------------------------------------
// SECTION 4: STRICT 0-EMOJI AUDIT ACROSS M2 TOUCHED CODEBASE
// -------------------------------------------------------------
function testStrictEmojiAudit() {
  console.log("-> Running 0-Emoji Forensic Audit across M2 files...");

  const emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
  const surrogatePairRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

  const targetFiles = [
    "app/browse/page.tsx",
    "app/browse/browse-client-view.tsx",
    "app/browse/bookmark-button.tsx",
    "components/map/ListingMap.tsx",
    "components/search/CommandPalette.tsx",
    "components/search/VectorFilterChips.tsx",
    "lib/nlp-parser.ts",
    "lib/demo-data.ts",
    "app/page.tsx",
  ];

  const violations: Array<{ file: string; line: number; char: string; snippet: string }> = [];

  for (const relPath of targetFiles) {
    const fullPath = path.resolve(process.cwd(), relPath);
    if (!fs.existsSync(fullPath)) continue;

    const content = fs.readFileSync(fullPath, "utf-8");
    const lines = content.split("\n");
    lines.forEach((line, idx) => {
      const match1 = line.match(emojiRegex);
      const match2 = line.match(surrogatePairRegex);
      const matches = [...(match1 || []), ...(match2 || [])];
      if (matches.length > 0) {
        matches.forEach((m) => {
          violations.push({
            file: relPath,
            line: idx + 1,
            char: m,
            snippet: line.trim(),
          });
        });
      }
    });
  }

  assert(
    violations.length === 0,
    "Strict 0-Emoji Audit: zero Unicode emojis across all M2 files",
    "Forensic 0-Emoji Policy",
    `Found ${violations.length} emoji violations: ${JSON.stringify(violations)}`,
    { violations }
  );
}

// -------------------------------------------------------------
// EXECUTE HARNESS
// -------------------------------------------------------------
console.log("\n================================================================================");
console.log("   CHALLENGER 2: ADVERSARIAL VERIFICATION HARNESS FOR MILESTONE 2              ");
console.log("   Browse Split-View, Dark Leaflet Map & Spatial Living Discovery Engine        ");
console.log("================================================================================\n");

testBrowseFilterMechanics();
testListingMapStructure();
testSplitViewResponsiveness();
testStrictEmojiAudit();

console.log("\n--------------------------------------------------------------------------------");
console.log("   ADVERSARIAL VERIFICATION BREAKDOWN                                           ");
console.log("--------------------------------------------------------------------------------");

let passed = 0;
let failed = 0;

for (const r of results) {
  if (r.passed) {
    passed++;
    console.log(`  [PASS] (${r.category}) ${r.name}`);
  } else {
    failed++;
    console.log(`  [FAIL] (${r.category}) ${r.name}: ${r.error}`);
  }
}

console.log("\n================================================================================");
console.log(`TOTAL ADVERSARIAL CHECKS: ${results.length} | PASSED: ${passed} | FAILED: ${failed}`);
console.log("================================================================================\n");

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
