"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { Bookmark } from "lucide-react";

export function BookmarkButton({ listingId, userId }: { listingId: string; userId: string | null }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function toggleSave(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      window.location.href = "/login";
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
      title={saved ? "Remove from saved" : "Save listing"}
      className={`relative flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-150 ${
        saved
          ? "border-[#ff5500] bg-[#ff5500] text-black shadow-[2px_2px_0px_#ffffff]"
          : "border-zinc-800 bg-[#121217] text-zinc-400 hover:border-zinc-500 hover:text-white"
      }`}
    >
      <Bookmark
        className={`h-4 w-4 ${saved ? "fill-black text-black" : ""}`}
      />
    </button>
  );
}


