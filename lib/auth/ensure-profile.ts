import type { SupabaseClient, User } from "@supabase/supabase-js";

export async function ensureProfileForUser(supabase: SupabaseClient, user: User) {
  const metadata = user.user_metadata ?? {};
  const fullName = (metadata.full_name as string | undefined) ?? (metadata.name as string | undefined) ?? null;
  const avatarUrl = (metadata.avatar_url as string | undefined) ?? (metadata.picture as string | undefined) ?? null;

  await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        full_name: fullName,
        avatar_url: avatarUrl
      },
      { onConflict: "id", ignoreDuplicates: true }
    );
}
