import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import PostListingForm from "./post-listing-form";
import { ensureProfileForUser } from "@/lib/auth/ensure-profile";

export default async function PostListingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/post");
  }

  await ensureProfileForUser(supabase, user);

  return <PostListingForm />;
}
