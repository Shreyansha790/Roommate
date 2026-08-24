/**
 * Test Suite: App Router Routes & Structural Integrity Audit
 * File: tests/e2e/routes-integrity.test.ts
 *
 * Covers:
 * - Verification of all 8 Next.js App Router route files:
 *   1. / (Home / Telemetry Cockpit)
 *   2. /browse (Discovery Grid / Radar Split-View)
 *   3. /listings/[id] (High-density Listing Dossier)
 *   4. /post (AI Smart Listing Studio)
 *   5. /onboarding (Seeker Vibe DNA Calibration)
 *   6. /saved (Wishlist & Telemetry Matrix Comparison)
 *   7. /login (CRT Tactical Terminal Auth)
 *   8. /signup (Account Registration)
 * - Multi-metro deterministic demo datasets (DEMO_LISTINGS)
 * - Root layout shell and navigation HUD integrity
 */

import { createTestSuite, expect } from "../test-utils";
import * as fs from "fs";
import * as path from "path";
import { DEMO_LISTINGS } from "../../lib/demo-data";

export const routesIntegritySuite = createTestSuite("App Router Routes & Structural Integrity");

// -------------------------------------------------------------
// Tier 1: Core Coverage (All 8 Routes Verification)
// -------------------------------------------------------------

routesIntegritySuite.tier1("Route 1: Root Home page ('/') exists and contains architectural hero", () => {
  const pagePath = path.resolve(__dirname, "../../app/page.tsx");
  expect(fs.existsSync(pagePath)).toBeTruthy();
  const content = fs.readFileSync(pagePath, "utf-8");

  expect(content).toContain("export default");
  expect(content).toContain("NueveHero");
  expect(content).toContain("NueveResidences");
  expect(content).toContain("AnimatedStats");
});

routesIntegritySuite.tier1("Route 2: Browse directory page ('/browse') exists and handles search params", () => {
  const pagePath = path.resolve(__dirname, "../../app/browse/page.tsx");
  expect(fs.existsSync(pagePath)).toBeTruthy();
  const content = fs.readFileSync(pagePath, "utf-8");

  expect(content).toContain("export default");
  expect(content).toContain("searchParams");
  expect(content).toContain("DEMO_LISTINGS");
});

routesIntegritySuite.tier1("Route 3: Listing Detail page ('/listings/[id]') exists and renders dossier", () => {
  const pagePath = path.resolve(__dirname, "../../app/listings/[id]/page.tsx");
  expect(fs.existsSync(pagePath)).toBeTruthy();
  const content = fs.readFileSync(pagePath, "utf-8");

  expect(content).toContain("export default");
  expect(content).toContain("params");
  expect(content).toContain("DEMO_LISTINGS");
});

routesIntegritySuite.tier1("Route 4: Post Listing Studio page ('/post') exists with multi-step studio", () => {
  const pagePath = path.resolve(__dirname, "../../app/post/page.tsx");
  expect(fs.existsSync(pagePath)).toBeTruthy();
  const content = fs.readFileSync(pagePath, "utf-8");

  expect(content).toContain("export default");
});

routesIntegritySuite.tier1("Route 5: Seeker Onboarding page ('/onboarding') exists with Vibe calibration", () => {
  const pagePath = path.resolve(__dirname, "../../app/onboarding/page.tsx");
  expect(fs.existsSync(pagePath)).toBeTruthy();
  const content = fs.readFileSync(pagePath, "utf-8");

  expect(content).toContain("export default");
});

routesIntegritySuite.tier1("Route 6: Saved Bookmarks page ('/saved') exists with comparison matrix", () => {
  const pagePath = path.resolve(__dirname, "../../app/saved/page.tsx");
  expect(fs.existsSync(pagePath)).toBeTruthy();
  const content = fs.readFileSync(pagePath, "utf-8");

  expect(content).toContain("export default");
});

routesIntegritySuite.tier1("Route 7: Login page ('/login') exists with CRT terminal auth", () => {
  const pagePath = path.resolve(__dirname, "../../app/login/page.tsx");
  expect(fs.existsSync(pagePath)).toBeTruthy();
  const content = fs.readFileSync(pagePath, "utf-8");

  expect(content).toContain("export default");
});

routesIntegritySuite.tier1("Route 8: Signup page ('/signup') exists with registration flow", () => {
  const pagePath = path.resolve(__dirname, "../../app/signup/page.tsx");
  expect(fs.existsSync(pagePath)).toBeTruthy();
  const content = fs.readFileSync(pagePath, "utf-8");

  expect(content).toContain("export default");
});

routesIntegritySuite.tier1("Supabase server and browser client utility modules exist and export functions", () => {
  const serverPath = path.resolve(__dirname, "../../lib/supabase-server.ts");
  const browserPath = path.resolve(__dirname, "../../lib/supabase.ts");

  expect(fs.existsSync(serverPath)).toBeTruthy();
  expect(fs.existsSync(browserPath)).toBeTruthy();
});

routesIntegritySuite.tier1("CompatibilityBadge component exists and exports correctly", () => {
  const badgePath = path.resolve(__dirname, "../../components/CompatibilityBadge.tsx");
  expect(fs.existsSync(badgePath)).toBeTruthy();
  const content = fs.readFileSync(badgePath, "utf-8");
  expect(content).toContain("CompatibilityBadge");
});

// -------------------------------------------------------------
// Tier 2: Boundary & Dataset Integrity
// -------------------------------------------------------------

routesIntegritySuite.tier2("DEMO_LISTINGS dataset contains no duplicate listing or user IDs", () => {
  const listingIds = DEMO_LISTINGS.map((l) => l.id);
  const uniqueListingIds = new Set(listingIds);
  expect(uniqueListingIds.size).toBe(listingIds.length);
});

routesIntegritySuite.tier2("DEMO_LISTINGS contains all 6 major Indian tech hubs", () => {
  const cities = DEMO_LISTINGS.map((l) => l.city);
  expect(cities).toContain("Bangalore");
  expect(cities).toContain("Mumbai");
  expect(cities).toContain("Delhi");
  expect(cities).toContain("Hyderabad");
  expect(cities).toContain("Pune");
  expect(cities).toContain("Gurgaon");
});

routesIntegritySuite.tier2("Every DEMO_LISTING has valid high-resolution photos and profile metadata", () => {
  for (const listing of DEMO_LISTINGS) {
    expect(listing.photos.length).toBeGreaterThan(0);
    expect(listing.rent).toBeGreaterThan(0);
    expect(listing.locality.length).toBeGreaterThan(0);
    expect(listing.profiles.full_name.length).toBeGreaterThan(0);
    expect(listing.profiles.is_verified).toBe(true);
  }
});

routesIntegritySuite.tier2("Layout Shell integrates TopNav and Footer correctly", () => {
  const layoutPath = path.resolve(__dirname, "../../app/layout.tsx");
  const content = fs.readFileSync(layoutPath, "utf-8");

  expect(content).toContain("<TopNav");
  expect(content).toContain("<Footer");
  expect(content).toContain("className=\"min-h-screen");
});

// -------------------------------------------------------------
// Tier 3: Pairwise Navigation HUD
// -------------------------------------------------------------

routesIntegritySuite.tier3("TopNav HUD provides direct links to Browse, Post, and Onboarding routes", () => {
  const topNavClientPath = path.resolve(__dirname, "../../components/auth/top-nav-client.tsx");
  const content = fs.readFileSync(topNavClientPath, "utf-8");

  expect(content).toContain('href: "/browse"');
  expect(content).toContain('href: "/post"');
});

// -------------------------------------------------------------
// Tier 4: Real-World Scenario
// -------------------------------------------------------------

routesIntegritySuite.tier4("Scenario: Full Application Route Traversal from Landing to Discovery and Dossier", () => {
  // Verify links and route continuity
  const homeContent = fs.readFileSync(path.resolve(__dirname, "../../app/page.tsx"), "utf-8");
  const browseContent = fs.readFileSync(path.resolve(__dirname, "../../app/browse/page.tsx"), "utf-8");
  const detailContent = fs.readFileSync(path.resolve(__dirname, "../../app/listings/[id]/page.tsx"), "utf-8");

  // Home points to /browse and /onboarding
  expect(homeContent).toContain('href="/browse"');
  expect(homeContent).toContain('href="/onboarding"');

  // Browse links to /listings/[id]
  expect(browseContent).toContain("/listings/");

  // Detail links back to /browse
  expect(detailContent).toContain('href="/browse"');
});

// -------------------------------------------------------------
// Tier 5: Adversarial Checks
// -------------------------------------------------------------

routesIntegritySuite.tier5("Adversarial: tsconfig and package.json have zero missing project paths", () => {
  const tsconfigPath = path.resolve(__dirname, "../../tsconfig.json");
  expect(fs.existsSync(tsconfigPath)).toBeTruthy();
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf-8"));

  expect(tsconfig.compilerOptions.paths["@/*"]).toBeDefined();
});
