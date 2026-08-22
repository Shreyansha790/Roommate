# E2E Test Infra: Roommate Sphere

## Test Philosophy
- Opaque-box, requirement-driven testing covering the full Cyber-Cartographic Telemetry platform.
- Methodology: Category-Partition + Boundary Value Analysis (BVA) + Pairwise Combinatorial Testing + Real-World Workload Testing across 5 Tiers.
- Strict 0-Emoji compliance verification and 0-build-error integrity verification.

## Feature Inventory
| # | Feature | Source (Requirement) | Tier 1 (Coverage) | Tier 2 (Boundary) | Tier 3 (Pairwise) | Tier 4 (Scenario) |
|---|---------|----------------------|:-----------------:|:-----------------:|:-----------------:|:-----------------:|
| 1 | Cyber-Cartographic Design System | ORIGINAL_REQUEST §1 | 5 | 5 | [PASS] | [PASS] |
| 2 | Strict 0-Emoji Policy (Lucide SVGs) | ORIGINAL_REQUEST §1 | 5 | 5 | [PASS] | [PASS] |
| 3 | Command Palette (Cmd+K) NLP Engine | ORIGINAL_REQUEST §2 | 5 | 5 | [PASS] | [PASS] |
| 4 | AI Vibe Co-Pilot & Harmony Dossier | ORIGINAL_REQUEST §3 | 5 | 5 | [PASS] | [PASS] |
| 5 | AI Roommate Agreement Generator | ORIGINAL_REQUEST §4 | 5 | 5 | [PASS] | [PASS] |
| 6 | AI Smart Listing Studio & Commute | ORIGINAL_REQUEST §5 | 5 | 5 | [PASS] | [PASS] |
| 7 | Real-Time Messaging & Seeker Dossier | ORIGINAL_REQUEST §6 | 5 | 5 | [PASS] | [PASS] |
| 8 | All 8 App Routes & Navigation HUD | ORIGINAL_REQUEST §7 | 5 | 5 | [PASS] | [PASS] |

## Test Architecture
- Test runner: Node.js / TypeScript test suites (`npm test` / standalone automated test runners).
- Test targets:
  - `tests/e2e/design-system.test.ts` (Theme tokens, chamfered styling, 0-emoji validation, Web Audio synthesizer).
  - `tests/e2e/nlp-search.test.ts` (Cmd+K query tokenizer, multi-vector extraction, budget/geo/lifestyle translation).
  - `tests/e2e/vibe-compatibility.test.ts` (5-D harmony algorithm, chronotype waveforms, radar geometry).
  - `tests/e2e/agreement-generator.test.ts` (6-pillar contract matrix, conflict resolution, markdown export).
  - `tests/e2e/listing-commute.test.ts` (Listing copy enhancer, amenity auto-tagger, neighborhood index, commute isochrones).
  - `tests/e2e/chat-dossier.test.ts` (Direct chat console state, action cards, seeker dossier verification).
  - `tests/e2e/routes-integrity.test.ts` (Verification across all 8 pages, build test `npm run build`).

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | Tech Seeker Indiranagar Quest | Cmd+K NLP search ("Indiranagar night owl techie <=25k") -> Filter -> Split-view browse -> Dossier inspection -> Vibe Co-Pilot harmony check | High |
| 2 | Host Space Publication & Optimization | AI Studio (/post) -> Unstructured text input -> AI Auto-tagger & Headline Enhancer -> Price recommendation -> Commute isochrone score generation -> Publish | High |
| 3 | Roommate Agreement Negotiation | Host + Seeker Vibe DNA calibration -> 6-pillar contract generation -> Custom chore matrix -> Markdown/Printable export -> In-chat co-sign | High |
| 4 | Side-by-Side Space Telemetry Comparison | Bookmark 3 listings across Bangalore & Mumbai -> `/saved` matrix comparison -> Commute vs Rent vs Vibe % ranking | Medium |
| 5 | Cross-Metro Seeker Calibration | `/onboarding` 2-step Vibe DNA calibration -> Live SVG spider radar visualization -> Hash generation -> Instant personalized browse re-ranking | High |

## Coverage Thresholds
- Tier 1: ≥40 test cases (≥5 per feature)
- Tier 2: ≥40 boundary/corner test cases (≥5 per feature)
- Tier 3: ≥10 pairwise cross-feature interaction cases
- Tier 4: ≥5 realistic end-to-end user application workflows
- Tier 5: Adversarial white-box stress testing and zero-emoji forensic validation
- Total: ≥95 automated test cases
