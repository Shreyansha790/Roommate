"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export function BookmarkButton({ listingId, userId }: { listingId: string; userId: string | null }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    if (!userId) {
      window.location.href = "/login";
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("saved_listings").insert({ user_id: userId, listing_id: listingId });
    if (!error) setSaved(true);
    setSaving(false);
  }

  return (
    <Button variant="outline" size="sm" onClick={save} disabled={saving || saved} aria-label="Save listing">
      {saved ? "★ Saved" : "☆ Bookmark"}
    </Button>
  );
}
