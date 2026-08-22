# Project: Roommate Sphere — Cyber-Cartographic Telemetry & Spatial Living Discovery Platform

## Architecture
Roommate Sphere is an avant-garde AI living discovery platform built on Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Lucide React, and Supabase SSR. The application uses a "Cyber-Cartographic Telemetry & Spatial Radar" visual architecture, featuring high-precision HUD controls, polar radar visualizers, 5-dimensional compatibility algorithms, semantic NLP query parsing, commute isochrones, house rules protocol generation, and encrypted in-app communication.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ROOMMATESPHERE HUD                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  TopNav Telemetry Bar (Active Metro Nodes | Sys Latency | Zero-Brokerage)   │
│  Global Command Palette (Cmd+K) AI NLP Query Engine & Vector Tokenizer     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                 APP ROUTER                                  │
│  ├── / (Home / Telemetry Hub with Hero Radar & Quick Match Console)         │
│  ├── /browse (Grid/Map Split-view, Isochrone Radii, Vibe Filter Chips)     │
│  ├── /listings/[id] (Dossier View: Harmony Radar, Commute Radar, Agreement) │
│  ├── /post (AI Smart Listing Studio: Enhancer, Auto-Tagger, Price Optimize) │
│  ├── /onboarding (Seeker Vibe DNA Calibration & 5-Axis Spider Polygon)      │
│  ├── /saved (Wishlist & Side-by-Side HUD Comparison Matrix)                │
│  └── /login & /signup (CRT Terminal Auth & Session Gateway)                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                            CORE ENGINE & MODULES                            │
│  ├── lib/audio-telemetry.ts (Web Audio API Synthesizer: Blip, Ping, Chime)  │
│  ├── lib/nlp-parser.ts (Freeform Search Tokenizer & Multi-Vector Matcher)  │
│  ├── lib/compatibility.ts (5-D Harmony Algorithm & Chronotype Waveforms)   │
│  ├── lib/agreement-generator.ts (6-Pillar House Rules Protocol Synthesizer) │
│  ├── lib/commute-radar.ts (Neighborhood Telemetry & Isochrone Scorecards)   │
│  ├── lib/demo-data.ts (Rich deterministic multi-metro datasets & seed)      │
│  └── components/chat/ (Tactical In-App Direct Messaging & Action Cards)     │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Cyber-Cartographic Design Engine | Obsidian `#05070a`, Tungsten `#0d1117`, Phosphor Emerald `#00ff88`, Solar Amber `#ffb700`, Cyan `#00e5ff`, chamfered tech-tiles, HUD gauges, monospace badges | M1 | Survey |
| 2 | Strict 0-Emoji Policy & Lucide Icons | 100% SVG mapping across all lifestyle vectors, amenities, transit modes, verification seals; 0 unicode emojis | M1 | Survey |
| 3 | Tactical Top Navigation & Audio HUD | Top telemetry ticker (nodes, latency), audio toggle (Web Audio API SFX), Command Palette trigger, mobile slide-over HUD | M1 | Survey |
| 4 | Interactive Spatial Radar Canvas | Concentric polar radar grid with pulsing active nodes, rotating sweep line, node popover dossiers | M1 | Survey |
| 5 | Command-Palette (Cmd+K) AI Search | Global modal hotkey, freeform NLP intent parser, budget/geo/lifestyle vector tokenization, instant filter translation | M2 | Survey |
| 6 | Home Route `/` Telemetry Cockpit | Hero with live radar, quick match telemetry console, curated spatial zones grid, live metric KPI counters | M2 | Survey |
| 7 | Browse Route `/browse` Split-View | Discovery split-view (listing grid + dark Leaflet radar map), locality search, isochrone travel slider, price histogram | M2 | Survey |
| 8 | Listing Dossier `/listings/[id]` | High-density living dossier: media scanline gallery, specs breakdown, host profile, interactive actions | M3 | Survey |
| 9 | AI Vibe Co-Pilot & Harmony Dossier | 5-D dynamic compatibility algorithm, interactive SVG 5-axis spider radar, circadian chronotype waveforms, HUD circular gauges | M3 | Survey |
| 10 | Commute Isochrones Scorecard | Multi-modal travel envelopes (Metro, Bike, Drive, Walk) to key tech parks, universities, and hubs | M3 | Survey |
| 11 | Neighborhood Telemetry Index | 5-vector neighborhood scorecard (Safety, Walkability, Nightlife, Cafes, Grocery) | M3 | Survey |
| 12 | AI Roommate Agreement Generator | 6-pillar customizable contract matrix (Chores, Quiet hours, Utilities, Guests, Subletting, Escalation ladder), markdown/printable export | M3 | Survey |
| 13 | AI Smart Listing Studio `/post` | Multi-step telemetry creator, AI description copy enhancer, amenity auto-tagger, price & match optimizer, live dossier preview | M4 | Survey |
| 14 | Seeker Onboarding `/onboarding` | 2-step Vibe DNA vector calibration with live interactive SVG spider radar preview, chronotype selector, habit matrix | M4 | Survey |
| 15 | Saved Listings & Matrix `/saved` | Saved bookmarks grid + side-by-side comparative HUD matrix (Rent, Vibe %, Commute, Amenities, Host Score) | M4 | Survey |
| 16 | Tactical Auth `/login` & `/signup` | CRT terminal auth gateway with monospace inputs, cyber focus rings, Google OAuth trigger, instant demo fallback | M4 | Survey |
| 17 | Real-Time In-App Direct Messaging | Tactical chat console with thread management, live chat simulation, interactive action cards (viewing scheduler, agreement co-sign) | M4 | Survey |
| 18 | Seeker Dossier Modal | Verified lifestyle telemetry modal accessible across listings, chat, and search cards | M4 | Survey |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Cyber-Cartographic Foundation & Design System | Visual tokens (`tailwind.config.ts`, `globals.css`), Web Audio engine (`lib/audio-telemetry.ts`), TopNav HUD, Footer, Radar Canvas, Lucide registry (0 emojis) | none | DONE |
| M2 | Command Palette & Core Discovery Engine | NLP parser (`lib/nlp-parser.ts`), `CommandPalette.tsx`, Home `/` cockpit, Browse `/browse` split-view with Leaflet radar map & dynamic filters | M1 | IN_PROGRESS |
| M3 | AI Vibe Co-Pilot, Agreements & Listing Dossier | Compatibility engine (`lib/compatibility.ts`), Agreement generator (`lib/agreement-generator.ts`), Commute radar (`lib/commute-radar.ts`), `/listings/[id]` dossier page | M1, M2 | PLANNED |
| M4 | Smart Listing Studio, Onboarding, Messaging & Auth | AI Studio `/post`, Seeker `/onboarding`, Saved HUD `/saved`, Tactical Auth `/login` + `/signup`, Direct Chat Console & Seeker Dossier modal | M1, M2, M3 | PLANNED |
| M5 | E2E Testing Verification & Forensic Audit Gate | Full E2E test suite execution across Tiers 1-4, adversarial coverage hardening (Tier 5), 0-emoji forensic audit, `npm run build` verification | M1, M2, M3, M4 | PLANNED |

## Interface Contracts

### 1. NLP Search Parser (`lib/nlp-parser.ts`)
```typescript
export interface ParsedSearchVectors {
  rawQuery: string;
  budget?: { min?: number; max?: number; target?: number; confidence: number };
  geoFence?: { city?: string; locality?: string; subLocalities?: string[]; metroProximityRequired?: boolean; confidence: number };
  roomType?: "single" | "shared" | "entire_flat";
  lifestyleSync: {
    sleepRhythm?: "night_owl" | "early_bird" | "flexible";
    cleanlinessMin?: number;
    foodPreference?: "veg" | "nonveg" | "flexible";
    smoking?: boolean;
    petsAllowed?: boolean;
    socialBattery?: "introvert" | "ambivert" | "extrovert";
    workStyle?: "wfh" | "hybrid" | "office";
  };
  amenityTokens: string[];
  vibeTokens: string[];
  extractedTokensCount: number;
}
export function parseNlpQuery(query: string): ParsedSearchVectors;
export function rankListingsByQuery(listings: Listing[], query: string, userProfile?: RoommateProfile): Listing[];
```

### 2. AI Vibe Compatibility Engine (`lib/compatibility.ts`)
```typescript
export interface CompatibilityResult {
  overallScore: number; // 0 - 100
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
export function computeCompatibility(seeker: Partial<RoommateProfile>, host: Partial<RoommateProfile>, listingRent?: number): CompatibilityResult;
```

### 3. AI Agreement Protocol Generator (`lib/agreement-generator.ts`)
```typescript
export interface RoommateAgreementProtocol {
  id: string;
  flatAddress: string;
  parties: { roommate1: { name: string; id: string }; roommate2: { name: string; id: string } };
  effectiveDate: string;
  tenureMonths: number;
  financialProtocol: { rentContribution: { roommate1: number; roommate2: number }; rentDueDay: number; utilitySplitPolicy: string; securityDepositHeld: number };
  choresMatrix: { cleaningRotation: string; kitchenDutyTurnaroundHours: number; trashDisposalSchedule: string; deepCleanDay: string };
  quietHoursAndCircadian: { weekdayQuietHours: { start: string; end: string }; weekendQuietHours: { start: string; end: string }; soundPolicy: string };
  guestAndOvernightPolicy: { advanceNoticeHours: number; maxOvernightNightsPerMonth: number; partnerStayPolicy: string; partiesAllowed: boolean };
  subletAndExitProtocol: { noticePeriodDays: number; replacementTenantApproval: boolean; forfeitConditions: string[] };
  conflictEscalationLadder: string[];
}
export function generateAgreementFromProfiles(hostProfile: RoommateProfile, seekerProfile: RoommateProfile, listing: Listing): RoommateAgreementProtocol;
export function exportAgreementToMarkdown(agreement: RoommateAgreementProtocol): string;
```

### 4. Commute & Neighborhood Radar (`lib/commute-radar.ts`)
```typescript
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
export function getListingCommuteScorecard(listing: Listing): { neighborhood: NeighborhoodTelemetry; isochrones: CommuteIsochrone[] };
```

## Code Layout
- `app/`
  - `globals.css`: Visual tokens, chamfered clip-paths, HUD gauges, waveforms, scanlines.
  - `layout.tsx`: Root shell, theme provider, TopNav HUD, Footer, Audio Synthesizer provider.
  - `page.tsx`: Home / Telemetry Hub.
  - `browse/`: Split-view discovery, filters, listing grid, dark radar map.
  - `listings/[id]/`: Living dossier, harmony radar, agreement generator, direct chat trigger.
  - `post/`: AI Smart Listing Studio (copy enhancer, auto-tagger, price optimizer).
  - `onboarding/`: 2-step Vibe DNA vector calibration & interactive spider radar.
  - `saved/`: Wishlist & Side-by-side comparison matrix.
  - `login/` & `signup/`: CRT tactical terminal authentication.
- `components/`
  - `HUD/`: `RadarCanvas.tsx`, `CircularGauge.tsx`, `WaveformOscilloscope.tsx`, `TacticalBadge.tsx`.
  - `search/`: `CommandPalette.tsx`, `VectorFilterChips.tsx`.
  - `vibe/`: `VibeRadarSpider.tsx`, `VibeCoPilotCard.tsx`, `CircadianWaveform.tsx`.
  - `agreement/`: `AgreementBuilderModal.tsx`, `AgreementPreviewDoc.tsx`.
  - `listing/`: `CommuteScorecard.tsx`, `NeighborhoodRadar.tsx`, `AiCopyEnhancer.tsx`.
  - `chat/`: `DirectChatConsole.tsx`, `ChatActionCard.tsx`, `SeekerDossierModal.tsx`.
  - `auth/`: `top-nav.tsx`, `profile-menu.tsx`.
- `lib/`:
  - `audio-telemetry.ts`, `nlp-parser.ts`, `compatibility.ts`, `agreement-generator.ts`, `commute-radar.ts`, `demo-data.ts`, `supabase.ts`, `utils.ts`.
- `tests/`: E2E test suites and unit validation scripts.
