"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import {
  Upload,
  X,
  Plus,
  Sparkles,
  MapPin,
  IndianRupee,
  CheckCircle2,
  Calendar,
  Eye,
  Zap,
  Tag
} from "lucide-react";

type FormState = {
  title: string;
  description: string;
  locality: string;
  city: string;
  rent: string;
  deposit: string;
  room_type: "single" | "shared" | "entire_flat";
  available_from: string;
  photos: string[];
  amenities: string[];
  tags: string[];
};

const AMENITY_OPTIONS = [
  "High-speed WiFi",
  "Air Conditioning",
  "Washing Machine",
  "Power Backup",
  "Modular Kitchen",
  "Daily Housekeeping",
  "Attached Washroom",
  "Balcony",
  "Gym Access",
  "Swimming Pool",
  "24/7 Security",
  "Covered Parking"
];

const VIBE_TAG_OPTIONS = [
  "Tech Enthusiasts",
  "Remote Workers",
  "Early Birds",
  "Night Owls",
  "Fitness Freaks",
  "Pet Friendly",
  "Veg Only",
  "Quiet & Calm",
  "Social & Vibrant",
  "Cleanliness 10/10"
];

export default function PostListingForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [photoInput, setPhotoInput] = useState("");

  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    locality: "",
    city: "Bangalore",
    rent: "",
    deposit: "",
    room_type: "single",
    available_from: new Date().toISOString().slice(0, 10),
    photos: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["High-speed WiFi", "Air Conditioning", "Washing Machine"],
    tags: ["Tech Enthusiasts", "Remote Workers"]
  });

  function addPhotoUrl() {
    if (!photoInput.trim()) return;
    setForm((prev) => ({
      ...prev,
      photos: [...prev.photos, photoInput.trim()]
    }));
    setPhotoInput("");
  }

  function removePhoto(idx: number) {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== idx)
    }));
  }

  function toggleAmenity(amenity: string) {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  }

  function toggleTag(tag: string) {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag]
    }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const supabase = createClient();
    const { data: auth } = await supabase.auth.getUser();

    if (!auth.user) {
      setLoading(false);
      router.push("/login?next=/post");
      return;
    }

    const { data, error } = await supabase
      .from("listings")
      .insert({
        user_id: auth.user.id,
        title: form.title,
        description: form.description,
        locality: form.locality,
        city: form.city,
        rent: Number(form.rent),
        deposit: Number(form.deposit) || Number(form.rent) * 2,
        room_type: form.room_type,
        available_from: form.available_from,
        photos: form.photos,
        amenities: form.amenities,
        tags: form.tags,
        is_active: true
      })
      .select("id")
      .single();

    setLoading(false);
    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push('/listings/' + data.id);
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      <form onSubmit={onSubmit} className="space-y-8 lg:col-span-8 font-mono text-xs">
        {errorMessage && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-300">
            {errorMessage}
          </div>
        )}

        <div className="bento-card p-6 border-1.5 border-tungsten-border space-y-4">
          <div className="flex items-center gap-2 border-b border-tungsten-border pb-3">
            <span className="sticker-pill border-phosphor bg-phosphor/10 text-phosphor">
              SECTION_01
            </span>
            <h3 className="font-mono text-sm font-black uppercase text-white">SPACE_IDENTIFICATION</h3>
          </div>

          <div>
            <label className="text-steel-muted font-bold uppercase">LISTING_TITLE *</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Master Bedroom in 3BHK Penthouse with Private Balcony"
              className="mt-1 w-full neo-input p-3"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-steel-muted font-bold uppercase">METRO_CITY *</label>
              <select
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="mt-1 w-full neo-input p-3 cursor-pointer"
              >
                <option value="Bangalore">Bangalore</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi & NCR</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
                <option value="Gurgaon">Gurgaon</option>
              </select>
            </div>

            <div>
              <label className="text-steel-muted font-bold uppercase">NEIGHBORHOOD_LOCALITY *</label>
              <input
                required
                value={form.locality}
                onChange={(e) => setForm({ ...form, locality: e.target.value })}
                placeholder="e.g. Indiranagar, 100ft Road"
                className="mt-1 w-full neo-input p-3"
              />
            </div>
          </div>

          <div>
            <label className="text-steel-muted font-bold uppercase">ROOM_CONFIGURATION *</label>
            <div className="mt-2 grid grid-cols-3 gap-3">
              {[
                { id: "single", label: "Single Room", desc: "Private Room" },
                { id: "shared", label: "Shared Room", desc: "2-3 Flatmates" },
                { id: "entire_flat", label: "Entire Flat", desc: "Complete Space" }
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setForm({ ...form, room_type: opt.id as any })}
                  className={
                    "rounded-xl border-1.5 p-3 text-left transition " +
                    (form.room_type === opt.id
                      ? "border-phosphor bg-phosphor/10 text-white shadow-[2px_2px_0px_#ccff00]"
                      : "border-tungsten-border bg-tungsten-card text-steel-muted hover:border-tungsten-border")
                  }
                >
                  <p className="font-mono text-xs font-bold uppercase">{opt.label}</p>
                  <p className="text-[10px] text-steel-muted">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bento-card p-6 border-1.5 border-tungsten-border space-y-4">
          <div className="flex items-center gap-2 border-b border-tungsten-border pb-3">
            <span className="sticker-pill border-[#3b82f6] bg-[#3b82f6]/10 text-[#3b82f6]">
              SECTION_02
            </span>
            <h3 className="font-mono text-sm font-black uppercase text-white">FINANCIALS_&_AVAILABILITY</h3>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="text-steel-muted font-bold uppercase">MONTHLY_RENT (₹) *</label>
              <input
                required
                type="number"
                value={form.rent}
                onChange={(e) => setForm({ ...form, rent: e.target.value })}
                placeholder="22000"
                className="mt-1 w-full neo-input p-3"
              />
            </div>

            <div>
              <label className="text-steel-muted font-bold uppercase">SECURITY_DEPOSIT (₹)</label>
              <input
                type="number"
                value={form.deposit}
                onChange={(e) => setForm({ ...form, deposit: e.target.value })}
                placeholder="44000"
                className="mt-1 w-full neo-input p-3"
              />
            </div>

            <div>
              <label className="text-steel-muted font-bold uppercase">MOVE_IN_DATE</label>
              <input
                type="date"
                value={form.available_from}
                onChange={(e) => setForm({ ...form, available_from: e.target.value })}
                className="mt-1 w-full neo-input p-3"
              />
            </div>
          </div>
        </div>

        <div className="bento-card p-6 border-1.5 border-tungsten-border space-y-4">
          <div className="flex items-center gap-2 border-b border-tungsten-border pb-3">
            <span className="sticker-pill border-[#a855f7] bg-[#a855f7]/10 text-[#a855f7]">
              SECTION_03
            </span>
            <h3 className="font-mono text-sm font-black uppercase text-white">AMENITIES_&_VIBE_CHIPS</h3>
          </div>

          <div>
            <label className="text-steel-muted font-bold uppercase mb-2 block">SELECT_INCLUDED_FACILITIES</label>
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map((item) => {
                const selected = form.amenities.includes(item);
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => toggleAmenity(item)}
                    className={
                      "rounded-lg border px-3 py-1.5 font-mono text-[11px] font-bold uppercase transition " +
                      (selected
                        ? "border-phosphor bg-phosphor text-black shadow-[2px_2px_0px_#ffffff]"
                        : "border-tungsten-border bg-tungsten-card text-steel-muted hover:border-zinc-600 hover:text-white")
                    }
                  >
                    {selected ? " " : "+ "}
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <label className="text-steel-muted font-bold uppercase mb-2 block">COMMUNITY_VIBE_TAGS</label>
            <div className="flex flex-wrap gap-2">
              {VIBE_TAG_OPTIONS.map((tag) => {
                const selected = form.tags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={
                      "rounded-lg border px-3 py-1.5 font-mono text-[11px] font-bold uppercase transition " +
                      (selected
                        ? "border-[#a855f7] bg-[#a855f7] text-white shadow-[2px_2px_0px_#ffffff]"
                        : "border-tungsten-border bg-tungsten-card text-steel-muted hover:border-zinc-600 hover:text-white")
                    }
                  >
                    {"#" + tag.replace(" ", "_")}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bento-card p-6 border-1.5 border-tungsten-border space-y-4">
          <div className="flex items-center gap-2 border-b border-tungsten-border pb-3">
            <span className="sticker-pill border-[#ff5500] bg-[#ff5500]/10 text-[#ff5500]">
              SECTION_04
            </span>
            <h3 className="font-mono text-sm font-black uppercase text-white">INTERIOR_PHOTOGRAPHY</h3>
          </div>

          <div className="flex gap-2">
            <input
              value={photoInput}
              onChange={(e) => setPhotoInput(e.target.value)}
              placeholder="Paste high-res image URL (e.g. Unsplash URL)"
              className="flex-1 neo-input p-3"
            />
            <button
              type="button"
              onClick={addPhotoUrl}
              className="neo-button-secondary px-5 font-bold"
            >
              [ +_ADD_FRAME ]
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-2">
            {form.photos.map((url, i) => (
              <div key={url + i} className="group relative h-24 overflow-hidden rounded-xl border border-tungsten-border bg-black">
                <Image src={url} alt="upload preview" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-md bg-black text-white hover:bg-rose-600 transition"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="neo-button w-full py-4 text-sm font-black uppercase tracking-wider shadow-[4px_4px_0px_#ffffff]"
        >
          {loading ? "COMMITTING_SPACE_TO_NETWORK..." : "PUBLISH_LISTING_LIVE →"}
        </button>
      </form>

      <aside className="lg:col-span-4 space-y-4">
        <div className="sticky top-24 space-y-4 font-mono text-xs">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-phosphor" />
            <span className="font-bold text-white uppercase">[ LIVE_FEED_PREVIEW ]</span>
          </div>

          <article className="bento-card overflow-hidden border-1.5 border-tungsten-border p-0">
            <div className="relative h-44 w-full bg-black">
              {form.photos[0] ? (
                <Image src={form.photos[0]} alt="preview" fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-zinc-600">NO_PHOTO</div>
              )}
              <div className="absolute top-2 left-2">
                <span className="sticker-pill border-black bg-black text-white text-[10px]">
                  {form.room_type.toUpperCase()}
                </span>
              </div>
              <div className="absolute bottom-2 left-2">
                <span className="rounded-md bg-black/90 px-2 py-0.5 font-bold text-phosphor">
                  ₹{form.rent || "0"}/mo
                </span>
              </div>
            </div>

            <div className="p-4 space-y-2">
              <h4 className="line-clamp-1 font-black uppercase text-white">
                {form.title || "Untitled Space"}
              </h4>
              <p className="flex items-center gap-1 text-[11px] text-steel-muted">
                <MapPin className="h-3 w-3 text-phosphor" />
                <span>{form.locality || "Locality"}, {form.city}</span>
              </p>

              <div className="flex flex-wrap gap-1 pt-1">
                {form.tags.slice(0, 2).map((t) => (
                  <span key={t} className="sticker-pill border-tungsten-border bg-zinc-900 text-steel-muted text-[9px]">
                    {"#" + t.replace(" ", "_")}
                  </span>
                ))}
              </div>
            </div>
          </article>
        </div>
      </aside>
    </div>
  );
}
