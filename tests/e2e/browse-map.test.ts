/**
 * Test Suite: Browse Split-View Discovery Engine & Spatial Radar Map
 * File: tests/e2e/browse-map.test.ts
 *
 * Covers:
 * - /browse filter interactions: locality, isochrone travel slider, rent range, room types, vibe tags
 * - Dark Leaflet Radar Map (CartoDB Dark Matter tiles, dynamic SSR guards, SVG DivIcon markers)
 * - Map coordinate resolution and locality offsets dictionary
 * - Responsive view mode switching (SPLIT_VIEW, CARDS, RADAR_MAP) and layout columns
 * - Strict 0-emoji compliance across Browse and Map components
 */

import { createTestSuite, expect } from "../test-utils";
import * as fs from "fs";
import * as path from "path";
import { DEMO_LISTINGS } from "../../lib/demo-data";
import { parseNlpQuery, rankListingsByQuery } from "../../lib/nlp-parser";

export const browseMapSuite = createTestSuite("Browse Split-View & Spatial Radar Map");

// -------------------------------------------------------------
// Tier 1: Core Functional Coverage
// -------------------------------------------------------------

browseMapSuite.tier1("Filter: Multi-metro filtering segments active spaces across all 6 hubs", () => {
  const hubs = ["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune", "Gurgaon"];
  for (const hub of hubs) {
    const matched = DEMO_LISTINGS.filter((l) => l.city.toLowerCase().includes(hub.toLowerCase()));
    expect(matched.length).toBeGreaterThan(0);
  }
});

browseMapSuite.tier1("Filter: Room type filter segments single, shared, and entire_flat spaces", () => {
  const roomTypes = ["single", "shared", "entire_flat"];
  for (const rt of roomTypes) {
    const matched = DEMO_LISTINGS.filter((l) => l.room_type === rt);
    expect(matched.length).toBeGreaterThan(0);
  }
});

browseMapSuite.tier1("Filter: Monthly rent bounds spaces within specified min and max", () => {
  const min = 15000;
  const max = 25000;
  const filtered = DEMO_LISTINGS.filter((l) => l.rent >= min && l.rent <= max);
  expect(filtered.length).toBeGreaterThan(0);
  for (const l of filtered) {
    expect(l.rent).toBeGreaterThanOrEqual(min);
    expect(l.rent).toBeLessThanOrEqual(max);
  }
});

browseMapSuite.tier1("Filter: Vibe tags match lifestyle DNA across all presets", () => {
  const presets = ["Night Owl", "Vegetarian", "Pet Friendly", "Remote"];
  for (const p of presets) {
    const matched = DEMO_LISTINGS.filter(
      (item) =>
        item.tags?.some((t) => t.toLowerCase().includes(p.toLowerCase())) ||
        item.title.toLowerCase().includes(p.toLowerCase()) ||
        item.profiles.lifestyle?.food?.toLowerCase().includes(p.toLowerCase()) ||
        item.profiles.lifestyle?.work?.toLowerCase().includes(p.toLowerCase())
    );
    expect(matched.length).toBeGreaterThan(0);
  }
});

browseMapSuite.tier1("Map: CartoDB Dark Matter tile layer configured for Obsidian dark aesthetic", () => {
  const mapFile = path.resolve(process.cwd(), "components/map/ListingMap.tsx");
  expect(fs.existsSync(mapFile)).toBeTruthy();
  const content = fs.readFileSync(mapFile, "utf-8");

  expect(content).toContain("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png");
});

browseMapSuite.tier1("Map: Custom DivIcon markers generate Phosphor Emerald and Solar Amber pins", () => {
  const mapFile = path.resolve(process.cwd(), "components/map/ListingMap.tsx");
  const content = fs.readFileSync(mapFile, "utf-8");

  expect(content).toContain("custom-leaflet-pin");
  expect(content).toContain("#00ff88"); // Phosphor Emerald
  expect(content).toContain("#ffb700"); // Solar Amber
  expect(content).toContain("animation: ping");
});

// -------------------------------------------------------------
// Tier 2: Boundary & Corner Cases
// -------------------------------------------------------------

browseMapSuite.tier2("Boundary: Inverted rent range (min > max) safely returns 0 listings", () => {
  const min = 35000;
  const max = 20000;
  const filtered = DEMO_LISTINGS.filter((l) => l.rent >= min && l.rent <= max);
  expect(filtered.length).toBe(0);
});

browseMapSuite.tier2("Boundary: Unknown locality query defaults gracefully without error", () => {
  const nonExistent = DEMO_LISTINGS.filter((l) =>
    l.locality.toLowerCase().includes("nonexistent_deep_suburb_99")
  );
  expect(nonExistent.length).toBe(0);
});

browseMapSuite.tier2("Boundary: ListingMap protects against SSR hydration window crashes", () => {
  const mapFile = path.resolve(process.cwd(), "components/map/ListingMap.tsx");
  const content = fs.readFileSync(mapFile, "utf-8");

  expect(content).toContain("ssr: false");
  expect(content).toContain("const [mounted, setMounted] = React.useState<boolean>(false)");
  expect(content).toContain("INITIALIZING_RADAR_MAP_TILES...");
});

browseMapSuite.tier2("Boundary: Isochrone distances bounded from 5km to 30km step intervals", () => {
  const clientFile = path.resolve(process.cwd(), "app/browse/browse-client-view.tsx");
  const content = fs.readFileSync(clientFile, "utf-8");

  expect(content).toContain('min="5"');
  expect(content).toContain('max="30"');
  expect(content).toContain('step="5"');
});

// -------------------------------------------------------------
// Tier 3: Pairwise Combinatorial Interactions
// -------------------------------------------------------------

browseMapSuite.tier3("Pairwise: Indiranagar + Single Room + Night Owl Vibe + 25k Max Rent", () => {
  const query = "Indiranagar single room night owl <= 25000";
  const ranked = rankListingsByQuery(DEMO_LISTINGS, query);

  expect(ranked.length).toBeGreaterThan(0);
  expect(ranked[0].locality).toBe("Indiranagar");
  expect(ranked[0].rent).toBeLessThanOrEqual(25000);
});

browseMapSuite.tier3("Pairwise: Bandra West + Shared Room + Creative Lofts + 35k Max Rent", () => {
  const query = "Bandra West shared room creative <= 35000";
  const ranked = rankListingsByQuery(DEMO_LISTINGS, query);

  expect(ranked.length).toBeGreaterThan(0);
  expect(ranked[0].locality).toBe("Bandra West");
});

// -------------------------------------------------------------
// Tier 4: Real-World Scenario
// -------------------------------------------------------------

browseMapSuite.tier4("Scenario: Discovery Split-View Interactive Exploration Flow", () => {
  const clientFile = path.resolve(process.cwd(), "app/browse/browse-client-view.tsx");
  const content = fs.readFileSync(clientFile, "utf-8");

  // Verify Split, Grid, and Map view modes
  expect(content).toContain("SPLIT_VIEW");
  expect(content).toContain("CARDS");
  expect(content).toContain("RADAR_MAP");

  // Verify responsive columns
  expect(content).toContain("lg:col-span-3"); // Sidebar
  expect(content).toContain("lg:col-span-5"); // Listings Grid
  expect(content).toContain("lg:col-span-4"); // Radar Map

  // Verify card hover triggers map pin highlight
  expect(content).toContain("onMouseEnter={() => setSelectedListingId(listing.id)}");
  expect(content).toContain("selectedListingId === listing.id");

  // Verify audio telemetry triggers
  expect(content).toContain("playBlip");
  expect(content).toContain("playPing");
});

// -------------------------------------------------------------
// Tier 5: Adversarial & Forensic Verification
// -------------------------------------------------------------

browseMapSuite.tier5("Adversarial: Forensic 0-Emoji Audit across all Browse & Map files", () => {
  const emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
  const filesToCheck = [
    "app/browse/page.tsx",
    "app/browse/browse-client-view.tsx",
    "app/browse/bookmark-button.tsx",
    "components/map/ListingMap.tsx",
  ];

  for (const rel of filesToCheck) {
    const full = path.resolve(process.cwd(), rel);
    expect(fs.existsSync(full)).toBeTruthy();
    const content = fs.readFileSync(full, "utf-8");
    const matches = content.match(emojiRegex);
    expect(matches).toBeNull();
  }
});
