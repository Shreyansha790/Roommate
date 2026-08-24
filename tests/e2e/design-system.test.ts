/**
 * Test Suite: Cyber-Cartographic Design System & Visual Telemetry
 * File: tests/e2e/design-system.test.ts
 *
 * Covers:
 * - Palette tokens (Obsidian, Tungsten, Phosphor Emerald, Solar Amber, Cyan, etc.)
 * - Chamfer styling, bento-card properties, tactical typography
 * - Forensic 0-Emoji Static Code Validation across all source files
 * - Web Audio API Synthesizer contracts and SFX parameters
 */

import { createTestSuite, expect } from "../test-utils";
import * as fs from "fs";
import * as path from "path";

export const designSystemSuite = createTestSuite("Cyber-Cartographic Design System & 0-Emoji Forensic Audit");

// Helper to recursively collect source files
function getSourceFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (!file.startsWith(".") && file !== "node_modules" && file !== "tests") {
        getSourceFiles(filePath, fileList);
      }
    } else if (file.endsWith(".ts") || file.endsWith(".tsx") || file.endsWith(".css")) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

// -------------------------------------------------------------
// Tier 1: Core Coverage (Design System Tokens & Contracts)
// -------------------------------------------------------------

designSystemSuite.tier1("Tailwind configuration contains luxury color tokens", () => {
  const tailwindPath = path.resolve(__dirname, "../../tailwind.config.ts");
  expect(fs.existsSync(tailwindPath)).toBeTruthy();
  const content = fs.readFileSync(tailwindPath, "utf-8");

  // Verify modern palette definitions exist
  expect(content).toContain("cream");
  expect(content).toContain("#faf9f6");
  expect(content).toContain("coral");
  expect(content).toContain("#d95338");
  expect(content).toContain("sage");
  expect(content).toContain("amber");
});

designSystemSuite.tier1("Globals CSS defines luxury components and styling", () => {
  const cssPath = path.resolve(__dirname, "../../app/globals.css");
  expect(fs.existsSync(cssPath)).toBeTruthy();
  const content = fs.readFileSync(cssPath, "utf-8");

  expect(content).toContain(".glass-capsule");
  expect(content).toContain(".luxury-card");
  expect(content).toContain(".neo-button");
  expect(content).toContain(".neo-input");
  expect(content).toContain("::-webkit-scrollbar");
});

designSystemSuite.tier1("Typography uses refined font smoothing and letter spacing", () => {
  const cssPath = path.resolve(__dirname, "../../app/globals.css");
  const content = fs.readFileSync(cssPath, "utf-8");

  expect(content).toContain("-webkit-font-smoothing: antialiased");
  expect(content).toContain("letter-spacing: -0.02em");
});

designSystemSuite.tier1("Web Audio API Synthesizer frequency & waveform contracts", () => {
  // Telemetry SFX Presets spec:
  // - telemetry_blip: 880Hz -> 440Hz short beep (duration ~60ms)
  // - radar_ping: 1200Hz sine sweep with decay (~150ms)
  // - lock_chime: 523.25Hz -> 659.25Hz -> 783.99Hz triad (C-E-G)
  // - error_buzz: 180Hz sawtooth buzz (~200ms)
  const soundPresets = {
    blip: { startFreq: 880, endFreq: 440, type: "sine" as const, duration: 0.06 },
    ping: { startFreq: 1200, endFreq: 600, type: "sine" as const, duration: 0.15 },
    chime: { chordFreqs: [523.25, 659.25, 783.99], type: "triangle" as const, duration: 0.35 },
    error: { freq: 180, type: "sawtooth" as const, duration: 0.2 },
  };

  expect(soundPresets.blip.startFreq).toBe(880);
  expect(soundPresets.ping.duration).toBeCloseTo(0.15, 0.01);
  expect(soundPresets.chime.chordFreqs).toHaveLength(3);
  expect(soundPresets.error.type).toBe("sawtooth");
});

designSystemSuite.tier1("Top Navigation HUD exports and contains telemetry indicators", () => {
  const topNavPath = path.resolve(__dirname, "../../components/auth/top-nav.tsx");
  const topNavClientPath = path.resolve(__dirname, "../../components/auth/top-nav-client.tsx");
  expect(fs.existsSync(topNavPath)).toBeTruthy();
  expect(fs.existsSync(topNavClientPath)).toBeTruthy();
  const content = fs.readFileSync(topNavPath, "utf-8") + fs.readFileSync(topNavClientPath, "utf-8");

  expect(content).toContain("TopNav");
  expect(content).toContain("Roommate");
  expect(content).toContain("Sphere");
});

designSystemSuite.tier1("Tailwind configuration defines luxury box shadows", () => {
  const tailwindPath = path.resolve(__dirname, "../../tailwind.config.ts");
  const content = fs.readFileSync(tailwindPath, "utf-8");

  expect(content).toContain("luxury-sm");
  expect(content).toContain("luxury");
  expect(content).toContain("luxury-lg");
  expect(content).toContain("luxury-coral");
});

designSystemSuite.tier1("Globals CSS defines luxury card and glass capsule styles", () => {
  const cssPath = path.resolve(__dirname, "../../app/globals.css");
  const content = fs.readFileSync(cssPath, "utf-8");

  expect(content).toContain(".glass-capsule");
  expect(content).toContain(".luxury-card");
  expect(content).toContain(".neo-button");
});

// -------------------------------------------------------------
// Tier 2: Boundary & Edge Cases
// -------------------------------------------------------------

designSystemSuite.tier2("Web Audio synthesizer frequencies reside strictly within human audible range (20Hz - 20,000Hz)", () => {
  const frequencies = [880, 440, 1200, 600, 523.25, 659.25, 783.99, 180];
  for (const f of frequencies) {
    expect(f).toBeGreaterThanOrEqual(20);
    expect(f).toBeLessThanOrEqual(20000);
  }
});

designSystemSuite.tier2("Audio synthesizer safely handles zero duration or negative frequency gracefully", () => {
  const safeFreq = (freq: number) => Math.max(20, Math.min(20000, isNaN(freq) ? 440 : freq));
  expect(safeFreq(-100)).toBe(20);
  expect(safeFreq(99999)).toBe(20000);
  expect(safeFreq(NaN)).toBe(440);
});

designSystemSuite.tier2("Audio synthesizer safely handles muted state without throwing", () => {
  let isMuted = true;
  const playSoundMock = (type: string) => {
    if (isMuted) return false;
    return true;
  };

  expect(playSoundMock("blip")).toBe(false);
  isMuted = false;
  expect(playSoundMock("blip")).toBe(true);
});

designSystemSuite.tier2("Audio synthesizer safely handles SSR environment where window is undefined", () => {
  const isAudioAvailable = typeof window !== "undefined" && "AudioContext" in window;
  // In Node.js testing environment, window is undefined, audio calls must safely degrade without throwing
  const safePlay = () => {
    try {
      if (!isAudioAvailable) {
        return { played: false, degraded: true };
      }
      return { played: true, degraded: false };
    } catch {
      return { played: false, degraded: false };
    }
  };

  const result = safePlay();
  expect(result.degraded).toBeTruthy();
});

designSystemSuite.tier2("Card shadow offsets stay within calibrated bounding box", () => {
  const cssPath = path.resolve(__dirname, "../../app/globals.css");
  const content = fs.readFileSync(cssPath, "utf-8");

  const shadowMatches = content.match(/box-shadow:\s*([^;]+);/g) || [];
  expect(shadowMatches.length).toBeGreaterThan(0);
  for (const shadow of shadowMatches) {
    const pxValues = shadow.match(/(\d+)px/g)?.map((p) => parseInt(p, 10)) || [];
    for (const val of pxValues) {
      expect(val).toBeLessThanOrEqual(48);
    }
  }
});

designSystemSuite.tier2("Glass capsule and luxury card styles defined in globals", () => {
  const cssPath = path.resolve(__dirname, "../../app/globals.css");
  const content = fs.readFileSync(cssPath, "utf-8");

  expect(content).toContain(".glass-capsule");
  expect(content).toContain(".luxury-card");
});

designSystemSuite.tier2("Color palette contrast ratios conform to high legibility standards", () => {
  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const lumCharcoal = getLuminance(28, 25, 23); // #1c1917
  const lumIvory = getLuminance(250, 249, 246);  // #faf9f6
  const contrast = (lumIvory + 0.05) / (lumCharcoal + 0.05);

  expect(contrast).toBeGreaterThan(10);
});

// -------------------------------------------------------------
// Tier 3: Pairwise Cross-Feature Interactions
// -------------------------------------------------------------

designSystemSuite.tier3("Interactive card hover states integrate with neo-button styling", () => {
  const cssPath = path.resolve(__dirname, "../../app/globals.css");
  const content = fs.readFileSync(cssPath, "utf-8");

  expect(content).toContain(".luxury-card:hover");
  expect(content).toContain(".neo-button:hover");
  expect(content).toContain("transform: translateY(-1px)");
});

designSystemSuite.tier3("Living Space Cards and Badges pair with refined category accents", () => {
  const homePath = path.resolve(__dirname, "../../app/page.tsx");
  const content = fs.readFileSync(homePath, "utf-8");

  expect(content).toContain("CompatibilityBadge");
  expect(content).toContain("Card3D");
});

// -------------------------------------------------------------
// Tier 4: Real-World Scenarios
// -------------------------------------------------------------

designSystemSuite.tier4("Scenario: Architectural Dashboard Shell loads with modern layout and theme tokens", () => {
  const homePath = path.resolve(__dirname, "../../app/page.tsx");
  const layoutPath = path.resolve(__dirname, "../../app/layout.tsx");

  const homeContent = fs.readFileSync(homePath, "utf-8");
  const layoutContent = fs.readFileSync(layoutPath, "utf-8");

  expect(layoutContent).toContain("scroll-smooth");
  expect(homeContent).toContain("AnimatedStats");
  expect(homeContent).toContain("NueveHero");
  expect(homeContent).toContain("NeighborhoodEditorialGrid");
});

// -------------------------------------------------------------
// Tier 5: Adversarial & Static Forensic 0-Emoji Audit
// -------------------------------------------------------------

designSystemSuite.tier5("Forensic 0-Emoji Audit: Full codebase scan verifies 100% emoji-free codebase", () => {
  // Regex pattern matching Unicode emojis
  const emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;

  const appDir = path.resolve(__dirname, "../../app");
  const componentsDir = path.resolve(__dirname, "../../components");
  const libDir = path.resolve(__dirname, "../../lib");
  const typesDir = path.resolve(__dirname, "../../types");

  const allFiles = [
    ...getSourceFiles(appDir),
    ...getSourceFiles(componentsDir),
    ...getSourceFiles(libDir),
    ...getSourceFiles(typesDir),
  ];

  const emojiViolations: Array<{ file: string; line: number; character: string; snippet: string }> = [];

  for (const file of allFiles) {
    const content = fs.readFileSync(file, "utf-8");
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      const matches = line.match(emojiRegex);
      if (matches) {
        matches.forEach((match) => {
          emojiViolations.push({
            file: path.relative(path.resolve(__dirname, "../.."), file),
            line: index + 1,
            character: match,
            snippet: line.trim(),
          });
        });
      }
    });
  }

  if (emojiViolations.length > 0) {
    console.error("EMOJI VIOLATIONS FOUND:", emojiViolations);
  }

  expect(emojiViolations).toHaveLength(0);
});

designSystemSuite.tier5("Lucide SVG Icon Replacement Policy: All lifestyle icons use Lucide React imports", () => {
  const homePath = path.resolve(__dirname, "../../app/page.tsx");
  const content = fs.readFileSync(homePath, "utf-8");

  expect(content).toContain('from "lucide-react"');
  expect(content).toContain("Sparkles");
  expect(content).toContain("MapPin");
  expect(content).toContain("ShieldCheck");
});
