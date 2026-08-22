"use client";

import { useState } from "react";
import { FileText, Copy, Download, Users, Banknote, Home, Scale, Sparkles, Check } from "lucide-react";

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

      const text = `ROOMMATE AGREEMENT & HOUSE RULES
Date of Execution: ${today}
Status: MUTUALLY AGREED

PARTIES TO THIS AGREEMENT
Roommate 1: ${nameA}
Roommate 2: ${nameB}

SECTION 1: FINANCIAL TERMS
• Monthly Rent Split: ${rentSplit} between both parties
• Security Deposit: Distributed ${depositSplit}
• Utilities & Internet: ${utilitySplit === "equal" ? "Split equally (50/50)" : "Split proportionally based on measured usage"}
• Due Date: 1st of each calendar month

SECTION 2: LIVING STANDARDS & HOUSE HABITS
• Chore Schedule: ${choreRotation === "weekly" ? "Weekly rotating chore schedule" : "Bi-weekly rotating chore schedule"}
• Overnight Guest Policy: ${guestPolicy === "open" ? "Open - guests welcome anytime with basic courtesy" : guestPolicy === "notify" ? "24-hour advance notice requested for overnight guests" : "Restricted to weekends only"}
• Quiet Hours: From ${quietHoursStart} to ${quietHoursEnd} daily
• Kitchen Usage: ${kitchenSharing === "shared" ? "Shared kitchen with personal shelf and fridge organization" : "Separate designated cooking zones"}
• Smoking Policy: ${smokingPolicy === "allowed" ? "Allowed in private rooms" : smokingPolicy === "balcony" ? "Balcony or outdoor terrace only" : "Strictly non-smoking home"}

SECTION 3: NOTICE PERIOD & TERMINATION
• Notice Period for Vacating: ${noticePeriod} days written notice
• Security Deposit Refund: To be settled within 15 calendar days of move-out minus any documented damages

Signed in mutual agreement,

Party 1: _________________________ (${nameA})
Party 2: _________________________ (${nameB})
`;

      setGeneratedText(text);
      setIsGenerating(false);
    }, 1200);
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
    `px-3.5 py-2 rounded-xl border font-semibold text-xs transition cursor-pointer ${
      active
        ? "border-coral-500 bg-coral-50 text-coral-700 shadow-sm"
        : "border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100"
    }`;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 font-sans text-stone-800 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral-100 text-coral-600 font-bold">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Roommate Agreement Generator</h1>
          <p className="text-xs text-stone-500">Create a clear, customized house rules contract in under 2 minutes</p>
        </div>
      </div>

      {/* Form Sections */}
      <div className="space-y-6">
        {/* Section 1: Parties */}
        <div className="bento-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Users className="h-4 w-4 text-coral-500" />
            <h2 className="font-bold text-stone-900 text-sm">1. Roommate Names</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Roommate 1 Full Name</label>
              <input
                value={roommateA}
                onChange={(e) => setRoommateA(e.target.value)}
                placeholder="e.g. Maya Roy"
                className="w-full neo-input p-3 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Roommate 2 Full Name</label>
              <input
                value={roommateB}
                onChange={(e) => setRoommateB(e.target.value)}
                placeholder="e.g. Kevin Patel"
                className="w-full neo-input p-3 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Financial */}
        <div className="bento-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Banknote className="h-4 w-4 text-emerald-600" />
            <h2 className="font-bold text-stone-900 text-sm">2. Financial Splits</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-2">Rent Distribution</label>
              <div className="flex flex-wrap gap-2">
                {(["50/50", "60/40", "custom"] as RentSplit[]).map((opt) => (
                  <button key={opt} onClick={() => setRentSplit(opt)} className={chipClass(rentSplit === opt)}>
                    {opt} Split
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-2">Security Deposit Distribution</label>
              <div className="flex flex-wrap gap-2">
                {["equal", "proportional"].map((opt) => (
                  <button key={opt} onClick={() => setDepositSplit(opt)} className={chipClass(depositSplit === opt)}>
                    {opt === "equal" ? "Equal (50/50)" : "Proportional to Rent"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-2">Utility & WiFi Bills</label>
              <div className="flex flex-wrap gap-2">
                {["equal", "usage-based"].map((opt) => (
                  <button key={opt} onClick={() => setUtilitySplit(opt)} className={chipClass(utilitySplit === opt)}>
                    {opt === "equal" ? "Split Equally" : "Usage Based"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Living Standards */}
        <div className="bento-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Home className="h-4 w-4 text-amber-600" />
            <h2 className="font-bold text-stone-900 text-sm">3. House Rules & Lifestyle Standards</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-2">Chore Rotation</label>
              <div className="flex flex-wrap gap-2">
                {(["weekly", "biweekly"] as ChoreRotation[]).map((opt) => (
                  <button key={opt} onClick={() => setChoreRotation(opt)} className={chipClass(choreRotation === opt)}>
                    {opt === "weekly" ? "Weekly Rotation" : "Bi-Weekly Rotation"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-2">Overnight Guest Policy</label>
              <div className="flex flex-wrap gap-2">
                {(["open", "notify", "restrict"] as GuestPolicy[]).map((opt) => (
                  <button key={opt} onClick={() => setGuestPolicy(opt)} className={chipClass(guestPolicy === opt)}>
                    {opt === "open" ? "Open Guests" : opt === "notify" ? "Notify 24h Prior" : "Weekends Only"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-2">Quiet Hours</label>
              <div className="flex items-center gap-2">
                <input type="time" value={quietHoursStart} onChange={(e) => setQuietHoursStart(e.target.value)} className="neo-input p-2 text-xs" />
                <span className="text-stone-400 text-xs">to</span>
                <input type="time" value={quietHoursEnd} onChange={(e) => setQuietHoursEnd(e.target.value)} className="neo-input p-2 text-xs" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-2">Smoking Policy</label>
              <div className="flex flex-wrap gap-2">
                {(["allowed", "balcony", "prohibited"] as SmokingPolicy[]).map((opt) => (
                  <button key={opt} onClick={() => setSmokingPolicy(opt)} className={chipClass(smokingPolicy === opt)}>
                    {opt === "balcony" ? "Balcony Only" : opt === "prohibited" ? "Non-Smoking" : "Allowed"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Notice Period */}
        <div className="bento-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Scale className="h-4 w-4 text-indigo-600" />
            <h2 className="font-bold text-stone-900 text-sm">4. Notice Period</h2>
          </div>
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-2">Notice required before moving out</label>
            <div className="flex flex-wrap gap-2">
              {(["30", "60", "90"] as NoticePeriod[]).map((opt) => (
                <button key={opt} onClick={() => setNoticePeriod(opt)} className={chipClass(noticePeriod === opt)}>
                  {opt} Days Notice
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate CTA */}
        <button
          onClick={generateAgreement}
          disabled={isGenerating}
          className="neo-button w-full py-4 text-sm font-bold shadow-warm-coral flex items-center justify-center gap-2"
        >
          <Sparkles className="h-4 w-4" />
          <span>{isGenerating ? "Drafting Agreement..." : "Generate Agreement Draft"}</span>
        </button>

        {/* Output Pre */}
        {generatedText && (
          <div className="bento-card p-6 sm:p-8 space-y-4 shadow-warm-lg">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <span className="font-bold text-stone-900 text-sm">Customized Agreement Draft</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyToClipboard}
                  className="neo-button-secondary px-3 py-1.5 text-xs font-semibold flex items-center gap-1"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
                <button
                  onClick={downloadAsTxt}
                  className="neo-button-secondary px-3 py-1.5 text-xs font-semibold flex items-center gap-1"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download .txt</span>
                </button>
              </div>
            </div>

            <pre className="whitespace-pre-wrap text-stone-700 text-xs font-mono leading-relaxed bg-[#fbfaf8] p-5 rounded-xl border border-stone-200 overflow-x-auto">
              {generatedText}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
