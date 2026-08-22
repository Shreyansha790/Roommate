"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { Bookmark } from "lucide-react";

export function BookmarkButton({ listingId, userId }: { listingId: string; userId?: string | null }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function toggleSave(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      setSaved(!saved);
      return;
    }

    setSaving(true);
    const supabase = createClient();
    if (!saved) {
      const { error } = await supabase.from("saved_listings").insert({ user_id: userId, listing_id: listingId });
      if (!error) setSaved(true);
    } else {
      const { error } = await supabase.from("saved_listings").delete().eq("user_id", userId).eq("listing_id", listingId);
      if (!error) setSaved(false);
    }
    setSaving(false);
  }

  return (
    <button
      onClick={toggleSave}
      disabled={saving}
      title={saved ? "Remove from wishlist" : "Save listing"}
      className={`relative flex h-8 w-8 items-center justify-center rounded-full border transition shadow-sm ${
        saved
          ? "border-coral-500 bg-coral-500 text-white"
          : "border-stone-200 bg-white/90 backdrop-blur-md text-stone-600 hover:text-coral-500 hover:bg-white"
      }`}
    >
      <Bookmark
        className={`h-3.5 w-3.5 ${saved ? "fill-white text-white" : ""}`}
      />
    </button>
  );
}
