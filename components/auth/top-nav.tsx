import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { ProfileMenu } from "./profile-menu";
import { ensureProfileForUser } from "@/lib/auth/ensure-profile";

export async function TopNav() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    await ensureProfileForUser(supabase, user);
  }

  const name = (user?.user_metadata?.full_name as string | undefined) || (user?.user_metadata?.name as string | undefined) || user?.email || "";
  const avatarUrl = (user?.user_metadata?.avatar_url as string | undefined) || (user?.user_metadata?.picture as string | undefined) || null;

  return (
    <header className="sticky top-0 z-30 border-b bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-base font-semibold">Roommate Finder</Link>
        {user ? <ProfileMenu name={name} email={user.email ?? null} avatarUrl={avatarUrl} /> : <p className="text-sm text-muted-foreground">Guest</p>}
      </div>
    </header>
  );
}
