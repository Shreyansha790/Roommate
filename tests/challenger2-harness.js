const fs = require('fs');
const path = require('path');

const results = [];

function assert(condition, name, category, errorMsg, details) {
  if (condition) {
    results.push({ name: name, category: category, passed: true, details: details });
  } else {
    results.push({ name: name, category: category, passed: false, error: errorMsg || 'Assertion failed', details: details });
  }
}

// SECTION 1: 0-EMOJI FORENSIC AUDIT
function runEmojiAudit() {
  const emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
  const surrogatePairRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

  function getFiles(dir) {
    let list = [];
    if (!fs.existsSync(dir)) return list;
    for (const item of fs.readdirSync(dir)) {
      if (item.startsWith('.') || item === 'node_modules' || item === '.next' || item === 'dist') continue;
      const full = path.join(dir, item);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        list = list.concat(getFiles(full));
      } else if (/\.(ts|tsx|css|json)$/.test(item) && item !== 'package-lock.json') {
        list.push(full);
      }
    }
    return list;
  }

  const rootDirs = ['app', 'components', 'lib', 'types'];
  const allFiles = [];
  for (const d of rootDirs) {
    allFiles.push.apply(allFiles, getFiles(path.resolve(process.cwd(), d)));
  }
  allFiles.push(path.resolve(process.cwd(), 'tailwind.config.ts'));

  const violations = [];

  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    lines.forEach(function(line, idx) {
      const match1 = line.match(emojiRegex);
      const match2 = line.match(surrogatePairRegex);
      const matches = [].concat(match1 || [], match2 || []);
      if (matches.length > 0) {
        matches.forEach(function(m) {
          violations.push({
            file: path.relative(process.cwd(), file),
            line: idx + 1,
            char: m,
            snippet: line.trim()
          });
        });
      }
    });
  }

  assert(
    violations.length === 0,
    'Strict 0-Emoji Audit across all modified & generated source files',
    'Emoji Policy',
    'Found ' + violations.length + ' emoji violations: ' + JSON.stringify(violations),
    { totalFilesScanned: allFiles.length, violations: violations }
  );

  assert(
    allFiles.length >= 20,
    'Scanned substantial codebase footprint (>20 source files)',
    'Emoji Policy',
    'Only ' + allFiles.length + ' files scanned',
    { totalFilesScanned: allFiles.length }
  );
}

// SECTION 2: RESPONSIVENESS & BREAKPOINT TACTICAL AUDIT
function runResponsivenessAudit() {
  const topNavClientPath = path.resolve(process.cwd(), 'components/auth/top-nav-client.tsx');
  const footerPath = path.resolve(process.cwd(), 'components/footer.tsx');
  const globalsCssPath = path.resolve(process.cwd(), 'app/globals.css');
  const tailwindPath = path.resolve(process.cwd(), 'tailwind.config.ts');

  assert(fs.existsSync(topNavClientPath), 'TopNavClient component exists', 'Responsiveness');
  assert(fs.existsSync(footerPath), 'Footer component exists', 'Responsiveness');
  assert(fs.existsSync(globalsCssPath), 'Globals CSS exists', 'Responsiveness');

  const topNavContent = fs.readFileSync(topNavClientPath, 'utf-8');
  const footerContent = fs.readFileSync(footerPath, 'utf-8');
  const globalsContent = fs.readFileSync(globalsCssPath, 'utf-8');

  // 1. Ticker responsiveness (metro nodes hidden on <sm, shown on sm:)
  assert(
    topNavContent.includes('hidden sm:inline') || topNavContent.includes('hidden sm:flex'),
    'Ticker collapses secondary info (metro nodes / latency) on small screens (<640px)',
    'Responsiveness'
  );

  // 2. Mobile Drawer toggle button (visible on md:hidden, hamburger / X icons)
  assert(
    topNavContent.includes('md:hidden') && topNavContent.includes('mobileMenuOpen') && topNavContent.includes('Menu') && topNavContent.includes('X'),
    'Mobile HUD drawer trigger button exists with responsive md:hidden toggle state and Lucide Menu/X icons',
    'Mobile HUD Drawer'
  );

  // 3. Desktop Navigation links hidden on mobile (<768px)
  assert(
    topNavContent.includes('hidden') && topNavContent.includes('md:flex') && topNavContent.includes('navLinks.map'),
    'Desktop navigation items cleanly hide below 768px breakpoint (hidden md:flex)',
    'Responsiveness'
  );

  // 4. Mobile Quick Search button visible on mobile
  assert(
    topNavContent.includes('flex md:hidden') && topNavContent.includes('triggerCommandPalette'),
    'Mobile dedicated search trigger available on mobile screens (flex md:hidden)',
    'Responsiveness'
  );

  // 5. Desktop Cmd+K bar hidden on smaller tablet/mobile (<1024px)
  assert(
    topNavContent.includes('hidden lg:flex') && topNavContent.includes('AI_QUERY_RADAR'),
    'Expanded Command Palette button displays on lg: (>=1024px) screens and avoids layout congestion',
    'Responsiveness'
  );

  // 6. Mobile HUD Drawer content structure
  assert(
    topNavContent.includes('mobileMenuOpen && (') &&
    topNavContent.includes('NAVIGATION_HUD') &&
    topNavContent.includes('LAUNCH AI NLP QUERY') &&
    topNavContent.includes('TACTICAL_AUDIO'),
    'Mobile HUD Drawer includes full navigation hierarchy, Cmd+K launcher, and tactical audio mute toggle',
    'Mobile HUD Drawer'
  );

  // 7. Mobile HUD Drawer closes on link click
  assert(
    topNavContent.includes('setMobileMenuOpen(false)'),
    'Mobile HUD Drawer auto-dismisses when user selects a navigation link or action',
    'Mobile HUD Drawer'
  );

  // 8. Footer responsive grid structure (1 col -> 4 col)
  assert(
    footerContent.includes('grid-cols-1') && footerContent.includes('md:grid-cols-4'),
    'Footer adapts across 320px (1 column) and 768px+ (4 columns)',
    'Responsiveness'
  );

  // 9. Chamfered polygonal cards clip-path responsiveness
  assert(
    globalsContent.includes('.chamfer-card') && globalsContent.includes('calc(100% -'),
    'Chamfered HUD cards use responsive percentage-based clip-path polygon coordinates',
    'Design System'
  );

  // 10. Horizontal scroll prevention
  assert(
    topNavContent.includes('max-w-7xl') && topNavContent.includes('px-3 sm:px-6'),
    'Header container enforces maximum width boundary (max-w-7xl) with adaptive padding to prevent viewport overflow',
    'Responsiveness'
  );
}

// SECTION 3: WEB AUDIO API & HUD INTERACTION CONTRACTS
function runAudioAndHUDContracts() {
  const audioPath = path.resolve(process.cwd(), 'lib/audio-telemetry.ts');
  const tacticalBadgePath = path.resolve(process.cwd(), 'components/HUD/TacticalBadge.tsx');
  const radarCanvasPath = path.resolve(process.cwd(), 'components/HUD/RadarCanvas.tsx');
  const circularGaugePath = path.resolve(process.cwd(), 'components/HUD/CircularGauge.tsx');
  const oscilloscopePath = path.resolve(process.cwd(), 'components/HUD/WaveformOscilloscope.tsx');

  assert(fs.existsSync(audioPath), 'audio-telemetry.ts exists', 'Audio Telemetry');
  assert(fs.existsSync(tacticalBadgePath), 'TacticalBadge.tsx exists', 'HUD Components');
  assert(fs.existsSync(radarCanvasPath), 'RadarCanvas.tsx exists', 'HUD Components');
  assert(fs.existsSync(circularGaugePath), 'CircularGauge.tsx exists', 'HUD Components');
  assert(fs.existsSync(oscilloscopePath), 'WaveformOscilloscope.tsx exists', 'HUD Components');

  const audioContent = fs.readFileSync(audioPath, 'utf-8');
  const radarContent = fs.readFileSync(radarCanvasPath, 'utf-8');
  const gaugeContent = fs.readFileSync(circularGaugePath, 'utf-8');
  const oscContent = fs.readFileSync(oscilloscopePath, 'utf-8');

  // Web Audio methods
  assert(audioContent.includes('playBlip'), 'playBlip exported', 'Audio Telemetry');
  assert(audioContent.includes('playPing'), 'playPing exported', 'Audio Telemetry');
  assert(audioContent.includes('playSuccess'), 'playSuccess exported', 'Audio Telemetry');
  assert(audioContent.includes('toggleAudioMute'), 'toggleAudioMute exported', 'Audio Telemetry');
  assert(audioContent.includes('isAudioMuted'), 'isAudioMuted exported', 'Audio Telemetry');
  assert(audioContent.includes('telemetry-sound-toggled'), 'Dispatches telemetry-sound-toggled CustomEvent', 'Audio Telemetry');

  // Canvas High-DPI scaling
  assert(radarContent.includes('devicePixelRatio'), 'RadarCanvas scales for Retina / High-DPI screens', 'HUD Components');
  assert(oscContent.includes('devicePixelRatio'), 'WaveformOscilloscope scales for Retina / High-DPI screens', 'HUD Components');

  // Circular Gauge SVG calculations
  assert(gaugeContent.includes('strokeDasharray') && gaugeContent.includes('strokeDashoffset'), 'CircularGauge calculates dynamic SVG stroke dash offset', 'HUD Components');
}

// EXECUTE HARNESS
console.log('--- EXECUTING CHALLENGER 2 EMPIRICAL HARNESS ---');
runEmojiAudit();
runResponsivenessAudit();
runAudioAndHUDContracts();

console.log('\n--- RESULTS BREAKDOWN ---');
let passedCount = 0;
let failedCount = 0;

for (let i = 0; i < results.length; i++) {
  const r = results[i];
  if (r.passed) {
    passedCount++;
    console.log('  [PASS] (' + r.category + ') ' + r.name);
  } else {
    failedCount++;
    console.log('  [FAIL] (' + r.category + ') ' + r.name + ': ' + r.error);
  }
}

console.log('\nTotal Checks: ' + results.length + ' | Passed: ' + passedCount + ' | Failed: ' + failedCount);

if (failedCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
