import { createClient } from "@supabase/supabase-js";

type SeedProfile = {
  id: string;
  full_name: string;
  phone: string;
  avatar_url: string;
  is_verified: boolean;
  verification_status: string;
  bio: string;
  age: number;
  gender: string;
  profession: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });

const profiles: SeedProfile[] = [
  { id: "e97e4f22-6c98-4d28-a1e0-3e2a9f6f0101", full_name: "Aarav Mehta", phone: "+91-9876543201", avatar_url: "https://i.pravatar.cc/300?img=11", is_verified: true, verification_status: "verified", bio: "Remote product designer who loves quiet mornings and tidy shared spaces.", age: 26, gender: "male", profession: "Product Designer" },
  { id: "e97e4f22-6c98-4d28-a1e0-3e2a9f6f0102", full_name: "Nisha Kulkarni", phone: "+91-9876543202", avatar_url: "https://i.pravatar.cc/300?img=5", is_verified: true, verification_status: "verified", bio: "MBA student at Symbiosis, usually out for classes till evening.", age: 23, gender: "female", profession: "Student" },
  { id: "e97e4f22-6c98-4d28-a1e0-3e2a9f6f0103", full_name: "Rohan Shetty", phone: "+91-9876543203", avatar_url: "https://i.pravatar.cc/300?img=12", is_verified: false, verification_status: "pending", bio: "Early-stage founder building a fintech startup, works hybrid.", age: 29, gender: "male", profession: "Startup Founder" },
  { id: "e97e4f22-6c98-4d28-a1e0-3e2a9f6f0104", full_name: "Priya Sharma", phone: "+91-9876543204", avatar_url: "https://i.pravatar.cc/300?img=16", is_verified: true, verification_status: "verified", bio: "Software engineer who enjoys cooking and weekend cycling.", age: 27, gender: "female", profession: "Software Engineer" },
  { id: "e97e4f22-6c98-4d28-a1e0-3e2a9f6f0105", full_name: "Aditya Verma", phone: "+91-9876543205", avatar_url: "https://i.pravatar.cc/300?img=21", is_verified: true, verification_status: "verified", bio: "UPSC aspirant seeking calm environment near metro connectivity.", age: 24, gender: "male", profession: "Student" },
  { id: "e97e4f22-6c98-4d28-a1e0-3e2a9f6f0106", full_name: "Sana Khan", phone: "+91-9876543206", avatar_url: "https://i.pravatar.cc/300?img=23", is_verified: false, verification_status: "pending", bio: "Digital marketer in Mumbai, loves social evenings but values cleanliness.", age: 25, gender: "female", profession: "Digital Marketer" },
  { id: "e97e4f22-6c98-4d28-a1e0-3e2a9f6f0107", full_name: "Karthik Iyer", phone: "+91-9876543207", avatar_url: "https://i.pravatar.cc/300?img=31", is_verified: true, verification_status: "verified", bio: "Data scientist who works US shifts and needs late-night flexibility.", age: 28, gender: "male", profession: "Data Scientist" },
  { id: "e97e4f22-6c98-4d28-a1e0-3e2a9f6f0108", full_name: "Meera Nair", phone: "+91-9876543208", avatar_url: "https://i.pravatar.cc/300?img=32", is_verified: true, verification_status: "verified", bio: "Interior stylist and freelance creator, often working from home.", age: 30, gender: "female", profession: "Freelancer" },
  { id: "e97e4f22-6c98-4d28-a1e0-3e2a9f6f0109", full_name: "Kabir Arora", phone: "+91-9876543209", avatar_url: "https://i.pravatar.cc/300?img=38", is_verified: true, verification_status: "verified", bio: "Consultant, neat and disciplined lifestyle with occasional guests.", age: 31, gender: "male", profession: "Management Consultant" },
  { id: "e97e4f22-6c98-4d28-a1e0-3e2a9f6f0110", full_name: "Ishita Rao", phone: "+91-9876543210", avatar_url: "https://i.pravatar.cc/300?img=44", is_verified: false, verification_status: "pending", bio: "Law student interning in Delhi courts, prefers vegetarian flatmates.", age: 22, gender: "female", profession: "Student" },
  { id: "e97e4f22-6c98-4d28-a1e0-3e2a9f6f0111", full_name: "Vikram Bansal", phone: "+91-9876543211", avatar_url: "https://i.pravatar.cc/300?img=45", is_verified: true, verification_status: "verified", bio: "Cloud architect and weekend trekker, values privacy and routine.", age: 32, gender: "male", profession: "Cloud Architect" },
  { id: "e97e4f22-6c98-4d28-a1e0-3e2a9f6f0112", full_name: "Ananya Das", phone: "+91-9876543212", avatar_url: "https://i.pravatar.cc/300?img=47", is_verified: true, verification_status: "verified", bio: "UX researcher relocating to Hyderabad for a new role.", age: 27, gender: "female", profession: "UX Researcher" }
];

const listings = [
  { user_id: profiles[0].id, title: "Sunny ensuite room in Indiranagar near 100ft Road", description: "Ideal for working professionals; fully ventilated with dedicated workspace.", locality: "Indiranagar", city: "Bengaluru", rent: 28000, deposit: 56000, room_type: "single", available_from: "2026-06-01", photos: ["https://placehold.co/800x500?text=Indiranagar+Room"], amenities: ["WiFi", "AC", "Washing Machine", "Power Backup"], gender_preference: "any", furnishing_status: "fully_furnished", latitude: 12.9719, longitude: 77.6412 },
  { user_id: profiles[1].id, title: "Girls shared flat close to Hinjawadi Phase 1", description: "Student-friendly setup with metro shuttle and cook available.", locality: "Hinjawadi", city: "Pune", rent: 12500, deposit: 25000, room_type: "shared", available_from: "2026-05-25", photos: ["https://placehold.co/800x500?text=Hinjawadi+Shared"], amenities: ["WiFi", "Geyser", "Parking"], gender_preference: "female", furnishing_status: "semi_furnished", latitude: 18.5912, longitude: 73.7389 },
  { user_id: profiles[2].id, title: "Startup-friendly 2BHK room in HSR Layout", description: "Quiet gated community, separate desk setup, pet-friendly building.", locality: "HSR Layout", city: "Bengaluru", rent: 22000, deposit: 40000, room_type: "single", available_from: "2026-06-10", photos: ["https://placehold.co/800x500?text=HSR+Layout"], amenities: ["WiFi", "AC", "Lift", "Gym"], gender_preference: "any", furnishing_status: "fully_furnished", latitude: 12.9116, longitude: 77.6474 },
  { user_id: profiles[3].id, title: "Private room in Powai with lake-view balcony", description: "Great for tech professionals working in SEEPZ/Powai campus.", locality: "Powai", city: "Mumbai", rent: 35000, deposit: 70000, room_type: "single", available_from: "2026-06-05", photos: ["https://placehold.co/800x500?text=Powai+Room"], amenities: ["WiFi", "AC", "Washing Machine", "Security"], gender_preference: "female", furnishing_status: "fully_furnished", latitude: 19.1176, longitude: 72.906 },
  { user_id: profiles[4].id, title: "Budget room for students near Mukherjee Nagar", description: "Walking distance to coaching centers and market.", locality: "Mukherjee Nagar", city: "Delhi", rent: 9800, deposit: 15000, room_type: "shared", available_from: "2026-05-20", photos: ["https://placehold.co/800x500?text=Mukherjee+Nagar"], amenities: ["WiFi", "RO Water", "Housekeeping"], gender_preference: "male", furnishing_status: "semi_furnished", latitude: 28.7012, longitude: 77.2073 },
  { user_id: profiles[5].id, title: "Sea breeze room in Andheri West near Versova", description: "Creative-friendly home with lively neighborhood and cafés nearby.", locality: "Andheri West", city: "Mumbai", rent: 30000, deposit: 60000, room_type: "single", available_from: "2026-06-15", photos: ["https://placehold.co/800x500?text=Andheri+West"], amenities: ["WiFi", "AC", "Fridge", "Washing Machine"], gender_preference: "any", furnishing_status: "fully_furnished", latitude: 19.1364, longitude: 72.8271 },
  { user_id: profiles[6].id, title: "Late-shift compatible room near Gachibowli IT park", description: "Independent room with blackout curtains and inverter backup.", locality: "Gachibowli", city: "Hyderabad", rent: 21000, deposit: 42000, room_type: "single", available_from: "2026-05-28", photos: ["https://placehold.co/800x500?text=Gachibowli"], amenities: ["WiFi", "Power Backup", "Parking", "Gym"], gender_preference: "any", furnishing_status: "semi_furnished", latitude: 17.4401, longitude: 78.3489 },
  { user_id: profiles[7].id, title: "Airy co-living style room in Koramangala 5th Block", description: "Great for freelancers and remote workers, close to cafés and coworking.", locality: "Koramangala", city: "Bengaluru", rent: 18500, deposit: 30000, room_type: "shared", available_from: "2026-06-08", photos: ["https://placehold.co/800x500?text=Koramangala"], amenities: ["WiFi", "Washing Machine", "Housekeeping", "CCTV"], gender_preference: "female", furnishing_status: "fully_furnished", latitude: 12.9345, longitude: 77.6113 },
  { user_id: profiles[8].id, title: "Consultant-ready room in Baner with parking", description: "Peaceful society, ideal for weekdays in office and weekend rest.", locality: "Baner", city: "Pune", rent: 24000, deposit: 48000, room_type: "single", available_from: "2026-06-02", photos: ["https://placehold.co/800x500?text=Baner+Room"], amenities: ["WiFi", "AC", "Parking", "Gym"], gender_preference: "any", furnishing_status: "fully_furnished", latitude: 18.559, longitude: 73.7868 },
  { user_id: profiles[9].id, title: "Law intern flatshare near Lajpat Nagar metro", description: "Safe neighborhood with quick metro access to central Delhi.", locality: "Lajpat Nagar", city: "Delhi", rent: 16500, deposit: 25000, room_type: "shared", available_from: "2026-05-30", photos: ["https://placehold.co/800x500?text=Lajpat+Nagar"], amenities: ["WiFi", "Geyser", "RO Water"], gender_preference: "female", furnishing_status: "semi_furnished", latitude: 28.5677, longitude: 77.2435 },
  { user_id: profiles[10].id, title: "Premium room in Banjara Hills with ensuite bath", description: "Perfect for senior professionals, quiet lane and high security.", locality: "Banjara Hills", city: "Hyderabad", rent: 42000, deposit: 90000, room_type: "single", available_from: "2026-06-18", photos: ["https://placehold.co/800x500?text=Banjara+Hills"], amenities: ["WiFi", "AC", "Lift", "Security", "Parking"], gender_preference: "any", furnishing_status: "fully_furnished", latitude: 17.4126, longitude: 78.4482 },
  { user_id: profiles[11].id, title: "Compact entire studio in Whitefield", description: "Move-in ready studio with modular kitchen and balcony.", locality: "Whitefield", city: "Bengaluru", rent: 44000, deposit: 88000, room_type: "entire_flat", available_from: "2026-06-12", photos: ["https://placehold.co/800x500?text=Whitefield+Studio"], amenities: ["WiFi", "AC", "Gym", "Clubhouse"], gender_preference: "any", furnishing_status: "fully_furnished", latitude: 12.9698, longitude: 77.75 }
];

const preferences = profiles.map((profile, index) => ({
  user_id: profile.id,
  sleep_time: index % 3 === 0 ? "early" : "late",
  cleanliness: (index % 5) + 1,
  guests_policy: ["never", "sometimes", "often"][index % 3],
  food_pref: ["veg", "nonveg", "both"][index % 3],
  smoking: index % 4 === 0 ? "yes" : "no",
  profession_type: profile.profession
}));

async function seed() {
  const { error: profileError } = await supabase.from("profiles").upsert(profiles, { onConflict: "id" });
  if (profileError) throw profileError;

  const { error: preferenceError } = await supabase.from("roommate_preferences").upsert(preferences, { onConflict: "user_id" });
  if (preferenceError) throw preferenceError;

  const userIds = profiles.map((profile) => profile.id);
  const { error: deleteListingsError } = await supabase.from("listings").delete().in("user_id", userIds);
  if (deleteListingsError) throw deleteListingsError;

  const { error: listingError } = await supabase.from("listings").insert(listings);
  if (listingError) throw listingError;

  console.log("Seeded profiles, roommate_preferences, and listings successfully.");
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
