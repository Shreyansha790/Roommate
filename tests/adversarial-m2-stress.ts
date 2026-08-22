/**
 * Adversarial Empirical Stress Test Suite for Milestone 2
 * Scope:
 *  1. lib/nlp-parser.ts (parseNlpQuery with 80+ adversarial inputs)
 *  2. rankListingsByQuery scoring bounds, deterministic ordering, and missing field robustness
 *  3. CommandPalette logic, hotkey listeners, event dispatchers, and URL search param generation
 *  4. 0-Emoji Static & Dynamic Audit
 */

import { parseNlpQuery, rankListingsByQuery, ParsedSearchVectors } from "../lib/nlp-parser";
import { DEMO_LISTINGS, DemoListing } from "../lib/demo-data";
import * as fs from "fs";
import * as path from "path";

export interface StressResult {
  category: string;
  name: string;
  passed: boolean;
  details?: string;
  durationMs: number;
}

const results: StressResult[] = [];

function record(category: string, name: string, fn: () => void | Promise<void>) {
  const start = performance.now();
  try {
    const res = fn();
    if (res instanceof Promise) {
      throw new Error("Async test must be awaited in recordAsync");
    }
    results.push({
      category,
      name,
      passed: true,
      durationMs: performance.now() - start,
    });
  } catch (err: any) {
    results.push({
      category,
      name,
      passed: false,
      details: err?.message || String(err),
      durationMs: performance.now() - start,
    });
  }
}

async function recordAsync(category: string, name: string, fn: () => Promise<void>) {
  const start = performance.now();
  try {
    await fn();
    results.push({
      category,
      name,
      passed: true,
      durationMs: performance.now() - start,
    });
  } catch (err: any) {
    results.push({
      category,
      name,
      passed: false,
      details: err?.message || String(err),
      durationMs: performance.now() - start,
    });
  }
}

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(`Assertion failed: ${msg}`);
}

async function runAdversarialM2Suite() {
  console.log("\n========================================================");
  console.log("   ADVERSARIAL EMPIRICAL STRESS TEST: MILESTONE 2       ");
  console.log("========================================================\n");

  // =========================================================================
  // SECTION 1: Adversarial Stress Testing lib/nlp-parser.ts (80+ queries)
  // =========================================================================

  const adversarialQueries = [
    // --- Category A: Budgets & Currency Formats (15 queries) ---
    {
      id: "A1",
      query: "25k to 15k in indiranagar",
      validate: (res: ParsedSearchVectors) => {
        assert(res.budget !== undefined, "Budget should be parsed");
        assert(res.budget!.min === 15000, `Min should be 15000, got ${res.budget!.min}`);
        assert(res.budget!.max === 25000, `Max should be 25000, got ${res.budget!.max}`);
      },
    },
    {
      id: "A2",
      query: "under 0k",
      validate: (res: ParsedSearchVectors) => {
        assert(res.budget?.max === 0, `Max should be 0, got ${res.budget?.max}`);
      },
    },
    {
      id: "A3",
      query: "below 5000 in koramangala",
      validate: (res: ParsedSearchVectors) => {
        assert(res.budget?.max === 5000, `Max should be 5000, got ${res.budget?.max}`);
        assert(res.geoFence?.locality === "Koramangala", "Locality should be Koramangala");
      },
    },
    {
      id: "A4",
      query: "between ₹15k and ₹35k",
      validate: (res: ParsedSearchVectors) => {
        assert(res.budget?.min === 15000 && res.budget?.max === 35000, "Should handle ₹ symbol with k");
      },
    },
    {
      id: "A5",
      query: "upto 50k",
      validate: (res: ParsedSearchVectors) => {
        assert(res.budget?.max === 50000, `Upto 50k should parse max 50000, got ${res.budget?.max}`);
      },
    },
    {
      id: "A6",
      query: "within 20k",
      validate: (res: ParsedSearchVectors) => {
        assert(res.budget?.max === 20000, `Within 20k should parse max 20000, got ${res.budget?.max}`);
      },
    },
    {
      id: "A7",
      query: "<= 30k",
      validate: (res: ParsedSearchVectors) => {
        assert(res.budget?.max === 30000, `<= 30k should parse max 30000, got ${res.budget?.max}`);
      },
    },
    {
      id: "A8",
      query: ">= 10k",
      validate: (res: ParsedSearchVectors) => {
        assert(res.budget?.min === 10000, `>= 10k should parse min 10000, got ${res.budget?.min}`);
      },
    },
    {
      id: "A9",
      query: "min inr 15k and max inr 25k",
      validate: (res: ParsedSearchVectors) => {
        assert(res.budget?.min === 15000 || res.budget?.max === 25000, "Should extract min or max");
      },
    },
    {
      id: "A10",
      query: "between 20k and 40k",
      validate: (res: ParsedSearchVectors) => {
        assert(res.budget?.min === 20000 && res.budget?.max === 40000, "Between 20k and 40k");
      },
    },
    {
      id: "A11",
      query: "under 25000",
      validate: (res: ParsedSearchVectors) => {
        assert(res.budget?.max === 25000, `Under 25000 should parse max 25000, got ${res.budget?.max}`);
      },
    },
    {
      id: "A12",
      query: "between 10k to 20k",
      validate: (res: ParsedSearchVectors) => {
        assert(res.budget?.min === 10000 && res.budget?.max === 20000, "Between 10k to 20k");
      },
    },
    {
      id: "A13",
      query: "between 10k - 20k",
      validate: (res: ParsedSearchVectors) => {
        assert(res.budget?.min === 10000 && res.budget?.max === 20000, "Between 10k - 20k");
      },
    },
    {
      id: "A14",
      query: "under rs. 20000",
      validate: (res: ParsedSearchVectors) => {
        assert(res.budget?.max === 20000, `Under rs. 20000 should parse max 20000, got ${res.budget?.max}`);
      },
    },
    {
      id: "A15",
      query: "above 15000",
      validate: (res: ParsedSearchVectors) => {
        assert(res.budget?.min === 15000, `Above 15000 should parse min 15000, got ${res.budget?.min}`);
      },
    },

    // --- Category B: Geo-fences & Localities (18 queries) ---
    {
      id: "B1",
      query: "indiranagar bangalore",
      validate: (res: ParsedSearchVectors) => {
        assert(res.geoFence?.locality === "Indiranagar", "Locality should be Indiranagar");
        assert(res.geoFence?.city === "Bangalore", "City should be Bangalore");
      },
    },
    {
      id: "B2",
      query: "koramangala in bangalore",
      validate: (res: ParsedSearchVectors) => {
        assert(res.geoFence?.locality === "Koramangala", "Locality Koramangala");
        assert(res.geoFence?.city === "Bangalore", "City Bangalore");
      },
    },
    {
      id: "B3",
      query: "hsr layout near metro",
      validate: (res: ParsedSearchVectors) => {
        assert(res.geoFence?.locality === "HSR Layout", "HSR Layout");
        assert(res.geoFence?.metroProximityRequired === true, "Metro proximity should be true");
      },
    },
    {
      id: "B4",
      query: "hsr near metro station",
      validate: (res: ParsedSearchVectors) => {
        assert(res.geoFence?.locality === "HSR Layout", "Short hsr -> HSR Layout");
        assert(res.geoFence?.metroProximityRequired === true, "Metro true");
      },
    },
    {
      id: "B5",
      query: "whitefield itpl corridor",
      validate: (res: ParsedSearchVectors) => {
        assert(res.geoFence?.locality === "Whitefield", "Whitefield");
        assert(res.geoFence?.city === "Bangalore", "Bangalore");
      },
    },
    {
      id: "B6",
      query: "bellandur ecospace",
      validate: (res: ParsedSearchVectors) => {
        assert(res.geoFence?.locality === "Bellandur", "Bellandur");
      },
    },
    {
      id: "B7",
      query: "marathahalli bridge",
      validate: (res: ParsedSearchVectors) => {
        assert(res.geoFence?.locality === "Marathahalli", "Marathahalli");
      },
    },
    {
      id: "B8",
      query: "electronic city phase 1",
      validate: (res: ParsedSearchVectors) => {
        assert(res.geoFence?.locality === "Electronic City", "Electronic City");
      },
    },
    {
      id: "B9",
      query: "bandra west coastal",
      validate: (res: ParsedSearchVectors) => {
        assert(res.geoFence?.locality === "Bandra West", "Bandra West");
        assert(res.geoFence?.city === "Mumbai", "Mumbai");
      },
    },
    {
      id: "B10",
      query: "andheri east metro",
      validate: (res: ParsedSearchVectors) => {
        assert(res.geoFence?.locality === "Andheri", "Andheri");
        assert(res.geoFence?.metroProximityRequired === true, "Metro required");
      },
    },
    {
      id: "B11",
      query: "juhu beachside",
      validate: (res: ParsedSearchVectors) => {
        assert(res.geoFence?.locality === "Juhu", "Juhu");
      },
    },
    {
      id: "B12",
      query: "powai iit bombay",
      validate: (res: ParsedSearchVectors) => {
        assert(res.geoFence?.locality === "Powai", "Powai");
      },
    },
    {
      id: "B13",
      query: "hauz khas village rooftop",
      validate: (res: ParsedSearchVectors) => {
        assert(res.geoFence?.locality === "Hauz Khas Village", "Hauz Khas Village");
        assert(res.geoFence?.city === "Delhi", "Delhi");
      },
    },
    {
      id: "B14",
      query: "saket metro station",
      validate: (res: ParsedSearchVectors) => {
        assert(res.geoFence?.locality === "Saket", "Saket");
        assert(res.geoFence?.metroProximityRequired === true, "Metro required");
      },
    },
    {
      id: "B15",
      query: "dlf phase 5 gurgaon",
      validate: (res: ParsedSearchVectors) => {
        assert(res.geoFence?.locality === "DLF Phase 5", "DLF Phase 5");
        assert(res.geoFence?.city === "Gurgaon", "Gurgaon");
      },
    },
    {
      id: "B16",
      query: "golf course road cyberhub",
      validate: (res: ParsedSearchVectors) => {
        assert(res.geoFence?.locality === "DLF Phase 5", "Golf Course Road maps to DLF Phase 5");
      },
    },
    {
      id: "B17",
      query: "hitec city cyber towers",
      validate: (res: ParsedSearchVectors) => {
        assert(res.geoFence?.locality === "Hitec City", "Hitec City");
        assert(res.geoFence?.city === "Hyderabad", "Hyderabad");
      },
    },
    {
      id: "B18",
      query: "koregaon park lane 6 pune",
      validate: (res: ParsedSearchVectors) => {
        assert(res.geoFence?.locality === "Koregaon Park", "Koregaon Park");
        assert(res.geoFence?.city === "Pune", "Pune");
      },
    },

    // --- Category C: Room Types (12 queries) ---
    {
      id: "C1",
      query: "single room with attached bath",
      validate: (res: ParsedSearchVectors) => {
        assert(res.roomType === "single", "Single room");
      },
    },
    {
      id: "C2",
      query: "private room in flat",
      validate: (res: ParsedSearchVectors) => {
        assert(res.roomType === "single", "Private room -> single");
      },
    },
    {
      id: "C3",
      query: "master bedroom ensuite",
      validate: (res: ParsedSearchVectors) => {
        assert(res.roomType === "single", "Master bedroom -> single");
      },
    },
    {
      id: "C4",
      query: "1rk near tech park",
      validate: (res: ParsedSearchVectors) => {
        assert(res.roomType === "single", "1rk -> single");
      },
    },
    {
      id: "C5",
      query: "shared room for college student",
      validate: (res: ParsedSearchVectors) => {
        assert(res.roomType === "shared", "Shared room -> shared");
      },
    },
    {
      id: "C6",
      query: "twin sharing space",
      validate: (res: ParsedSearchVectors) => {
        assert(res.roomType === "shared", "Twin sharing -> shared");
      },
    },
    {
      id: "C7",
      query: "looking for flatmate",
      validate: (res: ParsedSearchVectors) => {
        assert(res.roomType === "shared", "Flatmate -> shared");
      },
    },
    {
      id: "C8",
      query: "seeking roommate in pune",
      validate: (res: ParsedSearchVectors) => {
        assert(res.roomType === "shared", "Roommate -> shared");
      },
    },
    {
      id: "C9",
      query: "entire flat for 2 people",
      validate: (res: ParsedSearchVectors) => {
        assert(res.roomType === "entire_flat", "Entire flat");
      },
    },
    {
      id: "C10",
      query: "full flat with balcony",
      validate: (res: ParsedSearchVectors) => {
        assert(res.roomType === "entire_flat", "Full flat -> entire_flat");
      },
    },
    {
      id: "C11",
      query: "studio apartment near metro",
      validate: (res: ParsedSearchVectors) => {
        assert(res.roomType === "entire_flat", "Studio -> entire_flat");
      },
    },
    {
      id: "C12",
      query: "entire apartment in bandra",
      validate: (res: ParsedSearchVectors) => {
        assert(res.roomType === "entire_flat", "Entire apartment -> entire_flat");
      },
    },

    // --- Category D: Lifestyle Vectors (17 queries) ---
    {
      id: "D1",
      query: "night owl programmer",
      validate: (res: ParsedSearchVectors) => {
        assert(res.lifestyleSync.sleepRhythm === "night_owl", "Night owl");
      },
    },
    {
      id: "D2",
      query: "late night working",
      validate: (res: ParsedSearchVectors) => {
        assert(res.lifestyleSync.sleepRhythm === "night_owl", "Late night -> night owl");
      },
    },
    {
      id: "D3",
      query: "nocturnal lifestyle",
      validate: (res: ParsedSearchVectors) => {
        assert(res.lifestyleSync.sleepRhythm === "night_owl", "Nocturnal -> night owl");
      },
    },
    {
      id: "D4",
      query: "early bird morning yoga",
      validate: (res: ParsedSearchVectors) => {
        assert(res.lifestyleSync.sleepRhythm === "early_bird", "Early bird");
      },
    },
    {
      id: "D5",
      query: "morning person 6am run",
      validate: (res: ParsedSearchVectors) => {
        assert(res.lifestyleSync.sleepRhythm === "early_bird", "Morning person -> early bird");
      },
    },
    {
      id: "D6",
      query: "clean freak very neat space",
      validate: (res: ParsedSearchVectors) => {
        assert(res.lifestyleSync.cleanlinessMin === 8, "Cleanliness min 8");
      },
    },
    {
      id: "D7",
      query: "tidy and organized room",
      validate: (res: ParsedSearchVectors) => {
        assert(res.lifestyleSync.cleanlinessMin === 8, "Tidy -> Cleanliness min 8");
      },
    },
    {
      id: "D8",
      query: "pure veg jain cooking",
      validate: (res: ParsedSearchVectors) => {
        assert(res.lifestyleSync.foodPreference === "veg", "Pure veg / Jain -> veg");
      },
    },
    {
      id: "D9",
      query: "vegan food only",
      validate: (res: ParsedSearchVectors) => {
        assert(res.lifestyleSync.foodPreference === "veg", "Vegan -> veg");
        assert(res.vibeTokens.includes("vegan"), "Vibe tokens should include vegan");
      },
    },
    {
      id: "D10",
      query: "non-veg meat lover",
      validate: (res: ParsedSearchVectors) => {
        assert(res.lifestyleSync.foodPreference === "nonveg", "Non-veg -> nonveg");
      },
    },
    {
      id: "D11",
      query: "non-smoker strictly smoke free",
      validate: (res: ParsedSearchVectors) => {
        assert(res.lifestyleSync.smoking === false, "Non-smoker -> false");
      },
    },
    {
      id: "D12",
      query: "smoker 420 friendly",
      validate: (res: ParsedSearchVectors) => {
        assert(res.lifestyleSync.smoking === true, "Smoker / 420 -> true");
      },
    },
    {
      id: "D13",
      query: "pet friendly with golden retriever dog",
      validate: (res: ParsedSearchVectors) => {
        assert(res.lifestyleSync.petsAllowed === true, "Pets allowed true");
        assert(res.vibeTokens.includes("pet_friendly"), "Vibe token pet_friendly");
      },
    },
    {
      id: "D14",
      query: "wfh full remote setup",
      validate: (res: ParsedSearchVectors) => {
        assert(res.lifestyleSync.workStyle === "wfh", "WFH / remote -> wfh");
      },
    },
    {
      id: "D15",
      query: "hybrid schedule 2 days office",
      validate: (res: ParsedSearchVectors) => {
        assert(res.lifestyleSync.workStyle === "hybrid", "Hybrid -> hybrid");
      },
    },
    {
      id: "D16",
      query: "introvert quiet peaceful environment",
      validate: (res: ParsedSearchVectors) => {
        assert(res.lifestyleSync.socialBattery === "introvert", "Introvert / quiet -> introvert");
      },
    },
    {
      id: "D17",
      query: "extrovert social party on weekends",
      validate: (res: ParsedSearchVectors) => {
        assert(res.lifestyleSync.socialBattery === "extrovert", "Extrovert / party -> extrovert");
      },
    },

    // --- Category E: Amenities Tokens (11 queries) ---
    {
      id: "E1",
      query: "high speed fiber broadband wifi internet",
      validate: (res: ParsedSearchVectors) => {
        assert(res.amenityTokens.includes("wifi"), "Wifi token extracted");
      },
    },
    {
      id: "E2",
      query: "central ac air condition in all rooms",
      validate: (res: ParsedSearchVectors) => {
        assert(res.amenityTokens.includes("ac"), "AC token extracted");
      },
    },
    {
      id: "E3",
      query: "gym with fitness weights",
      validate: (res: ParsedSearchVectors) => {
        assert(res.amenityTokens.includes("gym"), "Gym token extracted");
      },
    },
    {
      id: "E4",
      query: "swimming pool in society",
      validate: (res: ParsedSearchVectors) => {
        assert(res.amenityTokens.includes("pool"), "Pool token extracted");
      },
    },
    {
      id: "E5",
      query: "covered car parking garage",
      validate: (res: ParsedSearchVectors) => {
        assert(res.amenityTokens.includes("parking"), "Parking token extracted");
      },
    },
    {
      id: "E6",
      query: "100% power backup ups generator",
      validate: (res: ParsedSearchVectors) => {
        assert(res.amenityTokens.includes("power_backup"), "Power backup token extracted");
      },
    },
    {
      id: "E7",
      query: "washing machine and laundry area",
      validate: (res: ParsedSearchVectors) => {
        assert(res.amenityTokens.includes("washing_machine"), "Washing machine token extracted");
      },
    },
    {
      id: "E8",
      query: "spacious balcony with terrace deck",
      validate: (res: ParsedSearchVectors) => {
        assert(res.amenityTokens.includes("balcony"), "Balcony token extracted");
      },
    },
    {
      id: "E9",
      query: "daily housekeeping and maid cleaning",
      validate: (res: ParsedSearchVectors) => {
        assert(res.amenityTokens.includes("housekeeping"), "Housekeeping token extracted");
      },
    },
    {
      id: "E10",
      query: "smart home alexa automation system",
      validate: (res: ParsedSearchVectors) => {
        assert(res.amenityTokens.includes("smart_home"), "Smart home token extracted");
      },
    },
    {
      id: "E11",
      query: "ev charging slot for electric car",
      validate: (res: ParsedSearchVectors) => {
        assert(res.amenityTokens.includes("ev_charging"), "EV charging token extracted");
      },
    },

    // --- Category F: Complex Combos, Fuzzing & Adversarial Payloads (15 queries) ---
    {
      id: "F1",
      query: "Indiranagar night owl techie <=25k with wifi and ac",
      validate: (res: ParsedSearchVectors) => {
        assert(res.geoFence?.locality === "Indiranagar", "Locality Indiranagar");
        assert(res.lifestyleSync.sleepRhythm === "night_owl", "Night owl");
        assert(res.budget?.max === 25000, "Max rent 25000");
        assert(res.amenityTokens.includes("wifi"), "Wifi");
        assert(res.amenityTokens.includes("ac"), "AC");
        assert(res.extractedTokensCount >= 4, `Extracted tokens count >= 4, got ${res.extractedTokensCount}`);
      },
    },
    {
      id: "F2",
      query: "Shared room in Bandra West under 35k for creative professional",
      validate: (res: ParsedSearchVectors) => {
        assert(res.roomType === "shared", "Shared");
        assert(res.geoFence?.locality === "Bandra West", "Bandra West");
        assert(res.budget?.max === 35000, "Max rent 35000");
      },
    },
    {
      id: "F3",
      query: "Single room in Hitec City under 20k for remote developer with gym",
      validate: (res: ParsedSearchVectors) => {
        assert(res.roomType === "single", "Single");
        assert(res.geoFence?.locality === "Hitec City", "Hitec City");
        assert(res.budget?.max === 20000, "Max rent 20000");
        assert(res.lifestyleSync.workStyle === "wfh", "WFH");
        assert(res.amenityTokens.includes("gym"), "Gym");
      },
    },
    {
      id: "F4",
      query: "",
      validate: (res: ParsedSearchVectors) => {
        assert(res.rawQuery === "", "Empty rawQuery");
        assert(res.extractedTokensCount === 0, "0 tokens extracted");
      },
    },
    {
      id: "F5",
      query: "    \t\n   ",
      validate: (res: ParsedSearchVectors) => {
        assert(res.extractedTokensCount === 0, "Whitespace query has 0 tokens");
      },
    },
    {
      id: "F6",
      query: "<script>alert('XSS_PAYLOAD')</script> in Indiranagar under 30k",
      validate: (res: ParsedSearchVectors) => {
        assert(res.geoFence?.locality === "Indiranagar", "Locality preserved");
        assert(res.budget?.max === 30000, "Budget parsed");
        assert(res.rawQuery.includes("<script>"), "Raw query preserved without crash");
      },
    },
    {
      id: "F7",
      query: "' OR 1=1 -- drop table listings; under 20k",
      validate: (res: ParsedSearchVectors) => {
        assert(res.budget?.max === 20000, "Parsed budget safely despite SQL injection payload");
      },
    },
    {
      id: "F8",
      query: "A".repeat(10000) + " Indiranagar <= 25k",
      validate: (res: ParsedSearchVectors) => {
        assert(res.geoFence?.locality === "Indiranagar", "10,000 char buffer: locality extracted");
        assert(res.budget?.max === 25000, "10,000 char buffer: budget extracted");
      },
    },
    {
      id: "F9",
      query: "!@#$%^&*()_+{}[]:;\"'<>?,./~ Koramangala 1rk",
      validate: (res: ParsedSearchVectors) => {
        assert(res.geoFence?.locality === "Koramangala", "Punctuation fuzzing: locality extracted");
        assert(res.roomType === "single", "Punctuation fuzzing: 1rk extracted");
      },
    },
    {
      id: "F10",
      query: "     Whitefield shared room under 15k",
      validate: (res: ParsedSearchVectors) => {
        assert(res.geoFence?.locality === "Whitefield", "Emojis input: locality extracted");
        assert(res.roomType === "shared", "Emojis input: shared extracted");
        assert(res.budget?.max === 15000, "Emojis input: budget extracted");
      },
    },
    {
      id: "F11",
      query: "कमरा चाहिए Indiranagar veg under 20k",
      validate: (res: ParsedSearchVectors) => {
        assert(res.geoFence?.locality === "Indiranagar", "Non-Latin mixed input: locality extracted");
        assert(res.lifestyleSync.foodPreference === "veg", "Non-Latin mixed input: veg extracted");
        assert(res.budget?.max === 20000, "Non-Latin mixed input: budget extracted");
      },
    },
    {
      id: "F12",
      query: "Indiranagar flatmate under 25k night owl wfh veg non-smoker pet friendly with wifi ac gym pool parking power backup washing machine balcony housekeeping smart home ev charging",
      validate: (res: ParsedSearchVectors) => {
        assert(res.geoFence?.locality === "Indiranagar", "Locality Indiranagar");
        assert(res.roomType === "shared", "Room type shared (flatmate)");
        assert(res.budget?.max === 25000, "Max rent 25000");
        assert(res.lifestyleSync.sleepRhythm === "night_owl", "Night owl");
        assert(res.lifestyleSync.workStyle === "wfh", "WFH");
        assert(res.lifestyleSync.foodPreference === "veg", "Veg");
        assert(res.lifestyleSync.smoking === false, "Non-smoker");
        assert(res.lifestyleSync.petsAllowed === true, "Pet friendly");
        assert(res.amenityTokens.length === 11, `All 11 amenities extracted, got ${res.amenityTokens.length}`);
        assert(res.extractedTokensCount >= 15, `Extracted tokens count high: ${res.extractedTokensCount}`);
      },
    },
    {
      id: "F13",
      query: "between 25k to 10k",
      validate: (res: ParsedSearchVectors) => {
        assert(res.budget?.min === 10000 && res.budget?.max === 25000, "Inverted range ordered min to max");
      },
    },
    {
      id: "F14",
      query: "between 18000 and 22000 in Koramangala",
      validate: (res: ParsedSearchVectors) => {
        assert(res.budget?.min === 18000 && res.budget?.max === 22000, "Explicit number range");
        assert(res.geoFence?.locality === "Koramangala", "Locality");
      },
    },
    {
      id: "F15",
      query: "MAX 30000 MIN 15000",
      validate: (res: ParsedSearchVectors) => {
        assert(res.budget?.max === 30000, "Uppercase MAX 30000 parsed");
        assert(res.budget?.min === 15000, "Uppercase MIN 15000 parsed");
      },
    },
  ];

  console.log(`[SECTION 1] Running ${adversarialQueries.length} NLP Parser Adversarial Test Cases...`);
  for (const t of adversarialQueries) {
    record("NLP_PARSER_ADVERSARIAL", `Query [${t.id}] "${t.query.slice(0, 45)}"`, () => {
      const parsed = parseNlpQuery(t.query);
      t.validate(parsed);
    });
  }

  // =========================================================================
  // SECTION 2: rankListingsByQuery Scoring Bounds, Consistency & Resilience
  // =========================================================================

  console.log("\n[SECTION 2] Stress-testing rankListingsByQuery algorithm...");

  record("RANKING_ENGINE", "Empty listings array returns empty array safely", () => {
    const res = rankListingsByQuery([], "indiranagar under 25k");
    assert(Array.isArray(res) && res.length === 0, "Should return empty array");
  });

  record("RANKING_ENGINE", "Strict score bounding: 100 random synthetic listings all stay within [0, 100]", () => {
    const syntheticListings = Array.from({ length: 100 }).map((_, i) => ({
      id: `synth-${i}`,
      title: `Synthetic Space ${i}`,
      rent: (i % 10) * 10000, // 0, 10k, 20k ... 90k
      city: i % 2 === 0 ? "Bangalore" : "Mumbai",
      locality: i % 3 === 0 ? "Indiranagar" : "Bandra West",
      room_type: i % 3 === 0 ? "single" : i % 3 === 1 ? "shared" : "entire_flat",
      amenities: i % 2 === 0 ? ["wifi", "ac", "gym", "swimming pool", "parking", "power backup"] : [],
      tags: i % 2 === 0 ? ["Night Owl", "Pet Friendly"] : [],
      profiles: {
        lifestyle: {
          work: i % 2 === 0 ? "Remote software developer" : "Corporate onsite",
        },
      },
    }));

    const queries = [
      "indiranagar night owl single under 25k with wifi ac gym pool parking power backup",
      "mumbai entire flat under 5k early bird",
      "pune shared 50k non-veg",
      "",
      "dlf phase 5 gurgaon max 100k",
    ];

    for (const q of queries) {
      const ranked = rankListingsByQuery(syntheticListings as any, q);
      for (const item of ranked) {
        assert(
          Number.isInteger(item.matchScore),
          `matchScore must be an integer, got ${item.matchScore}`
        );
        assert(
          item.matchScore >= 0 && item.matchScore <= 100,
          `matchScore out of bounds [0, 100]: got ${item.matchScore}`
        );
      }
    }
  });

  record("RANKING_ENGINE", "Deterministic Descending Sort Order Integrity", () => {
    const ranked = rankListingsByQuery(DEMO_LISTINGS, "Indiranagar under 25k with wifi");
    for (let i = 0; i < ranked.length - 1; i++) {
      assert(
        ranked[i].matchScore >= ranked[i + 1].matchScore,
        `Sort violation: item ${i} (${ranked[i].matchScore}) < item ${i + 1} (${ranked[i + 1].matchScore})`
      );
    }
  });

  record("RANKING_ENGINE", "Deterministic Consistency over 100 repeated runs", () => {
    const firstRun = rankListingsByQuery(DEMO_LISTINGS, "Shared room in Bandra West under 35k");
    for (let i = 0; i < 100; i++) {
      const currentRun = rankListingsByQuery(DEMO_LISTINGS, "Shared room in Bandra West under 35k");
      assert(currentRun.length === firstRun.length, "Run length mismatch");
      for (let j = 0; j < firstRun.length; j++) {
        assert(
          currentRun[j].id === firstRun[j].id && currentRun[j].matchScore === firstRun[j].matchScore,
          `Deterministic violation at run ${i}, index ${j}`
        );
      }
    }
  });

  record("RANKING_ENGINE", "Missing / Malformed field resilience in listing objects", () => {
    const corruptListings = [
      { id: "c1", rent: 20000 }, // missing city, locality, room_type, amenities, tags, profiles
      { id: "c2", rent: -5000, city: null, locality: undefined, amenities: null, tags: null, profiles: null },
      { id: "c3", rent: 0, room_type: null },
      { id: "c4", rent: NaN, amenities: ["wifi"] },
      { id: "c5", rent: 30000, profiles: { lifestyle: null } },
      { id: "c6", rent: 25000, profiles: {} },
    ];

    const ranked = rankListingsByQuery(corruptListings as any, "Indiranagar night owl wfh with wifi");
    assert(ranked.length === corruptListings.length, "All corrupt listings processed without crashing");
    for (const item of ranked) {
      assert(
        typeof item.matchScore === "number" && !isNaN(item.matchScore),
        `matchScore is not a valid number for corrupt listing: ${item.matchScore}`
      );
    }
  });

  // =========================================================================
  // SECTION 3: Command Palette Logic & URL Search Param Construction
  // =========================================================================

  console.log("\n[SECTION 3] Testing Command Palette Search Param Serialization...");

  record("COMMAND_PALETTE", "Builds comprehensive search query parameters for /browse", () => {
    const q = "Indiranagar night owl single room under 25k with wifi";
    const vectors = parseNlpQuery(q);
    const params = new URLSearchParams();

    if (vectors.geoFence?.city) params.set("city", vectors.geoFence.city);
    if (vectors.geoFence?.locality) params.set("locality", vectors.geoFence.locality);
    if (vectors.roomType) params.set("roomType", vectors.roomType);
    if (vectors.budget?.max) params.set("maxRent", String(vectors.budget.max));
    if (vectors.budget?.min) params.set("minRent", String(vectors.budget.min));
    if (q) params.set("q", q);

    const serialized = params.toString();
    assert(serialized.includes("city=Bangalore"), "Contains city=Bangalore");
    assert(serialized.includes("locality=Indiranagar"), "Contains locality=Indiranagar");
    assert(serialized.includes("roomType=single"), "Contains roomType=single");
    assert(serialized.includes("maxRent=25000"), "Contains maxRent=25000");
    assert(serialized.includes("q=Indiranagar"), "Contains raw query param");
  });

  record("COMMAND_PALETTE", "Handles empty query gracefully without erroneous params", () => {
    const q = "";
    const vectors = parseNlpQuery(q);
    const params = new URLSearchParams();

    if (vectors.geoFence?.city) params.set("city", vectors.geoFence.city);
    if (vectors.geoFence?.locality) params.set("locality", vectors.geoFence.locality);
    if (vectors.roomType) params.set("roomType", vectors.roomType);
    if (vectors.budget?.max) params.set("maxRent", String(vectors.budget.max));
    if (vectors.budget?.min) params.set("minRent", String(vectors.budget.min));
    if (q) params.set("q", q);

    assert(params.toString() === "", "Empty query produces empty search params");
  });

  // =========================================================================
  // SECTION 4: Zero-Emoji Static File Audit for M2 Components
  // =========================================================================

  console.log("\n[SECTION 4] Auditing M2 components for strict 0-emoji compliance...");

  record("ZERO_EMOJI_AUDIT", "Verify no Unicode emoji characters in M2 files", () => {
    const emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

    const filesToAudit = [
      "lib/nlp-parser.ts",
      "lib/demo-data.ts",
      "components/search/CommandPalette.tsx",
      "components/search/VectorFilterChips.tsx",
      "components/map/ListingMap.tsx",
      "app/page.tsx",
      "app/browse/page.tsx",
      "app/browse/browse-client-view.tsx",
    ];

    const projectRoot = path.resolve(__dirname, "..");
    for (const relPath of filesToAudit) {
      const fullPath = path.join(projectRoot, relPath);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, "utf-8");
        const match = content.match(emojiRegex);
        assert(!match, `Emoji detected in ${relPath}: ${match?.[0]}`);
      }
    }
  });

  // =========================================================================
  // SUMMARY REPORT
  // =========================================================================

  const passed = results.filter((r) => r.passed);
  const failed = results.filter((r) => !r.passed);

  console.log("\n========================================================");
  console.log("   EMPIRICAL ADVERSARIAL TEST RESULTS                   ");
  console.log("========================================================");
  console.log(`Total Adversarial Tests: ${results.length}`);
  console.log(`Passed:                  ${passed.length} / ${results.length} (${((passed.length / results.length) * 100).toFixed(1)}%)`);
  console.log(`Failed:                  ${failed.length}`);

  if (failed.length > 0) {
    console.log("\nFAILED TESTS:");
    for (const f of failed) {
      console.log(`  [${f.category}] ${f.name}`);
      console.log(`    Error: ${f.details}`);
    }
  } else {
    console.log("\n  ALL ADVERSARIAL EMPIRICAL TESTS PASSED WITHOUT EXCEPTION!");
  }
  console.log("========================================================\n");

  if (failed.length > 0) {
    process.exit(1);
  }
}

runAdversarialM2Suite().catch((err) => {
  console.error("Fatal test runner error:", err);
  process.exit(1);
});
