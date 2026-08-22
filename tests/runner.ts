/**
 * Master E2E Test Runner: Roommate Sphere
 * Cyber-Cartographic Telemetry & Spatial Living Discovery Platform
 *
 * Runs all test suites covering Tiers 1-5 and renders a high-density HUD telemetry terminal report.
 */

import { SuiteSummary, MasterTestReport } from "./test-utils";
import { designSystemSuite } from "./e2e/design-system.test";
import { nlpSearchSuite } from "./e2e/nlp-search.test";
import { vibeCompatibilitySuite } from "./e2e/vibe-compatibility.test";
import { agreementGeneratorSuite } from "./e2e/agreement-generator.test";
import { listingCommuteSuite } from "./e2e/listing-commute.test";
import { chatDossierSuite } from "./e2e/chat-dossier.test";
import { routesIntegritySuite } from "./e2e/routes-integrity.test";
import { browseMapSuite } from "./e2e/browse-map.test";

const ANSI = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  lime: "\x1b[38;2;204;255;0m",      // #ccff00 Phosphor Lime
  emerald: "\x1b[38;2;0;255;136m",   // #00ff88 Phosphor Emerald
  cyan: "\x1b[38;2;0;229;255m",      // #00e5ff Cyber Cyan
  amber: "\x1b[38;2;255;183;0m",     // #ffb700 Solar Amber
  red: "\x1b[38;2;255;70;70m",        // #ff4646 Error Red
  gray: "\x1b[38;2;120;120;130m",    // Tungsten Gray
  darkBg: "\x1b[48;2;9;9;11m",
  white: "\x1b[37m",
};

async function runAllSuites(): Promise<MasterTestReport> {
  const startTime = performance.now();

  console.log(`\n${ANSI.lime}${ANSI.bold}================================================================================${ANSI.reset}`);
  console.log(`${ANSI.lime}${ANSI.bold}   ROOMMATE SPHERE // CYBER-CARTOGRAPHIC E2E TEST RUNNER V2.0                  ${ANSI.reset}`);
  console.log(`${ANSI.gray}   Telemetry Verification & Spatial Living Discovery Engine Audit             ${ANSI.reset}`);
  console.log(`${ANSI.lime}${ANSI.bold}================================================================================${ANSI.reset}\n`);

  const suitesToRun = [
    designSystemSuite,
    nlpSearchSuite,
    browseMapSuite,
    vibeCompatibilitySuite,
    agreementGeneratorSuite,
    listingCommuteSuite,
    chatDossierSuite,
    routesIntegritySuite,
  ];

  const summaries: SuiteSummary[] = [];
  let tier1Count = 0;
  let tier2Count = 0;
  let tier3Count = 0;
  let tier4Count = 0;
  let tier5Count = 0;

  for (let i = 0; i < suitesToRun.length; i++) {
    const suite = suitesToRun[i];
    process.stdout.write(`${ANSI.cyan}[SUITE ${i + 1}/${suitesToRun.length}]${ANSI.reset} Running ${ANSI.bold}${suite.name}${ANSI.reset}... `);

    const summary = await suite.run();
    summaries.push(summary);

    if (summary.failed === 0) {
      console.log(`${ANSI.emerald}[PASS]${ANSI.reset} (${summary.passed}/${summary.total} tests in ${summary.durationMs.toFixed(1)}ms)`);
    } else {
      console.log(`${ANSI.red}[FAIL]${ANSI.reset} (${summary.failed} failed, ${summary.passed} passed)`);
    }

    // Print test-level breakdown
    for (const res of summary.results) {
      if (res.tier === 1) tier1Count++;
      else if (res.tier === 2) tier2Count++;
      else if (res.tier === 3) tier3Count++;
      else if (res.tier === 4) tier4Count++;
      else if (res.tier === 5) tier5Count++;

      if (res.passed) {
        console.log(`  ${ANSI.emerald}${ANSI.reset} ${ANSI.gray}${res.testName}${ANSI.reset} ${ANSI.dim}(${res.durationMs.toFixed(1)}ms)${ANSI.reset}`);
      } else {
        console.log(`  ${ANSI.red} ${res.testName}${ANSI.reset}`);
        if (res.error) {
          console.log(`    ${ANSI.red}${res.error}${ANSI.reset}`);
        }
      }
    }
    console.log();
  }

  const durationMs = performance.now() - startTime;
  const totalTests = summaries.reduce((acc, s) => acc + s.total, 0);
  const totalPassed = summaries.reduce((acc, s) => acc + s.passed, 0);
  const totalFailed = summaries.reduce((acc, s) => acc + s.failed, 0);

  const report: MasterTestReport = {
    totalSuites: suitesToRun.length,
    totalTests,
    passed: totalPassed,
    failed: totalFailed,
    tierBreakdown: {
      tier1: tier1Count,
      tier2: tier2Count,
      tier3: tier3Count,
      tier4: tier4Count,
      tier5: tier5Count,
    },
    durationMs,
    suites: summaries,
  };

  // Render HUD Summary Table
  console.log(`${ANSI.lime}${ANSI.bold}--------------------------------------------------------------------------------${ANSI.reset}`);
  console.log(`${ANSI.bold}   TEST EXECUTION TELEMETRY SUMMARY                                             ${ANSI.reset}`);
  console.log(`${ANSI.lime}${ANSI.bold}--------------------------------------------------------------------------------${ANSI.reset}`);
  console.log(`  ${ANSI.cyan}Total Test Suites:${ANSI.reset}   ${report.totalSuites}`);
  console.log(`  ${ANSI.cyan}Total Tests Run:${ANSI.reset}     ${report.totalTests}`);
  console.log(`  ${ANSI.emerald}Total Passed:${ANSI.reset}        ${report.passed} / ${report.totalTests} (${((report.passed / report.totalTests) * 100).toFixed(1)}%)`);
  console.log(`  ${report.failed === 0 ? ANSI.gray : ANSI.red}Total Failed:${ANSI.reset}        ${report.failed}`);
  console.log(`  ${ANSI.amber}Execution Time:${ANSI.reset}      ${report.durationMs.toFixed(1)}ms`);

  if (report.failed > 0) {
    console.log(`\n  ${ANSI.red}${ANSI.bold}FAILED TESTS DETAILS:${ANSI.reset}`);
    for (const s of report.suites) {
      for (const r of s.results) {
        if (!r.passed) {
          console.log(`  ${ANSI.red} [${s.suiteName}] ${r.testName}${ANSI.reset}`);
          console.log(`    ${ANSI.red}${r.error}${ANSI.reset}`);
        }
      }
    }
  }

  console.log(`\n  ${ANSI.bold}Coverage Tier Breakdown:${ANSI.reset}`);
  console.log(`    - Tier 1 (Core Functional Coverage):  ${ANSI.lime}${report.tierBreakdown.tier1} tests${ANSI.reset}`);
  console.log(`    - Tier 2 (Boundary & Corner Values):  ${ANSI.lime}${report.tierBreakdown.tier2} tests${ANSI.reset}`);
  console.log(`    - Tier 3 (Pairwise Cross-Feature):    ${ANSI.lime}${report.tierBreakdown.tier3} tests${ANSI.reset}`);
  console.log(`    - Tier 4 (Real-World User Scenarios): ${ANSI.lime}${report.tierBreakdown.tier4} tests${ANSI.reset}`);
  console.log(`    - Tier 5 (Adversarial & 0-Emoji):     ${ANSI.lime}${report.tierBreakdown.tier5} tests${ANSI.reset}`);
  console.log(`${ANSI.lime}${ANSI.bold}================================================================================${ANSI.reset}\n`);

  return report;
}

// Execute runner if invoked directly
runAllSuites().then((report) => {
  if (report.failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}).catch((err) => {
  console.error("Test runner failed unexpectedly:", err);
  process.exit(1);
});
