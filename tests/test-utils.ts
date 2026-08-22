/**
 * Roommate Sphere - Test Framework & Assertion Utility
 * Cyber-Cartographic Telemetry Test Harness
 */

export interface TestResult {
  suiteName: string;
  testName: string;
  tier: 1 | 2 | 3 | 4 | 5;
  passed: boolean;
  durationMs: number;
  error?: Error | string;
}

export interface SuiteSummary {
  suiteName: string;
  total: number;
  passed: number;
  failed: number;
  durationMs: number;
  results: TestResult[];
}

export interface MasterTestReport {
  totalSuites: number;
  totalTests: number;
  passed: number;
  failed: number;
  tierBreakdown: {
    tier1: number; // Coverage
    tier2: number; // Boundary
    tier3: number; // Pairwise
    tier4: number; // Real-world scenarios
    tier5: number; // Adversarial & Forensic
  };
  durationMs: number;
  suites: SuiteSummary[];
}

class TestContext {
  private currentSuite: string = "Global";
  private currentTier: 1 | 2 | 3 | 4 | 5 = 1;
  private results: TestResult[] = [];
  private beforeAllHooks: Array<() => Promise<void> | void> = [];
  private afterAllHooks: Array<() => Promise<void> | void> = [];

  setSuite(name: string) {
    this.currentSuite = name;
  }

  setTier(tier: 1 | 2 | 3 | 4 | 5) {
    this.currentTier = tier;
  }

  async runTest(
    name: string,
    tier: 1 | 2 | 3 | 4 | 5,
    fn: () => Promise<void> | void
  ): Promise<TestResult> {
    const start = performance.now();
    try {
      await fn();
      const durationMs = performance.now() - start;
      const result: TestResult = {
        suiteName: this.currentSuite,
        testName: name,
        tier,
        passed: true,
        durationMs,
      };
      this.results.push(result);
      return result;
    } catch (err: any) {
      const durationMs = performance.now() - start;
      const result: TestResult = {
        suiteName: this.currentSuite,
        testName: name,
        tier,
        passed: false,
        durationMs,
        error: err instanceof Error ? err.stack || err.message : String(err),
      };
      this.results.push(result);
      return result;
    }
  }

  getResults(): TestResult[] {
    return [...this.results];
  }

  clear() {
    this.results = [];
  }
}

export const globalTestContext = new TestContext();

export class Expectation<T = any> {
  constructor(private actual: T, private isNot = false) {}

  get not(): Expectation<T> {
    return new Expectation(this.actual, !this.isNot);
  }

  toBe(expected: any) {
    const pass = Object.is(this.actual, expected);
    if (this.isNot ? pass : !pass) {
      throw new Error(`Expected ${JSON.stringify(this.actual)} ${this.isNot ? "NOT to be" : "to be"} ${JSON.stringify(expected)}`);
    }
  }

  toEqual(expected: any) {
    const actualStr = JSON.stringify(this.actual);
    const expectedStr = JSON.stringify(expected);
    const pass = actualStr === expectedStr;
    if (this.isNot ? pass : !pass) {
      throw new Error(`Expected deep equality:\nActual:   ${actualStr}\nExpected: ${expectedStr}`);
    }
  }

  toBeGreaterThan(expected: number) {
    const pass = (this.actual as any) > expected;
    if (this.isNot ? pass : !pass) {
      throw new Error(`Expected ${this.actual} ${this.isNot ? "NOT >" : ">"} ${expected}`);
    }
  }

  toBeGreaterThanOrEqual(expected: number) {
    const pass = (this.actual as any) >= expected;
    if (this.isNot ? pass : !pass) {
      throw new Error(`Expected ${this.actual} ${this.isNot ? "NOT >=" : ">="} ${expected}`);
    }
  }

  toBeLessThan(expected: number) {
    const pass = (this.actual as any) < expected;
    if (this.isNot ? pass : !pass) {
      throw new Error(`Expected ${this.actual} ${this.isNot ? "NOT <" : "<"} ${expected}`);
    }
  }

  toBeLessThanOrEqual(expected: number) {
    const pass = (this.actual as any) <= expected;
    if (this.isNot ? pass : !pass) {
      throw new Error(`Expected ${this.actual} ${this.isNot ? "NOT <=" : "<="} ${expected}`);
    }
  }

  toBeCloseTo(expected: number, delta: number = 0.01) {
    const pass = Math.abs((this.actual as any) - expected) <= delta;
    if (this.isNot ? pass : !pass) {
      throw new Error(`Expected ${this.actual} to be close to ${expected} (+/- ${delta})`);
    }
  }

  toBeTruthy() {
    const pass = Boolean(this.actual);
    if (this.isNot ? pass : !pass) {
      throw new Error(`Expected ${JSON.stringify(this.actual)} ${this.isNot ? "NOT to be truthy" : "to be truthy"}`);
    }
  }

  toBeFalsy() {
    const pass = !Boolean(this.actual);
    if (this.isNot ? pass : !pass) {
      throw new Error(`Expected ${JSON.stringify(this.actual)} ${this.isNot ? "NOT to be falsy" : "to be falsy"}`);
    }
  }

  toBeDefined() {
    const pass = this.actual !== undefined;
    if (this.isNot ? pass : !pass) {
      throw new Error(`Expected value ${this.isNot ? "NOT to be defined" : "to be defined"}`);
    }
  }

  toBeUndefined() {
    const pass = this.actual === undefined;
    if (this.isNot ? pass : !pass) {
      throw new Error(`Expected ${JSON.stringify(this.actual)} to be undefined`);
    }
  }

  toBeNull() {
    const pass = this.actual === null;
    if (this.isNot ? pass : !pass) {
      throw new Error(`Expected ${JSON.stringify(this.actual)} to be null`);
    }
  }

  toContain(item: any) {
    let pass = false;
    if (typeof this.actual === "string") {
      pass = this.actual.includes(String(item));
    } else if (Array.isArray(this.actual)) {
      pass = this.actual.some((x) => x === item || JSON.stringify(x) === JSON.stringify(item));
    } else if (this.actual && typeof this.actual === "object") {
      pass = item in this.actual;
    }
    if (this.isNot ? pass : !pass) {
      throw new Error(`Expected ${JSON.stringify(this.actual)} ${this.isNot ? "NOT to contain" : "to contain"} ${JSON.stringify(item)}`);
    }
  }

  toMatch(regex: RegExp) {
    const pass = typeof this.actual === "string" && regex.test(this.actual);
    if (this.isNot ? pass : !pass) {
      throw new Error(`Expected "${this.actual}" ${this.isNot ? "NOT to match" : "to match"} ${regex}`);
    }
  }

  toHaveLength(expectedLen: number) {
    const len = (this.actual as any)?.length;
    const pass = len === expectedLen;
    if (this.isNot ? pass : !pass) {
      throw new Error(`Expected length ${expectedLen}, got ${len}`);
    }
  }

  toThrow(expectedMessage?: string | RegExp) {
    if (typeof this.actual !== "function") {
      throw new Error("Target is not a function");
    }
    let threw = false;
    let thrownError: any = null;
    try {
      this.actual();
    } catch (e) {
      threw = true;
      thrownError = e;
    }

    if (this.isNot ? threw : !threw) {
      throw new Error(`Expected function ${this.isNot ? "NOT to throw" : "to throw"}`);
    }

    if (threw && expectedMessage) {
      const msg = thrownError?.message || String(thrownError);
      if (typeof expectedMessage === "string" && !msg.includes(expectedMessage)) {
        throw new Error(`Expected error message to contain "${expectedMessage}", got "${msg}"`);
      }
      if (expectedMessage instanceof RegExp && !expectedMessage.test(msg)) {
        throw new Error(`Expected error message to match ${expectedMessage}, got "${msg}"`);
      }
    }
  }
}

export function expect<T = any>(actual: T): Expectation<T> {
  return new Expectation(actual);
}

// Test Registration Interface
type TestFn = () => Promise<void> | void;

export interface TestDef {
  name: string;
  tier: 1 | 2 | 3 | 4 | 5;
  fn: TestFn;
}

export class TestSuiteBuilder {
  private tests: TestDef[] = [];
  constructor(public name: string) {}

  tier1(name: string, fn: TestFn) {
    this.tests.push({ name: `[Tier 1: Coverage] ${name}`, tier: 1, fn });
  }

  tier2(name: string, fn: TestFn) {
    this.tests.push({ name: `[Tier 2: Boundary] ${name}`, tier: 2, fn });
  }

  tier3(name: string, fn: TestFn) {
    this.tests.push({ name: `[Tier 3: Pairwise] ${name}`, tier: 3, fn });
  }

  tier4(name: string, fn: TestFn) {
    this.tests.push({ name: `[Tier 4: Scenario] ${name}`, tier: 4, fn });
  }

  tier5(name: string, fn: TestFn) {
    this.tests.push({ name: `[Tier 5: Adversarial] ${name}`, tier: 5, fn });
  }

  async run(): Promise<SuiteSummary> {
    const start = performance.now();
    const suiteResults: TestResult[] = [];
    globalTestContext.setSuite(this.name);

    for (const t of this.tests) {
      const res = await globalTestContext.runTest(t.name, t.tier, t.fn);
      suiteResults.push(res);
    }

    const durationMs = performance.now() - start;
    const passed = suiteResults.filter((r) => r.passed).length;
    const failed = suiteResults.filter((r) => !r.passed).length;

    return {
      suiteName: this.name,
      total: suiteResults.length,
      passed,
      failed,
      durationMs,
      results: suiteResults,
    };
  }
}

export function createTestSuite(name: string): TestSuiteBuilder {
  return new TestSuiteBuilder(name);
}
