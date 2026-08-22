/**
 * Test Suite: AI Vibe Co-Pilot & 5-D Harmony Telemetry Engine
 * File: tests/e2e/vibe-compatibility.test.ts
 *
 * Covers:
 * - 5-D Harmony Score Mathematical Algorithm (Cleanliness, Social, Circadian, Financial, Values)
 * - Sleep schedule chronotype waveforms and circadian overlap calculations
 * - Synchronicity vectors and friction points generation
 * - Prognosis verdict classification thresholds
 * - 5-Axis Spider Radar SVG Polygon Geometry math
 */

import { createTestSuite, expect } from "../test-utils";

export const vibeCompatibilitySuite = createTestSuite("AI Vibe Co-Pilot & 5-D Harmony Engine");

export interface RoommateProfileData {
  id: string;
  name: string;
  sleepSchedule: string; // e.g. "1:00 AM - 9:00 AM" or "11:00 PM - 7:00 AM"
  cleanliness: number;   // 1 - 10
  foodPreference: string; // "veg" | "nonveg" | "flexible"
  smoking: string;       // "no" | "social" | "yes" | "balcony"
  workStyle: string;     // "wfh" | "hybrid" | "office"
  socialBattery: "introvert" | "ambivert" | "extrovert";
  maxBudget?: number;
}

export interface CompatibilityResult {
  overallScore: number;
  dimensions: {
    cleanliness: number;
    social: number;
    circadian: number;
    financial: number;
    values: number;
  };
  synchronicityVectors: string[];
  frictionPoints: string[];
  prognosisVerdict: string;
}

// Reference 5-D Compatibility Engine
export function computeCompatibility(
  seeker: Partial<RoommateProfileData>,
  host: Partial<RoommateProfileData>,
  listingRent?: number
): CompatibilityResult {
  // 1. Cleanliness dimension (0-100)
  // 1. Cleanliness dimension (0-100)
  const seekerClean = typeof seeker.cleanliness === "number" && !isNaN(seeker.cleanliness) ? seeker.cleanliness : 8;
  const hostClean = typeof host.cleanliness === "number" && !isNaN(host.cleanliness) ? host.cleanliness : 8;
  const cleanDelta = Math.abs(seekerClean - hostClean);
  const cleanlinessScore = Math.max(0, Math.min(100, Math.round(100 - cleanDelta * 12)));

  // 2. Social battery dimension (0-100)
  let socialScore = 80;
  if (seeker.socialBattery && host.socialBattery) {
    if (seeker.socialBattery === host.socialBattery) socialScore = 95;
    else if (
      seeker.socialBattery === "ambivert" || host.socialBattery === "ambivert"
    ) socialScore = 85;
    else socialScore = 65; // introvert vs extrovert
  }

  // 3. Circadian rhythm dimension (0-100)
  let circadianScore = 80;
  const parseSleepHours = (sched?: string): { start: number; end: number } => {
    if (!sched) return { start: 0, end: 8 };
    const lower = sched.toLowerCase();
    const match = lower.match(/(\d{1,2})(?::\d{2})?\s*(am|pm)/i);
    if (match) {
      let hour = parseInt(match[1], 10);
      const meridiem = match[2].toLowerCase();
      if (meridiem === "pm" && hour !== 12) hour += 12;
      else if (meridiem === "am" && hour === 12) hour = 0;
      return { start: hour, end: (hour + 8) % 24 };
    }
    if (lower.includes("owl") || lower.includes("night")) return { start: 2, end: 10 };
    if (lower.includes("early") || lower.includes("morning")) return { start: 22, end: 6 };
    return { start: 0, end: 8 };
  };

  const seekerSleep = parseSleepHours(seeker.sleepSchedule);
  const hostSleep = parseSleepHours(host.sleepSchedule);
  const rawDiff = Math.abs(seekerSleep.start - hostSleep.start);
  const sleepDelta = Math.min(rawDiff, 24 - rawDiff);
  circadianScore = sleepDelta === 0 ? 100 : Math.max(20, 100 - sleepDelta * 15);

  // 4. Financial dimension (0-100)
  let financialScore = 85;
  const budget = typeof seeker.maxBudget === "number" && isFinite(seeker.maxBudget) ? seeker.maxBudget : undefined;
  if (budget && listingRent) {
    if (budget >= listingRent) {
      financialScore = Math.min(100, 90 + Math.round(((budget - listingRent) / listingRent) * 10));
    } else {
      const deficit = listingRent - budget;
      financialScore = Math.max(20, Math.round(100 - (deficit / listingRent) * 150));
    }
  }

  // 5. Values & lifestyle dimension (0-100)
  let valuesScore = 85;
  const syncVectors: string[] = [];
  const frictionPts: string[] = [];

  // Smoking check
  const seekerSmoke = (seeker.smoking || "").toLowerCase();
  const hostSmoke = (host.smoking || "").toLowerCase();
  const isSeekerSmoker = seekerSmoke.includes("yes") || seekerSmoke.includes("social");
  const isHostSmoker = hostSmoke.includes("yes") || hostSmoke.includes("social");

  if (isSeekerSmoker === isHostSmoker) {
    valuesScore += 5;
    if (!isSeekerSmoker) syncVectors.push("Smoke-Free Living Harmony");
  } else {
    valuesScore -= 20;
    frictionPts.push("Smoking Habit Divergence");
  }

  // Food check
  if (seeker.foodPreference && host.foodPreference) {
    if (seeker.foodPreference === host.foodPreference) {
      valuesScore += 5;
      syncVectors.push(`Shared ${seeker.foodPreference.toUpperCase()} Culinary Rhythm`);
    } else if (seeker.foodPreference === "veg" && host.foodPreference === "nonveg") {
      frictionPts.push("Dietary Policy Alignment Required (Veg vs Non-Veg)");
      valuesScore -= 10;
    }
  }

  // Cleanliness vector
  if (cleanDelta <= 1) {
    syncVectors.push(`High Cleanliness Synchronicity (${hostClean}/10 Standard)`);
  } else if (cleanDelta >= 3) {
    frictionPts.push(`Cleanliness Expectation Variance (${seekerClean}/10 vs ${hostClean}/10)`);
  }

  // Circadian vector
  if (circadianScore >= 90) {
    syncVectors.push("Aligned Circadian Sleep Windows");
  } else if (circadianScore <= 60) {
    frictionPts.push("Circadian Asynchronicity (Early Bird vs Night Owl)");
  }

  valuesScore = Math.max(0, Math.min(100, valuesScore));

  // Weighted overall calculation
  // Cleanliness: 25%, Social: 20%, Circadian: 25%, Financial: 15%, Values: 15%
  const overallScore = Math.round(
    cleanlinessScore * 0.25 +
    socialScore * 0.20 +
    circadianScore * 0.25 +
    financialScore * 0.15 +
    valuesScore * 0.15
  );

  let prognosisVerdict = "Balanced Co-Habitation";
  if (overallScore >= 85) prognosisVerdict = "Exceptional Synchronicity";
  else if (overallScore >= 70) prognosisVerdict = "High Operational Harmony";
  else if (overallScore < 50) prognosisVerdict = "High Friction Risk";

  return {
    overallScore: Math.min(100, Math.max(0, overallScore)),
    dimensions: {
      cleanliness: cleanlinessScore,
      social: socialScore,
      circadian: circadianScore,
      financial: financialScore,
      values: valuesScore,
    },
    synchronicityVectors: syncVectors,
    frictionPoints: frictionPts,
    prognosisVerdict,
  };
}

// 5-Axis Spider Radar SVG Polygon Geometry Math
export function computeSpiderPolygon(
  dimensions: { cleanliness: number; social: number; circadian: number; financial: number; values: number },
  cx: number = 100,
  cy: number = 100,
  radius: number = 80
): string {
  const scores = [
    dimensions.cleanliness,
    dimensions.social,
    dimensions.circadian,
    dimensions.financial,
    dimensions.values,
  ];

  const points = scores.map((score, idx) => {
    const angle = (idx * 72 - 90) * (Math.PI / 180); // 72 degrees each, starting from top (-90 deg)
    const normalized = Math.max(0.1, Math.min(1.0, score / 100));
    const x = cx + radius * normalized * Math.cos(angle);
    const y = cy + radius * normalized * Math.sin(angle);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  return points.join(" ");
}

// -------------------------------------------------------------
// Tier 1: Core Coverage
// -------------------------------------------------------------

vibeCompatibilitySuite.tier1("Computes perfect compatibility (100%) for identical roommate profiles", () => {
  const identicalSeeker: RoommateProfileData = {
    id: "seeker-1",
    name: "Aanya Seeker",
    sleepSchedule: "1:00 AM - 9:00 AM",
    cleanliness: 9,
    foodPreference: "flexible",
    smoking: "no",
    workStyle: "hybrid",
    socialBattery: "ambivert",
    maxBudget: 30000,
  };

  const identicalHost: RoommateProfileData = {
    id: "host-1",
    name: "Aanya Verma",
    sleepSchedule: "1:00 AM - 9:00 AM",
    cleanliness: 9,
    foodPreference: "flexible",
    smoking: "no",
    workStyle: "hybrid",
    socialBattery: "ambivert",
  };

  const result = computeCompatibility(identicalSeeker, identicalHost, 25000);
  expect(result.overallScore).toBeGreaterThanOrEqual(90);
  expect(result.prognosisVerdict).toBe("Exceptional Synchronicity");
  expect(result.synchronicityVectors.length).toBeGreaterThan(0);
  expect(result.frictionPoints).toHaveLength(0);
});

vibeCompatibilitySuite.tier1("Accurately identifies circadian mismatch between Early Bird and Night Owl", () => {
  const nightOwlSeeker: Partial<RoommateProfileData> = {
    sleepSchedule: "2:00 AM - 10:00 AM",
    cleanliness: 8,
    smoking: "no",
  };
  const earlyBirdHost: Partial<RoommateProfileData> = {
    sleepSchedule: "10:30 PM - 6:00 AM",
    cleanliness: 8,
    smoking: "no",
  };

  const result = computeCompatibility(nightOwlSeeker, earlyBirdHost);
  expect(result.dimensions.circadian).toBeLessThanOrEqual(70);
  expect(result.frictionPoints.some((p) => p.toLowerCase().includes("circadian"))).toBeTruthy();
});

vibeCompatibilitySuite.tier1("Penalizes score when strict non-smoker pairs with smoker", () => {
  const nonSmoker: Partial<RoommateProfileData> = { smoking: "no", cleanliness: 8 };
  const smoker: Partial<RoommateProfileData> = { smoking: "yes", cleanliness: 8 };

  const result = computeCompatibility(nonSmoker, smoker);
  expect(result.dimensions.values).toBeLessThan(75);
  expect(result.frictionPoints.some((p) => p.toLowerCase().includes("smoking"))).toBeTruthy();
});

vibeCompatibilitySuite.tier1("Computes dietary synergy score for matching vegan / vegetarian preferences", () => {
  const seeker: Partial<RoommateProfileData> = { foodPreference: "veg", cleanliness: 8 };
  const host: Partial<RoommateProfileData> = { foodPreference: "veg", cleanliness: 8 };
  const res = computeCompatibility(seeker, host);

  expect(res.dimensions.values).toBeGreaterThanOrEqual(90);
  expect(res.synchronicityVectors.some((v) => v.includes("VEG"))).toBeTruthy();
});

vibeCompatibilitySuite.tier1("Computes high social harmony for matching introvert-introvert pairing", () => {
  const seeker: Partial<RoommateProfileData> = { socialBattery: "introvert", cleanliness: 8 };
  const host: Partial<RoommateProfileData> = { socialBattery: "introvert", cleanliness: 8 };
  const res = computeCompatibility(seeker, host);

  expect(res.dimensions.social).toBe(95);
});

vibeCompatibilitySuite.tier1("Calculates 5-Axis Spider Radar SVG Polygon with exactly 5 vertex pairs", () => {
  const dims = { cleanliness: 90, social: 85, circadian: 95, financial: 90, values: 80 };
  const polygonStr = computeSpiderPolygon(dims, 100, 100, 80);
  const points = polygonStr.trim().split(" ");

  expect(points).toHaveLength(5);
  points.forEach((p) => {
    const [x, y] = p.split(",").map(Number);
    expect(isNaN(x)).toBeFalsy();
    expect(isNaN(y)).toBeFalsy();
    // All points must be within bounding box [0, 200]
    expect(x).toBeGreaterThanOrEqual(20);
    expect(x).toBeLessThanOrEqual(180);
    expect(y).toBeGreaterThanOrEqual(20);
    expect(y).toBeLessThanOrEqual(180);
  });
});

vibeCompatibilitySuite.tier1("Maps overall scores to verified prognosis verdicts", () => {
  const highResult = computeCompatibility({ cleanliness: 10, smoking: "no" }, { cleanliness: 10, smoking: "no" });
  expect(highResult.prognosisVerdict).toBe("Exceptional Synchronicity");

  const lowResult = computeCompatibility(
    { cleanliness: 2, smoking: "yes", sleepSchedule: "3:00 AM", socialBattery: "extrovert" },
    { cleanliness: 10, smoking: "no", sleepSchedule: "10:00 PM", socialBattery: "introvert" }
  );
  expect(lowResult.prognosisVerdict).toBe("High Friction Risk");
});

// -------------------------------------------------------------
// Tier 2: Boundary & Corner Cases
// -------------------------------------------------------------

vibeCompatibilitySuite.tier2("Spider Polygon handles non-standard center coordinates (cx=150, cy=150, r=100)", () => {
  const dims = { cleanliness: 80, social: 70, circadian: 90, financial: 85, values: 75 };
  const poly = computeSpiderPolygon(dims, 150, 150, 100);
  const points = poly.split(" ");
  expect(points).toHaveLength(5);
  for (const pt of points) {
    const [x, y] = pt.split(",").map(Number);
    expect(x).toBeGreaterThanOrEqual(50);
    expect(x).toBeLessThanOrEqual(250);
    expect(y).toBeGreaterThanOrEqual(50);
    expect(y).toBeLessThanOrEqual(250);
  }
});

vibeCompatibilitySuite.tier2("Guarantees overall compatibility is strictly bounded between [0, 100]", () => {
  // Worst possible combination
  const worst = computeCompatibility(
    { cleanliness: 1, smoking: "yes", sleepSchedule: "4:00 AM", maxBudget: 5000 },
    { cleanliness: 10, smoking: "no", sleepSchedule: "9:00 PM" },
    50000
  );
  expect(worst.overallScore).toBeGreaterThanOrEqual(0);
  expect(worst.overallScore).toBeLessThanOrEqual(100);

  // Best possible combination
  const best = computeCompatibility(
    { cleanliness: 10, smoking: "no", sleepSchedule: "11:00 PM", maxBudget: 50000, socialBattery: "ambivert", foodPreference: "veg" },
    { cleanliness: 10, smoking: "no", sleepSchedule: "11:00 PM", socialBattery: "ambivert", foodPreference: "veg" },
    20000
  );
  expect(best.overallScore).toBeGreaterThanOrEqual(0);
  expect(best.overallScore).toBeLessThanOrEqual(100);
});

vibeCompatibilitySuite.tier2("Handles partial or empty roommate profiles without throwing", () => {
  const emptyRes = computeCompatibility({}, {});
  expect(emptyRes.overallScore).toBeGreaterThan(0);
  expect(emptyRes.dimensions).toBeDefined();
});

vibeCompatibilitySuite.tier2("Spider Polygon handles 0 and 100 dimension boundaries gracefully", () => {
  const zeroDims = { cleanliness: 0, social: 0, circadian: 0, financial: 0, values: 0 };
  const zeroPoly = computeSpiderPolygon(zeroDims, 100, 100, 80);
  expect(zeroPoly.split(" ")).toHaveLength(5);

  const maxDims = { cleanliness: 100, social: 100, circadian: 100, financial: 100, values: 100 };
  const maxPoly = computeSpiderPolygon(maxDims, 100, 100, 80);
  expect(maxPoly.split(" ")).toHaveLength(5);
});

vibeCompatibilitySuite.tier2("Evaluates severe financial stretch where rent exceeds seeker budget", () => {
  const budget = 15000;
  const rent = 45000; // 3x budget
  const res = computeCompatibility({ maxBudget: budget }, {}, rent);
  expect(res.dimensions.financial).toBeLessThanOrEqual(30);
});

// -------------------------------------------------------------
// Tier 3: Pairwise Combinatorial Tests
// -------------------------------------------------------------

vibeCompatibilitySuite.tier3("Pairwise: Vegetarian Introvert vs Flexible Ambivert", () => {
  const seeker: Partial<RoommateProfileData> = {
    foodPreference: "veg",
    socialBattery: "introvert",
    cleanliness: 9,
    smoking: "no",
  };
  const host: Partial<RoommateProfileData> = {
    foodPreference: "flexible",
    socialBattery: "ambivert",
    cleanliness: 8,
    smoking: "no",
  };

  const res = computeCompatibility(seeker, host);
  expect(res.overallScore).toBeGreaterThanOrEqual(75);
  expect(res.prognosisVerdict).toBe("Exceptional Synchronicity");
});

vibeCompatibilitySuite.tier3("Pairwise: Night Owl Freelancer vs Corporate Early Bird", () => {
  const freelancer: Partial<RoommateProfileData> = {
    sleepSchedule: "2:00 AM - 10:00 AM",
    workStyle: "wfh",
    cleanliness: 7,
    smoking: "no",
  };
  const consultant: Partial<RoommateProfileData> = {
    sleepSchedule: "11:00 PM - 6:30 AM",
    workStyle: "office",
    cleanliness: 10,
    smoking: "no",
  };

  const res = computeCompatibility(freelancer, consultant);
  expect(res.dimensions.circadian).toBeLessThanOrEqual(70);
  expect(res.frictionPoints.length).toBeGreaterThanOrEqual(1);
});

// -------------------------------------------------------------
// Tier 4: Real-World Scenario
// -------------------------------------------------------------

vibeCompatibilitySuite.tier4("Scenario: Cross-Metro Seeker Calibration & Harmony Assessment", () => {
  // Seeker completes Onboarding calibration
  const calibratedSeeker: RoommateProfileData = {
    id: "seeker-calibrated-01",
    name: "Rohan Nair",
    sleepSchedule: "1:00 AM - 9:00 AM",
    cleanliness: 9,
    foodPreference: "veg",
    smoking: "no",
    workStyle: "wfh",
    socialBattery: "introvert",
    maxBudget: 28000,
  };

  // Matched against demo-1 (Aanya Verma in Indiranagar)
  const hostAanya: RoommateProfileData = {
    id: "demo-user-1",
    name: "Aanya Verma",
    sleepSchedule: "1:00 AM - 9:00 AM",
    cleanliness: 9,
    foodPreference: "flexible",
    smoking: "balcony only",
    workStyle: "hybrid",
    socialBattery: "ambivert",
  };

  const harmonyResult = computeCompatibility(calibratedSeeker, hostAanya, 24500);

  expect(harmonyResult.overallScore).toBeGreaterThanOrEqual(85);
  expect(harmonyResult.dimensions.cleanliness).toBe(100);
  expect(harmonyResult.dimensions.circadian).toBe(100);
  expect(harmonyResult.synchronicityVectors).toContain("Aligned Circadian Sleep Windows");
  expect(harmonyResult.prognosisVerdict).toBe("Exceptional Synchronicity");

  // Spider Polygon rendering for HUD UI
  const svgCoords = computeSpiderPolygon(harmonyResult.dimensions);
  expect(svgCoords.split(" ")).toHaveLength(5);
});

// -------------------------------------------------------------
// Tier 5: Adversarial Tests
// -------------------------------------------------------------

vibeCompatibilitySuite.tier5("Adversarial: Handles NaN / non-numeric cleanliness inputs gracefully", () => {
  const badInput: any = { cleanliness: NaN, maxBudget: Infinity };
  const res = computeCompatibility(badInput, {});
  expect(isNaN(res.overallScore)).toBeFalsy();
  expect(isFinite(res.overallScore)).toBeTruthy();
});
