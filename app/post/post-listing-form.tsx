"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GlassCard, GlowBadge } from "@/components/ui/premium";

const CITIES = ["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune"] as const;
const ROOM_TYPES = [
  { value: "single", label: "Single room" },
  { value: "shared", label: "Shared room" },
  { value: "entire_flat", label: "Entire flat" }
] as const;
const AMENITIES = ["WiFi", "AC", "Washing Machine", "Parking", "Gym"] as const;

type FieldErrors = Partial<Record<"title" | "roomType" | "locality" | "city" | "rent" | "deposit" | "availableFrom" | "description" | "photos", string>>;

export default function PostListingForm() {
  const supabase = createClient();
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [roomType, setRoomType] = useState("single");

  const previewUrls = useMemo(() => selectedPhotos.map((photo) => URL.createObjectURL(photo)), [selectedPhotos]);

  function onPhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []).slice(0, 5);
    setSelectedPhotos(files);
    setErrors((prev) => ({ ...prev, photos: files.length ? undefined : "Please upload at least one photo." }));
  }

  function validate(formData: FormData): FieldErrors {
    const nextErrors: FieldErrors = {};

    if (!String(formData.get("title") || "").trim()) nextErrors.title = "Title is required.";
    if (!roomType) nextErrors.roomType = "Please select a room type.";
    if (!String(formData.get("locality") || "").trim()) nextErrors.locality = "Locality is required.";
    if (!String(formData.get("city") || "").trim()) nextErrors.city = "City is required.";

    const rent = Number(formData.get("rent"));
    if (!Number.isFinite(rent) || rent <= 0) nextErrors.rent = "Monthly rent must be greater than 0.";

    const deposit = Number(formData.get("deposit"));
    if (!Number.isFinite(deposit) || deposit < 0) nextErrors.deposit = "Security deposit cannot be negative.";

    if (!String(formData.get("availableFrom") || "").trim()) nextErrors.availableFrom = "Available from date is required.";
    if (!String(formData.get("description") || "").trim()) nextErrors.description = "Description is required.";
    if (!selectedPhotos.length) nextErrors.photos = "Please upload at least one photo.";

    return nextErrors;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const validationErrors = validate(formData);

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setSubmitting(false);
      return;
    }

    const uploadedPhotoUrls: string[] = [];
    for (const file of selectedPhotos) {
      const path = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from("listing-photos").upload(path, file);
      if (uploadError) {
        setErrors({ photos: "Failed to upload photos. Please try again." });
        setSubmitting(false);
        return;
      }

      const { data } = supabase.storage.from("listing-photos").getPublicUrl(path);
      uploadedPhotoUrls.push(data.publicUrl);
    }

    const amenities = AMENITIES.filter((amenity) => formData.get(`amenity_${amenity}`)).map(String);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const { data: listing, error } = await supabase
      .from("listings")
      .insert({
        user_id: user.id,
        title: String(formData.get("title")),
        room_type: roomType,
        locality: String(formData.get("locality")),
        city: String(formData.get("city")),
        rent: Number(formData.get("rent")),
        deposit: Number(formData.get("deposit")),
        available_from: String(formData.get("availableFrom")),
        description: String(formData.get("description")),
        photos: uploadedPhotoUrls,
        amenities,
        expires_at: expiresAt.toISOString()
      })
      .select("id")
      .single();

    setSubmitting(false);

    if (error || !listing) {
      setErrors({ title: "Could not create listing. Please try again." });
      return;
    }

    router.push(`/listings/${listing.id}`);
  }

  return (
    <main className="mx-auto max-w-3xl p-6 text-slate-900">
      <GlassCard className="p-6">
      <div className="mb-6 flex items-center justify-between"><h1 className="text-3xl font-semibold">Post a Listing</h1><GlowBadge>30-day boost</GlowBadge></div>
      <form className="space-y-5" onSubmit={onSubmit}>
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" placeholder="Sunny room near metro" required />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        <fieldset>
          <Label>Room type</Label>
          <div className="mt-2 flex flex-wrap gap-4">
            {ROOM_TYPES.map((option) => (
              <label key={option.value} className="flex items-center gap-2 text-sm">
                <Input type="radio" className="h-4 w-4" name="room_type" checked={roomType === option.value} onChange={() => setRoomType(option.value)} />
                {option.label}
              </label>
            ))}
          </div>
          {errors.roomType && <p className="mt-1 text-sm text-red-600">{errors.roomType}</p>}
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="locality">Locality</Label>
            <Input id="locality" name="locality" required className="bg-white" />
            {errors.locality && <p className="mt-1 text-sm text-red-600">{errors.locality}</p>}
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <select id="city" name="city" className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-slate-900" defaultValue="">
              <option value="" disabled>Select city</option>
              {CITIES.map((city) => <option key={city} value={city}>{city}</option>)}
            </select>
            {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="rent">Monthly Rent</Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-2.5 text-sm text-muted-foreground">₹</span>
              <Input id="rent" name="rent" type="number" min="1" className="pl-7 bg-white" required />
            </div>
            {errors.rent && <p className="mt-1 text-sm text-red-600">{errors.rent}</p>}
          </div>
          <div>
            <Label htmlFor="deposit">Security Deposit</Label>
            <Input id="deposit" name="deposit" type="number" min="0" className="bg-white" required />
            {errors.deposit && <p className="mt-1 text-sm text-red-600">{errors.deposit}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="availableFrom">Available From</Label>
          <Input id="availableFrom" name="availableFrom" type="date" className="bg-white" required />
          {errors.availableFrom && <p className="mt-1 text-sm text-red-600">{errors.availableFrom}</p>}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" rows={5} className="bg-white" required />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        <div>
          <Label htmlFor="photos">Photos (max 5)</Label>
          <Input id="photos" name="photos" type="file" accept="image/*" className="bg-white" multiple onChange={onPhotoChange} />
          {errors.photos && <p className="mt-1 text-sm text-red-600">{errors.photos}</p>}
          {!!previewUrls.length && (
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {previewUrls.map((url, idx) => (
                <Image key={url + idx} src={url} alt={`Preview ${idx + 1}`} width={240} height={96} className="h-24 w-full rounded-md object-cover" />
              ))}
            </div>
          )}
        </div>

        <fieldset>
          <Label>Amenities</Label>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {AMENITIES.map((amenity) => (
              <label key={amenity} className="flex items-center gap-2 text-sm">
                <Input type="checkbox" className="h-4 w-4" name={`amenity_${amenity}`} />
                {amenity}
              </label>
            ))}
          </div>
        </fieldset>

        <Button type="submit" className="border-0 bg-gradient-to-r from-cyan-400 to-violet-500 text-white" disabled={submitting}>{submitting ? "Posting..." : "Post listing"}</Button>
      </form>
      </GlassCard>
    </main>
  );
}
