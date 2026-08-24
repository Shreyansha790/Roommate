"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CompatibilityBadge } from "@/components/CompatibilityBadge";
import { BookmarkButton } from "./bookmark-button";
import { VectorFilterChips } from "@/components/search/VectorFilterChips";
import { Card3D } from "@/components/motion/Card3D";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  Home
} from "lucide-react";
import { rankListingsByQuery, ParsedSearchVectors } from "@/lib/nlp-parser";

export interface BrowseListingItem {
  id: string;
  title: string;
  locality: string;
  city: string;
  rent: number;
  room_type: string;
  available_from?: string;
  photos?: string[];
  user_id: string;
  tags?: string[];
  profiles?: {
    id?: string;
    full_name?: string;
    avatar_url?: string | null;
    is_verified?: boolean;
    profession?: string;
  };
  matchScore?: number;
  isochroneMins?: number;
}

export function BrowseClientView({
  initialListings,
  searchParams,
  parsedVectors,
  userId
}: {
  initialListings: BrowseListingItem[];
  searchParams: any;
  parsedVectors?: ParsedSearchVectors | null;
  userId?: string | null;
}) {
  const [nlpQuery, setNlpQuery] = useState(searchParams.q || "");
  const [selectedCity, setSelectedCity] = useState(searchParams.city || "All");
  const [selectedType, setSelectedType] = useState(searchParams.type || searchParams.roomType || "all");
  const [maxRent, setMaxRent] = useState(searchParams.maxRent ? Number(searchParams.maxRent) : 80000);

  const cities = ["All", "Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune", "Gurgaon"];

  const filteredListings = useMemo(() => {
    let list = initialListings;

    if (selectedCity !== "All") {
      list = list.filter((l) => l.city?.toLowerCase() === selectedCity.toLowerCase());
    }

    if (selectedType !== "all") {
      list = list.filter((l) => l.room_type === selectedType);
    }

    list = list.filter((l) => Number(l.rent) <= maxRent);

    if (nlpQuery.trim() && nlpQuery !== searchParams.q) {
      list = rankListingsByQuery(list as any, nlpQuery) as any;
    }

    return list;
  }, [initialListings, selectedCity, selectedType, maxRent, nlpQuery, searchParams.q]);

  return (
    <div className="space-y-8 font-sans text-stone-800">
      {/* Header & City Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eae6de] pb-6">
          <div>
            <span className="text-xs font-bold text-coral-500 uppercase tracking-widest block mb-1">
              verified co-living.
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-950 tracking-tight">
              residences<span className="text-coral-500">.</span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Showing {filteredListings.length} architectural residences with zero brokerage
            </p>
          </div>

          {/* AI Search Bar */}
          <div className="w-full sm:w-96">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
              <input
                value={nlpQuery}
                onChange={(e) => setNlpQuery(e.target.value)}
                placeholder="AI Search (e.g. Indiranagar under 25k vegan)"
                className="w-full neo-input pl-10 pr-12 py-2.5 text-xs text-stone-800 placeholder-stone-400 shadow-sm"
              />
              {nlpQuery && (
                <button
                  onClick={() => setNlpQuery("")}
                  className="absolute right-3 top-2.5 text-xs text-stone-400 hover:text-stone-600 font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Vector Chips if parsed */}
        {parsedVectors && <VectorFilterChips parsed={parsedVectors} />}

        {/* City Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                selectedCity === city
                  ? "bg-coral-500 text-white shadow-warm-coral"
                  : "bg-white border border-stone-200 text-stone-700 hover:bg-stone-50"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid & Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filter Bar */}
        <div className="space-y-6">
          <div className="bento-card p-5 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                <SlidersHorizontal className="h-4 w-4 text-coral-500" /> Filters
              </span>
              <button
                onClick={() => {
                  setSelectedCity("All");
                  setSelectedType("all");
                  setMaxRent(80000);
                  setNlpQuery("");
                }}
                className="text-xs font-semibold text-coral-600 hover:underline"
              >
                Reset
              </button>
            </div>

            {/* Room Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700">Room Type</label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {[
                  { label: "All", val: "all" },
                  { label: "Private", val: "single" },
                  { label: "Shared", val: "shared" }
                ].map((t) => (
                  <button
                    key={t.val}
                    onClick={() => setSelectedType(t.val)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition text-center ${
                      selectedType === t.val
                        ? "bg-coral-50 border-coral-300 text-coral-600 font-bold"
                        : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Rent Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-stone-700">
                <span>Max Rent</span>
                <span className="text-coral-600 font-bold">₹{maxRent.toLocaleString()}/mo</span>
              </div>
              <input
                type="range"
                min="10000"
                max="80000"
                step="2000"
                value={maxRent}
                onChange={(e) => setMaxRent(Number(e.target.value))}
                className="w-full accent-coral-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="lg:col-span-3">
          {filteredListings.length === 0 ? (
            <div className="bento-card p-12 text-center space-y-4 max-w-md mx-auto">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-coral-50 text-coral-500">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">No matching spaces found</h3>
              <p className="text-xs text-stone-500">Try adjusting your budget slider or searching a different area.</p>
              <button
                onClick={() => {
                  setSelectedCity("All");
                  setSelectedType("all");
                  setMaxRent(80000);
                  setNlpQuery("");
                }}
                className="neo-button px-4 py-2 text-xs font-bold"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredListings.map((listing: any, idx: number) => {
                  const profile = Array.isArray(listing.profiles) ? listing.profiles[0] : listing.profiles;
                  const photo = listing.photos?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80";
                  const matchScore = listing.matchScore ?? (88 + ((idx * 4) % 10));

                  return (
                    <motion.div
                      key={listing.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card3D depth={8} glareOpacity={0.15} className="bento-card p-0 flex flex-col justify-between">
                        <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                          <Image
                            src={photo}
                            alt={listing.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover transition duration-500 hover:scale-105"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="bg-white/90 backdrop-blur-md text-stone-800 font-bold text-[10px] px-2.5 py-1 rounded-full shadow-sm">
                              {listing.room_type?.replace("_", " ").toUpperCase() || "ROOM"}
                            </span>
                          </div>
                          <div className="absolute top-3 right-3 flex items-center gap-1.5">
                            <CompatibilityBadge score={matchScore} />
                            <BookmarkButton listingId={listing.id} userId={userId} />
                          </div>
                          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                            <div className="rounded-xl bg-white/95 backdrop-blur-md px-3 py-1 shadow-sm border border-stone-200">
                              <span className="font-extrabold text-sm text-stone-900">₹{Number(listing.rent).toLocaleString()}</span>
                              <span className="text-[10px] text-stone-500 font-medium">/mo</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 space-y-3">
                          <div>
                            <Link href={`/listings/${listing.id}`} className="hover:text-coral-600 transition">
                              <h3 className="line-clamp-1 text-sm font-bold text-stone-900">
                                {listing.title}
                              </h3>
                            </Link>
                            <p className="mt-1 flex items-center gap-1 text-xs text-stone-500 font-medium">
                              <MapPin className="h-3.5 w-3.5 text-coral-500 shrink-0" />
                              <span>{listing.locality}, {listing.city}</span>
                            </p>
                          </div>

                          {profile && (
                            <div className="flex items-center gap-2.5 rounded-xl border border-stone-100 bg-[#faf9f6] p-2">
                              {profile.avatar_url ? (
                                <Image
                                  src={profile.avatar_url}
                                  alt={profile.full_name || "Host"}
                                  width={24}
                                  height={24}
                                  className="h-6 w-6 rounded-full object-cover border border-stone-200"
                                />
                              ) : (
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-coral-100 text-[10px] font-bold text-coral-600">
                                  {profile.full_name?.[0] || "H"}
                                </div>
                              )}
                              <p className="truncate text-xs font-semibold text-stone-800">{profile.full_name}</p>
                              {profile.is_verified && (
                                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0 ml-auto" />
                              )}
                            </div>
                          )}

                          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                            <span>{listing.available_from || "Immediate"}</span>
                            <Link
                              href={`/listings/${listing.id}`}
                              className="font-bold text-coral-600 hover:text-coral-700 inline-flex items-center gap-1"
                            >
                              <span>View</span>
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                      </Card3D>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
