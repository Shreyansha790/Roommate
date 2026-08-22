import Link from "next/link";
import { ShieldCheck, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-[#fbfaf8] text-stone-600 font-sans text-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-coral-500 text-white font-bold shadow-warm-coral">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-lg font-black tracking-tight text-stone-900">
                Roommate<span className="text-coral-500">Sphere</span>
              </span>
            </div>
            <p className="text-stone-500 text-sm max-w-sm leading-relaxed">
              Find verified flats and compatible roommates with multi-vector lifestyle matching and 100% zero brokerage fees.
            </p>
            <div className="flex items-center gap-3 text-xs text-stone-500 pt-1">
              <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <ShieldCheck className="h-3.5 w-3.5" /> 100% Verified Listings
              </span>
              <span className="inline-flex items-center gap-1 text-coral-600 font-semibold bg-coral-50 px-2.5 py-1 rounded-full border border-coral-200">
                Zero Brokerage
              </span>
            </div>
          </div>

          {/* Metro Zones */}
          <div>
            <h4 className="font-bold text-stone-900 mb-3 text-xs uppercase tracking-wider">Active Metros</h4>
            <ul className="space-y-2 text-xs text-stone-500">
              <li><Link href="/browse?city=Bangalore" className="hover:text-coral-500 transition">Bangalore (Indiranagar, HSR)</Link></li>
              <li><Link href="/browse?city=Mumbai" className="hover:text-coral-500 transition">Mumbai (Bandra, Andheri)</Link></li>
              <li><Link href="/browse?city=Delhi" className="hover:text-coral-500 transition">Delhi NCR (Hauz Khas, Gurgaon)</Link></li>
              <li><Link href="/browse?city=Hyderabad" className="hover:text-coral-500 transition">Hyderabad (Hitec City, Gachibowli)</Link></li>
              <li><Link href="/browse?city=Pune" className="hover:text-coral-500 transition">Pune (Koregaon Park, Viman Nagar)</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-bold text-stone-900 mb-3 text-xs uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-xs text-stone-500">
              <li><Link href="/browse" className="hover:text-coral-500 transition">Browse Spaces</Link></li>
              <li><Link href="/post" className="hover:text-coral-500 transition">Post a Room</Link></li>
              <li><Link href="/agreement" className="hover:text-coral-500 transition">Roommate Agreement</Link></li>
              <li><Link href="/onboarding" className="hover:text-coral-500 transition">Vibe Quiz</Link></li>
              <li><Link href="/saved" className="hover:text-coral-500 transition">Saved Listings</Link></li>
            </ul>
          </div>

          {/* Safety & Trust */}
          <div>
            <h4 className="font-bold text-stone-900 mb-3 text-xs uppercase tracking-wider">Safety & Trust</h4>
            <ul className="space-y-2 text-xs text-stone-500">
              <li>Verified Host Badge</li>
              <li>Phone Privacy Protocol</li>
              <li>Escrow Deposit Protection</li>
              <li>Community Guidelines</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} RoommateSphere Inc. Built for comfortable, human living.</p>
          <div className="flex items-center gap-1 text-stone-400">
            <span>Made with care for city dwellers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
