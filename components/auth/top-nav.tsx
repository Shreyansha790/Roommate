import { createClient } from "@/lib/supabase-server";
import { ensureProfileForUser } from "@/lib/auth/ensure-profile";
import { TopNavClient } from "./top-nav-client";

export async function TopNav() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    await ensureProfileForUser(supabase, user);
  }

  const name =
    (user?.user_metadata?.full_name as string | undefined) ||
    (user?.user_metadata?.name as string | undefined) ||
    user?.email ||
    "";
  const avatarUrl =
    (user?.user_metadata?.avatar_url as string | undefined) ||
    (user?.user_metadata?.picture as string | undefined) ||
    null;

  return (
    <TopNavClient
      user={user ? { id: user.id, email: user.email } : null}
      name={name}
      avatarUrl={avatarUrl}
    />
  );
}
