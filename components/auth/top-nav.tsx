import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { ProfileMenu } from "./profile-menu";
import { ensureProfileForUser } from "@/lib/auth/ensure-profile";
import { GlowBadge } from "@/components/ui/premium";

export async function TopNav() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) await ensureProfileForUser(supabase, user);
  const name = (user?.user_metadata?.full_name as string | undefined) || (user?.user_metadata?.name as string | undefined) || user?.email || "";
  const avatarUrl = (user?.user_metadata?.avatar_url as string | undefined) || (user?.user_metadata?.picture as string | undefined) || null;

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/65 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-base font-semibold tracking-tight text-white">Roommate <span className="text-cyan-300">Sphere</span></Link>
        <div className="flex items-center gap-3">
          <GlowBadge className="hidden sm:inline-flex">Live matching</GlowBadge>
          {user ? <ProfileMenu name={name} email={user.email ?? null} avatarUrl={avatarUrl} /> : <p className="text-sm text-slate-300">Guest</p>}
        </div>
      </div>
    </header>
  );
}
