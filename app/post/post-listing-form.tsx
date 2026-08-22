"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient, hasSupabaseEnv } from "@/lib/supabase";
import {
  Upload,
  Sparkles,
  MapPin,
  IndianRupee,
  CheckCircle2,
  Home,
  FileText,
  Plus,
  Trash2,
  ShieldCheck
} from "lucide-react";

export default function PostListingForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locality, setLocality] = useState("");
  const [city, setCity] = useState("Bangalore");
  const [rent, setRent] = useState(25000);
  const [deposit, setDeposit] = useState(50000);
  const [roomType, setRoomType] = useState("single");
  const [availableFrom, setAvailableFrom] = useState("Immediate");
  const [photos, setPhotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"
  ]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "High-Speed Wifi",
    "Air Conditioning",
    "Power Backup",
    "Washing Machine"
  ]);

  const amenitiesList = [
    "High-Speed Wifi",
    "Air Conditioning",
    "Power Backup",
    "Washing Machine",
    "Housekeeping",
    "Gym Access",
    "Balcony",
    "Covered Parking",
    "Modular Kitchen",
    "Elevator"
  ];

  function toggleAmenity(amenity: string) {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  }

  function handleAiEnhance() {
    setAiGenerating(true);
    setTimeout(() => {
      const area = locality || "prime location";
      const cityName = city || "the city";
      const enhanced = `Sunlit and spacious ${roomType === "single" ? "private room" : "shared space"} in ${area}, ${cityName}.

Key highlights:
• High-speed fiber internet and quiet workspace setup
• Fully equipped modular kitchen and modern appliances
• Peaceful, safe residential building with 24/7 security
• Walking distance to cafes, grocery stores, and public transit

Looking for a friendly, respectful flatmate who appreciates a clean, comfortable home!`;

      setDescription(enhanced);
      setAiGenerating(false);
    }, 1000);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    if (!hasSupabaseEnv()) {
      setTimeout(() => {
        setLoading(false);
        router.push("/browse");
      }, 700);
      return;
    }

    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("listings").insert({
      user_id: user.id,
      title: title || `${roomType.toUpperCase()} in ${locality}, ${city}`,
      description,
      locality,
      city,
      rent,
      deposit,
      room_type: roomType,
      available_from: availableFrom,
      photos,
      amenities: selectedAmenities
    });

    setLoading(false);
    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/browse");
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 font-sans text-stone-800 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral-100 text-coral-600 font-bold">
          <Home className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Post a Living Space</h1>
          <p className="text-xs text-stone-500">List your room or flat with 100% zero brokerage</p>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700 text-xs">
          {errorMessage}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Section 1: Basic Info */}
        <div className="bento-card p-6 sm:p-8 space-y-5 shadow-sm">
          <h2 className="font-bold text-stone-900 text-sm border-b border-stone-100 pb-3">1. Basic Space Information</h2>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 block">Listing Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sunny Master Bedroom with Balcony in Indiranagar"
              required
              className="w-full neo-input p-3 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full neo-input p-3 text-xs cursor-pointer"
              >
                <option value="Bangalore">Bangalore</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi NCR</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
                <option value="Gurgaon">Gurgaon</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">Locality / Neighborhood</label>
              <input
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder="e.g. Indiranagar 100ft Road"
                required
                className="w-full neo-input p-3 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">Monthly Rent (₹)</label>
              <input
                type="number"
                value={rent}
                onChange={(e) => setRent(Number(e.target.value))}
                required
                className="w-full neo-input p-3 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">Security Deposit (₹)</label>
              <input
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value))}
                required
                className="w-full neo-input p-3 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">Room Type</label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full neo-input p-3 text-xs cursor-pointer"
              >
                <option value="single">Private Room</option>
                <option value="shared">Shared Room</option>
                <option value="entire_flat">Full Apartment</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: AI Description */}
        <div className="bento-card p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h2 className="font-bold text-stone-900 text-sm">2. Space Description</h2>
            <button
              type="button"
              onClick={handleAiEnhance}
              disabled={aiGenerating}
              className="neo-button-secondary px-3 py-1 text-xs font-bold text-coral-600 flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{aiGenerating ? "Drafting..." : "Auto-Write with AI"}</span>
            </button>
          </div>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Describe the apartment layout, sunlight, balcony, flatmate dynamics, and house rules..."
            className="w-full neo-input p-3.5 text-xs leading-relaxed"
          />
        </div>

        {/* Section 3: Amenities */}
        <div className="bento-card p-6 sm:p-8 space-y-4 shadow-sm">
          <h2 className="font-bold text-stone-900 text-sm border-b border-stone-100 pb-3">3. Included Amenities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {amenitiesList.map((amenity) => {
              const isSelected = selectedAmenities.includes(amenity);
              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold text-left transition ${
                    isSelected
                      ? "border-coral-500 bg-coral-50 text-coral-700 shadow-sm"
                      : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  <CheckCircle2 className={`h-4 w-4 shrink-0 ${isSelected ? "text-coral-600" : "text-stone-300"}`} />
                  <span className="truncate">{amenity}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="neo-button w-full py-4 text-sm font-bold shadow-warm-coral flex items-center justify-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            <span>{loading ? "Publishing Listing..." : "Publish Verified Space (Zero Brokerage)"}</span>
          </button>
        </div>
      </form>
    </main>
  );
}
