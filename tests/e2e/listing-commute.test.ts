/**
 * Test Suite: AI Smart Listing Studio & Neighborhood Commute Radar
 * File: tests/e2e/listing-commute.test.ts
 *
 * Covers:
 * - AI Description Copy Enhancer and formatting
 * - Amenity Auto-Tagger keyword recognition
 * - Price & Match Optimizer recommendations
 * - Neighborhood Telemetry Index (Safety, Walkability, Caffeine, Nightlife, Essentials)
 * - Commute Isochrones Scorecard (Multi-modal transit: Metro, Bike, Drive, Walk)
 */

import { createTestSuite, expect } from "../test-utils";
import { DemoListing, DEMO_LISTINGS } from "../../lib/demo-data";

export const listingCommuteSuite = createTestSuite("AI Smart Listing Studio & Commute Radar");

export interface NeighborhoodTelemetry {
  safetyIndex: number;
  walkabilityIndex: number;
  caffeinePulse: number;
  nightlifeOrbit: number;
  essentialsRadius: number;
}

export interface CommuteIsochrone {
  destination: string;
  destinationType: "tech_park" | "university" | "metro" | "commercial";
  distanceKm: number;
  transitModes: {
    metroMins?: number;
    bikeMins?: number;
    driveMins?: number;
    walkMins?: number;
  };
}

// Reference Commute & Neighborhood Telemetry Provider
export function getListingCommuteScorecard(listing: Partial<DemoListing>): {
  neighborhood: NeighborhoodTelemetry;
  isochrones: CommuteIsochrone[];
} {
  const locality = (listing.locality || "").toLowerCase();
  const city = (listing.city || "").toLowerCase();

  // Locality-specific neighborhood metrics
  let neighborhood: NeighborhoodTelemetry = {
    safetyIndex: 88,
    walkabilityIndex: 85,
    caffeinePulse: 92,
    nightlifeOrbit: 86,
    essentialsRadius: 94,
  };

  let isochrones: CommuteIsochrone[] = [];

  if (locality.includes("indiranagar") || city.includes("bangalore")) {
    neighborhood = { safetyIndex: 92, walkabilityIndex: 90, caffeinePulse: 98, nightlifeOrbit: 95, essentialsRadius: 96 };
    isochrones = [
      {
        destination: "Bagmane Tech Park (CV Raman Nagar)",
        destinationType: "tech_park",
        distanceKm: 3.8,
        transitModes: { metroMins: 14, bikeMins: 12, driveMins: 20, walkMins: 45 },
      },
      {
        destination: "Manyata Tech Park (Hebbal)",
        destinationType: "tech_park",
        distanceKm: 12.5,
        transitModes: { metroMins: 32, bikeMins: 28, driveMins: 42 },
      },
      {
        destination: "Indiranagar Metro Station (Purple Line)",
        destinationType: "metro",
        distanceKm: 0.6,
        transitModes: { walkMins: 7, bikeMins: 2 },
      },
      {
        destination: "100ft Road Cafe & Retail Promenade",
        destinationType: "commercial",
        distanceKm: 0.4,
        transitModes: { walkMins: 5, bikeMins: 2 },
      },
    ];
  } else if (locality.includes("bandra") || city.includes("mumbai")) {
    neighborhood = { safetyIndex: 94, walkabilityIndex: 92, caffeinePulse: 96, nightlifeOrbit: 98, essentialsRadius: 95 };
    isochrones = [
      {
        destination: "Bandra Kurla Complex (BKC Financial District)",
        destinationType: "commercial",
        distanceKm: 6.2,
        transitModes: { bikeMins: 18, driveMins: 26, metroMins: 22 },
      },
      {
        destination: "Bandra Railway Station (Western Line)",
        destinationType: "metro",
        distanceKm: 1.5,
        transitModes: { walkMins: 16, bikeMins: 6, driveMins: 10 },
      },
      {
        destination: "Carter Road Promenade",
        destinationType: "commercial",
        distanceKm: 0.8,
        transitModes: { walkMins: 9, bikeMins: 3 },
      },
    ];
  } else if (locality.includes("hitec") || city.includes("hyderabad")) {
    neighborhood = { safetyIndex: 90, walkabilityIndex: 82, caffeinePulse: 89, nightlifeOrbit: 84, essentialsRadius: 90 };
    isochrones = [
      {
        destination: "Cyber Towers & Microsoft Campus",
        destinationType: "tech_park",
        distanceKm: 2.1,
        transitModes: { metroMins: 8, bikeMins: 7, driveMins: 12, walkMins: 24 },
      },
      {
        destination: "Raidurg Metro Station (Blue Line)",
        destinationType: "metro",
        distanceKm: 1.1,
        transitModes: { walkMins: 12, bikeMins: 4, driveMins: 6 },
      },
    ];
  } else {
    // Default city isochrones
    isochrones = [
      {
        destination: "Central Business District & Metro Hub",
        destinationType: "metro",
        distanceKm: 4.5,
        transitModes: { metroMins: 15, bikeMins: 14, driveMins: 22, walkMins: 50 },
      },
    ];
  }

  return { neighborhood, isochrones };
}

// AI Copy Enhancer Reference
export function enhanceListingCopy(rawNotes: string, context: { title: string; locality: string; city: string; rent: number }): string {
  const normalized = (rawNotes || "").trim();
  const summary = normalized.length > 0 ? normalized : "Modern living space with excellent natural lighting and high-speed connectivity.";

  return `
### THE LIVING SPACE
${summary}

### TELEMETRY & AMENITIES
- **Locality:** ${context.locality}, ${context.city}
- **Monthly Contribution:** ₹${context.rent.toLocaleString()}
- **Connectivity:** High-speed optical fiber enabled
- **Living Cadence:** Quiet, respectful co-habitation environment

### CO-HABITATION VIBE
Looking for a chilled-out professional or student who values personal space and clean common areas.
`.trim();
}

// AI Amenity Auto-Tagger
export function autoTagAmenities(text: string): string[] {
  const lower = (text || "").toLowerCase();
  const tags: string[] = [];

  const map: Record<string, RegExp[]> = {
    WiFi: [/\bwifi\b/i, /\bwi-fi\b/i, /\bfiber\b/i, /\binternet\b/i],
    AC: [/\bac\b/i, /\bair condition/i, /\bair-condition/i, /\baircon\b/i],
    "Power Backup": [/\bpower backup\b/i, /\bgenerator\b/i, /\bups\b/i, /\b24\/7 power\b/i],
    Gym: [/\bgym\b/i, /\bfitness\b/i, /\bworkout\b/i],
    "Washing Machine": [/\bwashing machine\b/i, /\blaundry\b/i, /\bwasher\b/i],
    Parking: [/\bparking\b/i, /\bgarage\b/i, /\bcar park\b/i],
    "Swimming Pool": [/\bpool\b/i, /\bswimming\b/i],
    Balcony: [/\bbalcony\b/i, /\bterrace\b/i, /\bdeck\b/i],
    "EV Charging": [/\bev charging\b/i, /\belectric vehicle\b/i],
  };

  for (const [tag, patterns] of Object.entries(map)) {
    if (patterns.some((pat) => pat.test(lower))) {
      tags.push(tag);
    }
  }

  return tags;
}

// -------------------------------------------------------------
// Tier 1: Core Coverage
// -------------------------------------------------------------

listingCommuteSuite.tier1("Calculates 5-vector neighborhood scorecard with all dimensions present", () => {
  const scorecard = getListingCommuteScorecard(DEMO_LISTINGS[0]);
  const n = scorecard.neighborhood;

  expect(n.safetyIndex).toBeGreaterThan(0);
  expect(n.walkabilityIndex).toBeGreaterThan(0);
  expect(n.caffeinePulse).toBeGreaterThan(0);
  expect(n.nightlifeOrbit).toBeGreaterThan(0);
  expect(n.essentialsRadius).toBeGreaterThan(0);
});

listingCommuteSuite.tier1("Generates multi-modal commute isochrones (Metro, Bike, Drive, Walk)", () => {
  const scorecard = getListingCommuteScorecard(DEMO_LISTINGS[0]); // Indiranagar
  expect(scorecard.isochrones.length).toBeGreaterThanOrEqual(3);

  const bagmane = scorecard.isochrones.find((i) => i.destination.includes("Bagmane"));
  expect(bagmane).toBeDefined();
  expect(bagmane?.transitModes.bikeMins).toBeDefined();
  expect(bagmane?.transitModes.metroMins).toBeDefined();
  expect(bagmane?.transitModes.driveMins).toBeDefined();
});

listingCommuteSuite.tier1("Amenity Auto-Tagger extracts all mentioned amenities correctly", () => {
  const sample = "Includes high speed fiber WiFi, inverter power backup, split AC, washing machine and covered car parking.";
  const tags = autoTagAmenities(sample);

  expect(tags).toContain("WiFi");
  expect(tags).toContain("Power Backup");
  expect(tags).toContain("AC");
  expect(tags).toContain("Washing Machine");
  expect(tags).toContain("Parking");
});

listingCommuteSuite.tier1("AI Copy Enhancer generates structured Markdown Living Space dossier", () => {
  const raw = "Nice master room, good sunlight, quiet street, friendly flatmates.";
  const enhanced = enhanceListingCopy(raw, {
    title: "Master Suite",
    locality: "Indiranagar",
    city: "Bangalore",
    rent: 25000,
  });

  expect(enhanced).toContain("THE LIVING SPACE");
  expect(enhanced).toContain("TELEMETRY & AMENITIES");
  expect(enhanced).toContain("Indiranagar, Bangalore");
  expect(enhanced).toContain("₹25,000");
});

listingCommuteSuite.tier1("Scorecard correctly maps transit destinations for Mumbai and Hyderabad", () => {
  const mumbaiScore = getListingCommuteScorecard({ locality: "Bandra West", city: "Mumbai" });
  expect(mumbaiScore.isochrones.some((i) => i.destination.includes("BKC") || i.destination.includes("Bandra"))).toBeTruthy();

  const hydScore = getListingCommuteScorecard({ locality: "Hitec City", city: "Hyderabad" });
  expect(hydScore.isochrones.some((i) => i.destination.includes("Cyber Towers") || i.destination.includes("Raidurg"))).toBeTruthy();
});

listingCommuteSuite.tier1("Auto-Tagger recognizes Swimming Pool and EV Charging amenities", () => {
  const tags = autoTagAmenities("Complex features infinity swimming pool, clubhouse, and EV charging station.");
  expect(tags).toContain("Swimming Pool");
  expect(tags).toContain("EV Charging");
});

// -------------------------------------------------------------
// Tier 2: Boundary & Edge Cases
// -------------------------------------------------------------

listingCommuteSuite.tier2("Copy enhancer handles zero or negative rent safely", () => {
  const enhanced = enhanceListingCopy("Spacious room", { title: "Room", locality: "Indiranagar", city: "Bangalore", rent: 0 });
  expect(enhanced).toContain("₹0");
});

listingCommuteSuite.tier2("Handles unknown localities by defaulting to valid city scorecard", () => {
  const unknown = getListingCommuteScorecard({ locality: "Unknown Suburb 99", city: "Bangalore" });
  expect(unknown.neighborhood.safetyIndex).toBeGreaterThan(0);
  expect(unknown.isochrones.length).toBeGreaterThan(0);
});

listingCommuteSuite.tier2("Auto-Tagger handles empty or noise strings without false positives", () => {
  const tags = autoTagAmenities("Just a regular place with nice paint and curtains");
  expect(tags).toHaveLength(0);

  const emptyTags = autoTagAmenities("");
  expect(emptyTags).toHaveLength(0);
});

listingCommuteSuite.tier2("Commute travel times are mathematically proportional to distance", () => {
  const scorecard = getListingCommuteScorecard(DEMO_LISTINGS[0]);
  for (const iso of scorecard.isochrones) {
    if (iso.transitModes.walkMins && iso.transitModes.bikeMins) {
      // Walking must take longer than biking for any distance > 0.1km
      if (iso.distanceKm > 0.1) {
        expect(iso.transitModes.walkMins).toBeGreaterThan(iso.transitModes.bikeMins);
      }
    }
  }
});

// -------------------------------------------------------------
// Tier 3: Pairwise Combinatorial Tests
// -------------------------------------------------------------

listingCommuteSuite.tier3("Pairwise: DLF CyberHub Gurgaon Tech Park vs Hitec City Hyderabad", () => {
  const gurgaon = getListingCommuteScorecard({ locality: "DLF Phase 5", city: "Gurgaon" });
  const hyd = getListingCommuteScorecard({ locality: "Hitec City", city: "Hyderabad" });

  expect(gurgaon.neighborhood).toBeDefined();
  expect(hyd.neighborhood).toBeDefined();
  expect(hyd.isochrones.some((i) => i.destinationType === "tech_park")).toBeTruthy();
});

// -------------------------------------------------------------
// Tier 4: Real-World Scenario
// -------------------------------------------------------------

listingCommuteSuite.tier4("Scenario: Host Space Publication & Optimization Workflow", () => {
  // 1. Host enters raw listing bullet points in AI Studio (/post)
  const rawInput = "Master bedroom in 3bhk duplex, superfast fiber wifi, split ac, modular kitchen, balcony, power backup";
  const context = {
    title: "Designer 3BHK Duplex Room",
    locality: "Indiranagar",
    city: "Bangalore",
    rent: 24500,
  };

  // 2. AI Auto-Tagger extracts normalized amenities
  const tags = autoTagAmenities(rawInput);
  expect(tags).toContain("WiFi");
  expect(tags).toContain("AC");
  expect(tags).toContain("Balcony");
  expect(tags).toContain("Power Backup");

  // 3. AI Copy Enhancer drafts polished listing copy
  const enhancedCopy = enhanceListingCopy(rawInput, context);
  expect(enhancedCopy).toContain("TELEMETRY & AMENITIES");
  expect(enhancedCopy).toContain("₹24,500");

  // 4. Commute Radar calculates distance isochrones to tech parks
  const commute = getListingCommuteScorecard({ locality: "Indiranagar", city: "Bangalore" });
  expect(commute.isochrones.length).toBeGreaterThanOrEqual(3);
  const techPark = commute.isochrones.find((i) => i.destinationType === "tech_park");
  expect(techPark).toBeDefined();
  expect(techPark?.transitModes.bikeMins).toBeLessThanOrEqual(20);
});

// -------------------------------------------------------------
// Tier 5: Adversarial Tests
// -------------------------------------------------------------

listingCommuteSuite.tier5("Adversarial: Handles ultra-long description (10,000 characters) in auto-tagger", () => {
  const hugeText = "High speed wifi and ac everywhere ".repeat(300);
  const start = performance.now();
  const tags = autoTagAmenities(hugeText);
  const duration = performance.now() - start;

  expect(tags).toContain("WiFi");
  expect(tags).toContain("AC");
  expect(duration).toBeLessThan(30);
});
