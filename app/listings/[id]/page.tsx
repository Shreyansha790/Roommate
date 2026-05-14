import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { buttonVariants } from "@/components/ui/button";
import { Gallery } from "./gallery";
import { GlassCard, GlowBadge } from "@/components/ui/premium";

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const { data: listing } = await supabase.from("listings").select("*,profiles!listings_user_id_fkey(id,full_name,avatar_url,is_verified,phone,profession)").eq("id", params.id).single();
  if (!listing) notFound();
  const poster = Array.isArray(listing.profiles) ? listing.profiles[0] : listing.profiles;
  let compatibilityScore = 0; let phoneVisible = false;
  if (auth.user && poster?.id) {
    const { data: prefs } = await supabase.from("roommate_preferences").select("id,user_id").in("user_id", [auth.user.id, poster.id]);
    const myPref = prefs?.find((p) => p.user_id === auth.user?.id); const posterPref = prefs?.find((p) => p.user_id === poster.id);
    if (myPref && posterPref) { const { data } = await supabase.rpc("compatibility_score", { pref_a_id: myPref.id, pref_b_id: posterPref.id }); compatibilityScore = data || 0; }
    const { data: messages } = await supabase.from("messages").select("sender_id,receiver_id").or(`and(sender_id.eq.${auth.user.id},receiver_id.eq.${poster.id}),and(sender_id.eq.${poster.id},receiver_id.eq.${auth.user.id})`);
    phoneVisible = Boolean(messages?.some((m) => m.sender_id === auth.user?.id && m.receiver_id === poster.id) && messages?.some((m) => m.sender_id === poster.id && m.receiver_id === auth.user?.id));
  }
  const messageHref = auth.user ? `/chat?user=${poster.id}&listing=${listing.id}` : "/login";

  return <main className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6"><div><h1 className="text-3xl font-semibold">{listing.title}</h1><p className="text-slate-300">{listing.locality}, {listing.city}</p></div><div className="grid gap-6 lg:grid-cols-[2fr_1fr]"><section className="space-y-4"><GlassCard className="overflow-hidden p-2"><Gallery photos={listing.photos || []} title={listing.title} /></GlassCard><GlassCard className="p-5"><div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3"><p><strong>Rent:</strong> ₹{Number(listing.rent).toLocaleString()}/month</p><p><strong>Deposit:</strong> ₹{Number(listing.deposit || 0).toLocaleString()}</p><p><strong>Room type:</strong> {listing.room_type.replace("_", " ")}</p><p><strong>Available from:</strong> {listing.available_from || "Flexible"}</p><p><strong>Posted:</strong> {new Date(listing.created_at).toLocaleDateString()}</p></div></GlassCard><GlassCard className="p-5"><h2 className="mb-2 text-lg font-semibold">Description</h2><p className="whitespace-pre-wrap text-sm leading-6 text-slate-200">{listing.description || "No description provided."}</p></GlassCard></section><aside className="space-y-4"><GlassCard className="animate-glow p-5"><h2 className="mb-3 text-lg font-semibold">Host panel</h2><div className="flex items-center gap-3"><Image src={poster?.avatar_url || "https://placehold.co/80x80?text=User"} alt={poster?.full_name || "User"} width={80} height={80} className="h-12 w-12 rounded-full object-cover" /><div><p className="font-medium">{poster?.full_name || "Anonymous"}</p><p className="text-sm text-slate-300">{poster?.profession || "Profession not added"}</p></div></div>{poster?.is_verified ? <GlowBadge className="mt-3">Verified user</GlowBadge> : null}<p className="mt-3 text-sm"><strong>Compatibility score:</strong> {compatibilityScore}%</p><p className="mt-2 text-sm"><strong>Phone:</strong> {phoneVisible ? poster?.phone || "Not available" : "Hidden until both users exchange one message"}</p><Link href={messageHref} className={buttonVariants({ className: "mt-4 w-full border-0 bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950" })}>{auth.user ? "Send Message" : "Login to Send Message"}</Link></GlassCard></aside></div></main>;
}
