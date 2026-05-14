import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import PostListingForm from "./post-listing-form";

export default async function PostListingPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/post");
  }

  return <PostListingForm />;
}
