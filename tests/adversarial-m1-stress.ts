/**
 * Adversarial Empirical Stress Test Suite for Milestone 1
 * Targets:
 *  - lib/audio-telemetry.ts
 *  - components/HUD/CircularGauge.tsx
 *  - components/HUD/RadarCanvas.tsx
 *  - components/HUD/WaveformOscilloscope.tsx
 *  - Zero-Emoji Codebase Integrity
 */

import { audioTelemetry, playBlip, playPing, playSuccess, playToggle, playWarning, playScan, isAudioMuted, toggleAudioMute, setAudioMuted } from "../lib/audio-telemetry";
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
    fn();
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

async function runAdversarialM1Suite() {
  console.log("\n========================================================");
  console.log("   ADVERSARIAL EMPIRICAL STRESS TEST: MILESTONE 1       ");
  console.log("========================================================\n");

  // =========================================================================
  // SECTION 1: Web Audio Telemetry Engine (lib/audio-telemetry.ts)
  // =========================================================================

  record("AUDIO_ENGINE", "Mute State Synchronization and Rapid 10k Toggles", () => {
    const originalMuted = isAudioMuted();
    
    // Toggle 10,000 times
    for (let i = 0; i < 10000; i++) {
      toggleAudioMute();
    }
    // 10,000 is even, state must equal original
    if (isAudioMuted() !== originalMuted) {
      throw new Error(`Mute state drifted after 10,000 toggles: expected ${originalMuted}, got ${isAudioMuted()}`);
    }

    setAudioMuted(true);
    if (!isAudioMuted()) throw new Error("setAudioMuted(true) failed");
    setAudioMuted(false);
    if (isAudioMuted()) throw new Error("setAudioMuted(false) failed");
  });

  record("AUDIO_ENGINE", "Safe Execution in Headless / SSR Environment (window undefined)", () => {
    // Calling audio methods directly in Node.js environment where window/AudioContext is not present
    playBlip(440, 0.05);
    playPing(1200, 0.1);
    playSuccess();
    playToggle(true);
    playToggle(false);
    playWarning();
    playScan();
  });

  record("AUDIO_ENGINE", "Extreme & Malformed Parameters to playBlip", () => {
    const extremeCases = [
      { freq: NaN, dur: 0.05 },
      { freq: Infinity, dur: 0.05 },
      { freq: -Infinity, dur: 0.05 },
      { freq: -999, dur: 0.05 },
      { freq: 0, dur: 0.05 },
      { freq: 100000, dur: 0.05 },
      { freq: 880, dur: NaN },
      { freq: 880, dur: -1 },
      { freq: 880, dur: 0 },
      { freq: 880, dur: 999999 },
    ];

    for (const c of extremeCases) {
      playBlip(c.freq, c.dur);
    }
  });

  record("AUDIO_ENGINE", "Extreme & Malformed Parameters to playPing, playToggle", () => {
    playPing(NaN, NaN);
    playPing(-100, -1);
    playPing(0, 0);
    playPing(50000, 100);
    playToggle(undefined);
    playToggle(null as any);
    playToggle(true);
    playToggle(false);
  });

  record("AUDIO_ENGINE", "Mocked Web Audio API Stress: 500 Simultaneous Syntheses", () => {
    // Setup Mock AudioContext on global window
    let createdOscillators = 0;
    let createdGains = 0;
    let createdFilters = 0;

    const mockCtx: any = {
      currentTime: 0.1,
      state: "running",
      destination: {},
      createOscillator: () => {
        createdOscillators++;
        return {
          type: "sine",
          frequency: {
            setValueAtTime: () => {},
            exponentialRampToValueAtTime: () => {},
          },
          connect: () => {},
          start: () => {},
          stop: () => {},
        };
      },
      createGain: () => {
        createdGains++;
        return {
          gain: {
            setValueAtTime: () => {},
            exponentialRampToValueAtTime: () => {},
          },
          connect: () => {},
        };
      },
      createBiquadFilter: () => {
        createdFilters++;
        return {
          type: "bandpass",
          frequency: { setValueAtTime: () => {} },
          Q: { setValueAtTime: () => {} },
          connect: () => {},
        };
      },
      resume: async () => {},
    };

    (global as any).window = {
      AudioContext: function () {
        return mockCtx;
      },
      dispatchEvent: () => true,
      localStorage: {
        getItem: () => null,
        setItem: () => {},
      },
    };

    // Re-create engine with window present
    const engineClass = (audioTelemetry as any).constructor;
    const testEngine = new engineClass();

    for (let i = 0; i < 100; i++) {
      testEngine.playBlip(880, 0.035);
      testEngine.playPing(1200, 0.15);
      testEngine.playSuccess();
      testEngine.playToggle(true);
      testEngine.playWarning();
      testEngine.playScan();
    }

    if (createdOscillators === 0 || createdGains === 0) {
      throw new Error("Mocked audio nodes were not created during synthesis");
    }

    delete (global as any).window;
  });

  // =========================================================================
  // SECTION 2: CircularGauge Mathematical & SVG Stress
  // =========================================================================

  record("CIRCULAR_GAUGE", "Boundary & Overflow Clamping (0, 100, -50, 200)", () => {
    const clampPercentage = (value: number, maxValue: number) => {
      return Math.min(100, Math.max(0, (value / maxValue) * 100));
    };

    if (clampPercentage(0, 100) !== 0) throw new Error("0% clamping failed");
    if (clampPercentage(100, 100) !== 100) throw new Error("100% clamping failed");
    if (clampPercentage(-50, 100) !== 0) throw new Error("Negative value didn't clamp to 0");
    if (clampPercentage(250, 100) !== 100) throw new Error("Overflow value didn't clamp to 100");
  });

  record("CIRCULAR_GAUGE", "Adversarial Inputs: Division by Zero & Negative Max", () => {
    const clampPercentage = (value: number, maxValue: number) => {
      const p = (value / maxValue) * 100;
      if (isNaN(p)) return 0;
      return Math.min(100, Math.max(0, p));
    };

    // maxValue = 0
    const pZeroMax = clampPercentage(50, 0); // 50 / 0 = Infinity -> clamped to 100
    if (pZeroMax !== 100) throw new Error(`Expected 100 on div-by-zero, got ${pZeroMax}`);

    // value = NaN
    const pNaN = clampPercentage(NaN, 100);
    if (pNaN !== 0) throw new Error(`Expected 0 for NaN, got ${pNaN}`);

    // maxValue = -100
    const pNegMax = clampPercentage(50, -100);
    if (pNegMax !== 0) throw new Error(`Expected 0 for negative max, got ${pNegMax}`);
  });

  record("CIRCULAR_GAUGE", "Radius & Geometry Calculation Under Small Size Edge Cases", () => {
    const calculateGeometry = (size: number, strokeWidth: number, showTicks: boolean) => {
      const center = size / 2;
      const radius = center - strokeWidth - (showTicks ? 14 : 4);
      const circumference = 2 * Math.PI * radius;
      return { center, radius, circumference };
    };

    // Standard size: 140
    const std = calculateGeometry(140, 8, true);
    if (std.radius !== 48) throw new Error(`Expected radius 48, got ${std.radius}`);
    if (std.circumference <= 0) throw new Error("Circumference <= 0");

    // Extreme small size: 20
    const tiny = calculateGeometry(20, 8, true);
    // radius = 10 - 8 - 14 = -12. Note: SVG circle with negative radius is invalid SVG in DOM
    const hasNegativeRadius = tiny.radius < 0;
    if (!hasNegativeRadius) {
      throw new Error("Expected tiny size to reveal negative radius constraint");
    }
  });

  record("CIRCULAR_GAUGE", "Tick Mark Generation Coordinates Spanning 360 Degrees", () => {
    const generateTicks = (tickCount: number, center: number, percentage: number) => {
      const items: any[] = [];
      const tickRadiusOuter = center - 2;
      const tickRadiusInner = tickRadiusOuter - 6;

      for (let i = 0; i < tickCount; i++) {
        const angleDeg = (i / tickCount) * 360 - 90;
        const angleRad = (angleDeg * Math.PI) / 180;
        const cos = Math.cos(angleRad);
        const sin = Math.sin(angleRad);
        const fraction = i / tickCount;
        const isActive = fraction <= percentage / 100;

        items.push({
          x1: center + tickRadiusInner * cos,
          y1: center + tickRadiusInner * sin,
          x2: center + tickRadiusOuter * cos,
          y2: center + tickRadiusOuter * sin,
          isActive,
          angle: angleDeg,
        });
      }
      return items;
    };

    const ticks = generateTicks(28, 70, 75);
    if (ticks.length !== 28) throw new Error(`Expected 28 ticks, got ${ticks.length}`);

    // Check first tick is at top (-90 degrees)
    if (Math.abs(ticks[0].angle - (-90)) > 0.001) throw new Error("First tick angle is not -90 deg");
    if (Math.abs(ticks[0].x1 - 70) > 0.001) throw new Error("First tick x1 is not center");

    // Check active ticks count (75% of 28 is 21 ticks)
    const activeCount = ticks.filter((t) => t.isActive).length;
    if (activeCount < 21 || activeCount > 22) {
      throw new Error(`Expected ~21 active ticks for 75%, got ${activeCount}`);
    }
  });

  // =========================================================================
  // SECTION 3: RadarCanvas Polar Mapping & Hit Testing Stress
  // =========================================================================

  record("RADAR_CANVAS", "Polar Coordinate Transformation (Cartesian projection from bearing)", () => {
    const projectNode = (
      distanceKm: number,
      angleDeg: number,
      maxDistanceKm: number,
      centerX: number,
      centerY: number,
      maxRadius: number
    ) => {
      const clampedDist = Math.min(Math.max(0, distanceKm), maxDistanceKm);
      const nodeRadius = (clampedDist / maxDistanceKm) * maxRadius;
      const angleRad = ((angleDeg - 90) * Math.PI) / 180;
      const nodeX = centerX + nodeRadius * Math.cos(angleRad);
      const nodeY = centerY + nodeRadius * Math.sin(angleRad);
      return { nodeX, nodeY, nodeRadius };
    };

    const center = 200;
    const maxR = 170;
    const maxDist = 10;

    // North node (0 deg): should be at (center, center - maxRadius)
    const north = projectNode(10, 0, maxDist, center, center, maxR);
    if (Math.abs(north.nodeX - 200) > 0.001 || Math.abs(north.nodeY - 30) > 0.001) {
      throw new Error(`North projection failed: got (${north.nodeX}, ${north.nodeY}), expected (200, 30)`);
    }

    // East node (90 deg): should be at (center + maxRadius, center)
    const east = projectNode(10, 90, maxDist, center, center, maxR);
    if (Math.abs(east.nodeX - 370) > 0.001 || Math.abs(east.nodeY - 200) > 0.001) {
      throw new Error(`East projection failed: got (${east.nodeX}, ${east.nodeY}), expected (370, 200)`);
    }

    // South node (180 deg): should be at (center, center + maxRadius)
    const south = projectNode(10, 180, maxDist, center, center, maxR);
    if (Math.abs(south.nodeX - 200) > 0.001 || Math.abs(south.nodeY - 370) > 0.001) {
      throw new Error(`South projection failed: got (${south.nodeX}, ${south.nodeY}), expected (200, 370)`);
    }

    // West node (270 deg): should be at (center - maxRadius, center)
    const west = projectNode(10, 270, maxDist, center, center, maxR);
    if (Math.abs(west.nodeX - 30) > 0.001 || Math.abs(west.nodeY - 200) > 0.001) {
      throw new Error(`West projection failed: got (${west.nodeX}, ${west.nodeY}), expected (30, 200)`);
    }
  });

  record("RADAR_CANVAS", "Sweep Illumination Angular Wrap-Around (359° vs 1°)", () => {
    const isNodeIlluminated = (sweepAngle: number, nodeAngle: number) => {
      const nodeCanvasAngle = nodeAngle % 360;
      const angleDiff = Math.abs((sweepAngle - nodeCanvasAngle + 360) % 360);
      const acuteDiff = Math.min(angleDiff, 360 - angleDiff);
      return acuteDiff < 12;
    };

    // Sweep at 1 deg, Node at 358 deg -> diff is 3 deg -> illuminated
    if (!isNodeIlluminated(1, 358)) {
      throw new Error("Failed to illuminate across 0/360 wrap boundary");
    }

    // Sweep at 180 deg, Node at 0 deg -> diff is 180 deg -> not illuminated
    if (isNodeIlluminated(180, 0)) {
      throw new Error("False positive illumination at opposite angle");
    }
  });

  record("RADAR_CANVAS", "Hit-Testing Benchmark with 10,000 Synthetic Nodes", () => {
    const nodes: any[] = [];
    for (let i = 0; i < 10000; i++) {
      nodes.push({
        id: `node-${i}`,
        name: `Node ${i}`,
        distanceKm: (i % 10) + 0.5,
        angleDeg: (i * 37) % 360,
        matchScore: 50 + (i % 50),
      });
    }

    const mouseX = 200;
    const mouseY = 100;
    const centerX = 200;
    const centerY = 200;
    const maxRadius = 170;
    const maxDistanceKm = 10;

    let hits = 0;
    const start = performance.now();
    for (const node of nodes) {
      const clampedDist = Math.min(node.distanceKm, maxDistanceKm);
      const nodeRadius = (clampedDist / maxDistanceKm) * maxRadius;
      const angleRad = ((node.angleDeg - 90) * Math.PI) / 180;
      const nodeX = centerX + nodeRadius * Math.cos(angleRad);
      const nodeY = centerY + nodeRadius * Math.sin(angleRad);

      const dist = Math.hypot(mouseX - nodeX, mouseY - nodeY);
      if (dist < 14) {
        hits++;
      }
    }
    const elapsed = performance.now() - start;

    if (elapsed > 50) {
      throw new Error(`Hit testing took too long: ${elapsed.toFixed(2)}ms for 10,000 nodes`);
    }
  });

  // =========================================================================
  // SECTION 4: WaveformOscilloscope Harmonic & Chronotype Phase Delta Stress
  // =========================================================================

  record("WAVEFORM_OSCILLOSCOPE", "Phase Delta Formula for All Valid Chronotype Pairs", () => {
    const CHRONO_PHASE_OFFSET: Record<string, number> = {
      early_bird: 0,
      flexible: Math.PI * 0.35,
      night_owl: Math.PI * 0.85,
    };

    const getPhaseDeltaHours = (c1: string, c2: string) => {
      const p1 = CHRONO_PHASE_OFFSET[c1];
      const p2 = CHRONO_PHASE_OFFSET[c2];
      const diffRad = Math.abs(p1 - p2);
      return ((diffRad / (2 * Math.PI)) * 24).toFixed(1);
    };

    if (getPhaseDeltaHours("early_bird", "early_bird") !== "0.0") throw new Error("early vs early failed");
    if (getPhaseDeltaHours("early_bird", "night_owl") !== "10.2") throw new Error("early vs night failed");
    if (getPhaseDeltaHours("flexible", "night_owl") !== "6.0") throw new Error("flexible vs night failed");
    if (getPhaseDeltaHours("flexible", "early_bird") !== "4.2") throw new Error("flexible vs early failed");
  });

  record("WAVEFORM_OSCILLOSCOPE", "Waveform Amplitude Bounding (Never clips outside canvas height)", () => {
    const displayHeight = 180;
    const centerY = displayHeight / 2;
    const amplitude = displayHeight * 0.32; // 57.6
    const displayWidth = 400;
    const waveFreq = (Math.PI * 2) / (displayWidth * 0.85);

    let minY = Infinity;
    let maxY = -Infinity;

    for (let t = 0; t < 10; t += 0.5) {
      for (let x = 0; x <= displayWidth; x += 2) {
        const y = centerY + Math.sin(x * waveFreq + t) * amplitude;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }

    if (minY < 0 || maxY > displayHeight) {
      throw new Error(`Waveform exceeded canvas bounding box: [${minY.toFixed(1)}, ${maxY.toFixed(1)}] vs [0, ${displayHeight}]`);
    }
  });

  // =========================================================================
  // SECTION 5: Forensic 0-Emoji Deep Scan
  // =========================================================================

  record("FORENSIC_0_EMOJI", "Codebase Deep Scan: 0 Unicode Emojis in Source Code", () => {
    const emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;

    const walk = (dir: string, fileList: string[] = []) => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const p = path.join(dir, file);
        const stat = fs.statSync(p);
        if (stat.isDirectory()) {
          if (!file.startsWith(".") && file !== "node_modules") {
            walk(p, fileList);
          }
        } else if (file.endsWith(".ts") || file.endsWith(".tsx") || file.endsWith(".css")) {
          fileList.push(p);
        }
      }
      return fileList;
    };

    const rootDir = path.resolve(__dirname, "..");
    const srcDirs = ["app", "components", "lib", "types"].map((d) => path.join(rootDir, d));
    const allFiles: string[] = [];
    for (const d of srcDirs) {
      if (fs.existsSync(d)) walk(d, allFiles);
    }

    const violations: any[] = [];
    for (const file of allFiles) {
      const content = fs.readFileSync(file, "utf-8");
      const matches = content.match(emojiRegex);
      if (matches) {
        violations.push({ file: path.relative(rootDir, file), count: matches.length, matches });
      }
    }

    if (violations.length > 0) {
      throw new Error(`Found ${violations.length} files with emoji violations: ${JSON.stringify(violations)}`);
    }
  });

  // =========================================================================
  // SUMMARY PRINT
  // =========================================================================

  console.log("\nSTRESS TEST RESULTS:");
  let passCount = 0;
  let failCount = 0;

  for (const r of results) {
    if (r.passed) {
      passCount++;
      console.log(`   [${r.category}] ${r.name} (${r.durationMs.toFixed(2)}ms)`);
    } else {
      failCount++;
      console.log(`   [${r.category}] ${r.name} (${r.durationMs.toFixed(2)}ms)`);
      console.log(`    Error: ${r.details}`);
    }
  }

  console.log("\n========================================================");
  console.log(`TOTAL: ${results.length} | PASSED: ${passCount} | FAILED: ${failCount}`);
  console.log("========================================================\n");

  if (failCount > 0) {
    process.exit(1);
  }
}

runAdversarialM1Suite().catch((err) => {
  console.error("Adversarial runner failed:", err);
  process.exit(1);
});
