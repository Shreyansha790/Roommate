import Link from "next/link";
import { Sparkles, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#eae6de] bg-[#fcfbf9] font-sans text-stone-900 pt-16 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-black text-2xl tracking-tighter text-stone-950">
                roommatesphere<span className="text-coral-500">.</span>
              </span>
            </Link>

            <p className="text-xs text-stone-600 max-w-sm leading-relaxed">
              Curated co-living residences designed with an emphasis on comfort, architectural style,
              and flatmate compatibility. 100% direct connection with zero brokerage fees.
            </p>

            <div className="pt-2">
              <Link
                href="/post"
                className="inline-flex items-center gap-1 text-xs font-black text-stone-950 hover:text-coral-500 transition"
              >
                <span>post your residence</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Column 1: Residences */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-stone-950">
              residences.
            </h4>
            <ul className="space-y-2 text-xs font-medium text-stone-600">
              <li>
                <Link href="/browse?type=single" className="hover:text-stone-950 transition">
                  classic suites.
                </Link>
              </li>
              <li>
                <Link href="/browse?type=shared" className="hover:text-stone-950 transition">
                  mini co-living.
                </Link>
              </li>
              <li>
                <Link href="/browse?type=entire_flat" className="hover:text-stone-950 transition">
                  village lofts.
                </Link>
              </li>
              <li>
                <Link href="/browse" className="hover:text-stone-950 transition">
                  all spaces.
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Experiences */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-stone-950">
              experiences.
            </h4>
            <ul className="space-y-2 text-xs font-medium text-stone-600">
              <li>
                <Link href="/browse?city=Bangalore" className="hover:text-stone-950 transition">
                  indiranagar.
                </Link>
              </li>
              <li>
                <Link href="/browse?city=Mumbai" className="hover:text-stone-950 transition">
                  bandra west.
                </Link>
              </li>
              <li>
                <Link href="/browse?city=Delhi+NCR" className="hover:text-stone-950 transition">
                  hauz khas.
                </Link>
              </li>
              <li>
                <Link href="/browse?city=Hyderabad" className="hover:text-stone-950 transition">
                  hitec city.
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-stone-950">
              platform.
            </h4>
            <ul className="space-y-2 text-xs font-medium text-stone-600">
              <li>
                <Link href="/onboarding" className="hover:text-stone-950 transition">
                  vibe dna quiz.
                </Link>
              </li>
              <li>
                <Link href="/agreement" className="hover:text-stone-950 transition">
                  roommate agreement.
                </Link>
              </li>
              <li>
                <Link href="/messages" className="hover:text-stone-950 transition">
                  direct chat.
                </Link>
              </li>
              <li>
                <Link href="/saved" className="hover:text-stone-950 transition">
                  saved wishlist.
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Hairline & Signature */}
        <div className="border-t border-[#eae6de] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-medium text-stone-500">
          <p>© 2026 RoommateSphere. All rights reserved. Zero Brokerage Guarantee.</p>
          <div className="flex items-center gap-6">
            <Link href="/browse" className="hover:text-stone-950 transition lowercase">
              privacy policy.
            </Link>
            <Link href="/browse" className="hover:text-stone-950 transition lowercase">
              cookies.
            </Link>
            <span className="text-stone-400 font-bold uppercase tracking-wider">
              Nueve Living Architecture
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
