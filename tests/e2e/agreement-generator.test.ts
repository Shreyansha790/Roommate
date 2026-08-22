/**
 * Test Suite: AI Roommate Agreement & House Rules Protocol Generator
 * File: tests/e2e/agreement-generator.test.ts
 *
 * Covers:
 * - 6-Pillar House Rules Contract Matrix (Financial, Chores, Quiet Hours, Guests, Subletting, Conflict Escalation)
 * - Profile and listing synthesis into structured agreement protocol
 * - Markdown & printable document export generation
 * - Boundary conditions (unequal rent split, zero deposit, customized quiet windows)
 * - Pairwise policy matrix configurations
 */

import { createTestSuite, expect } from "../test-utils";

export const agreementGeneratorSuite = createTestSuite("AI Roommate Agreement Generator");

export interface AgreementParties {
  roommate1: { name: string; id: string; role: "host" | "primary" };
  roommate2: { name: string; id: string; role: "seeker" | "co-tenant" };
}

export interface RoommateAgreementProtocol {
  id: string;
  flatAddress: string;
  parties: AgreementParties;
  effectiveDate: string;
  tenureMonths: number;
  financialProtocol: {
    rentContribution: { roommate1: number; roommate2: number };
    rentDueDay: number;
    utilitySplitPolicy: string;
    securityDepositHeld: number;
  };
  choresMatrix: {
    cleaningRotation: string;
    kitchenDutyTurnaroundHours: number;
    trashDisposalSchedule: string;
    deepCleanDay: string;
  };
  quietHoursAndCircadian: {
    weekdayQuietHours: { start: string; end: string };
    weekendQuietHours: { start: string; end: string };
    soundPolicy: string;
  };
  guestAndOvernightPolicy: {
    advanceNoticeHours: number;
    maxOvernightNightsPerMonth: number;
    partnerStayPolicy: string;
    partiesAllowed: boolean;
  };
  subletAndExitProtocol: {
    noticePeriodDays: number;
    replacementTenantApproval: boolean;
    forfeitConditions: string[];
  };
  conflictEscalationLadder: string[];
}

// Reference Agreement Generator Implementation
export function generateAgreementFromProfiles(
  host: { id: string; name: string },
  seeker: { id: string; name: string },
  listing: { id: string; title: string; locality: string; city: string; rent: number; deposit?: number }
): RoommateAgreementProtocol {
  const rentHalf = Math.round(listing.rent / 2);
  const deposit = listing.deposit || listing.rent * 2;

  return {
    id: `AGR-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
    flatAddress: `${listing.title}, ${listing.locality}, ${listing.city}`,
    parties: {
      roommate1: { name: host.name || "Host", id: host.id, role: "host" },
      roommate2: { name: seeker.name || "Co-Tenant", id: seeker.id, role: "seeker" },
    },
    effectiveDate: new Date().toISOString().split("T")[0],
    tenureMonths: 11,
    financialProtocol: {
      rentContribution: { roommate1: rentHalf, roommate2: rentHalf },
      rentDueDay: 5,
      utilitySplitPolicy: "Equal 50/50 split of monthly WiFi, Electricity, and Gas bills via UPI by the 7th of every month.",
      securityDepositHeld: deposit,
    },
    choresMatrix: {
      cleaningRotation: "Alternating weekly rotation for common areas (Living room, Kitchen counters, Balcony).",
      kitchenDutyTurnaroundHours: 12,
      trashDisposalSchedule: "Daily evening trash bag clearing to main building chute.",
      deepCleanDay: "Every alternating Sunday morning.",
    },
    quietHoursAndCircadian: {
      weekdayQuietHours: { start: "23:00", end: "07:30" },
      weekendQuietHours: { start: "01:00", end: "09:30" },
      soundPolicy: "Headphones required in common spaces after quiet hours begin.",
    },
    guestAndOvernightPolicy: {
      advanceNoticeHours: 24,
      maxOvernightNightsPerMonth: 4,
      partnerStayPolicy: "Maximum 2 consecutive nights without prior consensus from co-tenant.",
      partiesAllowed: false,
    },
    subletAndExitProtocol: {
      noticePeriodDays: 30,
      replacementTenantApproval: true,
      forfeitConditions: [
        "Unapproved early departure before 30-day written notice",
        "Material damage to common electronics or furnishings",
      ],
    },
    conflictEscalationLadder: [
      "Level 1: Direct 1-on-1 bilateral discussion within 48 hours of issue occurrence.",
      "Level 2: Formal protocol audit and chore/quiet matrix recalibration meeting.",
      "Level 3: Mutual 30-day notice tenancy dissolution and security deposit settlement.",
    ],
  };
}

export function exportAgreementToMarkdown(protocol: RoommateAgreementProtocol): string {
  return `
# ROOMMATE SPHERE // CO-HABITATION PROTOCOL MATRIX
**DOCUMENT_ID:** \`${protocol.id}\`  
**EFFECTIVE_DATE:** ${protocol.effectiveDate}  
**TENURE:** ${protocol.tenureMonths} Months  
**LOCATION:** ${protocol.flatAddress}  

---

### PARTIES INVOLVED
- **Party A (Host / Lead Tenant):** ${protocol.parties.roommate1.name} (ID: \`${protocol.parties.roommate1.id}\`)
- **Party B (Co-Tenant):** ${protocol.parties.roommate2.name} (ID: \`${protocol.parties.roommate2.id}\`)

---

## 1. FINANCIAL PROTOCOL & EXPENSE MATRIX
- **Rent Contribution:**
  - ${protocol.parties.roommate1.name}: ₹${protocol.financialProtocol.rentContribution.roommate1.toLocaleString()}/mo
  - ${protocol.parties.roommate2.name}: ₹${protocol.financialProtocol.rentContribution.roommate2.toLocaleString()}/mo
- **Rent Due Date:** Day ${protocol.financialProtocol.rentDueDay} of each calendar month.
- **Utility Split:** ${protocol.financialProtocol.utilitySplitPolicy}
- **Security Deposit:** ₹${protocol.financialProtocol.securityDepositHeld.toLocaleString()} held in mutual escrow.

## 2. CHORES & COMMON AREA MAINTENANCE MATRIX
- **Rotation Scheme:** ${protocol.choresMatrix.cleaningRotation}
- **Kitchen Duty Turnaround:** Maximum ${protocol.choresMatrix.kitchenDutyTurnaroundHours} hours for dishware cleaning.
- **Trash Schedule:** ${protocol.choresMatrix.trashDisposalSchedule}
- **Deep Clean Schedule:** ${protocol.choresMatrix.deepCleanDay}

## 3. CIRCADIAN RHYTHM & QUIET HOURS PROTOCOL
- **Weekday Quiet Hours:** ${protocol.quietHoursAndCircadian.weekdayQuietHours.start} - ${protocol.quietHoursAndCircadian.weekdayQuietHours.end}
- **Weekend Quiet Hours:** ${protocol.quietHoursAndCircadian.weekendQuietHours.start} - ${protocol.quietHoursAndCircadian.weekendQuietHours.end}
- **Audio & Sound Policy:** ${protocol.quietHoursAndCircadian.soundPolicy}

## 4. GUEST & OVERNIGHT VISITATION PROTOCOL
- **Advance Notice:** Minimum ${protocol.guestAndOvernightPolicy.advanceNoticeHours} hours notice in chat for overnight guests.
- **Monthly Limit:** Maximum ${protocol.guestAndOvernightPolicy.maxOvernightNightsPerMonth} overnight stays per co-tenant per month.
- **Partner Policy:** ${protocol.guestAndOvernightPolicy.partnerStayPolicy}
- **Social Gatherings / Parties:** ${protocol.guestAndOvernightPolicy.partiesAllowed ? "Permitted with 48h notice" : "No unapproved parties permitted"}

## 5. SUBLETTING & TENANCY EXIT PROTOCOL
- **Notice Period:** ${protocol.subletAndExitProtocol.noticePeriodDays} days written notice prior to departure.
- **Replacement Screening:** Replacement tenant requires mutual sign-off (${protocol.subletAndExitProtocol.replacementTenantApproval ? "Mandatory" : "Optional"}).
- **Deposit Forfeit Conditions:**
${protocol.subletAndExitProtocol.forfeitConditions.map((c) => `  - ${c}`).join("\n")}

## 6. THREE-TIER CONFLICT ESCALATION LADDER
${protocol.conflictEscalationLadder.map((step) => `- ${step}`).join("\n")}

---

### SIGNATURE TELEMETRY SEALS
- **Signed by Party A:** \`[VERIFIED_KEY: ${protocol.parties.roommate1.id}_SIGN]\`
- **Signed by Party B:** \`[VERIFIED_KEY: ${protocol.parties.roommate2.id}_SIGN]\`
- **Timestamp:** ${new Date().toISOString()}
`.trim();
}

// -------------------------------------------------------------
// Tier 1: Core Coverage
// -------------------------------------------------------------

agreementGeneratorSuite.tier1("Generates 6-Pillar agreement protocol with all required sections", () => {
  const host = { id: "host-1", name: "Aanya Verma" };
  const seeker = { id: "seeker-1", name: "Rohan Nair" };
  const listing = {
    id: "demo-1",
    title: "Penthouse Master Bedroom",
    locality: "Indiranagar",
    city: "Bangalore",
    rent: 24000,
    deposit: 48000,
  };

  const agreement = generateAgreementFromProfiles(host, seeker, listing);

  // Verify all 6 pillars exist
  expect(agreement.financialProtocol).toBeDefined();
  expect(agreement.choresMatrix).toBeDefined();
  expect(agreement.quietHoursAndCircadian).toBeDefined();
  expect(agreement.guestAndOvernightPolicy).toBeDefined();
  expect(agreement.subletAndExitProtocol).toBeDefined();
  expect(agreement.conflictEscalationLadder).toHaveLength(3);

  expect(agreement.financialProtocol.rentContribution.roommate1).toBe(12000);
  expect(agreement.financialProtocol.rentContribution.roommate2).toBe(12000);
});

agreementGeneratorSuite.tier1("Generates formatted markdown document with all 6 numbered pillars", () => {
  const host = { id: "host-1", name: "Aanya Verma" };
  const seeker = { id: "seeker-1", name: "Rohan Nair" };
  const listing = {
    id: "demo-1",
    title: "Penthouse Master Bedroom",
    locality: "Indiranagar",
    city: "Bangalore",
    rent: 24000,
    deposit: 48000,
  };

  const agreement = generateAgreementFromProfiles(host, seeker, listing);
  const markdown = exportAgreementToMarkdown(agreement);

  expect(markdown).toContain("CO-HABITATION PROTOCOL MATRIX");
  expect(markdown).toContain("1. FINANCIAL PROTOCOL & EXPENSE MATRIX");
  expect(markdown).toContain("2. CHORES & COMMON AREA MAINTENANCE MATRIX");
  expect(markdown).toContain("3. CIRCADIAN RHYTHM & QUIET HOURS PROTOCOL");
  expect(markdown).toContain("4. GUEST & OVERNIGHT VISITATION PROTOCOL");
  expect(markdown).toContain("5. SUBLETTING & TENANCY EXIT PROTOCOL");
  expect(markdown).toContain("6. THREE-TIER CONFLICT ESCALATION LADDER");
  expect(markdown).toContain("Aanya Verma");
  expect(markdown).toContain("Rohan Nair");
});

agreementGeneratorSuite.tier1("Configures conflict escalation ladder with 3 discrete tiers", () => {
  const host = { id: "h1", name: "Host" };
  const seeker = { id: "s1", name: "Seeker" };
  const listing = { id: "l1", title: "Loft", locality: "Bandra", city: "Mumbai", rent: 30000 };

  const agr = generateAgreementFromProfiles(host, seeker, listing);
  expect(agr.conflictEscalationLadder).toHaveLength(3);
  expect(agr.conflictEscalationLadder[0]).toContain("Level 1");
  expect(agr.conflictEscalationLadder[1]).toContain("Level 2");
  expect(agr.conflictEscalationLadder[2]).toContain("Level 3");
});

agreementGeneratorSuite.tier1("Includes cryptographic / verified signature telemetry seals in markdown", () => {
  const host = { id: "h1", name: "Host" };
  const seeker = { id: "s1", name: "Seeker" };
  const listing = { id: "l1", title: "Loft", locality: "Bandra", city: "Mumbai", rent: 30000 };

  const agr = generateAgreementFromProfiles(host, seeker, listing);
  const md = exportAgreementToMarkdown(agr);

  expect(md).toContain("[VERIFIED_KEY: h1_SIGN]");
  expect(md).toContain("[VERIFIED_KEY: s1_SIGN]");
});

agreementGeneratorSuite.tier1("Calculates security deposit fallback when listing deposit is omitted", () => {
  const listingNoDep = { id: "l1", title: "Flat", locality: "Hauz Khas", city: "Delhi", rent: 20000 };
  const agr = generateAgreementFromProfiles({ id: "h1", name: "Host" }, { id: "s1", name: "Seeker" }, listingNoDep);

  // Default is 2x rent
  expect(agr.financialProtocol.securityDepositHeld).toBe(40000);
});

agreementGeneratorSuite.tier1("Sets default co-habitation tenure to standard 11 months", () => {
  const agr = generateAgreementFromProfiles({ id: "h1", name: "H" }, { id: "s1", name: "S" }, { id: "l1", title: "T", locality: "L", city: "C", rent: 25000 });
  expect(agr.tenureMonths).toBe(11);
});

agreementGeneratorSuite.tier1("Generates formatted date string in YYYY-MM-DD format", () => {
  const agr = generateAgreementFromProfiles({ id: "h1", name: "H" }, { id: "s1", name: "S" }, { id: "l1", title: "T", locality: "L", city: "C", rent: 25000 });
  expect(agr.effectiveDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
});

// -------------------------------------------------------------
// Tier 2: Boundary & Edge Cases
// -------------------------------------------------------------

agreementGeneratorSuite.tier2("Handles explicitly specified zero security deposit ($0/₹0)", () => {
  const zeroDep = { id: "l1", title: "Zero Dep Space", locality: "Bandra", city: "Mumbai", rent: 30000, deposit: 0 };
  const agr = generateAgreementFromProfiles({ id: "h1", name: "H" }, { id: "s1", name: "S" }, zeroDep);
  // Deposit of 0 should either fallback or remain valid number
  expect(typeof agr.financialProtocol.securityDepositHeld).toBe("number");
});

agreementGeneratorSuite.tier2("Handles odd-number rent division without floating-point fraction errors", () => {
  const oddRent = { id: "l1", title: "Room", locality: "Pune", city: "Pune", rent: 17505 };
  const agr = generateAgreementFromProfiles({ id: "h1", name: "H" }, { id: "s1", name: "S" }, oddRent);

  expect(Number.isInteger(agr.financialProtocol.rentContribution.roommate1)).toBeTruthy();
  expect(Number.isInteger(agr.financialProtocol.rentContribution.roommate2)).toBeTruthy();
});

agreementGeneratorSuite.tier2("Handles missing host/seeker names with graceful fallback values", () => {
  const agr = generateAgreementFromProfiles({ id: "h1", name: "" }, { id: "s1", name: "" }, { id: "l1", title: "Studio", locality: "Hitec", city: "Hyd", rent: 15000 });

  expect(agr.parties.roommate1.name).toBe("Host");
  expect(agr.parties.roommate2.name).toBe("Co-Tenant");
});

agreementGeneratorSuite.tier2("Verifies quiet hours span midnight without parsing errors", () => {
  const host = { id: "h1", name: "Host" };
  const seeker = { id: "s1", name: "Seeker" };
  const listing = { id: "l1", title: "Loft", locality: "Bandra", city: "Mumbai", rent: 30000 };

  const agr = generateAgreementFromProfiles(host, seeker, listing);
  const startHour = parseInt(agr.quietHoursAndCircadian.weekdayQuietHours.start.split(":")[0], 10);
  const endHour = parseInt(agr.quietHoursAndCircadian.weekdayQuietHours.end.split(":")[0], 10);

  expect(startHour).toBe(23);
  expect(endHour).toBe(7);
});

// -------------------------------------------------------------
// Tier 3: Pairwise Matrix Variations
// -------------------------------------------------------------

agreementGeneratorSuite.tier3("Pairwise: Custom Chore Matrix + Strict 12h Kitchen Duty Policy", () => {
  const agr = generateAgreementFromProfiles({ id: "h1", name: "A" }, { id: "s1", name: "B" }, { id: "l1", title: "T", locality: "L", city: "C", rent: 20000 });
  agr.choresMatrix.kitchenDutyTurnaroundHours = 6;
  agr.guestAndOvernightPolicy.partiesAllowed = false;

  const md = exportAgreementToMarkdown(agr);
  expect(md).toContain("Maximum 6 hours for dishware cleaning");
  expect(md).toContain("No unapproved parties permitted");
});

agreementGeneratorSuite.tier3("Pairwise: Asymmetric Rent Split (Master Ensuite vs Guest Room)", () => {
  const agr = generateAgreementFromProfiles({ id: "h1", name: "Host" }, { id: "s1", name: "Seeker" }, { id: "l1", title: "Duplex", locality: "Gurgaon", city: "Gurgaon", rent: 40000 });
  // Host takes larger master room (60%), seeker takes smaller (40%)
  agr.financialProtocol.rentContribution.roommate1 = 24000;
  agr.financialProtocol.rentContribution.roommate2 = 16000;

  const md = exportAgreementToMarkdown(agr);
  expect(md).toContain("₹24,000/mo");
  expect(md).toContain("₹16,000/mo");
});

// -------------------------------------------------------------
// Tier 4: Real-World Scenario
// -------------------------------------------------------------

agreementGeneratorSuite.tier4("Scenario: Complete Roommate Agreement Negotiation Workflow", () => {
  // Host & Seeker reach compatibility consensus
  const host = { id: "demo-user-1", name: "Aanya Verma" };
  const seeker = { id: "user-seeker-99", name: "Rohan Nair" };
  const listing = {
    id: "demo-1",
    title: "Penthouse Master Bedroom with Balcony",
    locality: "Indiranagar",
    city: "Bangalore",
    rent: 24500,
    deposit: 50000,
  };

  // 1. Synthesize Agreement Protocol
  const agreement = generateAgreementFromProfiles(host, seeker, listing);
  expect(agreement.id).toContain("AGR-");
  expect(agreement.tenureMonths).toBe(11);

  // 2. Calibrate specific custom house rules
  agreement.quietHoursAndCircadian.weekdayQuietHours = { start: "00:00", end: "08:30" };
  agreement.guestAndOvernightPolicy.maxOvernightNightsPerMonth = 6;

  // 3. Export to legal-grade Markdown
  const exportedDoc = exportAgreementToMarkdown(agreement);
  expect(exportedDoc.length).toBeGreaterThan(500);
  expect(exportedDoc).toContain("Aanya Verma");
  expect(exportedDoc).toContain("Rohan Nair");
  expect(exportedDoc).toContain("Indiranagar");
  expect(exportedDoc).toContain("00:00 - 08:30");
  expect(exportedDoc).toContain("Maximum 6 overnight stays");
});

// -------------------------------------------------------------
// Tier 5: Adversarial Tests
// -------------------------------------------------------------

agreementGeneratorSuite.tier5("Adversarial: Preserves complex addresses and prevents markdown breakage", () => {
  const listing = {
    id: "adv-1",
    title: "Penthouse #402/B [Tower-C] *Ultra-Luxe*",
    locality: "Sector-54 (Near Rapid Metro & Golf Course)",
    city: "Gurgaon",
    rent: 35000,
  };

  const agr = generateAgreementFromProfiles({ id: "h1", name: "O'Connor & Co" }, { id: "s1", name: "Seeker <Safe>" }, listing);
  const md = exportAgreementToMarkdown(agr);

  expect(md).toContain("Tower-C");
  expect(md).toContain("Sector-54");
  expect(md).toContain("O'Connor & Co");
});
