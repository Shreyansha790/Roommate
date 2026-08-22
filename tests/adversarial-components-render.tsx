/**
 * Adversarial React SSR & Component Render Stress Tests
 */

import React from "react";
import { renderToString } from "react-dom/server";
import { CircularGauge } from "../components/HUD/CircularGauge";
import { RadarCanvas, RadarNode } from "../components/HUD/RadarCanvas";
import { WaveformOscilloscope, Chronotype } from "../components/HUD/WaveformOscilloscope";
import { TacticalBadge } from "../components/HUD/TacticalBadge";

const suiteResults: Array<{ name: string; passed: boolean; error?: string }> = [];

function test(name: string, fn: () => void) {
  try {
    fn();
    suiteResults.push({ name, passed: true });
  } catch (err: any) {
    suiteResults.push({ name, passed: false, error: err?.message || String(err) });
  }
}

// Clean React SSR comments
function cleanHtml(html: string) {
  return html.replace(/<!--.*?-->/g, "");
}

console.log("\n========================================================");
console.log("   ADVERSARIAL COMPONENT SSR & PROPS STRESS TEST        ");
console.log("========================================================\n");

// 1. CircularGauge Tests
test("CircularGauge renders with standard props", () => {
  const html = cleanHtml(renderToString(<CircularGauge value={85} label="VIBE_SYNC" sublabel="HIGH" />));
  if (!html.includes("85") || !html.includes("VIBE_SYNC")) {
    throw new Error("Render missing core content");
  }
});

test("CircularGauge handles negative value (-50)", () => {
  const html = cleanHtml(renderToString(<CircularGauge value={-50} maxValue={100} />));
  if (!html) throw new Error("Empty render");
});

test("CircularGauge handles overflow value (350%)", () => {
  const html = cleanHtml(renderToString(<CircularGauge value={350} maxValue={100} />));
  if (!html) throw new Error("Empty render");
});

test("CircularGauge handles NaN and Infinity values without crashing SSR", () => {
  const htmlNaN = cleanHtml(renderToString(<CircularGauge value={NaN} maxValue={100} />));
  const htmlInf = cleanHtml(renderToString(<CircularGauge value={Infinity} maxValue={100} />));
  if (!htmlNaN || !htmlInf) throw new Error("Failed to render NaN/Infinity");
});

test("CircularGauge renders all 5 variants explicitly", () => {
  const variants = ["emerald", "cyan", "amber", "violet", "crimson"] as const;
  for (const v of variants) {
    const html = cleanHtml(renderToString(<CircularGauge value={50} variant={v} autoVariant={false} />));
    if (!html) throw new Error(`Failed variant: ${v}`);
  }
});

test("CircularGauge handles tickCount = 0 and showTicks = false", () => {
  const html1 = cleanHtml(renderToString(<CircularGauge value={50} showTicks={false} />));
  const html2 = cleanHtml(renderToString(<CircularGauge value={50} tickCount={0} />));
  if (!html1 || !html2) throw new Error("Failed tick toggling");
});

// 2. RadarCanvas Tests
test("RadarCanvas renders default nodes in SSR", () => {
  const html = cleanHtml(renderToString(<RadarCanvas />));
  if (!html.includes("SPATIAL_RADAR") || !html.includes("TARGET_RADIUS")) {
    throw new Error("Missing radar headers in SSR output");
  }
});

test("RadarCanvas handles empty nodes array []", () => {
  const html = cleanHtml(renderToString(<RadarCanvas nodes={[]} />));
  if (!html.includes("ACTIVE_TARGETS: 0")) {
    throw new Error("Failed empty nodes count");
  }
});

test("RadarCanvas handles 100 synthetic nodes with extreme distance/angles", () => {
  const nodes: RadarNode[] = Array.from({ length: 100 }, (_, i) => ({
    id: `node-${i}`,
    name: `User ${i}`,
    distanceKm: -10 + i * 0.5,
    angleDeg: i * 45 - 180,
    matchScore: (i * 13) % 120,
    rent: i % 2 === 0 ? 15000 + i * 100 : undefined,
    locality: `Sector ${i}`,
    roomType: "Private",
    isHost: i % 2 === 0,
  }));

  const html = cleanHtml(renderToString(<RadarCanvas nodes={nodes} maxDistanceKm={50} height={400} />));
  if (!html.includes("ACTIVE_TARGETS: 100")) {
    throw new Error("Failed 100 nodes count");
  }
});

test("RadarCanvas handles non-interactive mode", () => {
  const html = cleanHtml(renderToString(<RadarCanvas interactive={false} />));
  if (!html) throw new Error("Empty render for non-interactive");
});

// 3. WaveformOscilloscope Tests
test("WaveformOscilloscope renders default chronotypes in SSR", () => {
  const html = cleanHtml(renderToString(<WaveformOscilloscope />));
  if (!html.includes("CIRCADIAN_SYNCHRONICITY_OSCILLOSCOPE") || !html.includes("Δ PHASE:")) {
    throw new Error("Missing oscilloscope headers in SSR output");
  }
});

test("WaveformOscilloscope renders all chronotype combinations", () => {
  const chronos: Chronotype[] = ["early_bird", "night_owl", "flexible"];
  for (const s of chronos) {
    for (const h of chronos) {
      const html = cleanHtml(
        renderToString(
          <WaveformOscilloscope seekerChronotype={s} hostChronotype={h} synchronicityScore={88} />
        )
      );
      if (!html) throw new Error(`Failed combination ${s} x ${h}`);
    }
  }
});

test("WaveformOscilloscope handles extreme synchronicity scores (-20, 150)", () => {
  const htmlNeg = cleanHtml(renderToString(<WaveformOscilloscope synchronicityScore={-20} />));
  const htmlHigh = cleanHtml(renderToString(<WaveformOscilloscope synchronicityScore={150} />));
  if (!htmlNeg.includes("SYNC: -20%") || !htmlHigh.includes("SYNC: 150%")) {
    throw new Error("Failed synchronicity badge text");
  }
});

// 4. TacticalBadge Tests
test("TacticalBadge renders all variants and sizes", () => {
  const variants = ["emerald", "amber", "cyan", "violet", "crimson", "steel", "outline"] as const;
  const sizes = ["xs", "sm", "md"] as const;

  for (const v of variants) {
    for (const s of sizes) {
      const html = cleanHtml(
        renderToString(
          <TacticalBadge variant={v} size={s} pulse>
            TACTICAL_TEST
          </TacticalBadge>
        )
      );
      if (!html.includes("TACTICAL_TEST") || !html.includes("[")) {
        throw new Error(`Failed badge variant ${v} size ${s}`);
      }
    }
  }
});

// Print Results
let passed = 0;
let failed = 0;
for (const r of suiteResults) {
  if (r.passed) {
    passed++;
    console.log(`   ${r.name}`);
  } else {
    failed++;
    console.log(`   ${r.name}: ${r.error}`);
  }
}

console.log("\n========================================================");
console.log(`TOTAL: ${suiteResults.length} | PASSED: ${passed} | FAILED: ${failed}`);
console.log("========================================================\n");

if (failed > 0) process.exit(1);
