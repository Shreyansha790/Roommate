"use client";

import { useState } from "react";
import { FileText, Copy, Download, Users, Banknote, Home, Scale } from "lucide-react";

type RentSplit = "50/50" | "60/40" | "custom";
type ChoreRotation = "weekly" | "biweekly";
type GuestPolicy = "open" | "notify" | "restrict";
type SmokingPolicy = "allowed" | "balcony" | "prohibited";
type KitchenSharing = "shared" | "separate";
type NoticePeriod = "30" | "60" | "90";

export default function AgreementPage() {
  const [roommateA, setRoommateA] = useState("");
  const [roommateB, setRoommateB] = useState("");
  const [rentSplit, setRentSplit] = useState<RentSplit>("50/50");
  const [depositSplit, setDepositSplit] = useState("equal");
  const [utilitySplit, setUtilitySplit] = useState("equal");
  const [choreRotation, setChoreRotation] = useState<ChoreRotation>("weekly");
  const [guestPolicy, setGuestPolicy] = useState<GuestPolicy>("notify");
  const [quietHoursStart, setQuietHoursStart] = useState("22:00");
  const [quietHoursEnd, setQuietHoursEnd] = useState("07:00");
  const [kitchenSharing, setKitchenSharing] = useState<KitchenSharing>("shared");
  const [smokingPolicy, setSmokingPolicy] = useState<SmokingPolicy>("prohibited");
  const [noticePeriod, setNoticePeriod] = useState<NoticePeriod>("30");
  const [generatedText, setGeneratedText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  function generateAgreement() {
    setIsGenerating(true);
    setTimeout(() => {
      const today = new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
      const nameA = roommateA || "Roommate A";
      const nameB = roommateB || "Roommate B";

      const text = `ROOMMATE AGREEMENT PROTOCOL
Generated: ${today}
Status: ACTIVE

PARTIES TO THIS AGREEMENT
Party A: ${nameA}
Party B: ${nameB}

SECTION 1: FINANCIAL PROTOCOL
- Rent Distribution: ${rentSplit} split between parties
- Security Deposit: Split ${depositSplit} between parties
- Utility Bills: ${utilitySplit === "equal" ? "Split equally" : "Split based on individual usage metering"}
- Payment Deadline: 1st of each calendar month
- Late Payment Penalty: INR 100/day after a 3-day grace period

SECTION 2: LIVING STANDARDS
- Chore Rotation: ${choreRotation === "weekly" ? "Weekly rotation" : "Bi-weekly rotation"} schedule
- Guest Policy: ${guestPolicy === "open" ? "Open - guests welcome at all times" : guestPolicy === "notify" ? "Notify - 24-hour advance notice required for overnight guests" : "Restricted - overnight guests limited to weekends only"}
- Quiet Hours: ${quietHoursStart} to ${quietHoursEnd} daily
- Kitchen Usage: ${kitchenSharing === "shared" ? "Shared kitchen with designated shelf space" : "Separate cooking schedules and storage zones"}
- Smoking: ${smokingPolicy === "allowed" ? "Permitted in personal rooms" : smokingPolicy === "balcony" ? "Permitted on balcony/terrace only" : "Strictly prohibited on premises"}

SECTION 3: COMMON AREA MAINTENANCE
- Common areas to be cleaned on rotation schedule
- Personal belongings must not be left in shared spaces overnight
- Appliance maintenance costs shared equally

SECTION 4: DISPUTE RESOLUTION
- Notice Period: ${noticePeriod} days written notice required before vacating
- Deposit Refund: Full refund within 15 days of vacancy, minus documented damages
- Mediation: Disputes to be resolved through mutual discussion before external mediation

SECTION 5: TERMINATION CLAUSES
- Either party may terminate this agreement with ${noticePeriod} days written notice
- Immediate termination permitted in case of illegal activity or safety violations
- All personal property must be removed within 7 days of agreement termination

This agreement is entered into voluntarily by both parties.

Signature (Party A): _______________  Date: ___________
${nameA}

Signature (Party B): _______________  Date: ___________
${nameB}`;

      setGeneratedText(text);
      setIsGenerating(false);
    }, 1500);
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadAsTxt() {
    const blob = new Blob([generatedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "roommate-agreement.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  const chipClass = (active: boolean) =>
    `px-3 py-2 rounded-lg border font-bold text-[11px] uppercase transition cursor-pointer ${
      active
        ? "border-phosphor bg-phosphor/10 text-phosphor"
        : "border-tungsten-border bg-tungsten text-steel-muted hover:border-steel-muted"
    }`;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 font-mono text-xs space-y-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-solar/10 border border-solar/30 text-solar">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-black uppercase text-white">AI_AGREEMENT_PROTOCOL</h1>
          <p className="text-steel-muted text-[11px]">HOUSE_RULES_GENERATOR // AUTOMATED_CONTRACT_BUILDER</p>
        </div>
      </div>

      {/* Section 1: Parties */}
      <div className="bento-card p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-tungsten-border pb-3">
          <Users className="h-4 w-4 text-phosphor" />
          <h2 className="font-black uppercase text-white text-sm">SECTION_01: PARTIES</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-steel-muted font-bold uppercase block mb-1.5">PARTY_A_NAME</label>
            <input value={roommateA} onChange={(e) => setRoommateA(e.target.value)} placeholder="Enter name" className="w-full neo-input p-3" />
          </div>
          <div>
            <label className="text-steel-muted font-bold uppercase block mb-1.5">PARTY_B_NAME</label>
            <input value={roommateB} onChange={(e) => setRoommateB(e.target.value)} placeholder="Enter name" className="w-full neo-input p-3" />
          </div>
        </div>
      </div>

      {/* Section 2: Financial */}
      <div className="bento-card p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-tungsten-border pb-3">
          <Banknote className="h-4 w-4 text-solar" />
          <h2 className="font-black uppercase text-white text-sm">SECTION_02: FINANCIAL_PROTOCOL</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-steel-muted font-bold uppercase block mb-2">RENT_SPLIT</label>
            <div className="flex flex-wrap gap-2">
              {(["50/50", "60/40", "custom"] as RentSplit[]).map((opt) => (
                <button key={opt} onClick={() => setRentSplit(opt)} className={chipClass(rentSplit === opt)}>{opt}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-steel-muted font-bold uppercase block mb-2">DEPOSIT_SPLIT</label>
            <div className="flex flex-wrap gap-2">
              {["equal", "proportional"].map((opt) => (
                <button key={opt} onClick={() => setDepositSplit(opt)} className={chipClass(depositSplit === opt)}>{opt}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-steel-muted font-bold uppercase block mb-2">UTILITY_BILLS</label>
            <div className="flex flex-wrap gap-2">
              {["equal", "usage-based"].map((opt) => (
                <button key={opt} onClick={() => setUtilitySplit(opt)} className={chipClass(utilitySplit === opt)}>{opt}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Living Standards */}
      <div className="bento-card p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-tungsten-border pb-3">
          <Home className="h-4 w-4 text-cyan" />
          <h2 className="font-black uppercase text-white text-sm">SECTION_03: LIVING_STANDARDS</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-steel-muted font-bold uppercase block mb-2">CHORE_ROTATION</label>
            <div className="flex flex-wrap gap-2">
              {(["weekly", "biweekly"] as ChoreRotation[]).map((opt) => (
                <button key={opt} onClick={() => setChoreRotation(opt)} className={chipClass(choreRotation === opt)}>{opt}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-steel-muted font-bold uppercase block mb-2">GUEST_POLICY</label>
            <div className="flex flex-wrap gap-2">
              {(["open", "notify", "restrict"] as GuestPolicy[]).map((opt) => (
                <button key={opt} onClick={() => setGuestPolicy(opt)} className={chipClass(guestPolicy === opt)}>{opt}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-steel-muted font-bold uppercase block mb-2">QUIET_HOURS</label>
            <div className="flex items-center gap-2">
              <input type="time" value={quietHoursStart} onChange={(e) => setQuietHoursStart(e.target.value)} className="neo-input p-2 text-center" />
              <span className="text-steel-muted">TO</span>
              <input type="time" value={quietHoursEnd} onChange={(e) => setQuietHoursEnd(e.target.value)} className="neo-input p-2 text-center" />
            </div>
          </div>
          <div>
            <label className="text-steel-muted font-bold uppercase block mb-2">KITCHEN_SHARING</label>
            <div className="flex flex-wrap gap-2">
              {(["shared", "separate"] as KitchenSharing[]).map((opt) => (
                <button key={opt} onClick={() => setKitchenSharing(opt)} className={chipClass(kitchenSharing === opt)}>{opt}</button>
              ))}
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="text-steel-muted font-bold uppercase block mb-2">SMOKING_POLICY</label>
            <div className="flex flex-wrap gap-2">
              {(["allowed", "balcony", "prohibited"] as SmokingPolicy[]).map((opt) => (
                <button key={opt} onClick={() => setSmokingPolicy(opt)} className={chipClass(smokingPolicy === opt)}>{opt === "balcony" ? "BALCONY_ONLY" : opt}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Dispute */}
      <div className="bento-card p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-tungsten-border pb-3">
          <Scale className="h-4 w-4 text-violet" />
          <h2 className="font-black uppercase text-white text-sm">SECTION_04: DISPUTE_RESOLUTION</h2>
        </div>
        <div>
          <label className="text-steel-muted font-bold uppercase block mb-2">NOTICE_PERIOD</label>
          <div className="flex flex-wrap gap-2">
            {(["30", "60", "90"] as NoticePeriod[]).map((opt) => (
              <button key={opt} onClick={() => setNoticePeriod(opt)} className={chipClass(noticePeriod === opt)}>{opt}_DAYS</button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generateAgreement}
        disabled={isGenerating}
        className="neo-button w-full py-4 text-sm font-black uppercase tracking-wider"
      >
        {isGenerating ? "AI_PROCESSING // DRAFTING_CONTRACT..." : "GENERATE_AGREEMENT"}
      </button>

      {/* Generated Output */}
      {generatedText && (
        <div className="bento-card reticle-border p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-tungsten-border pb-3">
            <span className="font-black uppercase text-white text-sm">GENERATED_CONTRACT</span>
            <div className="flex items-center gap-2">
              <button onClick={copyToClipboard} className="neo-button-secondary px-3 py-1.5 text-[10px] font-bold flex items-center gap-1">
                <Copy className="h-3 w-3" />
                {copied ? "COPIED" : "COPY"}
              </button>
              <button onClick={downloadAsTxt} className="neo-button-secondary px-3 py-1.5 text-[10px] font-bold flex items-center gap-1">
                <Download className="h-3 w-3" />
                DOWNLOAD_TXT
              </button>
            </div>
          </div>
          <pre className="whitespace-pre-wrap text-slate-300 text-xs leading-relaxed bg-obsidian-sub p-4 rounded-lg border border-tungsten-border overflow-x-auto">
            {generatedText}
          </pre>
        </div>
      )}
    </main>
  );
}
